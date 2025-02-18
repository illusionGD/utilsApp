import { memo, useCallback, useState } from 'react'
import { produce, Immutable } from 'immer'

export function useImmer<T>(data: T) {
    const state = useState<T>(data)
    const setData = useCallback(
        (fn: (draft) => void) => {
            state[1](produce(fn))
        },
        [state[0]]
    )

    return [state[0], setData] as [T, (fn: (draft: T) => void) => void]
}

export function useComponentKeyMemo<T>(
    component: React.FunctionComponent<T>,
    keyArr: Array<keyof T>
) {
    return memo(component, (prevProps: T, nextProps: T) => {
        return keyArr.every((key) => prevProps[key] !== nextProps[key])
    })
}
