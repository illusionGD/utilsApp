import { PlusOutlined } from '@ant-design/icons'
import { pressDirImageApi } from '@renderer/apis'
import PathInput from '@renderer/components/PathInput'
import { useAutoLocalConfig } from '@renderer/hooks/useAutoConfig'
import { Button, Form, InputNumber, Radio, Switch } from 'antd'
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
}

const PressImage = (props: Props) => {
    const [pressPressImageForm, setForm] = useAutoLocalConfig<FieldType>('pressPressImage', {
        inputPath: '',
        pathType: 'dir',
        rate: 1,
        scale: 1,
        isOpenOutput: true,
        isSingle: true,
        outputPath: ''
    })
    useEffect(() => {
        console.log('pressPressImageForm', pressPressImageForm)
    }, [pressPressImageForm])

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

    const renderSingleItem = () => {
        return !isDir ? (
            <Form.Item<FieldType> label="选择图片">
                <Button type="primary" shape="circle">
                    <PlusOutlined />
                </Button>
            </Form.Item>
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

    /** 压缩 */
    const onPress = useCallback(({ inputPath, outputPath, scale, rate }: FieldType) => {
        pressDirImageApi({
            inputPath,
            outputPath: outputPath || inputPath,
            scale,
            quality: rate
        }).then((res) => {
            console.log('🚀 ~ res:', res)
        })
    }, [])
    return (
        <div>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 3 }}
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
                <Form.Item<FieldType> label="输出路径" name="isOpenOutput" valuePropName="checked">
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
                </Form.Item>
                {renderOutput()}

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        压缩
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default PressImage
