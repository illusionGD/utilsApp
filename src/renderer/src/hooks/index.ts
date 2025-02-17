import { useCallback, useState } from 'react'
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
