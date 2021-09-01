import {AbstractClass, Class, debug} from "./util";
import {findComponent, findInstance} from "./deps";

interface InjectedProp<T = any> {
    propertyKey: string
    propertyType: AbstractClass<T>
}

interface InjectedInstanceProp {
    propertyKey: string
    instanceName: string
}

/**
 * Collection of classes and their `@Inject` properties
 */
const injectedProps = new Map<Class, InjectedProp[]>()
/**
 * Collection of classes and their `@InjectInstance` properties
 */
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

export function registerInjectedInstanceProperty<T>(type: Class<T>, propertyKey: string, instanceName: string) {
    debug(`Registering injected instance property ${type.name}.${propertyKey}`)
    const injectedProp: InjectedInstanceProp = { propertyKey, instanceName}
    if (injectedInstanceProps.has(type)) {
        const props = injectedInstanceProps.get(type)!
        props.push(injectedProp)
    } else {
        injectedInstanceProps.set(type, [injectedProp])
    }
}

export function injectProps<T>(type: Class<T>, instance: T) {
    const props = injectedProps.get(type) || []
    for (let prop of props) {
        debug(`Found injected property ${type.name}.${prop.propertyKey} of type ${prop.propertyType}`)
        const dependency = findComponent(prop.propertyType)
        if (dependency) {
            instance[prop.propertyKey] = dependency.getInstance()
        } else {
            throw new Error(`Did not find a suitable dependency for ${type.name}.${prop.propertyKey}`)
        }
    }
}

export function injectInstanceProps<T, I>(type: Class<T>, instance: I) {
    const props = injectedInstanceProps.get(type) || []
    for (let prop of props) {
        debug(`Found injected instance property ${type.name}.${prop.propertyKey} with key ${prop.instanceName}`)
        const dependency = findInstance(prop.instanceName)
        if (dependency) {
            instance[prop.propertyKey] = dependency
        } else {
            throw new Error(`Could not find Instance Dependency with name ${prop.instanceName}`)
        }
    }
}

export function getInstance<T>(type: AbstractClass<T> | Class<T>, builder?: () => T): T {
    debug(`Constructing a new instance of type ${type.name}`)
    const dependency = findComponent<T>(type)
    if (dependency) {
        debug(`Dependency Found for ${type}: ${dependency.constr}`)
        return dependency.getInstance()
    } else {
        debug(`No dependency found for ${type}. Creating new instance.`)
        const constr = type as Class<T>
        const instance = builder ? builder() : new constr()
        injectProps(constr, instance)
        injectInstanceProps(constr, instance)
        return instance
    }
}
