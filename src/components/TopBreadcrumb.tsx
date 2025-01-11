import React, { useEffect, useState } from 'react'
import { Breadcrumb } from 'antd'
import { Link, useLocation, useNavigate } from 'umi'
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb'

type Props = {}

const TopBreadcrumb = (props: Props) => {
    const [items, setItems] = useState([
        {
            title: '首页',
            path: '/',
        },
    ])
    const location = useLocation()
    const nav = useNavigate()

    useEffect(() => {
        // 每次路由变化时执行的逻辑
        const hadIndex = items.findIndex(
            (item) => item.path === location.pathname
        )

        const routerName = location.pathname.replace('/', '')
        const temp = []
        if (hadIndex >= 0) {
            temp.push(...items.slice(0, hadIndex + 1))
        } else {
            temp.push(...items, {
                title: routerName,
                path: location.pathname,
            })
        }
        setItems(temp)
    }, [location])

    function itemRender(currentRoute: any) {
        return (
            <span
                className="cursor-pointer"
                onClick={() => {
                    nav(currentRoute.path)
                }}
            >
                {currentRoute.title}
            </span>
        )
    }
    return <Breadcrumb itemRender={itemRender} items={items} />
}

export default TopBreadcrumb
