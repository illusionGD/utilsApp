type StateType = typeof state
const state = {
    routerHistoryList: [],
}
const store = {
    namespace: 'global',
    state,
    reducers: {
        addRouterHistory: (state: StateType, other: any) => {},
        removeRouterHistory: (state: StateType, other: any) => {},
        getRouterHistory: (state: StateType, other: any) => {
            console.log(other)

            return state.routerHistoryList
        },
    },
}

export default store
