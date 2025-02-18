import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'
type UtilsStateType = {
    /**  */
    tabsList: string[]
    currentTabs: string
}
const initialState: UtilsStateType = { tabsList: [], currentTabs: '' }

const utilsStoreSlice = createSlice({
    name: 'utilsStore',
    initialState,
    reducers: {
        addUtilsRouter: (state, action: PayloadAction<string>) => {
            const path = action.payload
            // 排重
            if (state.tabsList.includes(path)) {
                state.currentTabs = path
                return
            }
            state.tabsList.push(path)
        },
        delUtilsRouter: (state, action: PayloadAction<string>) => {
            const { payload } = action
            const index = state.tabsList.findIndex((item) => item === payload)
            if (index >= 0) {
                state.tabsList.splice(index, 1)
            }
            //
            if (!state.tabsList.length) {
                state.currentTabs = ''
            }
        },
        setCurrentTabs: (state, action: PayloadAction<string>) => {
            state.currentTabs = action.payload
        }
    }
})
export const { addUtilsRouter, delUtilsRouter, setCurrentTabs } = utilsStoreSlice.actions
export const utilsTabsList = (state: RootState) => state.utils.tabsList
export const utilsCurrentTabs = (state: RootState) => state.utils.currentTabs
export default utilsStoreSlice.reducer
