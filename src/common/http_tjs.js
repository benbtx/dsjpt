import axios from "axios";
import qs from "qs";
import auth from "./auth";
import { getBaseUrl } from "../common/utils";
import { MessageBox } from "element-ui";


let request = axios.create({ baseURL: 'http://192.168.7.233:8082/' });


// axios 配置
request.defaults.timeout = 50000;
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


let http_tjs;
export default
http_tjs = {





    //获取图信息 根据档案编号查询
    getDACTXX: data => request({
        method: "GET",
        // url: '/person/queryPersonNodeAndEdgeByArchiveNum?archiveNum=' + data.archiveNum,
        url: '/person/queryPersonNodeAndEdgeByArchiveNum',

        params: data,
    }),


    //获取图信息 深度优先
    getSDYX: data => request({
        method: "POST",
        url: '/person/dfsByGraphVo',
        params: { twoWayMappingId: data.twoWayMappingId },
        data: data.graphVo,
        // data: { graphVo: data.graphVo },
        // data
    }),

    //获取图信息 广度优先POST /person/bfsByGraphVo
    getGDYX: data => request({
        method: "POST",
        url: '/person/bfsByGraphVo',
        // params: data,
        params: { twoWayMappingId: data.twoWayMappingId },
        data: data.graphVo,
    }),

    //最短路径分析 
    getZDLJ: data => request({
        method: "GET",
        url: '/person/queryCallAllShortestPathsBetweenNode',
        params: data,
    }),

    //路径分析 
    getLJFX: data => request({
        method: "GET",
        url: '/person/queryCallAllPathsBetweenNode',

        params: data,
    }),

    //子图求解 GET /person/queryPersonNodeAndEdgeByNode
    getZTQJ: data => request({
        method: "GET",
        // url: '/person/queryPersonNodeAndEdgeByArchiveNum?archiveNum=' + data.archiveNum,
        url: '/person/queryPersonNodeAndEdgeByNode',

        params: data,
    }),

    //关联点计算 POST /person/queryArticulationsByGraphVo
    getGLDJS: data => request({
        method: "POST",
        // url: '/person/queryPersonNodeAndEdgeByArchiveNum?archiveNum=' + data.archiveNum,
        url: '/person/queryArticulationsByGraphVo',

        data: data.graphVo,
    }),



    //GET 关系图谱计算 /person/queryPersonNodeAndEdgeByNodeCallValueMoreThanParam根据节点和通话次数param,查询该节点及及联节点通话次数大于param
    getGXTPJS: data => request({
        method: "GET",
        url: '/person/queryPersonNodeAndEdgeByNodeCallValueMoreThanParam',
        params: data,
    }),


    //图转矩阵  POST /person/transformMatrixFromGraphVo  
    getTZJZ: data => request({
        method: "POST",
        url: '/person/transformMatrixFromGraphVo',
        data: data.graphVo,
    }),

    //矩阵压缩  POST /person/getZipMatrixFromGraphVo  
    getJZYS: data => request({
        method: "POST",
        url: '/person/getZipMatrixFromGraphVo',
        data: data.graphVo,
    }),

    //边的类型
    getAllRelationType: data => request({
    method: "POST",
    url: '/relationType/getAllRelationType',
  }),

    //权重最短路径
    getShortPath: data => request({
    method: "POST",
    url: '/person/shortestPathForPath',
    params: {start:data.start,end:data.end,relationType:data.relationType},
    data:data.graphVo
  }),

    //最短路径
    getShortPath1: data => request({
    method: "POST",
    url: '/person/shortestPathForNode',
    params: {start:data.start,end:data.end,relationType:data.relationType},
    data:data.graphVo
  }),
}
