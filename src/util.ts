export type Constructor<T = any> = { new(): T }

export let debug = (format: any, ...args: any[]) => {}

try {
    debug = require('debug')('ts-inject')
} catch (e) {}