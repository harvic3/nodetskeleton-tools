import { ApplicationError } from "../errors/ApplicationError";
import { IServiceContainer } from "../dic/IServiceContainer";
import { Resources } from "resources-tsk";

export class TSKernel implements IServiceContainer {
  #serviceCollection: Record<string, Function> = {};
  #INTERNAL_ERROR: string;
  #classNameBase: string;
  #interfaceBaseName: string;
  #appMessages: Resources;
  #appErrorMessageKey: string;
  #applicationStatus: Record<string, string>;
  #applicationStatusCodeKey: string;

  /*
   * @param internalErrorCode - Use applicationStatus INTERNAL_ERROR key for this. Default is 'FF'.
   * @param interfaceBaseName - You could use something like 'ClassName.interface'. Default is 'IKeyClassName'.
   * @param classNameBase - This value will be replace for className value. Default value is 'KeyClassName'.
   * @param appMessages - Dictionary for application messages than contain the error message like '{{className}} not found in dependencies container.'.
   * @param appErrorMessageKey - This is a key to find in appMessages dictionary as error message resource.
   * @param applicationStatus - Dictionary for application status than contain the error code like 'FF'.
   * @param applicationStatusCodeKey - This is a key to find in application status dictionary as application error code.
   */
  init(settings: {
    internalErrorCode: "FF";
    interfaceBaseName: "IKeyClassName";
    classNameBase: "KeyClassName";
    appMessages?: Resources;
    appErrorMessageKey: "INTERNAL_ERROR";
    applicationStatus?: Record<string, string>;
    applicationStatusCodeKey: "DEPENDENCY_NOT_FOUNT";
  }): void {
    this.#INTERNAL_ERROR = settings.internalErrorCode;
    this.#classNameBase = settings.classNameBase;
    this.#interfaceBaseName = settings.interfaceBaseName;
    this.#appMessages = settings.appMessages;
    this.#appErrorMessageKey = settings.appErrorMessageKey;
    this.#applicationStatus = settings.applicationStatus;
    this.#applicationStatusCodeKey = settings.applicationStatusCodeKey;
  }

  addScoped(className: string, activator: Function): void {
    this.#serviceCollection[className] = activator;
  }

  addSingleton(className: string, object: object): void {
    this.#serviceCollection[className] = () => object;
  }

  get<T>(context: string, className: string): T {
    if (!this.#serviceCollection[className]) {
      throw new ApplicationError(
        context || TSKernel.name,
        !!this.#appMessages
          ? this.#appMessages.getWithParams(
              this.#appMessages.keys[this.#appErrorMessageKey],
              { className },
            )
          : `${className} not found in dependencies container.`,
        this.#applicationStatus
          ? this.#applicationStatus[this.#applicationStatusCodeKey]
          : this.#INTERNAL_ERROR,
      );
    }

    return this.#serviceCollection[className]() as T;
  }

  classToInterfaceName(className: string): string {
    return this.#interfaceBaseName.replace(this.#classNameBase, className);
  }
}
