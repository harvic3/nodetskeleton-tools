import { Validator } from "../src/index";
import { Resources } from "resources-tsk";
import { Result } from "result-tsk";

import esLocal from "../../resources-tsk/test/locals/resources/es.local";
import enLocal from "../../resources-tsk/test/locals/resources/en.local";

import { KeysDictionaryEnum } from "../../resources-tsk/test/locals/resources/keys";
import { Person } from "./Person";

const locals = {
  es: esLocal,
  en: enLocal,
};

const defaultLanguage = "en";

const resourceKeys = KeysDictionaryEnum;

const resources = new Resources(locals, resourceKeys);

function validateEmail(email: string): string | null {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return null;
  }
  return resources.getWithParams(resourceKeys.NOT_VALID_EMAIL, { email });
}

function ValidateEmailWithEmptyResponse(email: string): string {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return "";
  }
  return resources.getWithParams(resourceKeys.NOT_VALID_EMAIL, { email });
}

function greaterThan(numberName: string, base: number, evaluate: number): string | null {
  if (evaluate && evaluate > base) {
    return null;
  }
  return resources.getWithParams(resourceKeys.NUMBER_GREATER_THAN, {
    name: numberName,
    baseNumber: base.toString(),
  });
}

function evenNumber(numberName: string, evaluate: number): string | null {
  if (evaluate && evaluate % 2 === 0) {
    return null;
  }
  return resources.getWithParams(resourceKeys.MUST_BE_EVEN_NUMBER, {
    numberName,
  });
}

function isEvenNumber(evaluate: number): boolean {
  if (evaluate && evaluate % 2 === 0) {
    return true;
  }
  return false;
}

