<template>
  <imp-panel :title="form.id !=null? '编辑':'新增数据源'">
    <el-form ref="form" :model="form" label-width="180px">
     

        <el-form-item label="数据源名称">
        <el-input v-model="form.dsName"></el-input>
      </el-form-item>

       <el-form-item label="数据库名称">
        <el-input v-model="form.dbName"></el-input>
      </el-form-item>

        
       <!-- <el-form-item label="词性">
        <el-select ref='cxlb' v-model="valuetypesDescripe"    multiple  collapse-tags placeholder="请选择">
          <el-option
            v-for="item in CXoptions"
            :key="item.value"
            :label="item.descripe"
            :value="item.value"
            >
          </el-option>
        </el-select>
      </el-form-item> -->

       <el-form-item label="类型">
          <!-- <el-input v-model="form.dbType"></el-input> -->
          <el-select ref='cxlb' v-model="form.dbType"    placeholder="请选择">
            <el-option
              v-for="item in LXoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>

      </el-form-item>

      <el-form-item label="数据源类型">
        
          <el-select ref='cxlb' v-model="form.idDsType"    placeholder="请选择">
            <el-option
              v-for="item in SJYLXoptions"
              :key="item.id"
              :label="item.code"
              :value="item.id"
              >
            </el-option>
          </el-select>

      </el-form-item>


     
      <!-- <el-form-item label="连接">
        <el-input v-model="form.dbName"></el-input>
      </el-form-item> -->

       <el-form-item label="用户">
        <el-input v-model="form.username"></el-input>
      </el-form-item>

      <el-form-item label="密码">
        <el-input v-model="form.password" show-password></el-input>
      </el-form-item>

       <el-form-item label="地址">
        <el-input v-model="form.hostName"></el-input>
      </el-form-item>

       <el-form-item label="端口">
        <el-input v-model="form.port"></el-input>
      </el-form-item>

       <el-form-item label="描述">
         <el-input type="textarea" v-model="form.describeInfo"></el-input>
      </el-form-item>

      <!-- <el-form-item label="状态">
        <el-radio-group v-model="form.describeInfo">
          <el-radio label="0">禁用</el-radio>
          <el-radio label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <el-form-item>
        <el-button type="info" @click="onEditSubmit" v-if="form.id">保存</el-button>
        <el-button type="primary" @click="onSubmit" v-else>立即创建</el-button>

         <el-button type="primary" @click="onCancel" >取消</el-button>
      </el-form-item>
    </el-form>
  </imp-panel>
</template>
<script>
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
    import http_sjygl from "../../common/http_sjygl"

  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        form: {
          id: null,
          //ikWord: '',
          // types:'',//英文名
          // typesDescripe: '',//中文名
          // wordFrequency: '',
          // description: '',
          // ikStatus: '0',
          // createTime: '',
          // createUser: 'xxx',

          dbName: "",
          dbType: "",
          describeInfo: "",
          dsName: "",
          hostName: "",
          idDsType: "",
          password: "",
          port : "",
          username: "",

         
     
           idDsTypeName:'',
        },
      
         LXoptions: [{
            value: 'mysql',
            label: 'mysql'
          }, {
            value: 'oracle',
            label: 'oracle'
          }],

          SJYLXoptions: [],
          // {
          //   id: '2',
          //   code: '文件型数据源'
          // }, {
          //   id: '1',
          //   code: '关系型数据源'
          // }, {
          //   id: '5',
          //   code: '关系型数据源5'
          // }

          opt: [{
            id: 2,
            code: '文件型数据源'
          }, {
            id:1,
            code: '关系型数据源'
          }],
          
         
       
          // a:''
      }
    },
    created(){
     
      this.form.id=this.$route.query.id;
      this.getSJYLX();
        this.loadData();
      var _http_sjygl=http_sjygl;
      var _this=this;

      // function(res1,res2){
      //       console.log(res1);
      //       console.log(res2);
      //       console.log(111);
          
      //   }
      



     
     
    },
    computed: {
    // 计算属性的 getter
     
      // valuetypesDescripe:{
      //   get: function () {
      //     if(this.form.typesDescripe==''){
      //       return []
      //     }else{
      //       return this.form.typesDescripe.split(',')
      //     }
      //   },
      //   set: function (value) {
      //       return value;
      //   }
      // }


    },
    methods: {
      getlx(){

      },
      getsj(){

      },

      //获取数据源类型
      getSJYLX(){
          var _this=this;
          let param={pageNumber:1,pageSize:1000};
          http_sjygl
          .getSJYLX(param)
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                  this.SJYLXoptions=data.data.data.rows;
                  // this.form =  data.data.data[0];
                  // this.CXoptions=data.data.data;
                
                  //  this.loadData();
                //  return data.data.data;

                  //  this.opt=data.data.data.rows

                 
                  
                
                
                 
              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})
      },
      onSubmit(){
       

        return http_sjygl
          .addSJY(this.form)
          .then(res => res)
          .then(data => {
             if(data.data.code=='200'){
                this.$message(data.data.msg);
                  // this.$router.push({path: 'sjygl',pageNumber:'',pageSize:''})
                  this.$router.push({path: 'sjygl'})

              }else{
                this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})





      },
      onEditSubmit(){
       
      
          // this.form.types=this.valuetypesDescripe.toString();
          // var labels=[];
          // for (const item of this.$refs.cxlb.selected) {
          //   labels.push(item.label);
          // }
          // this.form.typesDescripe=labels.toString();
         return http_sjygl
          .updateSJYbyID(this.form)
          .then(res => res)
          .then(data => {
              if(data.data.code=='200'){
                this.$message(data.data.msg);
                  this.$router.push({path: 'sjygl'})
              }else{
                this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})

      },
      onCancel(){
            this.$router.push({path: 'sjygl'})
      },
      loadData(){
        var _this=this;
        if (this.$route.query && this.$route.query != null && this.$route.query.id && this.$route.query.id != null) {
          this.form.id = this.$route.query.id;
          

          let param={id:   this.form.id};
           http_sjygl
          .getSJYbyID(param)
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                  _this.form =  data.data.data;
                  // return  data.data.data;
                  
                  // if(_this.form.typesDescripe==''){
                  //   _this.valuetypesDescripe= []
                  // }else{
                  //   _this.valuetypesDescripe= _this.form.types.split(',')
                  // }
                
            
              }else{
                 _this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})

        }
      }
    },
    mounted:function(){
      // Promise.all 

      //   var _http_sjygl=http_sjygl;
      //  var _this=this;
      //  _http_sjygl.axios.all([_this.getSJYLX(), _this.loadData()])
      // .then(_http_sjygl.axios
      // .spread((res1,res2)=>{
      //     console.log(res1);
      //     console.log(res2);
      // }))
      // .catch(error=>{
      //   console.log(error);
      // });

    },
  }
</script>
