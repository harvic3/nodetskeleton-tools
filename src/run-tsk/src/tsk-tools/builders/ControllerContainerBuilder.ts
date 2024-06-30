import { addLinesBeforePosition, replaceContentLineInPosition, getLinePositionByContentInverse, addContentToBeginning } from "../FileUtils";
import { COMMA_SPACE, SPACE_COMMA, COMMA_CHAR, capitalize, replaceAll, replaceDoubleSpaces } from "../StringUtils";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { SettingsFileType } from "../types";
import { templates } from "../Templates";
import { join } from "path";

export function ensureExistingContainer(params: { settingsFile: SettingsFileType, containerPath: string, useCaseName: string, apiName: string, actionName: string }) {
  let controllerContainerContent = readFileSync(params.containerPath, "utf8");
  const containerExportLineNumber = getLinePositionByContentInverse(
    controllerContainerContent,
    params.settingsFile.containerExportLineToFind,
  );
  const exportContainerContent = replaceAll(templates.exportContainerTemplate + COMMA_SPACE, {
    "{{UseCaseName}}": params.useCaseName,
  });
  controllerContainerContent = replaceContentLineInPosition(
    controllerContainerContent,
    containerExportLineNumber,
    params.settingsFile.containerExportLineToFind,
    exportContainerContent.replaceAll(SPACE_COMMA, COMMA_CHAR),
  );
  const useCaseContainerTemplate = replaceDoubleSpaces(
    replaceAll(templates.addUseCaseContainerTemplate, {
      "{{UseCaseName}}": params.useCaseName,
    }),
  );
  controllerContainerContent = addLinesBeforePosition(
    controllerContainerContent,
    containerExportLineNumber,
    useCaseContainerTemplate,
  );
  const importContainerContent = replaceAll(templates.importContainerTemplate, {
    "{{UseCaseName}}": params.useCaseName,
    "{{ApiName}}": params.apiName,
    "{{ActionName}}": params.actionName,
  });
  controllerContainerContent = addContentToBeginning(
    controllerContainerContent,
    importContainerContent,
  );

  writeFileSync(params.containerPath, controllerContainerContent);
}

export function ensureNewContainer(containerPath, useCaseName, apiName, actionName) {
  const controllerContainerTemplate = replaceAll(templates.controllerContainerTemplate, {
    "{{ApiNameCapitalized}}": capitalize(apiName),
    "{{UseCaseName}}": useCaseName,
    "{{ApiName}}": apiName,
    "{{ActionName}}": actionName,
  });

  mkdirSync(join(containerPath, ".."), { recursive: true });

  writeFileSync(containerPath, controllerContainerTemplate);
}
