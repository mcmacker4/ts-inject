# ts-inject
### Decorator based dependency injection for typescript.

```
npm install @mcmacker4/tsinject
```

## Preparation
For this to work you need to be using Typescript and enable
`experimentalDecorators` and `emitDecoratorMetadata`
in your `tsconfig.json`

## Limitations
A class with a property marked `@Inject` cannot have arguments in its constructor.
Every property marked `@Inject` will have a different instance of the dependency.
Dependency lifetime is not managed (yet?)

## Example
```ts
import { Inject, configureDI, construct } from 'ts-inject'

abstract class IController {
    abstract getPerson(name: string): { name: string }
}

class Controller extends IController {
    getPerson(name: string): { name: string } {
        return { name }
    }
}

class Dependant {
    
    // Mark a property with @Inject to automatically inject a dependency
    // In this case, controller (of type `IController`) will be injected
    // with an instance of `Controller`
    @Inject private controller: IController
    
    printPerson(name: string) {
        console.log(this.controller.getPerson(name))
    }
}

// We need to manually configure Dependency Injection
configureDI(register => {
    register(IController, Controller)
})

// To construct a class that needs dependency injection (has a property marked with @Inject)
// you need to construct it using the `construct()` function
const dependant = construct(Dependant)

dependant.printPerson("Michael")

```