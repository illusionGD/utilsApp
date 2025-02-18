import { DeleteOutlined, PlusOutlined, FileAddOutlined } from '@ant-design/icons'
import { useComponentKeyMemo, useImmer } from '@renderer/hooks'
import { formatFileSize } from '@renderer/utils'
import { Button, List } from 'antd'
import React, { useCallback, useEffect } from 'react'

type listItemType = {
    title: string
    path: string
    icon?: string
    size?: string
}

type PropsType = {
    defaultList?: listItemType[]
    onChange?: (list: listItemType[]) => void
}

function SelectImageList(props: PropsType) {
    const [multiImageList, setMultiImageList] = useImmer<listItemType[]>(props.defaultList || [])
    useEffect(() => {
        props.onChange && props.onChange(multiImageList)
    }, [multiImageList])

    const onFileChange = useCallback((e) => {
        const filesList = e.target.files as FileList
        setMultiImageList((draft) => {
            for (let index = 0; index < filesList.length; index++) {
                const { path, name, size } = filesList[index]
                if (!draft.find((item) => item.path === path)) {
                    draft.push({
                        path,
                        title: name,
                        size: formatFileSize(size)
                    })
                }
            }
        })
    }, [])

    const clearImageList = useCallback(() => {
        setMultiImageList((draft) => {
            draft.splice(0)
        })
    }, [])

    const delImageItem = useCallback((index: number) => {
        setMultiImageList((draft) => {
            draft.splice(index, 1)
        })
    }, [])

    return (
        <div>
            <div
                className="flex-row-between"
                style={{
                    fontSize: '12px',
                    marginBottom: '10px'
                }}
            >
                <span>图片列表：{multiImageList.length}张</span>
                <div>
                    <Button type="primary" color="default" variant="link" size="large">
                        <FileAddOutlined />
                        <input
                            type="file"
                            multiple
                            onInput={(e) => {
                                onFileChange(e)
                            }}
                            style={{
                                display: 'block',
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                position: 'absolute',
                                cursor: 'pointer',
                                appearance: 'none'
                            }}
                        />
                    </Button>
                    <Button color="default" variant="link" size="large" onClick={clearImageList}>
                        <DeleteOutlined />
                    </Button>
                </div>
            </div>
            <div
                className="scroll-min"
                style={{
                    height: '300px',
                    overflowY: 'auto'
                }}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={multiImageList}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                title={
                                    <>
                                        <span>{item.title}</span>&nbsp;&nbsp;
                                        <span
                                            style={{
                                                color: '#8c8c8c'
                                            }}
                                        >
                                            ({item.size})
                                        </span>
                                    </>
                                }
                                description={item.path}
                            />
                            <div>
                                <DeleteOutlined
                                    onClick={() => {
                                        delImageItem(index)
                                    }}
                                />
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    )
}

export default useComponentKeyMemo<PropsType>(SelectImageList, ['defaultList'])
