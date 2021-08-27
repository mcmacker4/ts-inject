import {ArgsBuilder, Class, debug} from "./util";
import {findComponent} from "./tree";

interface InjectedProp {
    className: string
    propertyKey: string
    propertyType: string
}

const injectedProps = new Map<string, InjectedProp[]>()

export function registerInjectedProperty(className: string, propertyKey: string, propertyType: string) {
    debug(`Registering injected property ${className}.${propertyKey} of type ${propertyType}`)
    if (injectedProps.has(className)) {
        const props = injectedProps.get(className)!
        props.push({ className, propertyKey, propertyType })
    } else {
        injectedProps.set(className, [{ className, propertyKey, propertyType }])
    }
}


export function createInstance<T>(constructor: Class<T>, args: any[] | ArgsBuilder | undefined = undefined): T {
    debug(`Constructing new instance of type ${constructor.name}`)
    const props = injectedProps.get(constructor.name) || []
    const instance = new constructor(args instanceof Function ? args() : args)
    for (let prop of props) {
        debug(`Found injected property ${prop.className}.${prop.propertyKey} of type ${prop.propertyType}`)
        const suitable = findComponent(prop.propertyType)
        if (suitable) {
            debug(`A suitable constructor would be ${suitable.constr.name}`)
            const args = (suitable.args instanceof Function ? suitable.args() : suitable.args) || []
            instance[prop.propertyKey] = new suitable.constr(...args)
        } else {
            throw new Error(`Did not find a suitable dependency for ${prop.className}.${prop.propertyKey}`)
        }
    }
    return instance
}
