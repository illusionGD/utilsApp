import { FolderOutlined } from '@ant-design/icons'
import { getFileOrDirPath } from '@renderer/apis'
import { ShowOpenDialogType } from '@renderer/types'
import { isInvalid } from '@renderer/utils'
import { Input } from 'antd'
import { memo, useEffect, useMemo, useState } from 'react'
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
        console.log('🚀 ~ props.isDir:', props.isDir)
        getFileOrDirPath(props, props.isDir).then((paths) => {
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

function areEqual(prevProps: Readonly<PropsType>, nextProps: Readonly<PropsType>) {
    const keyArr: Array<keyof PropsType> = ['defaultPath', 'value', 'isDir', 'placeholder']
    return keyArr.every((key) => prevProps[key] !== nextProps[key])
    return !(prevProps.defaultPath !== nextProps.defaultPath || prevProps.value !== nextProps.value)
    //    return false
}

export default memo(PathInput, areEqual)
