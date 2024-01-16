import { Tags, TagAssociation, applyTagAssociation } from './tags'
import { Properties } from './properties'
import { Cost } from './cost'
import { Actions } from './action'
import { Synergies } from './synergy'

export type AtomStore = Map<string, Atom>;

export interface Atom {
    id: string;
    name: string;
    description: string;
    sprite: string;
    tags: Tags;
    properties: Properties;
    cost: Cost
    actions: Actions;
    synergies: Synergies;
};

export function buildAtomStore(atoms: Set<Atom>, tags: TagAssociation): { store: AtomStore, duplicates: Map<string, Array<Atom>> } {
    const store = new Map<string, Atom>();
    const duplicates = new Map<string, Array<Atom>>();

    for(const atom of atoms) {
        applyTagAssociation(atom.tags, tags);

        if(store.has(atom.id)) {
            let duplicatesArray = duplicates.get(atom.id)
            if(!duplicatesArray) {
                duplicatesArray = new Array<Atom>();
                duplicates.set(atom.id, duplicatesArray);
            }

            duplicatesArray.push(atom)
        }
        else {
            store.set(atom.id, atom);
        }
    }

    for(const [key, _] of duplicates) {
        store.delete(key);
    }

    return { store, duplicates };
}
