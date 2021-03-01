import { IResult } from "result-tsk";
import { Resources } from "resources-tsk";

const BAD_REQUEST = "400";
const JOIN_SEPARATOR = ", ";

export class Validator {
  constructor(
    private resources: Resources,
    private resourceKey: string,
    private defaultErrorCode: number | string = BAD_REQUEST,
  ) {}

  isValidEntry(
    result: IResult,
    paramsToValidate: {
      // eslint-disable-next-line @typescript-eslint/ban-types
      [key: string]: string | number | undefined | null | object | CallableFunction[];
    },
    errorCode?: number | string,
  ): boolean {
    let isValid = true;
    const keysToValidate = Object.keys(paramsToValidate);
    const keysNotFound: string[] = [];
    keysToValidate.forEach((key) => {
      if (!paramsToValidate[key]) {
        keysNotFound.push(key);
      } else if (Array.isArray(paramsToValidate[key])) {
        const validations: CallableFunction[] = <CallableFunction[]>paramsToValidate[key];
        validations.forEach((validation) => {
          if (typeof validation !== "function") {
            throw new Error(
              "Validator-tsk only allows function arrays. It cannot pass object arrays.",
            );
          }
          const resultMessage = validation();
          if (resultMessage === null || resultMessage === true || resultMessage === "") {
            return;
          }
          if (typeof resultMessage === "string") {
            keysNotFound.push(resultMessage);
          } else {
            keysNotFound.push(key);
          }
        });
      }
    });
    if (keysNotFound.length > 0) {
      result.setError(
        this.resources.getWithParams(this.resourceKey, {
          missingParams: keysNotFound.join(JOIN_SEPARATOR),
        }),
        errorCode || this.defaultErrorCode,
      );
      isValid = false;
    }
    return isValid;
  }
}
