import { useComponentKeyMemo } from '@renderer/hooks'
import { drawGrid } from '@renderer/utils/image'
import React, { useEffect, useRef } from 'react'

type Props = {
    width?: number | string
    height?: number | string
}

function TransparentBG({ width = 512, height = 512 }: Props) {
    const canvasDom = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        drawGrid(canvasDom.current as HTMLCanvasElement)
    }, [])
    return (
        <div>
            <canvas ref={canvasDom} width={width} height={height}></canvas>
        </div>
    )
}

export default useComponentKeyMemo(TransparentBG, ['width', 'height'])
