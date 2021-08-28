import {getInstance, configureDI} from "../src";


class Dependency {
    readonly id = Math.floor(Math.random() * 99999)
}

beforeAll(() => {
    configureDI((component) => {
        component(Dependency, Dependency)
    })
})


test('singleton instance', () => {
    const i1 = getInstance(Dependency)
    const i2 = getInstance(Dependency)

    expect(i1).toEqual(i2)
    expect(i1.id).toEqual(i2.id)
})