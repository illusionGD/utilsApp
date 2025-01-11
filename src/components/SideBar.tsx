import React, { useEffect, useState } from 'react'
import {
    FileImageOutlined,
    CodeOutlined,
    SettingOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Button, Menu } from 'antd'
import { useLocation, useNavigate } from 'umi'
type MenuItem = Required<MenuProps>['items'][number]
type Props = {
    collapsed?: boolean
    onChange?: (item: MenuItem) => void
}

const items: MenuItem[] = [
    {
        key: '/image',
        icon: <FileImageOutlined />,
        label: '图片',
    },
    {
        key: '/code',
        icon: <CodeOutlined />,
        label: '代码',
    },
    {
        key: '/setting',
        icon: <SettingOutlined />,
        label: '设置',
    },
]

function SideBar(props: Props) {
    const nav = useNavigate()
    const location = useLocation()
    const [defaultSelectedKeys, setSelectKey] = useState<string[]>([])

    useEffect(() => {
        const curKey = items.find((item) =>
            location.pathname.includes(`${item?.key}`)
        )?.key as string

        setSelectKey(curKey ? [curKey] : [])
    }, [location])

    function onSelectMenu(menuItem: any) {
        props.onChange && props.onChange(menuItem)
        const target = items.find((item) => item?.key === menuItem.key)
        if (target && target.key) {
            nav(`${target.key}`)
        }
    }

    return (
        <div
            className="h-100vh flex-col-between"
            style={{
                position: 'relative',
            }}
        >
            <Menu
                defaultSelectedKeys={defaultSelectedKeys}
                selectedKeys={defaultSelectedKeys}
                mode="inline"
                inlineCollapsed={!!props.collapsed}
                items={items}
                onSelect={onSelectMenu}
            />
        </div>
    )
}

export default SideBar
