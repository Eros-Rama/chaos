import { Effect } from './effect'

export enum KnownActions {
    turnStart = "turn_start",
    turnEnd = "turn_end",
}
export type Actions = Map<KnownActions, Effect>;

