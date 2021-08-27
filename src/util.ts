
export type Class<T = any> = { new(...args: any[]): T }
export type AbstractClass<T = any> = Function & { prototype: T }

export type ArgsBuilder = () => any[]

export interface Dependency<T = any> {
    constr: Class<T>,
    args?: any[] | ArgsBuilder
}

export let debug = (format: any, ...args: any[]) => {}

try {
    debug = require('debug')('ts-inject')
} catch (e) {}