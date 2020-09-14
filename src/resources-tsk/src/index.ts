export class Resources {
  private defaultLanguage: string = null;
  private globalLanguage: string = null;
  private locals: { [key: string]: { [key: string]: string } } = null;
  resourceKeys: { [key: string]: string };
  constructor(
    locals: { [key: string]: { [key: string]: string } },
    localKeys: { [key: string]: string },
    defaultLanguage?: string,
  ) {
    this.locals = locals;
    this.resourceKeys = localKeys;
    if (defaultLanguage && !this.locals[defaultLanguage]) {
      throw new Error("Default language not found in local resources.");
    }
    this.defaultLanguage = defaultLanguage;
    const keysToCheck = Object.keys(this.resourceKeys);
    const langToCheck = Object.keys(locals);
    const resourcesNotFound: string[] = [];
    keysToCheck.forEach((key) => {
      langToCheck.forEach((lang) => {
        if (!this.locals[lang][key]) {
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
  SetDefaultLanguage(defaultLanguage: string): void {
    if (!this.locals[defaultLanguage]) {
      throw new Error("Default language not found in local resources.");
    }
    this.defaultLanguage = defaultLanguage;
  }
  /* Set the current working language */
  Init(language: string): void {
    if (!language) {
      return;
    }
    if (!this.locals[language]) {
      console.log(`Accept-Language "${language}" not found in locals resource.`);
      return;
    }
    this.globalLanguage = language;
  }
  /* Update the current locals */
  UpdateLocals(locals: { [key: string]: { [key: string]: string } }): void {
    if (locals) {
      this.locals = locals;
    }
  }
  Get(resourceName: string, language: string = null): string {
    if (language && this.locals[language] && this.locals[language][resourceName]) {
      return this.locals[language][resourceName];
    }
    if (
      this.locals[this.globalLanguage] &&
      this.locals[this.globalLanguage][resourceName]
    ) {
      return this.locals[this.globalLanguage][resourceName];
    }
    if (
      this.locals[this.defaultLanguage] &&
      this.locals[this.defaultLanguage][resourceName]
    ) {
      return this.locals[this.defaultLanguage][resourceName];
    }
    throw new Error(`Resource ${resourceName} not found in any local resource.`);
  }
  GetWithParams(
    resourceName: string,
    params: { [key: string]: string },
    language: string = null,
  ): string {
    let resource: string = null;
    if (language && this.locals[language] && this.locals[language][resourceName]) {
      resource = this.locals[language][resourceName];
    } else if (
      this.locals[this.globalLanguage] &&
      this.locals[this.globalLanguage][resourceName]
    ) {
      resource = this.locals[this.globalLanguage][resourceName];
    } else if (
      this.locals[this.defaultLanguage] &&
      this.locals[this.defaultLanguage][resourceName]
    ) {
      resource = this.locals[this.defaultLanguage][resourceName];
    }
    if (!resource) {
      throw new Error(`Resource ${resourceName} not found in any local resource.`);
    }
    const keys = Object.keys(params);
    keys.forEach((key) => {
      const pattern = `({{)${key}(}})`;
      const regex = RegExp(pattern);
      while (regex.test(resource)) {
        resource = resource.replace(`{{${key}}}`, params[key]);
      }
    });
    return resource;
  }
}
