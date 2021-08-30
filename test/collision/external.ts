

export abstract class Dependency {
    abstract printSomething()
}

export class ConcreteDependency extends Dependency {
    printSomething() {
        console.log("Something")
    }
}