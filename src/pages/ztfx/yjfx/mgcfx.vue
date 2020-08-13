<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      
      <el-row style="width: 100%;">


         <el-col  :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <!-- <div class="el-input" style=" float: right;">
            姓名：
            <input type="text" placeholder="输入用户名称" v-model="searchKey" @keyup.enter="search($event)"
                  class="el-input__inner" style="width:150px">
          </div> -->
          <div class="el-input" style=" float: left;">
            案件

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




          <el-col  :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
            <div class="el-input" style=" float: right;">
              敏感词：
              <input type="text" placeholder="关键字：" v-model="searchKey" @keyup.enter="search($event)"
                    class="el-input__inner" style="width:180px">
            </div>
          </el-col>
          <el-col  :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
            <el-button type="primary" icon="plus" @click="search">搜索邮件</el-button>

            <el-button type="primary" icon="plus" @click="btnReset">重置</el-button>

            <router-link :to="{ path: 'sjyglUpdate',params: {pageNumber:'1',pageSize:'5'}}">
        
            </router-link>
          
           
        </el-col>
      </el-row>


    </h3>
    <el-row slot="body" :gutter="24" style="margin-bottom: 20px;">

       <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
        <el-card class="box-card ">
           
            <ul class="p-ls mgcyjlb" id="jqlb" v-show="true">
                <li v-for="(item, i) in tableData.rows" :key="i" @click="getXq(item)" :class="item.id" style="list-style-type:none;">
                
                  <div style="background:#eee;border：1px solid #efe;margin-bottom:20px;padding:10px">
                    
                    <span v-for="(it, j) in  Object.keys(item)" :key="j" >
                      <!-- it=='saryx'?'涉案编号': -->
                            <!-- {{it}}  :<span v-html="item[it]"></span> -->
                           
                            {{it=='sabh'?'涉案编号':it=='saryx'?'涉案人邮箱':it=='yjlx'?'邮件类型': it=='zjhm'?'证件号码': it=='fssj'?'发生时间': it=='mc'?'涉案人姓名':it}}  :<span v-html="item[it]==null?'null':item[it]"></span>
                         

                    </span>
                      

                  </div>
                



                </li>
              
            </ul>




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
                  <!-- <p v-html="nr"> -->
                    <p>
                    涉案编号 : {{nr.sabh}}</br>
                    档案编号 : {{nr.dabh}}  </br> 
                    涉案人邮箱 : {{nr.saryx}} </br>
                    邮件类型 : {{nr.yjlx=='1'?'发送':nr.yjlx=='2'?'接收':'未知'}}   </br>
                    证件号码 : {{nr.zjhm}}   </br>
                    发送时间 : {{nr.fssj}}  </br>
                    创建时间 : {{nr.cjsj}}  </br>   
                    涉案人姓名 : {{nr.mc}}  </br>

                    
                    联系人邮箱 : {{nr.lxryx}}  </br>   
                    邮件主题 : <p v-html='nr.yjzt'> </p>    
                    邮件内容:<p v-html='nr.yjnr'> </p> 

                  

                    是否工作时段 : {{nr.isworktime==1?'是':'否'}}  </br>   

                



                  

                  </p>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
              </el-dialog>


           

        
        </el-card>
      </el-col>
      
      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
        <el-card   class="box-card mgcleft">
         
               

              <div>
                     <span style="text-align:center">选择案件涉案人</span> 
                     <div class='sar'>
                          <!-- <el-checkbox-group v-model="sars"> -->
                           <!-- <div class='lb'> <el-checkbox label="z" name="type"></el-checkbox></div>
                           <div class='lb'>  <el-checkbox label="地推活动" name="type"></el-checkbox> </div>
                           <div class='lb'>  <el-checkbox label="线下主题活动" name="type"></el-checkbox>  </div>
                           <div class='lb'>   <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>  </div> -->
                          <!-- </el-checkbox-group> -->
                           
                           <!-- <div class='lb' ref="sarlb" v-for="(item, i) in sars" :key="i" > <el-checkbox   :ref='"sarlb"+i'  :label='item.label'  :name='item.id'></el-checkbox></div> -->
                            <!-- <el-checkbox v-for="item in sars" :label="item.label" :key="item.id">{{item.label}}</el-checkbox> -->
                          
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

  import panel from "../../../components/panel.vue"
  import selectTree from "../../../components/selectTree.vue"
  import treeter from "../../../components/treeter"
  import merge from 'element-ui/src/utils/merge';

  import * as api from "../../../api"
  import * as sysApi from '../../../services/sys';

  import http_sjygl from "../../../common/http_sjygl"
  import http_yjfx from "../../../common/http_yjfx"

  import http_da from "../../../common/http_da";



  export default {
    mixins: [ treeter ],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree
    },
    data(){
      return {
         nr:'',
        loading: false,
        archiveNum: '',
        options: [],
        list: [],

        
        checkedsars: [],
        sars:[],
        // sars:[{id:'1',label:"张三"},
        // {id:'2',label:"李四"},
        // {id:'3',label:"王五"},],
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
        defaultProps: {
          children: 'children',
          label: 'value',
          id: "id",
        },
        roleTree: [],
        listLoading: false,
        searchKey: '',
        typeId:'',
        tableData: {
          pagination: {
            total: 0,
            pageNo: 1,
            pageSize: 10,
            parentId: 0
          },
          rows: []
        },
        // jdform:{
        //   code: null,
        //   description: "",
        //   parent: -1,
        //   id:-1,
        // },

      }
    },
    methods: {
      handleClose(done) {
        this.dialogVisible=false;
       
      },

      getXq(content){
        this.dialogVisible = true;
          // switch (content) {
           
          //   case '1':
             
          //     break;
          //   case '2':
               
          //     break;

          //   case '3':
              
          //     break;
          // }  
        this.nr=content;
          // this.$message('操作成功');
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
        var _this=this;
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            _this.loading = false;
            _this.options = _this.list.filter(item => {
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
          this.checkedsars=[];

        // this.graphLoading=true
        return http_da
          .getSAXX({archivesNum:this.archiveNum})
          .then(res => res)
          .then(data => {
            // this.graphLoading=false
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
          this.options=[];
          this.checkedsars=[];
          this.sars=[];
          this.getDA();
             this.getMGCData();
      },

      // onSJYLXSubmit(data) {
       
        
      //    return http_sjygl
      //         .addSJYLX(this.jdform)
      //         .then(res => res)
      //         .then(data => {
      //             if(data.data.code==200)
      //             {  
      //                this.$message(data.data.msg);
      //                this.load();
      //                this.dialogVisible=false;
      //                this.$refs.menuTree.currentNode=null
                
      //             }else{
      //               this.$message(data.data.msg);
      //             }
      //         }).catch(e => {  this.$message('接口操作失败');})


      // },

      // onSJYLXSubmit_edit(){
      //    return http_sjygl
      //         .updateSJYLXbyID(this.jdform)
      //         .then(res => res)
      //         .then(data => {
      //             if(data.data.code==200)
      //             {    this.$message(data.data.msg);
      //               this.load();
      //                this.dialogVisible=false;
      //                this.$refs.menuTree.currentNode=null

                
      //             }else{
      //               this.$message(data.data.msg);
      //             }
      //         }).catch(e => {  this.$message('接口操作失败');})
      // },
       handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        // this.loadData();
         this.getMGCData();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        // this.loadData();
          this.getMGCData();
      },

     

    
     
    
  
    
    
  
     



      search(target){
        this.getMGCData();
      },
      
  
      getMGCData(){
          // this.$refs.sarlb;
          // this.sars.length
          //  this.$refs.sarlb1[0].checked;
          //  this.$refs.sarlb1[0].name;
          //获取选中人的身份证id
          // let ids=[];
          // for (const key in  this.sars) {
          //   if ( this.$refs['sarlb'+key][0].checked) {
          //      ids.push(this.$refs['sarlb'+key][0].name);
              
          //   }
          // }

          this.checkedsars;
          this.sars;
          // let ids=[];
          // for (const key in  this.sars) {
          //   if (this.checkedsars.toString().indexOf( this.sars[key].label)>-1) {
          //      ids.push(this.sars[key].value);
          //   }
          // }
          

          let param={
            sensitiveWord: this.searchKey,
            // sensitiveWord: "",
            criminalIdSet:this.checkedsars,
            caseNumSet:this.archiveNum!=''?[this.archiveNum]:[],
            size: this.tableData.pagination.pageSize,
            page: this.tableData.pagination.pageNo
          };

       
          return http_yjfx
          .getMGCFX(param)
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                  this.tableData.rows = data.data.data._result;
                  this.tableData.pagination.total = data.data.data._totalHits;
            
              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})


      },
   



    },
    created(){
  
       this.getDA();
      this.getMGCData();
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
  .mgcleft{
      height: 500px;
      overflow-y: auto;
  }
  .mgcyjlb{
      height: 450px;
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

</style>
