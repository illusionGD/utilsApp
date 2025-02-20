import { IMG_EXT_ENUM } from '@renderer/constants'

/**
 * 绘制ps透明背景
 * @param canvas
 * @param size 格子大小
 */
export function drawTransparentBG(canvas: HTMLCanvasElement, size = 8) {
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

    return canvas.toDataURL()
}

export function transformBufferToImg(data: {
    buffer: Buffer
    type: IMG_EXT_ENUM
}): Promise<HTMLImageElement> {
    const blob = new Blob([data.buffer], { type: `image/${data.type}` })

    return listenImgLoad(URL.createObjectURL(blob))
}

export function transformBlobToImg(blob: Blob): Promise<HTMLImageElement> {
    return listenImgLoad(URL.createObjectURL(blob))
}

/** 监听图片加载完成 */
export function listenImgLoad(url: string): Promise<HTMLImageElement> {
    const img = new Image()
    img.src = url

    return new Promise((resolve, reject) => {
        img.onload = () => {
            resolve(img)
        }
    })
}
