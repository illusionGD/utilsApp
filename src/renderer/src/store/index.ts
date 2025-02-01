import { configureStore } from '@reduxjs/toolkit'
import configsReducer from './config'

export default configureStore({
    reducer: {
        configs: configsReducer
    }
})
