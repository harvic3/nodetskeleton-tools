import { Result, ResultT } from "../src/index";
import { Person } from "./Person";
import { ResultDto } from "../src/ResultDto";

describe("when use a result", () => {
  it("it must allow the use of the not generic type class", () => {
    const result = new Result();
    expect(result.message).toBeUndefined();
    expect(result.error).toBeUndefined();
    const resultDto: ResultDto = result.ToResultDto();
    expect(resultDto.message).toBeUndefined();
    expect(resultDto.error).toBeUndefined();
  });
  it("if a message is added, the error must be undefined and success must be true", () => {
    const result = new Result();
    result.SetMessage("Entity was created.", 201);
    expect(result.message).toBe("Entity was created.");
    expect(result.error).toBeUndefined();
    expect(result.success).toBeTruthy();
    expect(result.statusCode).toBe(201);
    const resultDto: ResultDto = result.ToResultDto();
    expect(resultDto.message).toBe("Entity was created.");
    expect(resultDto.error).toBeUndefined();
  });
  it("if a error is added, the message must be undefined and success must be false", () => {
    const result = new Result();
    result.SetError("Something went wrong.", 500);
    expect(result.message).toBeUndefined();
    expect(result.error).toBe("Something went wrong.");
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(500);
    const resultDto: ResultDto = result.ToResultDto();
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
    result.SetMessage("Entity was created.", 201);
    expect(result.message).toBe("Entity was created.");
    expect(result.error).toBeUndefined();
    expect(result.success).toBeTruthy();
    expect(result.statusCode).toBe(201);
  });
  it("if a error is added, the message must be undefined and success must be false", () => {
    const result = new ResultT<Person>();
    result.SetError("Something went wrong.", 500);
    expect(result.message).toBeUndefined();
    expect(result.error).toBe("Something went wrong.");
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(500);
    expect(result.data).toBeUndefined();
  });
  it("it must allow the use of the generic type class with object data", () => {
    const result = new ResultT<Person>();
    const person = new Person("Jhon", "Doe", 17);
    result.SetData(person, 200);
    expect(result.success).toBeTruthy();
    expect(result.data).toBeInstanceOf(Person);
    expect(result.message).toBeUndefined();
    expect(result.error).toBeUndefined();
    expect(result.statusCode).toBe(200);
    const resultDto: ResultDto = result.ToResultDto();
    expect(resultDto.data).not.toBeNull();
    expect(resultDto.error).toBeUndefined();
    expect(resultDto.message).toBeUndefined();
  });
  it("it must allow the use of the generic type class with object data ans message", () => {
    const result = new ResultT<Person>();
    const person = new Person("Jhon", "Doe", 17);
    result.SetData(person, 200);
    result.SetMessage("Entity was created.", 200);
    expect(result.success).toBeTruthy();
    expect(result.data).toBeInstanceOf(Person);
    expect(result.message).toBe("Entity was created.");
    expect(result.error).toBeUndefined();
    expect(result.statusCode).toBe(200);
    const resultDto: ResultDto = result.ToResultDto();
    expect(resultDto.data).not.toBeNull();
    expect(resultDto.error).toBeUndefined();
    expect(resultDto.message).toBe("Entity was created.");
  });
});
