import ReactDOM from 'react-dom/client'
import App from './App'
import { ConfigProvider, theme } from 'antd'
import './assets/css/global.scss'
import { Provider } from 'react-redux'
import store from './store'

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
        <Provider store={store}>
            <App />
        </Provider>
    </ConfigProvider>
)
