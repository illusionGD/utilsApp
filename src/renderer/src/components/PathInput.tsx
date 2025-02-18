import { FolderOutlined } from '@ant-design/icons'
import { getFileOrDirPathApi } from '@renderer/apis'
import { useComponentKeyMemo } from '@renderer/hooks'
import { ShowOpenDialogType } from '@renderer/types'
import { isInvalid } from '@renderer/utils'
import { Input } from 'antd'
import { useMemo } from 'react'
interface PropsType extends Omit<ShowOpenDialogType, 'multi'> {
    value?: string
    isDir?: boolean
    placeholder?: string
    onChange?: (path: string) => void
}

const PathInput = (props: PropsType) => {
    const pathVal = useMemo(() => {
        return isInvalid(props.value) ? props.defaultPath : props.value
    }, [props.value])

    function changePath(path: string) {
        props.onChange && props.onChange(path)
    }

    function getDirPath() {
        getFileOrDirPathApi(props, props.isDir).then((paths) => {
            changePath(paths[0])
        })
    }

    return (
        <div>
            <Input
                addonBefore={<FolderOutlined onClick={getDirPath} />}
                value={pathVal || ''}
                allowClear
                placeholder={props.placeholder}
                onChange={(e) => changePath(e.target.value)}
            />
        </div>
    )
}

export default useComponentKeyMemo<PropsType>(PathInput, [
    'defaultPath',
    'value',
    'isDir',
    'placeholder'
])
