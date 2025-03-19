import { batchPressImageApi, batchPressImageToDirApi, pressDirImageApi } from '@renderer/apis'
import PathInput from '@renderer/components/PathInput'
import SelectImageList from '@renderer/components/image/SelectImageList'
import { IMG_EXT_ENUM, IMG_EXT_LIST } from '@renderer/constants'
import { useImmer } from '@renderer/hooks'
import { useAutoLocalConfig } from '@renderer/hooks/useAutoConfig'
import { isSucCode } from '@renderer/utils'
import { Button, Form, InputNumber, List, message, Radio, Select, Switch } from 'antd'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import React, { useEffect, useState, useMemo, useCallback } from 'react'

type Props = {}
type FieldType = {
    inputPath: string
    pathType: string
    rate: number
    scale: number
    isSingle: boolean
    isOpenOutput: boolean
    outputPath: string
    targetExt?: IMG_EXT_ENUM | ''
}

const PressImage = (props: Props) => {
    const [pressPressImageForm, setForm] = useAutoLocalConfig<FieldType>('pressPressImage', {
        inputPath: '',
        pathType: 'dir',
        rate: 1,
        scale: 1,
        isOpenOutput: true,
        isSingle: true,
        outputPath: '',
        targetExt: ''
    })
    useEffect(() => {
        console.log('pressPressImageForm', pressPressImageForm)
    }, [pressPressImageForm])

    const extList = ['', ...IMG_EXT_LIST].map((ext) => {
        return {
            label: ext || '不转换',
            value: ext
        }
    })

    const [form] = Form.useForm()
    /**监听表单变化 */
    const onFormValChange = useCallback((e) => {
        setForm((draft) => {
            Object.assign(draft, e)
        })
        // 更改路径类型，清空路径
        if (e['pathType']) {
            form.setFieldValue('inputPath', '')
        }
    }, [])

    const radioGroup: CheckboxGroupProps<string>['options'] = [
        { label: '文件夹', value: 'dir' },
        { label: '文件', value: 'file' }
    ]
    const isDir = useMemo(
        () => pressPressImageForm.pathType === 'dir',
        [pressPressImageForm.pathType]
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

    const [multiImageList, setMultiImageList] = useImmer<
        {
            title: string
            path: string
            icon?: string
        }[]
    >([])
    const onFileChange = useCallback((list) => {
        setMultiImageList((draft) => {
            draft.length = 0
            draft.push(...list)
        })
    }, [])
    useEffect(() => {
        console.log('multiImageList', multiImageList)
    }, [multiImageList])

    /**渲染输出路径输入框 */
    const renderOutput = () => {
        return pressPressImageForm.isOpenOutput ? (
            <Form.Item<FieldType>
                label={null}
                name="outputPath"
                rules={[{ required: true, message: '请输入文件或文件夹路径' }]}
            >
                <PathInput isDir placeholder="文件夹路径"></PathInput>
            </Form.Item>
        ) : (
            <></>
        )
    }

    const [loading, setLoading] = useState(false)
    /** 压缩 */
    const onPress = async ({ inputPath, outputPath, scale, rate, targetExt }: FieldType) => {
        const commonParam = {
            outputPath: outputPath || inputPath,
            scale,
            quality: rate * 100
        }

        if (targetExt) {
            commonParam['targetExt'] = targetExt
        }

        if (loading) {
            return
        }

        setLoading(true)
        let res: any = null
        // 压缩文件夹图片
        if (isDir) {
            res = await pressDirImageApi({
                inputPath,
                ...commonParam
            })
        } else if (!isDir && pressPressImageForm.isOpenOutput) {
            if (!multiImageList.length) {
                message.warning('请选择图片')
                setLoading(false)
                return
            }
            // 批量压缩图片到目标文件夹
            res = await batchPressImageToDirApi(
                multiImageList.map(({ path }) => {
                    return {
                        ...commonParam,
                        inputPath: path
                    }
                }),
                outputPath
            )
        } else {
            // 批量压缩原图片
            res = await batchPressImageApi(
                multiImageList.map(({ path }) => {
                    return {
                        ...commonParam,
                        inputPath: path,
                        outputPath: path
                    }
                })
            )
        }
        setLoading(false)

        const { code, data } = res
        if (isSucCode(code)) {
            message.success(
                `总数：${data.count} 成功：${data.successCount} 失败：${data.failCount}`
            )
        }
    }

    return (
        <div>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 16 }}
                initialValues={pressPressImageForm}
                onFinish={onPress}
                onValuesChange={onFormValChange}
                autoComplete="off"
            >
                <Form.Item label="输入类型" name="pathType">
                    <Radio.Group options={radioGroup} />
                </Form.Item>
                {renderSingleItem()}
                <Form.Item<FieldType> label="压缩倍率" name="rate">
                    <InputNumber min={0.1} max={1.0} step={0.1} />
                </Form.Item>
                <Form.Item<FieldType> label="缩放倍率" name="scale">
                    <InputNumber min={0.1} step={0.1} />
                </Form.Item>
                <Form.Item<FieldType> label="格式" name="targetExt" valuePropName="checked">
                    <Select
                        defaultValue={pressPressImageForm.targetExt}
                        style={{ width: 120 }}
                        options={extList}
                    />
                </Form.Item>
                <Form.Item<FieldType> label="输出路径" name="isOpenOutput" valuePropName="checked">
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
                </Form.Item>
                {renderOutput()}

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        压缩
                    </Button>
                </Form.Item>
            </Form>
            <div
                style={{
                    display: isDir ? 'none' : 'block'
                }}
            >
                <SelectImageList onChange={onFileChange}></SelectImageList>
            </div>
        </div>
    )
}

export default PressImage
