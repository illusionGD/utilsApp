<template>
    <div class="select-image">
        <div class="preview-list">
            <div
                class="img-item m-r-10 b-s-box"
                v-for="(item, index) in files"
                :key="item.name"
                @mouseenter="showMark(index)"
                @mouseleave="hideMark(index)"
                @click.stop="onSelectChange(index)"
            >
                <img
                    :class="{ 'img-item-active': selectIndex === index }"
                    :src="imgSrcList[index]"
                    :alt="item.name"
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
            <div class="btn-file">
                <el-icon size="large"><Plus /></el-icon>
                <input
                    class="input-file"
                    type="file"
                    multiple
                    @change="onChange"
                    :webkitdirectory="isDir"
                    :directory="isDir"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Plus, Delete, View } from '@element-plus/icons-vue'
const props = defineProps<{
    isDir: boolean
}>()
const emits = defineEmits(['onChange', 'onSelectChange'])
const files = ref<File[]>([])
const markList = ref<boolean[]>([])
const imgSrcList = ref<string[]>([])
const selectIndex = ref(0)

function showMark(index) {
    markList.value[index] = true
}
function hideMark(index) {
    markList.value[index] = false
}
function deleteImg(index) {
    files.value.splice(index, 1)
    imgSrcList.value.splice(index, 1)
    emits('onChange', files.value)
    selectIndex.value = selectIndex.value ? selectIndex.value - 1 : 0
    onSelectChange(selectIndex.value)
}
function onChange(e) {
    const fileList = e.target.files as FileList
    for (let index = 0; index < fileList.length; index++) {
        const file = fileList[index]
        files.value.push(file)
        imgSrcList.value.push(URL.createObjectURL(file))
        markList[index] = false
    }

    emits('onChange', files.value)
    onSelectChange(selectIndex.value)
}

function onSelectChange(index: number) {
    selectIndex.value = index
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
    flex-wrap: wrap;
}
.btn-file {
    position: relative;
    @extend .flex-center;
    @extend .file-box;
    cursor: pointer;
    border: 1px dashed #fff;
    border-radius: 5px;
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
.input-file {
    width: 100%;
    height: 100%;
    @extend .p-ab-center;
    opacity: 0;
    z-index: 2;
}
</style>
