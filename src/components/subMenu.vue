<template>
  <el-submenu :index="item.href" v-if="item.children && item.children.length>0" class="el-menu-sub" v-show="item.isShow">
      <template slot="title" ><i :class="item.icon"></i><span>{{item.name}}</span></template>  
      <template v-for="child in item.children" >
        <sub-menu v-if="child.children && child.children.length>0" :param="child" v-show="item.isShow&&child.isShow"></sub-menu>
        <!-- <el-menu-item :index="child.href" v-else>
          <i :class="child.icon"></i><span>{{child.name}}</span>
        </el-menu-item> -->

        <div v-else >
            <el-menu-item :index="child.href" v-if="child.href.indexOf('http')<0" v-show="child.isShow">
              <i :class="child.icon"></i><span>{{child.name}}</span>
            </el-menu-item>
            <!-- :href="child.href"  target="_blank" -->
            <a class='yyxt' v-else   href="javascript:void(0)" @click="js_method(child.href,child.isneedlogin,child.url)" v-show="child.isShow">   <i :class="child.icon" ></i><span>{{child.name}}</span></a>
        </div>

      </template>
  </el-submenu>
  <el-menu-item :index="item.href" v-else class="el-menu-each" v-show="item.isShow"><i :class="item.icon"></i><span>{{item.name}}</span></el-menu-item>
  <!-- <div v-else class="el-menu-each">
     <el-menu-item :index="child.href" v-if="item.href.indexOf('wwww')!=-1">
        <i :class="child.icon"></i><span>{{child.name}}</span>
      </el-menu-item>
      <a v-else href="item.href">   <i :class="item.icon" ></i><span>{{item.name}}</span></a>
 
  </div> -->
  

</template>
<script>
import subMenu from "./subMenu.vue"
import axios from '../common/axios'

  export default {
    name: 'subMenu',
    props: ['param'],
    data: function () {
      return {item: this.param}
    },
    components: {
      subMenu
    },
    methods:{
      //目标地址 是否需要登录  登录接口
      js_method(url,isneedlogin,jkurl){
        if(isneedlogin){
                //元数据
                // axios.defaults.baseURL = 'http://192.168.7.236:21000';
                // axios.post(jkurl , { j_username:'admin',j_password:'admin' })
                //   .then(res => {
                    
                //         window.open(url)
                  
                //   }).catch(e => {
                //   this.$message('登录失败');
              
                // })
       
      
        }else{
          //元数据 数据质量管理等不需要验证的3方平台
          window.open(url)
        }

        
      },
    }
  }
</script>
<style>
  .el-menu .fa {
    margin-right: 10px;
  }
  .yyxt{
    padding-left: 40px;
    text-decoration: none;
        height: 45px;
    line-height: 45px;
  }
</style>
