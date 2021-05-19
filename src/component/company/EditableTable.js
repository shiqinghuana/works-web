import React, {useState} from 'react';
import {message} from 'antd';
import ProForm, {ProFormText} from '@ant-design/pro-form';
import type {ProColumns} from '@ant-design/pro-table';
import {EditableProTable} from '@ant-design/pro-table';
import {Form} from "antd";

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

type DataSourceType = {
    id: React.Key;
    title?: string;
    decs?: string;
    state?: string;
    created_at?: string;
    children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [
    {
        id: 624748504,
        title: '活动名称一',
        decs: '这个活动真好玩',
        state: 'open',
        created_at: '2020-05-26T09:42:56Z',
    },
    {
        id: 624691229,
        title: '活动名称二',
        decs: '这个活动真好玩',
        state: 'closed',
        created_at: '2020-05-26T08:19:22Z',
    },
];

const columns: ProColumns<DataSourceType>[] = [
    {
        title: '活动名称',
        dataIndex: 'title',
        width: '30%',
    },
    {
        title: '状态',
        key: 'state',
        dataIndex: 'state',
        valueType: 'select',
        valueEnum: {
            all: {text: '全部', status: 'Default'},
            open: {
                text: '未解决',
                status: 'Error',
            },
            closed: {
                text: '已解决',
                status: 'Success',
            },
        },
    },
    {
        title: '描述',
        dataIndex: 'decs',
    },
    {
        title: '操作',
        valueType: 'option',
    },
];

const EditableTable = () => {
    const [editableKeys, setEditableRowKeys] = useState(() =>
        defaultData.map((item) => item.id),
    );
    return (
        <Form
onFinish={async (values) => {
    await waitTime(2000);
    console.log(values);
    message.success('提交成功');
}}
initialValues={{
    name: '蚂蚁设计有限公司',
    useMode: 'chapter',
}}
>
    <ProForm.Group>
        <ProFormText
            width="md"
            name="name"
            label="签约客户名称"
            tooltip="最长为 24 位"
            placeholder="请输入名称"
        />
        <ProFormText width="md" name="company" label="我方公司名称" placeholder="请输入名称" />
    </ProForm.Group>
    <ProFormText width="sm" name="id" label="主合同编号" />
    <ProForm.Item
        label="数组数据"
        name="dataSource"
        initialValue={defaultData}
        trigger="onValuesChange"
    >
        <EditableProTable
            rowKey="id"
            toolBarRender={false}
            columns={columns}
            recordCreatorProps={{
            newRecordType: 'dataSource',
            position: 'top',
            record: () => ({
                id: Date.now(),
            }),
        }}
            editable={{
            type: 'multiple',
            editableKeys,
            onChange: setEditableRowKeys,
            actionRender: (row, _, dom) => {
                console.log(dom)
                return [dom.delete];
            },
        }}
            />
    </ProForm.Item>
</Form>
);
};

export default EditableTable;