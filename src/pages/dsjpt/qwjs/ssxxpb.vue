<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <!-- <el-col :span="12">
          <router-link :to="{ path: 'hmdAdd'}">
            <el-button type="primary" icon="plus">新增</el-button>
          </router-link>
        </el-col>
        <el-col :span="12">
          <div class="el-input" style="width: 200px; float: right;">
            <i class="el-input__icon el-icon-search"></i>
            <input type="text" placeholder="输入用户名称" v-model="searchKey" @keyup.enter="search($event)"
                   class="el-input__inner">
          </div>
        </el-col> -->
         <el-col :span="5" :offset="0">
          <div class="el-input" style=" float: right;">
             
            <input type="text" placeholder="关键字：" v-model="searchKey" @keyup.enter="btnGetSS()"
                   class="el-input__inner" style="width:180px">
          </div>
        </el-col>
         <!-- <el-col :span="5">
          <div class="el-input" style=" float: right;">
            身份证：
            <input type="text" placeholder="输入用户名称" v-model="searchKey" @keyup.enter="search($event)"
                   class="el-input__inner" style="width:180px">
          </div>
        </el-col>
         <el-col :span="5">
          <div class="el-input" style="  float: right;">
            电话：
            <input type="text" placeholder="输入用户名称" v-model="searchKey" @keyup.enter="search($event)"
                   class="el-input__inner" style="width:180px">
          </div>
        </el-col> -->
        <el-col :span="5">
            <el-button type="primary" icon="plus" @click="btnGetSS(true)">搜索(屏蔽)</el-button>

        </el-col>

        <el-col :span="5">
            <el-button type="primary" icon="plus" @click="btnGetSS(false)">搜索(未屏蔽)</el-button>

        </el-col>
      </el-row>
    </h3>
    <div slot="body">


        
          <el-tag>搜索结果：{{this.total}} 条</el-tag>
          <div style="margin: 20px 0;"></div>

          <ul class="p-ls" id="jqlb" v-show="true">
              <li v-for="(item, i) in ssjglist" :key="i" @click="getXq(item)" :class="item.id" style="list-style-type:none;">
               
                <div style="background:#eee;border：1px solid #efe;margin-bottom:20px;padding:10px">
                    <!-- <h4 v-html="item.title"></h4> -->
                    <!-- 涉案编号：{{item.sabh}}  名称：<span v-html="item.mc"></span>  基础标签：{{item.base_tag}}  电话号码：{{item.dhhm}}  性别：{{item.xb}}  评分： {{item._score}}   -->
                    
                  <span v-for="(it, j) in  Object.keys(item)" :key="j" >
                         <!-- //it == _index 属性名  -->
                        <!-- if(it.indexOf('_')>-1){} -->
                        <!-- if(it.indexOf('_')>-1){
                          if(it=="_indexCN"){}
                        }else{

                        } -->

                        <!-- {{it}} {{j}}  :{{item[it]}} --> 
                           {{it}}  :<span v-html="item[it]"></span>
                        <!-- <span v-if="it.indexOf('_index')||it.indexOf('_score')||it.indexOf('_id')"> </span>
                        <span v-else> {{it}}  :<span v-html="item[it]"></span></span> -->
                       

                        <!-- _index  _score  _id -->

                  </span>
                    

                
                  


                </div>
              



              </li>
              <div style="text-align:center;">
                  <a href="#" v-if="this.page<(this.total/this.size)" @click="getmorejq" class="amore">加载更多......</a>
                  <!-- <span v-else>加载完毕</span> -->
              </div>
          </ul>


          <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
             <p v-html="nr"></p>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>





         
          


    </div>


  </imp-panel>
</template>

<script>
  import panel from "../../../components/panel.vue"
  import * as api from "../../../api"
  import testData from "../../../../static/data/data.json"
  import * as sysApi from '../../../services/sys'

  import http_qwjs from "../../../common/http_qwjs"


  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        yw:'',
        jg:'',
        searchKey:'测试',
        ispb:true,
        ssjglist:[],
        page:1,
        size:10,
        total:0,
        dialogVisible: false,
        nr:'',
        
        //  tableData: {
        //   pagination: {
        //     total: 0,
        //     pageNo: 1,
        //     pageSize: 10,
        //     parentId: 0
        //   },
        //   rows: []
        // }
      
        
      }
    },
    methods: {
    
      btnGetSS(target){
        if(target==undefined){
       
        }else{
          this.ispb=target;

        }
      //  this.ispb=target;
       this.ssjglist=[];
       this.page=1;
       this.total=0;

       this.search();
      },
      search(){
         var _this=this;
         return http_qwjs
          .getSSXXPB({value:this.searchKey,page:this.page,size:this.size,highLight:true,redandwhiteListFilter:this.ispb})
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                this.$message(data.data.msg);
               
                // this.ssjglist=data.data.data._result;
                // _this.ssjglist=Object.assign(_this.ssjglist, data.data.data._result);
                var c= _this.ssjglist.concat(data.data.data._result);
                _this.ssjglist=c;
                _this.total=data.data.data._totalHits;

                // console.log(Object.getOwnPropertyNames(data.data.data._result[0]))
                // Object.keys(data.data.data._result[0])


              
            
              }else{
                 this.$message(data.data.msg);
              }
          })
          .catch(e => {  this.$message('接口操作失败');})
      },
      getXq(item){
        this.dialogVisible=true;
        this.nr='';

        for (const i of Object.keys(item)) {
          if(i.indexOf('_index')>=0||i.indexOf('_score')>=0||i.indexOf('_id')>=0){ continue}
            this.nr+=i+':'+item[i]+"</br>"
        }
        
      },

      getmorejq(){
        this.page+=1;
        this.search();

      },
       handleClose(done) {
        this.dialogVisible=false;
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      },


      


      loadData(){
         
          return http_qwjs
          .getHCGL({})
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                // this.$message('操作成功');
                // this.yw=data.data.data._result.rudangshici[0].content
                this.yw=data.data.data._result[0].content


                
            
              }else{
                 this.$message(res.data.msg);
              }
          })

          //getMZL

          
      }
    },
    created(){
      // this.loadData();
    }
  }
</script>
<style scoped>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
  .pyw, .pjg{
    border: solid 1px  #eee;
    padding: 10px;
    min-height:150px ;
    border-radius: 3px;
  }
  #jqlb{
   max-height: 350px;
   min-height: 200px;
   overflow-y: scroll;
  }
</style>
