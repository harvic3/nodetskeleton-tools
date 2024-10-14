import { RefTypeDescriber, TypeDescriber } from "./TypeDescriber";
import { HttpContentTypeEnum } from "./HttpContentTypeEnum";
import { PropFormatEnum, PropTypeEnum } from "./types";
import { HttpMethodEnum } from "./HttpMethodEnum";
import { HttpStatusEnum } from "./HttpStatusEnum";

type ParamScheme = {
  type: PropTypeEnum;
  format?: PropFormatEnum;
}

export enum ParameterIn {
  QUERY = "query",
  HEADER = "header",
  PATH = "path",
  COOKIE = "cookie",
}

export type UrlParamDescriber = {
  name: string;
  in: ParameterIn;
  description: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  schema: ParamScheme;
};

export type SecuritySchemeType = "http" | "apiKey" | "oauth2" | "openIdConnect" | "mutualTLS";

type BaseSecurityScheme = {
  type: SecuritySchemeType;
  description: string;
};

/**
 * name: apiKey name
 */
type ApiKeySecurityScheme = {
  type: "apiKey";
  name: string;
  in: "query" | "header" | "cookie";
} & BaseSecurityScheme;

type HttpSecurityScheme = {
  type: "http";
  scheme: "bearer";
  bearerFormat: "bearer" | "JWT";
} & BaseSecurityScheme;

type OAuth2SecurityScheme = {
  type: "oauth2";
  flows: {
    implicit?: {
      authorizationUrl: string;
      scopes: Record<string, string>;
    };
    password?: {
      tokenUrl: string;
      scopes: Record<string, string>;
    };
    clientCredentials?: {
      tokenUrl: string;
      scopes: Record<string, string>;
    };
    authorizationCode?: {
      authorizationUrl: string;
      tokenUrl: string;
      scopes: Record<string, string>;
    };
  };
} & BaseSecurityScheme;

type OpenIdSecurityScheme = {
  type: "openIdConnect";
  description: string;
  openIdConnectUrl: string;
};

export type SecurityScheme =
  | ApiKeySecurityScheme
  | HttpSecurityScheme
  | OAuth2SecurityScheme
  | OpenIdSecurityScheme;

export type SchemeDescription = TypeDescriber<any> | RefTypeDescriber;

export type ApiDoc = {
  requireAuth: boolean;
  requestBody?: {
    required: boolean;
    contentType: HttpContentTypeEnum;
    description: string;
    scheme: SchemeDescription;
  };
  parameters?: UrlParamDescriber[];
  securitySchemes?: Record<string, SecurityScheme>;
};

export type ApiProduce = {
  applicationStatus: string;
  httpStatus: HttpStatusEnum;
  model?: {
    contentType: HttpContentTypeEnum;
    scheme: SchemeDescription;
  };
}

export type ApiDocRouteType = {
  method: HttpMethodEnum;
  path: string;
  produces: ApiProduce[];
  description?: string;
  apiDoc?: ApiDoc;
  security?: Record<string, any[]>;
};

export interface IApiDocGenerator {
  createRouteDoc(route: ApiDocRouteType): void;
}
