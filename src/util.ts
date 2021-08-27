
export type Class<T = any> = { new(...args: any[]): T }
export type AbstractClass<T = any> = Function & { prototype: T }

export enum Lifetime {
    SINGLETON,
    TRANSIENT
}

export interface Dependency<T = any> {
    constr: Class<T>
    lifetime: Lifetime
    builder?: () => T
    singleton?: T
}

export let debug = (format: any, ...args: any[]) => {}

try {
    debug = require('debug')('ts-inject')
} catch (e) {}