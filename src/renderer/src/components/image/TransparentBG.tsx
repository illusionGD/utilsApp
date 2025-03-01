import { IMG_EXT_ENUM } from '@renderer/constants'
import { useComponentKeyMemo, useImmer } from '@renderer/hooks'
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
export interface RenderImgListType {
    data: Buffer | Blob | HTMLImageElement | string
    type: IMG_EXT_ENUM
}
export enum FillImageTypeEnum {
    /** 适配宽 */
    WIDTH = 'width',
    /** 适配高 */
    HEIGHT = 'height',
    /** 行 */
    ROW = 'row',
    /** 列 */
    COL = 'col',
    /** 固定宽高 */
    WH = 'wh'
}
type Props = {
    width?: number
    height?: number
    imgList?: RenderImgListType[]
    /** 图片填充模式： 适配宽、适配高、固定宽高*/
    fillImageType?: FillImageTypeEnum
    onImgRender?: (list: TransparentBGImgDataType[], imageUrl: string) => void
}

export interface TransparentBGImperativeHandleType {
    outputBlob?: () => Promise<Blob | null>
    clearCanvas?: () => void
}

export interface TransparentBGImgDataType {
    x: number
    y: number
    w: number
    h: number
}

const defaultProps = {
    width: 200,
    height: 200
}

function TransparentBG(props: Props, ref) {
    const { imgList, fillImageType } = Object.assign({ ...defaultProps }, props) as Props
    const contentCanvas = useRef<HTMLCanvasElement>(null)
    const [cWH, setCWH] = useState({
        width: defaultProps.width!,
        height: defaultProps.height!
    })
    const [bgUrl, setBgUrl] = useState('')
    const [imgInstanceList, setImgInstanceList] = useState<HTMLImageElement[]>([])
    Object.assign(defaultProps, props)

    //#region 触发渲染逻辑
    useEffect(() => {
        renderBg()
    }, [])
    useEffect(() => {
        renderImgList()
    }, [cWH.width, cWH.height])
    useEffect(() => {
        reComputedWH()
    }, [imgInstanceList, fillImageType])
    const resetCanvasWH = (width: number, height: number) => {
        setCWH(() => {
            return {
                width,
                height
            }
        })
    }
    /**  重新计算宽高 */
    const reComputedWH = () => {
        let _width = 0
        let _height = 0
        if (!imgInstanceList.length) {
            resetCanvasWH(defaultProps.width, defaultProps.height)
            clearCanvas()
            return
        }
        // 行排列
        if (fillImageType === FillImageTypeEnum.ROW) {
            imgInstanceList.forEach(({ width, height }) => {
                _width += width
                _height = Math.max(_height, height)
            })
            // 重置宽高
            resetCanvasWH(_width, _height)
        } else if (fillImageType === FillImageTypeEnum.COL) {
            // 列排列
            imgInstanceList.forEach(({ width, height }) => {
                _height += height
                _width = Math.max(width, _width)
            })
            // 重置宽高
            resetCanvasWH(_width, _height)
        } else {
            renderImgList()
        }
    }
    useEffect(() => {
        reSetImgInstanceList()
    }, [imgList])
    /** 重新获取img实例列表 */
    const reSetImgInstanceList = async () => {
        if (!imgList) {
            setImgInstanceList(() => [])
            return
        }
        // 转img
        const pList = imgList.map(({ data, type }) => {
            if (data instanceof Blob) {
                return transformBlobToImg(data)
            } else if (data instanceof HTMLImageElement) {
                return Promise.resolve(data)
            } else if (typeof data === 'string') {
                return listenImgLoad(data)
            } else if (data instanceof ArrayBuffer) {
                return transformBufferToImg({ buffer: data, type })
            }
        })
        const list = (await Promise.all(pList)) as HTMLImageElement[]
        console.log('🚀 ~ list:', list)
        setImgInstanceList(() => list)
    }
    //#endregion

    //#region 暴露出去的方法
    /** 输出blob */
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
    /** 清空画布 */
    const clearCanvas = () => {
        if (!contentCanvas.current) {
            return
        }
        const ctx = contentCanvas.current.getContext('2d')
        ctx?.clearRect(0, 0, cWH.width, cWH.height)
    }
    useImperativeHandle(
        ref,
        (): TransparentBGImperativeHandleType => ({
            outputBlob,
            clearCanvas
        })
    )
    //#endregion

    //#region 渲染逻辑
    /** 渲染透明背景 */
    const renderBg = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 16
        canvas.height = 16
        setBgUrl(() => {
            return drawTransparentBG(canvas as HTMLCanvasElement)
        })
    }
    /** 渲染图片 */
    const renderImgList = async () => {
        if (!contentCanvas.current || !imgInstanceList) {
            return
        }

        const ctx = contentCanvas.current.getContext('2d')
        clearCanvas()

        if (!imgInstanceList.length) {
            props.onImgRender && props.onImgRender([], contentCanvas.current.toDataURL('image/png'))
            return
        }

        let col = 0
        let row = 0
        let maxHeight = 0
        const imgDataList: TransparentBGImgDataType[] = []

        imgInstanceList.forEach((img) => {
            if (!img) {
                return
            }
            const data: TransparentBGImgDataType = {
                x: 0,
                y: 0,
                w: img.width,
                h: img.height
            }
            // 横向绘制canvas
            if (fillImageType === FillImageTypeEnum.ROW) {
                const { width: _width, height: _height } = img
                if (row + _width > cWH.width) {
                    col += maxHeight
                    maxHeight = 0
                    row = 0
                }

                data.x = row
                data.y = col

                ctx?.drawImage(img, row, col)

                row += _width
                maxHeight = Math.max(_height, maxHeight)
            } else {
                // 纵向绘制canvas
                const { width: _width, height: _height } = img
                col += maxHeight

                data.x = row
                data.y = col

                ctx?.drawImage(img, row, col)

                maxHeight = _height
            }
            imgDataList.push(data)
        })

        props.onImgRender &&
            props.onImgRender(imgDataList, contentCanvas.current.toDataURL('image/png'))
    }
    //#endregion

    return (
        <div
            style={{
                backgroundImage: `url(${bgUrl})`,
                width: `${cWH.width}px`,
                height: `${cWH.height}px`
            }}
        >
            <canvas ref={contentCanvas} width={cWH.width} height={cWH.height}></canvas>
        </div>
    )
}

export default useComponentKeyMemo(forwardRef(TransparentBG), ['width', 'height', 'fillImageType'])
