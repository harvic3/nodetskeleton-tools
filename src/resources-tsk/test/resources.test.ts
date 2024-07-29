import esLocal from "./locals/resources/es.local";
import enLocal from "./locals/resources/en.local";

import { KeysDictionaryEnum, LocalMessageDictionary } from "./locals/resources/keys";
import { Resources } from "../src";

enum LocaleTypeEnum {
  ES = "es",
  EN = "en",
}

type LocalType = {
  [K in LocaleTypeEnum]: LocalMessageDictionary;
};

const locals: LocalType = {
  [LocaleTypeEnum.ES]: esLocal,
  [LocaleTypeEnum.EN]: enLocal,
};

const defaultLanguage = LocaleTypeEnum.EN;

const user = {
  name: "Carl",
  lastName: "Sagan",
  language: LocaleTypeEnum.ES,
  email: "carlsagan@milkyway.",
};

describe("When using resources", () => {
  it("Must throw an error if the resources for default language does not exist", () => {
    const resources = () => new Resources<LocaleTypeEnum, KeysDictionaryEnum, LocalMessageDictionary, LocalType>(locals, KeysDictionaryEnum, "it" as LocaleTypeEnum);
    expect(resources).toThrow("Default language it not found in local resources.");
  });
  it("Must throw an error if the resources for default language does not exist when call setDefaultLanguage function", () => {
    const resources = new Resources<LocaleTypeEnum, KeysDictionaryEnum, LocalMessageDictionary, LocalType>(locals, KeysDictionaryEnum, defaultLanguage);
    const setDefaultLanguage = () => resources.setDefaultLanguage("it" as LocaleTypeEnum);
    expect(setDefaultLanguage).toThrow(
      "Default language it not found in local resources.",
    );
  });
  it("Must show an error if the resource does not exist", () => {
    const resources = new Resources<LocaleTypeEnum, KeysDictionaryEnum, LocalMessageDictionary, LocalType>(locals, KeysDictionaryEnum, defaultLanguage);
    resources.init(LocaleTypeEnum.ES);
    const resource = () => resources.get("NOT_EXISTING_MESSAGE" as KeysDictionaryEnum);
    expect(resource).toThrow(
      "Resource NOT_EXISTING_MESSAGE not found in any local resource.",
    );
  });
  it("Should return a valid resource message with global language with get function called", () => {
    const resources = new Resources<LocaleTypeEnum, KeysDictionaryEnum, LocalMessageDictionary, LocalType>(locals, KeysDictionaryEnum, defaultLanguage);
    resources.init(LocaleTypeEnum.ES);
    const resource = resources.get(resources.keys.SOMETHING_WENT_WRONG);
    expect(resource).toBe(locals.es.SOMETHING_WENT_WRONG);
  });
  it("Should return a valid resource message with language param in get function", () => {
    const resources = new Resources<LocaleTypeEnum, KeysDictionaryEnum, LocalMessageDictionary, LocalType>(locals, KeysDictionaryEnum, defaultLanguage);
    resources.init(LocaleTypeEnum.EN);
    const resource = resources.get(resources.keys.SOMETHING_WENT_WRONG, user.language);
    expect(resource).toBe(locals.es.SOMETHING_WENT_WRONG);
  });
  it("Should return a valid resource message with language param in getWithParams function", () => {
    const resources = new Resources<LocaleTypeEnum, KeysDictionaryEnum, LocalMessageDictionary, LocalType>(locals, KeysDictionaryEnum, defaultLanguage);
    resources.init(LocaleTypeEnum.ES);
    user.language = LocaleTypeEnum.EN;
    const resource = resources.getWithParams(
      resources.keys.NOT_VALID_EMAIL,
      { email: user.email },
      user.language,
    );
    expect(resource).toBe(locals.en.NOT_VALID_EMAIL.replace("{{email}}", user.email));
  });
  it("Should return a valid text with replaces values with replaceParams function", () => {
    const text = "This is a text with {{name}} and {{lastName}}";
    const params = { name: user.name, lastName: user.lastName };
    const resource = Resources.replaceParams(text, params);
    expect(resource).toBe(
      text.replace("{{name}}", user.name).replace("{{lastName}}", user.lastName),
    );
  });
});
