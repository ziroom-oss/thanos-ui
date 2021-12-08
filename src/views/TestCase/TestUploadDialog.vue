<template>
  <div class="test-case-upload">
    <el-dialog
      title="上传测试用例"
      :visible.sync="testCaseUploadDialog"
      :before-close="handleClose"
      width="50%"
      :close-on-click-modal="false"
      style="margin-top: -50px"
    >
      <el-form :model="testCaseUploadForm" ref="detailDialog"
               label-width="100px" class="detail-dialog" :rules="rules">
        <el-tabs v-model="activeName" @tab-click="handleUploadClick">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="所属应用:" prop="belongToSystem">
                <el-select
                  v-model="testCaseUploadForm.belongToSystem"
                  clearable
                  filterable
                  placeholder="1. 试试选择: 所属应用"
                  @change="onSearchApp"
                >
                  <el-option
                    v-for="item of appList"
                    :label="item.applicationName"
                    :key="item.id"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="所属模块:" prop="belongToModule">
                <el-cascader
                  clearable
                  :show-all-levels="false"
                  :props="{ checkStrictly: true }"
                  v-model="belongToModule"
                  placeholder="2. 试试搜索: 所属模块"
                  :options="moduleInAppList"
                  filterable></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="jira ID" prop="relationRequirement">
                <el-input v-model="testCaseUploadForm.relationRequirement" placeholder="请输入正确的jira ID："
                          @change="validateIssueKey"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-tab-pane label="表格文件（.xlsx）" name="first" ref="xlsx">
            <el-row :gutter="24">
              <el-form-item required>
                <el-upload
                  ref="upload"
                  :data="testCaseUploadForm"
                  :action="actionUrl"
                  :limit="limit"
                  :auto-upload="false"
                  accept=".xls,.xlsx"
                  :before-upload="beforeUpload"
                  :on-change="handleChange"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  :file-list="fileList"
                  :headers="headers"
                  clearFiles
                  style="width: 500px"
                >
                  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                  <el-button type="success" size="small" :loading="buttonLoading" @click="submitForm('detailDialog')"
                             style="margin-left: 10px">上传到服务器
                  </el-button>
                  <el-button @click="resetForm('detailDialog')">取消</el-button>
                </el-upload>
                <el-alert
                  title="错误"
                  type="error"
                  v-show="messageShow"
                  :description="showMessage"
                  show-icon
                  :closable="false"
                  style="margin-left: -50px"
                >
                </el-alert>
              </el-form-item>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="思维导图.xmind" name="second" ref="xmind">
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="所属平台:" prop="belongPlatform">
                  <el-select v-model="testCaseUploadForm.belongPlatform">
                    <el-option v-for="item in applicationTypeList" :label="item.name" :key="item.englishName"
                               :value="item.name"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="用例类型:" prop="type">
                  <el-select v-model="testCaseUploadForm.type">
                    <el-option v-for="item in caseTypeList" :label="item.name" :key="item.englishName"
                               :value="item.englishName"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-form-item required>
                <el-upload
                  ref="upload"
                  :data="testCaseUploadForm"
                  :action="actionUrl"
                  :limit="limit"
                  :auto-upload="false"
                  accept=".xmind"
                  :before-upload="beforeUpload"
                  :on-change="handleChange"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  :file-list="fileList"
                  :headers="headers"
                  style="width: 500px"
                >
                  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                  <el-button type="success" size="small" :loading="buttonLoading" @click="submitForm('detailDialog')"
                             style="margin-left: 10px">上传到服务器
                  </el-button>
                  <el-button @click="resetForm('detailDialog')">取消</el-button>
                  <el-alert
                    title="错误"
                    type="error"
                    :closable="false"
                    v-show="messageShow"
                    :description="showMessage"
                    show-icon
                    style="margin-left: -50px"
                  >
                  </el-alert>
                </el-upload>
              </el-form-item>
              <el-row :gutter="24">
                <el-col :span="24">
                  <div class="edit-img"></div>
                </el-col>
              </el-row>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <el-form-item>
          <!--          <el-button type="primary" @click="submitForm">上传</el-button>-->
          <!--          <el-button @click="resetForm('detailDialog')">取消</el-button>-->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { queryTestCaseTypeList, validateIssueKey } from '@/api/model/testCase'
