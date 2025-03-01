import UtilsMenu from '@renderer/components/UtilsMenu'
import { findRouteItem, routers, RouteType } from '@renderer/router'
import { RootState } from '@renderer/store'
import {
    delUtilsRouter,
    setCurrentTabs,
    utilsCurrentTabs,
    utilsTabsList
} from '@renderer/store/utilsStore'
import { Flex, Tabs, Tag } from 'antd'
import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UtilsStyle from '@renderer/assets/css/utils.module.scss'
import { FileImageOutlined, FileZipOutlined, SearchOutlined } from '@ant-design/icons'

type Props = {}

const UtilsIndex = (props: Props) => {
    const utilTabs = useSelector(utilsTabsList)

    const items = useMemo(() => {
        return utilTabs.map((route) => {
            const { name, path, element } = findRouteItem(route) as RouteType
            return {
                label: name,
                children: (
                    <div
                        className="scroll-min"
                        style={{
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                    >
                        {element}
                    </div>
                ),
                key: path
            }
        })
    }, [utilTabs])
    useEffect(() => {
        if (!utilTabs.includes(currentRoute)) {
            dispatch(setCurrentTabs(items.length ? items[items.length - 1].key : ''))
        }
    }, [utilTabs])

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
        // 设置当前tabs
        dispatch(setCurrentTabs(path))
    }, [])

    //#region tags
    // const tags = useMemo(() => {

    //     return utilTabs.map((route) => {
    //         const { name, path } = findRouteItem(route) as RouteType
    //         return {
    //             color: '#55acee',
    //             text: name,
    //             path
    //         }
    //     })
    // }, [utilTabs])

    // const onTagsClick = (index: number) => {}
    // const renderTags = useCallback(() => {
    //     return tags.map(({ color, text }, index) => {
    //         return (
    //             <Tag color={color} key={index} onClick={() => onTagsClick(index)}>
    //                 {text}
    //             </Tag>
    //         )
    //     })
    // }, [tags])
    //#endregion

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
                    width: '100%',
                    overflow: 'auto'
                }}
            >
                <Tabs
                    className="hide-scroll"
                    hideAdd
                    type="editable-card"
                    activeKey={activeKey}
                    items={items}
                    onEdit={onEdit}
                    onChange={onChange}
                    style={{
                        display: utilTabs.length ? 'block' : 'none'
                    }}
                />
                <div
                    className="p-ab-center flex-column-center"
                    style={{
                        display: utilTabs.length ? 'none' : 'flex'
                    }}
                >
                    <div className={`${UtilsStyle.logo} bg-contain`}></div>
                </div>
            </div>
        </div>
    )
}

export default UtilsIndex
