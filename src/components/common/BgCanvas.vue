<template>
    <div class="bg-canvasoverflow-auto scroll-small">
        <div
            ref="bgCanvas"
            :style="{
                width: width + 'px',
                height: height + 'px',
                backgroundImage: `url(` + bgUrl + ')',
            }"
        >
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps } from 'vue'
import { createTransparentSquare } from '../../utils'

const props = defineProps<{
    width: number
    height: number
}>()
const bgUrl = ref('')

onMounted(() => {
    const canvas = document.createElement('canvas')
    canvas.width = props.width
    canvas.height = props.height
    bgUrl.value = createTransparentSquare(canvas, 8)
})
</script>

<style lang="scss" scoped></style>
