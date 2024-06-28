#!/usr/bin/env node
import { HELP_COMMAND, helpDescription, SETUP_COMMAND, SEPARATOR, scriptPath } from "./Constants";
import { exec } from "child_process";

const convertArrayArgumentsToObjectArguments = (argsV, separator) => {
  const commandStr = argsV.join(' ');
  const commandOptions = commandStr.split(separator);
  const options = {
    action: commandOptions[0].split(' ').filter(param => param !== '')[0],
  };
  commandOptions.shift();
  for (let index = 0; index < commandOptions.length; index++) {
    const params = commandOptions[index].split(' ');
    const fixParams = params.filter(param => param !== '');
    options[fixParams[0]] = fixParams.length > 2 ? fixParams.slice(1) : fixParams[1];
  }
  return options;
}

const processCommands = async (options: { action: "help" | "setup", "project-name": string }) => {
  const action = options.action.toLowerCase();
  delete options.action;

  switch (action) {
    case HELP_COMMAND:
      console.log(helpDescription);
      break;
    case SETUP_COMMAND:
      if (!options["project-name"]) {
        console.error("Project name is required");
        process.exit(1);
      }
      exec(`sh ${scriptPath} ${options["project-name"]}`, async (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.error(`stderr: ${stderr}`);
        console.log(`stdout: ${stdout}`);
      });
      break;
    default:
      console.warn("Command not found, try with help command > run-tsk help");
  }
};

const main = async () => {
  const processArgv = process.argv;
  if (!processArgv[2]) {
    console.log('No entry');
    process.exit(1);
  }
  const options = convertArrayArgumentsToObjectArguments(processArgv.splice(2), SEPARATOR);
  await processCommands(options as any);
}

main();
