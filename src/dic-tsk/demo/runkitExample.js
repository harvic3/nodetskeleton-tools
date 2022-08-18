// You need a resources-tsk lib or build some like this.
const res_tsk = require("resources-tsk");

// local or remote resource
const localKeys = {
  DEPENDENCY_NOT_FOUNT: "DEPENDENCY_NOT_FOUNT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
};

const locals = {
  es: {
    DEPENDENCY_NOT_FOUNT: "El contenedor de dependencias no contiene {{className}}.",
    INTERNAL_ERROR: "Error interno.",
  },
  en: {
    DEPENDENCY_NOT_FOUNT: "di container don't has {{className}} dependency.",
    INTERNAL_ERROR: "Internal error.",
  },
};

const defaultLanguage = "en";

const resourceKeys = localKeys;

const appMessages = new res_tsk.Resources(locals, resourceKeys, defaultLanguage);

const applicationStatus = {
  INTERNAL_ERROR: "FF",
  SUCCESS: "00",
};
// Here finish your resources index file.

// In localization middleware
appMessages.init(defaultLanguage);
// SET it to "es" to see the language CHANGE

// Here init the index file for diContainer
const dicSettings = {
  internalErrorCode: INTERNAL_ERROR_CODE,
  interfaceBaseName: "KeyClassName.interface",
  classNameBase: "KeyClassName",
  appMessages,
  appErrorMessageKey: "DEPENDENCY_NOT_FOUNT",
  applicationStatus,
  applicationStatusCodeKey: "INTERNAL_ERROR",
};

const dic_tsk = require("dic-tsk");


const Message = (function () {
  function Message(message) {
    this.message = message;
  }
  Message.prototype.getMessage = function () {
    return this.message;
  };
  Message.prototype.print = function () {
    console.log(this.message);
  };
  return Message;
})();

const message = new Message("Hello Alien");

dic_tsk.default.addScoped("MessageClass", () => new Message("Hello Alien"));
const classInstance = dic_tsk.default.get("YourAdapterContext", "MessageClass");
console.log(classInstance.getMessage());
