"use strict";
exports.__esModule = true;
exports.getInstance = exports.registerInjectedInstanceProperty = exports.registerInjectedProperty = void 0;
var util_1 = require("./util");
var deps_1 = require("./deps");
var injectedProps = new Map();
var injectedInstanceProps = new Map();
function registerInjectedProperty(type, propertyKey, propertyType) {
    (0, util_1.debug)("Registering injected property " + type.name + "." + propertyKey + " of type " + propertyType);
    if (injectedProps.has(type)) {
        var props = injectedProps.get(type);
        props.push({ propertyKey: propertyKey, propertyType: propertyType });
    }
    else {
        injectedProps.set(type, [{ propertyKey: propertyKey, propertyType: propertyType }]);
    }
}
exports.registerInjectedProperty = registerInjectedProperty;
function registerInjectedInstanceProperty(type, propertyKey, instanceName) {
    (0, util_1.debug)("Registering injected instance property " + type.name + "." + propertyKey);
    var injectedProp = { propertyKey: propertyKey, instanceName: instanceName };
    if (injectedInstanceProps.has(type)) {
        var props = injectedInstanceProps.get(type);
        props.push(injectedProp);
    }
    else {
        injectedInstanceProps.set(type, [injectedProp]);
    }
}
exports.registerInjectedInstanceProperty = registerInjectedInstanceProperty;
function injectProps(type, instance) {
    var props = injectedProps.get(type) || [];
    for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
        var prop = props_1[_i];
        (0, util_1.debug)("Found injected property " + type.name + "." + prop.propertyKey + " of type " + prop.propertyType);
        var dependency = (0, deps_1.findComponent)(prop.propertyType);
        if (dependency) {
            switch (dependency.lifetime) {
                case util_1.Lifetime.SINGLETON: {
                    if (!dependency.singleton)
                        dependency.singleton = getInstance(dependency.constr, dependency.builder);
                    instance[prop.propertyKey] = dependency.singleton;
                    break;
                }
                case util_1.Lifetime.TRANSIENT: {
                    instance[prop.propertyKey] = getInstance(dependency.constr, dependency.builder);
                    break;
                }
            }
        }
        else {
            throw new Error("Did not find a suitable dependency for " + type.name + "." + prop.propertyKey);
        }
    }
}
function injectInstanceProps(type, instance) {
    var props = injectedInstanceProps.get(type) || [];
    for (var _i = 0, props_2 = props; _i < props_2.length; _i++) {
        var prop = props_2[_i];
        (0, util_1.debug)("Found injected instance property " + type.name + "." + prop.propertyKey + " with key " + prop.instanceName);
        var dependency = (0, deps_1.findInstance)(prop.instanceName);
        if (dependency) {
            instance[prop.propertyKey] = dependency;
        }
        else {
            throw new Error("Could not find Instance Dependency with name " + prop.instanceName);
        }
    }
}
function getInstance(type, builder) {
    (0, util_1.debug)("Constructing new instance of type " + type.name);
    var dep = (0, deps_1.findComponent)(type);
    if (dep) {
        switch (dep.lifetime) {
            case util_1.Lifetime.SINGLETON: {
                dep.singleton = builder ? builder() : new dep.constr();
                injectProps(dep.constr, dep.singleton);
                injectInstanceProps(dep.constr, dep.singleton);
                return dep.singleton;
            }
            case util_1.Lifetime.TRANSIENT: {
                var instance = builder ? builder() : new dep.constr();
                injectProps(dep.constr, instance);
                injectInstanceProps(dep.constr, instance);
                return instance;
            }
        }
    }
    else {
        var constr = type;
        var instance = builder ? builder() : new constr();
        injectProps(constr, instance);
        injectInstanceProps(constr, instance);
        return instance;
    }
}
exports.getInstance = getInstance;
