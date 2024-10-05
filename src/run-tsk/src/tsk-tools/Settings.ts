import { SettingsFileType } from "./types"

const settings: SettingsFileType = {
  httpMethodsAllowed: [
    "get",
    "post",
    "put",
    "delete",
    "patch"
  ],
  controllerImportLineToFind: "import container, {",
  controllerFunctionLineToFind: "initializeRoutes(router: IRouter)",
  controllerRouterLineToFind: "this.setRouter(router())",
  containerExportLineToFind: "export { ",
  serviceContextLineToFind: "}"
};

export default settings;
