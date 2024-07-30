import { ApplicationError } from "../src/errors/ApplicationError";
import { Resources } from "resources-tsk";
import tsKernel from "../src/index";

enum LocaleTypeEnum {
  ES = "es",
  EN = "en",
}

interface IMessageClass {
  getMessage(): string;
  print(): void;
}

class MessageClass {
  constructor(private readonly message: string) {}

  getMessage(): string {
    return this.message;
  }

  print(): void {
    console.log(this.message);
  }
}

// Constants
const CONTEXT = "TsKernelTest";
const INTERNAL_ERROR_CODE = "FF";

enum KeysDictionaryEnum {
  DEPENDENCY_NOT_FOUND = "DEPENDENCY_NOT_FOUND",
  INTERNAL_ERROR = "INTERNAL_ERROR",
};

type LocalMessageDictionary = { [key in keyof typeof KeysDictionaryEnum]: string };

const locales = {
  [LocaleTypeEnum.ES]: {
    DEPENDENCY_NOT_FOUND: "El contenedor de dependencias no contiene '{{className}}'.",
    INTERNAL_ERROR: "Error interno.",
  },
  [LocaleTypeEnum.EN]: {
    DEPENDENCY_NOT_FOUND: "di container don't has '{{className}}' dependency.",
    INTERNAL_ERROR: "Internal error.",
  },
};

const appMessages = new Resources<LocaleTypeEnum, KeysDictionaryEnum, LocalMessageDictionary, typeof locales>(locales, KeysDictionaryEnum, LocaleTypeEnum.EN);

const applicationStatus: Record<string, string> = {
  INTERNAL_ERROR: "FF",
  SUCCESS: "00",
};

const dicSettings = {
  internalErrorCode: INTERNAL_ERROR_CODE,
  interfaceBaseName: "KeyClassName.interface",
  classNameBase: "KeyClassName",
  appMessages,
  appErrorMessageKey: "DEPENDENCY_NOT_FOUND",
  applicationStatus,
  applicationStatusCodeKey: "INTERNAL_ERROR",
};

describe("when use dic", () => {
  beforeEach(() => {
    // use default settings
    tsKernel.init();
  });
  it("if dic has not been initialized so it should works with default settings", () => {
    const message = "Hello World";
    tsKernel.addScoped(MessageClass.name, () => new MessageClass(message));
    const classInstance = tsKernel.get<IMessageClass>(CONTEXT, MessageClass.name);
    expect(classInstance.getMessage()).toBe(message);
  });
  it("if dic has not a class inside so it should throw an error", () => {
    expect(() => tsKernel.get<IMessageClass>(CONTEXT, "MessageClassWrong")).toThrowError(
      new ApplicationError(
        CONTEXT,
        "'MessageClassWrong' not found in dependencies container.",
        INTERNAL_ERROR_CODE,
      ),
    );
  });
  it("if dic has not a class inside so it should throw an error with user settings way", () => {
    tsKernel.init(dicSettings);
    expect(() => tsKernel.get<IMessageClass>(CONTEXT, "MessageClassWrong")).toThrowError(
      new ApplicationError(
        CONTEXT,
        "di container don't has 'MessageClassWrong' dependency.",
        INTERNAL_ERROR_CODE,
      ),
    );
  });
  it("if use classToInterfaceName method so it should works", () => {
    const message = "Hello World";
    tsKernel.addScoped(
      tsKernel.classToInterfaceName(MessageClass.name),
      () => new MessageClass(message),
    );
    const classInstance = tsKernel.get<IMessageClass>(
      CONTEXT,
      tsKernel.classToInterfaceName(MessageClass.name),
    );
    expect(classInstance.getMessage()).toBe(message);
  });
  it("if dic has been initialized so it should be works with user settings", () => {
    const message = "Hello World";
    tsKernel.init(dicSettings);
    tsKernel.addScoped(MessageClass.name, () => new MessageClass(message));
    const classInstance = tsKernel.get<IMessageClass>(CONTEXT, MessageClass.name);
    expect(classInstance.getMessage()).toBe(message);
  });
  it("if use classToInterfaceName method with settings way so it should works", () => {
    const message = "Hello World";
    tsKernel.init(dicSettings);
    tsKernel.addScoped(
      tsKernel.classToInterfaceName(MessageClass.name),
      () => new MessageClass(message),
    );
    const classInstance = tsKernel.get<IMessageClass>(
      CONTEXT,
      tsKernel.classToInterfaceName(MessageClass.name),
    );
    expect(classInstance.getMessage()).toBe(message);
  });
});
