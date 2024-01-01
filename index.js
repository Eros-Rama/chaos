console.log("Game script start")

const friendlyCanvas = document.getElementById("friendly-canvas")
const neutralCanvas = document.getElementById("neutral-canvas")
const enemyCanvas = document.getElementById("enemy-canvas")

function updateCanvasSize(canvas) {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
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

    ctx.beginPath()

    //Rows
    const rowWidth = grid.width / grid.rows * grid.scale
    for(let row = 0; row <= grid.rows; row++)
    {
        const sx = grid.x + (row * rowWidth) + grid.offset
        const sy = grid.y + grid.offset
        const ex = sx
        const ey = Math.min(sy + grid.height, grid.height)
        if(sx > grid.width || sy > grid.height)
        {
            break
        }

        ctx.moveTo(sx, sy)
        ctx.lineTo(ex, ey)
    }

    //Columns
    const columnHeight = grid.width / grid.columns * grid.scale
    for(let column = 0; column <= grid.columns; column++)
    {
        const sx = grid.x + grid.offset
        const sy = grid.y + (column * columnHeight) + grid.offset
        const ex = Math.min(sx + grid.width, grid.width)
        const ey = sy
        if(sx > grid.width || sy > grid.height)
        {
            break
        }

        ctx.moveTo(sx, sy)
        ctx.lineTo(ex, ey)
    }

    ctx.stroke()

}

const ctx = enemyCanvas.getContext("2d")
setTimeout(() => drawGridClip(ctx, {x: 0, y: 0, width: 100, height: 100, foreground: "black", background: "white", rows: 10, columns: 10, offset: -10, scale: 2}), 500)
