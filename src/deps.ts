import {AbstractClass, Class, createDependency, debug, Dependency, Lifetime} from "./util";

const dependencies = new Map<AbstractClass, Dependency>()
const instances = new Map<string, any>()

export function registerComponent<A, C>(
    type: AbstractClass<A>,
    constr: Class<C>,
    lifetime: Lifetime = Lifetime.SINGLETON,
    builder?: () => C
) {
    debug(`Registering component: ${type.name}`)
    if (!dependencies.has(type)) {
        const dependency = createDependency(lifetime, constr, builder)
        dependencies.set(type, dependency)
    } else {
        throw new Error(`A component for type ${type.name} has already been registered.`)
    }
}

export function registerInstance<T>(name: string, instance: T) {
    if (!instances.has(name))
        instances.set(name, instance)
    else
        throw new Error(`A dependency for type ${name} has already been registered.`)
}

/**
 * When given an abstract type, returns the associated concrete type given in `configureDI`
 * @param type
 */
export function findComponent<T>(type: AbstractClass<T>): Dependency | undefined {
    return dependencies.get(type)
}

export function findInstance<T>(name: string): T {
    return instances.get(name)
}
