<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
      </el-row>
    </h3>
    <div slot="body">
      <el-table
        :data="tableData.rows"
        border
        style="width: 100%"
        v-loading="listLoading"
        @selection-change="handleSelectionChange">
        <el-table-column
          prop="id"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>

        
         <el-table-column
          prop="isDeleted"
          label="是否删除">
          <template slot-scope="scope">
            {{ scope.row.isDeleted===true ? '已删除' : '未删除' }}
          </template>
        </el-table-column>

        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="操作时间">
        </el-table-column>
        <el-table-column
          prop="operator"
          label="操作人">
        </el-table-column>

        <el-table-column label="操作" width="285">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="default"
              icon="edit"
              @click="handleView(scope.$index, scope.row)">查看
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

      <el-dialog title="查看"  :visible.sync="dialogVisible"  height='60%' width="40%" >
        <div  v-loading="loading">
          <kr-graph
            ref="graph"
            :graphData="graphData"
            :maxClickNum="0"
          ></kr-graph>
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

  import * as sysApi from '../../../services/sys'

  import http_da from "../../../common/http_da"



  export default {
    components: {
      'imp-panel': panel
    },
    computed: {
      graphData(){
        let relateList=[]
        this.gxtData.lists.map(value=>{
          relateList.push({
            source: value.startPerson.id,
            target: value.endPerson.id,
            label:value.value0
          })
        })
        return {
          relateList,
          accountList:this.gxtData.persons
        }
      }
    },
    data(){
      return {
        searchKey: '',
        currentRow: {},
        loading: false,
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
            pageNo: 0,
            pageSize: 10,
            parentId: 0
          },
          rows: []
        },
        graphVo:null,

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



      }
    },
    methods: {
      search(target){
        this.loadData();
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
        this.tableData.pagination.pageNo = val-1;
        this.loadData();
      },
      handleEdit(index, row){
        // this.$router.push({path: 'userAdd', query: {id: row.id}})
        this.$router.push({path: 'zdwhUpdate', query: {id: row.id}})

      },
      handleView(index, row){
          // row.id
          var _this=this;
          this.dialogVisible=true;
          this.loading=true;
          let param={snapshotId: row.id };
          return http_da
          .getTKZ(param)
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                //  _this.$message(data.data.msg);
                   //
                    _this.graphVo=null;
                     _this.gxtData=null;
                  _this.graphVo=data.data.data;
                  _this.gxtData=data.data.data;
              }else{
                 this.$message(data.data.msg);
              }
            _this.loading=false;
          })
          .catch(e => { _this.loading=false;this.$message('接口操作失败');})



        
      },
      handleDelete(index, row){

        this.$confirm('将删除该数据, 是否确定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

            let param={snapshotId:parseInt(row.id )};
            return http_da
            .getTSC(param)
            .then(res => res)
            .then(data => {
                if(data.data.code==200)
                {
                    this.$message(data.data.msg);
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
         
          let param={offset: this.tableData.pagination.pageNo,limit: this.tableData.pagination.pageSize };
          return http_da
          .getTKZLB(param)
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                 this.tableData.rows = data.data.data.graphSnapshots;
                  // this.tableData.pagination.pageNo
                 this.tableData.pagination.pageSize = data.data.data.limit;
                 this.tableData.pagination.pageNo = data.data.data.offset;
                 this.tableData.pagination.total = data.data.data.total;

                
            
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
