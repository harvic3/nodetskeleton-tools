import {
  ApiDoc,
  IApiDocGenerator,
  ApiDocRouteType,
  SecurityScheme,
  UrlParamDescriber,
  SchemeDescription,
} from "../resources/IApiDocGenerator";
import { SecuritySchemesStore } from "../resources/SecuritySchemesStore";
import httpStatusDescriber from "../resources/httpStatusDescriber";
import { PropFormatEnum, PropTypeEnum } from "../resources/types";
import { SchemasStore } from "../resources/SchemasStore";
import { StringUtil } from "../resources/StringUtil";
import { join, resolve } from "path";
import { writeFileSync } from "fs";

type SchemaType =
  | { type?: PropTypeEnum }
  | { $ref?: string }
  | { type?: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY; items?: { $ref: string } };

type RequestBodyType = {
  description?: string;
  required?: boolean;
  content: Record<string, { schema: { $ref: string } }>;
};

type OpenApiType = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
    contact: {
      name: string;
      url: string;
      email: string;
    };
    license: {
      name: string;
    };
  };
  servers: { url: string; description: string }[];
  paths: Record<
    string,
    Record<
      string,
      {
        tags?: string[];
        description: string;
        responses: Record<
          string,
          {
            description?: string;
            content: Record<
              string,
              {
                schema: SchemaType;
              }
            >;
          }
        >;
        requestBody: RequestBodyType;
        parameters: UrlParamDescriber[];
        security: Record<string, any[]>[];
      }
    >
  >;
  components: {
    schemas: Record<
      string,
      { type: string; properties: { type: PropTypeEnum; format: PropFormatEnum } }
    >;
    securitySchemes?: Record<string, SecurityScheme>;
  };
};

export class ApiDocGenerator implements IApiDocGenerator {
  #apiRootPath = "/api";

  apiDoc: OpenApiType = {
    openapi: "3.0.3",
    info: {
      title: StringUtil.EMPTY,
      version: StringUtil.EMPTY,
      description: StringUtil.EMPTY,
      contact: {
        name: StringUtil.EMPTY,
        url: StringUtil.EMPTY,
        email: StringUtil.EMPTY,
      },
      license: {
        name: "BSD 3-Clause",
      },
    },
    servers: [],
    paths: {},
    components: {
      schemas: {},
    },
  };

  constructor(
    readonly env: string,
    info: {
      title: string;
      version: string;
      description: string;
      contact: {
        name: string;
        url: string;
        email: string;
      };
      license: {
        name: string;
      };
    },
  ) {
    this.apiDoc.info.title = info.title;
    this.apiDoc.info.version = info.version;
    this.apiDoc.info.description = info.description;
    this.apiDoc.info.contact = info.contact;
    this.apiDoc.info.license = info.license;

    this.setSchemas(SchemasStore.get());
    this.setSchemasSecurity(SecuritySchemesStore.get());
  }

  private setSchemas(schemas: Record<string, any>): void {
    this.apiDoc.components.schemas = schemas;
  }

  private setSchemasSecurity(securitySchemes: Record<string, SecurityScheme>): void {
    this.apiDoc.components.securitySchemes = securitySchemes;
  }

  private buildParameters(
    path: string,
    parameters: UrlParamDescriber[],
  ): UrlParamDescriber[] | [] {
    if (!parameters.length) return [];

    const parameterNamesInPath = path.match(/(?<=\/:)\w+/g);
    if (parameterNamesInPath?.length) {
      const everyParameterInPathIsInParameters = parameterNamesInPath.every(
        (parameterName) =>
          parameters.find((parameter) => parameter.name === parameterName),
      );
      if (!everyParameterInPathIsInParameters) {
        console.warn(
          `Path ${path} has parameters in path that are not defined in parameters array.`,
        );
      }
    }

    return parameters;
  }

