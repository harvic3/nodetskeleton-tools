import * as esLocal from "./locals/resources/es.local.json";
import * as enLocal from "./locals/resources/en.local.json";

import * as localKeys from "./locals/resources/keys.json";
import { Resources } from "../src";

const locals = {
  es: esLocal,
  en: enLocal,
};

const defaultLanguage = "en";

const fakeResourcesKeys = {
  FAKE_ONE: "FAKE_ONE",
  FAKE_TWO: "FAKE_TWO",
};

const resourceKeys = localKeys;

const user = {
  name: "Carl",
  lastName: "Sagan",
  language: "es",
  email: "carlsagan@milkyway.",
};

describe("when using resources", () => {
  it("It must throw an error if the resources for default language does not exist", () => {
    const resources = () => new Resources(locals, resourceKeys, "it");
    expect(resources).toThrowError("Default language not found in local resources.");
  });
  it("It should throw an error if any key or exists in any language resource.", () => {
    const resources = () => new Resources(locals, fakeResourcesKeys, defaultLanguage);
    expect(resources).toThrowError(
      "The messages for es: FAKE_ONE, en: FAKE_ONE, es: FAKE_TWO, en: FAKE_TWO was not found in local resources.",
    );
  });
  it("it must show an error if the resource does not exist", () => {
    const resources = new Resources(locals, resourceKeys, defaultLanguage);
    resources.Init("es");
    const resource = () => resources.Get("NOT_EXISTING_MESSAGE");
    expect(resource).toThrowError(
      "Resource NOT_EXISTING_MESSAGE not found in any local resource.",
    );
  });
  it("it should return a valid resource message with global language with get function called", () => {
    const resources = new Resources(locals, resourceKeys, defaultLanguage);
    resources.Init("es");
    const resource = resources.Get(localKeys.SOMETHING_WENT_WRONG);
    expect(resource).toBe(locals.es.SOMETHING_WENT_WRONG);
  });
  it("it should return a valid resource message with language param in get function", () => {
    const resources = new Resources(locals, resourceKeys, defaultLanguage);
    resources.Init("en");
    const resource = resources.Get(localKeys.SOMETHING_WENT_WRONG, user.language);
    expect(resource).toBe(locals.es.SOMETHING_WENT_WRONG);
  });
  it("it should return a valid resource message with language param in getWithParams function", () => {
    const resources = new Resources(locals, resourceKeys, defaultLanguage);
    resources.Init("es");
    user.language = "en";
    const resource = resources.GetWithParams(
      localKeys.NOT_VALID_EMAIL,
      { email: user.email },
      user.language,
    );
    expect(resource).toBe(locals.en.NOT_VALID_EMAIL.replace("{{email}}", user.email));
  });
});
