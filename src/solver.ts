import {Class, debug, Lifetime} from "./util";
import {findComponent, findInstance} from "./deps";

interface InjectedProp {
    className: string
    propertyKey: string
    propertyType: string
}

interface InjectedInstanceProp {
    className: string
    propertyKey: string
    instanceName: string
}

const injectedProps = new Map<string, InjectedProp[]>()
const injectedInstanceProps = new Map<string, InjectedInstanceProp[]>()

export function registerInjectedProperty(className: string, propertyKey: string, propertyType: string) {
    debug(`Registering injected property ${className}.${propertyKey} of type ${propertyType}`)
    if (injectedProps.has(className)) {
        const props = injectedProps.get(className)!
        props.push({ className, propertyKey, propertyType })
    } else {
        injectedProps.set(className, [{ className, propertyKey, propertyType }])
    }
}

export function registerInjectedInstanceProperty(className: string, propertyKey: string, instanceName: string) {
    debug(`Registering injected instance property ${className}.${propertyKey}`)
    const injectedProp: InjectedInstanceProp = { className, propertyKey, instanceName}
    if (injectedInstanceProps.has(className)) {
        const props = injectedInstanceProps.get(className)!
        props.push(injectedProp)
    } else {
        injectedInstanceProps.set(className, [injectedProp])
    }
}

function injectProps<T>(className: string, instance: any) {
    const props = injectedProps.get(className) || []
    for (let prop of props) {
        debug(`Found injected property ${prop.className}.${prop.propertyKey} of type ${prop.propertyType}`)
        const dependency = findComponent(prop.propertyType)
        if (dependency) {
            switch (dependency.lifetime) {
                case Lifetime.SINGLETON: {
                    if (!dependency.singleton)
                        dependency.singleton = getInstance(dependency.constr, dependency.builder)
                    instance[prop.propertyKey] = dependency.singleton
                    break
                }
                case Lifetime.TRANSIENT: {
                    instance[prop.propertyKey] = getInstance(dependency.constr, dependency.builder)
                    break
                }
            }
        } else {
            throw new Error(`Did not find a suitable dependency for ${prop.className}.${prop.propertyKey}`)
        }
    }
}

function injectInstanceProps(className: string, instance: any) {
    const props = injectedInstanceProps.get(className) || []
    for (let prop of props) {
        debug(`Found injected instance property ${prop.className}.${prop.propertyKey} with key ${prop.instanceName}`)
        const dependency = findInstance(prop.instanceName)
        if (dependency) {
            instance[prop.propertyKey] = dependency
        } else {
            throw new Error(`Could not find Instance Dependency with name ${prop.instanceName}`)
        }
    }
}

export function getInstance<T>(constructor: Class<T>, builder?: () => T): T {
    debug(`Constructing new instance of type ${constructor.name}`)
    const dep = findComponent(constructor.name)
    if (dep && dep.lifetime == Lifetime.SINGLETON) {
        if (!dep.singleton) {
            dep.singleton = builder ? builder() : new constructor()
            injectProps(constructor.name, dep.singleton)
            injectInstanceProps(constructor.name, dep.singleton)
        }
        return dep.singleton
    } else {
        const instance = builder ? builder() : new constructor()
        injectProps(constructor.name, instance)
        injectInstanceProps(constructor.name, instance)
        return instance
    }
}
