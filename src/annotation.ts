import "reflect-metadata"

import {registerComponent} from "./tree";
import {registerInjectedProperty} from "./solver";
import {debug} from "./util";

export type ConfiguratorFn = (register: typeof registerComponent) => void

export function configureDI(callback: ConfiguratorFn) {
    callback(registerComponent)
}

export function Inject<T>(target: any, propertyKey: string) {
    debug(`Called @Inject on ${target.constructor.name}.${propertyKey}`)
    const type = Reflect.getMetadata('design:type', target, propertyKey)
    registerInjectedProperty(target.constructor.name, propertyKey, type.name)
}