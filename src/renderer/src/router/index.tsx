import Index from '@renderer/views'
import PressImage from '@renderer/views/pressImage'
import { Routes, Route } from 'react-router'
interface RoutersType {
    path: string
    component: JSX.Element
    children?: RoutersType[]
}

const routers: RoutersType[] = [
    {
        path: '/',
        component: <Index></Index>
    },
    {
        path: '/PressImage',
        component: <PressImage />,
        children: []
    }
]

const Routers = () => {
    function joinChildren(item: RoutersType, parentsPath: string = '') {
        const { path, component, children } = item
        const curPath = parentsPath + path
        const str = <Route path={curPath} element={component} key={curPath}></Route>

        if (!children || !children.length) {
            return str
        }

        return (
            <>
                {str}
                {children.map((child) => {
                    return joinChildren(child, path)
                })}
            </>
        )
    }

    function getRouters() {
        return routers.map((item) => {
            return <>{joinChildren(item)}</>
        })
    }

    return <Routes>{getRouters()}</Routes>
}

export default Routers
