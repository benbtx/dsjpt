import axios from "axios";
import qs from "qs";
import auth from "./auth";
import { getBaseUrl } from "./utils";
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


let request = axios.create({ baseURL: apiURL_dwsj_t });

let request_data = axios.create({ baseURL: apiURL_dwsj_xq });



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




request_data.defaults.timeout = 5000;
request_data.defaults.headers.post['Content-Type'] = 'application/json';
interceptor(request_data);






let http_dwdgxfx;

// export default http_qwjs


export default
http_dwdgxfx = {

    axios: axios,
    request_data: request_data,


    //POST /multi/search 多维数据---界面检索

    getDWSJ: data => request({
        url: '/multi/search',
        method: 'post',
        data,
        // showload: true

    }),


    //POST /zhjymx/queryDetail 通过 档案编号、查询人身份证号、对方身份证号 查询交易明细

    getDWSJMX: data => request_data({
        url: '/zhjymx/queryDetail',
        method: 'post',
        params: data,
        // showload: true
    }),


    //POST /mailObject/queryDetail 通过 档案编号、涉案人邮箱、联系人邮箱 查询邮件明细

    getDWSJMX_YJ: data => request_data({
        url: '/mailObject/queryDetail',
        method: 'post',
        params: data,
        // showload: true
    }),


    getDWSJMX_JY: data => request_data({
        url: '/zhjymx/queryDetail',
        method: 'post',
        params: data,
    }),



















}