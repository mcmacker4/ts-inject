"use strict";
exports.__esModule = true;
exports.debug = exports.Lifetime = void 0;
var Lifetime;
(function (Lifetime) {
    Lifetime[Lifetime["SINGLETON"] = 0] = "SINGLETON";
    Lifetime[Lifetime["TRANSIENT"] = 1] = "TRANSIENT";
})(Lifetime = exports.Lifetime || (exports.Lifetime = {}));
// noinspection JSUnusedLocalSymbols
var debug = function (format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
};
exports.debug = debug;
try {
    exports.debug = require('debug')('ts-inject');
}
catch (e) { }
