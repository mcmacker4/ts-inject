"use strict";
exports.__esModule = true;
exports.findInstance = exports.findComponent = exports.registerInstance = exports.registerComponent = void 0;
var util_1 = require("./util");
var dependencies = new Map();
var instances = new Map();
function registerComponent(type, actual, lifetime, builder) {
    if (lifetime === void 0) { lifetime = util_1.Lifetime.SINGLETON; }
    (0, util_1.debug)("Registering component: " + type.name);
    if (!dependencies.has(type))
        dependencies.set(type, { constr: actual, lifetime: lifetime, builder: builder });
    else
        throw new Error("A component for type " + type.name + " has already been registered.");
}
exports.registerComponent = registerComponent;
function registerInstance(name, instance) {
    if (!instances.has(name))
        instances.set(name, instance);
    else
        throw new Error("A dependency for type " + name + " has already been registered.");
}
exports.registerInstance = registerInstance;
function findComponent(constructor) {
    return dependencies.get(constructor);
}
exports.findComponent = findComponent;
function findInstance(name) {
    return instances.get(name);
}
exports.findInstance = findInstance;
