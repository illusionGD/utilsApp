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
            <br />
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
import { formatBytesSize, getBase64Size } from '../utils'

const pressConfig = ref({
    scale: 1.0,
    rate: 1.0,
    outPath: '',
})
const fileList = ref<File[]>([])
const readFile = new FileReader()
const currentImgDom = ref<HTMLImageElement>()
const currentFile = ref<File>()
const previewImg = ref<HTMLImageElement>()
const loadingMark = ref<HTMLElement>()
const imgSize = ref({
    kb: 0,
    mb: 0,
})
const loading = ref(false)
onMounted(() => {
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
    const _width = Math.round(currentImgDom.value.width * scale)
    const _height = Math.round(currentImgDom.value.height * scale)
    const imgType = currentFile.value.type

    previewImg.value.width = _width
    previewImg.value.height = _height
    loadingMark.value.style.width = _width + 'px'
    loadingMark.value.style.height = _height + 'px'

    loading.value = true

    const buffer = await window.HandleImageModule.pressAndResizeImageByPath(
        currentFile.value.path,
        _width,
        _height,
        rate
    )

    loading.value = false

    if (!buffer) {
        return
    }

    const blob = new Blob([buffer], { type: imgType })
    const url = URL.createObjectURL(blob)
    previewImg.value.src = url
    previewImg.value.onload = () => {
        URL.revokeObjectURL(url) // 释放 URL 对象
        computedSize(blob, imgType)
    }
}

function computedSize(data: Blob | string, imgType: string) {
    const size =
        data instanceof Blob
            ? formatBytesSize(data.size)
            : getBase64Size(data, imgType)
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
