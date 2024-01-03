import Grid from "./grid.js"

console.log("Game script start")

const friendlyCanvas = document.getElementById("friendly-canvas")
const neutralCanvas = document.getElementById("neutral-canvas")
const enemyCanvas = document.getElementById("enemy-canvas")

const ctx = enemyCanvas.getContext("2d")

function updateCanvasSize(canvas) {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    render()
}

const resizeObserver = new ResizeObserver((entries) => {
    for(const entry of entries) {
        updateCanvasSize(entry.target)
    }
});

resizeObserver.observe(friendlyCanvas)
resizeObserver.observe(neutralCanvas)
resizeObserver.observe(enemyCanvas)

function drawGridClip(ctx, grid) {
    ctx.fillStyle = grid.background
    ctx.strokeStyle = grid.foreground

    //Grid bounds
    ctx.fillRect(grid.x, grid.y, grid.width, grid.height)
    ctx.strokeRect(grid.x, grid.y, grid.width, grid.height)

    //Derived grid parameters
    const startX = grid.x + grid.offsetX
    const startY = grid.y + grid.offsetY

    const rowWidth = grid.width / grid.rows * grid.scale
    const columnHeight = grid.width / grid.columns * grid.scale

    const gridTrueWidth = rowWidth * grid.rows
    const gridTrueHeight = columnHeight * grid.columns

    const gridMaxX = grid.x + grid.width
    const gridMaxY = grid.y + grid.height

    //Drawing
    ctx.beginPath()

    for(let row = 0; row <= grid.rows; row++)
    {
        const sx = startX + (row * rowWidth)
        if(sx < grid.x) continue

        const sy = Math.min(Math.max(startY, grid.y), gridMaxY)

        const ex = sx
        const ey = Math.max(Math.min(startY + gridTrueHeight, gridMaxY), grid.y)

        if(ex > gridMaxX || ey > gridMaxY) continue

        ctx.moveTo(sx, sy)
        ctx.lineTo(ex, ey)
    }

    for(let column = 0; column <= grid.columns; column++)
    {
        const sx = Math.min(Math.max(startX, grid.x), gridMaxY)

        const sy = startY + (column * columnHeight)
        if(sy < grid.y) continue

        const ex = Math.max(Math.min(startX + gridTrueWidth, gridMaxX), grid.x)
        const ey = sy

        if(ex > gridMaxX || ey > gridMaxY) continue

        ctx.moveTo(sx, sy)
        ctx.lineTo(ex, ey)
    }

    ctx.stroke()

}

let testGrid = {
    x: 0, y: 0, width: 100, height: 100,
    foreground: "black", background: "white",
    rows: 10, columns: 10,
    offsetX: 0, offsetY: 0, scale: 1,
    scrollFactor: 0.001, offsetFactor: 1
}
function render() {
    grid.translate(enemyCanvas.width / 4, enemyCanvas.height / 4, enemyCanvas.width / 2, enemyCanvas.height / 2)

    //TODO: Why do these get reset randomly? Is it because of the canvas dimension changes?
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.fillRect(grid.x, grid.y, grid.width, grid.height)

    grid.render(ctx)

    //testGrid.width = enemyCanvas.width / 2
    //testGrid.height = enemyCanvas.height / 2
    //testGrid.x = enemyCanvas.width / 4
    //testGrid.y = enemyCanvas.height / 4
    //drawGridClip(ctx, testGrid)
}

function scaleGrid(e) {
    e.preventDefault()

    grid.scale -= e.deltaY * 0.001
    render()
}

let mouseDown = false;
function offsetGrid(e) {
    e.preventDefault()

    if(mouseDown) {
        grid.offset(grid.offsetX + e.movementX, grid.offsetY + e.movementY)
        render()
    }
}

enemyCanvas.addEventListener("wheel", scaleGrid, { passive: false })
enemyCanvas.addEventListener("mousemove", offsetGrid, { passive: false })
enemyCanvas.addEventListener("mousedown", (e) => mouseDown = true, { passive: true })
enemyCanvas.addEventListener("mouseup", (e) => mouseDown = false, { passive: true })

let grid = new Grid(10, 10, enemyCanvas.width / 2, enemyCanvas.height / 2, enemyCanvas.width / 4, enemyCanvas.height / 4)

