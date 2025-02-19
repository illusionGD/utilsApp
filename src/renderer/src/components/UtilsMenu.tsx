import { routers, RouteType } from '@renderer/router'
import { addUtilsRouter, setCurrentTabs, utilsCurrentTabs } from '@renderer/store/utilsStore'
import { Menu, MenuProps } from 'antd'
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

type Props = {}
type MenuItem = Required<MenuProps>['items'][number]

function formatMenuList(routes: RouteType[]): MenuItem[] {
    return routes.map(({ path, name, icon, children }) => {
        const menu = {
            key: path,
            label: name,
            icon
        }
        if (children && children.length) {
            menu['children'] = formatMenuList(children)
        }
        return menu
    })
}
const utilsMenuList = routers.find((r) => r.path === '/utils')?.children || []
const items: MenuItem[] = formatMenuList(utilsMenuList)

function UtilsMenu({}: Props) {
    const [collapsed, setCollapsed] = useState(false)
    const nav = useNavigate()
    const currentRoute = useSelector(utilsCurrentTabs)
    const dispatch = useDispatch()
    const defaultSelectedKey = useMemo(() => currentRoute || '', [currentRoute])

    function onSelect({ key }) {
        dispatch(addUtilsRouter(key))
        dispatch(setCurrentTabs(key))
        key && nav(key)
    }

    return (
        <div>
            <Menu
                defaultSelectedKeys={[defaultSelectedKey]}
                mode="inline"
                theme="dark"
                inlineCollapsed={collapsed}
                items={items}
                selectedKeys={[defaultSelectedKey]}
                onSelect={onSelect}
            />
        </div>
    )
}

export default UtilsMenu
