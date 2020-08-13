<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <!-- <el-button type="primary" icon="plus" @click="newAdd">新增</el-button>
      <el-button type="danger" icon="delete" @click="batchDelete">删除</el-button> -->
      <el-row style="width: 100%;">
          <el-col :span="6" :offset="0" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="el-input" style=" float: right;">
              关键字：
              <input type="text" placeholder="关键字：" v-model="searchKey" @keyup.enter="search($event)"
                    class="el-input__inner" style="width:180px">
            </div>
          </el-col>
          <el-col :span="6" :offset="0" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-button type="primary" icon="plus" @click="search">搜索</el-button>

            <el-button type="primary" icon="plus" @click="btnReset">重置</el-button>

            <router-link :to="{ path: 'sjyglUpdate',params: {pageNumber:'1',pageSize:'5'}}">
              <!-- <el-button type="primary" icon="plus">新增</el-button> -->
               <el-button type="primary" icon="plus" @click="newAdd">新增</el-button>
            </router-link>
          
           
        </el-col>
      </el-row>


    </h3>
    <el-row slot="body" :gutter="24" style="margin-bottom: 20px;">
      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
        <el-card   class="box-card sjyleft">
            <!-- show-checkbox -->

            <div><div style="float:right;">
              <i class='el-icon-folder-add' style="font-size: 20px;margin-right:5px;cursor: pointer;" @click='addsjylx'></i>   
               <i class='el-icon-edit' style="font-size: 20px;margin-right:5px;cursor: pointer;" @click='updatesjylx'></i>  
               <i class='el-icon-delete' style="font-size: 20px;margin-right:5px;cursor: pointer;" @click='deletesjylx'></i> </div></div>


            <el-tree id='sjylxtree' class='sjytree' v-if="menuTree"
                    ref="menuTree"
                    :data="menuTree"
                  
                    highlight-current
                    :expand-on-click-node="false"
                    :default-expand-all='true'
                    :render-content="renderContent"
                    @node-click="handleNodeClick" clearable node-key="id" :props="defaultProps">
                    
                    

                    
                    </el-tree>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
        <el-card class="box-card sjyleft">
            <el-table
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
                prop="dsName"
                label="数据源"  >
              </el-table-column>

               <el-table-column
                prop="dbName"
                label="数据库"  min-width="120">
              </el-table-column>
            
              <el-table-column
                prop="dbType"
                label="类型">
              </el-table-column>

               <el-table-column
                prop="hostName"
                label="地址"  width="150">
              </el-table-column>
               <el-table-column
                prop="port"
                label="端口"  width="60">
              </el-table-column>

              <!-- <el-table-column
                prop="idDsType"
                label="数据源类型">
              </el-table-column> -->

               <!-- <el-table-column
                label="状态">
                <template slot-scope="scope">
                  {{ scope.row.dsStatus===1 ? '已激活' : '未激活' }}
                </template>
              </el-table-column> -->
               <el-table-column
                prop="username"
                label="用户">
              </el-table-column>
               <el-table-column
             
                label="密码">
                  <template slot-scope="scope">
                     <!-- <el-input placeholder="请输入密码" v-model="scope.row.password" show-password></el-input> -->
                     ......
                     </template>

              </el-table-column>
               <!-- <el-table-column
                prop="describeInfo"
                label="描述">
              </el-table-column> -->
             
              <el-table-column label="操作" width="230">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="default"
                    icon="edit"
                    @click="handleEdit(scope.$index, scope.row)">编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="info"
                    icon="setting"
                    @click="handleRoleConfig(scope.$index, scope.row)">测试
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除
                  </el-button>
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
                title="数据源类型"
                :visible.sync="dialogVisible"
                width="30%"
              >
                
                <el-form ref="form" :model="jdform" label-width="60px">
                    <el-form-item label="名称">
                      <el-input v-model="jdform.code"></el-input>
                    </el-form-item>
                  
                    <el-form-item label="描述">
                      <el-input type="textarea" v-model="jdform.description"></el-input>
                    </el-form-item>

                    

                </el-form>

                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="onSJYLXSubmit" v-if="jdform.id==null" >新 增</el-button>
                  <el-button type="primary" @click="onSJYLXSubmit_edit" v-else>修 改</el-button>
                </span>
              </el-dialog>


           

        
        </el-card>
      </el-col>
    </el-row>
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
            pageSize: 5,
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
    methods: {
      btnReset(){
        // this.$router.push({path:''});
          // this.$router.push({path: 'sjygl'})
          this.searchKey='';
          this.typeId=0;
          this.load();
             this.loadData();
      },

      onSJYLXSubmit(data) {
        //  this.jdform.code='';
        //  this.jdform.description='';
        
        
         return http_sjygl
              .addSJYLX(this.jdform)
              .then(res => res)
              .then(data => {
                  if(data.data.code==200)
                  {  
                     this.$message(data.data.msg);
                     this.load();
                     this.dialogVisible=false;
                     this.$refs.menuTree.currentNode=null
                
                  }else{
                    this.$message(data.data.msg);
                  }
              }).catch(e => {  this.$message('接口操作失败');})


      },

      onSJYLXSubmit_edit(){
         return http_sjygl
              .updateSJYLXbyID(this.jdform)
              .then(res => res)
              .then(data => {
                  if(data.data.code==200)
                  {    this.$message(data.data.msg);
                    this.load();
                     this.dialogVisible=false;
                     this.$refs.menuTree.currentNode=null

                
                  }else{
                    this.$message(data.data.msg);
                  }
              }).catch(e => {  this.$message('接口操作失败');})
      },

     

      selectIcon(event){
        this.form.icon = event.target.className;
        this.selectIconDialog = false;
      },
      renderContent(h, { node, data, store }) {
        return (
          // <span>
          //   <span>
          //     <span><i class={data.icon}></i>&nbsp;{node.label}</span>
          //   </span>
          // </span>
          //  <i class='el-icon-menu'></i>  el-icon-folder
          <span class="custom-tree-node">
           
            <i class={node.childNodes.length!=0?'el-icon-folder':'el-icon-tickets'}></i>

            <span>{node.label} </span>&nbsp;&nbsp;
            <span>
               
                
            </span>



          </span>
          );
      },
      addsjylx(){


        if(this.$refs.menuTree.currentNode==null){ this.$message('请选择一个节点进行添加');return;}
                 this.dialogVisible=true;
                
                 var data= this.$refs.menuTree.currentNode.node.data;
                   console.log(data);
                  console.log(data.id);

                  this.jdform.parent=parseInt(data.id);

                     this.jdform.id=null;
                   
                    this.jdform.code=null;
                    this.jdform.description='';
      },
      updatesjylx(){
        if(this.$refs.menuTree.currentNode==null){ this.$message('请选择一个节点进行修改');return;}
          
          this.dialogVisible=true;
            var data= this.$refs.menuTree.currentNode.node.data;
                  console.log(data);
                  console.log(data.id);
                  
                    this.jdform.id=parseInt(data.id);
                    this.jdform.parent=parseInt(data.parentId);
                    this.jdform.code=data.value;
                    this.jdform.description=data.payload.description;

      },

      deletesjylx(){

        if(this.$refs.menuTree.currentNode==null){ this.$message('请选择一个节点进行删除');return;}
          
                  // console.log(node);
                  //   console.log(data);
                  //    console.log(store);
                    var data= this.$refs.menuTree.currentNode.node.data;
                  //判断该节点下是否有数据，有则不能删除
                  if(data.children.length>0){
                    this.$message('请先删除子节点');
                    return;
                  }
                   if(data.children.length>0){
                    this.$message('请先删除子节点');
                    return;
                  }

                  this.$confirm('将删除该数据, 是否确定?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                  }).then(() => {
                
                  
                  
                    return http_sjygl
                      .deleteSJYLXbyID({id:data.id})
                      .then(res => res)
                      .then(data => {
                          if(data.data.code==200)
                          {
                            this.load();
                            this.$refs.menuTree.currentNode=null
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

      newAdd(){
        this.form = {
          id: null,
          name: '',
          sort: 0,
          icon: '',
          href: '',
          isShow: '',
          delivery: false,
          parentId: null,
          desc: ''
        };
      },
      deleteSelected(){
        this.$http.get(api.SYS_MENU_DELETE + "?menuIds=" + this.form.id)
          .then(res => {
            this.$message('操作成功');
            this.deleteFromTree(this.menuTree, this.form.id);
            this.newAdd();
          }).catch(e => {
          this.$message('操作成功');
          this.deleteFromTree(this.menuTree, this.form.id);
          this.newAdd();
        })
      },
      batchDelete(){
        var checkKeys = this.$refs.menuTree.getCheckedKeys();
        if (checkKeys == null || checkKeys.length <= 0) {
          this.$message.warning('请选择要删除的资源');
          return;
        }
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(api.SYS_MENU_DELETE + "?menuIds=" + checkKeys.join(','))
            .then(res => {
              this.$message('操作成功');
              this.load();
            }).catch(e => {
            this.$message('操作成功');
            this.batchDeleteFromTree(this.menuTree, checkKeys);
          })
        });

      },
      handleNodeClick(data){
        console.log(1);
        console.log(data.value);
        //触发查询事件
        // this.searchKey=data.id;
        this.typeId=data.id;
        this.loadData();

        this.form = merge({}, data);
      },
      onSubmit(){
        if (this.form.id == null) {
          this.$http.post(api.SYS_MENU_ADD, this.form)
            .then(res => {
              this.$message('操作成功');
              this.form.id = res.data.id;
              this.appendTreeNode(this.menuTree, res.data);
            }).catch(e => {
            this.maxId += 1;
            this.$message('操作成功');
            this.form.id = this.maxId;
            var ddd = {
              id: this.form.id,
              name: this.form.name,
              sort: this.form.sort,
              icon: this.form.icon,
              href: this.form.href,
              isShow: this.form.isShow,
              delivery: this.form.delivery,
              parentId: this.form.parentId,
              desc: this.form.desc,
              children: []
            }
            this.appendTreeNode(this.menuTree, ddd);
            this.menuTree.push({});
            this.menuTree.pop();
          })
        } else {
          this.$http.post(api.SYS_MENU_UPDATE, this.form)
            .then(res => {
              this.$message('操作成功');
              this.updateTreeNode(this.menuTree, res.data);
            }).catch(e => {
            this.$message('操作成功');
            this.updateTreeNode(this.menuTree, merge({}, this.form));
          })
        }
      },
      load(){
        // sysApi.menuList().then(res => {
        //   this.menuTree = res;
        // })
         return http_sjygl
          .getSJYLXTREE({id:0})
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                  this.menuTree = data.data.data;
            
              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})




      },



      search(target){
        this.loadData();
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
        console.log(this.tableData.pagination.pageNo);
        // this.$router.push({path: 'sjyglUpdate', params: {pageNumber:'1',pageSize:'5'},query: {id: row.id,pageNumber:'1',pageSize:'5'}})
        
         this.$confirm('确认该数据源是否正在使用, 确认是否修改?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
         

           
                 this.$router.push({path: 'sjyglUpdate',query: {id: row.id,pageNumber:'1',pageSize:'5'}})
              


          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消修改'
            });
          });





        
     

      },
      handleDelete(index, row){
        // this.$http.get(api.SYS_USER_DELETE + "?userIds=" + row.id).then(res => {
        //   this.loadData();
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
                    this.loadData();
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
      loadData(){
          // http_sjygl.getSJY({
          //   key: this.searchKey,
          //   pageSize: this.tableData.pagination.pageSize,
          //   pageNo: this.tableData.pagination.pageNo
          // })
          // .then(res => {
          //   this.tableData.rows = res.records;
          //   this.tableData.pagination.total = res.total;
          // });

          let param={
            name: this.searchKey,
               typeId: this.typeId,
            pageSize: this.tableData.pagination.pageSize,
            pageNumber: this.tableData.pagination.pageNo
          };
          return http_sjygl
          .getSJY(param)
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                  this.tableData.rows = data.data.data.rows;
                  this.tableData.pagination.total = data.data.data.total;
            
              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})


      },
      loadData2(){
          // http_sjygl.getSJY({
          //   key: this.searchKey,
          //   pageSize: this.tableData.pagination.pageSize,
          //   pageNo: this.tableData.pagination.pageNo
          // })
          // .then(res => {
          //   this.tableData.rows = res.records;
          //   this.tableData.pagination.total = res.total;
          // });

          let param={
            typeId: this.typeId,
            pageSize: this.tableData.pagination.pageSize,
            pageNumber: this.tableData.pagination.pageNo
          };
          return http_sjygl
          .getSJYbyType(param)
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                  this.tableData.rows = data.data.data.rows;
                  this.tableData.pagination.total = data.data.data.total;
            
              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})


      }



    },
    created(){
      this.load();
      this.loadData();
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
  .sjyleft{
      height: 500px;
      overflow-y: auto;
  }
   .sjytree{
     margin-top: 30px;
  }
   #sjylxtree >>> .el-tree-node__content{
    margin-top: 5px;
    font-size: 16px;
  }

</style>
