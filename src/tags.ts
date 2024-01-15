type TagAssociation = Map<string, Set<string>>;

export default function applyTagAssociation(tags: Set<string>, association: TagAssociation): Set<string> {
    const ret = new Set<string>();

    for(const tag of tags) {
        ret.add(tag);

        const associated = association.get(tag)
        if(associated !== undefined) {
            for(const associatedTag in associated) {
                ret.add(associatedTag);
            }
        }
    }

    return ret;
}
