<template>
    <div class="bitmap-fnt">
        <h4>位图配置</h4>
        <el-form :inline="true" :model="bitmapFntConfig" class="press-config">
            <el-form-item label="位图名称">
                <el-input
                    v-model="bitmapFntConfig.imgName"
                    :value="bitmapFntConfig.imgName"
                    placeholder="名称"
                    @change="generateBitmapFont"
                ></el-input>
            </el-form-item>
            <br />
            <el-form-item label="位图宽">
                <el-input
                    v-model="bitmapFntConfig.width"
                    placeholder="宽"
                    type="number"
                    step="1"
                    min="1"
                    @change="generateBitmapFont"
                ></el-input>
            </el-form-item>
            <el-form-item label="位图高">
                <el-input
                    v-model="bitmapFntConfig.height"
                    type="number"
                    placeholder="高"
                    step="1"
                    min="1"
                    @change="generateBitmapFont"
                ></el-input>
            </el-form-item>
            <br />
            <el-form-item>
                <el-checkbox
                    v-model="bitmapFntConfig.fixWidth"
                    label="适配宽"
                    @change="generateBitmapFont"
                />
            </el-form-item>
            <el-form-item>
                <el-checkbox
                    v-model="bitmapFntConfig.fixHeight"
                    label="适配高"
                    @change="generateBitmapFont"
                />
            </el-form-item>
            <br />
            <el-form-item label="输出路径">
                <dir-select-input
                    v-model="bitmapFntConfig.outDirPath"
                ></dir-select-input>
            </el-form-item>
        </el-form>
        <h4>选择图片</h4>
        <div class="flex-row-start">
            <div ref="btnFile" class="btn-file common-btn-file m-r-10">
                <el-button type="success">选择图片</el-button>
                <input type="file" multiple @input="onFileChange" />
            </div>
            <el-button @click="clearAll">清空图片</el-button>
            <el-button :loading="lock" plain @click="downloadData"
                >输出位图字体</el-button
            >
        </div>
        <div class="file-list overflow-auto-y scroll-small m-t-10 m-r-10">
            <div
                v-for="item in imgList"
                :key="item.file.path"
                class="file-item flex-row-start"
            >
                <img class="m-r-20" :src="item.dom.src" />
                <div class="file-style flex-center">
                    <span class="m-r-20 flex-center">
                        <span class="text-no-wrap m-r-10 font-size-14"
                            >id (key):</span
                        >
                        <el-input v-model="item.id"> </el-input>
                    </span>
                    <span class="m-r-20 flex-center">
                        <span class="text-no-wrap m-r-10 font-size-14"
                            >X偏移:</span
                        >
                        <el-input
                            v-model="item.offsetX"
                            type="number"
                            step="1"
                            @change="generateBitmapFont"
                        >
                        </el-input>
                    </span>
                    <span class="flex-center">
                        <span class="text-no-wrap m-r-10 font-size-14"
                            >Y偏移:</span
                        >
                        <el-input
                            v-model="item.offsetY"
                            type="number"
                            step="1"
                            @change="generateBitmapFont"
                        ></el-input>
                    </span>
                </div>
            </div>
        </div>
        <h4>预览: {{ fntSize.kb }}kb {{ fntSize.mb }}mb</h4>
        <div class="preview-box scroll-small">
            <bg-canvas
                :width="bitmapFntConfig.width"
                :height="bitmapFntConfig.height"
            >
                <canvas
                    ref="previewCanvas"
                    class="preview-canvas"
                    :width="bitmapFntConfig.width"
                    :height="bitmapFntConfig.height"
                ></canvas>
            </bg-canvas>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { nextTick, ref } from 'vue'
import { base64ToBlob, formatBytesSize } from '../utils'

const imgList = ref<
    {
        id: string
        file: File
        dom: HTMLImageElement
        offsetX: 0
        offsetY: 0
    }[]
>([])
const previewCanvas = ref<HTMLCanvasElement>()
const bitmapFntConfig = ref({
    width: 512,
    height: 512,
    outDirPath: '',
    imgName: 'bitmap-fnt',
    fixWidth: true,
    fixHeight: false,
})
const fntSize = ref({
    kb: 0,
    mb: 0,
})
const lock = ref(false)
const outputContent = {
    fntData: '',
    fontImageData: '',
}

const imgType = 'image/png'

async function clearAll() {
    imgList.value.splice(0, imgList.value.length)
    await initImgList(imgList.value.map((item) => item.file))
    generateBitmapFont()
}

async function onFileChange(e) {
    const list = e.target.files as File[]
    await initImgList(list)
    generateBitmapFont()
    e.target.value = ''
}

async function initImgList(list: File[]) {
    if (!list.length) {
        return
    }
    const tempList = []
    const loadTask: Promise<HTMLImageElement>[] = []
    for (let index = 0; index < list.length; index++) {
        const file = list[index]
        tempList.push({
            id: file.path.split('\\').pop().split('.')[0],
            file,
            dom: null,
            offsetX: 0,
            offsetY: 0,
        })
        loadTask.push(loadImage(URL.createObjectURL(file)))
    }
    const domList = await Promise.all(loadTask)
    domList.forEach((dom, index) => {
        imgList.value.push({
            ...tempList[index],
            dom,
        })
        setTimeout(() => {
            URL.revokeObjectURL(dom.src)
        })
    })
}

