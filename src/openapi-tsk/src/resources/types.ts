export enum PropTypeEnum {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  OBJECT = "object",
  ARRAY = "array",
  DATE = "date",
  NULL = "null",
  UNDEFINED = "undefined",
  PRIMITIVE = "primitive",
}

export enum PropFormatEnum {
  INT_64 = "int64",
  INT_32 = "int32",
  FLOAT = "float",
  DATE_TIME = "date-time",
  DATE = "date",
  TIME = "time",
  EMAIL = "email",
  URI = "uri",
  UUID = "uuid",
  PASSWORD = "password",
  TEXT = "text",
  BASE64 = "base64",
}

export type ClassProperty = {
  type: PropTypeEnum;
  format?: PropFormatEnum;
  nullable?: boolean;
  readonly?: boolean;
  required?: boolean;
  minimum?: number;
  maximum?: number;
  items?: { type: PropTypeEnum };
  $ref?: string;
};
