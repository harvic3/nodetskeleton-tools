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

function ValidateEmail(email: string): string {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return null;
  }
  return resources.GetWithParams(resourceKeys.NOT_VALID_EMAIL, { email });
}

function GreaterThan(numberName: string, base: number, evaluate: number): string {
  if (evaluate && evaluate > base) {
    return null;
  }
  return resources.GetWithParams(resourceKeys.NUMBER_GREATER_THAN, {
    name: numberName,
    baseNumber: base.toString(),
  });
}

function EvenNumber(numberName: string, evaluate: number): string {
  if (evaluate && evaluate % 2 === 0) {
    return null;
  }
  return resources.GetWithParams(resourceKeys.MUST_BE_EVEN_NUMBER, {
    numberName,
  });
}

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
    expect(result.error).toBe(
      "Some parameters are missing or not valid: Name, Last_Name.",
    );
    expect(result.statusCode).toBe(400);
  });
  it("should be return false, error message and 500 code error if the entry is not valid", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING", 500);
    const result = new Result();
    const person = new Person(null, undefined, 20);
    const isValid = validator.IsValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      Age: person.age,
    });
    expect(isValid).toBeFalsy();
    expect(result.error).toBe(
      "Some parameters are missing or not valid: Name, Last_Name.",
    );
    expect(result.statusCode).toBe(500);
  });
  it("should be return true if the entry valid", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = new Person("Jhon", "Doe", 20);
    const isValid = validator.IsValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      Age: person.age,
    });
    expect(isValid).toBeTruthy();
    expect(result.error).toBeUndefined();
  });
  it("should be execute all validations and return an entry not valid by email", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = new Person("Jhon", "Doe", 20);
    const invalidEmail = "wrongEmail@email";
    person.SetEmail(invalidEmail);
    const isValid = validator.IsValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      Age: [() => GreaterThan("Age", 18, person.age)],
      Email: [() => ValidateEmail(person.email)],
    });
    expect(isValid).toBeFalsy();
    expect(result.error).toBe(
      `Some parameters are missing or not valid: Email ${invalidEmail} is not valid.`,
    );
  });
  it("should be execute all validations and return an entry not valid by age", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = new Person("Jhon", "Doe", 20);
    const validEmail = "myemail@orion.com";
    person.SetEmail(validEmail);
    const isValid = validator.IsValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      Age: [() => GreaterThan("Age", 25, person.age)],
      Email: [() => ValidateEmail(person.email)],
    });
    expect(isValid).toBeFalsy();
    expect(result.error).toBe(
      "Some parameters are missing or not valid: The number Age must be greater than 25.",
    );
  });
  it("should be execute all validations and return an entry not valid by email and age", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = new Person("Jhon", "Doe", 10);
    const invalidEmail = "wrongEmail@email";
    person.SetEmail(invalidEmail);
    const isValid = validator.IsValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      Age: [() => GreaterThan("Age", 18, person.age)],
      Email: [() => ValidateEmail(person.email)],
    });
    expect(isValid).toBeFalsy();
    expect(result.error).toBe(
      "Some parameters are missing or not valid: The number Age must be greater than 18, Email wrongEmail@email is not valid.",
    );
  });
  it("should be execute all validations and return an entry not valid by age for not pair and not greater than a number", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = new Person("Jhon", "Doe", 21);
    const validEmail = "myemail@orion.com";
    person.SetEmail(validEmail);
    const isValid = validator.IsValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      Age: [
        () => GreaterThan("Age", 25, person.age),
        () => EvenNumber("Age", person.age),
      ],
      Email: [() => ValidateEmail(person.email)],
    });
    expect(isValid).toBeFalsy();
    expect(result.error).toBe(
      "Some parameters are missing or not valid: The number Age must be greater than 25, The Age param should be even.",
    );
  });
});
