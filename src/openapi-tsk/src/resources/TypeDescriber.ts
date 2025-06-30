import {
  SecurityScheme,
  SecuritySchemeType,
  UrlParamDescriber,
} from "./IApiDocGenerator";
import { ClassProperty, PropFormatEnum, PropTypeEnum, ZodObject } from "./types";
import { SecuritySchemesStore } from "./SecuritySchemesStore";
import { MetadataClass } from "./MetadataClass";
import { SchemasStore } from "./SchemasStore";
import "reflect-metadata";
import { ZodToOpenAPI } from "./ZodToOpenAPI";

type Primitive =
  | PropTypeEnum.STRING
  | PropTypeEnum.NUMBER
  | PropTypeEnum.BOOLEAN
  | PropTypeEnum.NULL
  | PropTypeEnum.UNDEFINED;
type PrimitiveDefinition = { primitive: Primitive; format?: PropFormatEnum };

export class TypeDescriber<T> {
  readonly type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY | PropTypeEnum.PRIMITIVE;
  readonly properties:
    | Record<keyof T, ClassProperty | TypeDescriber<any> | { $ref: string }>
    | PrimitiveDefinition;
  readonly schema: {
    name: string;
    type: PropTypeEnum;
    required?: string[];
    properties: Record<string, ClassProperty> | { type: PropTypeEnum };
  };
  static readonly referenceSchemas: Record<
    string,
    {
      type: PropTypeEnum;
      properties: Record<string, ClassProperty> | { $ref: string };
      required?: string[];
    }
  > = {};

  constructor(obj: {
    name: string;
    type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY | PropTypeEnum.PRIMITIVE;
    props:
      | Record<keyof T, ClassProperty | TypeDescriber<any> | { $ref: string }>
      | PrimitiveDefinition;
  }) {
    this.type = obj.type;
    this.properties = obj.props;
    const props: Record<string, ClassProperty> = {};
    Object.entries(obj.props).forEach(([key, value]) => {
      props[key] = value as ClassProperty;
    });
    this.schema = {
      name: obj.name,
      type: obj.type,
      required: [],
      properties: {},
    };

    if (this.type === PropTypeEnum.PRIMITIVE) {
      this.type = (this.properties as PrimitiveDefinition).primitive as any;
      return;
    }

    if (!Object.keys(props).length) return;

    const schemaType: Record<string, ClassProperty> = {};
    Object.keys(props).forEach((key) => {
      if (props[key].type) {
        schemaType[key] = {
          type: props[key].type,
          nullable: props[key].nullable ?? false,
        };
        if (props[key].format) schemaType[key].format = props[key].format;
        if (props[key].minimum) schemaType[key].minimum = props[key].minimum;
        if (props[key].maximum) schemaType[key].maximum = props[key].maximum;
        if (props[key].required) this.schema.required?.push(key);
      } else if (props[key].$ref) {
        schemaType[key] = {
          $ref: props[key].$ref,
        } as ClassProperty;
      }
    });

    this.schema.properties = schemaType;

    SchemasStore.add(this.schema.name, {
      type: this.schema.type,
      properties: this.schema.properties,
      required: this.schema.required,
    });

    Object.entries(TypeDescriber.referenceSchemas).forEach(([key, value]) => {
      SchemasStore.add(key, value);
    });
  }

  static describePrimitive(
    primitive: Primitive,
    format?: PropFormatEnum,
  ): PrimitiveDefinition {
    return format ? { primitive, format } : { primitive };
  }

  static describeUrlParam(param: UrlParamDescriber): UrlParamDescriber {
    if (!param.required) param.required = true;
    if (!param.allowEmptyValue) param.allowEmptyValue = false;
    if (!param.deprecated) param.deprecated = false;

    return param;
  }

  static describeProps<T>(
    input: Record<keyof T, ClassProperty | PropTypeEnum | { $ref: string }>,
  ): Record<keyof T, ClassProperty | TypeDescriber<any>> {
    const props: Record<string, ClassProperty | { $ref: string }> = {};
    const instance = new MetadataClass<T>(input);
    const keys = Object.keys(instance);
    keys.forEach((key) => {
      const metadata = MetadataClass.getPropMetadata(instance, key);
      props[key] = metadata;
    });

    return props as Record<keyof T, ClassProperty | TypeDescriber<any>>;
  }

  static describeReference<T>(
    name: string,
    input: Record<keyof T, any>,
  ): { $ref: string } {
    this.referenceSchemas[name] = {
      type: PropTypeEnum.OBJECT,
      properties: this.describeProps(input),
    };

    return { $ref: "#/components/schemas/".concat(name) };
  }

  static describeArrayReference<T>(
    name: string,
    input: Record<keyof T, any>,
  ): { $ref: string } {
    this.referenceSchemas[name] = {
      type: PropTypeEnum.ARRAY,
      properties: this.describeProps(input),
    };

    return { $ref: "#/components/schemas/".concat(name) };
  }

  static describeZodObject(
    name: string,
    zodObject: ZodObject<any>,
    type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY = PropTypeEnum.OBJECT,
  ): TypeDescriber<any> {
    const openApiSchema = ZodToOpenAPI.transform(zodObject);

    return new TypeDescriber<any>({
      name,
      type,
      props: openApiSchema.properties as Record<keyof any, ClassProperty>,
    });
  }
}

export class RefTypeDescriber {
  readonly type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY;
  readonly schema: {
    name: string;
    definition:
      | { $ref?: string }
      | { type: PropTypeEnum.ARRAY; items?: { $ref: string } };
  };

  constructor(obj: { type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY; name: string }) {
    this.type = obj.type;
    this.schema = {
      name: obj.name,
      definition: {},
    };

    if (this.type === PropTypeEnum.ARRAY) {
      this.schema = {
        name: obj.name,
        definition: {
          type: PropTypeEnum.ARRAY,
          items: { $ref: "#/components/schemas/".concat(obj.name) },
        },
      };
    } else {
      this.schema = {
        name: obj.name,
        definition: { $ref: "#/components/schemas/".concat(obj.name) },
      };
    }
  }
}

export class SecuritySchemesDescriber {
  static readonly HTTP = "http";
  static readonly API_KEY = "apiKey";
  static readonly OAUTH2 = "oauth2";
  static readonly OPEN_ID_CONNECT = "openIdConnect";
  static readonly MUTUAL_TLS = "mutualTLS";

  [key: string]: SecurityScheme;

  constructor(key: SecuritySchemeType, securitySchemes: SecurityScheme) {
    this[key] = securitySchemes;
    SecuritySchemesStore.add(key, securitySchemes);
  }

  static defaultHttpBearer(): SecurityScheme {
    return {
      type: "http",
      description: "Bearer token",
      scheme: "bearer",
      bearerFormat: "JWT",
    };
  }

  static defaultHttpApiKey(
    apiKeyName: string,
    into: "query" | "header" | "cookie",
  ): SecurityScheme {
    return {
      type: "apiKey",
      description: "Api key",
      name: apiKeyName,
      in: into,
    };
  }
}
