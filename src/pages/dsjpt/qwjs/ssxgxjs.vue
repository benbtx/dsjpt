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
        <el-col :span="10" :offset="0"  :xs="12" :sm="12" :md="10" :lg="10" :xl="10">
          <div class="el-input" style=" float: right;">
             关键字：
            <input type="text" placeholder="关键字：" v-model="searchKey" @keyup.enter="btnGetSS($event)"
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
        <el-col :span="14"  :xs="12" :sm="12" :md="14" :lg="14" :xl="14">
            <el-button type="primary" icon="plus" @click="btnGetSS()">搜索</el-button>

            <!-- <router-link :to="{ path: 'zdwhUpdate'}">
              <el-button type="primary" icon="plus">新增</el-button>
            </router-link> -->
          
            <!-- <el-button type="primary" icon="plus">导入</el-button>
            <el-button type="primary" icon="plus">下载模板</el-button> -->
        </el-col>
      </el-row>
    </h3>
    <div slot="body">
           
      <ul class="p-ls" id="jqlb" v-show="true">
        <li v-for="(item, i) in ssjglist" :key="i" @click="getXq(item.content)" :class="item.id" style="list-style-type:none;">
          
          <div style="background:#eee;border：1px solid #efe;margin-bottom:20px;padding:10px">
               <h4 v-html="item.title"></h4>
               评分： {{item._score}}  
               <!-- <p v-html="item.content.substr(0,200) + '...'"></p> -->
               <!-- <p v-html="item.content.substr(0,item.content.substr(0,200).lastIndexOf('<')) + '...'"></p> -->
                <p v-html="item.content.substr(0,item.content.substr(0,200).lastIndexOf('<')>180?item.content.substr(0,200).lastIndexOf('<'):200) + xjbtn"></p>
              <!-- item.content.substr(0,item.content.substr(0,200).lastIndexOf('<')) -->
             


          </div>
         



        </li>
        <div style="text-align:center;">
            <!-- <a href="#" v-if="policespan.showamore" @click="getmorejq" class="amore">加载更多......</a>
            <span v-else>{{policespan.spancontent}}</span> -->
             <div style="text-align:center;">
                  <a href="#" v-if="this.page<(this.total/this.size)" @click="getmorejq" class="amore">加载更多......</a>
                  <!-- <span v-else>加载完毕</span> -->
              </div>
        </div>
      </ul>

          <el-dialog
            title="详情"
            :visible.sync="dialogVisible"
            width="80%"
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
  import http_qwjs from "../../../common/http_qwjs"
  // import { shipinApi, excontrolApi } from "@/https";
  import panel from "../../../components/panel.vue"
  import * as api from "../../../api"
  import testData from "../../../../static/data/data.json"
  import * as sysApi from '../../../services/sys'

  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        searchKey: '新冠病毒',
        ssjglist:[],
        policespan:{showamore:true},
        // xjbtn:"<span style=' cursor: pointer; @click='open''>...</span>",
        xjbtn:"<span style=' cursor: pointer;'>...</span>",

        // xjbtn:"  <el-popover placement='top-start'  title='' width='200' trigger='hover'   content='这是一段内容,这是一段内容,这是一段内容,这是一段内容。'>  <el-button slot='reference'>...</el-button></el-popover>",
        dialogVisible: false,
        nr:'',
        currentRow: {},
        dialogVisible: false,
        dialogLoading: false,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
        roleTree: [],
        listLoading: false,
        page:1,
        size:10,
        total:0,
        
        // tableData: {
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
      btnGetSS(){
       this.ssjglist=[];
       this.page=1;
       this.total=0;
       this.search();
      },

      search(){
        this.loadData();
      },
      getXq(content){
        this.dialogVisible = true;
        this.nr=content;
          // this.$message('操作成功');
      },
     
    
    
      loadData(){
          
          var _this=this;
          return http_qwjs
          .getSSXGXJS({  value:this.searchKey,highLight:true,page:this.page,size:this.size})
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                // this.$message('操作成功');
                // this.ssjglist=data.data.data._result['sars-cov-2'];
                // this.ssjglist=data.data.data._result;
                if(data.data.data._totalHits==0){
                  _this.$message('未找到相关数据');
                }

                  var c= _this.ssjglist.concat(data.data.data._result);
                _this.ssjglist=c;
                _this.total=data.data.data._totalHits;

                //data.data.data._result['sars-cov-2'][2].content.substr(0,200)
                //data.data.data._result['sars-cov-2'][2].content.substr(0,200).lastIndexOf('<')

               
              }else{
                 this.$message(res.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})

          
      }
    },
    created(){
      this.loadData();
    }
  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
</style>
