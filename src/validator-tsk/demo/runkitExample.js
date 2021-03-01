// You need a resources-tsk lib or build some like this.
const res_tsk = require("resources-tsk");

// local or remote resource
const enLocal = {
  SOMETHING_WENT_WRONG: "Oh sorry, something went wrong with current action!",
  SOME_PARAMETERS_ARE_MISSING:
    "Some parameters are missing or invalid: {{missingParams}}.",
  YOUR_OWN_NEED:
    "You are the user {{name}}, your last name is {{lastName}} and you are {{age}} years old.",
  NUMBER_GREATER_THAN: "The number {{name}} must be greater than {{baseNumber}}",
};

// local or remote resource
const esLocal = {
  SOMETHING_WENT_WRONG: "Oh lo sentimos, algo salió mal con esta acción!",
  SOME_PARAMETERS_ARE_MISSING:
    "Faltan algunos parámetros o son inválidos: {{missingParams}}.",
  YOUR_OWN_NEED:
    "Usted es {{name}}, su apellido es {{lastName}} y su edad es {{age}} años.",
  NUMBER_GREATER_THAN: "El número {{name}} debe ser mayor a {{baseNumber}}",
};

// local or remote resource
const localKeys = {
  SOMETHING_WENT_WRONG: "SOMETHING_WENT_WRONG",
  SOME_PARAMETERS_ARE_MISSING: "SOME_PARAMETERS_ARE_MISSING",
  YOUR_OWN_NEED: "YOUR_OWN_NEED",
  NUMBER_GREATER_THAN: "NUMBER_GREATER_THAN",
};

const locals = {
  es: esLocal,
  en: enLocal,
};

const defaultLanguage = "en";

const resourceKeys = localKeys;

const resources = new res_tsk.Resources(locals, resourceKeys, defaultLanguage);

exports.resourceKeys = resourceKeys;
module.exports = resources;
// Here finish your resources index file.

// In localization middleware
resources.init("en");
// SET it to "es" to see the language CHANGE

// Here init the index file for validator
const val_tsk = require("validator-tsk");
// Import the resources from resources index file
// const resources = require("../resources/index");

const resourceKey = "SOME_PARAMETERS_ARE_MISSING";

const validator = new val_tsk.Validator(resources, resourceKey);

module.exports = validator;
// Here finish your validator index file

// In some use case import validator from index
// const validator = require("../validator/index");
const result_tsk = require("result-tsk");

const Person = (function () {
  function Person(name, lastName, age) {
    this.name = name;
    this.lastName = lastName;
    this.age = age;
  }
  Person.prototype.isAnAdult = function () {
    return this.age >= 18 ? true : false;
  };
  return Person;
})();

const personOne = new Person("Carl", null, 0);
const personTwo = new Person("Carl", "Sagan", undefined);
const personThree = new Person(undefined, "Sagan", undefined);
const personFour = new Person("Carl", "Sagan", 17);
const personFive = new Person("Carl", "Sagan", new Date().getFullYear() - 1934);

const resultOne = new result_tsk.ResultT();
const resultTwo = new result_tsk.ResultT();
const resultThree = new result_tsk.ResultT();
const resultFour = new result_tsk.ResultT();
const resultFive = new result_tsk.ResultT();

// Validator function - You can build your own according to your own needs
function greaterThan(numberName, base, evaluate) {
  if (evaluate && evaluate > base) {
    return null;
  }
  return resources.getWithParams(resourceKeys.NUMBER_GREATER_THAN, {
    name: numberName,
    baseNumber: base.toString(),
  });
}

console.log(
  "Person One is Valid?",
  validator.isValidEntry(resultOne, {
    Name: personOne.name,
    Last_Name: personOne.lastName,
    Age: personOne.age,
  }),
  resultOne,
);

console.log(
  "Person Two is Valid?",
  validator.isValidEntry(resultTwo, {
    Name: personTwo.name,
    Last_Name: personTwo.lastName,
    Age: personTwo.age,
  }),
  resultTwo,
);

console.log(
  "Person Three is Valid?",
  validator.isValidEntry(resultThree, {
    Name: personThree.name,
    Last_Name: personThree.lastName,
    Age: personThree.age,
  }),
  resultThree,
);

console.log(
  "Person Four is Valid?",
  validator.isValidEntry(resultFour, {
    Name: personFour.name,
    Last_Name: personFour.lastName,
    Age: [() => greaterThan("Age", 18, personFour.age)],
  }),
  resultFour,
);

console.log(
  "Person Five is Valid?",
  validator.isValidEntry(resultFive, {
    Name: personFive.name,
    Last_Name: personFive.lastName,
    Age: [() => greaterThan("Age", 18, personFive.age)],
  }),
  resultFive,
);
