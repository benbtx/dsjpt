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
         <el-col :span="10" :offset="0">
          <div class="el-input" style=" float: right;">
             关键字：
            <input type="text" placeholder="关键字：" v-model="searchKey" @keyup.enter="search($event)"
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
        <el-col :span="14">
            <el-button type="primary" icon="plus" @click="search">搜索</el-button>

            <el-button type="primary" icon="plus"  @click="QHC">清缓存</el-button>

            <el-button type="primary" icon="plus"  @click="CZTJ">重置统计</el-button>


            <!-- <router-link :to="{ path: 'zdwhUpdate'}">
              <el-button type="primary" icon="plus">新增</el-button>
            </router-link> -->
          
            <!-- <el-button type="primary" icon="plus">导入</el-button>
            <el-button type="primary" icon="plus">下载模板</el-button> -->
        </el-col>
      </el-row>
    </h3>
    <div slot="body">

          <!-- <el-input ref='ywhtml3'
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 10}"
            placeholder="请输入内容"
            v-model="yw">
          </el-input> -->

          <p class='pyw' v-html="yw"></p>

          
          <!-- <textarea ref='ywhtml' rows="10" cols="20" id="my">
          
          </textarea> -->


          <div style="margin: 40px 0;"></div>
        
          <el-tag>统计信息：</el-tag>
          <div style="margin: 20px 0;"></div>

          <!-- <el-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 10}"
            placeholder="显示结果"
            v-model="jg">
          </el-input> -->
          <p class='pjg' >
            搜索总次数 ：{{totalTimes}}  <br/>  <br/>
            缓存命中数 ：{{hitTimes}}     <br/>   <br/>
            缓存命中率 ：{{hitRate}}     <br/>   <br/>

          </p>


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
        searchKey:'中国共产党',
        // totalTimes: 48,
        // hitTimes: 32,
        // hitRate: "66.67%"
         totalTimes: '',
        hitTimes: '',
        hitRate: ""
      }
    },
    methods: {
    
      search(target){
          var _this=this;
         return http_qwjs
          .getHCGLSS({value:this.searchKey})
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                this.$message(data.data.msg);
                // this.yw=data.data.data._result.rudangshici[0].content
                if(data.data.data._result.length==0){
                   this.yw='';
                   this.$message('未查到相关数据');
                  //  return;
                }else{
                    this.yw=data.data.data._result[0].content
                }
               

                // _this.$refs.ywhtml.innerHTML=data.data.data._result.rudangshici[0].content


                http_qwjs
                  .getMZL({})
                  .then(res => res)
                  .then(data => {
                      if(data.data.code==200)
                      {
                        // this.$message('操作成功');
                        // this.jg=data.data.data._result.rudangshici[0].content     
                           this.totalTimes=data.data.data.totalTimes;
                        this.hitTimes=data.data.data.hitTimes;
                        this.hitRate=data.data.data.hitRate;             
                    
                      }else{
                        this.$message(data.data.msg);
                      }
                }).catch(e => {  this.$message('接口操作失败2');})

            
              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})
      },
      QHC(){
              http_qwjs
                  .getQHC({})
                  .then(res => res)
                  .then(data => {
                      if(data.data.code==200)
                      {
                        this.$message(data.data.msg);
                        // this.jg=data.data.data._result.rudangshici[0].content     
                     
                    
                      }else{
                        this.$message(data.data.msg);
                      }
                }).catch(e => {  this.$message('接口操作失败');})


      },
      CZTJ(){
             http_qwjs
                  .getCZTJ({})
                  .then(res => res)
                  .then(data => {
                      if(data.data.code==200)
                      {
                        //  this.$message('操作成功');
                          this.$message(data.data.msg);
                        // this.jg=data.data.data._result.rudangshici[0].content     
                            this.totalTimes='0';
                        this.hitTimes='0';
                        this.hitRate='0%';    
                      
                    
                      }else{
                        this.$message(data.data.msg);
                      }
                }).catch(e => {  this.$message('接口操作失败');})

      },
      handleSelectionChange(val){

      },
      handleRoleConfig(index, row){
        this.currentRow = row;
        this.dialogVisible = true;
        if (this.roleTree.length <= 0) {
          sysApi.roleList({selectChildren:true})
            .then(res => {
              this.roleTree = res
            })
        }
        this.$http.get(api.SYS_USER_ROLE + "?id=" + row.id)
          .then(res => {
            this.$refs.roleTree.setCheckedKeys(res.data);
          }).catch(err=>{

        })
      },
      configUserRoles(){
        let checkedKeys = this.$refs.roleTree.getCheckedKeys();
          this.$http.get(api.SYS_SET_USER_ROLE + "?userId=" + this.currentRow.id + "&roleIds="+checkedKeys.join(','))
          .then(res => {
              this.$message('修改成功');
              this.dialogVisible = false;
          })
      },
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.loadData();
      },
      handleEdit(index, row){
        // this.$router.push({path: 'userAdd', query: {id: row.id}})
        this.$router.push({path: 'zdwhUpdate', query: {id: row.id}})

      },
      handleDelete(index, row){
        this.$http.get(api.SYS_USER_DELETE , {id:row.id}).then(res => {
          this.loadData();
        });
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
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})

          //getMZL

          
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
  .pyw, .pjg{
    border: solid 1px  #eee;
    padding: 10px;
    min-height:150px ;
    border-radius: 3px;
  }
</style>
