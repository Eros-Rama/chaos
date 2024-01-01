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

resizeObserver.observe(friendlyCanvas);
resizeObserver.observe(neutralCanvas);
resizeObserver.observe(enemyCanvas);
