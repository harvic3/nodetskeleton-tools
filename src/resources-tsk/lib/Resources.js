"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resources = void 0;
var Resources = /** @class */ (function () {
    function Resources(locals, localKeys, defaultLanguage) {
        var _this = this;
        this.defaultLanguage = null;
        this.language = null;
        this.locals = null;
        this.locals = locals;
        this.resourceKeys = localKeys;
        this.defaultLanguage = defaultLanguage;
        if (!this.locals[defaultLanguage]) {
            throw new Error("Default language not found in local resources.");
        }
        var keysToCheck = Object.keys(this.resourceKeys);
        var langToCheck = Object.keys(locals);
        var notFindedResources = [];
        keysToCheck.forEach(function (key) {
            langToCheck.forEach(function (lang) {
                if (!_this.locals[lang][key]) {
                    notFindedResources.push(lang + ": " + key);
                }
            });
        });
        if (notFindedResources.length > 0) {
            throw new Error("The messages for " + notFindedResources.join(", ") + " was not found in local resources.");
        }
    }
    Resources.prototype.Init = function (language) {
        if (!this.locals[language]) {
            console.log("Accept-Language \"" + language + "\" not found in locals resource.");
            return;
        }
        this.language = language;
    };
    Resources.prototype.Get = function (resourceName) {
        if (this.locals[this.language] && this.locals[this.language][resourceName]) {
            return this.locals[this.language][resourceName];
        }
        if (this.locals[this.defaultLanguage] &&
            this.locals[this.defaultLanguage][resourceName]) {
            return this.locals[this.defaultLanguage][resourceName];
        }
        throw new Error("Resource " + resourceName + " not found in any local resource.");
    };
    Resources.prototype.GetWithParams = function (resourceName, params) {
        var resource;
        if (this.locals[this.language] && this.locals[this.language][resourceName]) {
            resource = this.locals[this.language][resourceName];
        }
        else if (this.locals[this.defaultLanguage] &&
            this.locals[this.defaultLanguage][resourceName]) {
            resource = this.locals[this.defaultLanguage][resourceName];
        }
        if (!resource) {
            throw new Error("Resource " + resourceName + " not found in any local resource.");
        }
        var keys = Object.keys(params);
        keys.forEach(function (key) {
            var pattern = "({{)" + key + "(}})";
            var regex = RegExp(pattern);
            if (regex.test(resource)) {
                while (regex.test(resource)) {
                    resource = resource.replace("{{" + key + "}}", params[key]);
                }
            }
        });
        return resource;
    };
    return Resources;
}());
exports.Resources = Resources;
