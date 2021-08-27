import {configureDI, createInstance, Inject} from "../src";

class Dependency {
    private readonly id = Math.floor(Math.random() * 999999)
    get value(): number { return this.id }
}

class Dep1 {
    @Inject readonly dep: Dependency
    get value(): number { return this.dep.value }
}

class Dep2 {
    @Inject readonly dep: Dependency
    get value(): number { return this.dep.value }
}

describe('Singleton lifetime', () => {

    beforeAll(() => {
        configureDI((component) => {
            component(Dependency, Dependency)
        })
    })

    test('same value', () => {
        const dep1 = createInstance(Dep1)
        const dep2 = createInstance(Dep2)

        expect(dep1.value).toEqual(dep2.value)
    })

})

