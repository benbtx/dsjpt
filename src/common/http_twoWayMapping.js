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
request.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

// axios.defaults.baseURL = getBaseUrl(window.location.href);
request.defaults.headers.common['authUid'] = auth.getUid();
request.defaults.headers.common['authSid'] = auth.getSid();
//POST传参序列化
request.interceptors.request.use((config) => {
  if (config.method === 'post') {
    // config.data = qs.stringify(config.data);//如果body里 传的是json 不需要序列化

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


let http;
export default
http = {

  //通过类型和值查询
  getByTypeValue: data => request({
    method: "POST",
    url: '/twoWayMapping/getAllByTypeAndValue',
    params: data,
  }),

  //通过mapId查询
  getByMapId: data => request({
    method: "POST",
    url: '/twoWayMapping/getAllByMapId',
    params: data,
  }),

  //双向映射绑定
  bindMapId: data => request({
    method: "POST",
    url: '/twoWayMapping/bindTypeAndValue',
    params: data,
  }),
}
