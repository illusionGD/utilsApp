import { getLocalstorage, setLocalstorage } from "@renderer/utils";
import { useEffect, useState } from "react";
import { useImmer } from ".";

/**自动初始化&保存本地配置 */
export function useAutoLocalConfig<T>(key: string, formData: T) {
    const localKey = `${key}_config`
    const localConfig = getLocalstorage(localKey)
    // 获取本地配置并初始化
    if (localConfig) {
        if (formData instanceof Object) {
            Object.assign(formData, localConfig)
        } else {
            formData = localConfig
        }
    }

    const state = useImmer<T>(formData)

    useEffect(() => {
        setLocalstorage(localKey, state[0])
    },[state[0]])

    return state
}