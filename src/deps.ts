import {AbstractClass, Class, debug, Dependency, Lifetime} from "./util";

const dependencies = new Map<AbstractClass, Dependency>()
const instances = new Map<string, any>()

export function registerComponent<A, C>(
    type: AbstractClass<A>,
    actual: Class<C>,
    lifetime: Lifetime = Lifetime.SINGLETON,
    builder?: () => C
) {
    debug(`Registering component: ${type.name}`)
    if (!dependencies.has(type))
        dependencies.set(type, { constr: actual, lifetime, builder })
    else
        throw new Error(`A component for type ${type.name} has already been registered.`)
}

export function registerInstance<T>(name: string, instance: T) {
    if (!instances.has(name))
        instances.set(name, instance)
    else
        throw new Error(`A dependency for type ${name} has already been registered.`)
}

export function findComponent<T>(constructor: AbstractClass<T>): Dependency | undefined {
    return dependencies.get(constructor)
}

export function findInstance<T>(name: string): any {
    return instances.get(name)
}
