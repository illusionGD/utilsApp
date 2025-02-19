import PathInput from '@renderer/components/PathInput'
import SelectImageList from '@renderer/components/image/SelectImageList'
import TransparentBG from '@renderer/components/image/TransparentBG'
import { useAutoLocalConfig } from '@renderer/hooks/useAutoConfig'
import { Button, Form, Radio } from 'antd'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import React, { useCallback, useMemo, useState } from 'react'

type Props = {}
type FieldType = {
    inputPath: string
    pathType: string
    isSingle: boolean
    isOpenOutput: boolean
    outputPath: string
}

function Sprites({}: Props) {
    const [form] = Form.useForm()
    const [spritesForm, setForm] = useAutoLocalConfig<FieldType>('sprites', {
        inputPath: '',
        pathType: 'dir',
        isOpenOutput: true,
        isSingle: true,
        outputPath: ''
    })
    const radioGroup: CheckboxGroupProps<string>['options'] = [
        { label: '文件夹', value: 'dir' },
        { label: '文件', value: 'file' }
    ]

    const isDir = useMemo(() => spritesForm.pathType === 'dir', [spritesForm.pathType])

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

    const onFileChange = useCallback(() => {}, [])

    const [loading, setLoading] = useState(false)

    const onFinish = () => {}
    return (
        <div>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 2 }}
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
            </Form>
            <TransparentBG></TransparentBG>
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

export default Sprites
