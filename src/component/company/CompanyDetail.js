import React from "react";
import ProForm, {
    ProFormText, ProFormSelect,
} from "@ant-design/pro-form";
import {EditableProTable} from '@ant-design/pro-table';
import {number} from "prop-types";
import {Form} from "antd";
import {Input} from "antd";
import {Button} from "antd";
import {companyChange} from "../../api/company";
import {message} from "antd";
import {companyQuery} from "../../api/company";
import {Space} from "antd";
import {Row} from "antd";
import {Col} from "antd";
import {Upload} from "antd";
import {uploadFile} from "../../api/company";
import {upload} from "../../utils/request";
import {deleteFile} from "../../api/company";
import {Tooltip} from "antd";
import {HashMap} from "../hashmap/HashMap";

/*
* proform 配置信息
* */
const config = {

    layout: "vertical ",
    scrollToFirstError: true,
    // eslint-disable-next-line no-template-curly-in-string
    validateMessages: {required: "'${label}' 是必填字段"},


}


/*
* 后端模型
* */

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

const formItemProps = {
    rules: [
        {
            required: true,
            message: '此项为必填项',
        },
    ],
}
const columns = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: "银行名称",
        dataIndex: "backName",
        formItemProps: formItemProps
    },
    {
        title: "支行名称",
        dataIndex: "branchBackName",
        formItemProps: formItemProps
    },
    {
        title: "收款户名",
        valueType: "progress",
        dataIndex: "cardName",
        formItemProps: formItemProps
    },
    {
        title: "账号",
        dataIndex: "cardId",
        formItemProps: formItemProps
    },
    {
        title: "备注",
        dataIndex: "mark",
    },
    {
        title: "操作",
        valueType: 'option',
        render: () => {
            return null;
        },
    }

]
const companyBackInfos = {
    backName: String,
    branchBackName: String,
    cardName: String,
    cardId: String,
    mark: String,
}


/*
* 请求模型
* */
// eslint-disable-next-line no-unused-vars
const companyVo = {
    type: number,
    companyid: number,
    company: Company,
    companyBackInfos
}

class CompanyDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            config: config,
            res: {},
            loading: false,
            datasource: [],
            type: 0, // 新建 1 更新
            fileList:[],
            upLoadDisable:false
        }
        this.hash = new HashMap();
        console.log(props)
        this.form = React.createRef()
        this.table = React.createRef()
    }

    componentDidMount() {
        const a = this.props.match.params.companyId
        console.log(a)
        if (a) {
            this.setState({loading: true})
            companyQuery({id: a.split("=")[1]}).then(
                (res) => {
                    if (res.code === 0) {
                        this.setState({
                            res: res.data,
                            loading: false,
                            datasource: res.data.companyBackInfos,
                        }, () => {
                            let a = this.state.datasource;
                            let editKey = []
                            for (let i = 0; i < a.length; i++) {
                                a[i].xid = i;
                                editKey.push(i)
                            }
                            this.setState({editKey})  // 此处需要维护一个数组，内容为表格编辑的rowkey，因为后端不直接提供rowkey，需要自己处理
                            this.setState({type: 1})
                            this.form.current.setFieldsValue(this.state.res)  //一定要在这里设置。不能通过initvalue
                            // 因为 initvalue只有在第一次加载生效，而setstate是异步的，拿不到数据，这里设置了，是全局的
                        })
                    }
                }
            )
        }
    }


    render() {
        return (
            <Form
                ref={this.form}
                {...this.state.config}
                onFinish={
                    (values) => {
                        console.log(values)
                        values.type = this.state.type;

                        if (values.companyBackInfos === undefined) {
                            message.warning("至少提交一条银行卡数据")
                            return
                        }
                        debugger;
                        values.company.fileList = JSON.stringify(this.state.fileList)
                        companyChange(values).then(
                            (e) => {
                                if (e.code === 0) {
                                    message.success("提交成功")
                                    window.location.pathname = "/ts/companyDescriptions/companyId=" + e.data
                                }else {
                                    message.error(e.msg)
                                }
                            }
                        )
                    }

                }


            >
                <ProFormText name={["company", "id"]} hidden
                />
                <Row>
                    <Col span={18}>
                      <div style={{borderRight:"solid 1px"}}>
                          <ProForm.Group>

                              <ProFormText name={["company", "companyName"]} label={"公司名称"} width={"sm"}
                                           rules={[{required: true}]}/>

                              <ProFormText name={["company", "companyAddr"]}
                                           label={"公司地址"}
                                           width={"xl"}
                                           rules={[{required: true}]}

                              />

                          </ProForm.Group>

                          <ProForm.Group>
                              <ProFormText name={["company", "companyPhone"]} label={"公司电话"} width={"xl"}
                                           rules={[{required: true}]}/>
                              <ProFormSelect name={["company", "type"]}
                                             label={"公司类型"}
                                             width={"xl"}
                                             rules={[{required: true}]}
                                             options={[{
                                                 value: "0",
                                                 label: "内部"
                                             },
                                                 {
                                                     value: "1",
                                                     label: "外部"
                                                 }]}
                              />
                          </ProForm.Group>

                          <Form.Item label={"备注"} name={["company", "mark"]} wrapperCol={{span: 22, offset: 0}}>
                              {/* wrapperCol  设置布局 span 列框 offset 起始列*/}
                              <Input.TextArea
                                  allowClear
                                  autoSize={{minRows: 5, maxRows: 10}}
                                  showCount={true}
                                  maxLength={1000}
                                  placeholder="请输入备注，最大长度1000字"
                              />
                          </Form.Item>

                      </div>

                    </Col>

                    <Col >
                        <Upload
                            beforeUpload={() =>false}
                            disabled ={this.state.upLoadDisable}
                            onChange={(e) => {
                                if (this.state.fileList.filter((it)=>it.name ===e.file.name).length>0){
                                    message.warn(e.file.name+"已存在,不要重复上传")
                                    return
                                }
                                uploadFile(e.file).then((rsp)=>{
                                    debugger;
                                    if (rsp.code ===0){
                                        this.setState((state)=>{
                                                state.fileList.push({"name":e.file.name,"url": rsp.data})
                                                return state;
                                            }
                                        )
                                    }else {
                                        debugger;
                                        message.error(rsp.msg)
                                    }
                                })
                            }}

                            fileList={ this.state.fileList}

                            // action={"/fileSupport/upload"}
                            onRemove={(e) =>{
                                deleteFile(e.originFileObj).then()
                            }}
                            multiple
                            // accept={".doc,.docx,.csv,.xsl,.xslx,.ptf,.jpg,.jpeg,.png"}
                        >
                          <Tooltip title={"此处只做展示用，后端不保存"}>
                              <Button > 上传</Button>
                          </Tooltip>
                        </Upload>

                    </Col>

                </Row>

                <ProForm.Item label={"银行信息"}
                              name={"companyBackInfos"}
                              trigger="onValuesChange"
                >
                    {/* trigger == 	设置收集字段值变更的时*/}
                    <EditableProTable
                        actionRef={this.table}
                        bordered // 显示边框
                        columns={columns} //列名，可以设置校验规则
                        rowKey="xid"
                        maxLength={5} // 设置最大行数
                        minLength={1}
                        recordCreatorProps={{
                            // 这里设置生成纪录的规则
                            // 这里设置 dataSource 才能用下面defaultDoms 的参数
                            newRecordType: 'dataSource',
                            record: () => ({  // 生成行的下标，如果不设置，自动拿index，删除时会有bug
                                xid: Date.now(),
                            }),
                        }}
                        editable={{
                            type: 'multiple',
                            actionRender: (row, config, defaultDoms) => {
                                return [defaultDoms.delete];
                            },
                            editableKeys: this.state.editKey,
                            onChange: (editKey) => {
                                this.setState({editKey})
                            }
                        }}

                    />
                </ProForm.Item>
                <Form.Item>
                    <Button type={"primary"} htmlType={"submit"} onClick={() => {
                        console.log("ssss", this.table)
                    }}> 提交</Button>

                </Form.Item>
            </Form>


        );
    }


}

export default CompanyDetail;