import TEST_CASE_CONFIG from '@/config/testCase.config.js'
import { moduleTreeMixin } from './mixin/mixin'
import { queryTestApplicationTypeList } from '@/api/model/dataDictionary'
import { getToken, getUserInfo } from '@/utils/auth'
export default {
  name: 'testCaseUploadDialog',
  mixins: [moduleTreeMixin],
  data: () => {
    const userInfo = getUserInfo()
    return {
      secondShow: true,
      TEST_CASE_CONFIG,
      activeName: 'first',
      testCaseUploadDialog: false,
      testCaseUploadForm: {
        belongToSystem: '',
        belongToModule: '',
        relationRequirement: '',
        belongPlatform: '',
        type: '',
        uploadFlag: true
      },
      showMessage: '',
      messageShow: false,
      belongToModule: [],
      applicationTypeList: [],
      loading: true,
      limit: 1, // 上传excell时，同时允许上传的最大数
      fileList: [],
      actionUrl: `${process.env.VUE_APP_BASE_API}/testCase/uploadTestCase`,
      headers: {
        userToken: getToken(),
        userName: userInfo.userName,
      },
      caseTypeList: [],
      rules: {
        belongToSystem: [{ required: true, message: '所属应用不能为空！', trigger: 'blur' }],
        belongToModule: [{ required: true, message: '所属模块不能为空！', trigger: 'blur' }],
        relationRequirement: [{ required: true, message: 'Jira ID 不能为空！', trigger: 'blur' }],
        belongPlatform: [{ required: false, message: '所属平台不能为空！', trigger: 'blur' }],
        type: [{ required: false, message: '用例类型不能为空！', trigger: 'blur' }]
      },
      buttonLoading: false
    }
  },
  watch: {
    activeName: function (val) {
      if (val === 'second') {
        this.rules.belongPlatform[0].required = true
        this.rules.type[0].required = true
      } else {
        this.rules.belongPlatform[0].required = false
        this.rules.type[0].required = false
      }
    },
    testCaseUploadForm (val) {
      if (val.belongToSystem) {
        this.belongToModule = val.moduleTreePath
      }
    }
  },

  mounted () {
    this.getAppList()
    this.queryTestCaseTypeList()
  },
  methods: {
    handleClose (done) {
      this.fileList = []
      this.resetForm('detailDialog')
      this.belongToModule = []
      this.testCaseUploadDialog = false
    },
    async getAppList () {
      const res = await queryTestApplicationTypeList()
      this.applicationTypeList = res.data
    },
    async queryTestCaseTypeList () { // 用例类型
      const res = await queryTestCaseTypeList()
      this.caseTypeList = res.data
    },
    async validateIssueKey (val) {
      // 校验issueKey名称是否正确
      await validateIssueKey({ issueKey: val })
    },
    handleUploadClick () {
      this.fileList = []
    },
    beforeUpload (file) { // 上传前限制大小
      const size = file.size / 1024 / 1024
      if (size > 10) {
        this.$message.warning('文件大小不得超过10M')
      }
    },
    handleChange (file, fileList) {
      if (file.status === 'ready') {
        this.messageShow = false
      }
      if (file) {
        this.fileList = fileList.slice(-3)
      }
    },
    handleRemove () {
      this.fileList = []
    },
    async onSearchApp () {
      await this.queryModuleInAppList(this.testCaseUploadForm.belongToSystem)
    },
    handleSuccess (res, file, fileList) { // 上传成功
      if (res.success) {
        this.messageShow = false
        this.$notify({
          message: res.message,
          type: 'success'
        })
        this.$emit('queryTestCaseData')
        this.fileList = []
        this.belongToModule = []
        this.resetForm('detailDialog')
        this.buttonLoading = false
      } else {
        this.messageShow = true
        this.showMessage = res.message
        this.$refs.upload.clearFiles()
        this.fileList = []
        this.$notify({
          title: 'Error',
          message: res.message,
          type: 'error'
        })
        this.buttonLoading = false
      }
    },
    async submitForm (suForm) {
      this.buttonLoading = true
      this.testCaseUploadForm.belongToModule = this.belongToModule[this.belongToModule.length - 1]
      this.$refs[suForm].validate((valid) => {
        if (valid) {
          this.$confirm('如果存在【名称重复】的用例，是否同意直接覆盖？', '提示', {
            // delete
            confirmButtonText: '同意',
            cancelButtonText: '不同意',
            type: 'warning'
          })
            .then(async () => {
              this.testCaseUploadForm.uploadFlag = false
              this.uploadFile()
            })
            .catch(() => {
              this.testCaseUploadForm.uploadFlag = true
              this.uploadFile()
            })
        } else {
          this.messageShow = true
          this.showMessage = '信息填写错误，请检查输入！'
          this.$notify({
            type: 'error',
            message: this.showMessage
          })
          this.buttonLoading = false
        }
      })
    },
    // 真正的上传文件
    uploadFile () {
      if (this.fileList.length) {
        this.messageShow = false
        this.$refs.upload.submit()
      } else {
        this.messageShow = true
        this.showMessage = '当前没有选择文件，请选择文件！'
        this.$notify({
          type: 'error',
          message: this.showMessage
        })
        this.buttonLoading = false
      }
    },
    resetForm (formName) { // 重置
      this.fileList = []
      this.$refs[formName].resetFields()
      this.testCaseUploadDialog = false
    }
  }
}
</script>
<style scoped>
  .edit-img {
    width: 100%;
    height: 380px;
    background: url('../../assets/img/xmindInfo.png') 50% 100% no-repeat;
    background-size: contain;
  }
</style>
