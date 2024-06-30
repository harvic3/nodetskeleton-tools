import { addLinesAfterPosition, getLinePositionByContent } from "../FileUtils";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { replaceAll } from "../StringUtils";
import { SettingsFileType } from "../types";
import { templates } from "../Templates";

export function ensureServiceContext(settingsFile: SettingsFileType, serviceContextFilePath: string, apiName: string) {
  if (!existsSync(serviceContextFilePath)) return;

  const serviceContextContent = readFileSync(serviceContextFilePath, "utf8");
  const hasApiServiceContext = getLinePositionByContent(
    serviceContextContent,
    apiName.toUpperCase(),
  );
  if (hasApiServiceContext) return;

  const fileEndPosition = getLinePositionByContent(
    serviceContextContent,
    settingsFile.serviceContextLineToFind,
  );
  const serviceContextContentToAdd = replaceAll(templates.serviceContextNewLine, {
    "{{ApiNameUpper}}": apiName.toUpperCase(),
    "{{ApiName}}": apiName,
  });
  const newServiceContextContent = addLinesAfterPosition(
    serviceContextContent,
    fileEndPosition - 1,
    serviceContextContentToAdd,
  );

  writeFileSync(serviceContextFilePath, newServiceContextContent);
}
