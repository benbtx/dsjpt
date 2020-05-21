<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <!-- <el-col :span="12">
          <router-link :to="{ path: 'hmdAdd'}">
            <el-button type="primary" icon="plus">新增</el-button>
          </router-link>
        </el-col> -->
        <el-col :span="8">
          主题：
            <el-select v-model="zt" placeholder="请选择">
              <el-option
                v-for="item in ztlist"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-col>
         <el-col :span="10" :offset="0">
           
          <div class="el-input" style=" float: right;">
             
            <input type="text" placeholder="搜索内容：" v-model="searchKey" @keyup.enter="search($event)"
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
        <el-col :span="6">
            <el-button type="primary" icon="plus" @click="search">搜索</el-button>

         


        
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

                  </span>
                    

                
                  


                </div>
              



              </li>
              <div style="text-align:center;">
                  <a href="#" v-if="this.page<(this.total/this.size)" @click="getmorejq" class="amore">加载更多......</a>
                  <!-- <span v-else>加载完毕</span> -->
              </div>
          </ul>


           <el-dialog
            title="详情"
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
        ssjglist:[],
        page:1,
        size:10,
        total:0,
        ztlist: [{
          value: '姓名',
          label: '姓名'
        }, {
          value: '手机号码',
          label: '手机号码'
        }, {
          value: '车牌号',
          label: '车牌号'
        }, {
          value: '案件名称',
          label: '案件名称'
        }, {
          value: '身份证',
          label: '身份证'
        }],
        zt: '姓名',
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
    watch: {
      searchKey(val) {
        this.ssjglist=[];
        this.total=0;
      },
      zt(val) {
        this.ssjglist=[];
        this.total=0;

      },
    },

    methods: {
    
      search(){
          var _this=this;
        //  if(this.searchKey==''){ this.$message('请输入搜索内容'); return;}

         return http_qwjs
          .getTDZTSS({topic:this.zt,value:this.searchKey,page:this.page,size:this.size,highLight:true,fuzzySearch:true,redAndWhiteLisFilter:true})
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                this.$message(data.data.msg);
               
                // this.ssjglist=data.data.data._result;
                var c= _this.ssjglist.concat(data.data.data._result);
                _this.ssjglist=c;
                _this.total=data.data.data._totalHits;

             


              
            
              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})
      },

       getmorejq(){
        this.page+=1;
        this.search();

      },
      getXq(item){
        this.dialogVisible=true;
        this.nr='';
        for (const i of Object.keys(item)) {
            this.nr+=i+':'+item[i]+"</br>"
        }
        
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
