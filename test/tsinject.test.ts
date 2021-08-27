import {Inject, createInstance, configureDI} from "../src"
import {InjectInstance} from "../src/annotation";

type Person = { name: string }

class Repository {
    private readonly surname: string
    constructor(surname: string) {
        this.surname = surname
    }
    findByName(name: string): Person {
        return { name: `${name} ${this.surname}` }
    }
}

abstract class AbstractController {
    abstract getPerson(name: string): Person
}

class Controller extends AbstractController {
    @InjectInstance("repo") private repo: Repository
    getPerson(name: string): Person {
        return this.repo.findByName(name)
    }
}

class Dependant {
    @Inject private controller: AbstractController
    getPerson(name: string): Person {
        return this.controller.getPerson(name)
    }
}

describe("Injection", () => {

    const surname = "Smith"

    beforeAll(() => {
        configureDI((component, instance) => {
            component(AbstractController, Controller)
            instance("repo", new Repository(surname))
        })
    })

    test("Everything?", () => {
        const dep = createInstance(Dependant)
        const name = "Test Name"
        expect(dep.getPerson(name)).toHaveProperty('name', `${name} ${surname}`)
    })

})