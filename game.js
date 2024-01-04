import Grid from "./grid.js"

export default class Game extends EventTarget {
    #friendlyCanvas; #neutralCanvas; #enemyCanvas;

    constructor(friendlyCanvas, neutralCanvas, enemyCanvas) {
        this.#friendlyCanvas = friendlyCanvas
        this.#neutralCanvas = neutralCanvas
        this.#enemyCanvas = enemyCanvas
    }
    render() }
    }
}

export class Side extends EventTarget {
    depth; width;
    resources = new Map();
}

export class Element {
    amount = 2;
    max = 10000;
}

export class Structure {
    #rows = 0;
    #columns = 0;
    #atoms = [['']];
    atomDB = new Map();
}

export class Atom {
}
