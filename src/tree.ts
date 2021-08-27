import {AbstractClass, ArgsBuilder, Class, debug, Dependency} from "./util";

const nodes = new Map<string, Dependency>()

export function registerComponent<A, C>(type: AbstractClass<A>, actual: Class<C>, args: any[] | ArgsBuilder | undefined = undefined) {
    debug(`Registering component: ${type.name}`)
    if (!nodes.has(type.name))
        nodes.set(type.name, { constr: actual, args })
    else
        throw new Error(`A component for type ${type.name} has already been registered.`)
}

export function findComponent<T>(name: string): Dependency | undefined {
    return nodes.get(name)
}