describe("when use validator", () => {
  beforeAll(() => {
    resources.setDefaultLanguage(defaultLanguage);
  });
  it("should be return false, error message and default BAD_REQUEST number code error if the entry is not valid", () => {
    const BAD_REQUEST = 400;
    const validator = new Validator(
      resources,
      "SOME_PARAMETERS_ARE_MISSING",
      BAD_REQUEST,
    );
    const result = new Result();
    const nullName = null;
    const nullLastName = undefined;
    const person = new Person(nullName as unknown as string, nullLastName as unknown as string, 20);
    const isValid = validator.isValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      age: person.age,
    });
    expect(isValid).toBeFalsy();
    expect(result.error).toBe(
      "Some parameters are missing or not valid: Name, Last_Name.",
    );
    expect(result.statusCode).toBe(BAD_REQUEST);
  });
  it("should be return false, error message and default BAD_REQUEST string code error if the entry is not valid", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const nullName = null;
    const nullLastName = undefined;
    const person = new Person(nullName as unknown as string, nullLastName as unknown as string, 20);
    const isValid = validator.isValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      age: person.age,
    });
    expect(isValid).toBeFalsy();
    expect(result.error).toBe(
      "Some parameters are missing or not valid: Name, Last_Name.",
    );
    expect(result.statusCode).toBe("400");
  });
  it("should be return false, error message and 500 code error if the entry is not valid", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING", 500);
    const result = new Result();
    const nullName = null;
    const nullLastName = undefined;
    const person = new Person(nullName as unknown as string, nullLastName as unknown as string, 20);
    const isValid = validator.isValidEntry(result, {
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
  it("should be return false and error message when the entry valid", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = null as any;
    const isValid = validator.isValidEntry(result, {
      Person: person,
      Name: person?.name,
      Last_Name: person?.lastName,
      Age: person?.age,
    });
    expect(isValid).toBeFalsy();
    expect(result.error).toBe(
      "Some parameters are missing or not valid: Person, Name, Last_Name, Age.",
    );
  });
  it("should be return true if the entry valid", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = new Person("John", "Doe", 20);
    const isValid = validator.isValidEntry(result, {
      Person: person,
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
    const person = new Person("John", "Doe", 20);
    const invalidEmail = "wrongEmail@email";
    person.setEmail(invalidEmail);
    const isValid = validator.isValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      Age: [() => greaterThan("Age", 18, person.age)],
      Email: [() => validateEmail(person.email)],
    });
    expect(isValid).toBeFalsy();
    expect(result.error).toBe(
      `Some parameters are missing or not valid: Email ${invalidEmail} is not valid.`,
    );
  });
  it("should be execute all validations and return an entry not valid by age", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = new Person("John", "Doe", 20);
    const validEmail = "myemail@orion.com";
    person.setEmail(validEmail);
    const isValid = validator.isValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      Age: [() => greaterThan("Age", 25, person.age)],
      Email: [() => validateEmail(person.email)],
    });
    expect(isValid).toBeFalsy();
    expect(result.error).toBe(
      "Some parameters are missing or not valid: The number Age must be greater than 25.",
    );
  });
  it("should be execute all validations and return an entry not valid by email and age", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = new Person("John", "Doe", 10);
    const invalidEmail = "wrongEmail@email";
    person.setEmail(invalidEmail);
    const isValid = validator.isValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      Age: [() => greaterThan("Age", 18, person.age)],
      Email: [() => validateEmail(person.email)],
    });
    expect(isValid).toBeFalsy();
    expect(result.error).toBe(
      "Some parameters are missing or not valid: The number Age must be greater than 18, Email wrongEmail@email is not valid.",
    );
  });
  it("should be execute all validations and return an entry not valid by age for not pair and not greater than a number", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = new Person("John", "Doe", 21);
    const validEmail = "myemail@orion.com";
    person.setEmail(validEmail);
    const isValid = validator.isValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      Age: [
        () => greaterThan("Age", 25, person.age),
        () => evenNumber("Age", person.age),
      ],
      Email: [() => validateEmail(person.email)],
    });
    expect(isValid).toBeFalsy();
    expect(result.error).toBe(
      "Some parameters are missing or not valid: The number Age must be greater than 25, The Age param should be even.",
    );
  });
  it("should be execute all validations and return an entry not valid by email and age validated by boolean function", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = new Person("John", "Doe", 11);
    const invalidEmail = "wrongEmail@email";
    person.setEmail(invalidEmail);
    const isValid = validator.isValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      Age: [() => isEvenNumber(person.age)],
      Email: [() => validateEmail(person.email)],
    });
    expect(isValid).toBeFalsy();
    expect(result.error).toBe(
      "Some parameters are missing or not valid: Age, Email wrongEmail@email is not valid.",
    );
  });
  it("should be execute all validations and return valid and age validated by boolean function", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = new Person("John", "Doe", 10);
    const invalidEmail = "fineEmail@email.co";
    person.setEmail(invalidEmail);
    const isValid = validator.isValidEntry(result, {
      Name: person.name,
      Last_Name: person.lastName,
      Age: [() => isEvenNumber(person.age)],
      Email: [() => validateEmail(person.email)],
    });
    expect(isValid).toBeTruthy();
    expect(result.error).toBeUndefined();
  });
  it("should be return true if the entry valid and validate email with empty response", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = new Person("John", "Doe", 20);
    const validEMail = "myemail@email.co";
    person.setEmail(validEMail);
    const isValid = validator.isValidEntry(result, {
      Person: person,
      Name: person.name,
      Last_Name: person.lastName,
      Age: person.age,
      Email: [() => ValidateEmailWithEmptyResponse(person.email)],
    });
    expect(isValid).toBeTruthy();
    expect(result.error).toBeUndefined();
  });
  it("should be return true if the array function validation is correct", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = new Person("John", "Doe", 20);
    const validEMail = "myemail@email.co";
    person.setEmail(validEMail);
    const isValid = validator.isValidEntry(result, {
      People: [() => [person].length >= 1],
    });
    expect(isValid).toBeTruthy();
    expect(result.error).toBeUndefined();
  });
  it("should be return false, error message and 400 code error if the entry is not valid", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING", 500);
    const personalError = 400;
    const result = new Result();
    const person = new Person("Nikola", "Tesla", 78);
    const invalidEMail = "myemail@emailco";
    person.setEmail(invalidEMail);
    const isValid = validator.isValidEntry(
      result,
      {
        Name: person.name,
        Last_Name: person.lastName,
        Age: [() => isEvenNumber(person.age)],
        Email: [() => ValidateEmailWithEmptyResponse(person.email)],
      },
      personalError,
    );
    expect(isValid).toBeFalsy();
    expect(result.error).toBe(
      `Some parameters are missing or not valid: Email ${person.email} is not valid.`,
    );
    expect(result.statusCode).toBe(personalError);
  });
  it("should return a throw error when passing an array of objects", () => {
    const validator = new Validator(resources, "SOME_PARAMETERS_ARE_MISSING");
    const result = new Result();
    const person = new Person("John", "Doe", 11);
    const isValid = () =>
      validator.isValidEntry(result, {
        Name: person.name,
        Last_Name: person.lastName,
        Age: [person],
      });
    expect(isValid).toThrowError(
      "Validator-tsk only allows function arrays. It cannot pass object arrays.",
    );
  });
});
