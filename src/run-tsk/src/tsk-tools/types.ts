export type SettingsFileType = {
  httpMethodsAllowed: string[];
  controllerImportLineToFind: string;
  controllerFunctionLineToFind: string;
  controllerRouterLineToFind: string;
  containerExportLineToFind: string;
  serviceContextLineToFind: string;
}

export type UseCaseCommandArgType = {
  argName: string;
  aliases: string[];
}
