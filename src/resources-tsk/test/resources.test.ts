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
});
