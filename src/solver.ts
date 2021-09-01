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
        instance[prop.propertyKey] = resolveDependency(prop.propertyType)
    }
}

export function injectInstanceProps<T, I>(type: Class<T>, instance: I) {
    const props = injectedInstanceProps.get(type) || []
    for (let prop of props) {
        debug(`Found injected instance property ${type.name}.${prop.propertyKey} with key ${prop.instanceName}`)
        instance[prop.propertyKey] = resolveInstanceDependency(prop.instanceName)
    }
}

/**
 * Given an ID, returns the associated instance dependency
 * (as configured with `configureDI`).
 * @param name
 */
export function resolveInstanceDependency<T>(name: string): T {
    const dependency = findInstance<T>(name)
    if (!dependency)
        throw new Error(`"${name}" is not a registered instance dependency`)
    return dependency
}

/**
 * Given an abstract type, returns an instance of its associated concrete type
 * (as configured with `configureDI`).
 * @param type
 */
export function resolveDependency<T>(type: AbstractClass<T>) {
    const dependency = findComponent<T>(type)
    if (!dependency)
        throw new Error(`${type} is not a registered dependency.`)
    debug(`Dependency Found for ${type}: ${dependency.constr}`)
    return dependency.getInstance()
}

/**
 * Given a class, creates a new instance of the class (using `builder` if provided)
 * and injects all dependencies marked with `@Inject` or `@InjectInstance(id)`.
 * @param type
 * @param builder
 */
export function getInstance<T>(type: Class<T>, builder?: () => T): T {
    debug(`Constructing a new instance of type ${type.name}`)
    const instance = builder ? builder() : new type()
    injectProps(type, instance)
    injectInstanceProps(type, instance)
    return instance
}
