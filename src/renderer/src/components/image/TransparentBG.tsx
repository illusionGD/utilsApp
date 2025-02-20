import { IMG_EXT_ENUM } from '@renderer/constants'
import { useComponentKeyMemo } from '@renderer/hooks'
import {
    drawTransparentBG,
    listenImgLoad,
    transformBlobToImg,
    transformBufferToImg
} from '@renderer/utils/image'
import React, {
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    forwardRef
} from 'react'

type Props = {
    width?: number
    height?: number
    imgList?: { data: Buffer | Blob | HTMLImageElement | string; type: IMG_EXT_ENUM }[]
}

export interface TransparentBGImperativeHandleType {
    outputBlob?: () => Promise<Blob | null>
}

function TransparentBG({ width = 1012, height = 550, imgList }: Props, ref) {
    const contentCanvas = useRef<HTMLCanvasElement>(null)
    const [bgUrl, setBgUrl] = useState('')
    useEffect(() => {
        setBgUrl(() => {
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            return drawTransparentBG(canvas as HTMLCanvasElement)
        })
        renderImgList()
    }, [width, height])

    useEffect(() => {
        renderImgList()
    }, [imgList])

    const outputBlob = (): Promise<Blob | null> => {
        return new Promise((reolve, reject) => {
            contentCanvas.current?.toBlob((blob) => {
                if (!blob) {
                    reject(blob)
                    return
                }
                reolve(blob)
            }, 'image/png')
        })
    }

    // 暴露出去的方法
    useImperativeHandle(
        ref,
        (): TransparentBGImperativeHandleType => ({
            outputBlob
        })
    )

    const renderImgList = async () => {
        if (!contentCanvas.current || !imgList) {
            return
        }
        const ctx = contentCanvas.current.getContext('2d')
        ctx?.clearRect(0, 0, width, height)
        if (!imgList.length) {
            return
        }
        // ctx.
        // 转buffer图片，获取image和宽高
        const list = await Promise.all(
            imgList.map(({ data, type }) => {
                if (data instanceof Blob) {
                    return transformBlobToImg(data)
                } else if (data instanceof HTMLImageElement) {
                    return Promise.resolve(data)
                } else if (typeof data === 'string') {
                    return listenImgLoad(data)
                } else {
                    return transformBufferToImg({ data, type })
                }
            })
        )
        console.log('🚀 ~ list:', list)
        let col = 0
        let row = 0
        let maxHeight = 0
        // 横向绘制canvas
        list.forEach((img) => {
            if (!img) {
                return
            }
            const { width: _width, height: _height } = img
            if (row + _width > width) {
                col += maxHeight
                maxHeight = 0
                row = 0
            }
            ctx?.drawImage(img, row, col)
            row += _width
            maxHeight = Math.max(_height, maxHeight)
        })
    }

    return (
        <div
            style={{
                backgroundImage: `url(${bgUrl})`,
                width: `${width}px`,
                height: `${height}px`
            }}
        >
            <canvas ref={contentCanvas} width={width} height={height}></canvas>
            {/* <canvas ref={canvasDom} width={width} height={height}>
            </canvas> */}
        </div>
    )
}

export default useComponentKeyMemo(forwardRef(TransparentBG), ['width', 'height'])
