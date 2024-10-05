export const helpDescription = `run-tsk CLI (v{{version}}) available commands:
  > validate
    - The previous command will validate if the current directory is a root TSK project.

  > setup project-name=<project-name-value>
    - The previous command will setup the TSKProject ready for you to use it.
    - Example: run-tsk setup project-name=<your-awesome-project-name>

  > add-use-case api-name=<apiName> use-case=<useCaseName> endpoint=<endpoint> http-method=<METHOD>
    - The previous command will create a new UseCase into the project. Arguments can be sent in any order.
    - Example: run-tsk add-use-case api-name=auth use-case=Logout endpoint=/v1/auth/logout http-method=GET
    Aliases: add-uc

  > alias arg=<argName>
    - The previous command will show available aliases for the sended argument name.
    - Example: run-tsk alias arg=api-name
`;

const importControllerTemplate = "import container, { {{UseCaseName}}UseCase,";

const functionControllerTemplate = `
  {{UseCaseNameCamel}}: RequestHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction,
  ): Promise<void> => {
    // Create your request data from body, query or params here
    const body = req.body;
    return this.handleResult(
      res,
      next,
      this.servicesContainer.get<{{UseCaseName}}UseCase>(this.CONTEXT, {{UseCaseName}}UseCase.name).execute(req.locale, res.trace, body),
    );
  };
`;

const routeControllerTemplate = `addRoute({
      method: HttpMethodEnum.{{HttpMethodUpper}},
      path: "{{EndPoint}}",
      handlers: [this.{{UseCaseNameCamel}}],
      produces: [
        {
          applicationStatus: ApplicationStatus.SUCCESS,
          httpStatus: HttpStatusEnum.SUCCESS,
        },
        {
          applicationStatus: ApplicationStatus.UNAUTHORIZED,
          httpStatus: HttpStatusEnum.UNAUTHORIZED,
        },
      ],
    })`;

const controllerTemplate = `${importControllerTemplate}} from "./container/index";
import { IServiceContainer } from "../../shared/kernel";
import BaseController, {
  IRouter,
  IRequest,
  IResponse,
  INextFunction,
  ServiceContext,
  RequestHandler,
  HttpContentTypeEnum,
  HttpMethodEnum,
  HttpHeaderEnum,
  ApplicationStatus,
  HttpStatusEnum,
} from "../base/Base.controller";

export class {{ApiNameCapitalized}}Controller extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super({{ApiNameCapitalized}}Controller.name, serviceContainer, ServiceContext.{{ApiNameUpper}});
  }
${functionControllerTemplate}
  initializeRoutes(router: IRouter): void {
    this.setRouter(router()).${routeControllerTemplate};
  }
}

export default new {{ApiNameCapitalized}}Controller(container);
`;

const importContainerTemplate = `import { {{UseCaseName}}UseCase } from "../../../../application/modules/{{ApiName}}/useCases/{{ActionName}}";`;

const exportContainerTemplate = `export { {{UseCaseName}}UseCase `;

const addUseCaseContainerTemplate = `
kernel.addScoped(
  {{UseCaseName}}UseCase.name,
  () =>
    new {{UseCaseName}}UseCase(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
    ),
);
`;

const controllerContainerTemplate = `import { {{UseCaseName}}UseCase } from "../../../../application/modules/{{ApiName}}/useCases/{{ActionName}}";
import { LogProvider } from "../../../providers/container";
import kernel from "../../../shared/kernel";

const CONTEXT = "{{ApiNameCapitalized}}ControllerContainer";
${addUseCaseContainerTemplate}
${exportContainerTemplate}};
export default kernel;
`;

const useCaseTemplate = `import { BaseUseCase, IResult, Result } from "../../../../shared/useCase/BaseUseCase";
import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import { UseCaseTrace } from "../../../../shared/log/UseCaseTrace";

//TODO: Change this generic input type BaseUseCase<unknown> according to the input of your use case
export class {{UseCaseName}}UseCase extends BaseUseCase<unknown> {
  constructor(
    readonly logProvider: ILogProvider,
  ) {
    super({{UseCaseName}}UseCase.name, logProvider);
  }

  async execute(locale: LocaleTypeEnum, trace: UseCaseTrace, args: unknown): Promise<IResult> {
    this.setLocale(locale);
    const result = new Result();

    result.setError("Use case must to be implemented", this.applicationStatus.NOT_IMPLEMENTED);

    return result;
  }
}
`;

const testUseCaseTemplate = `import { ILogProvider } from "../../../../shared/log/providerContracts/ILogProvider";
import { ApplicationErrorMock } from "../../../../mocks/ApplicationError.mock";
import { ApplicationStatus } from "../../../../shared/status/applicationStatus";
import { LocaleTypeEnum } from "../../../../shared/locals/LocaleType.enum";
import { UseCaseTraceMock } from "../../../../mocks/UseCaseTrace.mock";
import { SessionMock } from "../../../../mocks/Session.mock";
import appMessages from "../../../../shared/locals/messages";
import appWords from "../../../../shared/locals/words";
import { {{UseCaseName}}UseCase } from "./index";
import { mock } from "jest-mock-extended";

// Mocks
const logProviderMock = mock<ILogProvider>();

// Builders
const applicationErrorBuilder = new ApplicationErrorMock();
const useCaseTraceBuilder = () => new UseCaseTraceMock();
const sessionBuilder = () => new SessionMock();

// Constants
const useCase = () => new {{UseCaseName}}UseCase(logProviderMock);

describe("Here your description test", () => {
  beforeAll(() => {
    appMessages.setDefaultLanguage(LocaleTypeEnum.EN);
    appWords.setDefaultLanguage(LocaleTypeEnum.EN);
  });
  beforeEach(() => {
  });

  it("And here your first test", async () => {
    // Arrange
    const body = null;

    // Act
    const result = await useCase().execute(
      LocaleTypeEnum.EN,
      useCaseTraceBuilder().byDefault(sessionBuilder().byDefault().build()).build(),
      body,
    );

    // Assert
    expect(result.success).toBeFalsy();
    expect(result.statusCode).toBe(ApplicationStatus.NOT_IMPLEMENTED);
  });
});
`;

const serviceContextNewLine = `  {{ApiNameUpper}} = "{{ApiName}}",`;

const routerPrefixToAdd = `
      .`;

export const templates = {
  controllerTemplate,
  useCaseTemplate,
  controllerContainerTemplate,
  addUseCaseContainerTemplate,
  importContainerTemplate,
  exportContainerTemplate,
  routeControllerTemplate,
  functionControllerTemplate,
  importControllerTemplate,
  testUseCaseTemplate,
  serviceContextNewLine,
  routerPrefixToAdd,
};
