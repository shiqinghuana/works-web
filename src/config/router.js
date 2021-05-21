import CompanyList from "../component/company/CompanyList";
import CompanyDescriptions from "../component/company/CompanyDescriptions";
import CompanyDetail from "../component/company/CompanyDetail";
import BasicLayout from "../layout/BasicLayout";
import {FormOutlined, SendOutlined, SolutionOutlined, RadarChartOutlined} from "@ant-design/icons"
import React from "react";
import RedBlackTree from "../component/treemap/RedBlackTree";
import Welcome from "../component/Wellcom";
import {Redirect} from "react-router-dom";
import FunctionComponent from "../static/icon/Icon";
import {ShareAltOutlined} from "@ant-design/icons";
import {LinkOutlined} from "@ant-design/icons";
import {RedditOutlined} from "@ant-design/icons";



// eslint-disable-next-line import/no-anonymous-default-export
export default [
    {
        path: "/",
        name:"欢迎",
        exact:true,
        render:() => (
            <Redirect to={"/ts/welcome"}/>
        ),
    },

    {
        path: "/ts",
        component:BasicLayout,
        name:"三分钟快速搭建CURD",
        icon: <LinkOutlined />,
        routes: [
            {
                path: '/ts/welcome',
                component: Welcome,

            },

            {
                path: '/ts/companyList',
                name: "列表页",
                icon: <FormOutlined/>,
                component: CompanyList,
            },
            {
                path: '/ts/companyDetail',
                name: "详情页",
                exact: true,
                icon: <SendOutlined/>,
                component: CompanyDetail,
            },
            {
                path: '/ts/companyDetail/:companyId',
                component: CompanyDetail,
            },
            {
                path: '/ts/companyDescriptions/:companyId',
                name: "明细页",
                icon: <SolutionOutlined/>,
                component: CompanyDescriptions,
            },

        ]
    },
    {
        path:"/gs",
        component:BasicLayout,
        name:"算法可视化",
        icon: <ShareAltOutlined />,
        routes: [
            {
                path:"/gs/redBlackTree",
                component:RedBlackTree,
                name:"红黑树",
                icon: <RadarChartOutlined/>
            }
        ]
    },


]