<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <!-- <el-button type="primary" icon="plus" @click="newAdd">新增</el-button>
      <el-button type="danger" icon="delete" @click="batchDelete">删除</el-button> -->
      <el-row style="width: 100%;">

           <el-col :span="6" :offset="0" :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <!-- <div class="el-input" style=" float: right;">
            姓名：
            <input type="text" placeholder="输入用户名称" v-model="searchKey" @keyup.enter="search($event)"
                  class="el-input__inner" style="width:150px">
          </div> -->
          <div class="el-input" style=" float: left;">
            案件：

            <el-select
              size='340'
              v-model="archiveNum"
              @change='getSAR'
              filterable
              clearable 
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

          </div>



        </el-col>

        <el-col :span="10" :offset="0" :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <div class="el-input" style=" float: right;">
            来往邮件次数：
            <el-input-number v-model="minnum" controls-position="right" @change="handleChange" :min="1" :max="10000000"></el-input-number>-
            <el-input-number v-model="maxnum" controls-position="right" @change="handleChange" :min="1" :max="10000000"></el-input-number>
           
          </div>
        </el-col>



      


        <el-col :span="4" :offset="0" :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
            <el-button type="primary" icon="plus" @click="search">筛选</el-button>

            <el-button type="primary" icon="plus" @click="btnReset">重置</el-button>

          
          
           
        </el-col>
      </el-row>
      




    </h3>
    <el-row slot="body" :gutter="24" style="margin-bottom: 20px;">

       <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
        <el-card class="box-card ">
           <div class="txx">
              <kr-graph
                ref="graph"
                :graphData="graphData"
                   @lineClick="lineClick"
             
                v-loading="graphLoading"
              ></kr-graph>
          </div>
            
        </el-card> 

        <el-card class="box-card ">

         
           
            <el-table class='xqfxlb'
              :data="tableData.rows"
              border
              style="width: 100%"
              v-loading="listLoading"
              
              @selection-change="handleSelectionChange">
              <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
              <!-- <el-table-column
                prop="id"
                type="selection"
                width="50">
              </el-table-column> -->
              <!-- <el-table-column
                label="照片" width="76">
                <template slot-scope="scope">
                  <img :src='scope.row.avatar' style="height: 35px;vertical-align: middle;" alt="">
                </template>
              </el-table-column> -->

                <el-table-column
                prop="mc"
                label="涉案人"  min-width="80" >
              </el-table-column>

               <!-- <el-table-column
                prop="saryx"
                label="涉案人邮箱"  min-width="120">
              </el-table-column> -->
            
              <!-- <el-table-column
                prop="lxryx"
                label="联系人"  min-width="120">
              </el-table-column> -->
              
               <!-- <el-table-column
                prop="title"
                label="邮件主题">
              </el-table-column> -->

               <el-table-column
                prop="lxryx"
                label="联系人"  min-width="120">
                <template slot-scope="scope">
                  {{scope.row.lxr?scope.row.lxr:scope.row.lxryx?scope.row.lxryx:scope.row.lxrzjhm}}
                </template>
              </el-table-column>
              
               <el-table-column
                prop="yjlx"
                label="邮件类型"  max-width="60">
                 <template slot-scope="scope">
                  {{scope.row.yjlx=='1'?'发送':scope.row.yjlx=='2'?'接收':'未知'}}
                </template>
              </el-table-column>




              <el-table-column
                prop="fssj"
                label="发送时间" >
              </el-table-column>

              <!-- <el-table-column
                prop="createTime"
                label="创建时间">
              </el-table-column> -->

              

          
             
             
           
             
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="default"
                    icon="edit"
                    @click="handleDetail(scope.$index, scope.row)">详情
                  </el-button>
                  <!-- <el-button
                    size="small"
                    type="info"
                    icon="setting"
                    @click="handleRoleConfig(scope.$index, scope.row)">测试
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除
                  </el-button> -->
                </template>
              </el-table-column>
            </el-table>



            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="tableData.pagination.pageNo"
              :page-sizes="[5, 10, 20]"
              :page-size="tableData.pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.pagination.total">
            </el-pagination>


              <el-dialog
                title="详情"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
                 <p>
                    涉案编号 : {{nr.sabh}}</br>
                    涉案人邮箱 : {{nr.saryx}} </br>
                    档案编号 : {{nr.dabh}}  </br> 
                    <!-- 1是发送 2接收 null 未知  -->
                    邮件类型 : {{nr.yjlx=='1'?'发送':'接收'}}   </br>
                    证件号码 : {{nr.zjhm}}   </br>
                    发送时间 : {{nr.fssj}}  </br>
                    创建时间 : {{nr.cjsj}}  </br>   
                    涉案人姓名 : {{nr.mc}}  </br>

                    
                    联系人邮箱 : {{nr.lxryx}}  </br>   
                    邮件主题 : <p v-html='nr.yjzt'> </p>   
                    邮件内容:<p v-html='nr.yjnr'> </p> 

                  

                    是否工作时段 : {{nr.isworktime==1?'是':'否'}}  </br>   
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
              </el-dialog>



           

        
        </el-card>
      </el-col>
      
      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
        <el-card   class="box-card fgzsdyjfxleft">
         

              <div>
                     <span style="text-align:center">选择案件涉案人</span> 
                     <div class='sar'>
                           <div v-if='sars.length==0' style="text-align:center">暂无数据</div> 
                           <div v-else>
                                <el-checkbox-group 
                                  v-model="checkedsars">
                                  <div  class='lb' v-for="item in sars" :key="item.id">
                                      <el-checkbox :label="item.idCard" :key="item.id">{{item.name}}</el-checkbox>
                                      
                                  </div>
                                </el-checkbox-group>
                             </div> 
                     </div>
                     
              </div>

        </el-card>
      </el-col>
     
    </el-row>
  </imp-panel>

