export default interface Atom {
    id: string;
    sprite: string;
    tags: Set<string>;
    properties: Map<KnownProperties | string, any>;
    cost: Map<string, number>;
    actions: Map<KnownActions, Effect>;
    synergies: Array<Synergy>;
}

export enum KnownProperties {
    hp = "hp",
    power = "power",
}

export enum KnownActions {
    turnStart = "turn_start",
    turnEnd = "turn_end",
}

export interface Effect {
    action: Action,
    args: Array<string>
}

export enum Action {
    increment = "increment",
    decrement = "decrement",
    add = "add",
    subtract = "subtract",
    multiply = "multiply",
    divide = "divide",
    modulo = "modulo",
}

export interface Synergy {
    effect: Effect;
    each: Condition;
}

export interface Condition {
    constellation?: Constellation;
}

export interface Constellation {
    neightbourhood?: Array<Array<number>> | string;
    tags?: Set<string>;
    count?: number;
}
