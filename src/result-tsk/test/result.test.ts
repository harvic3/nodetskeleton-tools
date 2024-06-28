import { Result, ResultT } from "../src/index";
import { ResultDto } from "../src/ResultDto";
import { Person } from "./Person";

describe("when use a result", () => {
  it("it must allow the use of the not generic type class", () => {
    const result = new Result();
    expect(result.message).toBeUndefined();
    expect(result.error).toBeUndefined();
    const resultDto: ResultDto = result.toResultDto();
    expect(resultDto.message).toBeUndefined();
    expect(resultDto.error).toBeUndefined();
  });
  it("if a message is added, the error must be undefined and success must be true", () => {
    const result = new Result();
    result.setMessage("Entity was created.", 201);
    expect(result.message).toBe("Entity was created.");
    expect(result.error).toBeUndefined();
    expect(result.success).toBeTruthy();
    expect(result.statusCode).toBe(201);
    const resultDto: ResultDto = result.toResultDto();
    expect(resultDto.message).toBe("Entity was created.");
    expect(resultDto.error).toBeUndefined();
  });
  it("if a error is added, the message must be undefined and success must be false", () => {
    const result = new Result();
    result.setError("Something went wrong.", 500);
    expect(result.message).toBeUndefined();
    expect(result.error).toBe("Something went wrong.");
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(500);
    const resultDto: ResultDto = result.toResultDto();
    expect(resultDto.message).toBeUndefined();
    expect(resultDto.error).toBe("Something went wrong.");
  });
  it("if a error is added with string number, the message must be undefined and success must be false", () => {
    const result = new Result();
    result.setError("Something went wrong.", "001");
    expect(result.message).toBeUndefined();
    expect(result.error).toBe("Something went wrong.");
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe("001");
    const resultDto: ResultDto = result.toResultDto();
    expect(resultDto.message).toBeUndefined();
    expect(resultDto.error).toBe("Something went wrong.");
  });
  it("it must allow the use of the not generic type class", () => {
    const result = new ResultT<Person>();
    expect(result.message).toBeUndefined();
    expect(result.error).toBeUndefined();
  });
  it("if a message is added, the error must be undefined and success must be true", () => {
    const result = new ResultT<Person>();
    result.setMessage("Entity was created.", 201);
    expect(result.message).toBe("Entity was created.");
    expect(result.error).toBeUndefined();
    expect(result.success).toBeTruthy();
    expect(result.statusCode).toBe(201);
  });
  it("if a message is added with string statusCode, the error must be undefined and success must be true", () => {
    const result = new ResultT<Person>();
    result.setMessage("Entity was created.", "201");
    expect(result.message).toBe("Entity was created.");
    expect(result.error).toBeUndefined();
    expect(result.success).toBeTruthy();
    expect(result.statusCode).toBe("201");
  });
  it("if a error is added, the message must be undefined and success must be false", () => {
    const result = new ResultT<Person>();
    result.setError("Something went wrong.", 500);
    expect(result.message).toBeUndefined();
    expect(result.error).toBe("Something went wrong.");
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(500);
    expect(result.data).toBeUndefined();
  });
  it("it must allow the use of the generic type class with object data", () => {
    const result = new ResultT<Person>();
    const person = new Person("Jhon", "Doe", 17);
    result.setData(person, 200);
    expect(result.success).toBeTruthy();
    expect(result.data).toBeInstanceOf(Person);
    expect(result.message).toBeUndefined();
    expect(result.error).toBeUndefined();
    expect(result.statusCode).toBe(200);
    const resultDto: ResultDto = result.toResultDto();
    expect(resultDto.data).not.toBeNull();
    expect(resultDto.error).toBeUndefined();
    expect(resultDto.message).toBeUndefined();
  });
  it("it must allow the use of the generic type class with object data and message", () => {
    const result = new ResultT<Person>();
    const person = new Person("Jhon", "Doe", 17);
    result.setData(person, 200);
    result.setMessage("Entity was created.", 200);
    expect(result.success).toBeTruthy();
    expect(result.data).toBeInstanceOf(Person);
    expect(result.message).toBe("Entity was created.");
    expect(result.error).toBeUndefined();
    expect(result.statusCode).toBe(200);
    const resultDto: ResultDto = result.toResultDto();
    expect(resultDto.data).not.toBeNull();
    expect(resultDto.error).toBeUndefined();
    expect(resultDto.message).toBe("Entity was created.");
  });
  it("it must allow the use of the generic type class with object data, message and set metadata", () => {
    const result = new ResultT<Person>();
    const person = new Person("Jhon", "Doe", 17);
    result.setData(person, 200);
    result.setMessage("Entity was created.", 200);
    result.setMetadata({ metaKey1: "meta-value1", metaKey2: "meta-value2" });
    expect(result.success).toBeTruthy();
    expect(result.data).toBeInstanceOf(Person);
    expect(result.message).toBe("Entity was created.");
    expect(result.error).toBeUndefined();
    expect(result.statusCode).toBe(200);
    expect(result.getMetadata()).not.toBeNull();
    expect(result.getMetadata()["metaKey1"]).not.toBeNull();

    const resultDto: ResultDto = result.toResultDto();
    expect(resultDto.data).not.toBeNull();
    expect(resultDto.error).toBeUndefined();
    expect(resultDto.message).toBe("Entity was created.");
  });
  it("it must allow the use of the generic type class with object data, message and add metadata", () => {
    const result = new ResultT<Person>();
    const person = new Person("Jhon", "Doe", 17);
    result.setData(person, 200);
    result.setMessage("Entity was created.", 200);
    result.addMetadata("metaKey1", "meta-value1");
    result.addMetadata("metaKey2", "meta-value2");
    expect(result.success).toBeTruthy();
    expect(result.data).toBeInstanceOf(Person);
    expect(result.message).toBe("Entity was created.");
    expect(result.error).toBeUndefined();
    expect(result.statusCode).toBe(200);
    expect(result.getMetadata()).not.toBeNull();
    expect(result.getMetadata()["metaKey1"]).not.toBeNull();

    const resultDto: ResultDto = result.toResultDto();
    expect(resultDto.data).not.toBeNull();
    expect(resultDto.error).toBeUndefined();
    expect(resultDto.message).toBe("Entity was created.");
  });
});
