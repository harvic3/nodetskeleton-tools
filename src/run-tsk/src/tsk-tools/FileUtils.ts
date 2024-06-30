import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

export function getLinePositionByContent(text: string, contentToFind: string) {
  if (!text || !contentToFind) return null;

  const lines = text.split("\n");
  let linePosition = null;
  for (let index = 0; index < lines.length; index++) {
    if (lines[index].includes(contentToFind)) {
      linePosition = index;
      break;
    }
  }

  return linePosition;
}

export function getLinePositionByContentInverse(text: string, contentToFind: string) {
  if (!text || !contentToFind) return null;

  const lines = text.split("\n");
  let linePosition = null;
  for (let index = lines.length - 1; index >= 0; index--) {
    if (lines[index].includes(contentToFind)) {
      linePosition = index;
      break;
    }
  }

  return linePosition;
}

export function addLinesBeforePosition(text: string, position: number, textContentToAdd: string) {
  const linesContent = text.split("\n");
  const linesToAdd = textContentToAdd.split("\n");
  if (!linesContent?.length || !linesToAdd.length || position > linesContent.length) return null;

  linesContent.splice(position - 1, 1, ...linesToAdd);
  return linesContent.join("\n");
}

export function addLinesAfterPosition(text: string, position: number, textContentToAdd: string) {
  const linesContent = text.split("\n");
  const linesToAdd = textContentToAdd.split("\n");
  if (!linesContent?.length || !linesToAdd.length || position > linesContent.length) return null;

  linesContent.splice(position + 1, 0, ...linesToAdd);
  return linesContent.join("\n");
}

export function replaceContentLineInPosition(text: string, position: number, contentToFind: string, contentToReplace: string) {
  const linesContent = text.split("\n");
  if (!linesContent?.length || position > linesContent.length) return null;

  const line = linesContent[position];
  const lineContent = line.replace(contentToFind, contentToReplace);
  linesContent[position] = lineContent;
  return linesContent.join("\n");
}

export function addContentToBeginning(text: string, contentToReplace: string) {
  const linesContent = text.split("\n");
  const linesToAdd = contentToReplace.split("\n");
  if (!linesContent?.length || !linesToAdd.length) return null;

  linesContent.unshift(...linesToAdd);
  return linesContent.join("\n");
}

export function isTSKProject(dirName: string, fileName: string = "package.json", contentToFindInside: string = "tsk"): boolean {
  const filePath = resolve(dirName, fileName);
  const existsFile = existsSync(filePath);
  if (!existsFile) return false;
  const fileContent = readFileSync(filePath, "utf8");
  return fileContent.includes(contentToFindInside);
}
