import CompanyList from "../component/company/CompanyList";
import CompanyDescriptions from "../component/company/CompanyDescriptions";
import CompanyDetail from "../component/company/CompanyDetail";
import BasicLayout from "../layout/BasicLayout";
import {FormOutlined, SendOutlined, SolutionOutlined, RadarChartOutlined} from "@ant-design/icons"
import React from "react";
import RedBlackTree from "../component/treemap/RedBlackTree";
import {AntDesignOutlined} from "@ant-design/icons";
import {CrownOutlined} from "@ant-design/icons";


let Ac = () =>(<div style={{height:"95vh",width:"95vh"} } />)


export default [
    {
        path: "/ts",
        component:BasicLayout,
        name:"三分钟",
        routes: [
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
    ,
    {
        path:"/gs",
        component:BasicLayout,
        name:"算法可视化",
        routes: [
            {
                path:"/gs/redBlackTree",
                component:RedBlackTree,
                name:"红黑树",
                icon: <RadarChartOutlined/>
            }
        ]
    }
    ,
    {
        path: "/",
        component:BasicLayout,
        redirect:"/gs"
    }
]