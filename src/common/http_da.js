import axios from "axios";
import qs from "qs";
import auth from "./auth";
import { getBaseUrl } from "../common/utils";
import { MessageBox } from "element-ui";


let request = axios.create({ baseURL: 'http://192.168.7.233:8081/' });


// axios 配置
request.defaults.timeout = 5000;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//axios.defaults.baseURL = 'http://localhost:8008';
// axios.defaults.baseURL = 'http://192.168.7.233:8081/';
// request.defaults.headers.post['Content-Type'] = 'application/json';

// axios.defaults.baseURL = getBaseUrl(window.location.href);
request.defaults.headers.common['authUid'] = auth.getUid();
request.defaults.headers.common['authSid'] = auth.getSid();

//POST传参序列化
request.interceptors.request.use((config) => {
    if (config.method === 'post') {
        // config.data = qs.stringify(config.data);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

//返回状态判断
request.interceptors.response.use(
    response => {
        if (response.data && response.data.code) {
            if (response.data.code === '2001') {
                auth.logout()
            }
        }
        return response;
    },
    error => {
        if (error.response) {
            //全局ajax错误信息提示
            //MessageBox({type:"error",message:error.response.data,title:"温馨提示",});
        }
        //return Promise.reject(error);
    });

export function fetch(url, config = { method: 'get' }) {
    return axios.request({...config, url })
        // return new Promise((resolve, reject) => {
        //   axios.request({ ...config, url })
        //     .then(response => {
        //       resolve(response.data);
        //     }, err => {
        //       reject(err);
        //     })
        //     .catch((error) => {
        //       reject(error)
        //     })
        // })
}

let http_da;

export default
http_da = {

    //获取档案信息
    getDAXX: data => request({
        method: "POST",
        url: '/archives/queryArchivesInfo',
        params: data,
    }),

    // POST /archives/searchByFuzzyName
    //搜索所有档案信息通过模糊档案名
    getDA: data => request({
        method: "POST",
        url: '/archives/searchByFuzzyName',
        params: data,
    }),


    //保存图快照  POST /graphSnapshot/save 保存图快照
    getTCC: data => request({
        method: "POST",
        url: '/graphSnapshot/save',
        data: data.graphSnapshotDto,
    }),

    // POST /graphSnapshot/delete 删除图快照
    getTSC: data => request({
        method: "POST",
        url: '/graphSnapshot/delete',
        params: data,
    }),


    ////GET /graphSnapshot/queryAll 分页查询图快照列表 
    getTKZLB: data => request({
        method: "GET",
        url: '/graphSnapshot/queryAll',

        params: data,
    }),

    ////  查询图快照  GET /graphSnapshot/queryByGraphSnapshotId
    getTKZ: data => request({
        method: "GET",
        url: '/graphSnapshot/queryByGraphSnapshotId',

        params: data,
    }),








}