<template>
    <div class="press-image">
        <h4>压缩配置</h4>
        <el-form :inline="true" :model="pressConfig" class="press-config">
            <el-form-item label="压缩倍率">
                <el-input
                    v-model="pressConfig.rate"
                    placeholder="压缩倍率"
                    type="number"
                    step="0.1"
                    min="0.1"
                    @change="drawCanvasImg"
                ></el-input>
            </el-form-item>
            <el-form-item label="缩放倍率">
                <el-input
                    v-model="pressConfig.scale"
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="缩放倍率"
                    @change="drawCanvasImg"
                ></el-input> </el-form-item
            ><br />
            <el-form-item label="输出位置">
                <dir-select-input
                    v-model="pressConfig.outPath"
                ></dir-select-input>
            </el-form-item>
        </el-form>
        <h4>选择图片</h4>
        <select-image
            @onChange="filesChange"
            @onSelectChange="onSelectChange"
        ></select-image>
        <h4>
            预览:&nbsp;&nbsp; {{ imgSize.kb }}kb &nbsp;&nbsp;{{ imgSize.mb }}mb
        </h4>
        <div class="preview-img overflow-auto">
            <div ref="loadingMark" v-loading="loading">
                <img ref="previewImg" style="object-fit: contain" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { changeImgType, getBase64Size } from '../utils'

const pressConfig = ref({
    scale: 1.0,
    rate: 1.0,
    outPath: '',
})
const fileList = ref<File[]>([])
const previewCanvas = ref<HTMLCanvasElement>()
const readFile = new FileReader()
const ctx = ref<CanvasRenderingContext2D>()
const currentImgDom = ref<HTMLImageElement>()
const currentFile = ref<File>()
const previewImg = ref<HTMLImageElement>()
const loadingMark = ref<HTMLElement>()
const imgSize = ref({
    kb: '0',
    mb: '0',
})
const loading = ref(false)
onMounted(() => {
    previewCanvas.value = document.createElement('canvas')
    ctx.value = previewCanvas.value.getContext('2d')
    readFile.addEventListener('load', (e) => {
        const imgDom = new Image()
        currentImgDom.value = imgDom
        imgDom.src = e.target.result as string
        previewImg.value.src = imgDom.src
        currentImgDom.value.onload = () => {
            drawCanvasImg()
        }
    })
})

function filesChange(files) {
    fileList.value = files
}
/**监听选择图片 */
function onSelectChange(index) {
    const file = fileList.value[index]
    if (file) {
        currentFile.value = file
        readFile.readAsDataURL(file)
    }
}
/**绘图 */
async function drawCanvasImg() {
    const { scale, rate } = pressConfig.value
    if (!currentImgDom.value || loading.value) {
        return
    }
    const _width = currentImgDom.value.width * scale
    const _height = currentImgDom.value.height * scale
    const imgType = currentFile.value.type

    previewCanvas.value.width = _width
    previewCanvas.value.height = _height
    previewImg.value.width = _width
    previewImg.value.height = _height
    loadingMark.value.style.width = _width + 'px'
    loadingMark.value.style.height = _height + 'px'

    ctx.value.drawImage(currentImgDom.value, 0, 0, _width, _height)
    const base64 = previewCanvas.value.toDataURL(imgType, rate)

    if (rate >= 1) {
        previewImg.value.src = base64
        computedSize(previewImg.value.src, imgType)
        return
    }
    loading.value = true
    const buffer = await window.HandleImageModule.pressImageByBase64(
        base64,
        changeImgType(imgType),
        rate
    )
    loading.value = false

    if (!buffer) {
        return
    }
    const blob = new Blob([buffer], { type: imgType })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.src = url
    img.onload = () => {
        ctx.value.drawImage(img, 0, 0, _width, _height)
        URL.revokeObjectURL(url) // 释放 URL 对象
        const newBase64 = previewCanvas.value.toDataURL(imgType)
        previewImg.value.src = newBase64
        computedSize(previewImg.value.src, imgType)
    }
}

function computedSize(base64: string, imgType) {
    const size = getBase64Size(base64, imgType)
    imgSize.value.kb = size.kb
    imgSize.value.mb = size.mb
}
</script>

<style lang="scss" scoped>
.preview-img {
    width: 100%;
    height: 650px;
}
</style>
