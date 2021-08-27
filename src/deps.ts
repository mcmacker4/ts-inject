import {AbstractClass, ArgsBuilder, Class, debug, Dependency} from "./util";

const dependencies = new Map<string, Dependency>()
const instances = new Map<string, any>()

export function registerComponent<A, C>(type: AbstractClass<A>, actual: Class<C>, args: any[] | ArgsBuilder | undefined = undefined) {
    debug(`Registering component: ${type.name}`)
    if (!dependencies.has(type.name))
        dependencies.set(type.name, { constr: actual, args })
    else
        throw new Error(`A component for type ${type.name} has already been registered.`)
}

export function registerInstance<T>(name: string, instance: T) {
    if (!instances.has(name))
        instances.set(name, instance)
    else
        throw new Error(`A dependency for type ${name} has already been registered.`)
}

export function findComponent<T>(name: string): Dependency | undefined {
    return dependencies.get(name)
}

export function findInstance<T>(name: string): any {
    return instances.get(name)
}
