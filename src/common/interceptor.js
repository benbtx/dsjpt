import { Message, MessageBox } from 'element-ui'
// import { getToken, setToken, removeToken, getTokenType, setTokenType } from '@/utils/auth'
import { showFullScreenLoading, tryHideFullScreenLoading } from './screenloading'
import Vue from 'vue'

export default function defaultInterceptor(axios) {
    axios.defaults.timeout = 100000;
    axios.defaults.withCredentials = true;
    // axios.defaults.headers.common["Authorization"] = getToken();
    // request拦截器
    axios.interceptors.request.use(config => {
        if (!config.baseURL) {
            // console.log(Vue.prototype.ApiUrl)
            config.baseURL = Vue.prototype.ApiUrl;
        }
        if (config.showload) {
            showFullScreenLoading();
        }
        // if (getToken()) {
        //   config.headers['Authorization'] = getTokenType()+getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        // }

        return config
    }, error => {
        tryHideFullScreenLoading();
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    })

    // respone拦截器
    axios.interceptors.response.use(
        response => {
            tryHideFullScreenLoading();
            /**
             * code为非20000是抛错 可结合自己业务进行修改
             */
            const res = response
            if (!!res.code && res.code !== 200) {
                let errText = res.msg;
                // if (res.code == 401) {
                //   errText = '登录失败，用户名或密码错误';
                // } 
                if (errText.indexOf('登录失败') != -1) {
                    return false;
                }
                Message({
                        message: errText,
                        type: 'error',
                        duration: 5 * 1000
                    })
                    // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
                    // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                    //   MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    //     confirmButtonText: '重新登录',
                    //     cancelButtonText: '取消',
                    //     type: 'warning'
                    //   }).then(() => {
                    //     store.dispatch('FedLogOut').then(() => {
                    //       location.reload()// 为了重新实例化vue-router对象 避免bug
                    //     })
                    //   })
                    // }
                return Promise.reject(errText)
            } else {
                return response
            }
        },
        error => {
            if (error.response) {
                if (error.response.status == '401') {
                    location.reload();
                } else {
                    tryHideFullScreenLoading();
                    console.log('err' + error) // for debug
                    Message({
                        message: error.message,
                        type: 'error',
                        duration: 5 * 1000
                    });

                    return Promise.reject(error.message);
                }
            }

        }
    )

}