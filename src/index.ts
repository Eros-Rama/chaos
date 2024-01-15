import Grid from "./grid"

console.log("Game script start")

const friendlyCanvas = document.getElementById("friendly-canvas") as HTMLCanvasElement
const neutralCanvas = document.getElementById("neutral-canvas") as HTMLCanvasElement
const enemyCanvas = document.getElementById("enemy-canvas") as HTMLCanvasElement

const ctx = enemyCanvas.getContext("2d") as CanvasRenderingContext2D

function updateCanvasSize(canvas: HTMLCanvasElement) {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    //TODO: Not final, move to more appropriate spot
    grid.translate(enemyCanvas.width / 4, enemyCanvas.height / 4, enemyCanvas.width / 2, enemyCanvas.height / 2)
}

const resizeObserver = new ResizeObserver((entries) => {
    for(const entry of entries) {
        updateCanvasSize(entry.target as HTMLCanvasElement)
    }
});

resizeObserver.observe(friendlyCanvas)
resizeObserver.observe(neutralCanvas)
resizeObserver.observe(enemyCanvas)

const rows = 10
const columns = 10

const grid = new Grid(rows, columns, enemyCanvas.width / 2, enemyCanvas.height / 2, enemyCanvas.width / 4, enemyCanvas.height / 4)
grid.addEventListener("needrender", (_) => render(), { passive: true })

const gridTiles = Array(10).fill(0).map(_ => Array(10).fill("white"))

function render() {
    ctx.fillStyle = 'cyan'
    ctx.fillRect(0, 0, enemyCanvas.width, enemyCanvas.height)

    //TODO: Why do these get reset randomly? Is it because of the canvas dimension changes?
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.fillRect(grid.x, grid.y, grid.width, grid.height)

    gridTiles.forEach(
        (row, rowNum) => {
            row.forEach((column, columnNum) => {
                ctx.fillStyle = column
                const coords = grid.rowsAndColumnsToCoords(rowNum, columnNum)
                ctx.fillRect(coords.x, coords.y, grid.cellWidth, grid.cellHeight)
            })
        })

    grid.render(ctx)

}

function scaleGrid(e: WheelEvent) {
    e.preventDefault()

    grid.scale -= e.deltaY * 0.001
}
enemyCanvas.addEventListener("wheel", scaleGrid, { passive: false })

let mouseDown = false;
enemyCanvas.addEventListener("mousedown", (e) => {
    mouseDown = true

    const coords = grid.coordsToRowsAndColumns(e.offsetX, e.offsetY)

    if(coords.row < 0 || coords.column < 0) return
    if(coords.row >= rows || coords.column >= columns) return

    if(gridTiles[coords.row][coords.column] === "white") gridTiles[coords.row][coords.column] = "green"
    else gridTiles[coords.row][coords.column] = "white"

    render()
}, { passive: true })
enemyCanvas.addEventListener("mouseup", (_) => { mouseDown = false }, { passive: true })
enemyCanvas.addEventListener("mouseleave", (_) => { mouseDown = false }, { passive: true })

function offsetGrid(e: MouseEvent) {
    e.preventDefault()

    if(mouseDown) {
        grid.offset(grid.offsetX + e.movementX, grid.offsetY + e.movementY)
    }
}
enemyCanvas.addEventListener("mousemove", offsetGrid, { passive: false })

