import esLocal from "./locals/resources/es.local";
import enLocal from "./locals/resources/en.local";

import localKeys from "./locals/resources/keys";
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

describe("When using resources", () => {
  it("Must throw an error if the resources for default language does not exist", () => {
    const resources = () => new Resources(locals, resourceKeys, "it");
    expect(resources).toThrowError("Default language it not found in local resources.");
  });
  it("Must throw an error if the resources for default language does not exist when call setDefaultLanguage function", () => {
    const resources = new Resources(locals, resourceKeys, defaultLanguage);
    const setDefaultLanguage = () => resources.setDefaultLanguage("it");
    expect(setDefaultLanguage).toThrowError(
      "Default language it not found in local resources.",
    );
  });
  it("Should throw an error if any key or exists in any language resource.", () => {
    const resources = () => new Resources(locals, fakeResourcesKeys, defaultLanguage);
    expect(resources).toThrowError(
      "The messages for es: FAKE_ONE, en: FAKE_ONE, es: FAKE_TWO, en: FAKE_TWO was not found in local resources.",
    );
  });
  it("Must show an error if the resource does not exist", () => {
    const resources = new Resources(locals, resourceKeys, defaultLanguage);
    resources.init("es");
    const resource = () => resources.get("NOT_EXISTING_MESSAGE");
    expect(resource).toThrowError(
      "Resource NOT_EXISTING_MESSAGE not found in any local resource.",
    );
  });
  it("Should return a valid resource message with global language with get function called", () => {
    const resources = new Resources(locals, resourceKeys, defaultLanguage);
    resources.init("es");
    const resource = resources.get(localKeys.SOMETHING_WENT_WRONG);
    expect(resource).toBe(locals.es.SOMETHING_WENT_WRONG);
  });
  it("Should return a valid resource message with language param in get function", () => {
    const resources = new Resources(locals, resourceKeys, defaultLanguage);
    resources.init("en");
    const resource = resources.get(localKeys.SOMETHING_WENT_WRONG, user.language);
    expect(resource).toBe(locals.es.SOMETHING_WENT_WRONG);
  });
  it("Should return a valid resource message with language param in getWithParams function", () => {
    const resources = new Resources(locals, resourceKeys, defaultLanguage);
    resources.init("es");
    user.language = "en";
    const resource = resources.getWithParams(
      localKeys.NOT_VALID_EMAIL,
      { email: user.email },
      user.language,
    );
    expect(resource).toBe(locals.en.NOT_VALID_EMAIL.replace("{{email}}", user.email));
  });
});
