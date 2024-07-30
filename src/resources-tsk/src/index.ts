import { IResources } from "./types";
export { IResources } from "./types";

export class Resources<LTE extends string, LKD extends string, LMD extends { [K in LKD]: string }, LT extends { [K in LTE]: LMD }> implements IResources {
  private defaultLanguage: LTE = null;
  private globalLanguage: LTE = null;
  private values: LT = {} as LT;
  keys: { [K in LKD]: LKD } = {} as { [K in LKD]: LKD };

  constructor(
    locals: LT,
    localKeys: { [K in LKD]: LKD },
    defaultLanguage?: LTE,
  ) {
    this.values = locals;
    this.keys = localKeys;
    if (defaultLanguage && !this.values[defaultLanguage]) {
      throw new Error(
        `Default language ${defaultLanguage} not found in local resources.`,
      );
    }
    this.defaultLanguage = defaultLanguage;
    const keysToCheck = Object.keys(this.keys);
    const langToCheck = Object.keys(locals);
    const resourcesNotFound: string[] = [];
    keysToCheck.forEach((key) => {
      langToCheck.forEach((lang) => {
        if (!this.values[lang][key]) {
          resourcesNotFound.push(`${lang}: ${key}`);
        }
      });
    });
    if (resourcesNotFound.length > 0) {
      throw new Error(
        `The messages for ${resourcesNotFound.join(
          ", ",
        )} was not found in local resources.`,
      );
    }
  }

  /* Setting the default language */
  setDefaultLanguage(defaultLanguage: LTE): void {
    if (!this.values[defaultLanguage]) {
      throw new Error(
        `Default language ${defaultLanguage} not found in local resources.`,
      );
    }
    this.defaultLanguage = defaultLanguage;
  }

  /* Set the current working language */
  init(language: LTE): void {
    if (!language) {
      return;
    }
    if (!this.values[language]) {
      console.log(`Accept-Language "${language}" not found in locals resource.`);
      return;
    }
    this.globalLanguage = language;
  }

  /* Update the current locals at any time at runtime */
  updateLocals(
    locals: LT,
    localKeys: { [K in LKD]: LKD },
  ): void {
    if (locals) {
      this.values = locals;
      this.keys = localKeys;
    }
  }

  get(resourceName: LKD, language: LTE = null): string {
    if (language && this.values?.[language]?.[resourceName]) {
      return this.values[language][resourceName];
    }
    if (
      this.values[this.globalLanguage] &&
      this.values[this.globalLanguage][resourceName]
    ) {
      return this.values[this.globalLanguage][resourceName];
    }
    if (
      this.values[this.defaultLanguage] &&
      this.values[this.defaultLanguage][resourceName]
    ) {
      return this.values[this.defaultLanguage][resourceName];
    }
    throw new Error(`Resource ${resourceName} not found in any local resource.`);
  }

  getWithParams(
    resourceName: LKD,
    params: Record<string, string>,
    language: LTE = null,
  ): string {
    let resource: string = null;
    if (language && this.values?.[language]?.[resourceName]) {
      resource = this.values[language][resourceName];
    } else if (
      this.values[this.globalLanguage] &&
      this.values[this.globalLanguage][resourceName]
    ) {
      resource = this.values[this.globalLanguage][resourceName];
    } else if (
      this.values[this.defaultLanguage] &&
      this.values[this.defaultLanguage][resourceName]
    ) {
      resource = this.values[this.defaultLanguage][resourceName];
    }
    if (!resource) {
      throw new Error(`Resource ${resourceName} not found in any local resource.`);
    }

    return Resources.applyPattern(resource, params);
  }

  static replaceParams(text: string, params: Record<string, string>): string {
    if (!text || !params) return null;

    return Resources.applyPattern(text, params);
  }

  private static applyPattern(text: string, params: Record<string, string>): string {
    const objectKeys = Object.keys(params);
    objectKeys.forEach((key) => {
      const pattern = `({{)${key}(}})`;
      const regex = RegExp(pattern);
      while (regex.test(text)) {
        text = text.replace(`{{${key}}}`, params[key]);
      }
    });

    return text;
  }
}
