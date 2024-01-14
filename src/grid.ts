export default class Grid extends EventTarget {

    //Set values
    #rows; #columns; #x; #y; #width; #height; #scale; #offsetX; #offsetY;
    //Derived values
    #startX; #startY; #cellWidth; #cellHeight; #trueWidth; #trueHeight;

    get rows() { return this.#rows }
    get columns() { return this.#columns }
    get x() { return this.#x }
    get y() { return this.#y }
    get width() { return this.#width }
    get height() { return this.#height }
    get scale() { return this.#scale }
    get offsetX() { return this.#offsetX }
    get offsetY() { return this.#offsetY }
    get startX() { return this.#startX }
    get startY() { return this.#startY }
    get cellWidth() { return this.#cellWidth }
    get cellHeight() { return this.#cellHeight }
    get trueWidth() { return this.#trueWidth }
    get trueHeight() { return this.#trueHeight }

    constructor(rows: number, columns: number, x: number, y: number, width: number, height: number, scale=1, offsetX=0, offsetY=0) {
        super();

        this.#rows = rows
        this.#columns = columns
        this.#x = x
        this.#y = y
        this.#width = width
        this.#height = height
        this.#scale = scale
        this.#offsetX = offsetX
        this.#offsetY = offsetY

        this.#startX = Grid.calculateStartX(this.#x, this.#offsetX)
        this.#startY = Grid.calculateStartY(this.#y, this.#offsetY)

        this.#cellWidth = Grid.calculateCellWidth(this.#rows, this.#width, this.#scale)
        this.#cellHeight = Grid.calculateCellHeight(this.#columns, this.#height, this.#scale)

        this.#trueWidth = Grid.calculateTrueWidth(this.#cellWidth, this.#rows)
        this.#trueHeight = Grid.calculateTrueHeight(this.#cellHeight, this.#columns)

    }

    static calculateStartX(x: number, offsetX: number) { return x + offsetX }
    static calculateStartY(y: number, offsetY: number) { return y + offsetY }

    static calculateEndX(x: number, width: number, offsetX: number) { return x + width + offsetX }
    static calculateEndY(y: number, height: number, offsetY: number) { return y + height + offsetY }

    static calculateCellWidth(rows: number, width: number, scale: number) { return width / rows * scale }
    static calculateCellHeight(columns: number, height: number, scale: number) { return height / columns * scale }

    static calculateTrueWidth(cellWidth: number, rows: number) { return cellWidth * rows }
    static calculateTrueHeight(cellHeight: number, columns: number) { return cellHeight * columns }

    translate(x: number, y: number, width: number, height: number) {

        const old = { x: this.#x, y: this.#y, width: this.#width, height: this.#height }

        this.#x = x
        this.#y = y
        this.#width = width
        this.#height = height

        this.#startX = Grid.calculateStartX(this.#x, this.#offsetX)
        this.#startY = Grid.calculateStartY(this.#y, this.#offsetY)

        this.#cellWidth = Grid.calculateCellWidth(this.#rows, this.#width, this.#scale)
        this.#cellHeight = Grid.calculateCellHeight(this.#columns, this.#height, this.#scale)

        this.#trueWidth = Grid.calculateTrueWidth(this.#cellWidth, this.#rows)
        this.#trueHeight = Grid.calculateTrueHeight(this.#cellHeight, this.#columns)

        this.dispatchEvent(new CustomEvent('translate', { detail: {grid: this, old: old} }))
        this.dispatchEvent(new CustomEvent('needrender', { detail: {grid: this, cause: "Translation"} }))

    }
    set scale(scale: number) {
        const old = this.#scale

        this.#scale = scale

        this.#cellWidth = Grid.calculateCellWidth(this.#rows, this.#width, this.#scale)
        this.#cellHeight = Grid.calculateCellHeight(this.#columns, this.#height, this.#scale)

        this.#trueWidth = Grid.calculateTrueWidth(this.#cellWidth, this.#rows)
        this.#trueHeight = Grid.calculateTrueHeight(this.#cellHeight, this.#columns)

        this.dispatchEvent(new CustomEvent('scale', { detail: {grid: this, old: old} }))
        this.dispatchEvent(new CustomEvent('needrender', { detail: {grid: this, cause: "Scaling"} }))

    }
    offset(offsetX: number, offsetY: number) {
        const old = { offsetX: this.#offsetX, offsetY: this.offsetY }

        this.#offsetX = offsetX
        this.#offsetY = offsetY

        this.#startX = Grid.calculateStartX(this.#x, this.#offsetX)
        this.#startY = Grid.calculateStartY(this.#y, this.#offsetY)

        this.dispatchEvent(new CustomEvent('offset', { detail: {grid: this, old: old} }))
        this.dispatchEvent(new CustomEvent('needrender', { detail: {grid: this, cause: "Offseting"} }))

    }

    render(ctx: CanvasRenderingContext2D) {
        if(
            !this.dispatchEvent(new CustomEvent(
                'prerender', { detail: {grid: this}, cancelable: true })
            )
          ) return;

        ctx.beginPath()

        const maxX = this.#x + this.#width
        const maxY = this.#y + this.#height

        const rowSY = clamp(this.#y, this.#startY, maxY)
        const rowEY = clamp(this.#y, this.#startY + this.#trueHeight, maxY)

        let curX = this.#startX
        for(let row = 0; row <= this.#rows; row++, curX += this.#cellWidth)
        {
            if(curX < this.#x) continue;
            if(curX > maxX) continue;

            ctx.moveTo(curX, rowSY)
            ctx.lineTo(curX, rowEY)
        }

        const columnSX = clamp(this.#x, this.startX, maxX)
        const columnEX = clamp(this.#x, this.startX + this.#trueWidth, maxX)

        let curY = this.#startY
        for(let column = 0; column <= this.columns; column++, curY += this.#cellHeight)
        {
            if(curY < this.#y) continue;
            if(curY > maxY) continue;

            ctx.moveTo(columnSX, curY)
            ctx.lineTo(columnEX, curY)
        }

        ctx.stroke()

        this.dispatchEvent(new CustomEvent('postrender', { detail: {grid: this} }))

    }

    coordsToRowsAndColumns(x: number, y: number) {
        const distanceX = x - this.#startX
        const distanceY = y - this.#startY

        return { row: Math.floor(distanceX / this.#cellWidth), column: Math.floor(distanceY / this.#cellHeight) }
    }

}

function clamp(min: number, val: number, max: number) {
    if(val < min) return min;
    if(val > max) return max;
    return val;
}