async function generateBitmapFont() {
    const { fixWidth, fixHeight } = bitmapFntConfig.value
    if (!imgList.value.length) {
        clearCanvas()
        return
    }
    const getFixWH = () => {
        let maxWidth = 0
        let maxHeight = 0
        let temHeight = 0
        let maxRow = 0
        let maxCol = 0
        let area = 0

        imgList.value.forEach(({ dom, offsetX, offsetY }) => {
            const _width = dom.width + Number(offsetX)
            const _height = dom.height + Number(offsetY)
            maxWidth += _width
            temHeight = Math.max(_height, temHeight)
            maxHeight += temHeight
            maxRow = Math.max(_width, maxRow)
            maxCol = Math.max(_height, maxCol)
            area += _width * _height
        })

        return {
            maxWidth,
            maxHeight,
            maxRow,
            maxCol,
            area,
        }
    }
    const { maxWidth, maxHeight, maxRow, maxCol, area } = getFixWH()

    // 适配宽
    if (fixWidth && !fixHeight) {
        bitmapFntConfig.value.width = maxWidth
        bitmapFntConfig.value.height = maxCol
    }

    // 适配高
    if (!fixWidth && fixHeight) {
        bitmapFntConfig.value.width = maxRow
        bitmapFntConfig.value.height = maxHeight
    }

    // const { width, height } = bitmapFntConfig.value

    // 适配宽&高: 更改图片宽高
    // if (fixWidth && fixHeight) {
    //     // 计算缩放比例
    //     const rate = (width * height) / area

    //     if (rate < 1) {
    //         imgList.value.forEach(({ dom }) => {
    //             // dom.style.transform = `scale(${rate})`
    //             // dom.width *= rate
    //             // dom.height *= rate
    //         })
    //     } else {
    //     }
    // }

    nextTick(() => {
        dragImg()
    })
}

async function dragImg() {
    const canvas = previewCanvas.value
    const ctx = canvas.getContext('2d')
    let x = 0
    let y = 0
    let rowHeight = 0
    const glyphs = []
    fntSize.value.kb = 0
    fntSize.value.mb = 0
    clearCanvas()

    if (!imgList.value.length) {
        return
    }
    for (let index = 0; index < imgList.value.length; index++) {
        const { dom: image, offsetX, offsetY, id } = imgList.value[index]
        const xoffset = Number(offsetX)
        const yoffset = Number(offsetY)

        // 换行绘制
        if (x + image.width + xoffset > canvas.width) {
            x = xoffset
            y += rowHeight
        }

        // 偏移
        x += xoffset
        y += yoffset

        if (y + image.height > canvas.height) {
            ElMessage.error('Canvas size is too small to fit all images')
            return
        }

        ctx.drawImage(image, x, y, image.width, image.height)

        glyphs.push({
            char: id,
            x,
            y,
            width: image.width,
            height: image.height,
            xoffset,
            yoffset,
            xadvance: image.width + xoffset,
        })

        x += image.width
        rowHeight = Math.max(rowHeight, image.height)
    }

    const fontImageData = canvas.toDataURL(imgType)

    fntSize.value = formatBytesSize(base64ToBlob(fontImageData, imgType).size)
    outputContent.fontImageData = fontImageData
    outputContent.fntData = generateFntData(glyphs)
}

function clearCanvas() {
    const canvas = previewCanvas.value
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function generateFntData(
    glyphs: {
        char: string
        x: number
        y: number
        xoffset: number
        yoffset: number
        xadvance: number
        width: number
        height: number
    }[]
) {
    const lines = []
    const { width, height, imgName } = bitmapFntConfig.value
    let lineHeight = 0
    glyphs.forEach((item) => (lineHeight = Math.max(item.height, lineHeight)))
    lines.push(
        `info face="BitmapFont" size=${lineHeight} bold=0 italic=0 charset="" unicode=0 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=1,1`
    )
    lines.push(
        `common lineHeight=${lineHeight} base=26 scaleW=${width} scaleH=${height} pages=1 packed=0`
    )
    lines.push(`page id=0 file="${imgName}.png"`)
    lines.push(`chars count=${glyphs.length}`)

    glyphs.forEach((glyph) => {
        const { char, x, y, xoffset, yoffset, xadvance, width, height } = glyph
        lines.push(
            `char id=${char.charCodeAt(
                0
            )} x=${x} y=${y} width=${width} height=${height} xoffset=${xoffset} yoffset=${yoffset} xadvance=${xadvance} page=0 chnl=0`
        )
    })
    const fontData = lines.join('\n')
    return fontData
}

async function downloadData() {
    const { outDirPath, imgName } = bitmapFntConfig.value
    if (!imgName) {
        ElMessage.warning({ message: '请填写位图名称' })
        return
    }
    if (!outDirPath) {
        ElMessage.warning({ message: '请填写输出路径' })
        return
    }
    const { fntData, fontImageData } = outputContent
    const imgPath = outDirPath + imgName + '.png'
    const fntPath = outDirPath + imgName + '.fnt'
    try {
        await Promise.all([
            window.FileNameModule.outputFile(fntPath, fntData),
            window.HandleImageModule.outputBase64Img(imgPath, fontImageData),
        ])
        ElMessage.success({ message: '成功' })
        lock.value = false
    } catch (error) {
        ElMessage.error({ message: error })
        lock.value = false
    }
}

function loadImage(src): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}
</script>

<style lang="scss" scoped>
.file-list {
    max-height: 200px;
    .file-item {
        height: 50px;
    }

    img {
        object-fit: contain;
        height: 100%;
        width: 50px;
    }
}
.preview-box {
    width: 100%;
    .preview-canvas {
        // border: 1px dashed #fff;
    }
}
</style>
