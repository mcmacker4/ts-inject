import "reflect-metadata"

import {registerComponent, registerInstance} from "./deps";
import {registerInjectedInstanceProperty, registerInjectedProperty} from "./solver";
import {debug} from "./util";

export function configureDI(callback: (component: typeof registerComponent, instance: typeof registerInstance) => void) {
    callback(registerComponent, registerInstance)
}

export function Inject(target: any, propertyKey: string) {
    debug(`Called @Inject on ${target.constructor.name}.${propertyKey}`)
    const type = Reflect.getMetadata('design:type', target, propertyKey)
    registerInjectedProperty(target.constructor.name, propertyKey, type.name)
}

export function InjectInstance<T>(name: string) {
    return function(target: any, propertyKey: string) {
        debug(`Called @InjectInstance on ${target.constructor.name}.${propertyKey}`)
        registerInjectedInstanceProperty(target.constructor.name, propertyKey, name)
    }
}