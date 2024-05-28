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
                ></el-input>
            </el-form-item>
        </el-form>
        <h4>选择图片</h4>
        <!-- <dir-select-input
            v-model="curDirPath"
            :isShowSelect="true"
            :accept="'image/png, image/jpeg'"
        ></dir-select-input> -->
        <select-image
            @onChange="filesChange"
            @onSelectChange="onSelectChange"
        ></select-image>
        <h4>
            预览:&nbsp;&nbsp; {{ imgSize.kb }}kb &nbsp;&nbsp;{{ imgSize.mb }}mb
        </h4>
        <div class="preview-img overflow-auto">
            <canvas
                ref="previewCanvas"
                @mouseenter="enterCanvas = true"
                @mouseleave="enterCanvas = false"
            ></canvas>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { getBase64Size } from '../utils'

const pressConfig = ref({
    scale: 1.0,
    rate: 0.5,
})
const fileList = ref<File[]>([])
const previewCanvas = ref<HTMLCanvasElement>()
const enterCanvas = ref(false)
const readFile = new FileReader()
const ctx = ref<CanvasRenderingContext2D>()
const currentImgDom = ref<HTMLImageElement>()
const currentFile = ref<File>()
const imgSize = ref({
    kb: '0',
    mb: '0',
})
onMounted(() => {
    ctx.value = previewCanvas.value.getContext('2d')
    readFile.addEventListener('load', (e) => {
        const imgDom = new Image()
        currentImgDom.value = imgDom
        imgDom.src = e.target.result as string

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
function drawCanvasImg() {
    const { scale, rate } = pressConfig.value
    if (!currentImgDom.value) {
        return
    }
    const _width = currentImgDom.value.width * scale
    const _height = currentImgDom.value.height * scale
    const tempDom = new Image()

    previewCanvas.value.width = _width
    previewCanvas.value.height = _height

    ctx.value.drawImage(currentImgDom.value, 0, 0, _width, _height)
    tempDom.src = previewCanvas.value.toDataURL(currentFile.value.type, rate)
    tempDom.onload = () => {
        ctx.value.drawImage(tempDom, 0, 0, _width, _height)
    }
    const size = getBase64Size(tempDom.src, currentFile.value.type)
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
