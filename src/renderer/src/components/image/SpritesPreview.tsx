import React, { useMemo, useState } from 'react'
import CodeBlock from '../common/CodeBlock'
import { Card, InputNumber, theme } from 'antd'
import { FillImageTypeEnum } from './TransparentBG'

type Props = {
    cssName?: string
    imgUrl: string
    frameWidth: number
    frameHeight: number
    frameCount: number
    duration?: number
    direction?: FillImageTypeEnum
}

function SpritesPreview(props: Props) {
    const { imgUrl, frameWidth, frameHeight, frameCount, cssName = 'sprite' } = props
    const [duration, setDuration] = useState(props.duration || 1)

    const createCssCode = (url: string) => {
        const direction = props.direction || FillImageTypeEnum.ROW
        const isRow = direction === FillImageTypeEnum.ROW
        const bgWidth = isRow ? frameWidth * frameCount : frameWidth
        const bgHeight = isRow ? frameHeight : frameHeight * frameCount

        return `
    .${cssName} {
        width: ${frameWidth}px;
        height: ${frameHeight}px;
        background: url('${url}') no-repeat;
        background-size: ${bgWidth}px ${bgHeight}px;
        animation: play-${cssName} ${duration}s steps(${frameCount}) infinite;
    }
    
    @keyframes play-${cssName} {
        from {
            background-position: 0 0;
        }
        to {
            background-position: ${direction === FillImageTypeEnum.ROW ? -bgWidth + 'px 0' : '0 ' + -bgHeight + 'px'};
        }
    }
    `
    }
    return (
        <div className="flex-row-center">
            <div
                style={{
                    flex: 1,
                    height: '100%'
                }}
            >
                <div>
                    <span>速度(s)：</span>
                    <InputNumber
                        defaultValue={duration}
                        min={1}
                        step={1}
                        onChange={(num) => setDuration(() => num || duration)}
                    />
                </div>
                <CodeBlock language="css" code={createCssCode(`${cssName}.png`)}></CodeBlock>
            </div>
            <div
                style={{
                    width: '1px',
                    height: '300px',
                    backgroundColor: 'rgba(255,255,255,0.45)',
                    margin: '0 20px'
                }}
            ></div>
            <div
                style={{
                    flex: 1,
                    height: '100%'
                }}
            >
                {/* 动态 CSS */}
                <style>{createCssCode(imgUrl)}</style>
                <div className={cssName}></div>
            </div>
        </div>
    )
}

export default SpritesPreview
