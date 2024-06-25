import { ref, onBeforeMount, Ref, watch } from 'vue'
import { AnyObject } from '../types'
import { getLocalStorage, setLocalStorage } from '../utils/store'

/**
 * 获取本地缓存配置hook
 * @param key 缓存key
 * @param watchConfig 监听的config对象
 */
export function useLocalConfig(key: string, watchConfig: Ref<AnyObject>) {
    watch(
        watchConfig,
        () => {
            setLocalStorage(key, watchConfig.value)
        },
        { deep: true }
    )

    onBeforeMount(() => {
        const cacheConfig = getLocalStorage<any>(key)
        if (cacheConfig) {
            watchConfig.value = cacheConfig
        }
    })
}
