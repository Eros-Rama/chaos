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

    constructor(rows, columns, x, y, width, height, scale=1, offsetX=0, offsetY=0) {
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

    static calculateStartX(x, offsetX) { return x + offsetX }
    static calculateStartY(y, offsetY) { return y + offsetY }

    static calculateEndX(x, width, offsetX) { return x + width + offsetX }
    static calculateEndY(y, height, offsetY) { return y + height + offsetY }

    static calculateCellWidth(rows, width, scale) { return width / rows * scale }
    static calculateCellHeight(columns, height, scale) { return height / columns * scale }

    static calculateTrueWidth(cellWidth, rows) { return cellWidth * rows }
    static calculateTrueHeight(cellHeight, columns) { return cellHeight * columns }

    translate(x, y, width, height) {

        let old = { x: this.#x, y: this.#y, width: this.#width, height: this.#height }

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

    }
    set scale(scale) {
        let old = this.#scale

        this.#scale = scale

        this.#cellWidth = Grid.calculateCellWidth(this.#rows, this.#width, this.#scale)
        this.#cellHeight = Grid.calculateCellHeight(this.#columns, this.#height, this.#scale)

        this.#trueWidth = Grid.calculateTrueWidth(this.#cellWidth, this.#rows)
        this.#trueHeight = Grid.calculateTrueHeight(this.#cellHeight, this.#columns)

        this.dispatchEvent(new CustomEvent('scale', { detail: {grid: this, old: old} }))

    }
    offset(offsetX, offsetY) {
        let old = { offsetX: this.#offsetX, offsetY: this.offsetY }

        this.#offsetX = offsetX
        this.#offsetY = offsetY

        this.#startX = Grid.calculateStartX(this.#x, this.#offsetX)
        this.#startY = Grid.calculateStartY(this.#y, this.#offsetY)

        this.dispatchEvent(new CustomEvent('offset', { detail: {grid: this, old: old} }))

    }

    render(ctx) {
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

        let curX = this.startX
        for(let row = 0; row <= this.#rows; row++, curX += this.#cellWidth)
        {
            if(curX < Math.floor(this.#x)) continue;
            if(curX > Math.ceil(maxX)) continue;

            ctx.moveTo(curX, rowSY)
            ctx.lineTo(curX, rowEY)
        }

        const columnSX = clamp(this.#x, this.startX, maxX)
        const columnEX = clamp(this.#x, this.startX + this.#trueWidth, maxX)

        let curY = this.startY
        for(let column = 0; column <= this.columns; column++, curY += this.#cellHeight)
        {
            if(curY < Math.floor(this.#y)) continue;
            if(curY > Math.ceil(maxY)) continue;

            ctx.moveTo(columnSX, curY)
            ctx.lineTo(columnEX, curY)
        }

        ctx.stroke()

        this.dispatchEvent(new CustomEvent('postrender', { detail: {grid: this} }))

    }

}

function clamp(min, val, max) {
    if(val < min) return min;
    else if(val > max) return max;
    else return val;
}
