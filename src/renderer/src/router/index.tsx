import { lazy, Suspense } from 'react'
import { Routes, Route, createBrowserRouter } from 'react-router'
import {FileImageOutlined} from '@ant-design/icons'
interface RouteType {
    path: string
    element: any
    name?: string
    description?: string
    children?: RouteType[]
    icon?: any
}

const Home = lazy(() => import('@renderer/views'))
const Utils = lazy(() => import('@renderer/views/utils/utilsIndex'))
const Image = lazy(() => import('@renderer/views/utils/image'))
const PressImage = lazy(() => import('@renderer/views/utils/pressImage'))

export const routers: RouteType[] = [
    {
        path: '/',
        name: '首页',
        element: (
            <Suspense>
                <Home></Home>
            </Suspense>
        )
    },
    {
        path: '/utils',
        name: '工具',
        element: (
            <Suspense>
                <Utils></Utils>
            </Suspense>
        ),
        description: '压缩、合并图片',
        children: [
            {
                path: '/utils/image',
                name: '图片',
                icon: <FileImageOutlined />,
                element: (
                    <Suspense>
                        <Image></Image>
                    </Suspense>
                ),
                children: [
                    {
                        path: '/utils/image/pressImage',
                        name: '压缩图片',
                        element: (
                            <Suspense>
                                <PressImage></PressImage>
                            </Suspense>
                        )
                    }
                ]
            },
        ]
    }
]
const Routers = createBrowserRouter(routers)

export default Routers
