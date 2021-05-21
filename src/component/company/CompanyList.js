import * as api from "../../api/company";

import ProTable from '@ant-design/pro-table';
import React from "react";
import {Button} from 'antd';
import {Link} from "react-router-dom";


const columns = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: '公司名称',
        dataIndex: 'companyName',
        copyable: true,
        tooltip: "必填"

    },
    {
        title: '公司地址',
        search: false,
        dataIndex: 'companyAddr',

    },
    {
        title: "公司类型",
        dataIndex: 'type',
        valueType: 'select',
        initialValue: "3",
        filters: true,
        onFilter: true,
        request: async () => [
            {label: "内部", value: "0"},
            {label: "外部", value: "1"},
            {label: "全部", value: "3"}
        ],

    },
    {
        title: '操作',
        key: 'action',
        sorter: true,
        valueType: 'option',
        render: (_, b, ...item) => {
            return (<Link to={"/companyDescriptions/companyId=" + b.id}> 查看</Link>)
        },
    },

];

const initData = (data) => {
    if (data.length < 1) {
        return [];
    }
    for (let i = 0; i < data.length; i++) {

        data[i].key = i + 1;
    }
    return data;
};

let CompanyList = class Company extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            type: "3",
            config: {},
        }
        this.table = React.createRef();

    }


    getData = (body = this.state) => {

        let promise = api.companyQueryAll(body);
        promise.then((e) => {
                if (e.code === 0) {
                    this.setState({data: initData(e.data)})

                }
            }
        )
    }
    tableColumns = columns.map((item: any) => ({
        ...item,
        ellipsis: true,
    }));

    render() {
        return (
            <ProTable
                style={{height:'95vh'}}
                bordered
                actionRef={this.table}
                pagination={{pageSize: 5, total: 100}}
                {...this.state.config}
                rowSelection={{}}
                // tableAlertRender={(a) =>{
                //     return <div>
                //         已选择{a.selectedRows.length}项
                //         <Button onClick={this.table.current.reload}>全部删除</Button>
                //     </div>
                // }}
                columns={this.tableColumns}
                search={{span: 3}}
                dataSource={this.state.data}
                request={(params, sorsort, filter) => {
                    this.getData(params)
                }
                }
                toolBarRender={() =>
                    <Link to={"/ts/companyDetail"}>
                        <Button type={"primary"} key={"new"}>
                            新建公司
                        </Button>
                    </Link>


                }

            />
        );
    }


};
export default CompanyList;