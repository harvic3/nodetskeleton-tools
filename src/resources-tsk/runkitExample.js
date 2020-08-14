var res_tsk = require("resources-tsk");

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
resources.Init("en");

// In any Use Case
const simpleMessage = resources.Get(resourceKeys.SOMETHING_WENT_WRONG);

const enrichedMessage = resources.GetWithParams(resourceKeys.YOUR_OWN_NEED, {
  name: "Carl",
  lastName: "Sagan",
  age: new Date().getFullYear() - 1934,
});

console.log("Simple: ", simpleMessage);
console.log("Enriched: ", enrichedMessage);
