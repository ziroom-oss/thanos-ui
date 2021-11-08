<template>
  <div>
    <el-dialog
      :visible.sync="sendMailShow"
      :title="title"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        style="margin-left: 20px"
        :rules="rules"
        :model="mailBody"
        ref="mailBody"
      >
        <el-form-item label="发件人：" prop="addresser">
          <el-select
            v-model="mailBody.addresser"
            clearable
            filterable
            remote
            :remote-method="remoteMethod"
            :loading="loading"
            placeholder="发件人"
            style="width: 30%"
          >
            <el-option
              v-for="item of PersonList"
              :label="item.name + '-' + item.adCode"
              :key="item.emplid"
              :value="item.adCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收件人：" prop="addressee">
          <el-select
            v-model="mailBody.addressee"
            clearable
            filterable
            remote
            :remote-method="remoteMethod"
            :loading="loading"
            multiple
            placeholder="收件人"
            style="width: 60%"
          >
            <el-option
              v-for="item of PersonList"
              :label="item.name + '-' + item.adCode"
              :key="item.emplid"
              :value="item.adCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="抄送人：" prop="cc">
          <el-select
            v-model="mailBody.cc"
            clearable
            filterable
            remote
            :remote-method="remoteMethod"
            :loading="loading"
            multiple
            placeholder="收件人"
            style="width: 60%"
          >
            <el-option
              v-for="item of PersonList"
              :label="item.name + '-' + item.adCode"
              :key="item.emplid"
              :value="item.adCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="提测版本：" prop="testVersion">
          <el-input
            placeholder="请输入提测版本"
            style="width: 30%;margin-left: -13px"
            v-model="mailBody.testVersion"
          ></el-input>
        </el-form-item>
        <el-form-item label="测试阶段：" prop="testStage">
          <el-input
            placeholder="请输入测试阶段"
            style="width: 30%;margin-left: -13px"
            v-model="mailBody.testStage"
          ></el-input>
        </el-form-item>
        <el-form-item label="bug地址：" prop="bugUrl">
          <el-input
            placeholder="请输入项目bug地址"
            style="width: 60%;margin-left: -13px"
            v-model="mailBody.bugUrl"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮件内容：" prop="emailRemark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4}"
            placeholder="请输入邮件内容"
            style="width: 60%;margin-left: -13px"
            v-model="mailBody.emailRemark"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-row style="margin-left: 55%">
        <el-button type="success" :loading="buttonLoading" @click="saveMail">保存</el-button>
        <el-button type="viewMail" :loading="buttonLoading" @click="previewMail">邮件预览</el-button>
        <el-button type="primary" :loading="buttonLoading" @click="sendMail">确认发送</el-button>
      </el-row>
    </el-dialog>
    <el-drawer
      title="邮箱预览"
      :visible.sync="preview"
      :with-header="false"
      size="60%"
    >
      <p v-html="htmlMail" style="margin-left: 20px"></p>
    </el-drawer>
  </div>
</template>
<script>
  import {getEhrUserDetailLikeUserName} from '@/api/model/testCase'
  import {emailPreview, saveDailyTestReportEmail, sendDailyTestReportEmail} from '@/api/model/project'

  export default {
    name: 'mailSend',
    props: {},
    data: () => ({
      loading: false,
      title: '日报邮件发送',
      sendMailShow: false,
      mailBody: {
        addresser: '', // 发件人
        addressee: '', // 收件人
        cc: '', // 抄送人
        testVersion: '', // 体测版本
        testStage: '', // 体测阶段
        bugUrl: '', // 项目bug地址
        emailRemark: '', // 邮件备注
        sendGroup: '', // 发送邮箱组地址（格式邮箱地址1,邮箱地址2
        ccGroup: '', // 抄送邮箱组地址（格式邮箱地址1,邮箱地址2）
        id: '',
        delivery: false
      },
      dailyId: '', // 最新日报ID
      topicId: '', // 项目id
      PersonList: [], // 获取所有人
      rules: {
        addresser: [{required: true, message: '请选择发件人', trigger: 'change'}], // 发件人
        addressee: [{required: true, message: '请选择收件人', trigger: 'change'}], // 收件人
        cc: [{required: true, message: '请选择抄送人', trigger: 'change'}], // 抄送人
        testVersion: [{required: true, message: '请输入体测版本', trigger: 'blur'}], // 体测版本
        testStage: [{required: true, message: '请输入测试阶段', trigger: 'blur'}], // 测试阶段
        bugUrl: [{required: true, message: '请输入项目bug地址', trigger: 'blur'}], // 项目bug地址
        emailRemark: [{required: true, message: '请输入邮件内容', trigger: 'blur'}] // 邮件备注
      },
      htmlMail: '',
      preview: false,
      showPreview: '',
      buttonLoading: false
    }),
    methods: {
      // 保存按钮事件
      saveMail() {
        this.$refs.mailBody.validate((valid) => {
          if (valid) {
            this.buttonLoading = true
            this.saveMailDate()
          } else {
            this.$message({
              type: 'error',
              message: '保存失败，请填写必填项！'
            })
          }
        })
      },
      saveMailDate() {
        this.mailBody.addressee = this.mailBody.addressee.toString()
        this.mailBody.cc = this.mailBody.cc.toString()
        const mailBody = this.mailBody
        this.saveDailyTestReportEmail(mailBody)
          .finally(() => {
            this.buttonLoading = false
          })
        this.mailBody.addressee = this.mailBody.addressee.split(',')
        this.mailBody.cc = this.mailBody.cc.split(',')
        this.sendMailShow = false
        this.buttonLoading = false
      },
      // 保存邮箱到后台
      async saveDailyTestReportEmail(data) {
        await saveDailyTestReportEmail(data).then(
          this.$message({
            type: 'success',
            message: '保存成功！'
          })
        )
      },
      // 邮箱发送接口
      async sendMail() {
        this.buttonLoading = true
        const data = {
          dailyId: this.mailBody.id
        }
        this.saveMail()
        await sendDailyTestReportEmail(data)
          .then(
            res => {
              this.$notify({
                type: 'success',
                message: '发送' + res.data
              })
              this.sendMailShow = false
            }
          )
          .catch(
            res => {
              this.$notify({
                type: 'error',
                message: res.data
              })
            }
          )
          .finally(() => {
            this.buttonLoading = false
          })
      },
      // 邮件预览
      async previewMail() {
        this.buttonLoding = true
        const data = {
          dailyId: this.mailBody.id
        }
        this.saveMail()
        this.sendMailShow = true
        await emailPreview(data)
          .then(
            res => {
              if (res.success) {
                this.$notify({
                  type: 'success',
                  message: '预览成功！'
                })
                this.htmlMail = res.data
                this.preview = true
              }
            }
          )
          .finally(() => {
            this.buttonLoding = false
          })
      },
      // 获取用户名单
      async getEhrUserDetailLikeUserName(userName) {
        const params = {
          userName: userName
        }
        const res = await getEhrUserDetailLikeUserName(params)
        this.PersonList = res.data
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.getEhrUserDetailLikeUserName(query)
          }, 200)
        } else {
          this.options = []
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "./project-style/project.scss";

  .el-button--viewMail {
    background: #23C6C8;
    border-color: #8cd8da;
    color: #FFF;

    &:hover {
      background: #8cd8da;
      color: #FFF;
    }
  }

  .el-drawer.rtl {
    overflow-y: scroll;
  }
</style>
