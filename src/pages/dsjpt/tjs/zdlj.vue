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

          <!-- <el-col :span="6">
              <div class="el-input" style=" float: left;">
             
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

          <el-col :span="4">
              <div class="el-input" style=" float: left; ">
                交易次数：
                <el-input style='width:50px' v-model="jycsks" placeholder="0"></el-input>-
                <el-input style='width:50px' v-model="jycsjs" placeholder="1000"></el-input>
                
              </div>

          </el-col> -->



          <el-col :span="8">
              <!-- <el-button type="primary" icon="plus" @click="btnGetZDLJ()">最短路径</el-button> -->
              <el-button type="primary" icon="plus" @click="btnGetZDLJ">最短路径</el-button>
                <el-button type="primary" icon="plus" @click="btnGetCZ">重置</el-button> 
              <!-- <el-button type="primary" icon="plus" @click="btnGetGDYX">广度优先遍历</el-button> -->

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
            
             <div id="chart"></div>
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
  import * as api from "../../../api";
  import testData from "../../../../static/data/data.json";
  import * as sysApi from '../../../services/sys';
  import echarts from 'echarts';
  import macarons from 'echarts/theme/dark';
  import http_da from "../../../common/http_da";
  import http_tjs from "../../../common/http_tjs"

  

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
          focusNodeAdjacency: false,
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
        chart: null,
        options: [],
        archiveNum: [],
        list: [],
        loading: false,

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
        gxtXRLX:[],//关系图中需要渲染的连线
        graphVo:null,
        twoWayMappingId:[],
        // twoWayMappingId1:0,
        // twoWayMappingId2:0,

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

      // change(){},

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
      getTXX(){
          
          return http_tjs
          .getDACTXX({archiveNum:this.archiveNum})
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                // this.$message('操作成功');
                this.graphVo=data.data.data;
                this.gxtData=data.data.data;
                //更新人员信息
                this.database=[];
                for (const item of this.gxtData.persons) {
                   this.database.push({
                    value: item.idCard,
                    label: item.name
                  });
                }

                this.drawchart('chart');
                var that = this;
                var resizeTimer = null;
                window.onresize = function () {
                  if (resizeTimer) clearTimeout(resizeTimer);
                  resizeTimer = setTimeout(function () {
                    // that.drawchart('chart');
                      that.chart.resize();
                    
                  }, 1000);
                }



              
            
              }else{
                 this.$message(res.data.msg);
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
      
      //最短路径分析 
      btnGetZDLJ(){
        var _this=this;
           if(this.archiveNum==[]){ this.$message('请先查询选择案件'); return;}

          // if(this.graphVo==null||this.twoWayMappingId1==0||this.twoWayMappingId2==0){ this.$message('请先选中两个节点'); return;}
            if(_this.twoWayMappingId.length!=2){
            _this.$message('请选择两个点');
            return;
          }
           http_tjs
          // .getSDYX({graphVo:JSON.parse(JSON.stringify(this.graphVo)),twoWayMappingId:this.twoWayMappingId})
          // .getSDYX({graphVo:JSON.stringify(JSON.parse(JSON.stringify(this.graphVo))),twoWayMappingId:this.twoWayMappingId})
          .getZDLJ({twoWayMappingId1:this.twoWayMappingId[0],twoWayMappingId2:this.twoWayMappingId[1]})
          
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                // this.$message('操作成功');
                _this.gxtXRJD=data.data.data.persons; //当前查询到需要渲染的节点
                _this.gxtXRLX=data.data.data.lists; //当前查询到需要渲染的连线

                
                // _this.dialogVisible=true;
                // _this.nr='';
                //   for (const i of  _this.gxtXRJD) {
                //       this.nr+="<span >"+i.name+"("+i.idCard+")</span><br/>"
                //   }

                //改变节点状态
                  for (const item of option.series[0].data) {
                     //选中节点不变色 
                    if(item.data.twoWayMappingId==_this.twoWayMappingId[0]||item.data.twoWayMappingId==_this.twoWayMappingId[1]){
                      continue;
                    }
                    for (const i of  _this.gxtXRJD) {
                      if(item.data.idCard==i.idCard){
                        item.itemStyle.color='red'
                      }
                    }

                  }
                  //改变连线状态
                  for (const item of option.series[0].links) {
                    for (const i of  _this.gxtXRLX) {
                      if(item.data.id==i.id){
                        item.lineStyle.color='red'
                      }
                    }

                  }
                 

                this.chart.setOption(option);

              
            
              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})


      },

      btnGetCZ(){

        this.twoWayMappingId=[];
         //改变节点状态
        for (const item of option.series[0].data) {
            item.itemStyle.color='#409EFF' 
        }
        //改变连线状态
        for (const item of option.series[0].links) {
           item.lineStyle.color='#409EFF'

        }
        
        this.chart.setOption(option);

      },
   






     
    },
    created(){
      this.getDA();
    },
    mounted() {
     
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
