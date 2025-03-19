import { checkError } from '@renderer/apis'
import PathInput from '@renderer/components/PathInput'
import SelectImageList from '@renderer/components/image/SelectImageList'
import SpritesPreview from '@renderer/components/image/SpritesPreview'
import TransparentBG, {
    FillImageTypeEnum,
    RenderImgListType,
    TransparentBGImgDataType,
    TransparentBGImperativeHandleType
} from '@renderer/components/image/TransparentBG'
import { IMG_EXT_ENUM, UTILS_CARD_STYLE } from '@renderer/constants'
import { useImmer } from '@renderer/hooks'
import { useAutoLocalConfig } from '@renderer/hooks/useAutoConfig'
import { isInvalid, isSucCode } from '@renderer/utils'
import { Button, Card, Form, Input, message, Radio, Select } from 'antd'
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
    canvasWith: number
    canvasHeight: number
    adapterType: FillImageTypeEnum
}

function Sprites({}: Props) {
    const [form] = Form.useForm()
    const [spritesForm, setForm] = useAutoLocalConfig<FieldType>('sprites', {
        inputPath: '',
        pathType: 'file',
        isOpenOutput: true,
        isSingle: true,
        outputPath: '',
        name: 'sprites',
        canvasWith: 200,
        canvasHeight: 200,
        adapterType: FillImageTypeEnum.ROW
    })

    // const radioGroup: CheckboxGroupProps<string>['options'] = [
    //     { label: '文件夹', value: 'dir' },
    //     { label: '文件', value: 'file' }
    // ]
    // 适配模式
    const adapterList: Array<{ value: FillImageTypeEnum; label: string }> = [
        {
            label: '行',
            value: FillImageTypeEnum.ROW
        },
        {
            label: '列',
            value: FillImageTypeEnum.COL
        }
    ]
    const isDir = useMemo(() => spritesForm.pathType === 'dir', [spritesForm.pathType])
    const [dirImgList, setDirImgList] = useState<RenderImgListType[]>([])
    const [fileImageList, setFileImageList] = useState<RenderImgListType[]>([])
    const cardStyle = UTILS_CARD_STYLE
    const imgList = useMemo(() => {
        const newList = isDir ? dirImgList : fileImageList
        return newList
    }, [isDir, fileImageList, dirImgList])

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

    // 监听输入路径变化
    useEffect(() => {
        getDirImage()
    }, [spritesForm.inputPath])
    /**监听表单变化 */
    const onFormValChange = useCallback((e: FieldType) => {
        setForm((draft) => {
            Object.assign(draft, e)
        })
    }, [])

    // 图片列表
    const onFileChange = useCallback((list: any[]) => {
        setFileImageList(() => {
            return list.map(({ url, type }) => {
                return {
                    data: url as string,
                    type: type.split('/')[1] as IMG_EXT_ENUM
                }
            })
        })
    }, [])

    //#region css代码
    const [previewData, setPreviewData] = useImmer({
        fWidth: 0,
        fHeight: 0,
        imageUrl: '',
        duration: 1,
        frameCount: 0
    })
    const onImgRender = (list: TransparentBGImgDataType[], url: string) => {
        if (!list.length) {
            setPreviewData((draft) => {
                draft.frameCount = 0
                draft.imageUrl = ''
                draft.fHeight = 0
                draft.fWidth = 0
            })
            return
        }
        const { w, h } = list[0]
        setPreviewData((draft) => {
            draft.frameCount = list.length
            draft.imageUrl = url
            draft.fHeight = h
            draft.fWidth = w
        })
    }
    //#endregion

    //#region 输出图片逻辑
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
    //#endregion
    return (
        <div>
            <div className="flex-row-center">
                <Card style={cardStyle}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={spritesForm}
                        onFinish={onFinish}
                        onValuesChange={onFormValChange}
                        autoComplete="off"
                    >
                        {/* <Form.Item<FieldType> label="输入类型" name="pathType">
                            <Radio.Group options={radioGroup} />
                        </Form.Item> */}
                        <Form.Item<FieldType>
                            label="精灵图名称"
                            name="name"
                            rules={[{ required: true, message: '请输入精灵图名称' }]}
                        >
                            <Input
                                allowClear
                                placeholder="请输入精灵图名称"
                                defaultValue={spritesForm.name}
                            />
                        </Form.Item>
                        {renderSingleItem()}
                        <Form.Item<FieldType>
                            label="输出路径"
                            name="outputPath"
                            rules={[{ required: true, message: '请输入文件或文件夹路径' }]}
                        >
                            <PathInput isDir placeholder="文件夹路径"></PathInput>
                        </Form.Item>
                        <Form.Item<FieldType> label="适配模式" name="adapterType">
                            <Select
                                defaultValue={spritesForm.adapterType}
                                style={{ width: 120 }}
                                options={adapterList}
                            />
                        </Form.Item>
                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                生成精灵图
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <div
                    style={{
                        width: '100%',
                        marginLeft: '10px'
                    }}
                >
                    <Card style={cardStyle}>
                        <SelectImageList
                            styleSheet={{
                                height: '132px'
                            }}
                            onChange={onFileChange}
                        ></SelectImageList>
                    </Card>
                </div>
            </div>
            <Card style={cardStyle}>
                <div
                    className="scroll-min"
                    style={{
                        maxHeight: '250px',
                        maxWidth: '100%',
                        overflow: 'auto',
                        padding: '5px 0'
                    }}
                >
                    <TransparentBG
                        ref={canvasRef}
                        imgList={imgList}
                        fillImageType={spritesForm.adapterType}
                        onImgRender={onImgRender}
                    ></TransparentBG>
                </div>
            </Card>
            <Card style={cardStyle}>
                <SpritesPreview
                    frameCount={previewData.frameCount}
                    frameHeight={previewData.fHeight}
                    frameWidth={previewData.fWidth}
                    imgUrl={previewData.imageUrl}
                    duration={previewData.duration}
                    direction={spritesForm.adapterType}
                    cssName={spritesForm.name}
                ></SpritesPreview>
            </Card>
        </div>
    )
}

export default Sprites
