import { RouterProvider } from 'react-router'
import Routers from './router'
import { theme } from 'antd'
import { Suspense } from 'react'
function App(): JSX.Element {
    const { useToken } = theme
    const { token } = useToken()

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: token.colorBgContainer,
                color: token.colorPrimaryText
            }}
        >
            {/* <Routers></Routers> */}
            <Suspense>
                <RouterProvider router={Routers}></RouterProvider>
            </Suspense>
        </div>
    )
}

export default App
