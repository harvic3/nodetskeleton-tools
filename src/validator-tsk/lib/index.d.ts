import { IResult } from "result-tsk";
import { Resources } from "resources-tsk";
export declare class Validator {
    private resources;
    private resourceKey;
    private defaultErrorCode;
    constructor(resources: Resources, resourceKey: string, defaultErrorCode?: number);
    IsValidEntry(result: IResult, paramsToValidate: {
        [key: string]: any;
    }): boolean;
}
