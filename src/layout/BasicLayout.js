import React from "react";
import {renderRoutes} from "react-router-config";
import ProLayout, {PageContainer} from '@ant-design/pro-layout';
import routes from "../config/router";
import {Link} from "react-router-dom";


export default class BasicLayout extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props)
    }


    render() {
        return (
            <ProLayout
                title={<p style={{fontSize: 25, color: "white"}}>模版页面</p>}
                logo={false}
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


