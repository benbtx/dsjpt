import axios from "axios";
import qs from "qs";
import auth from "./auth";
import { getBaseUrl } from "../common/utils";
import { MessageBox } from "element-ui";
import interceptor from './interceptor';

// // axios 配置
// axios.defaults.timeout = 5000;
// // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// //axios.defaults.baseURL = 'http://localhost:8008';
// axios.defaults.baseURL = 'http://192.168.7.182:8089/';

// // axios.defaults.baseURL = getBaseUrl(window.location.href);
// axios.defaults.headers.common['authUid'] = auth.getUid();
// axios.defaults.headers.common['authSid'] = auth.getSid();

// let request = axios.create({ baseURL: 'http://192.168.7.182:8089/' });
// console.log(Vue.prototype.ApiUrl);
// let request = axios.create({ baseURL: 'http://192.168.7.239:8089/' });

// let request_data = axios.create({ baseURL: 'http://192.168.7.239:8089/' });


let request = axios.create({ baseURL: apiURL });

let request_data = axios.create({ baseURL: apiURL });



// axios 配置
request.defaults.timeout = 5000;
// request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//request.defaults.baseURL = 'http://localhost:8008';
// request.defaults.baseURL = 'http://192.168.7.233:8081/';

request.defaults.headers.post['Content-Type'] = 'application/json';
// multipart/form-data
// request_data.defaults.headers.post['Content-Type'] = 'multipart/form-data';

// axios.defaults.baseURL = getBaseUrl(window.location.href);
request.defaults.headers.common['authUid'] = auth.getUid();
request.defaults.headers.common['authSid'] = auth.getSid();

interceptor(request);




// //POST传参序列化
// request.interceptors.request.use((config) => {
//     if (config.method === 'post') {
//         // config.data = qs.stringify(config.data);
//     }
//     // if(config.showload)  设置全局加载 loading 
//     //   {
//     //     showFullScreenLoading();
//     //   }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

// //返回状态判断
// request.interceptors.response.use(
//     response => {
//         if (response.data && response.data.code) {
//             if (response.data.code === '2001') {
//                 auth.logout()
//             }
//         }
//         return response;
//     },
//     error => {
//         if (error.response) {
//             //全局ajax错误信息提示
//             //MessageBox({type:"error",message:error.response.data,title:"温馨提示",});
//         }
//         //return Promise.reject(error);
//     });



let http_yjfx;

// export default http_qwjs


export default
http_yjfx = {

    axios: axios,
    request_data: request_data,


    //GET /emailRecord/selectMailDetail 邮件详情分析==>邮件分析

    getYJXQ: data => request({
        url: '/emailRecord/selectMailDetail',
        method: 'post',
        data,
        // showload: true

    }),


    //GET /ElasticSearch4EmailAnalysis/queryEmailByIds 查询邮件明细信息=>邮件分析

    getYJMX: data => request({
        url: '/ElasticSearch4EmailAnalysis/queryEmailById',
        method: 'post',
        params: { emailId: data.emailId },
        data: data.caseNumSet,
        // showload: true
    }),

    //GET /ElasticSearch4EmailAnalysis/queryEmailBySensitiveWord 敏感词分析=>邮件分析
    getMGCFX: data => request({
        url: '/ElasticSearch4EmailAnalysis/queryEmailBySensitiveWord',
        method: 'post',
        data,
        // showload: true
    }),


















}