<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="10" :offset="0">
          <div class="el-input" style=" float: right;">
             单词：
            <input type="text" placeholder="单词：" v-model="searchKey" @keyup.enter="search($event)"
                   class="el-input__inner" style="width:180px">
          </div>
        </el-col>
         <!-- <el-col :span="10" :offset="0">
          <div class="el-input" style=" float: right;">
             关键字：
            <input type="text" placeholder="关键字：" v-model="searchKey" @keyup.enter="search($event)"
                   class="el-input__inner" style="width:180px">
          </div>
        </el-col> -->
      
        <el-col :span="14">
            <!-- <el-button type="primary" icon="plus" @click="search">数据索引</el-button> -->
              <el-button type="primary" icon="plus" @click="search">搜索</el-button>
         
        </el-col>
      </el-row>
    </h3>
    <div slot="body">
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
          prop="序号"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="单词"
          label="单词" >
        </el-table-column>
        <el-table-column
          prop="逆向文档频率"
          label="逆向文档频率">
        </el-table-column>

        
         <!-- <el-table-column
          prop="倒排列表(index;DocID;TF)"
          label="倒排列表(index;DocID;TF)">
        </el-table-column> -->

         <el-table-column label="倒排列表(index;DocID;TF)" width="285" align='center'>
          <template slot-scope="scope">
            <el-button
              size="small"
              type="default"
              icon="edit"
              @click="handleDetail(scope.$index, scope.row)">详情
            </el-button>
          
          
          </template>
        </el-table-column>



      </el-table>


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


       
      <el-dialog title="配置用户角色" v-model="dialogVisible" size="tiny">
        <div class="select-tree">
          <el-scrollbar
            tag="div"
            class='is-empty'
            wrap-class="el-select-dropdown__wrap"
            view-class="el-select-dropdown__list">
            <el-tree
              ref="roleTree"
              :data="roleTree"
              show-checkbox
              check-strictly
              node-key="id" v-loading="dialogLoading"
              :props="defaultProps">
            </el-tree>
          </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="configUserRoles">确 定</el-button>
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
  import auth from "../../../common/auth";
  

  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        searchKey: '',
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
      
        tableData: {
          pagination: {
            total: 0,
            pageNo: 1,
            pageSize: 10,
            parentId: 0
          },
          rows: []
        }
      }
    },
    methods: {
      search(target){
        // this.searchKey=
        this.loadData();
      },
      handleDetail(index, row){
        console.log(index);
        this.dialogVisible = true;
        // this.nr=row['倒排列表(index;DocID;TF)'];
         this.nr=auth.myReplace( row['倒排列表(index;DocID;TF)'],',','</br>');


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
        // this.$http.POST(api.QWJS_ZWFC_DELETE+"?_method=DELETE" , {id:row.id}).then(res => {
        //   this.loadData();
        // });

            // this.$confirm('确认删除该条数据?', '提示', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   // @onConfirm= 'qr',
            //   // @onCancel='qr',
              
            //   type: 'success'
            // })

        this.$confirm('将删除该数据, 是否确定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$http.delete(api.QWJS_ZWFC_DELETE+"?id="+row.id , {id:row.id}).then(res => {
          //   if(res.data.code=='200'){
          //       this.$message(res.data.msg);
          //         this.loadData();
          //     }else{
          //       this.$message(res.data.msg);
          //     }
          
          // });

            let param={id:row.id };
            return http_qwjs
            .getFCSC(param)
            .then(res => res)
            .then(data => {
                if(data.data.code==200)
                {
                   this.loadData();
                  
              
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
          
          let param={value: this.searchKey };
          return http_qwjs
          .getDPSY(param)
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                 this.tableData.rows = data.data.data;
                
            
              }else{
                 this.$message(data.data.msg);
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
