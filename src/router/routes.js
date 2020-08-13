import dashboard from "../pages/dashboard.vue";
import NotFoundView from "../components/404.vue";
import menuList from "../pages/sys/menu.vue";
import role from "../pages/sys/role.vue";
import resource from "../pages/sys/resource.vue";
import login from "../pages/login.vue";
import app from "../App.vue";
import sysUser from "../pages/sys/user.vue";
import userAdd from "../pages/sys/userAdd.vue";
import resetPwd from "../pages/resetPwd.vue";

// import jlgx from "../pages/dsjpt/jlgx.vue";
// import ss from "../pages/dsjpt/ss.vue";

import tgl from "../pages/dsjpt/tjs/tgl.vue";
import jlgx from "../pages/dsjpt/tjs/jlgx.vue";
import ss from "../pages/dsjpt/tjs/ss.vue";
import zdlj from "../pages/dsjpt/tjs/zdlj.vue";
import ljfx from "../pages/dsjpt/tjs/ljfx.vue";
import gld from "../pages/dsjpt/tjs/gld.vue";
import gxtp from "../pages/dsjpt/tjs/gxtp.vue";
import ztqj from "../pages/dsjpt/tjs/ztqj.vue";
import twoWayMapping from "@/pages/dsjpt/tjs/twoWayMapping.vue"
import graphEdit from "@/pages/dsjpt/tjs/graphEdit.vue"




import zwfc from "../pages/dsjpt/qwjs/zwfc.vue";
import zdwh from "../pages/dsjpt/qwjs/zdwh.vue";
import zdwhUpdate from "../pages/dsjpt/qwjs/zdwhUpdate.vue";
// import zdwhAdd from "../pages/dsjpt/qwjs/zdwhAdd.vue";
import ssxjxjs from "../pages/dsjpt/qwjs/ssxgxjs.vue";
import hcgl from "../pages/dsjpt/qwjs/hcgl.vue";
import htpc from "../pages/dsjpt/qwjs/htpc.vue";
import htpcbces from "../pages/dsjpt/qwjs/htpcbces.vue";


import sylb from "../pages/dsjpt/qwjs/sylb.vue";

import dpsy from "../pages/dsjpt/qwjs/dpsy.vue";


import ssxxpb from "../pages/dsjpt/qwjs/ssxxpb.vue";
import tdztss from "../pages/dsjpt/qwjs/tdztss.vue";













import hmd from "../pages/sjwhgl/hmd.vue";
import hmdAdd from "../pages/sjwhgl/hmdAdd.vue";
import bmd from "../pages/sjwhgl/bmd.vue";

import sjygl from "../pages/sjwhgl/sjygl.vue";
import sjyglUpdate from "../pages/sjwhgl/sjyglUpdate.vue";
import dsjbz from "../pages/sjwhgl/dsjbz.vue";


//邮件分析相关
import mgcfx from "../pages/ztfx/yjfx/mgcfx.vue";
import xqfx from "../pages/ztfx/yjfx/xqfx.vue";
import fgzsdyjfx from "../pages/ztfx/yjfx/fgzsdyjfx.vue";
import mailExchangeAnalysis from "@/pages/ztfx/yjfx/mailExchangeAnalysis.vue"
import mailObjectAnalysis from "@/pages/ztfx/yjfx/mailObjectAnalysis.vue"

//多维度关系分析

import dwdgxfx from "../pages/ztfx/dwdgxfx.vue";


//算法库
import gzlgl from "../pages/sfk/gzlgl.vue";
import mxsj from "../pages/sfk/mxsj.vue";











// Routes
const routes = [
    { path: '/login', component: login },
    {
        path: '/test',
        component: app,
        children: [
            { path: '*', component: NotFoundView }
        ]
    },
    {
        path: '',
        redirect: '/index',
        component: app,
        children: [
            { path: '/resetPwd', component: resetPwd },
            { path: '/index', component: dashboard },
            { path: '/sys/menuList', component: menuList },
            { path: '/sys/roleList', component: role },
            { path: '/sys/userList', component: sysUser },
            { path: '/sys/userAdd', component: userAdd },
            { path: '/sys/resource', component: resource },

            { path: '/dsjpt', component: ss },
            { path: '/dsjpt/tjs', component: ss },
            { path: '/dsjpt/tjs/tgl', component: tgl },

            { path: '/dsjpt/tjs/jlgx', component: jlgx },
            { path: '/dsjpt/tjs/ss', component: ss },
            { path: '/dsjpt/tjs/ztqj', component: ztqj },


            { path: '/dsjpt/tjs/zdlj', component: zdlj },
            { path: '/dsjpt/tjs/ljfx', component: ljfx },
            { path: '/dsjpt/tjs/gld', component: gld },
            { path: '/dsjpt/tjs/gxtp', component: gxtp },
            { path: '/dsjpt/tjs/twoWayMapping', component: twoWayMapping },
            { path: '/dsjpt/tjs/graphEdit', component: graphEdit },




            { path: '/dsjpt', component: zwfc },
            { path: '/dsjpt/qwjs', component: zwfc },
            { path: '/dsjpt/qwjs/zwfc', component: zwfc },
            { path: '/dsjpt/qwjs/zdwh', component: zdwh },
            { path: '/dsjpt/qwjs/zdwhUpdate', component: zdwhUpdate },
            // { path: '/dsjpt/qwjs/zdwhAdd', component: zdwhUpdate },

            { path: '/dsjpt/qwjs/ssxjxjs', component: ssxjxjs },
            { path: '/dsjpt/qwjs/hcgl', component: hcgl },
            { path: '/dsjpt/qwjs/htpc', component: htpc },
            { path: '/dsjpt/qwjs/htpcbces', component: htpcbces },


            { path: '/dsjpt/qwjs/sylb', component: sylb },
            { path: '/dsjpt/qwjs/dpsy', component: dpsy },



            { path: '/dsjpt/qwjs/ssxxpb', component: ssxxpb },
            { path: '/dsjpt/qwjs/tdztss', component: tdztss },








            { path: '/sjcjgl', component: NotFoundView },

            { path: '/sjwhgl/hmd', component: hmd },
            { path: '/sjwhgl/hmdAdd', component: hmdAdd },
            { path: '/sjwhgl/bmd', component: bmd },
            { path: '/sjwhgl/userAdd', component: userAdd },

            { path: '/sjwhgl/sjygl', component: sjygl },
            { path: '/sjwhgl/sjyglUpdate', component: sjyglUpdate },

            { path: '/sjwhgl/dsjbz', component: dsjbz },



            { path: '/ztfx', component: NotFoundView },
            { path: '/ztfx/yjfx', component: NotFoundView },
            { path: '/ztfx/yjfx/mgcfx', component: mgcfx },
            { path: '/ztfx/yjfx/fgzsdyjfx', component: fgzsdyjfx },
            { path: '/ztfx/yjfx/xqfx', component: xqfx },
            { path: '/ztfx/yjfx/mailExchangeAnalysis', component: mailExchangeAnalysis },
            { path: '/ztfx/yjfx/mailObjectAnalysis', component: mailObjectAnalysis },

            { path: '/ztfx/dwdgxfx', component: dwdgxfx },


            { path: '/sfk', component: NotFoundView },
            { path: '/sfk/gzlgl', component: gzlgl },
            { path: '/sfk/mxsj', component: mxsj },







            { path: '/sjtjfx', component: NotFoundView },
            { path: '/sjtjfx/resource', component: sysUser },


        ]
    },
    { path: '*', component: NotFoundView }
]


export default routes
