<template>
  <el-dialog
    v-bind="$attrs"
    :width="width"
    :title="title"
    @close="close">
    <div>
        <div class="title">
          <span style="font-weight: 900">涉案人 : </span>{{emailData.mc?emailData.mc:emailData.saryx}}
        </div>
        <div class="title">
          <span style="font-weight: 900">联系人 : </span>{{emailData.lxr?emailData.lxr:emailData.lxryx}}
        </div>
        <div class="title">
          <span style="font-weight: 900">邮件类型 : </span>{{emailData.yjlx==1?"发送":"接收"}}
        </div>
        <div class="title">
          <span style="font-weight: 900">邮件主题 : </span>{{emailData.yjzt}}
        </div>
        <div class="title">
          <span style="font-weight: 900">发送时间 : </span>{{emailData.fssj}}
        </div>
        <div>
          <span style="font-weight: 900">内容 : </span>
          <div v-html="emailData.yjnr"></div>
        </div>

    </div>
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="close">关 闭</el-button>
  </span>
  </el-dialog>
</template>

<script>
    export default {
      name: "index",
      props: {
        dialogVisible:{
          type: Boolean,
          default:false
        },
        width: {
          type: String,
          default: "60%"
        },
        title: {
          type: String,
          default: "邮件详情"
        },
        emailData:{
          type:Object
        }
      },
      methods:{
        close(){
          this.$emit("update:visible", false)
        }
    }
    }
</script>

<style scoped>
.title{
  height: 30px;
  line-height: 30px;
}
</style>
