import UtilsMenu from '@renderer/components/UtilsMenu'
import { findRouteItem, routers, RouteType } from '@renderer/router'
import { RootState } from '@renderer/store'
import {
    delUtilsRouter,
    setCurrentTabs,
    utilsCurrentTabs,
    utilsTabsList
} from '@renderer/store/utilsStore'
import { Tabs } from 'antd'
import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router'

type Props = {}

const UtilsIndex = (props: Props) => {
    const routeList = useSelector(utilsTabsList)
    const items = useMemo(() => {
        return routeList.map((route) => {
            const { name, path, element } = findRouteItem(route) as RouteType
            return {
                label: name,
                children: element,
                key: path
            }
        })
    }, [routeList])
    useEffect(() => {
        dispatch(setCurrentTabs(items.length ? items[items.length - 1].key : ''))
    }, [routeList])

    const dispatch = useDispatch()
    const currentRoute = useSelector(utilsCurrentTabs)
    const activeKey = useMemo(() => currentRoute || '', [currentRoute])

    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove'
    ) => {
        if (action === 'remove') {
            dispatch(delUtilsRouter(targetKey as string))
        }
    }

    const onChange = useCallback((path: string) => {
        dispatch(setCurrentTabs(path))
    }, [])

    return (
        <div
            style={{
                display: 'flex'
            }}
        >
            <UtilsMenu></UtilsMenu>
            <div
                style={{
                    padding: '10px',
                    width: '100%'
                }}
            >
                <Tabs
                    hideAdd
                    type="editable-card"
                    activeKey={activeKey}
                    items={items}
                    onEdit={onEdit}
                    onChange={onChange}
                    style={{
                        display: routeList.length ? 'block' : 'none'
                    }}
                />
                <div
                    style={{
                        display: routeList.length ? 'none' : 'block'
                    }}
                >
                    工具主页
                </div>
            </div>
        </div>
    )
}

export default UtilsIndex
