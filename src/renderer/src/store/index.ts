import { configureStore } from '@reduxjs/toolkit'
import utilsStoreReducer from './utilsStore'

const store = configureStore({
    reducer: {
        utils: utilsStoreReducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export default store
