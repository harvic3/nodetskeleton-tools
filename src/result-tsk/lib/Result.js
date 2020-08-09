"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResultDto_1 = require("./ResultDto");
var Result = /** @class */ (function () {
    function Result() {
    }
    Result.prototype.SetStatusCode = function (statusCode, success) {
        this.statusCode = statusCode;
        this.success = success;
    };
    Result.prototype.SetMessage = function (message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
        this.success = true;
    };
    Result.prototype.SetError = function (error, statusCode) {
        this.error = error;
        this.statusCode = statusCode;
        this.success = false;
    };
    Result.prototype.ToResultDto = function () {
        var result = new ResultDto_1.ResultDto();
        result.error = this.error;
        result.message = this.message;
        return result;
    };
    return Result;
}());
exports.default = Result;
