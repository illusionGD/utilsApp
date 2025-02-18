import { lazy, Suspense } from 'react'
import { Routes, Route, createBrowserRouter } from 'react-router'
import { FileImageOutlined } from '@ant-design/icons'
export interface RouteType {
    path: string
    element: any
    name?: string
    description?: string
    children?: RouteType[]
    icon?: any
    loader?: any
}

const Home = lazy(() => import('@renderer/views'))
const Utils = lazy(() => import('@renderer/views/utils/utilsIndex'))
const Image = lazy(() => import('@renderer/views/utils/image'))
const PressImage = lazy(() => import('@renderer/views/utils/pressImage'))
const Sprites = lazy(() => import('@renderer/views/utils/sprites'))

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
                    },
                    {
                        path: '/utils/image/sprites',
                        name: '精灵图片',
                        element: (
                            <Suspense>
                                <Sprites></Sprites>
                            </Suspense>
                        )
                    }
                ]
            }
        ]
    }
]
export function findRouteItem(targetPath: string) {
    const findRouteByPath = (routes: RouteType[], targetPath: string): RouteType | null => {
        for (const route of routes) {
            if (route.path === targetPath) {
                return route // 找到匹配的路由
            }
            if (route.children) {
                const found = findRouteByPath(route.children, targetPath)
                if (found) return found // 递归查找子路由
            }
        }
        return null // 没找到
    }

    return findRouteByPath(routers, targetPath)
}
const Routers = createBrowserRouter(routers)

export default Routers