  private buildSchema(scheme: SchemeDescription): SchemaType {
    const schemaToSet: {
      type?: PropTypeEnum;
      items?: { type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY; $ref: string };
      $ref?: string;
    } = {
      type: PropTypeEnum.OBJECT,
      items: { type: PropTypeEnum.OBJECT, $ref: StringUtil.EMPTY },
      $ref: StringUtil.EMPTY,
    };

    if (scheme.type === PropTypeEnum.ARRAY) {
      schemaToSet.items = {
        type: scheme.type,
        $ref: `#/components/schemas/${scheme.schema.name}`,
      };
      delete schemaToSet.type;
      delete schemaToSet.$ref;
    } else if (scheme.type === PropTypeEnum.OBJECT) {
      schemaToSet.$ref = `#/components/schemas/${scheme.schema.name}`;
      delete schemaToSet.type;
      delete schemaToSet.items;
    } else {
      schemaToSet.type = scheme.type;
      delete schemaToSet.items;
      delete schemaToSet.$ref;
    }

    return schemaToSet;
  }

  private buildRequestBody(requestBody: ApiDoc["requestBody"]): RequestBodyType {
    return {
      description: requestBody?.description,
      required: requestBody?.required,
      content: {
        [requestBody?.contentType as string]: {
          schema: { $ref: `#/components/schemas/${requestBody?.scheme.schema.name}` },
        },
      },
    };
  }

  private filterNonElegibleTags(tags: string[]): string[] {
    if (!tags.length) return [];

    const noElegibleTags: { value: string | RegExp; regexType: boolean }[] = [
      { value: "api", regexType: false },
      { value: /v[0-9]+/, regexType: true },
    ];
    return tags.filter(
      (tag) =>
        !noElegibleTags.some((noElegibleTag) =>
          noElegibleTag.regexType
            ? (noElegibleTag.value as RegExp).test(tag)
            : noElegibleTag.value === tag,
        ),
    );
  }

  private getTagFromPath(path: string): string[] {
    const tags: string[] = [];
    const relativePath = path.replace(this.#apiRootPath, "");

    const pathSegments = this.filterNonElegibleTags(
      relativePath.split("/").filter(Boolean),
    );
    if (pathSegments.length) {
      tags.push(StringUtil.capitalize(pathSegments[0]));
    } else {
      tags.push("Default");
    }

    return tags;
  }

  setApiRootPath(path: string): void {
    this.#apiRootPath = path;
  }

  saveApiDoc(dirName: string, filePath: string): this {
    const wasDocGenerated = Object.keys(this.apiDoc.paths).length;
    if (!wasDocGenerated) return this;

    filePath = resolve(join(dirName, filePath));
    writeFileSync(filePath, JSON.stringify(this.apiDoc, null, 2), "utf8");

    return this;
  }

  createRouteDoc(route: ApiDocRouteType): void {
    const { produces, method, description, apiDoc } = route;
    if (!apiDoc) return;

    let path = route.path;
    const { requestBody, parameters, securitySchemes } = apiDoc;

    if (path.includes(":")) path = path.replaceAll(/:(\w+)/g, "{$1}");
    if (!this.apiDoc.paths[path]) {
      this.apiDoc.paths[path] = {};
    }

    if (!this.apiDoc.paths[path][method]) {
      this.apiDoc.paths[path][method] = {
        description: description,
        tags: this.getTagFromPath(path),
      } as any;
      this.apiDoc.paths[path][method].responses = {};
      if (requestBody) this.apiDoc.paths[path][method].requestBody = {} as any;
      if (parameters) this.apiDoc.paths[path][method].parameters = [];
    }

    produces.forEach(({ httpStatus, model }) => {
      if (!model) return;

      const { contentType, scheme } = model;
      this.apiDoc.paths[path][method].responses[httpStatus.toString()] = {
        description: httpStatusDescriber[httpStatus],
        content: {
          [contentType]: {
            schema: this.buildSchema(scheme),
          },
        },
      };
    });

    if (requestBody) {
      this.apiDoc.paths[path][method].requestBody = this.buildRequestBody(requestBody);
    }
    if (parameters) {
      this.apiDoc.paths[path][method].parameters = this.buildParameters(path, parameters);
    }

    if (securitySchemes) {
      const securityKeys = Object.keys(securitySchemes);
      this.apiDoc.paths[path][method].security = securityKeys.map((key) => ({
        [key]: [],
      }));
    }
  }

  addServerUrl(url: string, description: string): void {
    this.apiDoc.servers.push({
      url,
      description,
    });
  }

  finish(): void {
    SchemasStore.dispose();
    SecuritySchemesStore.dispose();
  }
}
