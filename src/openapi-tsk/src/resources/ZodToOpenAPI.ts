import { ClassProperty, PropTypeEnum, PropFormatEnum, OpenAPISchema } from "./types";
import {
  ZodTypeAny,
  ZodObject,
  ZodString,
  ZodOptional,
  ZodArray,
  ZodNumber,
  ZodBoolean,
  ZodEnum,
  ZodLiteral,
  ZodNullable,
} from "zod";

export class ZodToOpenAPI {
  private static convertString(schema: ZodString): ClassProperty {
    const stringSchema: ClassProperty = { type: PropTypeEnum.STRING };

    if (schema._def.checks) {
      for (const check of schema._def.checks) {
        if (check.kind === "min") {
          stringSchema.minimum = check.value;
        } else if (check.kind === "max") {
          stringSchema.maximum = check.value;
        } else if (check.kind === "email") {
          stringSchema.format = PropFormatEnum.EMAIL;
        } else if (check.kind === "url") {
          stringSchema.format = PropFormatEnum.URI;
        } else if (check.kind === "uuid") {
          stringSchema.format = PropFormatEnum.UUID;
        }
      }
    }

    return stringSchema;
  }

  private static convertNumber(schema: ZodNumber): ClassProperty {
    const numberSchema: ClassProperty = { type: PropTypeEnum.NUMBER };

    if (schema._def.checks) {
      for (const check of schema._def.checks) {
        if (check.kind === "min") {
          numberSchema.minimum = check.value;
        } else if (check.kind === "max") {
          numberSchema.maximum = check.value;
        }
      }
    }

    return numberSchema;
  }

  private static convertArray(schema: ZodArray<any>): ClassProperty {
    return {
      type: PropTypeEnum.ARRAY,
      items: this.convert(schema._def.type),
    };
  }

  private static convertEnum(schema: ZodEnum<any>): ClassProperty {
    return {
      type: PropTypeEnum.STRING,
      enum: schema._def.values,
    };
  }

  private static convertLiteral(schema: ZodLiteral<any>): ClassProperty {
    return {
      type: typeof schema._def.value as PropTypeEnum,
      enum: [schema._def.value],
    };
  }

  private static convert(schema: ZodTypeAny): ClassProperty {
    if (!schema?._def) {
      throw new Error("Zod Schema is undefined or null");
    }

    if (schema instanceof ZodString || schema._def.typeName === "ZodString") {
      return this.convertString(schema as ZodString);
    }

    if (schema instanceof ZodNumber || schema._def.typeName === "ZodNumber") {
      return this.convertNumber(schema as ZodNumber);
    }

    if (schema instanceof ZodBoolean || schema._def.typeName === "ZodBoolean") {
      return { type: PropTypeEnum.BOOLEAN };
    }

    if (schema instanceof ZodArray || schema._def.typeName === "ZodArray") {
      return this.convertArray(schema as ZodArray<any>);
    }

    if (schema instanceof ZodEnum || schema._def.typeName === "ZodEnum") {
      return this.convertEnum(schema as ZodEnum<any>);
    }

    if (schema instanceof ZodLiteral || schema._def.typeName === "ZodLiteral") {
      return this.convertLiteral(schema as ZodLiteral<any>);
    }

    if (schema instanceof ZodOptional || schema._def.typeName === "ZodOptional") {
      return this.convert(schema._def.innerType as ZodTypeAny);
    }

    if (schema instanceof ZodNullable || schema._def.typeName === "ZodNullable") {
      const nullableSchema = this.convert(schema._def.innerType as ZodTypeAny);
      return { ...nullableSchema, nullable: true };
    }

    throw new Error(`Unsupported Zod type: ${schema.constructor.name}`);
  }

  static transform(zodSchema: ZodObject<any>): OpenAPISchema {
    if (!zodSchema?.shape) {
      throw new Error(
        "ZodToOpenAPI only accepts ZodObject as input. Please provide a valid ZodObject.",
      );
    }

    const properties: Record<string, ClassProperty> = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(zodSchema.shape)) {
      const propertySchema = this.convert(value as ZodTypeAny);

      if (
        !(
          value instanceof ZodOptional ||
          (value as ZodTypeAny)._def.typeName === "ZodOptional" ||
          value instanceof ZodNullable ||
          (value as ZodTypeAny)._def.typeName === "ZodNullable"
        )
      ) {
        propertySchema.required = true;
        required.push(key);
      } else {
        propertySchema.required = false;
      }
      properties[key] = propertySchema;
    }

    return {
      type: PropTypeEnum.OBJECT,
      properties,
      ...(required.length > 0 && { required }),
    };
  }
}
