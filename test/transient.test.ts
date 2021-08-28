import {configureDI, getInstance, Inject, Lifetime} from "../src";

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

describe('Transient lifetime', () => {

    beforeAll(() => {
        configureDI((component) => {
            component(Dependency, Dependency, Lifetime.TRANSIENT)
        })
    })

    test('same value', () => {
        const dep1 = getInstance(Dep1)
        const dep2 = getInstance(Dep2)

        expect(dep1.value).not.toEqual(dep2.value)
    })

})
