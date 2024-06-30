#!/usr/bin/env node
import { EMPTY_CHAR, EQUAL_CHAR, SPACE_CHAR } from "./tsk-tools/StringUtils";
import { executeCommand } from "./tsk-tools/CommandHandler";
import { helpDescription } from "./tsk-tools/Templates";
import { exec } from "child_process";
import {
  HELP_COMMAND,
  SETUP_COMMAND,
  SEPARATOR,
  scriptPath,
  IS_TSK_VALID_DIRECTORY,
} from "./Constants";
import { isTSKProject } from "./tsk-tools/FileUtils";

let spinnerInterval;
const startSpinner = () => {
  const spinnerChars = ["|", "/", "-", "\\"];
  let i = 0;
  spinnerInterval = setInterval(() => {
    process.stdout.write(`\r${spinnerChars[i++]} TSK is working...`);
    i &= 3;
  }, 250);
};

const stopSpinner = () => {
  clearInterval(spinnerInterval);
  process.stdout.write('\rDone!          \n');
};

const convertArrayArgumentsToObjectArguments = (argsV: string[], separator: string) => {
  const commandStr = argsV.join(SPACE_CHAR);
  const commandOptions = commandStr.split(separator);
  const options: {
    action: string;
    [key: string]: string[] | string;
  } = {
    action: commandOptions[0].split(SPACE_CHAR).filter((param: string) => param !== EMPTY_CHAR)[0],
  };
  commandOptions.shift();

  for (const option of commandOptions) {
    const params = option.split(EQUAL_CHAR);
    const fixParams = params.filter((param: string) => param !== EMPTY_CHAR);
    options[fixParams[0]] = fixParams.length > 2 ? fixParams.slice(1) : fixParams[1];
  }

  return options;
};

const processCommands = async (processArgv: string[]) => {
  const arrayArgs = processArgv.splice(2);
  const options = convertArrayArgumentsToObjectArguments(
    arrayArgs,
    SEPARATOR,
  );
  const action = options.action.toLowerCase();
  delete options.action;

  switch (action) {
    case IS_TSK_VALID_DIRECTORY:
      const processPath = process.cwd();
      if (!isTSKProject(processPath)) {
        console.error("run-tsk CLI doesn't seem to be in a TSK project root. Please run it in a TSK project.");
      } else {
        console.log("run-tsk CLI is in a TSK project root.");
      }
      break;
    case HELP_COMMAND:
      console.log(helpDescription);
      break;
    case SETUP_COMMAND:
      if (!options["project-name"]) {
        console.error("project-name value is required");
        process.exit(1);
      }
      startSpinner();
      exec(
        `sh ${scriptPath} ${options["project-name"]}`,
        async (error, stdout, stderr) => {
          stopSpinner();
          if (error) {
            console.error(`exec error: ${error.name} - ${error.message}`);
            return;
          }
          console.error(`stderr: ${stderr}`);
          console.log(`stdout: ${stdout}`);
        },
      );
      break;
    default:
      try {
        const args = arrayArgs.join(SPACE_CHAR);
        executeCommand(args);
      } catch (error) {
        console.error(`Error executing command ${action}: ${error.name} - ${error.message}`);
      }
      break;
  }
};

const main = async () => {
  const processArgv: string[] = process.argv;
  if (!processArgv[2]) {
    console.error("No valid entry, so try with help command > run-tsk help");
    process.exit(1);
  }
  await processCommands(processArgv);
};

main();
