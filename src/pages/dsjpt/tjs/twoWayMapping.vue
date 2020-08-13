<template>


  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="8">
          <div @keyup.enter="search">
            <el-input placeholder="请输入内容" v-model="keyWord" class="input-with-select" style="width: 500px" >
              <el-select v-model="type" slot="prepend" placeholder="请选择" style="width: 130px">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" icon="plus" @click="search">搜索</el-button>
          <el-button type="primary" icon="plus" @click="openBind">添加映射</el-button>
        </el-col>
      </el-row>
    </h3>
    <div slot="body">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          prop="type"
          label="类型">
          <template slot-scope="scope">
            {{getType(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="value"
          label="值">
        </el-table-column>

      </el-table>
      <el-dialog
        title="添加映射"
        :visible.sync="savedialogVisible"
        width="30%"
      >
        <el-form ref="form" :rules="rules" :model="form" label-width="100px">
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="form.idCard"></el-input>
          </el-form-item>

          <el-form-item label="映射类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择" style="width: 200px">
              <el-option
                v-for="item in typeOptions1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="映射对象" prop="value">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
              <el-button @click="savedialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="submit">确 定</el-button>
            </span>
      </el-dialog>
    </div>
  </imp-panel>
</template>

<script>
  import panel from "@/components/panel.vue";
  import http from "@/common/http_twoWayMapping.js"


  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        keyWord:"",
        type:"0",
        typeOptions:[
          {label:"身份证",value:"0"},
          {label:"电话卡",value:"1"},
          {label:"银行卡",value:"2"},
          {label:"双向映射ID",value:"3"},
        ],
        tableData:[],
        loading:false,
        savedialogVisible:false,
        form:{
          idCard:"",
          type:"",
          value:"",
        },
        rules: {
          idCard: [
            { required: true, message: '请输入身份证', trigger: 'blur' },
          ],
          type: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          value: [
            { required: true, message: '请输入绑定对象', trigger: 'blur' },
          ]
        },
        typeOptions1:[
          {label:"电话卡",value:"1"},
          {label:"银行卡",value:"2"}
        ]
      }
    },
    methods: {
      getType(type){
        let label=""
        this.typeOptions.map(value=>{
          if(value.value==type){
            label=value.label
          }
        })
        return label
      },
      search(){
        if(this.type!=0&&!this.type){
          this.$message("请选择类型");
          return
        }
        if(!this.keyWord||!this.keyWord.trim()){
          this.$message("输入查询的值");
          return
        }
        this.tableData=[]
        this.loading=true
        if(this.type==3){
          this.getByMapId()
        }else {
          this.getByTypeValue()
        }
      },
      getByMapId(){
        http.getByMapId({mapId:this.keyWord.trim()}).then(data=>{
          this.loading=false
          if(data.data.code==200) {
            this.tableData=data.data.data
          }else{
            this.$message(data.data.msg);
          }
        }).catch(e => {  this.loading=false;  this.$message('接口操作失败');})
      },
      getByTypeValue(){
        http.getByTypeValue({type:this.type,value:this.keyWord.trim()}).then(data=>{
          this.loading=false
          if(data.data.code==200) {
            this.tableData=data.data.data
          }else{
            this.$message(data.data.msg);
          }
        }).catch(e => { this.loading=false;  this.$message('接口操作失败');})
      },
      openBind(){
        this.savedialogVisible=true
      },
      submit(){
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.bind()
          } else {
            return false;
          }
        });
      },
      bind(){
        http.bindMapId(this.form).then(data=>{
          this.savedialogVisible=false
          if(data.data.code==200) {
            this.$message.success('绑定成功')
          }else{
            this.$message(data.data.msg);
          }
        }).catch(e => {  this.savedialogVisible=false;  this.$message('接口操作失败');})
      }
    },
    watch:{
      savedialogVisible(){
        setTimeout(()=>{
          this.$refs.form.clearValidate()
        })
        if(!this.savedialogVisible){
          this.form={
            idCard:"",
            type:"",
            value:""
          }
        }
      }
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
