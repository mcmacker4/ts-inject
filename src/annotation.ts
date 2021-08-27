import "reflect-metadata"

import {Constructor} from "./util";
import {registerComponent} from "./tree";
import {registerInjectedProperty} from "./solver";


export function Component<T extends Constructor>(constructor: T) {
    registerComponent(constructor)
}

export function Inject<T>(target: any, propertyKey: string) {
    const type = Reflect.getMetadata('design:type', target, propertyKey)
    registerInjectedProperty(target.constructor, propertyKey, type)
}
