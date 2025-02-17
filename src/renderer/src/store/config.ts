import { createSlice } from '@reduxjs/toolkit'

const configsSlice = createSlice({
    name: 'configs',
    initialState: {
        pressImageConfig: {}
    },
    reducers: {
        updateConfig: (state, config) => {
            console.log(config)
            state.pressImageConfig = config.payload
        }
    }
})

export default configsSlice.reducer
