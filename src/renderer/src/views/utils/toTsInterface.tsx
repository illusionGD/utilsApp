import CodeBlock from '@renderer/components/common/CodeBlock'
import { UTILS_CARD_STYLE } from '@renderer/constants'
import { toTsInterface } from '@renderer/utils'
import { isJSON } from '@renderer/utils/image'
import Card from 'antd/es/card/Card'
import React, { useEffect, useState } from 'react'
import JSON5 from 'json5'
import { message } from 'antd'

type Props = {}

function ToTsInterface({}: Props) {
    const [jsCode, setJsCode] = useState('')
    const [tsCode, setTsCode] = useState('')
    useEffect(() => {
        if (!jsCode) {
            return
        }
        try {
            console.log('🚀 ~ jsCode:', jsCode)
            const obj = JSON5.parse(jsCode)
            const str = toTsInterface(obj)
            setTsCode(() => str)
            console.log('🚀 ~ str:', str)
            console.log('🚀 ~ obj:', obj)
        } catch (error) {
            message.error('请正确输入js对象')
        }
    }, [jsCode])

    const onJsCodeChange = (code) => {
        setJsCode(() => code)
    }

    const style = {
        ...UTILS_CARD_STYLE
    }
    const height = '500px'
    return (
        <div className="flex-center">
            <Card style={style}>
                <textarea
                    style={{
                        height,
                        width: '100%',
                        resize: 'none'
                    }}
                    onChange={(e) => {
                        onJsCodeChange(e.target.value)
                    }}
                ></textarea>
            </Card>
            <Card style={style}>
                <CodeBlock code={tsCode} language="ts" height={height}></CodeBlock>
            </Card>
        </div>
    )
}

export default ToTsInterface