</template>
<script type="text/babel">
import eventBus from "../../../event";
import { eventCollection } from "../../../event/resources";


  import panel from "../../../components/panel.vue"
  import selectTree from "../../../components/selectTree.vue"
  import treeter from "../../../components/treeter"
  import merge from 'element-ui/src/utils/merge';

  import * as api from "../../../api"
  import * as sysApi from '../../../services/sys';

  import http_sjygl from "../../../common/http_sjygl"
    import http_yjfx from "../../../common/http_yjfx"

  import http_da from "../../../common/http_da";
  import auth from "../../../common/auth";
  import {cloneDeep} from "lodash"



  export default {
    mixins: [ treeter ],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree
    },
    data(){
      return {
        gxtData:{
          "persons": [
            {
              "id": 15,
              "name": "李四",
              "archiveNum": "archiveNum2",
              "twoWayMappingId": 113
            },
            {
              "id": 16,
              "name": "李五的儿子",
              "archiveNum": "archiveNum2",
              "twoWayMappingId": 1166
            },
            {
              "id": 13,
              "name": "张三",
              "archiveNum": "archiveNum2",
              "twoWayMappingId": 112
            },
            {
              "id": 14,
              "name": "李五",
              "archiveNum": "archiveNum2",
              "twoWayMappingId": 114
            }
          ],
          "lists": [
            {
              "id": 9,
              "startPerson": {
                "id": 13,
                "name": "张三",
                "archiveNum": "archiveNum2",
                "twoWayMappingId": 112
              },
              "value": '朋友',
              "endPerson": {
                "id": 14,
                "name": "李五",
                "archiveNum": "archiveNum2",
                "twoWayMappingId": 114
              },
              "archiveNum": "archiveNum2"
            },
            {
              "id": 10,
              "startPerson": {
                "id": 13,
                "name": "张三",
                "archiveNum": "archiveNum2",
                "twoWayMappingId": 112
              },
              "value": '朋友',
              "endPerson": {
                "id": 15,
                "name": "李四",
                "archiveNum": "archiveNum2",
                "twoWayMappingId": 113
              },
              "archiveNum": "archiveNum2"
            },
            {
              "id": 11,
              "startPerson": {
                "id": 14,
                "name": "李五",
                "archiveNum": "archiveNum2",
                "twoWayMappingId": 114
              },
              "value": '父子',
              "endPerson": {
                "id": 16,
                "name": "李五的儿子",
                "archiveNum": "archiveNum2",
                "twoWayMappingId": 1166
              },
              "archiveNum": "archiveNum2"
            }
          ]
        },

        graphVo:null,

        tipNodeLine:{
          accountList: [],
          relateList: []
        },

        graphLoading: false,
        saryx:'',
        lxr:'',


        maxnum:10000,
        minnum:1,
        sjdvalue:'',
         nr:'',
        yxh:'',
        startvalue:'',
        endvalue:'',

        loading: false,
        archiveNum: '',
        options: [],
        list: [],
         checkedsars: [],
        sars:[],
        // ids:[],
        // sars:[
        // {id:1,label:"张三"},
        // {id:2,label:"李四"},
        // {id:3,label:"王五"},],
        selectIconDialog: false,
        formLabelWidth: '100px',
        defaultProps: {
          children: 'children',
          label: 'value',
          id: "id",
        },
        maxId: 7000000,
        menuTree: [],
        form: {
          id: null,
          name: '',
          sort: 0,
          icon: '',
          href: '',
          isShow: '',
          delivery: false,
          parentId: null,
          desc: ''
        },

        currentRow: {},
        dialogVisible: false,
        dialogLoading: false,
       
        roleTree: [],
        listLoading: false,
        searchKey: '',
        typeId:'',
        tableData: {
          pagination: {
            total: 0,
            pageNo: 0,
            pageSize: 10,
            parentId: 0
          },
          rows: []
        },
        jdform:{
          code: null,
          description: "",
          parent: -1,
          id:-1,
        },

      }
    },
    computed: {
      graphData() {
        // var accountList=this.gxtData.persons,relateList=[]
        var accountList=[],relateList=[]
        // this.gxtData.lists.map(value=>{
        //   relateList.push({
        //     source:value.startPerson.key,
        //     target:value.endPerson.key,
        //     label:value.count
        //   })
        // })
        this.gxtData.lists.map(value=>{
          let isHave=false
          relateList.map(item=>{
            if(item.target==value.startPerson.key&&item.source==value.endPerson.key){
              isHave=true
              item.label=item.label+value.count
            }
          })
          if(!isHave){
            relateList.push({
               source:value.startPerson.key,
               target:value.endPerson.key,
               label:value.count
            })
          }
        })



         this.gxtData.persons.map(value=>{
          accountList.push({
            id:value.key,
            zjhm:value.key,
            yx:value.yx,
            name:value.mc||value.zjhm||value.yx

          })
        })

        return {
          accountList,
          relateList
        }
      },

      // graphData() {
      //   var accountList=[],relateList=[]
      //   this.gxtData.persons.map(value=>{
      //     if(value.name=="null"){
      //       value.name=value.email
      //     }
      //     accountList.push(value)
      //   })
      //   this.gxtData.lists.map(value=>{
      //     let isHave=false
      //     relateList.map(item=>{
      //       if(item.target==value.startPerson.id&&item.source==value.endPerson.id){
      //         isHave=true
      //         item.label=item.label+value.value5
      //       }
      //     })
      //     if(!isHave){
      //       relateList.push({
      //         source:value.startPerson.id,
      //         target:value.endPerson.id,
      //         label:value.value5
      //       })
      //     }
      //   })
      //   return {
      //     accountList,
      //     relateList
      //   }
      // },

    },
    methods: {
      sortChange({ prop, order }){
       
      },

      lineClick(line){
        // this.page=1
        // this.size=10
        // this.source=line.source.idCard!="null"?line.source.idCard:line.source.email
        // this.target=line.target.idCard!="null"?line.target.idCard:line.target.email
        // this.tableData=[]
        // this.getEmail()
        this.saryx=line.source.zjhm;
        this.lxryx=line.target.name?line.target.zjhm:line.target.yx,
        this.getyjfxMX(line);
      },

      getyjfxMX(line){
        console.log(232323)
          //  var ids=[];
          // for (const key in  this.sars) {
          //   // if (this.checkedsars.toString().indexOf( this.sars[key].label)>-1) {
          //   //   //  ids+=this.sars[key].value+',';
          //   //   ids.push(this.sars[key].value);
          //   // }
          //   for (const i in  this.checkedsars) {
          //      if (this.checkedsars[i]==this.sars[key].label) {
          //       ids.push(this.sars[key].value);
          //      }
          //   } 

          // }
              


        if(this.checkedsars.length==0){this.$message("请选择涉案人");return}
         let param={
             "strings":this.checkedsars.toString(),
            "limit":  this.tableData.pagination.pageSize,
            "offset":  this.tableData.pagination.pageNo,
            "archivesNum":  this.archiveNum.toString(),
            
            // "saryx":line.source.zjhm.replace(node.source.name,''),
            "saryx":this.saryx,

            // "lxryx":line.target.zjhm||line.target.yx||line.target.name,
            "lxryx":this.lxryx,

          }
          return http_da
          .getmailNonWorkTimeMX(param)
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {   
                  // this.graphVo=cloneDeep(data.data.data);
                  // this.gxtData=data.data.data;
                  this.tableData.rows = data.data.data.mailRecordList;
                  this.tableData.pagination.total = data.data.data.total;
            
              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})


          

      },
      handleChange(value) {
        console.log(value);
      },
       handleClose(done) {
        this.dialogVisible=false;
       
      },

       // getDA 获取所有案件信息
      getDA(){
           this.list=[];
        return http_da
          .getDAXX({})
          .then(res => res)
          .then(data => {
            if(data.data.code==200)
            {
              //生成option
              for (const item of data.data.data) {
                this.list.push({
                  value:item.num,
                  label:item.name,
                });
              }
            }else{
              this.$message(res.data.msg);
            }
          }).catch(e => {  this.graphLoading=false; this.$message('接口操作失败');})


      },

      
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      },

        //根据案件查图信息
      getSAR(){
        // this.graphLoading=true
        this.checkedsars=[];
        return http_da
          .getSAXX({archivesNum:this.archiveNum})
          .then(res => res)
          .then(data => {
            this.graphLoading=false
            if(data.data.code==200) 
            { 
            
              
              this.sars=[];
              if(data.data.data.length!=0){
                  // for (const item of data.data.data) {
                  //   this.sars.push({
                  //     value: item.idCard,
                  //     label: item.name
                  //   });
                  // }
                  this.sars=data.data.data;
              }
              


            }else{
              this.$message(res.data.msg);
            }

            
          }).catch(e => {  this.graphLoading=false; this.$message('接口操作失败');})


      },


      btnReset(){
        // this.$router.push({path:''});
          // this.$router.push({path: 'sjygl'})
          this.searchKey='';
          this.archiveNum='';
          // this.ids=[];
           this.sars=[];
           this.checkedsars=[];
          this.startvalue='';
          this.yxh='';

          this.endvalue='';

          this.getDA();
          this.getmailNonWorkTime();
      },

    

     


    
    
  



      search(target){
        this.getmailNonWorkTime();
      },
      handleSelectionChange(val){

      },
      handleRoleConfig(index, row){
        console.log(row);
        var data={
          "dbName": row.dbName,
          "hostName": row.hostName,
          "password": row.password,
          "port": row.port,
          "username":row.username
        }
         switch (row.dbType) {
              case "mysql":
                  return http_sjygl
                    .testMysqlDbConnection(data)
                    .then(res => res)
                    .then(data => {
                        if(data.data.code==200)
                        {
                         this.$message(data.data.data);
                      
                        }else{
                          this.$message(data.data.msg);
                        }
                    }).catch(e => {  this.$message('接口操作失败');})


                break;
              case "oracle":
                  return http_sjygl
                    .testOracleDbConnection(data)
                    .then(res => res)
                    .then(data => {
                        if(data.data.code==200)
                        {
                         this.$message(data.data.data);
                      
                        }else{
                          this.$message(data.data.msg);
                        }
                    }).catch(e => {  this.$message('接口操作失败');})

                break;
            }  

        dbType
        // this.currentRow = row;
        // this.dialogVisible = true;
        // if (this.roleTree.length <= 0) {
        //   sysApi.roleList({selectChildren:true})
        //     .then(res => {
        //       this.roleTree = res
        //     })
        // }
        // this.$http.get(api.SYS_USER_ROLE + "?id=" + row.id)
        //   .then(res => {
        //     this.$refs.roleTree.setCheckedKeys(res.data);
        //   }).catch(err=>{

        // })
      },
    
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.getyjfxMX();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.getyjfxMX();
      },
      handleDetail(index, row){
           this.nr='';

          let param={
            "caseNumSet": this.archiveNum!=''?[this.archiveNum]:[],
            "emailId": row.mailBH, 
          }
          return http_yjfx
          .getYJMX(param)
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                 this.nr= data.data.data._result[0];
                 this.dialogVisible=true;
            
              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})

        
     

      },
      handleDelete(index, row){
        // this.$http.get(api.SYS_USER_DELETE + "?userIds=" + row.id).then(res => {
        //   this.getmailNonWorkTime();
        // });
        



        this.$confirm('确认该数据源是否正在使用, 确认是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
         

           
            return http_sjygl
              .deleteSJYbyID({id:row.id})
              .then(res => res)
              .then(data => {
                  if(data.data.code==200)
                  {
                    this.getmailNonWorkTime();
                      this.$message(data.data.msg);
                
                  }else{
                    this.$message(data.data.msg);
                  }
              }).catch(e => {  this.$message('接口操作失败');})




          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });



      },
      getmailNonWorkTime(){
          if(this.archiveNum==''){this.$message('请输入案件信息');return}
          this.checkedsars;
          this.sars;
        //  var ids=[];
        //   for (const key in  this.sars) {
        //     // if (this.checkedsars.toString().indexOf( this.sars[key].label)>-1) {
        //     //   //  ids+=this.sars[key].value+',';
        //     //   ids.push(this.sars[key].value);
        //     // }
        //     for (const i in  this.checkedsars) {
        //        if (this.checkedsars[i]==this.sars[key].label) {
        //          ids.push(this.sars[key].value);
        //        }
        //     } 

           

        //   }
              

          // let param={
          //   "caseNum": this.archiveNum.toString(),
          //   "email": this.yxh,
          //   // "startDate":this.startvalue,
          //   // "endDate": this.endvalue,
          //   "startDate":this.startvalue==''?'': auth.myReplace(this.startvalue.toLocaleDateString(),'/','-'),
          //   "endDate": this.endvalue==''?'': auth.myReplace(this.endvalue.toLocaleDateString(),'/','-'),
          //   "idNumSet":ids,
          //   "size":this.tableData.pagination.pageSize,
          //   "page": this.tableData.pagination.pageNo,
          //   "title": this.searchKey,
            
          // }
          let param={
            "archivesNum":  this.archiveNum.toString(),
            "idCards": this.checkedsars,
            "maxMailCount": this.maxnum,
            "minMailCount": this.minnum
          }
          return http_da
          .getmailNonWorkTimeTXX(param)
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {   
                  this.graphVo=cloneDeep(data.data.data);
                  this.gxtData=data.data.data;
                  // this.tableData.rows = data.data.data.emailRecordEntityList;
                  // this.tableData.pagination.total = data.data.data.total;
            
              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})


      },



    },
    created(){
  

      this.getDA();
      // this.getmailNonWorkTime();

      // eventBus.$on(eventCollection.yjfx_fgzsdyjfx, node => {
      //   console.log(node)
      //   this.getyjfxMX(node);
      // });

    }
  }
</script>

<style scoped>
  .select-tree .icons-wrapper {
    display: block;
  }

  .select-tree .is-empty i {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
  }

  .select-tree .is-empty i:hover {
    background-color: #0d6aad;
    color: #ffffff;
  }
   .el-pagination {
    float: right;
    margin-top: 15px;
  }
  .fgzsdyjfxleft{
      height: 600px;
      overflow-y: auto;
  }
  .txx{
      height: 350px;
      overflow-y: auto;
  }
  .xqfxlb{
      height: 200px;
      overflow-y: auto;
  }
   .lb{
     margin-top: 10px;
     margin-left: 10px;
  }
   #sjylxtree >>> .el-tree-node__content{
    margin-top: 5px;
    font-size: 16px;
  }
    /* .el-select--340{
    max-width: 550px;
    min-width: 455px;

  } */
  .el-input-number{
    width: 120px;
  }

</style>
