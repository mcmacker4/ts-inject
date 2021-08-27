import {Class, debug} from "./util";
import {findComponent} from "./tree";

interface InjectedProp {
    constructor: Class
    propertyKey: string
    propertyType: Class
}

const injectedProps = new Map<string, InjectedProp[]>()

export function registerInjectedProperty(constructor: Class, propertyKey: string, propertyType: Class) {
    debug(`Registering injected property ${constructor.name}.${propertyKey} of type ${propertyType.name}`)
    if (injectedProps.has(constructor.name)) {
        const props = injectedProps.get(constructor.name)!
        props.push({ constructor, propertyKey, propertyType })
    } else {
        injectedProps.set(constructor.name, [{ constructor, propertyKey, propertyType }])
    }
}

export function construct<T>(constructor: Class<T>): T {
    debug(`Constructing new instance of type ${constructor.name}`)

    const props = injectedProps.get(constructor.name) || []
    const instance = new constructor()

    for (let prop of props) {
        debug(`Found injected property ${prop.constructor.name}.${prop.propertyKey} of type ${prop.propertyType.name}`)
        const suitable = findComponent(prop.propertyType.name)
        if (suitable) {
            debug(`A suitable constructor would be ${suitable.name}`)
            instance[prop.propertyKey] = construct(suitable)
        } else {
            throw new Error(`Did not find a suitable dependency for ${prop.constructor.name}.${prop.propertyKey}`)
        }
    }

    return instance
}