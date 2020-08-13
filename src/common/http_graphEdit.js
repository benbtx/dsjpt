import axios from "axios";
import qs from "qs";
import auth from "./auth";

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

axios.defaults.headers.common['authUid'] = auth.getUid();
axios.defaults.headers.common['authSid'] = auth.getSid();

//POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    // config.data = qs.stringify(config.data);//如果body里 传的是json 不需要序列化
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
//返回状态判断
axios.interceptors.response.use(
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

let request = axios.create({ baseURL: 'http://192.168.7.222:8083/' });


let http;
export default
http = {
  //获取图形数据
  getGraph: data => request({
    method: "POST",
    url: '/graph/getGraphByArchiveNum',
    params: data,
  }),
  saveGraph: data => request({
    method: "POST",
    url: '/graph/saveGraph',
    data: data,
  }),
  getType: data => request({
    method: "POST",
    url: '/graph/getAllType',
  }),

}
