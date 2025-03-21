import React, { useEffect, useRef, useState } from 'react'
import hljs from '@renderer/plugins/highlight'
import Clipboard from 'clipboard'

type Props = {
    language: string
    code: string
    height?: string
}

function CodeBlock({ language, code, height }: Props) {
    const preRef = useRef<HTMLPreElement>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (preRef.current) {
            preRef.current.innerHTML = `<code class="${language}">${hljs.highlight(code, { language }).value}</code>`

            // 创建 clipboard 实例并保存到变量中
            const clipboard = new Clipboard(`#${language}copy_btn`, {
                text: () => code
            })

            // 监听复制成功事件
            clipboard.on('success', () => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            })

            // 销毁 clipboard 实例
            return () => {
                clipboard.destroy()
            }
        }
    }, [code, language]) // language 变化时也要重新渲染高亮

    return (
        <div className="code-block" style={{ position: 'relative' }}>
            <pre
                ref={preRef}
                className="hljs"
                style={{ minHeight: '40px', height, margin: '0' }}
            ></pre>
            <button
                id={`${language}copy_btn`}
                style={{ position: 'absolute', top: 4, right: 4, lineHeight: '14px' }}
                className="code-block__button"
                data-clipboard-text={code} // 直接传递 code，而不是 target ID
            >
                {copied ? '已复制' : '复制'}
            </button>
        </div>
    )
}

export default CodeBlock
