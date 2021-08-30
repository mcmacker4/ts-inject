import {configureDI, getInstance, Inject} from "../../src";

import {ConcreteDependency as ExternalConcreteDependency, Dependency as ExternalDependency } from './external'


// Actual name collides with ExternalDependency
abstract class Dependency {
    abstract sum(a: number, b: number): number
}

// Actual name collides with ExternalConcreteDependency
class ConcreteDependency extends Dependency {
    sum(a: number, b: number): number {
        return a + b;
    }
}


class Dependent {

    @Inject readonly external: ExternalDependency
    @Inject readonly project: Dependency

}

describe("Name collision", () => {

    beforeAll(() => {
        configureDI((component, instance) => {
            component(ExternalDependency, ExternalConcreteDependency)
            component(Dependency, ConcreteDependency)
        })
    })

    test("Names don't collide", () => {
        const dep = getInstance(Dependent)

        const externalName = Object.getPrototypeOf(dep.external).constructor.name
        const projectName = Object.getPrototypeOf(dep.project).constructor.name

        expect(externalName).toEqual(projectName)

        expect(dep.external).toBeInstanceOf(ExternalConcreteDependency)
        expect(dep.project).toBeInstanceOf(ConcreteDependency)
    })

})