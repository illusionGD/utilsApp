<template>
    <div class="select-image">
        <div class="flex-row-start">
            <div ref="btnFile" class="btn-file common-btn-file m-r-10">
                <el-button type="success">选择图片</el-button>
                <input type="file" multiple @change="onChange" />
            </div>
            <el-button @click="clearAll">清空图片</el-button>
        </div>
        <div class="preview-list scroll-small">
            <div
                v-for="(item, index) in files"
                :key="item.name"
                class="img-item m-r-5 b-s-box"
                @mouseenter="showMark(index)"
                @mouseleave="hideMark(index)"
                @click.stop="onSelectChange(index)"
            >
                <img
                    v-show="imgSrcList[index]"
                    :class="{ 'img-item-active': selectIndex === index }"
                    :src="imgSrcList[index]"
                    :style="{ objectFit: isContain ? 'contain' : 'cover' }"
                />
                <div class="mark flex-center" v-show="markList[index]">
                    <el-icon class="mark-btn" size="large"><View /></el-icon>
                    <el-icon
                        class="mark-btn"
                        size="large"
                        @click.stop="deleteImg(index)"
                        ><Delete
                    /></el-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Plus, Delete, View } from '@element-plus/icons-vue'
import { AnyObject, SelectImageFile } from '../../types'
import { loadImage } from '../../utils'
const props = defineProps<{
    scaleRate: number
    isContain: boolean
}>()
const emits = defineEmits([
    'onChange',
    'onSelectChange',
    'onDelete',
    'onView',
    'onLoad',
])
const files = ref<SelectImageFile[]>([])
const markList = ref<boolean[]>([])
const imgSrcList = ref<string[]>([])
const selectIndex = ref(0)
const curFile = ref<SelectImageFile>()
const btnFile = ref<HTMLElement>()

function showMark(index: number) {
    markList.value[index] = true
}
function hideMark(index: number) {
    markList.value[index] = false
}
function clearAll() {
    files.value.splice(0, files.value.length)
    imgSrcList.value.splice(0, imgSrcList.value.length)
    selectIndex.value = 0
    emits('onChange', files.value)
    onSelectChange(selectIndex.value)
}
function deleteImg(index: number) {
    files.value.splice(index, 1)
    imgSrcList.value.splice(index, 1)

    emits('onDelete', index)
    emits('onChange', files.value)

    selectIndex.value = selectIndex.value ? selectIndex.value - 1 : 0
    onSelectChange(selectIndex.value)
}

function onChange(e) {
    const fileList = e.target.files as SelectImageFile[]
    const canvas = document.createElement('canvas')
    const _width = Number(
        window.getComputedStyle(btnFile.value).width.split('p')[0]
    )
    const _height = Number(
        window.getComputedStyle(btnFile.value).height.split('p')[0]
    )
    const ctx = canvas.getContext('2d')
    const loadList = []

    for (let index = 0; index < fileList.length; index++) {
        const file = fileList[index]
        const hadFile =
            files.value.findIndex((item) => {
                return item.path === file.path
            }) >= 0
        if (hadFile) {
            continue
        }
        files.value.push(file)
        const url = URL.createObjectURL(file)
        const imgIndex = files.value.findIndex((item) => item === file)
        loadList.push(
            loadImage(url).then((imgDom) => {
                let rate = 1
                if (props.scaleRate) {
                    rate = props.scaleRate
                } else {
                    imgDom.width > imgDom.height
                        ? _width / imgDom.width
                        : _height / imgDom.height
                }
                canvas.width = imgDom.width * rate
                canvas.height = imgDom.height * rate
                ctx.drawImage(imgDom, 0, 0, canvas.width, canvas.height)

                // 赋值图片宽高
                files.value[imgIndex].width = imgDom.width
                files.value[imgIndex].height = imgDom.height

                // 优化多张图片文件预览：生成base64来绘制图片，释放ObjectURL
                const base64 = canvas.toDataURL()
                imgSrcList.value[imgIndex] = base64
                // URL.revokeObjectURL(url)
                // imgDom = null
                return imgDom
            })
        )

        markList[index] = false
    }

    emits('onChange', files.value)

    if (files.value[selectIndex.value] !== curFile.value) {
        onSelectChange(selectIndex.value)
    }

    Promise.all(loadList).then((resList) => {
        emits('onLoad', resList)
    })
}

function onSelectChange(index: number) {
    selectIndex.value = index
    curFile.value = files.value[index]
    emits('onSelectChange', selectIndex.value)
}
</script>

<style lang="scss" scoped>
.file-box {
    width: 100px;
    height: 100px;
}

.preview-list {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
}
.btn-file {
    width: 110px;
    height: 50px;
    @extend .file-box;
}

.img-item {
    position: relative;

    img {
        @extend .w-h-100-percent;
        @extend .file-box;
        object-fit: cover;
    }
    .mark {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: #00000046;
    }
    .mark-btn {
        cursor: pointer;
        margin-right: 5px;
        &:last-child {
            margin: 0;
        }
    }
}

.img-item-active {
    border: 1px solid $GlobalActiveColor;
}
</style>
