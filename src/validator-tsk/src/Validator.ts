import { IResult } from "../../result-tsk/src/Result.interface";
import { Resources } from "../../resources-tsk/src/Resources";

const BAD_REQUEST = 400;

export class Validator {
  constructor(
    private resources: Resources,
    private resourceKeys: { [key: string]: string },
    private defaultErrorCode: number = BAD_REQUEST,
  ) {}
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
        this.resources.GetWithParams(this.resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
          missingParams: keysNotFound.join(", "),
        }),
        this.defaultErrorCode,
      );
    }
    return isValid;
  }
}
