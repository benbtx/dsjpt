<template>

  <imp-panel>

    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="7" :offset="0">
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
              @change='getTXX'
              filterable
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

        <el-col :span="8">
          <div class="el-input" style=" float: left;">
            <!-- width:200px -->
            人员选择：
            <el-select  size='80' multiple  collapse-tags  v-model="ryxx" placeholder="请选择">
              <el-option
                v-for="item in database"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

          </div>

        </el-col>

        <!-- <el-col :span="4">
            <div class="el-input" style=" float: left; ">
              交易次数：
              <el-input style='width:50px' v-model="jycsks" placeholder="0"></el-input>-
              <el-input style='width:50px' v-model="jycsjs" placeholder="1000"></el-input>

            </div>

        </el-col> -->



        <el-col :span="8">
          <el-button type="primary" icon="plus" @click="getSearch">搜索</el-button>
          <el-button type="primary" icon="plus" @click="btnGetSDYX">深度优先遍历</el-button>
          <el-button type="primary" icon="plus" @click="btnGetGDYX">广度优先遍历</el-button>

          <!-- <router-link :to="{ path: 'hmdAdd'}">
            <el-button type="primary" icon="plus">更新</el-button>
          </router-link> -->

          <!-- <el-button type="primary" icon="plus" @click="getTXX">更新图</el-button> -->
          <!-- <el-button type="primary" icon="plus">保存图</el-button> -->
        </el-col>
      </el-row>
    </h3>

    <div slot="body">

      <el-card class="box-card">
        <kr-graph
          ref="graph"
          :graphData="graphData"
          :flowLine="flowLine"
          v-loading="graphLoading"
        ></kr-graph>
      </el-card >


      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
      >
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
  import panel from "../../../components/panel.vue";
  import http_da from "../../../common/http_da";
  import http_tjs from "../../../common/http_tjs"
  import {cloneDeep} from "lodash"


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
      },
      flowLine(){
        return this.gxtXRJD.map(value=>value.id)
      }
    },
    data(){
      return {
        chart: null,
        options: [],
        archiveNum: [],
        list: [],
        loading: false,
        graphLoading: false,

        nr:'',

        dialogVisible: false,
        jycsks:'',
        jycsjs:'',


        database: [{
          value: '选项1',
          label: '张三'
        }, {
          value: '选项2',
          label: '李四'
        }, {
          value: '选项3',
          label: '周五'
        }],
        ryxx: '',//当前选择的人员信息
        //最新数据需要适配 重新组织到option 中去
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
        gxtXRJD:[],//关系图中需要渲染的节点
        graphVo:null,
        twoWayMappingId:0,
        currentRow: {},

        dialogLoading: false,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
        roleTree: [],
        listLoading: false,
        searchKey: '',
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

      // getDA 获取所有案件信息
      getDA(){
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
          })


      },
      //根据案件查图信息
      getTXX(){
        this.graphLoading=true
        return http_tjs
          .getDACTXX({archiveNum:this.archiveNum})
          .then(res => res)
          .then(data => {
            this.graphLoading=false
            if(data.data.code==200)
            {
              // this.$message('操作成功');
              this.graphVo=cloneDeep(data.data.data);
              this.gxtData=data.data.data;
              //更新人员信息
              this.database=[];
              for (const item of this.gxtData.persons) {
                this.database.push({
                  value: item.id,
                  label: item.name
                });
              }

            }else{
              this.$message(res.data.msg);
            }
          }).catch(e => {  this.graphLoading=false; this.$message('接口操作失败');})


      },


      getSearch(){
        this.$refs.graph.searchNode(this.ryxx)
      },

      nodeClick(nodes){
        this.ryxx=nodes.map(value=>value.id)
      },

      personChange(){
        this.$refs.graph.changeClickNode(this.ryxx)
      },


      //深度优先遍历 
      btnGetSDYX(){
        var _this=this;
        if(this.archiveNum==[]){ this.$message('请先查询选择案件'); return;}
        if(this.graphVo==null||!this.$refs.graph.clickNodes.length){ this.$message('请先选中某个节点'); return;}
        this.graphLoading=true
        http_tjs
          .getSDYX({graphVo:this.graphVo,twoWayMappingId:this.$refs.graph.clickNodes[0].twoWayMappingId})
          .then(res => res)
          .then(data => {
            this.graphLoading=false;
            if(data.data.code==200)
            {
              _this.gxtXRJD=data.data.data; //当前查询到需要渲染的节点
              _this.nr='';
              for (const i of  _this.gxtXRJD) {
                this.nr+="<span >"+i.name+"("+i.idCard+")</span><br/>"
              }
            }else{
              this.$message(res.data.msg);
            }
          }).catch(e => {  this.graphLoading=false; this.$message('接口操作失败');})


      },
      //深度广先遍历 
      btnGetGDYX(){
        var _this=this;
        if(this.archiveNum==[]){ this.$message('请先查询选择案件'); return;}
        if(this.graphVo==null||!this.$refs.graph.clickNodes.length){ this.$message('请先选中某个节点'); return;}
        this.graphLoading=true
        http_tjs
          .getGDYX({graphVo:this.graphVo,twoWayMappingId:this.$refs.graph.clickNodes[0].twoWayMappingId})
          .then(res => res)
          .then(data => {
            this.graphLoading=false;
            if(data.data.code==200)
            {
              _this.gxtXRJD=data.data.data; //当前查询到需要渲染的节点
              _this.nr='';
              for (const i of  _this.gxtXRJD) {
                this.nr+="<span >"+i.name+"("+i.idCard+")</span><br/>"
              }
            }else{
              this.$message(res.data.msg);
            }
          }).catch(e => {  this.graphLoading=false; this.$message('接口操作失败');})


      }
    },
    created(){
      this.getDA();
    },
    mounted() {
      // this.$nextTick(function () {
      //   this.drawchart('chart');
      //   var that = this;
      //   var resizeTimer = null;
      //   window.onresize = function () {
      //     if (resizeTimer) clearTimeout(resizeTimer);
      //     resizeTimer = setTimeout(function () {
      //       that.drawchart('chart');
      //     }, 1000);
      //   }
      // });
    },
    destroyed() {
      window.onresize=null;
      // document.removeEventListener('click', this.autoHide, false)
    }
  }
</script>
<style scoped>
  #chart {
    width: 100%;
    min-height: 400px;
    height: 500px;
    margin-right: 15px;
  }
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
  .el-select--340{
    max-width: 240px;
  }
  .el-select--80{
    max-width: 220px;
  }


</style>
