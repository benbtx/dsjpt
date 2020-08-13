<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
          <!-- <el-col :span="1" :offset="0"> 类型：</el-col> -->
          <el-col :span="5" :offset="0">
           
            <div class="el-input" style=" float: right;"> 类型：
                    <el-select  size='80'  width='120px'  v-model="lx"  @change='selectChange()' @keyup.enter="btnGetPQ($event)" placeholder="请选择">
                      <el-option
                        v-for="item in database"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
            </div>
          </el-col>


          <!-- <el-col :span="1" :offset="0"> 文件：</el-col> -->
        
          <el-col :span="5" :offset="0">
            <div class="el-input" style=" float: right;">  文件：
                    <el-select    size='80'    v-model="wj"   @keyup.enter="btnGetPQ($event)" placeholder="请选择">
                      <el-option
                        v-for="item in wjdatabase"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>

            </div>
          </el-col>


          <!-- <el-col :span="1" :offset="0"> 网址：</el-col> -->
          
         <el-col :span="5" :offset="0">
          <div  v-show="lx=='html'" class="el-input" style=" float: right;"> 网址：
                  

                     <input type="text" placeholder="网址：" v-model="wz" @keyup.enter="search($event)"
                   class="el-input__inner" style="width:180px">

          </div>
        </el-col>



        
        <el-col :span="9"  :offset="0">

           <el-popover
              placement="top-start"
              title="提示"
              width="200"
              trigger="hover"
              content="类型是网页，文件和网址都有值时，优先爬取文件">
           <el-button  slot="reference" type="primary" icon="plus" @click="btnGetPQ">爬取</el-button>
            </el-popover>


          

            <el-button type="primary" style="margin-right:40px" icon="plus" @click="btnGetBC">保存</el-button>
            


            <el-popover
              placement="top-start"
              title="提示"
              width="200"
              trigger="hover"
              content="输入的网址只能爬取，不能下载">
              <!-- <el-button slot="reference">hover 激活</el-button> -->
               <el-button  slot="reference" ref="btnxz" type="primary" icon="plus"  @click="btnGetXZ">{{btnxzname}}</el-button>
            </el-popover>

            <!-- <el-button ref="btnxz" type="primary" icon="plus"  @click="btnGetXZ">{{btnxzname}}</el-button> -->

            <!-- <el-button ref="btnxz" type="primary" icon="plus"  @click="btnGetSC">上传</el-button> -->
             <el-button size="big" type="primary" @click="btnSetSCWJ">删除</el-button>

            <el-upload style='display: inline-block;'
              class="upload-demo"
              action="#" ref="uploadfilepl" :show-file-list="false" :auto-upload="false"   :on-change='wjchangeUpload'
            >
             
              <!-- <div slot="tip" class="el-upload__tip">请上传excel,doc,html 相关文件</div> -->

              <el-popover
                placement="top-start"
                title="提示"
                width="200"
                trigger="hover"
                content="文件名相同会覆盖掉原来上传的文件">
              
                <!-- <el-button  slot="reference" ref="btnxz" type="primary" icon="plus"  @click="btnGetXZ">{{btnxzname}}</el-button> -->
                 <el-button slot="reference" size="big" type="primary">上传</el-button>
              </el-popover>
              
            </el-upload>

            <!-- <el-upload class="avatar-uploader" action="#" ref="uploadfilepl" :show-file-list="false" :auto-upload="false" :on-change='wjchangeUpload' accept=".xls,.xlsx" drag>
              <div class="avatar-uploader-idiv">
                <i class="avatar-uploader-icon identity-batch"></i>
                <div v-if="plfileUrl" class="avatar-uploader-p" style="font-size:16px">
                  {{plfileUrlname}}
                  <div class="face-modal"></div>
                </div>
                <p v-else>
                  <span style="font-size:16px">上传附件</span>
                </p>
              </div>
              <label class="el-upload-list__item-status-label" v-show="pldeleteshow">
              <span class="re-upload">重新上传</span>
              </label>
            </el-upload> -->




          
        </el-col>
      </el-row>
    </h3>
    <div slot="body">

           

        


          
        
          <el-tag>爬取结果：</el-tag>
          <div style="margin: 20px 0;"></div>

         <pre class='pjg' v-html="pqjg"></pre>
          <!-- <p class='pjg' v-html="pqjg">
             

          </p> -->

          <!-- <el-input class="pjg"
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 10}"
            placeholder="显示结果"
            v-model="pqjg">
          </el-input> -->

           <el-dialog
            title="详情"
            :visible.sync="dialogVisible"
            width="90%"
            :before-close="handleClose">
             <!-- <p v-html="nr"></p> -->
              <el-form ref="form" :model="form" label-width="60px">
                <el-form-item label="名称">
                  <el-input v-model="form.title"></el-input>
                </el-form-item>
              
                <el-form-item label="内容">
                  <el-input type="textarea"  :rows="10" v-model="form.content"></el-input>
                </el-form-item>

               

               

             
            </el-form>


            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
              <el-button type="primary" @click="onEditSubmit">确 定</el-button>
            </span>
          </el-dialog>




    </div>


  </imp-panel>
