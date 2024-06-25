<template>
    <div class="press-image">
        <h4>压缩配置</h4>
        <el-form
            :inline="true"
            :model="pressConfig"
            class="press-config"
            style="width: 100%"
        >
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
            <el-form-item label="输入位置" v-show="!pressConfig.isFile">
                <dir-select-input
                    v-model="pressConfig.dirPath"
                    :value="pressConfig.outPath"
                    :width="'485px'"
                ></dir-select-input>
            </el-form-item>
            <br />
            <el-form-item label="输出位置">
                <dir-select-input
                    v-model="pressConfig.outPath"
                    :value="pressConfig.outPath"
                    :width="'485px'"
                ></dir-select-input>
                <el-button
                    v-show="!pressConfig.isFile"
                    :loading="pressLock"
                    class="m-l-10"
                    type="primary"
                    plain
                    @click="outputImg"
                >
                    输出
                </el-button>
            </el-form-item>
            <br />
            <el-form-item>
                <el-switch
                    v-model="pressConfig.isFile"
                    active-text="文件"
                    inactive-text="文件夹"
                />
            </el-form-item>
        </el-form>
        <div v-show="pressConfig.isFile">
            <h4>选择图片 ({{ fileList.length }})</h4>
            <select-image
                :is-contain="false"
                :scale-rate="0.1"
                @on-change="filesChange"
                @on-select-change="onSelectChange"
                @on-output="outputImg"
            ></select-image>
            <h4>
                {{ getPreviewInfo() }}
            </h4>
            <div class="preview-img overflow-auto scroll-small">
                <div ref="loadingMark" v-loading="loading">
                    <img ref="previewImg" style="object-fit: contain" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { BatchPressImgAndOutputByPathType, SelectImageFile } from '../types'
import { formatBytesSize, getBase64Size } from '../utils'
import { LOCAL_STORAGE_KEY } from '../utils/constant'
import { getLocalStorage, setLocalStorage } from '../utils/store'
import { useLocalConfig } from '../hooks/useLocalConfig'

const pressConfig = ref({
    scale: 1.0,
    rate: 1.0,
    outPath: '',
    dirPath: '',
    isFile: true,
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

useLocalConfig(LOCAL_STORAGE_KEY.pressImgConfig, pressConfig)

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
    const { dirPath, outPath, scale, rate, isFile } = pressConfig.value
    // 校验输出路径
    if (!pressConfig.value.outPath) {
        ElMessage.warning({
            message: '请选择输出路径！',
        })
        return
    }
    if (outPath.includes(dirPath) && outPath !== dirPath) {
        ElMessage.error({
            message: '输出路径包含输入路径！',
        })
        return
    }
    try {
        if (isFile) {
            // 校验文件
            if (!fileList.value.length) {
                ElMessage.warning({
                    message: '请选择文件！',
                })
                return
            }
            pressLock.value = true

            // 输出
            const configs: BatchPressImgAndOutputByPathType[] =
                fileList.value.map(({ path, width, height }) => {
                    const { width: _width, height: _height } = scaleImgWH(
                        width,
                        height,
                        scale
                    )
                    return {
                        path,
                        quality: rate,
                        outDirPath: pressConfig.value.outPath,
                        width: _width,
                        height: _height,
                    }
                })
            await window.HandleImageModule.batchPressImgAndOutputByPath(configs)
        } else {
            // 文件夹方式
            if (!pressConfig.value.dirPath) {
                ElMessage({
                    message: '请选择输入路径！',
                    type: 'warning',
                })
                return
            }
            pressLock.value = true
            await window.HandleImageModule.pressImgAndOutputByDir(
                dirPath,
                outPath,
                scale,
                rate
            )
        }
        pressLock.value = false
        ElMessage.success({
            message: '成功',
        })
    } catch (error) {
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
