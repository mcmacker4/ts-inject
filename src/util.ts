
export type Class<T = any> = { new(...args: any[]): T }
export type AbstractClass<T = any> = Function & { prototype: T }

export let debug = (format: any, ...args: any[]) => {}

try {
    debug = require('debug')('ts-inject')
} catch (e) {}