# ts-inject
### Decorator based dependency injection for typescript.

```
npm install @mcmacker4/tsinject
```

## Preparation
For this to work you need to be using Typescript and enable
`experimentalDecorators` and `emitDecoratorMetadata`
in your `tsconfig.json`

## Example

```ts
import {
    Inject,
    InjectInstance,
    Lifetime,
    configureDI,
    getInstance,
    resolveDependency,
    resolveInstanceDependency,
} from 'ts-inject'

import {Pool, createPool} from 'mysql2/promise'

type Person = { name: string }

abstract class IController {
    abstract getPerson(name: string): Person
}

class Controller extends IController {
    @InjectInstance("SqlPool") private readonly sqlPool: Pool

    getPerson(name: string): Person {
        return {name}
    }
}

class Dependant {

    // Mark a property with @Inject to automatically inject a dependency
    // In this case, controller (of type `IController`) will be injected
    // with an instance of `Controller`.
    // NOTE: The type of the property must NOT be an interface, because
    // interfaces do not exists at runtime.
    @Inject private controller: IController

    printPerson(name: string) {
        console.log(this.controller.getPerson(name))
    }
}

// We need to manually configure Dependency Injection
configureDI((component, instance) => {

    // When registering a component the third and fourth arguments are optional
    // (the example is equivalent to default)
    // First argument is the abstract type (the type of the property to be injected)
    // Second argument is the concrete type (the type of the instance
    // to be injected into the properties)
    // Third argument (optional, default SINGLETON) specifies the lifetime
    //   - Lifetime.SINGLETON: one instance for all @Inject properties of that type
    //   - Lifetime.TRANSIENT: creates a new instance for every @Inject property
    // Fourth argument is a lambda (optional, default constructs
    // an instance with no arguments)
    // that returns a new instance of the concrete class. This is provided for cases
    // where the concrete class has arguments in the constructor.
    component(IController, Controller, Lifetime.SINGLETON, () => new Controller())

    // Special case for when the exposed type of an external library
    // is an interface (such as `Pool` in `mysql2`)
    // First argument is the ID. It has to be the same in the @InjectInstance
    // decorator.
    // Second argument: the instance to be injected into the properties.
    instance("SqlPool", createPool())
})

// To construct a class that needs dependency injection (has a property marked with @Inject)
// you need to construct it using the `createInstance()` function
const dependant = getInstance(Dependant)

dependant.printPerson("Michael")

// To resolve an abstract class into a concrete instance you can use
//   - resolveDependency(AbstractType) for component dependencies
//   - resolveInstanceDependency("id") for instance dependencies
const controller = resolveDependency(IController)

expect(controller.getPerson("Person")).toHaveProperty("name", "Person")
```