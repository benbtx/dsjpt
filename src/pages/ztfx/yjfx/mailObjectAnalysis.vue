<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <div style="font-size: 12px">
        案件
        <el-select
          style="margin-right: 10px"
          size='350'
          v-model="archiveNum"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          @change="getPersons"
          :loading="loading">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        时间段
        <el-date-picker
          style="margin-right: 10px;width: 280px"
          v-model="date"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        邮件发送量
        <el-input v-model="send.min" style="width: 60px" size="small" @change="numChange('send','min')"></el-input> -
        <el-input v-model="send.max" style="width: 60px;margin-right: 10px" size="small" @change="numChange('send','max')"></el-input>
        邮件接收量
        <el-input v-model="receive.min" style="width: 60px" size="small" @change="numChange('receive','min')"></el-input> -
        <el-input v-model="receive.max" style="width: 60px;margin-right: 10px" size="small" @change="numChange('receive','max')"></el-input>
        <el-button type="primary" icon="plus" @click="search">搜索</el-button>

        <el-button type="primary" icon="plus" @click="reset">重置</el-button>
      </div>
      <el-row style="width: 100%;">
        <el-col :span="6" >

        </el-col>
        <el-col :span="6" :offset="2">


        </el-col>
      </el-row>


    </h3>
    <el-row slot="body" :gutter="24" style="margin-bottom: 20px;">

      <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
        <el-card class="box-card xqfxleft">


          <el-table
            :data="tableData"
            @sort-change="sortChange"
            border
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="head"
              label="涉案人">
            </el-table-column>
            <el-table-column
              prop="tail"
              label="联系人">
            </el-table-column>
            <el-table-column
              prop="sendNum"
              sortable="custom"
              show-overflow-tooltip
              label="邮件发送量">
            </el-table-column>
            <el-table-column
              prop="receiveNum"
              sortable="custom"
              label="邮件接收量">
            </el-table-column>
          </el-table>
          <el-pagination
            style="float: right;margin:10px 0;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 50]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
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
    data(){
      return {
        archiveNum: "",
        options: [],
        loading: false,
        list: [],
        sars:[],
        send:{
          min:"",
          max:""
        },
        receive:{
          min:"",
          max:""
        },
        checkList:[],
        date:[],
        total:0,
        page:1,
        size:10,
        tableData:[]
      }
    },
    methods: {
      getDA(){
        return http_da
          .getDAXX({})
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
      numChange(type,value){
        var reg = /^(0|[1-9][0-9]*)$/
        if(!this[type][value]){
          return
        }
        if(!reg.test(this[type][value])) {
          this.$message({
            type: 'warning',
            message: '请输入大于等于0的正整数'
          });
          this[type][value]=""
        }else {
          if(value=="min"){
            if(this[type].max&&parseInt(this[type].min)>parseInt(this[type].max)){
              this.$message({
                type: 'warning',
                message: '不能大于右侧数值'
              });
              this[type][value]=""
            }
          }
          if(value=="max"){
            if(this[type].min&&parseInt(this[type].min)>parseInt(this[type].max)){
              this.$message({
                type: 'warning',
                message: '不能小于左侧数值'
              });
              this[type][value]=""
            }
          }
        }
      },
      reset(){
        this.receive.min=""
        this.receive.max=""
        this.send.min=""
        this.send.max=""
        this.date=[]
      },
      search(sort={}){
        var params={
          ...sort,
          archiveNum:this.archiveNum,
          startTime:this.date&&this.date[0]?this.date[0]:"",
          endTime:this.date&&this.date[1]?this.date[1]:"",
          idCards:this.checkList,
          pageNumber:this.page,
          pageSize:this.size,
          receiveNumLowerLimit:this.receive.min,
          receiveNumUpperLimit:this.receive.max,
          sendNumLowerLimit:this.send.min,
          sendNumUpperLimit:this.send.max,
        }
        if(!this.archiveNum){
          this.$message.warning("请选择案件");
          return
        }
        http.getObjectAnalysis(params).then(data => {
          if(data.data.code==200) {
            this.total=data.data.data.total
            this.tableData=data.data.data.rows
          }else{
            this.$message(data.data.msg);
          }
        })
      },
      sortChange({ prop, order }){
        var params={}
        var sort=prop+'Sort'
        if(order=="descending"){
          params[sort]="desc"
        }else if(order=="ascending"){
          params[sort]="asc"
        }
        this.search(params)
      },
      handleSizeChange(val){
        this.size=val
        this.search()
      },
      handleCurrentChange(val){
        this.page=val
        this.search()
      }
    },
    created(){
      this.getDA()
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
    min-height: 500px;
    overflow-y: auto;
  }
  .lb{
    margin-top: 10px;
    margin-left: 10px;
  }

</style>
