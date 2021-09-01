import {getInstance, configureDI} from "../src";


abstract class IDependency {
    abstract readonly id: number
}

class Dependency extends IDependency {
    readonly id = Math.floor(Math.random() * 99999)
}

beforeAll(() => {
    configureDI((component) => {
        component(IDependency, Dependency)
    })
})


test('singleton instance', () => {
    const i1 = getInstance(IDependency)
    const i2 = getInstance(IDependency)

    expect(i1).toEqual(i2)
    expect(i1.id).toEqual(i2.id)
})