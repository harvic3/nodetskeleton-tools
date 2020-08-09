"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Mapper = /** @class */ (function () {
    function Mapper() {
    }
    Mapper.prototype.MapObject = function (source, destination) {
        if (!source) {
            return destination;
        }
        var keys = Object.keys(destination);
        keys.forEach(function (key) {
            if (typeof destination[key] === "boolean") {
                destination[key] = source[key];
            }
            else {
                destination[key] = source[key] || null;
            }
        });
        return destination;
    };
    Mapper.prototype.MapArray = function (source, activator) {
        var _this = this;
        var destination = [];
        if ((source === null || source === void 0 ? void 0 : source.length) === 0) {
            return destination;
        }
        source.forEach(function (sElement) {
            var dElement = activator();
            destination.push(_this.MapObject(sElement, dElement));
        });
        return destination;
    };
    Mapper.prototype.Activator = function (type) {
        return new type();
    };
    return Mapper;
}());
var mapper = new Mapper();
exports.default = mapper;
