"use strict";
exports.__esModule = true;
exports.InjectInstance = exports.Inject = exports.configureDI = void 0;
require("reflect-metadata");
var deps_1 = require("./deps");
var solver_1 = require("./solver");
var util_1 = require("./util");
function configureDI(callback) {
    callback(deps_1.registerComponent, deps_1.registerInstance);
}
exports.configureDI = configureDI;
function Inject(target, propertyKey) {
    (0, util_1.debug)("Called @Inject on " + target.constructor.name + "." + propertyKey);
    var type = Reflect.getMetadata('design:type', target, propertyKey);
    (0, solver_1.registerInjectedProperty)(target.constructor, propertyKey, type);
}
exports.Inject = Inject;
function InjectInstance(name) {
    return function (target, propertyKey) {
        (0, util_1.debug)("Called @InjectInstance on " + target.constructor.name + "." + propertyKey);
        (0, solver_1.registerInjectedInstanceProperty)(target.constructor, propertyKey, name);
    };
}
exports.InjectInstance = InjectInstance;
