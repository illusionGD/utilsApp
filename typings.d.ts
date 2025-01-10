import 'umi/typings'

declare global {
    interface Window {
        $api: {
            platform: any
        }
    }
}
