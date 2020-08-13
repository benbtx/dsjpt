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

let request = axios.create({ baseURL: 'http://192.168.7.239:8089/' });
let request1= axios.create({ baseURL: 'http://192.168.7.233:8089/' })
let request2 = axios.create({ baseURL: 'http://192.168.7.233:8082/' })

let http;
export default
http = {
  //邮件对象分析
  getObjectAnalysis: data => request({
    method: "POST",
    url: '/mailObject/search',
    data: data,
  }),

//邮件列表
  getMialTables: data => request({
    method: "POST",
    url: '/mailObject/queryDetail',
    params: data,
  }),

  //获取邮件往来分析
  getMialAnalysis: data => request2({
    method: "POST",
    url: '/mailExchange/search',
    data: data,
  }),

  //获取案件对象
  getPersons: data => request1({
    method: "POST",
    url: '/involved/queryInvolvedByArchivesNum',
    params: data,
  }),

  //获取邮件详情
  getEmailDetail: data => request({
    method: "POST",
    url: '/ElasticSearch4EmailAnalysis/queryEmailById',
    params: data,
  })
}
