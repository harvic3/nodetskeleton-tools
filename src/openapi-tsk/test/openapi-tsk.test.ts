import { z } from "zod";
import { ZodToOpenAPI } from "../src/resources/ZodToOpenAPI";

describe("ZodToOpenAPI", () => {
  it("should convert a simple Zod object schema to OpenAPI schema", () => {
    const zodSchema = z.object({
      uid: z.string().nonempty(),
      firstName: z.string().min(2),
      email: z.string().email(),
    });

    const openAPISchema = ZodToOpenAPI.transform(zodSchema);

    expect(openAPISchema).toEqual({
      type: "object",
      properties: {
        uid: { type: "string", required: true, minimum: 1 },
        firstName: { type: "string", required: true, minimum: 2 },
        email: { type: "string", required: true, format: "email" },
      },
      required: ["uid", "firstName", "email"],
    });
  });

  it("should handle optional fields correctly", () => {
    const zodSchema = z.object({
      uid: z.string().nonempty(),
      lastName: z.string().optional(),
    });

    const openAPISchema = ZodToOpenAPI.transform(zodSchema);

    expect(openAPISchema).toEqual({
      type: "object",
      properties: {
        uid: { type: "string", required: true, minimum: 1 },
        lastName: { type: "string", required: false },
      },
      required: ["uid"],
    });
  });

  it("should handle nullable fields correctly", () => {
    const zodSchema = z.object({
      nullableField: z.string().nullable(),
    });

    const openAPISchema = ZodToOpenAPI.transform(zodSchema);

    expect(openAPISchema).toEqual({
      type: "object",
      properties: {
        nullableField: { type: "string", nullable: true, required: false },
      },
    });
  });

  it("should convert enums to OpenAPI schema", () => {
    const zodSchema = z.object({
      status: z.enum(["active", "inactive"]),
    });

    const openAPISchema = ZodToOpenAPI.transform(zodSchema);

    expect(openAPISchema).toEqual({
      type: "object",
      properties: {
        status: { type: "string", enum: ["active", "inactive"], required: true },
      },
      required: ["status"],
    });
  });

  it("should convert Dates to OpenAPI schema", () => {
    const zodSchema = z.object({
      createdAt: z.date(),
      updatedAt: z.date().optional(),
    });

    const openAPISchema = ZodToOpenAPI.transform(zodSchema);

    expect(openAPISchema).toEqual({
      type: "object",
      properties: {
        createdAt: { type: "string", format: "date", required: true },
        updatedAt: { type: "string", format: "date", required: false },
      },
      required: ["createdAt"],
    });
  });

  it("should convert arrays to OpenAPI schema", () => {
    const zodSchema = z.object({
      tags: z.array(z.string()),
    });

    const openAPISchema = ZodToOpenAPI.transform(zodSchema);

    expect(openAPISchema).toEqual({
      type: "object",
      properties: {
        tags: { type: "array", items: { type: "string" }, required: true },
      },
      required: ["tags"],
    });
  });

  it("should convert numbers with constraints to OpenAPI schema", () => {
    const zodSchema = z.object({
      age: z.number().min(18).max(99),
    });

    const openAPISchema = ZodToOpenAPI.transform(zodSchema);

    expect(openAPISchema).toEqual({
      type: "object",
      properties: {
        age: { type: "number", minimum: 18, maximum: 99, required: true },
      },
      required: ["age"],
    });
  });

  it("should throw an error for unsupported Zod types", () => {
    const zodSchema = z.object({
      unsupported: z.unknown(),
    });

    expect(() => ZodToOpenAPI.transform(zodSchema)).toThrow(
      "Unsupported Zod type: ZodUnknown",
    );
  });

  it("should handle complex schemas with mixed types", () => {
    const zodSchema = z.object({
      uid: z.string().nonempty(),
      firstName: z.string().min(2),
      lastName: z.string().optional(),
      email: z.string().email(),
      phoneNumber: z.string().min(10).optional(),
      status: z.enum(["active", "inactive"]),
      age: z.number().min(18),
      isVerified: z.boolean(),
      metadata: z.array(z.string()),
      nullableField: z.string().nullable(),
    });

    const openAPISchema = ZodToOpenAPI.transform(zodSchema);

    expect(openAPISchema).toEqual({
      type: "object",
      properties: {
        uid: { type: "string", minimum: 1, required: true },
        firstName: { type: "string", minimum: 2, required: true },
        lastName: { type: "string", required: false },
        email: { type: "string", format: "email", required: true },
        phoneNumber: { type: "string", minimum: 10, required: false },
        status: { type: "string", enum: ["active", "inactive"], required: true },
        age: { type: "number", minimum: 18, required: true },
        isVerified: { type: "boolean", required: true },
        metadata: { type: "array", items: { type: "string" }, required: true },
        nullableField: { type: "string", nullable: true, required: false },
      },
      required: ["uid", "firstName", "email", "status", "age", "isVerified", "metadata"],
    });
  });

  it("should convert a Zod object schema with optional and required fields to OpenAPI schema", () => {
    const zodSchema = z.object({
      name: z.string().nonempty(),
      lastName: z.string().nonempty(),
      userName: z.string().optional(),
      email: z.string().email(),
      password: z.string().optional(),
      authId: z.string().optional(),
    });

    const openAPISchema = ZodToOpenAPI.transform(zodSchema);

    expect(openAPISchema).toEqual({
      type: "object",
      properties: {
        name: { type: "string", minimum: 1, required: true },
        lastName: { type: "string", minimum: 1, required: true },
        userName: { type: "string", required: false },
        email: { type: "string", format: "email", required: true },
        password: { type: "string", required: false },
        authId: { type: "string", required: false },
      },
      required: ["name", "lastName", "email"],
    });
  });
});
