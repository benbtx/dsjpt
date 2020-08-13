<template>

  <imp-panel>
     <div v-html="html"></div>
  </imp-panel>

</template>
<script type="text/babel">

  import panel from "../../components/panel.vue"
  import selectTree from "../../components/selectTree.vue"
  import treeter from "../../components/treeter"
  import merge from 'element-ui/src/utils/merge';

  import * as api from "../../api"
  import * as sysApi from '../../services/sys';

  import http_sjygl from "../../common/http_sjygl"

  export default {
    mixins: [ treeter ],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree
    },
    data(){
      return {
        
          url:'../../static/data/dsjbz.html',
          html:'',
      }
    },
    methods: {
     
      // load(){
      //   // sysApi.menuList().then(res => {
      //   //   this.menuTree = res;
      //   // })
      //    return http_sjygl
      //     .getSJYLXTREE({id:0})
      //     .then(res => res)
      //     .then(data => {
      //         if(data.data.code==200)
      //         {
      //             this.menuTree = data.data.data;
            
      //         }else{
      //            this.$message(data.data.msg);
      //         }
      //     }).catch(e => {  this.$message('接口操作失败');})




      // },
       load () {
        if (this.url && this.url.length > 0) {
          // 加载中
        
          let param = {
            accept: 'text/html, text/plain'
          }
          http_sjygl.axios.get(this.url, param).then((response) => {
           
            // 处理HTML显示
            this.html = response.data
          }).catch(() => {
          
            this.html = '加载失败'
          })
        }
      }



      


    },
    created(){
      this.load();
     
    }
  }
</script>

<style scoped>
 


</style>
