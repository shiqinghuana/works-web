import ProDescriptions from '@ant-design/pro-descriptions'
import React from "react";
import {number} from "prop-types";
import {companyQuery} from "../../api/company";
import {message} from "antd";
import ProTable from '@ant-design/pro-table';
import {Button} from "antd";
import {Link} from "react-router-dom";
import {Form} from "antd";
import {Space} from "antd";

const columns = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: "银行名称",
        dataIndex: "backName",
    },
    {
        title: "支行名称",
        dataIndex: "branchBackName",
    },
    {
        title: "收款户名",
        dataIndex: "cardName",
        valueType: "progress",
    },
    {
        title: "账号",
        dataIndex: "cardId",
    },
    {
        title: "备注",
        dataIndex: "mark",
    },


]

const Company = {
    id: number,
    companyName: String,
    companyAddr: String,
    companyPhone: String,
    mark: String,
    type: String,
    updataTime: String,
    insertTime: String,
    delete: number,
}


const config = {
    layout: "horizontal", // 布局，水平垂直
    labelStyle: {fontSize: 20, width: "10em"}, // label 框的属性
    contentStyle: {fontSize: 20}, // 内容框属性
    column: 1,// 一行展示几个框
}
export default class CompanyDescriptions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            config: config,
            loading: false,
        }
        this.desc = React.createRef();

        console.log("props",props)
        let e;
        this.companyId = (e=this.props.match.params.companyId)&& e.split("=")[1]
        if (!this.companyId) {
            message.error("companyId 为空，随机给一个")
            window.location.pathname = "/ts/companyDescriptions/companyId=44"
        }
    }

    render() {
        return (

            <div style={{width: '50%',height:"95vh", borderRight: "solid 1px"}}>
                <ProDescriptions
                    loading={this.state.loading}
                    actionRef={this.desc}
                    request={() => {
                        this.setState({loading: true})
                        companyQuery({id: this.companyId}).then(
                            (res) => {
                                if (res.code === 0) {
                                    console.log(res.data)
                                    this.setState({
                                        res: res.data,
                                        loading: false,
                                        datasource: res.data.companyBackInfos
                                    })
                                }
                            }
                        )
                    }}
                    dataSource={this.state.res}


                    {...this.state.config}

                >
                    <ProDescriptions.Item dataIndex={['company', 'companyName']} label={"公司名称"}/>
                    <ProDescriptions.Item dataIndex={['company', 'companyAddr']} label={"公司地址"}/>
                    <ProDescriptions.Item dataIndex={['company', 'companyPhone']} label={"公司电话"}/>
                    <ProDescriptions.Item dataIndex={['company', 'mark']} label={"公司备注信息"}/>
                    <ProDescriptions.Item valueType={"select"} dataIndex={['company', 'type']} valueEnum={{
                        0: "内部公司"
                    }} label={"公司类型"}/>

                    <ProDescriptions.Item valueType={"dateTime"} dataIndex={['company', 'updataTime']} label={"更新时间"}/>

                </ProDescriptions>
                <br/>
                <p>银行卡信息</p>
                <ProTable
                    rowKey={"id"}
                    bordered
                    columns={columns}
                    search={false}
                    toolBarRender={false}
                    dataSource={this.state.datasource}
                >

                </ProTable>
                <br/>
                <br/>
                <Space>
                    <Link to={"/companyList"}>
                        <Button type={"primary"} > 返回列表</Button>
                    </Link>

                   <Link to={"/ts/companyDetail/companyId=" +  this.companyId}>
                       <Button type={"button"} htmlType={"change"}> 修改</Button>
                   </Link>
                </Space>
            </div>


        );
    }


}