import { IResult } from "result-tsk";
import { Resources } from "resources-tsk";

const BAD_REQUEST = 400;

export class Validator {
  constructor(
    private resources: Resources,
    private resourceKey: string,
    private defaultErrorCode: number = BAD_REQUEST,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IsValidEntry(result: IResult, paramsToValidate: { [key: string]: any }): boolean {
    let isValid = true;
    const keysToValidate = Object.keys(paramsToValidate);
    const keysNotFound: string[] = [];
    keysToValidate.forEach((key) => {
      if (!paramsToValidate[key]) {
        keysNotFound.push(key);
      }
    });
    if (keysNotFound.length > 0) {
      isValid = false;
      result.SetError(
        this.resources.GetWithParams(this.resourceKey, {
          missingParams: keysNotFound.join(", "),
        }),
        this.defaultErrorCode,
      );
    }
    return isValid;
  }
}
