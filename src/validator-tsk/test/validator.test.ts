import { Validator } from "../src/index";
import { Resources } from "resources-tsk";
import { Result } from "result-tsk";

import * as esLocal from "../../resources-tsk/test/locals/resources/es.local.json";
import * as enLocal from "../../resources-tsk/test/locals/resources/en.local.json";

import * as localKeys from "../../resources-tsk/test/locals/resources/keys.json";
import { Person } from "./Person";

const locals = {
  es: esLocal,
  en: enLocal,
};

const defaultLanguage = "en";

const resourceKeys = localKeys;

const resources = new Resources(locals, resourceKeys, defaultLanguage);

describe("when use validator", () => {
  it("should be return false, error message and default BAD_REQUEST code error if the entry is not valid", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = new Person(null, undefined, 20);
    const isValid = validator.IsValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      age: person.age,
    });
    expect(isValid).toBeFalsy();
    expect(result.error).toBe("Some parameters are missing: Name, Last_Name.");
    expect(result.statusCode).toBe(400);
  });
  it("should be return false, error message and 500 code error if the entry is not valid", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING", 500);
    const result = new Result();
    const person = new Person(null, undefined, 20);
    const isValid = validator.IsValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      age: person.age,
    });
    expect(isValid).toBeFalsy();
    expect(result.error).toBe("Some parameters are missing: Name, Last_Name.");
    expect(result.statusCode).toBe(500);
  });
  it("should be return true if the entry valid", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = new Person("Jhon", "Doe", 20);
    const isValid = validator.IsValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      age: person.age,
    });
    expect(isValid).toBeTruthy();
  });
});
