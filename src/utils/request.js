



// eslint-disable-next-line no-unused-vars
const Accept = "application/json, text/javascript, */*;";
/**
 * 几种header， 默认  application/x-www-form-urlencoded; charset=utf-8编码
 */
// eslint-disable-next-line no-unused-vars
const DefaultContentType = "application/x-www-form-urlencoded; charset=utf-8";

// eslint-disable-next-line no-unused-vars
const FileContentType = "multipart/form-data";

const JsonType = "application/json";

const errCallBack = (e) => {
    // 非业务问题固定返回格式
    return {
        code:99,
        msg:e
    };
}

// eslint-disable-next-line no-use-before-define
export const get = (url,errCallBack =errCallBack):Promise=>{
    let init = {
        method: 'get'
    }
    let request = new Request(url, init);
    return fetch(request)
        .then((res) => {
            return  res.json()
        })
        .then(e => {return  e})
        .catch(
            e => errCallBack.call(e)
        )
}


export const post = (url,body):Promise=> {
    let init = {
        method: 'post',
        headers: {'Content-Type': JsonType},
        body: JSON.stringify(body)
    }
    console.log("请求参数",body)
    let request = new Request(url, init);
    return fetch(request)
        .then((res) => {
            return res.json()
        })
        .then(e => {
            console.log(e)
            return e
        })
        .catch(
            e => errCallBack.call(e)
        )
}

export const upload = (url,body)=>{
    let formData = new FormData();
    formData.append("file",body)
    let init = {
        method: 'post',
        body: formData
    }
    const request = new Request(url,init);
    return fetch(request).then((res) => {
        return res.json()
    })



}

//
// export default class MyRequest extends React.Component{
//     url;
//     method;
//     type;
//     body;
//     response;
//     getRequest = () => {
//         let init = {
//             method: 'get'
//         }
//         return new Request(this.url, init)
//     }
//
//
//     postRequest = () => {
//         let init = {
//             method: 'post',
//             headers: {'Content-Type':JsonType},
//             body: JSON.stringify(this.body)
//         }
//         return new Request(this.url, init)
//     }
//
//     fileRequest = (body) => {
//         const formData = new FormData();
//         formData.append('fileName', {...body})
//         this.body = formData;
//         let init = {
//             method: 'post',
//             header: FileContentType, //这里可能要去掉
//             body: this.body
//         }
//         return new Request(this.url, init)
//     }
//
//
//     get(url) {
//         this.url =url
//         return fetch(this.getRequest())
//             .then((res) => {
//                 return  res.json()
//             })
//             .then(e => {return  e})
//             .catch(
//                 e => {
//                     // 非业务问题固定返回格式
//                     return {
//                         code:99,
//                         msg:e.stack
//                     };
//                 }
//             )
//     }
//
//
//     post(url, body){
//         this.url = url;
//         this.body = body;
//         return fetch(this.postRequest())
//             .then((res) => {
//                 return  res.json()
//             })
//             .then(e => {return  e})
//             .catch(
//                 e => {
//                     // 非业务问题固定返回格式
//                     return {
//                         code:99,
//                         msg:e.stack
//                     };
//                 }
//             )
//
//     }
//
// }
//
