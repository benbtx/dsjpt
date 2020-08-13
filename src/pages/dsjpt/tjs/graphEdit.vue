<template>

  <imp-panel>

    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="7" :offset="0">

          <div class="el-input" style=" float: left;">
            案件
            <el-select
              size='340'
              v-model="archiveNum"
              @change='getGraph'
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
        <el-col :span="10">
          <el-button type="primary" @click="getAddData">保存图形</el-button>
        </el-col>
      </el-row>
    </h3>

    <div slot="body">

      <el-card class="box-card">

        <kr-graph
          ref="graph"
          :graphData="graphData"
          v-loading="graphLoading"
          :toolbar="toolbar"
          :lineOptions="lineOptions"
          :nodeOptions="nodeOptions"
        ></kr-graph>
      </el-card >

    </div>


  </imp-panel>
</template>

<script>
  import panel from "../../../components/panel.vue";
  import http_da from "../../../common/http_da";
  import http_tjs from "../../../common/http_tjs"
  import http from "../../../common/http_graphEdit"
  export default {
    components: {
      'imp-panel': panel
    },
    computed: {
      graphData(){
        let relateList=[],accountList=[]
        this.gxtData.nodeDtos.map(value=>{
          accountList.push({
            name:value.pgProperty,
            ...value,
          })
        })
        this.gxtData.relationDtos.map(value=>{
          relateList.push({
            source: value.startNode.id,
            target: value.endNode.id,
            label:value.count
          })
        })
        return {
          relateList,
          accountList
        }
      }
    },
    data(){
      return {
        toolbar: [
          {
            name:"新增节点",
            icon:"el-icon-plus"
          },
          {
            name:"新增关系",
            icon:"el-icon-s-operation"
          },
        ],
        list: [],
        options: [],
        lineOptions: [],
        nodeOptions: [],
        archiveNum: "",
        loading: false,
        graphLoading:false,
        graphVo:null,
        gxtData:{
          nodeDtos: [],
          relationDtos: []
        },
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
              // this.$message('操作成功');
              // this.yw=data.data.data._result.rudangshici[0].content
              //生成option
              for (const item of data.data.data) {
                this.list.push({
                  value:item.num,
                  label:item.name,
                });
              }
              // this.list =  data.data.data.map(item => {
              //   return { value: `value:${item.num}`, label: `label:${item.name}` };
              // });


            }else{
              this.$message(res.data.msg);
            }
          })


      },
      //根据案件查图信息
      getGraph(){
        this.graphLoading=true
        return http
          .getGraph({archiveNum:this.archiveNum})
          .then(data => {
            this.graphLoading=false
            if(data.data.code==200) {
              this.graphVo=data.data.data;
              this.gxtData=data.data.data;

            }else{
              this.$message(res.data.msg);
            }
          }).catch(e => { this.graphLoading=false; this.$message('接口操作失败');})


      },

      getType(){
        http.getType()
          .then(data => {
            this.nodeOptions=[]
            this.lineOptions=[]
            if(data.data.code==200) {
              Object.keys(data.data.data.node).forEach((key)=>{
                this.nodeOptions.push({
                  value:key,
                  label:data.data.data.node[key]
                })
              })
              Object.keys(data.data.data.relation).forEach((key)=>{
                this.lineOptions.push({
                  value:key,
                  label:data.data.data.relation[key]
                })
              })
            }else{
              this.$message(res.data.msg);
            }
          }).catch(e => {this.$message('接口操作失败');})
      },

      getAddData(){
        let data=this.$refs.graph.getAddData()
        let nodes=[],links=[],nodeMap={}
        data.nodes.map(value=>{
          let node={
            dabh:this.archiveNum,
            "id": value.id,
            "pgProperty": value.pgProperty,
            "pgType": value.pgType
          }
          if(value.addType=="add"){
            nodes.push(node)
          }
          nodeMap[value.id]=node
        })
        data.links.map(value=>{
          if(value.addType=="add"){
            let l={
              id:"",
              dabh:this.archiveNum,
              startNode:nodeMap[value.source],
              endNode:nodeMap[value.target],
              count:value.count,
              pgProperty:value.pgProperty,
              pgType:value.pgType,
              weight:value.weight
            }
            links.push(l)
          }
        })
        this.saveGraph({nodeDtos:nodes,relationDtos:links})
      },
      saveGraph(data){
        http.saveGraph(data)
          .then(data => {
            if(data.data.code==200)
            {
              this.$message('添加成功');
            }else{
              this.$message(res.data.msg);
            }
          }).catch(e => { this.$message('添加失败');})
      },

    },
    created(){
      this.getDA();
      this.getType()
    },
    mounted() {

    },
    destroyed() {

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
