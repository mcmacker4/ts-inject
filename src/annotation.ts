import "reflect-metadata"

import {registerComponent, registerInstance} from "./deps";
import {registerInjectedInstanceProperty, registerInjectedProperty} from "./solver";
import {debug} from "./util";


/**
 * Configure the Dependency Injection.
 * This function accepts a callback with two arguments:
 *   - component: A function to associate an abstract type with a concrete type.
 *   - instance: A function to associate an instance with an ID
 * @param callback
 */
export function configureDI(callback: (component: typeof registerComponent, instance: typeof registerInstance) => void) {
    callback(registerComponent, registerInstance)
}

/**
 * This decorator marks a class property for injection.
 * The system will inject it with an instance of the concrete type associated with
 * the type of this property.
 */
export function Inject(target: any, propertyKey: string) {
    debug(`Called @Inject on ${target.constructor.name}.${propertyKey}`)
    const type = Reflect.getMetadata('design:type', target, propertyKey)
    registerInjectedProperty(target.constructor, propertyKey, type)
}

/**
 * This decorator marks a class property for injection.
 * The system will inject the instance associated with the given ID
 * into this property.
 * @param id
 * @constructor
 */
export function InjectInstance<T>(id: string) {
    return function(target: any, propertyKey: string) {
        debug(`Called @InjectInstance on ${target.constructor.name}.${propertyKey}`)
        registerInjectedInstanceProperty(target.constructor, propertyKey, id)
    }
}