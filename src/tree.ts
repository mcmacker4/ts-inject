import {Constructor, debug} from "./util";

interface TreeNode {
    subclasses: TreeNode[]
    constructor?: Constructor
}

const nodes = new Map<string, TreeNode>()

export function registerComponent(constructor: Constructor) {
    registerComponentWithChild(constructor)
}

function registerComponentWithChild(constructor: Constructor, hasDecorator: boolean = true, child: TreeNode | undefined = undefined) {
    debug(`Registering ${constructor.name}`)
    if (nodes.has(constructor.name)) {
        const node = nodes.get(constructor.name)!
        if (!node.constructor) {
            node.constructor = constructor
        }
        if (child != undefined) {
            node.subclasses = [...node.subclasses, child]
        }
    } else {
        const node: TreeNode = {
            constructor: hasDecorator ? constructor : undefined,
            subclasses: child ? [child] : []
        }
        nodes.set(constructor.name, node)
        const nextConstructor = Object.getPrototypeOf(constructor)
        if (nextConstructor.name) {
            registerComponentWithChild(Object.getPrototypeOf(constructor), false, node)
        }
    }
}

export function findComponent(name: string): Constructor | null {
    const node = nodes.get(name)
    if (!node)
        return null
    const suitable = findSuitableConstructor(node)
    if (suitable.length > 1) {
        const names = suitable.map(n => n.constructor?.name)
        throw new Error(`Multiple suitable dependencies found for ${name}: ${names}`)
    } else if (suitable.length == 1) {
        if (!suitable[0].constructor)
            throw new Error("Found suitable node has no associated constructor")
        return suitable[0].constructor
    } else {
        return null
    }
}

function findSuitableConstructor(node: TreeNode): TreeNode[] {
    const suitable = node.subclasses.map(next => findSuitableConstructor(next)).flat()
    if (node.constructor)
        return [node, ...suitable]
    else
        return suitable
}

