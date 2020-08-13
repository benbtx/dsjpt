<template>

  <imp-panel>
     
      <h3 class="box-title" slot="header" style="width: 100%;">
        <el-row style="width: 100%;">
          <el-col :span="14" :offset="0">

            <div class="el-input" style=" float: right;">
                案件

                <el-select
                  size='350'
                  v-model="archiveNum"
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
              <el-button type="primary" icon="plus" @click="getTXX">创建图</el-button>

            
              <el-button type="primary" icon="plus" @click="getTXX">更新图</el-button>

              <el-button type="primary" icon="plus" @click="getTCC">存储图</el-button>

              <el-button type="primary" icon="plus"  @click="btnGetTZJZ">图转矩阵</el-button>

               <el-button type="primary" icon="plus"  @click="btnGetJZYS">矩阵压缩</el-button>
          </el-col>
        </el-row>
      </h3>
     
    <div slot="body">
       
          <el-card class="box-card">
            
             <kr-graph :graphData="graphData" :maxClickNum="0" v-loading="graphLoading" ></kr-graph>
           </el-card >

          

           <el-dialog
            title="保存"
            :visible.sync="savedialogVisible"
            width="30%"
           >
            <el-form ref="form" :model="form" label-width="60px">
                <el-form-item label="名称">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
              
                <el-form-item label="描述">
                  <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>

                 <el-form-item label="操作人">
                  <el-input type="textarea" v-model="form.operator"></el-input>
                </el-form-item>

                 <el-form-item label="备注">
                  <el-input type="textarea" v-model="form.remark"></el-input>
                </el-form-item>

            </el-form>
             
            <span slot="footer" class="dialog-footer">
              <el-button @click="savedialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="onEditSubmit">确 定</el-button>
            </span>
          </el-dialog>


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
      graphData() {
        var accountList=this.gxtData.persons,relateList=[]
        this.gxtData.lists.map(value=>{
          relateList.push({
            source:value.startPerson.id,
            target:value.endPerson.id,
            label:value.value0
          })
        })
        return {
          accountList,
          relateList
        }
      },

    },
    data(){
      return {
        nr:'',
        graphVo:null,
        options: [],
        archiveNum: [],
        list: [],
        loading: false,
        graphLoading: false,
        savedialogVisible:false,
        form: {
          id: null,
          name: '',
          description: '',
          operator: '',
          remark: '',

        },
        
        // database: [{
        //   value: '选项1',
        //   label: 'Oracle'
        // }, {
        //   value: '选项2',
        //   label: 'SqlServer'
        // }, {
        //   value: '选项3',
        //   label: 'MySql'
        // }],
        // databasevalue: '选项3',

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
                 this.$message(data.data.msg);
              }
          })


      },
      //根据案件查图信息
      getTXX(){
           if(this.archiveNum==[]){ this.$message('请先查询选择案件'); return;}
           this.graphLoading=true
          return http_tjs
          .getDACTXX({archiveNum:this.archiveNum})
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                this.graphVo=cloneDeep(data.data.data);
                this.gxtData=data.data.data;
              }else{
                 this.$message(data.data.msg);
              }
            this.graphLoading=false;
          }).catch(e => { this.graphLoading=false; this.$message('接口操作失败');})


      },


      onEditSubmit(){
      
          return http_da
          .getTCC({graphSnapshotDto:{graphVo:this.graphVo,name:this.form.name,description:this.form.description,operator:this.form.operator,remark:this.form.remark}})
          .then(res => res)
          .then(data => {
              if(data.data.code==200){
                // this.$message(data.data.msg);
                 this.$message("保存成功");
                this.savedialogVisible=false;
                

              }else{
                 this.$message(data.data.msg);
                this.savedialogVisible=false;

              }
          }).catch(e => {  
            this.savedialogVisible=false;
            this.$message('接口操作失败');})


      },

      //图存储
      getTCC(){
          if(this.graphVo==null){ this.$message('请先创建或更新图信息'); return;}
        this.savedialogVisible=true;

          
      },


     btnGetTZJZ(){
          if(this.graphVo==null){ this.$message('请先创建或更新图信息'); return;}

          return http_tjs
          .getTZJZ({graphVo:this.graphVo})
          .then(res => res)
          .then(data => {
              if(data.data.code==200){
                // this.$message('操作成功');
                this.nr='';
                this.dialogVisible=true;
                for (const item of data.data.data.matrix) {
                  this.nr+=item+"<br>"
                }





              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})
     },

     btnGetJZYS(){
          if(this.graphVo==null){ this.$message('请先创建或更新图信息'); return;}
          return http_tjs
          .getJZYS({graphVo:this.graphVo})
          .then(res => res)
          .then(data => {
              if(data.data.code==200){
                // this.$message('操作成功');
                this.nr='';
                 this.dialogVisible=true;
                  for (const item of data.data.data.matrix) {
                  this.nr+=item+"<br>"
                }




              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})

     },





     
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
  .el-select--350{
    width: 380px;
  }
  
</style>
