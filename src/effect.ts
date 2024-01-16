export enum Action {
    increment = "increment",
    decrement = "decrement",
    add = "add",
    subtract = "subtract",
    multiply = "multiply",
    divide = "divide",
    modulo = "modulo",
}
export interface Effect {
    action: Action,
    args: Array<string>
}
