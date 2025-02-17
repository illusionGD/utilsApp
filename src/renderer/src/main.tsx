import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ConfigProvider, theme } from 'antd'
import './assets/css/global.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ConfigProvider
        theme={{
            token: {
                colorBgContainer: '#000',
                colorPrimaryText: '#fff'
            },
            algorithm: [theme.darkAlgorithm, theme.compactAlgorithm]
        }}
    >
        <App />
    </ConfigProvider>
)
