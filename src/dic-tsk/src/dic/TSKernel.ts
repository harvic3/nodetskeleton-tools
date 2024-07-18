import { ApplicationError } from "../errors/ApplicationError";
import { IServiceContainer } from "./IServiceContainer";
import { Resources } from "resources-tsk";

export class TSKernel implements IServiceContainer {
  #serviceCollection: Record<string, Function> = {};
  #INTERNAL_ERROR_CODE = "FF";
  #classNameBase = "KeyClassName";
  #interfaceBaseName = "IKeyClassName";
  #appMessages: Resources;
  #appErrorMessageKey = "DEPENDENCY_NOT_FOUND";
  #applicationStatus: Record<string, string>;
  #applicationStatusCodeKey = "INTERNAL_ERROR";

  /**
   * @param internalErrorCode - Use applicationStatus INTERNAL_ERROR key for this. Default is 'FF'.
   * @param interfaceBaseName - You could use something like 'ClassName.interface'. Default is 'IKeyClassName'.
   * @param classNameBase - This value will be replace for className value. Default value is 'KeyClassName'.
   * @param appMessages - Dictionary for application messages than contain the error message like '{{className}} not found in dependencies container.'.
   * @param appErrorMessageKey - This is a key to find in appMessages dictionary as error message resource.
   * @param applicationStatus - Dictionary for application status than contain the error code like 'FF'.
   * @param applicationStatusCodeKey - This is a key to find in application status dictionary as application error code.
   */
  init(settings?: {
    internalErrorCode?: string;
    interfaceBaseName?: string;
    classNameBase?: string;
    appMessages: Resources;
    appErrorMessageKey: string;
    applicationStatus: Record<string, string>;
    applicationStatusCodeKey: string;
  }): void {
    if (settings?.internalErrorCode)
      this.#INTERNAL_ERROR_CODE = settings.internalErrorCode;
    if (settings?.classNameBase) this.#classNameBase = settings.classNameBase;
    if (settings?.interfaceBaseName) this.#interfaceBaseName = settings.interfaceBaseName;
    if (settings?.appMessages) this.#appMessages = settings.appMessages;
    if (settings?.appErrorMessageKey)
      this.#appErrorMessageKey = settings.appErrorMessageKey;
    if (settings?.applicationStatus) this.#applicationStatus = settings.applicationStatus;
    if (settings?.applicationStatusCodeKey)
      this.#applicationStatusCodeKey = settings.applicationStatusCodeKey;
  }

  addScoped(className: string, activator: Function): void {
    this.#serviceCollection[className] = activator;
  }

  addSingleton(className: string, instance: object): void {
    this.#serviceCollection[className] = () => instance;
  }

  get<T>(context: string, className: string): T {
    if (!this.#serviceCollection[className]) {
      throw new ApplicationError(
        context || TSKernel.name,
        this.#appMessages
          ? this.#appMessages.getWithParams(
              this.#appMessages.keys[this.#appErrorMessageKey],
              { className },
            )
          : `'${className}' not found in dependencies container.`,
        this.#applicationStatus
          ? this.#applicationStatus[this.#applicationStatusCodeKey]
          : this.#INTERNAL_ERROR_CODE,
      );
    }

    return this.#serviceCollection[className]() as T;
  }

  classToInterfaceName(className: string): string {
    return this.#interfaceBaseName.replace(this.#classNameBase, className);
  }
}
