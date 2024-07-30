export interface IResources {
  keys: Record<string, string>;
  setDefaultLanguage(defaultLanguage: string): void;
  init(language: string): void;
  updateLocals(locals: Record<string, Record<string, string>>, localKeys: Record<string, string>): void;
  get(resourceName: string, language?: string): string;
  getWithParams(resourceName: string, params: Record<string, string>, language?: string): string;
}
