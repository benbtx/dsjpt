<template>

  <imp-panel>
     
      <h3 class="box-title" slot="header" style="width: 100%;">
        <!-- <el-row style="width: 100%;">
          <el-col :span="17" :offset="1">
           
            <div class="el-input" style=" float: right;">
              原文 ：
                

            </div>
            
          </el-col>
          
          <el-col :span="6">
              <el-button type="primary" icon="plus" class='btnFC'>分词</el-button>

             
          </el-col>
        </el-row> -->
      </h3>
     
    <div slot="body">

        <el-tag>原文：</el-tag> 

        
        <el-button type="primary" style=" float: right;margin-right:50px;" icon="plus" class='btnFC' @click="ZWFC">分词</el-button>

        <el-select style='margin-right:20px; float: right;' v-model="type" placeholder="请选择">
          <el-option
            v-for="item in fccxoptions"
            :key="item.analyzer"
            :label="item.descripe"
            :value="item.analyzer">
          </el-option>
        </el-select>



        <div style="margin: 20px 0;"></div>

        <el-input 
          type="textarea"
          :autosize="{ minRows:4, maxRows: 6}"
          placeholder="请输入内容"
          v-model="fcyw">
        </el-input>

        <div style="margin: 40px 0;"></div>
       
        <el-tag>分词结果：</el-tag>
        <div style="margin: 20px 0;"></div>

        <el-input class="jg"
          type="textarea"
          :autosize="{ minRows: 8, maxRows: 10}"
          placeholder="显示结果"
          v-html="fcjg">
        </el-input>

         <!-- <pre class='pjg' v-html="fcjg"></pre> -->

       
    </div>


  </imp-panel>
</template>

<script>
  import panel from "../../../components/panel.vue";
  import * as api from "../../../api";
  import testData from "../../../../static/data/data.json";
  import * as sysApi from '../../../services/sys';
  import echarts from 'echarts';
  import macarons from 'echarts/theme/dark';
  import http_qwjs from "../../../common/http_qwjs"
  import auth from "../../../common/auth";

  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
       
        fcyw: 'Microsoft Visio 2013可以帮助你以更直观的方式创建图表的新功能。Microsoft Visio 2013提供共同编写功能，可使团队协作变得更加容易。你也可以通过Microsoft Visio 2013软件增强图表的动态性，方法是将形状链接到实时数据，然后使用 SharePoint 中的 Visio Services 通过浏览器与其他人共享形状，即使对方没有安装Microsoft Visio 2013也可进行共享。',
        fcjg: '',
        type:'',
        fccxoptions:[],
     
        
      }
    },
    methods: {


      ZWFC() {
        // let params={
        //   data:this.fcyw,
        //   type:'ik_smart',//'ik_smart/ik_max_word'
        // };
        let param = {};
        param.data = this.fcyw;
        // param.type = 'ik_smart',//'ik_smart/ik_max_word';
        param.type =this.type;


        this.FCJS(param); 
      },


      FCJS(param) {
        var _this=this;
        // this.$http.get(api.QWJS_ZWFC_FC , { param })
        //   .then(res => {
        //     res.data.data
        //     this.fcjg=res.data.data.join('/')
        //     this.$message('操作成功');
          
        //   }).catch(e => {
        //   this.$message('操作失败');
       
        // })
         return http_qwjs
          .getFCJS(param)
          .then(res => res)
          .then(data => {
              if(data.data.code==200){
                      //     res.data.data
                let dts=data.data.data;
                // _this.fcjg=data.data.data.join('/')
                let qwjg='';
                let qwlb='';
                for (let i = 0; i <dts.length; i++) {
                   if(i==dts.length-1){
                      qwjg+=dts[i]['分词'];
                   }else{
                      qwjg+=dts[i]['分词']+'/';
                   }

                  //  qwlb+="<span style='display:inline-block;width:150px;font-weight: 600;'>"+dts[i]['分词']+"</span> ( "  +'词性(英文):'+dts[i]['词性(英文)']+'词性描述(中文):'+dts[i]['词性描述(中文)']+'词频:'+dts[i]['词频']+')</br>';
                  
                   qwlb+="<span style='display:inline-block;width:150px;font-weight: 600;'>"+dts[i]['分词']+"</span> 词性(英文): <span style='display:inline-block;width:150px;'>"+dts[i]['词性(英文)']+"</span>词性描述(中文): <span style='display:inline-block;width:150px;'>"+dts[i]['词性描述(中文)']+'</span>词频:'+dts[i]['词频']+'</br>';
                     
                    // <span style='display:inline-block;width:150px;font-weight: 600;'></span>

                      // _this.pqjg=auth.myReplace( _this.pqjg,'↵','</br>');


                } 

                _this.fcjg=qwjg+'</br></br>'+qwlb;

                // this.$message('操作成功'); 
              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})


      },

      FCLX() {
        var _this=this;
       
         return http_qwjs
          .getFCLX()
          .then(res => res)
          .then(data => {
              if(data.data.code==200){
                      //     res.data.data
              _this.fccxoptions=data.data.data;
              _this.type='ik_smart';
              
               

                // this.$message('操作成功'); 
              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})


      },

     
    },
    created(){
      this.FCLX();
    },
    mounted() {
      
    },
    destroyed() {
        window.onresize=null;
      // document.removeEventListener('click', this.autoHide, false)
    }
  }

</script>
<style scoped>
  #chart {
    width: 100%;
    min-height: 400px;
    height: 500px;
    margin-right: 15px;
  }
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
  .jg{
    height: 200px;
    overflow: scroll;
  }
  .pjg{
    border: solid 1px  #eee;
    padding: 10px;
    min-height:280px ;

    max-height:320px ;
    overflow-y: scroll;
    border-radius: 3px;
  }
  
</style>
