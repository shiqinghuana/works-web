import {post}  from "../utils/request";




export let companyChange =(body)=>  post("/works/company/change",body);

export let companyQueryAll = (body) => post("/works/company/queryAll",body)


export let companyQuery = (body) => post("/works/company/query",body)