</template>

<script>
  import panel from "../../../components/panel.vue"
  import * as api from "../../../api"
  import testData from "../../../../static/data/data.json"
  import * as sysApi from '../../../services/sys'

  import http_qwjs from "../../../common/http_qwjs"

  import auth from "../../../common/auth";


  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        //  database: [{
        //   value: '',
        //   label: ''
        // },{
        //   value: '1',
        //   label: 'Excel'
        // }, {
        //   value: '2',
        //   label: 'Word'
        // }, {
        //   value: '3',
        //   label: '网页'
        // }],
         database: [{
          value: 'xls',
          label: 'Excel'
        }, {
          value: 'doc',
          label: 'Word'
        }, {
          value: 'html',
          label: '网页'
        }, {
          value: 'other',
          label: '其他'
        }],
        lx: 'xls',//当前选择的文件类型
        wjdatabase:[],
        wj:'',//文件
        wz:'',//网址
        pqjg:'',//爬取结果
        btnxzname:'下载',
        dialogVisible:false,

         form: {
          title: '',
          content: '',
        },


      
      }
    },
    methods: {
 
      selectChange(){
        // alert(1);
        var _this=this;
        // if(this.lx=='3'){
        //   this.btnxzname='预览'
        // }else{
        //   this.btnxzname='下载'
          
        // }
         _this.wjdatabase=[];
           this.wj='';
        return http_qwjs
          .getSCWJ({fileType:this.lx})
          .then(res => res.data)
          .then(data => {
          //  alert(1)
            _this.wjdatabase.push({value:'',label:''});
          
           for (const item of data.data) {
             _this.wjdatabase.push({value:item,label:item});
           }
          }).catch(action => {
            
        });
      },

      btnGetPQ(target){

          var _this=this;
           if(this.lx==''){ this.$message('请选择文件类型'); return;}
           if(this.lx!='html'&&this.wj==''){ this.$message('请选择文件'); return;}

           if(this.lx=='html'&&this.wj==''&&this.wz==''){ this.$message('请选择文件或输入网址'); return;}

           if(this.lx=='html'&&this.wj==''&&this.wz.indexOf('http')<0){ this.$message('输入网址请加上http://或https:// '); return;}

           return http_qwjs
              .getWJPQ({fileNameOrUrl:this.wj||this.wz})
              .then(res => res)
              .then(data => {
                  if(data.data.code==200)
                  {
                    this.$message(data.data.msg);
                    _this.pqjg=data.data.data
                    _this.form.content=data.data.data
                    

                


                  

                
                  }else{
                    this.$message(data.data.msg);
                  }
              }).catch(e => {  this.$message('接口操作失败');})

          
      },

      btnGetBC(){
         this.dialogVisible=true;
      },

       onEditSubmit(){
      
          return http_qwjs
          .setPCJG({title:this.form.title,content:this.form.content})
          .then(res => res)
          .then(data => {
              if(data.data.code==200){
                // this.$message(data.data.msg);
                 this.$message("保存成功");
                this.dialogVisible=false;
                

              }else{
                 this.$message(data.data.msg);
                this.dialogVisible=false;

              }
          }).catch(e => {  
            this.dialogVisible=false;
            this.$message('接口操作失败');})


      },

      btnGetXZ(){

        var _this=this;
        
        if(this.lx!='html'&&this.wj==''){ this.$message('请选择文件'); return;}

        // if(this.lx=='html'&&this.wj==''&&this.wz==''){ this.$message('请选择文件或输入网址'); return;}
         window.open(http_qwjs.getXZWJ(this.wj||this.wz));

        // return http_qwjs

        //   .getXZWJ({fileName:this.wj})
        //   .then(res => res.data)
        //   .then(data => {
        //   //  alert(1)
          
        //     console.log( data);
        //     window.open( data);
        // // console.log( http_qwjs.getDownLoadExcel());
        // // window.open( http_qwjs.getDownLoadExcel());
        //   }).catch(action => {
            
        // });

        

      },

      btnSetSCWJ(){
          var _this=this;
        
         if(this.lx!='html'&&this.wj==''){ this.$message('请选择文件'); return;}

         

          this.$confirm('将删除该数据, 是否确定?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              

                let param={fileName:this.wj };
                return http_qwjs
                .setSCWJ(param)
                .then(res => res)
                .then(data => {
                    if(data.data.code==200)
                    {
                      this.selectChange();
                      
                  
                    }else{
                      this.$message(data.data.msg);
                    }
                }).catch(e => {  this.$message('接口操作失败');})


            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });





      },


      handleClose(done) {
        this.dialogVisible=false;
      
      },






    
      btnGetPQ2(target){
          var _this=this;
          switch (this.lx) {
           
            case '1':
              return http_qwjs
              .getSpiderExcel({})
              .then(res => res)
              .then(data => {
                  if(data.data.code==200)
                  {
                    // this.$message(data.data.msg);
                    _this.pqjg=data.data.data
                    // _this.pqjg.replace
                     _this.pqjg=auth.myReplace( _this.pqjg,'↵','</br>');

                  

                


                  

                
                  }else{
                    this.$message(data.data.msg);
                  }
              }).catch(e => {  this.$message('接口操作失败');})
              break;
            case '2':
               return http_qwjs
              .getSpiderWord({})
              .then(res => res)
              .then(data => {
                  if(data.data.code==200)
                  {
                    // this.$message(data.data.msg);
                    _this.pqjg=data.data.data
                    

                


                  

                
                  }else{
                    this.$message(data.data.msg);
                  }
              }).catch(e => {  this.$message('接口操作失败');})
              break;

            case '3':
               return http_qwjs
              .getSpiderHtml({})
              .then(res => res)
              .then(data => {
                  if(data.data.code==200)
                  {
                    // this.$message(data.data.msg);
                    _this.pqjg=data.data.data
                    

                


                  

                
                  }else{
                    this.$message(data.data.msg);
                  }
              }).catch(e => {  this.$message('接口操作失败');})
              break;
          }

          
      },

      
    


      btnGetXZ2(){
        var _this=this;
        switch (this.lx) {
          
          case '1':
            // return http_qwjs
            // .getDownLoadExcel({})
            // .then(res => res)
            // .then(data => {
            //     if(data.data.code==200)
            //     {
            //       // this.$message(data.data.msg);
            //       _this.pqjg=data.data.data 
            //     }else{
            //       this.$message(data.data.msg);
            //     }
            // })
            console.log( http_qwjs);

            console.log( http_qwjs.getDownLoadExcel());
          
            window.open( http_qwjs.getDownLoadExcel());
            break;
          case '2':
            // return http_qwjs
            // .getDownLoadWord({})
            // .then(res => res)
            // .then(data => {
            //     if(data.data.code==200)
            //     {
            //       // this.$message(data.data.msg);
            //       _this.pqjg=data.data.data  
            //     }else{
            //       this.$message(data.data.msg);
            //     }
            // })
              console.log( http_qwjs);

            console.log( http_qwjs.getDownLoadWord());

             window.open(http_qwjs.getDownLoadWord());
            break;

          case '3':
            //  return http_qwjs
            // .getHtml({})
            // .then(res => res)
            // .then(data => {
            //     if(data.data.code==200)
            //     {
            //       // this.$message(data.data.msg);
            //       _this.pqjg=data.data.data  
            //     }else{
            //       this.$message(data.data.msg);
            //     }
            // })
             window.open(http_qwjs.getDownLoadHtml());
            break;
        }


      },


      btnGetSC(){

      },

      wjchangeUpload(file) {
        // if (file) {
        //   let Xls = file.name.split('.');
        //   let index = Xls.length - 1;
        //   if (Xls[index] === 'xls' || Xls[index] === 'xlsx') {
        //     this.plfileUrlname = file.name;
        //     this.plfileUrl = file.raw;
        //     this.pldeleteshow =true;
        //   } else {
        //     this.$message.error('上传文件只能是 xls/xlsx 格式!');
        //     return false;
        //   }
        // }

        var formData = new FormData();
        //循环添加到formData中 
        // file.raw
        formData.append('file', file.raw);
        // fileList.forEach(function (file) {
        //     formData.append('file', file, file.name);
        // })

        return http_qwjs
          .uploadFiles(formData)
          .then(res => res.data)
          .then(data => {
            console.log('上传文件成功！');
            this.$message({
              message: '上传成功',
              type: "success"
            });  
              this.selectChange();  
          }).catch(action => {
            
        });


      },
      
      // handleSelectionChange(val){

      // },
      // handleRoleConfig(index, row){
      //   this.currentRow = row;
      //   this.dialogVisible = true;
      //   if (this.roleTree.length <= 0) {
      //     sysApi.roleList({selectChildren:true})
      //       .then(res => {
      //         this.roleTree = res
      //       })
      //   }
      //   this.$http.get(api.SYS_USER_ROLE + "?id=" + row.id)
      //     .then(res => {
      //       this.$refs.roleTree.setCheckedKeys(res.data);
      //     }).catch(err=>{

      //   })
      // },
      // configUserRoles(){
      //   let checkedKeys = this.$refs.roleTree.getCheckedKeys();
      //     this.$http.get(api.SYS_SET_USER_ROLE + "?userId=" + this.currentRow.id + "&roleIds="+checkedKeys.join(','))
      //     .then(res => {
      //         this.$message('修改成功');
      //         this.dialogVisible = false;
      //     })
      // },
      // handleSizeChange(val) {
      //   this.tableData.pagination.pageSize = val;
      //   this.loadData();
      // },
      // handleCurrentChange(val) {
      //   this.tableData.pagination.pageNo = val;
      //   this.loadData();
      // },
      // handleEdit(index, row){
      //   // this.$router.push({path: 'userAdd', query: {id: row.id}})
      //   this.$router.push({path: 'zdwhUpdate', query: {id: row.id}})

      // },
      // handleDelete(index, row){
      //   this.$http.get(api.SYS_USER_DELETE , {id:row.id}).then(res => {
      //     this.loadData();
      //   });
      // },
      // loadData(){
         
      //     return http_qwjs
      //     .getHCGL({})
      //     .then(res => res)
      //     .then(data => {
      //         if(data.data.code==200)
      //         {
      //           // this.$message('操作成功');
                
      //           this.yw=data.data.data._result[0].content


                
            
      //         }else{
      //            this.$message(data.data.msg);
      //         }
      //     })

      //     //getMZL

          
      // }
    },
    created(){
        this.selectChange();
    }
  }
</script>
<style scoped>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
  .pjg{
    border: solid 1px  #eee;
    padding: 10px;
    min-height:280px ;

    max-height:320px ;
    overflow-y: scroll;
    border-radius: 3px;
  }
</style>
