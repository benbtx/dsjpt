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


let request = axios.create({ baseURL: apiURL_sjy });

let request_data = axios.create({ baseURL: apiURL_sjy });



// axios 配置
request.defaults.timeout = 5000;
// request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//request.defaults.baseURL = 'http://localhost:8008';
// request.defaults.baseURL = 'http://192.168.7.233:8081/';
request.defaults.headers.post['Content-Type'] = 'application/json';
// multipart/form-data
request_data.defaults.headers.post['Content-Type'] = 'multipart/form-data';

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



let http_sjygl;

// export default http_qwjs


export default
http_sjygl = {

    axios: axios,
    request_data: request_data,


    //POST /spider/insertSpiderData  保存爬虫结果到es的sars-cov-2索引中==>后台爬虫
    setPCJG: data => request_data({
        url: '/spider/insertSpiderData',
        method: 'post',
        data,
    }),





    //spider/deleteSpiderData 根据ID删除es中的spider索引下的文档（删除ES中的爬虫数据）==>后台爬虫
    setSCESPCJG: data => request({
        method: "DELETE",
        url: '/spider/deleteSpiderData',
        params: data,
        // showload: true
    }),




    //POST /ds/info/find 数据源---查询（通过名称）
    getSJY: data => request({
        method: "POST",
        url: '/ds/info/customFind',
        data,
        // showload: true
    }),

    //POST /ds/info/findByType 数据源---通过数据源类型查询
    getSJYbyType: data => request({
        method: "POST",
        url: '/ds/info/findByType',
        data,
        // showload: true
    }),

    //GET /ds/type/tree/{id} 数据源类型---根据父id查询结构树
    getSJYLXTREE: data => request({
        method: "GET",
        url: '/ds/type/tree/' + data.id,
        // params: data,
        // showload: true
    }),

    //POST /ds/info/create 数据源---创建
    addSJY: data => request({
        method: "POST",
        url: '/ds/info/create',
        data,
        showload: true
    }),
    //ds/info/updateById 数据源---根据ID更新
    updateSJYbyID: data => request({
        method: "POST",
        url: '/ds/info/updateById',
        data,
        showload: true
    }),

    //GET /ds/info/{id} 数据源---根据ID查询
    getSJYbyID: data => request({
        method: "GET",
        url: '/ds/info/' + data.id,
        // params: data,
        // showload: true
    }),

    ///ds/info/delete/{id} 数据源---根据ID删除
    deleteSJYbyID: data => request({
        method: "GET",
        url: '/ds/info/delete/' + data.id,
        // params: data,
        showload: true
    }),

    //POST /ds/type/find  数据源类型---查询
    getSJYLX: data => request({
        method: "POST",
        url: '/ds/type/find',
        data,
        // showload: true
    }),

    //POST /ds/type/create  数据源类型---创建
    addSJYLX: data => request({
        method: "POST",
        url: '/ds/type/create',
        data,
        // showload: true
    }),

    //GET /ds/type/delete/{id}  数据源类型---根据ID删除
    deleteSJYLXbyID: data => request({
        method: "GET",
        url: '/ds/type/delete/' + data.id,
        // params: data,
        // showload: true
    }),


    //POST /ds/type/updateById 数据源类型---根据ID更新
    updateSJYLXbyID: data => request({
        method: "POST",
        url: '/ds/type/updateById',
        data,
        // showload: true
    }),

    //POST /ds/testMysqlDbConnection
    testMysqlDbConnection: data => request({
        method: "POST",
        url: '/ds/testMysqlDbConnection',
        data,
        // showload: true
    }),

    ///ds/testOracleDbConnection oracle数据库---联通性测试
    testOracleDbConnection: data => request({
        method: "POST",
        url: '/ds/testOracleDbConnection',
        data,
        // showload: true
    }),









}