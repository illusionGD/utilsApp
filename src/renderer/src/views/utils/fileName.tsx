import { renameFilesApi } from '@renderer/apis'
import PathInput from '@renderer/components/PathInput'
import { PrefixSuffixTypeEnum } from '@renderer/constants'
import { useAutoLocalConfig } from '@renderer/hooks/useAutoConfig'
import { Button, Form, Input, message, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useCallback, useState } from 'react'

type Props = {}

type FieldType = {
    inputPath: string
    newName: string
    outputPath: string
    prefixType?: PrefixSuffixTypeEnum
    suffixType?: PrefixSuffixTypeEnum
}
function FileName({}: Props) {
    const [form] = useForm()
    const [fileNameForm, setForm] = useAutoLocalConfig<FieldType>('fileName', {
        inputPath: '',
        newName: 'newName',
        outputPath: '',
        prefixType: PrefixSuffixTypeEnum.EMPTY,
        suffixType: PrefixSuffixTypeEnum.NUMBER
    })
    const fixTypeList = [
        {
            label: '数字',
            value: PrefixSuffixTypeEnum.NUMBER
        },
        {
            label: '字母',
            value: PrefixSuffixTypeEnum.LETTER
        }
    ]
    const renderSelect = (type: 'prefixType' | 'suffixType') => {
        const onSelect = (val) => {
            setForm((draft) => {
                draft[type] = val
            })
        }
        return (
            <Select
                allowClear
                defaultValue={fileNameForm[type]}
                style={{ width: 60 }}
                options={fixTypeList}
                onChange={onSelect}
            />
        )
    }
    /**监听表单变化 */
    const onFormValChange = useCallback((e) => {
        setForm((draft) => {
            Object.assign(draft, e)
        })
    }, [])
    const [loading, setLoading] = useState(false)
    const onModify = async (e) => {
        if (loading) {
            return
        }
        const { inputPath, newName, suffixType, prefixType } = fileNameForm
        if (!suffixType && !prefixType) {
            message.error('请选择前缀或后缀')
            return
        }
        setLoading(() => true)
        await renameFilesApi({
            dir: inputPath,
            newName,
            suffixType,
            prefixType
        })
        setLoading(() => false)
    }
    return (
        <div>
            <Form
                form={form}
                name="fileNameForm"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 10 }}
                initialValues={fileNameForm}
                onFinish={onModify}
                onValuesChange={onFormValChange}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="新名称"
                    name="newName"
                    rules={[{ required: true, message: '请输入新名称' }]}
                >
                    <Input
                        addonBefore={renderSelect('prefixType')}
                        addonAfter={renderSelect('suffixType')}
                    />
                </Form.Item>
                <Form.Item<FieldType>
                    label="文件夹"
                    name="inputPath"
                    rules={[{ required: true, message: '请输入文件或文件夹路径' }]}
                >
                    <PathInput isDir={true}></PathInput>
                </Form.Item>
                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        修改
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default FileName
