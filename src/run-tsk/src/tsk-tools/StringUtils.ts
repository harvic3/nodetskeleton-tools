import { type } from "os";

export const EQUAL_CHAR = "=",
  SLASH_CHAR = "/",
  SPACE_CHAR = " ",
  COMMA_SPACE = ", ",
  SPACE_COMMA = " ,",
  COMMA_CHAR = ",",
  EMPTY_CHAR = "";

export function capitalize(text: string) {
  if (!text) return null;

  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function toCamelCase(text: string) {
  if (!text) return null;

  return text.charAt(0).toLowerCase() + text.slice(1);
}

export function replaceAll(text: string, keyValueObject: object) {
  if (!text) return null;

  Object.keys(keyValueObject).forEach((key) => {
    text = text.replace(new RegExp(key, "g"), keyValueObject[key]);
  });
  return text;
}

export function addCharToStar(text: string, char: string) {
  if (!text) return null;

  if (text.at(0) !== char) {
    text = char + text;
  }
  return text;
}

export function pathToOS(path: string) {
  if (!path) return null;

  return type() === "Windows_NT" ? path.replace(/\\/g, "/") : path;
}

export function replaceDoubleSpaces(text: string) {
  if (!text) return null;

  return text.replace(/\s\s+/g, EMPTY_CHAR);
}
