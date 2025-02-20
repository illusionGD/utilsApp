import { checkError } from '@renderer/apis'
import PathInput from '@renderer/components/PathInput'
import SelectImageList from '@renderer/components/image/SelectImageList'
import TransparentBG, {
    RenderImgListType,
    TransparentBGImperativeHandleType
} from '@renderer/components/image/TransparentBG'
import { IMG_EXT_ENUM } from '@renderer/constants'
import { useImmer } from '@renderer/hooks'
import { useAutoLocalConfig } from '@renderer/hooks/useAutoConfig'
import { isInvalid, isSucCode } from '@renderer/utils'
import { Button, Form, message, Radio } from 'antd'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Props = {}
type FieldType = {
    inputPath: string
    pathType: string
    isSingle: boolean
    isOpenOutput: boolean
    outputPath: string
    name: string
}

function Sprites({}: Props) {
    const [form] = Form.useForm()
    const [spritesForm, setForm] = useAutoLocalConfig<FieldType>('sprites', {
        inputPath: '',
        pathType: 'dir',
        isOpenOutput: true,
        isSingle: true,
        outputPath: '',
        name: '_sprites'
    })
    const radioGroup: CheckboxGroupProps<string>['options'] = [
        { label: '文件夹', value: 'dir' },
        { label: '文件', value: 'file' }
    ]
    const isDir = useMemo(() => spritesForm.pathType === 'dir', [spritesForm.pathType])
    const [dirImgList, setDirImgList] = useState<RenderImgListType[]>([])
    const [fileImageList, setFileImageList] = useState<RenderImgListType[]>([])
    const imgList = useMemo(
        () => (isDir ? dirImgList : fileImageList),
        [isDir, fileImageList, dirImgList]
    )

    const renderSingleItem = () => {
        return !isDir ? (
            <></>
        ) : (
            <Form.Item<FieldType>
                label="输入路径"
                name="inputPath"
                rules={[
                    {
                        required: true,
                        message: '请输入文件夹路径'
                    }
                ]}
            >
                <PathInput isDir={isDir} placeholder="文件夹路径"></PathInput>
            </Form.Item>
        )
    }

    // 监听输入路径变化
    useEffect(() => {
        getDirImage()
    }, [spritesForm.inputPath])
    const getDirImage = () => {
        if (!spritesForm.inputPath) {
            canvasRef.current?.clearCanvas && canvasRef.current.clearCanvas()
            setDirImgList(() => [])
            return
        }

        window.api.getDirImageBuffer(spritesForm.inputPath).then(({ code, data }) => {
            if (!isSucCode(code)) {
                return
            }
            setDirImgList(() => {
                const list = data.filter((item) => item !== null)
                return list.map(({ ext, data }) => {
                    const type = ext.replace('.', '') as IMG_EXT_ENUM
                    const blob = new Blob([data], { type: `image/${type}` })

                    return {
                        data: blob,
                        type
                    }
                })
            })
        })
    }
    /**监听表单变化 */
    const onFormValChange = useCallback((e: FieldType) => {
        setForm((draft) => {
            Object.assign(draft, e)
        })
    }, [])

    // 图片列表
    useEffect(() => {
        console.log('🚀 ~ imgList:', imgList)
    }, [imgList])
    const onFileChange = useCallback((list: any[]) => {
        if (!imgList.length && !list.length) {
            return
        }
        setFileImageList(() => {
            return list.map(({ url, type }) => {
                return {
                    data: url as string,
                    type: type.split('/')[1] as IMG_EXT_ENUM
                }
            })
        })
    }, [])

    // 输出图片逻辑
    const [loading, setLoading] = useState(false)
    const canvasRef = useRef<TransparentBGImperativeHandleType>(null)
    const onFinish = async () => {
        if (loading) {
            return
        }

        setLoading(() => true)

        if (canvasRef.current && canvasRef.current.outputBlob) {
            const blob = await canvasRef.current?.outputBlob()
            if (blob) {
                console.log('🚀 ~ blob:', blob)
                const arr = await blob.arrayBuffer()
                console.log(
                    "🚀 ~ `${spritesForm.outputPath + '\\'}${spritesForm.name}.png`:",
                    `${spritesForm.outputPath + '\\'}${spritesForm.name}.png`
                )
                const res = await window.api.bufferToImg(
                    arr,
                    `${spritesForm.outputPath + '\\'}${spritesForm.name}.png`
                )
                checkError(res)
                isSucCode(res.code) && message.success('成功')
            }
        }

        setLoading(() => false)
    }
    return (
        <div>
            <Form
                form={form}
                name="basic"
                wrapperCol={{ span: 16 }}
                initialValues={spritesForm}
                onFinish={onFinish}
                onValuesChange={onFormValChange}
                autoComplete="off"
            >
                <Form.Item label="输入类型" name="pathType">
                    <Radio.Group options={radioGroup} />
                </Form.Item>
                {renderSingleItem()}
                <Form.Item<FieldType>
                    label="输出路径"
                    name="outputPath"
                    rules={[{ required: true, message: '请输入文件或文件夹路径' }]}
                >
                    <PathInput isDir placeholder="文件夹路径"></PathInput>
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        生成精灵图
                    </Button>
                </Form.Item>
                <Form.Item>
                    <TransparentBG
                        ref={canvasRef}
                        imgList={imgList}
                        width={200}
                        height={200}
                    ></TransparentBG>
                    <div
                        style={{
                            display: isDir ? 'none' : 'block'
                        }}
                    >
                        <SelectImageList onChange={onFileChange}></SelectImageList>
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Sprites
