<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="12" >
          <div class="el-input">
            案件
            <el-select
              style="margin-right: 10px"
              size='350'
              v-model="archiveNum"
              filterable
              remote
              reserve-keyword
              @change="getPersons"
              clearable
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
            来往邮件次数
            <el-input v-model="min" style="width: 60px" size="small" @change="numChange('min')"></el-input> -
            <el-input v-model="max" style="width: 60px" size="small" @change="numChange('max')"></el-input>
          </div>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-button type="primary" icon="plus" @click="search">搜索</el-button>

          <el-button type="primary" icon="plus" @click="reset">重置</el-button>

        </el-col>
      </el-row>


    </h3>
    <el-row slot="body" :gutter="24" style="margin-bottom: 20px;">

      <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
        <el-card class="box-card xqfxleft" v-loading="graphLoading">
          <kr-graph
            ref="graph"
            :graphData="graphData"
            @lineClick="lineClick"
            :maxClickNum="0"
          ></kr-graph>

          <el-table
            :data="tableData"
            border
            style="width: 100%;margin-top: 20px">
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              label="涉案人">
              <template slot-scope="scope">
                {{scope.row.mc?scope.row.mc:scope.row.saryx}}
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="联系人">
              <template slot-scope="scope">
                {{scope.row.lxr?scope.row.lxr:scope.row.lxryx}}
              </template>
            </el-table-column>
            <el-table-column
              prop="yjlx"
              width="80"
              label="邮件类型">
              <template slot-scope="scope">
                {{scope.row.yjlx==1?"发送":"接收"}}
              </template>
            </el-table-column>
            <el-table-column
              prop="yjzt"
              show-overflow-tooltip
              label="邮件主题">
            </el-table-column>
            <el-table-column
              prop="fssj"
              width="180"
              label="发送时间">
            </el-table-column>
            <el-table-column
              width="80"
              label="操作">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="default"
                  icon="edit"
                  @click="handleView(scope.row)">查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="float: right;margin: 10px 0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 50]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>

          <kr-email-detail
            :emailData="emailData"
            :visible.sync="visible">
          </kr-email-detail>
        </el-card>
      </el-col>

      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
        <el-card   class="box-card xqfxleft">
          <div>
            <span style="text-align:center">选择案件涉案人</span>
            <div class='sar'>
              <div>
                <el-checkbox-group v-model="checkList" >
                  <div v-for="(item, i) in sars" :key="i" class='lb'>
                    <el-checkbox  :label='item.idCard'>{{item.name}}</el-checkbox>
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
  import http_da from "@/common/http_da";
  import http from "@/common/http_mailAnalysis";



  export default {
    components: {
      'imp-panel': panel,
    },
    computed: {
      graphData() {
        var accountList=[],relateList=[]
        this.gxtData.persons.map(value=>{
          if(value.name=="null"){
            value.name=value.email
          }
          accountList.push(value)
        })
        this.gxtData.lists.map(value=>{
          let isHave=false
          relateList.map(item=>{
            if(item.target==value.startPerson.id&&item.source==value.endPerson.id){
              isHave=true
              item.label=item.label+value.value5
            }
          })
          if(!isHave){
            relateList.push({
              source:value.startPerson.id,
              target:value.endPerson.id,
              label:value.value5
            })
          }
        })
        return {
          accountList,
          relateList
        }
      },
    },
    data(){
      return {
        sars:[],
        min:"",
        max:"",
        page:1,
        size:10,
        total:0,
        checkList:[],
        archiveNum: "",
        options: [],
        list: [],
        loading: false,
        graphLoading: false,
        visible: false,
        gxtData: {
          persons:[],
          lists:[]
        },
        tableData:[],
        source:"",
        target:"",
        emailData:{}
      }
    },
    methods: {
      getDA(){
        return http_da
          .getDAXX({})
          .then(res => res)
          .then(data => {
            this.list=[]
            if(data.data.code==200) {
              data.data.data.map(item=>{
                this.list.push({
                  value:item.num,
                  label:item.name,
                });
              })
            }else{
              this.$message(data.data.msg);
            }
          })
      },
      getPersons(){
        this.sars=[]
        http.getPersons({archivesNum:this.archiveNum}).then(data => {
          if(data.data.code==200) {
            this.sars=data.data.data
          }else{
            this.$message(data.data.msg);
          }
        })
      },
      lineClick(line){
        this.page=1
        this.size=10
        this.source=line.source.idCard!="null"?line.source.idCard:line.source.email
        this.target=line.target.idCard!="null"?line.target.idCard:line.target.email
        this.tableData=[]
        this.getEmail()
      },
      getEmail(){
        var params={
          archivesNum:this.archiveNum,
          saryx:this.source,
          lxryx:this.target,
          pageSize:this.size,
          pageNumber:this.page,
        }
        http.getMialTables(params).then(data => {
          if(data.data.code==200) {
            this.tableData=data.data.data.rows;
            this.total=data.data.data.total;
          }else{
            this.$message(data.data.msg);
          }
        }).catch(e => { this.graphLoading=false;this.$message('接口操作失败');})
      },
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
      numChange(type){
        var reg = /^(0|[1-9][0-9]*)$/
        if(!this[type]){
          return
        }
        if(!reg.test(this[type])) {
          this.$message({
            type: 'warning',
            message: '请输入大于等于0的正整数'
          });
          this[type]=""
        }else {
          if(type=="min"){
            if(this.max&&parseInt(this.min)>parseInt(this.max)){
              this.$message({
                type: 'warning',
                message: '不能大于右侧数值'
              });
              this[type]=""
            }
          }
          if(type=="max"){
            if(this.min&&parseInt(this.min)>parseInt(this.max)){
              this.$message({
                type: 'warning',
                message: '不能小于左侧数值'
              });
              this[type]=""
            }
          }
        }
      },
      reset(){
        this.min=""
        this.max=""
      },
      search(){
        var params={
          archiveNum:this.archiveNum,
          idCards:this.checkList?this.checkList:[],
          mailNumLowerLimit:parseInt(this.min),
          mailNumUpperLimit:parseInt(this.max),
        }
        if(!this.archiveNum){
          this.$message.warning("请选择案件");
          return
        }
        this.tableData=[]
        this.graphLoading=true;
        http.getMialAnalysis(params).then(data => {
          this.graphLoading=false;
          if(data.data.code==200) {
            this.gxtData=data.data.data;
          }else{
            this.$message(data.data.msg);
          }
        }).catch(e => { this.graphLoading=false;this.$message('接口操作失败');})
      },
      handleSizeChange(val){
        this.size=val
        this.getEmail()
      },
      handleCurrentChange(val){
        this.page=val
        this.getEmail()
      },
      handleView(row){
        this.visible=true
        http.getEmailDetail({
          emailId:row.mailBH,
          caseNumSet:this.archiveNum,
        }).then(data=>{
          if(data.data.code==200) {
            this.emailData=data.data.data._result[0]
          }else{
            this.$message(data.data.msg);
          }
        })
      }
    },
    created(){
      this.getDA()
      this.getEmail()
    }
  }
</script>

<style scoped>


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
  .xqfxleft{
    height: 600px;
    overflow-y: auto;
  }
  .lb{
    margin-top: 10px;
    margin-left: 10px;
  }
</style>
