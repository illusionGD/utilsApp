import { routers } from '@renderer/router'
import { Menu, MenuProps } from 'antd'
import React, { useState } from 'react'
import { useLocation, useNavigate, useRoutes } from 'react-router'

type Props = {}
type MenuItem = Required<MenuProps>['items'][number]

function UtilsMenu({}: Props) {
    const [collapsed, setCollapsed] = useState(true)
    const nav = useNavigate()
    const route = useLocation()
    const utilsMenuList = routers.find(r => r.path === '/utils')?.children || []
    const items: MenuItem[] = utilsMenuList.map(({path, name, icon}) => {
        return {
            key: path,
            label: name,
            icon
        }
    })
    const [defaultSelectedKey] = useState<string>(route.pathname.split('/').slice(0,3).join('/'))
    console.log("🚀 ~ defaultSelectedKey", defaultSelectedKey)

    function onSelect({key}) {
        console.log("🚀 ~ key:", key)
        key && nav(key)
    }

    return (
        <div>
            <Menu
                defaultSelectedKeys={[defaultSelectedKey]}
                mode="inline"
                inlineCollapsed={collapsed}
                items={items}
                onSelect={onSelect}
            />
        </div>
    )
}

export default UtilsMenu
