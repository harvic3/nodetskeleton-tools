"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
var BAD_REQUEST = 400;
var Validator = /** @class */ (function () {
    function Validator(resources, resourceKey, defaultErrorCode) {
        if (defaultErrorCode === void 0) { defaultErrorCode = BAD_REQUEST; }
        this.resources = resources;
        this.resourceKey = resourceKey;
        this.defaultErrorCode = defaultErrorCode;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Validator.prototype.IsValidEntry = function (result, paramsToValidate) {
        var isValid = true;
        var keysToValidate = Object.keys(paramsToValidate);
        var keysNotFound = [];
        keysToValidate.forEach(function (key) {
            if (!paramsToValidate[key]) {
                keysNotFound.push(key);
            }
            else if (Array.isArray(paramsToValidate[key])) {
                var validations = paramsToValidate[key];
                validations.forEach(function (validation) {
                    var resultMessage = validation();
                    if (resultMessage) {
                        keysNotFound.push(resultMessage);
                    }
                });
            }
        });
        if (keysNotFound.length > 0) {
            isValid = false;
            result.SetError(this.resources.GetWithParams(this.resourceKey, {
                missingParams: keysNotFound.join(", "),
            }), this.defaultErrorCode);
        }
        return isValid;
    };
    return Validator;
}());
exports.Validator = Validator;
