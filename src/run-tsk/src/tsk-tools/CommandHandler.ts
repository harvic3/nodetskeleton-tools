import { EQUAL_CHAR, SLASH_CHAR, SPACE_CHAR, COMMA_SPACE, EMPTY_CHAR, pathToOS, capitalize, toCamelCase, addCharToStar } from "./StringUtils";
import { getArgValue, convertArgsToKeyValueArray, availableAddUseCaseCommandArgs } from "./ArgsUtils";
import { ensureExistingContainer, ensureNewContainer } from "./builders/ControllerContainerBuilder";
import { ensureExistingController, ensureNewController } from "./builders/ControllerBuilder";
import { ensureServiceContext } from "./builders/ServiceContextBuilder";
import { ensureUseCase } from "./builders/UseCaseBuilder";
import { helpDescription } from "./Templates";
import { HELP_COMMAND } from "../Constants";
import { SettingsFileType } from "./types";
import { isTSKProject } from "./FileUtils";
import Settings from "./Settings";
import { existsSync } from "fs";
import { resolve } from "path";

function addUseCase(args: string[], settingsFile: SettingsFileType): void {
  const API_NAME_ARG = "api-name";
  const USE_CASE_ARG = "use-case";
  const ENDPOINT_ARG = "endpoint";
  const HTTP_METHOD_ARG = "http-method";

  const warningMessage = "Missing parameters. Please provide {{MissingArgs}} or some alias.";

  const keyValueArgsArray = convertArgsToKeyValueArray(args, EQUAL_CHAR);
  if (!keyValueArgsArray.length) {
    console.warn(
      warningMessage.replace(
        "{{MissingArgs}}",
        `${API_NAME_ARG}, ${USE_CASE_ARG}, ${ENDPOINT_ARG} and ${HTTP_METHOD_ARG}`,
      ),
    );
    return;
  }

  const apiName = getArgValue(API_NAME_ARG, keyValueArgsArray, availableAddUseCaseCommandArgs);
  const useCaseName = getArgValue(USE_CASE_ARG, keyValueArgsArray, availableAddUseCaseCommandArgs);
  const endPoint = addCharToStar(
    getArgValue(ENDPOINT_ARG, keyValueArgsArray, availableAddUseCaseCommandArgs)?.toLowerCase(),
    SLASH_CHAR,
  );
  const httpMethod = getArgValue(
    HTTP_METHOD_ARG,
    keyValueArgsArray,
    availableAddUseCaseCommandArgs,
  )?.toUpperCase();

  if (!apiName || !useCaseName || !endPoint || !httpMethod) {
    console.warn(
      warningMessage.replace(
        "{{MissingArgs}}",
        [
          { key: API_NAME_ARG, value: apiName },
          { key: USE_CASE_ARG, value: useCaseName },
          { key: ENDPOINT_ARG, value: endPoint },
          { key: HTTP_METHOD_ARG, value: httpMethod },
        ]
          .filter((arg) => (!arg.value ? arg.key : EMPTY_CHAR))
          .map((arg) => arg.key)
          .join(COMMA_SPACE),
      ),
    );
    return;
  }

  const apiNameCapitalized = capitalize(apiName);

  if (!settingsFile.httpMethodsAllowed.includes(httpMethod.toLowerCase())) {
    console.warn(
      `Http method ${httpMethod} is not allowed. Please set in into settings.json and IRouter.ts`,
    );
    return;
  }

  const useCaseNameCamel = toCamelCase(useCaseName);
  const useCaseNameParts = useCaseNameCamel.split(/(?=[A-Z])/);
  let actionName;
  if (useCaseNameParts.length === 1 || useCaseNameParts.length === 2) {
    actionName = useCaseNameParts[0];
  } else {
    actionName = useCaseNameParts.slice(0, -1).join(EMPTY_CHAR);
  }
  const useCasePath = resolve(
    `./src/application/modules/${apiName}/useCases/${actionName}/index.ts`,
  );
  if (existsSync(useCasePath)) {
    console.warn(`Use case as ${useCaseName} already exists in \n${pathToOS(useCasePath)}`);
    return;
  }

  const controllerPath = resolve(
    `./src/adapters/controllers/${apiName}/${apiNameCapitalized}.controller.ts`,
  );
  const existsController = existsSync(controllerPath);
  const controllerContainerPath = resolve(
    `./src/adapters/controllers/${apiName}/container/index.ts`,
  );

  const testUseCasePath = resolve(
    `./src/application/modules/${apiName}/useCases/${actionName}/${useCaseName}UseCase.test.ts`,
  );
  const serviceContextFilePath = resolve("./src/adapters/shared/ServiceContext.ts");

  try {
    if (existsController) {
      ensureExistingController({
        settingsFile,
        controllerPath,
        useCaseName,
        useCaseNameCamel,
        endPoint,
        httpMethod,
      });
      ensureExistingContainer({
        settingsFile,
        containerPath: controllerContainerPath,
        useCaseName,
        apiName,
        actionName,
      });
    } else {
      ensureNewController({
        controllerPath,
        useCaseName,
        useCaseNameCamel,
        apiName,
        apiNameCapitalized,
        endPoint,
        httpMethod,
      });
      ensureNewContainer(controllerContainerPath, useCaseName, apiName, actionName);
    }

    ensureUseCase(useCasePath, testUseCasePath, useCaseName);

    ensureServiceContext(settingsFile, serviceContextFilePath, apiName);

    console.log(
      `${useCaseName}UseCase and its dependencies were created with:\n apiName=${apiName}\n use-case=${useCaseName}\n endPoint=${endPoint}\n httpMethod=${httpMethod}`,
    );
  } catch (error) {
    console.error(`Error creating use case ${useCaseName}`, error);
  }
}

function listAliasesForArg(args: string[]): void {
  const warningMessage = "Missing argument name. Please provide arg=<argName>";
  if (!args?.length) console.warn(warningMessage);

  const argName = args[0].split(EQUAL_CHAR)[1];
  if (!argName) {
    console.warn(warningMessage);
    return;
  }
  const elegibleArg = availableAddUseCaseCommandArgs.find(
    (available) => available.argName === argName.toLowerCase(),
  );
  if (!elegibleArg) {
    console.warn(`Argument ${argName} not found`);
  } else {
    console.log(
      `Argument ${argName} has the following aliases:`,
      elegibleArg.aliases.join(SPACE_CHAR),
    );
  }
}

export const executeCommand = (args: string): void => {
  const processPath = process.cwd();
  if (!isTSKProject(processPath)) {
    console.error("run-tsk CLI doesn't seem to be in a TSK project. Please run it in a TSK project.");
    process.exit(1);
  }

  if (!args?.length) args = HELP_COMMAND;
  const arrayArgs: string[] = args.split(SPACE_CHAR).filter((param) => !!param);
  if (arrayArgs[0] !== HELP_COMMAND) console.log("Executing command:\n", arrayArgs.join(SPACE_CHAR));

  const command = arrayArgs.shift().toLowerCase();

  switch (command) {
    case HELP_COMMAND:
      console.log(helpDescription);
      break;
    case "add-uc":
    case "add-use-case":
      try {
        const settingsFile: SettingsFileType = Settings;
        addUseCase(arrayArgs, settingsFile);
      } catch (error) {
        console.error("Error reading settings file", error);
      }
      break;
    case "alias":
      listAliasesForArg(arrayArgs);
      break;
    default:
      console.warn("Command not found, try with help command > run-tsk help");
  }
};
