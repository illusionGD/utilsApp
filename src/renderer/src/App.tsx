import { RouterProvider } from 'react-router'
import Routers from './router'
import { theme, message } from 'antd'
import { Suspense } from 'react'

// 设置全局 message 配置
message.config({
    duration: 3, // 显示时间 2 秒
    maxCount: 3 // 最大同时显示 3 条
})

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
