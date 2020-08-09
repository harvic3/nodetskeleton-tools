import { IResult } from "../../result-tsk/src/Result.interface";
import { Resources } from "../../resources-tsk/src/Resources";
export declare class Validator {
    private resources;
    private resourceKeys;
    private defaultErrorCode;
    constructor(resources: Resources, resourceKeys: {
        [key: string]: string;
    }, defaultErrorCode?: number);
    IsValidEntry(result: IResult, paramsToValidate: {
        [key: string]: any;
    }): boolean;
}
