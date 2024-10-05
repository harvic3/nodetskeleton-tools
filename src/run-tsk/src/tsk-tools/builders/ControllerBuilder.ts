import { addLinesBeforePosition, getLinePositionByContent, replaceContentLineInPosition } from "../FileUtils";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { SettingsFileType } from "../types";
import { replaceAll } from "../StringUtils";
import { templates } from "../Templates";
import { join } from "path";

export function ensureExistingController(params: {
  settingsFile: SettingsFileType,
  controllerPath: string,
  useCaseName: string,
  useCaseNameCamel: string,
  endPoint: string,
  httpMethod: string,
}) {
  const httpMethodLower = params.httpMethod.toLowerCase();
  let controllerContent = readFileSync(params.controllerPath, "utf8");
  const importLineNumber = getLinePositionByContent(
    controllerContent,
    params.settingsFile.controllerImportLineToFind,
  );
  const importControllerContent = replaceAll(templates.importControllerTemplate, {
    "{{UseCaseName}}": params.useCaseName,
  });
  controllerContent = replaceContentLineInPosition(
    controllerContent,
    importLineNumber,
    params.settingsFile.controllerImportLineToFind,
    importControllerContent,
  );

  const functionContextLineNumber = getLinePositionByContent(
    controllerContent,
    params.settingsFile.controllerFunctionLineToFind,
  );
  const functionContextTemplate = replaceAll(templates.functionControllerTemplate, {
    "{{UseCaseNameCamel}}": params.useCaseNameCamel,
    "{{UseCaseName}}": params.useCaseName,
  });
  controllerContent = addLinesBeforePosition(
    controllerContent,
    functionContextLineNumber,
    functionContextTemplate,
  );

  const routerLineNumber = getLinePositionByContent(
    controllerContent,
    params.settingsFile.controllerRouterLineToFind,
  );
  const routerContextTemplate = replaceAll(templates.routeControllerTemplate, {
    "{{HttpMethodLower}}": httpMethodLower,
    "{{HttpMethodUpper}}": params.httpMethod,
    "{{EndPoint}}": params.endPoint,
    "{{UseCaseNameCamel}}": params.useCaseNameCamel,
  });
  controllerContent = replaceContentLineInPosition(
    controllerContent,
    routerLineNumber,
    params.settingsFile.controllerRouterLineToFind,
    `${params.settingsFile.controllerRouterLineToFind}${templates.routerPrefixToAdd}${routerContextTemplate}`,
  );

  writeFileSync(params.controllerPath, controllerContent);
}

export function ensureNewController(params: {
  controllerPath: string,
  useCaseName: string,
  useCaseNameCamel: string,
  apiName: string,
  apiNameCapitalized: string,
  endPoint: string,
  httpMethod: string,
}
) {
  const httpMethodLower = params.httpMethod.toLowerCase();
  const controllerTemplate = replaceAll(templates.controllerTemplate, {
    "{{UseCaseName}}": params.useCaseName,
    "{{UseCaseNameCamel}}": params.useCaseNameCamel,
    "{{EndPoint}}": params.endPoint,
    "{{HttpMethodLower}}": httpMethodLower,
    "{{HttpMethodUpper}}": params.httpMethod,
    "{{ApiNameCapitalized}}": params.apiNameCapitalized,
    "{{ApiNameUpper}}": params.apiName.toUpperCase(),
  });

  mkdirSync(join(params.controllerPath, ".."), { recursive: true });

  writeFileSync(params.controllerPath, controllerTemplate);
}
