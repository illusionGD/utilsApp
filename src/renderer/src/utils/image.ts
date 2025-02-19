// 绘制网格
export function drawGrid(canvas: HTMLCanvasElement, size = 8) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const width = canvas.width
    const height = canvas.height
    // 清除画布
    ctx.clearRect(0, 0, width, height)
    // 颜色定义（Photoshop 经典透明网格颜色）
    const color1 = '#d3d3d3' // 浅灰色
    const color2 = '#a0a0a0' // 深灰色
    // 遍历网格
    for (let y = 0; y < height; y += size) {
        for (let x = 0; x < width; x += size) {
            // 交替填充颜色
            ctx.fillStyle = (x / size + y / size) % 2 === 0 ? color1 : color2
            ctx.fillRect(x, y, size, size)
        }
    }
}
