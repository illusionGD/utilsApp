import PathInput from '@renderer/components/PathInput'
import { useAutoLocalConfig } from '@renderer/hooks/useAutoConfig'
import { Button, Form, InputNumber } from 'antd'
import React, { useEffect, useState, useMemo, useCallback } from 'react'

type Props = {}
type FieldType = {
    inputPath: string
    rate: number
    scale: number
    outputPath?: string
}

const PressImage = (props: Props) => {
    const [pressPressImageForm, setForm] = useAutoLocalConfig<FieldType>('pressPressImage', {
        inputPath: '',
        rate: 1,
        scale: 1,
        outputPath: ''
    })

    useEffect(() => {
        console.log('pressPressImageForm', pressPressImageForm)
    }, [pressPressImageForm])

    const onFormChange = useCallback((key: keyof FieldType, val: any) => {
        setForm((draft) => {
            draft[key] = val as never
        })
    }, [])

    const onPress = useCallback((e) => {
    console.log("🚀 ~ e:", e)

    }, [])
    return (
        <div>
            <Form
                name="basic"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 16 }}
                initialValues={pressPressImageForm}
                onFinish={onPress}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="文件路径"
                    name="inputPath"
                    rules={[{ required: true, message: '请输入文件或文件夹路径' }]}
                >
                    <PathInput
                        path={pressPressImageForm.inputPath}
                        onChange={(path) => onFormChange('inputPath', path)}
                    ></PathInput>
                </Form.Item>
                <Form.Item<FieldType> label="压缩倍率" name="rate">
                    <InputNumber
                        min={0.1}
                        max={1.0}
                        step={0.1}
                        onChange={(rate) => onFormChange('rate', rate)}
                    />
                </Form.Item>
                <Form.Item<FieldType> label="缩放倍率" name="scale">
                    <InputNumber
                        min={0.1}
                        step={0.1}
                        onChange={(scale) => onFormChange('scale', scale)}
                    />
                </Form.Item>
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
