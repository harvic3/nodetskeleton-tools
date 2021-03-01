const res_tsk = require("resources-tsk");

// local or remote resource
const enLocal = {
  SOMETHING_WENT_WRONG: "Oh sorry, something went wrong with current action!",
  SOME_PARAMETERS_ARE_MISSING:
    "Some parameters are missing or invalid: {{missingParams}}.",
  YOUR_OWN_NEED:
    "You are the user {{name}}, your last name is {{lastName}} and you are {{age}} years old.",
};

// local or remote resource
const esLocal = {
  SOMETHING_WENT_WRONG: "Oh lo sentimos, algo salió mal con esta acción!",
  SOME_PARAMETERS_ARE_MISSING:
    "Faltan algunos parámetros o son inválidos: {{missingParams}}.",
  YOUR_OWN_NEED:
    "Usted es {{name}}, su apellido es {{lastName}} y su edad es {{age}} años.",
};

// local or remote resource
const localKeys = {
  SOMETHING_WENT_WRONG: "SOMETHING_WENT_WRONG",
  SOME_PARAMETERS_ARE_MISSING: "SOME_PARAMETERS_ARE_MISSING",
  YOUR_OWN_NEED: "YOUR_OWN_NEED",
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
// Here finish your index file.

// In localization middleware
resources.init("en");

// In any Use Case
var Person = (function () {
  function Person(name, lastName, age, language) {
    this.name = name;
    this.lastName = lastName;
    this.age = age;
    this.language = language;
  }
  return Person;
})();

var user = new Person("Carl", "Sagan", new Date().getFullYear() - 1934, "es");

const simpleMessage = resources.get(resourceKeys.SOMETHING_WENT_WRONG);

const enrichedMessage = resources.getWithParams(resourceKeys.YOUR_OWN_NEED, {
  name: user.name,
  lastName: user.lastName,
  age: user.age,
});

console.log("Simple with global language:", simpleMessage);
console.log("Enriched with global language:", enrichedMessage);

// Or with optional language param

const simpleMessage2 = resources.get(resourceKeys.SOMETHING_WENT_WRONG, user.language);

const enrichedMessage2 = resources.getWithParams(
  resourceKeys.YOUR_OWN_NEED,
  {
    name: user.name,
    lastName: user.lastName,
    age: user.age,
  },
  user.language,
);

console.log("Simple with language as param:", simpleMessage2);
console.log("Enriched with language as param:", enrichedMessage2);
