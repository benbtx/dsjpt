import axios from "axios";
import qs from "qs";
import auth from "./auth";
import { getBaseUrl } from "../common/utils";
import { MessageBox } from "element-ui";
import interceptor from './interceptor'

// // axios 配置
// axios.defaults.timeout = 5000;
// // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// //axios.defaults.baseURL = 'http://localhost:8008';
// axios.defaults.baseURL = 'http://192.168.7.182:8089/';

// // axios.defaults.baseURL = getBaseUrl(window.location.href);
// axios.defaults.headers.common['authUid'] = auth.getUid();
// axios.defaults.headers.common['authSid'] = auth.getSid();

// let request = axios.create({ baseURL: 'http://192.168.7.182:8089/' });
let request = axios.create({ baseURL: 'http://192.168.7.239:8089/' });

let request_data = axios.create({ baseURL: 'http://192.168.7.239:8089/' });



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




//POST传参序列化
request.interceptors.request.use((config) => {
    if (config.method === 'post') {
        // config.data = qs.stringify(config.data);
    }
    // if(config.showload)  设置全局加载 loading 
    //   {
    //     showFullScreenLoading();
    //   }
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



let http_qwjs;

// export default http_qwjs


export default
http_qwjs = {

    axios: axios,
    request_data: request_data,

    //分词计算
    getFCJS: data => request({
        method: "GET",
        // url: '/elasticSearch/getIkWords?data=' + data.data + '&type=' + data.type,//法1
        url: '/elasticSearch/getIkWords', //法2
        params: data,
    }),
    //分词字典维护相关  查询
    getFCCX: data => request({
        method: "GET",
        // url: '/elasticSearch/selectIkWords?value=' + data.value + '&id=' + data.id,
        url: '/elasticSearch/selectIkWords',
        params: data,
    }),
    //分词字典维护相关 新增
    getFCXZ: data => request({
        method: "POST",
        url: '/elasticSearch/addIkWord?_method=POST',
        params: data,
    }),
    //分词字典维护相关 修改
    getFCXG: data => request({
        method: "PUT",
        url: '/elasticSearch/updateIkWordStatus?method=POST',
        params: data,
    }),

    //分词字典维护相关 删除
    getFCSC: data => request({
        method: "DELETE",
        url: '/elasticSearch/deleteIkWord?id=' + data.id,
        params: data,
    }),



    // 获取可以选择的词性列表 GET /elasticSearch/selectWordTypes  获取可以选择的词性列表==>中文分词
    getCXLB: data => request({
        method: "GET",
        // url: '/elasticSearch/selectIkWords?value=' + data.value + '&id=' + data.id,
        url: '/elasticSearch/selectWordTypes',
        params: data,
    }),







    //     export const QWJS_ZWFC_FC = '/elasticSearch/getIkWords';
    // export const QWJS_ZWFC_GET = '/elasticSearch/selectIkWords';
    // export const QWJS_ZWFC_ADD = '/elasticSearch/addIkWord';
    // export const QWJS_ZWFC_UPDATE = '/elasticSearch/updateIkWordStatus';
    // export const QWJS_ZWFC_DELETE = '/elasticSearch/deleteIkWord';


    // export const QWJS_XGXJS_GET = '/elasticSearch/queryCorrelationData';


    //相关性搜索 查询
    getSSXGXJS: data => request({
        method: "GET",
        url: '/elasticSearch/queryCorrelationData',
        params: data,
        showload: true
    }),

    getHCGL: data => request({
        method: "GET",
        url: '/elasticSearch/queryData4CacheManagement',
        params: data,
        showload: true
    }),
    //获取缓存管理词条信息
    getHCGLSS: data => request({
        method: "GET",
        url: '/elasticSearch/queryDataByCache4CacheManagement',
        params: data,
        showload: true
    }),
    //获取命中率
    getMZL: data => request({
        method: "GET",
        url: '/elasticSearch/queryCacheHitRate',
        params: data,
        showload: true
    }),

    //DELETE /elasticSearch/deleteEsDataCacheFromRedis
    //清缓存
    getQHC: data => request({
        method: "DELETE",
        url: '/elasticSearch/deleteEsDataCacheFromRedis',
        params: data,
        showload: true
    }),


    //重置统计DELETE /elasticSearch/resetQueryEsDataNumFromRedis
    getCZTJ: data => request({
        method: "DELETE",
        url: '/elasticSearch/resetQueryEsDataNumFromRedis',
        params: data,
        showload: true
    }),



    //爬虫
    //读取word GET /spider/queryWord
    getWord: data => request({
        method: "GET",
        url: '/spider/queryWord',
        params: data,
    }),
    //读取excel GET /spider/queryExcel
    getExcel: data => request({
        method: "GET",
        url: '/spider/queryExcel',
        params: data,
    }),

    //读取html  GET /spider/queryHtml
    getHtml: data => request({
        method: "GET",
        url: '/spider/queryHtml',
        params: data,
    }),


    //爬取word  /GET /spider/spiderWord
    getSpiderWord: data => request({
        method: "GET",
        url: '/spider/spiderWord',
        params: data,
    }),
    //爬取excel GET /spider/spiderExcel
    getSpiderExcel: data => request({
        method: "GET",
        url: '/spider/spiderExcel',
        params: data,
    }),

    //爬取html GET /spider/spiderHtml
    getSpiderHtml: data => request({
        method: "GET",
        url: '/spider/spiderHtml',
        params: data,
    }),
    // //下载word  GET /spider/downloadWord
    // getDownLoadWord: data => request({
    //     method: "GET",
    //     url: '/spider/downloadWord',
    //     params: data,
    // }),
    // //下载 excel GET /spider/downloadExcel
    // getDownLoadExcel: data => request({
    //     method: "GET",
    //     url: '/spider/downloadExcel',
    //     params: data,
    // }),

    //下载word  GET /spider/downloadWord
    getDownLoadWord: () => request.defaults.baseURL + 'spider/downloadWord',
    //下载 excel GET /spider/downloadExcel
    getDownLoadExcel: () => request.defaults.baseURL + 'spider/downloadExcel',

    getDownLoadHtml: () => request.defaults.baseURL + 'spider/queryHtml',



    //GET /elasticSearch/queryDataWithRedAndWhiteList 使用红白名单查询涉案信息表，结果屏蔽掉红白名单数据=>搜索信息屏蔽
    //搜索信息屏蔽
    getSSXXPB: data => request({
        method: "GET",
        url: '/elasticSearch/queryDataWithRedAndWhiteList',
        params: data,
    }),

    //elasticSearch/queryDataWithSpecificTopic 输入特定主题后按此进行搜索并呈现相关结果=>特定主题搜索
    //特定主題搜索 姓名，手机号码，车牌号，案件名称，身份证 
    getTDZTSS: data => request({
        method: "GET",
        url: '/elasticSearch/queryDataWithSpecificTopic',
        params: data,
    }),



    //GET /elasticSearch/queryIndices 获取ES中所有索引的详细信息==>数据索引
    getSJSY: data => request({
        method: "GET",
        url: '/elasticSearch/queryIndices',
        params: data,
    }),

    //GET /elasticSearch/queryPostingList  获取分词的倒排列表
    getDPSY: data => request({
        method: "GET",
        url: '/elasticSearch/queryPostingList',
        params: data,
        showload: true

    }),

    //GET /elasticSearch/getAnalyzerTypes 获取分词器分词类型列表==>中文分词

    getFCLX: data => request({
        method: "GET",
        url: '/elasticSearch/getAnalyzerTypes',
        params: data,
    }),

    //上传文件
    uploadFiles: data => request_data({
        url: '/file/upload',
        method: 'post',
        data
    }),

    //获取上传文件 GET /file/getFileList 读取文件列表，
    getSCWJ: data => request({
        method: "GET",
        url: '/file/getFileList',
        params: data,
    }),

    //GET /spider/spiderWithoutFormat 文件爬取-爬取上传了的文件（word excel html）或者爬取网址，返回爬取日志[不进行格式化]==>后台爬虫
    getWJPQ: data => request({
        method: "GET",
        url: '/spider/spiderWithoutFormat',
        params: data,
    }),
    ///file/download 下载文件doc/docx/xls/xlsx/html==>文件上传下载
    // getXZWJ: data => request({
    //     method: "GET",
    //     url: '/file/download',
    //     params: data,
    // }),

    getXZWJ: (data) => request.defaults.baseURL + 'file/download?fileName=' + data,

    //DELETE /file/delete 删除文件==>文件上传下载

    setSCWJ: data => request({
        method: "DELETE",
        url: '/file/delete',
        params: data,
        // showload: true
    }),


    //POST /spider/insertSpiderData  保存爬虫结果到es的sars-cov-2索引中==>后台爬虫
    setPCJG: data => request_data({
        url: '/spider/insertSpiderData',
        method: 'post',
        data,
    }),


    // 查询 GET /spider/querySpiderData 分页获取ES中的爬虫结果 ==>后台爬虫
    getESPCJG: data => request({
        method: "GET",
        url: '/spider/querySpiderData',
        params: data,
        // showload: true
    }),


    //spider/deleteSpiderData 根据ID删除es中的spider索引下的文档（删除ES中的爬虫数据）==>后台爬虫
    setSCESPCJG: data => request({
        method: "DELETE",
        url: '/spider/deleteSpiderData',
        params: data,
        // showload: true
    }),






}