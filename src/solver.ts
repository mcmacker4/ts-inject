import {AbstractClass, Class, debug, Lifetime} from "./util";
import {findComponent, findInstance} from "./deps";

interface InjectedProp<T = any> {
    propertyKey: string
    propertyType: AbstractClass<T>
}

interface InjectedInstanceProp {
    propertyKey: string
    instanceName: string
}

const injectedProps = new Map<Class, InjectedProp[]>()
const injectedInstanceProps = new Map<Class, InjectedInstanceProp[]>()

export function registerInjectedProperty<T, P>(type: Class<T>, propertyKey: string, propertyType: Class<P>) {
    debug(`Registering injected property ${type.name}.${propertyKey} of type ${propertyType}`)
    if (injectedProps.has(type)) {
        const props = injectedProps.get(type)!
        props.push({ propertyKey, propertyType })
    } else {
        injectedProps.set(type, [{ propertyKey, propertyType }])
    }
}

export function registerInjectedInstanceProperty(type: Class, propertyKey: string, instanceName: string) {
    debug(`Registering injected instance property ${type.name}.${propertyKey}`)
    const injectedProp: InjectedInstanceProp = { propertyKey, instanceName}
    if (injectedInstanceProps.has(type)) {
        const props = injectedInstanceProps.get(type)!
        props.push(injectedProp)
    } else {
        injectedInstanceProps.set(type, [injectedProp])
    }
}

function injectProps<T>(constructor: Class<T>, instance: any) {
    const props = injectedProps.get(constructor) || []
    for (let prop of props) {
        debug(`Found injected property ${constructor.name}.${prop.propertyKey} of type ${prop.propertyType}`)
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
            throw new Error(`Did not find a suitable dependency for ${constructor.name}.${prop.propertyKey}`)
        }
    }
}

function injectInstanceProps<T, I>(constructor: Class<T>, instance: I) {
    const props = injectedInstanceProps.get(constructor) || []
    for (let prop of props) {
        debug(`Found injected instance property ${constructor.name}.${prop.propertyKey} with key ${prop.instanceName}`)
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
    const dep = findComponent(constructor)
    if (dep && dep.lifetime == Lifetime.SINGLETON) {
        if (!dep.singleton) {
            dep.singleton = builder ? builder() : new constructor()
            injectProps(constructor, dep.singleton)
            injectInstanceProps(constructor, dep.singleton)
        }
        return dep.singleton
    } else {
        const instance = builder ? builder() : new constructor()
        injectProps(constructor, instance)
        injectInstanceProps(constructor, instance)
        return instance
    }
}
