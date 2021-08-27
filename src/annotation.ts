import "reflect-metadata"

import {registerComponent} from "./tree";
import {registerInjectedProperty} from "./solver";

export type ConfiguratorFn = (register: typeof registerComponent) => void

export function configureDI(callback: ConfiguratorFn) {
    callback(registerComponent)
}

export function Inject<T>(target: any, propertyKey: string) {
    const type = Reflect.getMetadata('design:type', target, propertyKey)
    registerInjectedProperty(target.constructor, propertyKey, type)
}
