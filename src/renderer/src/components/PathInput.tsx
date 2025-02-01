import { FolderOutlined } from '@ant-design/icons'
import { getFileOrDirPath } from '@renderer/apis'
import { ShowOpenDialogType } from '@renderer/types'
import {  isInvalid } from '@renderer/utils'
import { Input } from 'antd'
import { memo, useEffect, useMemo, useState } from 'react'
interface PropsType extends Omit<ShowOpenDialogType, 'multi'> {
    path: string
    onChange?: (path: string) => void
}

const PathInput = (props: PropsType) => {
    const pathVal = useMemo(() => isInvalid(props.path) ? props.defaultPath : props.path, [props.path])

    function changePath(path: string) {
        props.onChange && props.onChange(path)
    }

    function getDirPath() {
        getFileOrDirPath(props).then((paths) => {
            changePath(paths[0])
        })
    }

    return (
        <div>
            <Input
                addonBefore={<FolderOutlined onClick={getDirPath} />}
                value={pathVal || ''}
                allowClear
                onChange={(e) => changePath(e.target.value)}
            />
        </div>
    )
}

function areEqual(prevProps: Readonly<PropsType>, nextProps: Readonly<PropsType>) {
    return !(prevProps.defaultPath !== nextProps.defaultPath || prevProps.path !== nextProps.path)
    //    return false
}

export default memo(PathInput, areEqual)
