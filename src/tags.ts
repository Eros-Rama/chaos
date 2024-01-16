export type Tags = Set<string>;
export type TagAssociation = Map<string, Set<string>>;

export function applyTagAssociation(tags: Set<string>, association: TagAssociation): Set<string> {
    const ret = new Set<string>(tags);

    for(const tag of tags) {
        const associated = association.get(tag)
        if(associated !== undefined) {
            for(const associatedTag in associated) {
                ret.add(associatedTag);
            }
        }
    }

    return ret;
}
