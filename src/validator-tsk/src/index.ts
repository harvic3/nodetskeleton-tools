import { IResult } from "result-tsk";
import { Resources } from "resources-tsk";

const BAD_REQUEST = 400;
const joinSeparator = ", ";

export class Validator {
  constructor(
    private resources: Resources,
    private resourceKey: string,
    private defaultErrorCode: number = BAD_REQUEST,
  ) {}
  IsValidEntry(
    result: IResult,
    paramsToValidate: {
      // eslint-disable-next-line @typescript-eslint/ban-types
      [key: string]: string | number | undefined | null | object | CallableFunction[];
    },
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
          const resultMessage = validation();
          if (resultMessage === null || resultMessage === "" || resultMessage === true) {
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
      result.SetError(
        this.resources.GetWithParams(this.resourceKey, {
          missingParams: keysNotFound.join(joinSeparator),
        }),
        this.defaultErrorCode,
      );
      isValid = false;
    }
    return isValid;
  }
}
