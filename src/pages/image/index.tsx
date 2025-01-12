import { Card } from 'antd'
import Meta from 'antd/es/card/Meta'
import React, { useState } from 'react'
import { useNavigate } from 'umi'

type Props = {}

function Image({}: Props) {
    const [cardList] = useState([
        {
            icon: '',
            path: '/image/press',
            title: '图片压缩',
            desc: '支持批量压缩图片，并且支持配置压缩倍率和缩放倍率',
        },
        {
            icon: '',
            path: '/image/sprites',
            title: '合并精灵图',
            desc: '多张图片合并一张',
        },
        {
            icon: '',
            path: '/image/fontMap',
            title: '位图字体',
            desc: '生成位图字体文件',
        },
    ])
    const nav = useNavigate()

    function renderCard() {
        return cardList.map(({ title, desc, path }, index) => {
            return (
                <Card
                    hoverable
                    style={{ width: 200, height: 100 }}
                    key={index}
                    onClick={() => {
                        nav(path)
                    }}
                >
                    <Meta title={title} description={desc} />
                </Card>
            )
        })
    }
    return (
        <div className="grid grid-cols-2 place-items-center gap-y-5">
            {renderCard()}
        </div>
    )
}

export default Image
