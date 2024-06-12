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
        <h4>选择图片 ({{ fileList.length }})</h4>
        <select-image
            @on-change="filesChange"
            @on-select-change="onSelectChange"
        ></select-image>
        <div class="flex-row-between">
            <h4>
                {{ getPreviewInfo() }}
            </h4>
            <el-button type="success" @click="outputImg" :loading="pressLock"
                >输出</el-button
            >
        </div>

        <div class="preview-img overflow-auto scroll-small">
            <div ref="loadingMark" v-loading="loading">
                <img ref="previewImg" style="object-fit: contain" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { BatchPressImgAndOutputByPathType, SelectImageFile } from '../types'
import { formatBytesSize, getBase64Size } from '../utils'

const pressConfig = ref({
    scale: 1.0,
    rate: 1.0,
    outPath: '',
})
const fileList = ref<SelectImageFile[]>([])
const readFile = new FileReader()
const currentImgDom = ref<HTMLImageElement>()
const currentFile = ref<SelectImageFile>()
const previewImg = ref<HTMLImageElement>()
const loadingMark = ref<HTMLElement>()
const imgSize = ref({
    kb: 0,
    mb: 0,
})
const loading = ref(false)
const pressLock = ref(false)
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

function getPreviewInfo() {
    const { kb, mb } = imgSize.value
    let str = `预览:  ${kb}kb  ${mb}mb`
    if (currentFile.value) {
        const { width, height } = currentFile.value
        const scaleWH = scaleImgWH(width, height, pressConfig.value.scale)
        str += ` 宽:${scaleWH.width}px  高:${scaleWH.height}px`
    }
    return str
}

function filesChange(files) {
    fileList.value = files
    if (!fileList.value.length) {
        previewImg.value.src = ''
        currentImgDom.value.src = ''
        currentFile.value = null
    }
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
    const { width: _width, height: _height } = scaleImgWH(
        currentImgDom.value.width,
        currentImgDom.value.height,
        scale
    )
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
/**计算图片大小 */
function computedSize(data: Blob | string, imgType: string) {
    const size =
        data instanceof Blob
            ? formatBytesSize(data.size)
            : getBase64Size(data, imgType)
    imgSize.value.kb = size.kb
    imgSize.value.mb = size.mb
}
/**缩放宽高 */
function scaleImgWH(w: number, h: number, s: number) {
    return {
        width: Math.round(w * s),
        height: Math.round(h * s),
    }
}
/**输出图片 */
async function outputImg() {
    if (pressLock.value) {
        return
    }
    // 校验输出路径
    if (!pressConfig.value.outPath) {
        ElMessage({
            message: '请选择输出路径！',
            type: 'warning',
        })
        return
    }

    // 校验文件
    if (!fileList.value.length) {
        ElMessage({
            message: '请选择文件！',
            type: 'warning',
        })
        return
    }

    const { scale, rate } = pressConfig.value
    // 输出
    const configs: BatchPressImgAndOutputByPathType[] = fileList.value.map(
        ({ path, width, height }) => {
            const { width: _width, height: _height } = scaleImgWH(
                width,
                height,
                scale
            )
            return {
                path,
                quality: rate,
                outPath: pressConfig.value.outPath,
                width: _width,
                height: _height,
            }
        }
    )
    pressLock.value = true
    try {
        await window.HandleImageModule.batchPressImgAndOutputByPath(configs)
        ElMessage.success({
            message: '成功',
        })
        pressLock.value = false
    } catch (error) {
        ElMessage.error({
            message: `${error}`,
        })
        pressLock.value = false
    }
}
</script>

<style lang="scss" scoped>
.preview-img {
    width: 100%;
    height: 650px;
}
</style>
