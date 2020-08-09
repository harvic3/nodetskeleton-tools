"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
var BAD_REQUEST = 400;
var Validator = /** @class */ (function () {
    function Validator(resources, resourceKeys, defaultErrorCode) {
        if (defaultErrorCode === void 0) { defaultErrorCode = BAD_REQUEST; }
        this.resources = resources;
        this.resourceKeys = resourceKeys;
        this.defaultErrorCode = defaultErrorCode;
    }
    Validator.prototype.IsValidEntry = function (result, paramsToValidate) {
        var isValid = true;
        var keysToValidate = Object.keys(paramsToValidate);
        var keysNotFound = [];
        keysToValidate.forEach(function (key) {
            if (!paramsToValidate[key]) {
                keysNotFound.push(key);
            }
        });
        if (keysNotFound.length > 0) {
            isValid = false;
            result.SetError(this.resources.GetWithParams(this.resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
                missingParams: keysNotFound.join(", "),
            }), this.defaultErrorCode);
        }
        return isValid;
    };
    return Validator;
}());
exports.Validator = Validator;
