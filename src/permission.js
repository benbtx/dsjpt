import router from './router'
import store from './store'
import { Message } from 'element-ui'
// import { Progress } from 'element-ui'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken, removeToken } from '@/utils/auth' // getToken from cookie
// import { getToken, setToken, removeToken, getTokenType, setTokenType, SET_ROLES } from '@/utils/auth'
import { debug } from 'util';

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach((to, from, next) => {
    console.log('store.state:')
    console.log(store.state);
    console.log('结束');

    // NProgress.start(); // start progress bar






    if (true) { // determine if there has token  getToken()

        if (store.getters.currentMenus.length === 0) { // 判断当前用户是否已拉取完user_info信息
            // if (getToken() == '123') { // 判断当前用户是否已拉取完user_info信息

            // store.commit('SET_NAME', 'sl')
            // store.commit('SET_ID', '123456789')
            //     // let headUrl =  data.headImgUrl || '/static/image/user.png';
            //     // store.commit('SET_ACOUNT', headUrl)  ;
            // store.commit('SET_ROLES', ['admin']);

            // // let rolearr = ["whome",'admin'];
            // // let rolearr = ["whome","police"];
            // let rolearr = ["whome", "admin", "wuyeguanli", "ziyuancaozuo", "shikongfenxiguanli"];
            // const roles = rolearr;
            // // note: roles must be a array! such as: ['editor','develop']

            // store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            //     router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            //     let topath = '/dashboard/home';
            //     if (to.path == '/dashboard' || to.path == '/login' || to.path == '/') {
            //         if (rolearr.indexOf("shome") != -1) {
            //             topath = '/dashboard/shome';
            //         } else if (rolearr.indexOf("whome") != -1) {
            //             topath = '/dashboard/whome';
            //         } else if (rolearr.indexOf("home") != -1) {
            //             topath = '/dashboard/home';
            //         }
            //         next({ path: topath, replace: true });
            //     } else {
            //         next({...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            //     }
            // }).catch((err) => {
            //     store.dispatch('FedLogOut').then(() => {
            //         Message.error(err || '权限失效, 请重新登录')
            //         next({ path: '/' })
            //     })
            // })

            // SET_ROLES( ['police']);
            // store.getters.roles=['police'];

            // setToken('234');

            // store.dispatch('GetInfo').then(res => { // 拉取user_info,获取菜单列表


            // }).catch((err) => {
            //   store.dispatch('FedLogOut').then(() => {
            //     Message.error(err || '权限失效, 请重新登录')
            //     next({ path: '/' })
            //   })
            // })
            next()


        } else {
            this.$store.dispatch('changeCurrentMenu', to);
            next()
        }












        // }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
        } else {
            next()
                // next('/login') // 否则全部重定向到登录页
                // NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
        }
    }











})

router.afterEach(() => {
    // NProgress.done() // finish progress bar

})