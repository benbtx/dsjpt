<template>
  <imp-panel :title="form.id !=null? '编辑':'新增字典'">
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item label="字典">
        <el-input v-model="form.ikWord"></el-input>
      </el-form-item>

       <el-form-item label="词性">
        <!-- <el-input type="textarea" v-model="form.typesDescripe"></el-input> -->
          <!-- :value="{yw:item.value,zw:item.descripe}" -->
        <el-select ref='cxlb' v-model="valuetypesDescripe"    multiple  collapse-tags placeholder="请选择">
          <el-option
            v-for="item in CXoptions"
            :key="item.value"
            :label="item.descripe"
            :value="item.value"
            >
          </el-option>
        </el-select>
      </el-form-item>

       <el-form-item label="词频">
        <el-input type="textarea" v-model="form.wordFrequency"></el-input>
      </el-form-item>

     
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>

      <el-form-item label="状态">
        <el-radio-group v-model="form.ikStatus">
          <el-radio label="0">禁用</el-radio>
          <el-radio label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="info" @click="onEditSubmit" v-if="form.id">保存</el-button>
        <el-button type="primary" @click="onSubmit" v-else>立即创建</el-button>
      </el-form-item>
    </el-form>
  </imp-panel>
</template>
<script>
  import panel from "../../../components/panel.vue"
  import * as api from "../../../api"
    import http_qwjs from "../../../common/http_qwjs"

  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        form: {
          id: null,
          ikWord: '',
          types:'',//英文名
          typesDescripe: '',//中文名
          wordFrequency: '',
          description: '',
          ikStatus: '0',
          createTime: '',
          createUser: 'xxx',

         
     
      
        },
         CXoptions: [{
            value: '选项1',
            descripe: '黄金糕'
          }, {
            value: '选项2',
            descripe: '双皮奶'
          }],
          valuetypesDescripe:[],//英文名
          opt:[{
            value: '选项1',
            descripe: '黄金糕'
          }, {
            value: '选项2',
            descripe: '双皮奶'
          }],
          // a:''
      }
    },
    created(){
     
      this.form.id=this.$route.query.id;
      // this.btnGetCXLB();
      // this.loadData();
      var _http_qwjs=http_qwjs;
      var _this=this;
      



      _http_qwjs.axios.all([this.btnGetCXLB(), this.loadData()]).then(_http_qwjs.axios.spread((response1,response2)=>{
          //  alert(1);

          if(_this.form.typesDescripe==''){
            _this.valuetypesDescripe= []
          }else{
            _this.valuetypesDescripe= _this.form.types.split(',')
            // _this.valuetypesDescripe= ['a','ab']

          }
          _this.CXoptions=_this.opt;


      //上面两个请求都完成后，才执行这个回调方法
      }));;
     
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
      //获取词性列表
      btnGetCXLB(){
          var _this=this;
          let param={status:  1};
          return http_qwjs
          .getCXLB(param)
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                  // this.form =  data.data.data[0];
                  // this.CXoptions=data.data.data;
                  this.opt=data.data.data

                 
                  
                
                
                 
              }else{
                 this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})
      },
      onSubmit(){
        // this.$http.post(api.QWJS_ZWFC_ADD+"?_method=POST", this.form)
        //   .then(res => {
        //     // this.form = res.data.data;
        //     if(res.data.code=='200'){
        //        this.$message(res.data.msg);
        //          this.$router.push({path: 'zdwh'})
        //     }else{
        //        this.$message(res.data.msg);
        //     }
        //     // this.$confirm().then().catch()
        // })


          // let param={value: this.searchKey };
          // this.$refs.cxlb.selected[0].label
          // this.$refs.cxlb.selected[0].value
          this.form.types=this.valuetypesDescripe.toString();
          var labels=[];
          for (const item of this.$refs.cxlb.selected) {
            labels.push(item.label);
          }
          this.form.typesDescripe=labels.toString();

        return http_qwjs
          .getFCXZ(this.form)
          .then(res => res)
          .then(data => {
             if(data.data.code=='200'){
                this.$message(data.data.msg);
                  this.$router.push({path: 'zdwh'})
              }else{
                this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})





      },
      onEditSubmit(){
       
        // this.$http.post(api.QWJS_ZWFC_UPDATE+"?_method=PUT", this.form)
        //   .then(res => {
        //     this.form = res.data;
        //     this.$confirm('修改成功, 是否返回列表?', '提示', {
        //       confirmButtonText: '确定',
        //       cancelButtonText: '取消',
        //       type: 'success'
        //     }).then(() => {
        //       this.$router.push({path: 'zdwh'})
        //   }).catch(e => {
        //     this.$message('操作失败');
        //   })
        // })


        // this.$http.post(api.QWJS_ZWFC_UPDATE+"?_method=PUT", this.form)
        //   .then(res => {
        //     // this.form = res.data.data;
        //     if(res.data.code=='200'){
        //        this.$message(res.data.msg);
        //          this.$router.push({path: 'zdwh'})
        //     }else{
        //        this.$message(res.data.msg);
        //     }
        //     // this.$confirm().then().catch()
        // })


          this.form.types=this.valuetypesDescripe.toString();
          var labels=[];
          for (const item of this.$refs.cxlb.selected) {
            labels.push(item.label);
          }
          this.form.typesDescripe=labels.toString();
         return http_qwjs
          .getFCXG(this.form)
          .then(res => res)
          .then(data => {
              if(data.data.code=='200'){
                this.$message(data.data.msg);
                  this.$router.push({path: 'zdwh'})
              }else{
                this.$message(data.data.msg);
              }
          }).catch(e => {  this.$message('接口操作失败');})

      },
      loadData(){
        var _this=this;
        if (this.$route.query && this.$route.query != null && this.$route.query.id && this.$route.query.id != null) {
          this.form.id = this.$route.query.id;
          // this.$http.get(api.QWJS_ZWFC_GET + "?id=" + this.form.id)
          //   .then(res => {
          //     this.form =  res.data.data[0];
          //   })

          let param={id:   this.form.id};
          return http_qwjs
          .getFCCX(param)
          .then(res => res)
          .then(data => {
              if(data.data.code==200)
              {
                  _this.form =  data.data.data[0];
                  
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
    }
  }
</script>
