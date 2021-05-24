import React from "react";
import {renderRoutes} from "react-router-config";
import ProLayout, {PageContainer} from '@ant-design/pro-layout';
import routes from "../config/router";
import {Image} from "antd";
import i from "../static/images/2d33195cb865e7759fd71fe081c297f3.jpeg"


export default class BasicLayout extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props)
    }


    render() {
        return (
            <ProLayout
                // logo={()=><Image src={i}
                //                  preview={false}
                //     onClick={() =>{
                //         window.location.pathname = '/'
                //     }}
                // />}
                logo={false}
                title={<p style={{fontSize: 25, color: "white"}}>模版页面</p>}
                route={{routes}}
                menuItemRender={(item, dom) => {
                    if (item.path) {
                        return <a href={item.path}>{item.icon}{dom}</a>
                    }
                }
                }
            >
                <PageContainer

                    content={renderRoutes(this.props.route.routes)}
                >

                </PageContainer>
            </ProLayout>
        )
    }


}


