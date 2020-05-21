<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
         
        <!-- <el-col :span="10" :offset="0">
          <div class="el-input" style=" float: right;">
             关键字：
            <input type="text" placeholder="关键字：" v-model="searchKey" @keyup.enter="search($event)"
                   class="el-input__inner" style="width:180px">
          </div>
        </el-col>
       
        <el-col :span="14">
            <el-button type="primary" icon="plus" @click="search">搜索</el-button> 
        </el-col> -->

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

        <!-- <el-table-column
          label="状态">
          <template slot-scope="scope">
            {{ scope.row.status===1 ? '已激活' : '未激活' }}
          </template>
        </el-table-column> -->

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
         <!-- <el-table-column
          label="操作时间">
          <template slot-scope="scope">
            {{ scope.row.status===1 ? '已激活' : '未激活' }}
          </template>
        </el-table-column> -->

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
        <div class="">
             <div id="chart"></div>
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

  import http_da from "../../../common/http_da"
  import echarts from 'echarts';


  let option= option = {
      title: {
          text: '',
      },
      legend: [{
          // selectedMode: 'single',
      
          // icon: 'circle'
      }],
      series: [{
          type: 'graph',
          layout: 'force',
          symbolSize: 58,
          draggable: true,
          roam: true,
          focusNodeAdjacency: false,//关联节点高亮其他淡化true   
          categories: [],
          // edgeSymbol: ['', 'arrow'],
          edgeSymbolSize: [80, 10],
     

          edgeLabel: {
              normal: {
                  show: true,
                  textStyle: {
                      fontSize: 15
                  },
                  formatter(x) {
                      // return x.data.name ;
                      return x.data.value ;

                  },
                  align: 'center',
                  position:'middle',
                  color:'red',
                  // padding:
              },
             
          },
          label: {
             normal: {
                  show: true,
                  textStyle: {
                      fontSize: 15
                  },
                  formatter(x) {
                      return x.data.name ;
                  },
                   color:'white'
              },
          },
          force: {
              repulsion: 2000,
              edgeLength: 120
          },
          data:[],
          links: []
      }]
  };




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
                  _this.drawchart('chart');
                  var that = _this;
                  var resizeTimer = null;
                  window.onresize = function () {
                    if (resizeTimer) clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(function () {
                      that.drawchart('chart');
                    }, 1000);
                  }

                
                
            
              }else{
                 this.$message(data.data.msg);
              }
          })
          // .catch(e => {  this.$message('接口操作失败');})



        
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

       
            

          
      },
      drawchart(id) {
        var _this=this;
        let o = document.getElementById(id);
        if(o==null){
          return;
        }
        let height = document.documentElement.clientHeight;
        height -= 120;
        o.style.height= height+"px";
        this.chart = echarts.init(o,'macarons');
        // this.chart = echarts.init(o);


        //重新构造option
        let nodes=[];
        for (const item of this.gxtData.persons) {
          nodes.push({
                name: item.name,
                // symbolSize:50,
                // itemStyle:{color :'black'},//10a050   3ff7d18   006acc
                label:{color :'white'},//10a050   3ff7d18   006acc
                symbolSize: 120,//圆饼大小 节点大小
                itemStyle: {
                    color: '#409EFF', //#409EFF blue 节点的背景色
                },
                data:item,
          });
          // var node={
          //       name: item.name,
          //       // symbolSize:50,
          //       // itemStyle:{color :'black'},//10a050   3ff7d18   006acc
          //       label:{color :'white'},//10a050   3ff7d18   006acc
          //       symbolSize: 80,
          //       itemStyle: {
          //           color: '#409EFF', //#409EFF blue 节点的背景色
          //       },
          //       data:item,
          // };
          // for (const i of  this.gxtXRJD) {
          //    if(item.idCard==i.idCard){
          //      node.itemStyle.color='red'
          //    }
          // }
          //  nodes.push(node);

        }
       
        let links=[];
        for (const item of this.gxtData.lists) {
          links.push({
                source: item.startPerson.name,
                target: item.endPerson.name,
                value: item.value0,
                lineStyle:{
                    color: '#736d6d',  //#409EFF blue 连线的颜色
                    width:2,
                    opacity:1,

                },
                 data:item,
            });
        }
        

        option.series[0].data=nodes;
        option.series[0].links=links;

        this.chart.setOption(option);
        this.chart.resize();
       
        this.chart.off('click');
        this.chart.on('click', function (params) {
           console.log(params);
           console.log(params.data.data);
          //  _this.twoWayMappingId=params.data.data.twoWayMappingId;
          if(_this.twoWayMappingId.length>=2){
            _this.$message('只能选择两个点');
            return;
          }
          //去除重复选择的
          if(_this.twoWayMappingId.length==1){
            if(_this.twoWayMappingId[0]==params.data.data.twoWayMappingId){
               return;
            }
          }
          _this.twoWayMappingId.push(params.data.data.twoWayMappingId);

            //改变节点状态 ,当前单击选中高亮
                  for (const item of option.series[0].data) {
                     if(item.data.twoWayMappingId==params.data.data.twoWayMappingId){
                        item.itemStyle.color='Blue'
                      }
                      // else{
                      //   item.itemStyle.color='#409EFF'
                      // }

                  }
                 

                _this.chart.setOption(option);

        });
        //双击取消选择
        this.chart.off('dblclick');
        this.chart.on('dblclick', function (params) {
           console.log(params);
          //  alert(params.data.data.twoWayMappingId);
          //  if(_this.twoWayMappingId.tos){}
          if(_this.twoWayMappingId.toString().indexOf(params.data.data.twoWayMappingId)>-1){
            //包含则取消
            var gdarr=[];//过渡数组
            for (const i of _this.twoWayMappingId) {
                if(i!=params.data.data.twoWayMappingId){
                  gdarr.push(i);

                }else{
                  //清除高亮
                  //改变节点状态 ,当前单击选中高亮
                  for (const item of option.series[0].data) {
                     if(item.data.twoWayMappingId==i){
                        item.itemStyle.color='#409EFF'//red
                      }
                      // else{
                      //   item.itemStyle.color='#409EFF'
                      // }

                  }

                  _this.chart.setOption(option);

                }
            }
            _this.twoWayMappingId=gdarr;
            
          }else{
            
          }
          

        });


      },


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
