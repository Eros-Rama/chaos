import { Effect } from './effect'

export type Synergies = Array<Synergy>;
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
