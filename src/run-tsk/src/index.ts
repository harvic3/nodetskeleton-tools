#!/usr/bin/env node
import {
  HELP_COMMAND,
  helpDescription,
  SETUP_COMMAND,
  SEPARATOR,
  scriptPath,
} from "./Constants";
import { exec } from "child_process";

let spinnerInterval;
const startSpinner = () => {
  const spinnerChars = ["|", "/", "-", "\\"];
  let i = 0;
  spinnerInterval = setInterval(() => {
    process.stdout.write(`\r${spinnerChars[i++]} TSK working...`);
    i &= 3;
  }, 250);
};

const stopSpinner = () => {
  clearInterval(spinnerInterval);
  process.stdout.write('\rDone!          \n');
};

const convertArrayArgumentsToObjectArguments = (argsV: string[], separator: string) => {
  const commandStr = argsV.join(" ");
  const commandOptions = commandStr.split(separator);
  const options = {
    action: commandOptions[0].split(" ").filter((param: string) => param !== "")[0],
  };
  commandOptions.shift();

  for (const option of commandOptions) {
    const params = option.split(" ");
    const fixParams = params.filter((param: string) => param !== "");
    options[fixParams[0]] = fixParams.length > 2 ? fixParams.slice(1) : fixParams[1];    
  }
  return options;
};

const processCommands = async (options: {
  action: "help" | "setup";
  "project-name": string;
}) => {
  const action = options.action.toLowerCase();
  delete options.action;

  switch (action) {
    case HELP_COMMAND:
      console.log(helpDescription);
      break;
    case SETUP_COMMAND:
      if (!options["project-name"]) {
        console.error("project-name is required");
        process.exit(1);
      }
      startSpinner();
      exec(
        `sh ${scriptPath} ${options["project-name"]}`,
        async (error, stdout, stderr) => {
          stopSpinner();
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.error(`stderr: ${stderr}`);
          console.log(`stdout: ${stdout}`);
        },
      );
      break;
    default:
      console.warn("Command not found, try with help command > run-tsk help");
  }
};

const main = async () => {
  const processArgv = process.argv;
  if (!processArgv[2]) {
    console.error("No valid entry, so try with help command > run-tsk help");
    process.exit(1);
  }
  const options = convertArrayArgumentsToObjectArguments(
    processArgv.splice(2),
    SEPARATOR,
  );
  await processCommands(options as any);
};

main();
