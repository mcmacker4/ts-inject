import {injectInstanceProps, injectProps} from "./solver";

export type Class<T = any> = { new(...args: any[]): T }
export type AbstractClass<T = any> = Function & { prototype: T }

export enum Lifetime {
    SINGLETON,
    TRANSIENT
}

export abstract class Dependency<T = any> {
    readonly constr: Class<T>
    readonly builder?: () => T

    constructor(constr: Class<T>, builder?: () => T) {
        this.constr = constr
        this.builder = builder
    }

    protected createInstance(): T {
        const instance = this.builder ? this.builder() : new this.constr()
        injectProps(this.constr, instance)
        injectInstanceProps(this.constr, instance)
        return instance
    }

    abstract getInstance(): T
}

export class SingletonDependency<T = any> extends Dependency<T> {
    private instance: T | null = null

    getInstance(): T {
        if (!this.instance)
            this.instance = this.createInstance()
        return this.instance
    }
}

class TransientDependency<T = any> extends Dependency<T> {
    getInstance(): any {
        return this.createInstance()
    }
}

function createSingletonDependency<T>(constr: Class<T>, builder?: () => T): Dependency<T> {
    return new SingletonDependency(constr, builder)
}

function createTransientDependency<T>(constr: Class<T>, builder?: () => T): Dependency<T> {
    return new TransientDependency(constr, builder)
}

export function createDependency<T>(lifetime: Lifetime, constr: Class<T>, builder?: () => T): Dependency<T> {
    switch (lifetime) {
        case Lifetime.SINGLETON:
            return createSingletonDependency(constr, builder)
        case Lifetime.TRANSIENT:
            return createTransientDependency(constr, builder)
    }
}


// noinspection JSUnusedLocalSymbols
export let debug = (format: any, ...args: any[]) => {}

try {
    debug = require('debug')('ts-inject')
} catch (e) {}