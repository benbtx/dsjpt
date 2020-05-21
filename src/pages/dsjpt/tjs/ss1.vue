<template>

  <imp-panel>
     
      <h3 class="box-title" slot="header" style="width: 100%;">
        <el-row style="width: 100%;">
          <el-col :span="10" :offset="0">
            <!-- <div class="el-input" style=" float: right;">
              姓名：
              <input type="text" placeholder="输入用户名称" v-model="searchKey" @keyup.enter="search($event)"
                    class="el-input__inner" style="width:150px">
            </div> -->
            <div class="el-input" style=" float: right;">
                案件
                <el-select v-model="databasevalue" placeholder="请选择">
                  <el-option
                    v-for="item in database"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>

            </div>
            
          </el-col>
          
          <el-col :span="14">
              <el-button type="primary" icon="plus">搜索</el-button>

              <!-- <router-link :to="{ path: 'hmdAdd'}">
                <el-button type="primary" icon="plus">更新</el-button>
              </router-link> -->
            
              <el-button type="primary" icon="plus">深度优先遍历</el-button>
              <el-button type="primary" icon="plus">广度优先遍历</el-button>
          </el-col>
        </el-row>
      </h3>
     
    <div slot="body">
       
          <el-card class="box-card">
            
             <div id="chart"></div>
           </el-card >

       
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

 const option = {
    title: {
        text: ''
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    label: {
        normal: {
            show: true,
            textStyle: {
                fontSize: 12
            },
        }
    },
    legend: {
        x: "center",
        show: false,
        data: ["夫妻", "战友", '亲戚']
    },
    series: [

        {
            type: 'graph',
            layout: 'force',
            symbolSize: 45,
            focusNodeAdjacency: false,
            roam: true,
            categories: [{
                name: '夫妻',
                itemStyle: {
                    normal: {
                        color: "#009800",
                    }
                }
            }, {
                name: '战友',
                itemStyle: {
                    normal: {
                        color: "#4592FF",
                    }
                }
            }, {
                name: '亲戚',
                itemStyle: {
                    normal: {
                        color: "#3592F",
                    }
                }
            }],
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        fontSize: 12
                    },
                }
            },
            force: {
                repulsion: 1000
            },
            edgeSymbolSize: [4, 50],
            edgeLabel: {
                normal: {
                    show: true,
                    textStyle: {
                        fontSize: 10
                    },
                    formatter: "{c}"
                }
            },
            data: [{
                name: '徐贱云',
                draggable: true,
            }, {
                name: '冯可梁',
                category: 1,
                draggable: true,
            }, {
                name: '邓志荣',
                category: 1,
                draggable: true,
            }, {
                name: '李荣庆',
                category: 1,
                draggable: true,
            }, {
                name: '郑志勇',
                category: 1,
                draggable: true,
            }, {
                name: '赵英杰',
                category: 1,
                draggable: true,
            }, {
                name: '王承军',
                category: 1,
                draggable: true,
            }, {
                name: '陈卫东',
                category: 1,
                draggable: true,
            }, {
                name: '邹劲松',
                category: 1,
                draggable: true,
            }, {
                name: '赵成',
                category: 1,
                draggable: true,
            }, {
                name: '陈现忠',
                category: 1,
                draggable: true,
            }, {
                name: '陶泳',
                category: 1,
                draggable: true,
            }, {
                name: '王德福',
                category: 1,
                draggable: true,
            }],
            links: [{
                source: 0,
                target: 1,
                category: 0,
                value: '夫妻'
            }, {
                source: 0,
                target: 2,
                value: '子女'
            }, {
                source: 0,
                target: 3,
                value: '夫妻'
            }, {
                source: 0,
                target: 4,
                value: '父母'
            }, {
                source: 1,
                target: 2,
                value: '表亲'
            }, {
                source: 0,
                target: 5,
                value: '朋友'
            }, {
                source: 4,
                target: 5,
                value: '朋友'
            }, {
                source: 2,
                target: 8,
                value: '叔叔'
            }, {
                source: 0,
                target: 12,
                value: '朋友'
            }, {
                source: 6,
                target: 11,
                value: '爱人'
            }, {
                source: 6,
                target: 3,
                value: '朋友'
            }, {
                source: 7,
                target: 5,
                value: '朋友'
            }, {
                source: 9,
                target: 10,
                value: '朋友'
            }, {
                source: 3,
                target: 10,
                value: '朋友'
            }, {
                source: 2,
                target: 11,
                value: '同学'
            }],
            lineStyle: {
                normal: {
                    opacity: 0.9,
                    width: 1,
                    curveness: 0
                }
            }
        }
    ]
  };
  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        database: [{
          value: '选项1',
          label: 'Oracle'
        }, {
          value: '选项2',
          label: 'SqlServer'
        }, {
          value: '选项3',
          label: 'MySql'
        }],
        databasevalue: '选项3',

        gxt:{
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
              "value": 10,
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
              "value": 113,
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
              "value": 10,
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
      drawchart(id) {
        let o = document.getElementById(id);
        if(o==null){
          return;
        }
        let height = document.documentElement.clientHeight;
        height -= 120;
        o.style.height= height+"px";
        this.chart = echarts.init(o,'macarons');
        this.chart.setOption(option);
         this.chart.resize();
      },
     
    },
    created(){
     
    },
    mounted() {
      this.$nextTick(function () {
        this.drawchart('chart');
        var that = this;
        var resizeTimer = null;
        window.onresize = function () {
          if (resizeTimer) clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function () {
            that.drawchart('chart');
          }, 1000);
        }
      });
    },
    destroyed() {
        window.onresize=null;
      // document.removeEventListener('click', this.autoHide, false)
    }
  }
</script>
<style>
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
  
</style>
