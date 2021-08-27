import {AbstractClass, Class, debug} from "./util";

const nodes = new Map<string, Class>()

export function registerComponent<A, C>(type: AbstractClass<A>, actual: Class<C>) {
    debug(`Registering ${type.name}`)
    if (!nodes.has(type.name))
        nodes.set(type.name, actual)
    else
        throw new Error(`A component for type ${type.name} has already been registered.`)
}

export function findComponent<T>(name: string): Class<T> | undefined {
    return nodes.get(name)
}
