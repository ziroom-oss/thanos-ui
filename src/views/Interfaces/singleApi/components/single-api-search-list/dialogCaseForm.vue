<template>
  <div>
    <el-dialog
      :title="formTitle"
      :visible="caseFormShow"
      width="60%"
      @close="resetInfo"
    >
      <el-form
        label-width="80px"
        v-loading="caseFormLoading"
        element-loading-text="正在拼命保存中"
        size="mini"
        ref="form"
        :rules="rules"
        :model="form"
      >
        <el-form-item label="用例名称:" prop="caseName">
          <el-col :xs="22" :sm="22" :md="22" :lg="22">
            <el-input v-model="form.caseName" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="加密方式:" prop="encryptType">
          <el-select
            v-model="form.encryptType"
            v-bind:disabled="this.isDisabled"
          >
            <el-option label="不加密" value="0"></el-option>
            <el-option label="网关加密" value="1"></el-option>
            <el-option label="服务加密" value="2"></el-option>
            <el-option label="民宿加密" value="3"></el-option>
            <el-option label="自如驿加密" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数详情:" prop="requestParam">
          <el-col :xs="22" :sm="22" :md="22" :lg="22">
            <div class="grid-content">
              <el-input
                class="grid-content"
                type="textarea"
                :autosize="{ minRows: 3 }"
                v-model="form.requestParam"
              >
              </el-input>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item label="Header:" prop="header">
          <el-col :xs="22" :sm="22" :md="22" :lg="22">
            <div class="grid-content">
              <el-input
                class="grid-content"
                type="textarea"
                :autosize="{ minRows: 2 }"
                v-model="form.header"
                v-bind:disabled="this.isDisabled"
              >
              </el-input>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item label="断言:" prop="expectedResults">
          <smart-assert
            ref="editSmartAssert"
            :smart-assert-prop="this.smartAssertProp"
            :assert-list-prop="this.assertListProp"
          >
          </smart-assert>
        </el-form-item>
        <el-form-item label="用例描述:" prop="comment">
          <el-col :xs="22" :sm="22" :md="22" :lg="22">
            <el-input
              v-model="form.comment"
              placeholder="请对用例进行描述"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-show="formTitle === '用例编辑'"
          @click="submitCaseEditInfo(false)"
          >提交修改</el-button
        >
        <el-button
          type="success"
          v-show="formTitle === '用例编辑'"
          @click="directRun()"
          >一键运行</el-button
        >
        <el-button
          type="primary"
          v-show="formTitle === '用例复制'"
          @click="submitCaseCopyInfo()"
          >提交复制</el-button
        >
        <el-button
          type="primary"
          v-show="formTitle === '新增用例'"
          @click="submitAddCase('form')"
          >新增用例</el-button
        >
        <el-button type="info" @click="resetInfo">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  updateSingleApiCase,
  updateCopySingleApiCase,
  updateSingleApiAndCase
} from '@/api/model/singleApiList'
import { saveApi } from '@/api/model/singleApiSave'
import smartAssert from '../smart-assert.vue'
export default {
  name: 'dialogCaseForm',
  components: { smartAssert },
  props: {
    formTitle: {
      type: String,
      default: '默认标题'
    },
    caseFormShow: {
      type: Boolean,
      default: false
    },
    caseRowData: {
      type: Object,
      default () {
        return {}
      }
    },
    caseFormData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    caseFormData (value) {
      console.log(value)
      if (value) {
        this.form = value
      }
    }
  },
  data () {
    const verifyAssert = (rule, value, callback) => {
      if (this.form.assertList.length === 0) {
        callback(new Error('断言不能为空'))
      } else {
        callback()
      }
    }

    return {
      caseFormLoading: false, // 用例loading
      isDisabled: false, // 是否禁用
      form: {
        caseName: '', // 用例名称
        encryptType: '', // 加密方式
        testEnvUrl: '', // 测试域名
        requestParam: '', // 参数详情
        header: '',
        comment: '' // 用例描述
      },
      beforeApiParam: {
        apiType: '',
        encryptType: '',
        isRely: '',
        requestUri: '',
        header: ''
      },
      smartAssertProp: {
        normalShow: true,
        titleHeight: 'height:30px',
        radioMargin: 'margin:10px 10px 10px 10px'
      },
      assertListProp: [],
      rules: {
        assertList: [{ validator: verifyAssert }]
      }
    }
  },
  methods: {
    // 提交编辑数据
    async submitCaseEditInfo (shouldRun) {
      this.getAssertResult()
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const res = await updateSingleApiCase(this.form)
          if (res.success) {
            this.$message.success(res.data)
            this.resetInfo()
            this.$emit('getList')
          }
        }
      })
    },
    directRun () {
      this.submitCaseEditInfo(true)
      this.selectionCaseId = this.caseIdForEdit
    },
    async submitCaseCopyInfo () {
      this.getAssertResult()
      console.log(this.form.originalCaseName)
      if (this.form.originalCaseName === this.form.apiCaseName) {
        this.$message({
          message: '您没有修改用例名称,不能提交修改！',
          type: 'error'
        })
        return false
      }
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          var updateInfo = {
            comment: this.form.comment,
            requestParam: this.form.requestParam,
            expectedResults: this.form.expectedResults,
            caseName: this.form.apiCaseName,
            apiId: this.apiId,
            relyId: this.form.relyApiId,
            relyMqId: this.form.relyMqId,
            relyEsId: this.form.relyEsId,
            preSqlId: this.form.preSqlId,
            postSqlId: this.form.postSqlId,
            assertType: this.form.assertType,
            assertList: this.form.assertList
          }
          updateCopySingleApiCase(updateInfo).then((response) => {
            if (response.success) {
              this.$message({
                message: '复制成功',
                type: 'success'
              })
              this.$emit('closeCaseForm')
              // this.caseFormShow = false
              // this.getList()
            } else {
              this.$message({
                message: response.errorMessage,
                type: 'error'
              })
            }
          })
        }
      })
    },
    // 更新参数信息
    updateSingleApiInfo (params, shouldRun) {
      this.caseFormLoading = true
      updateSingleApiAndCase(params).then((response) => {
        if (response.success) {
          this.caseFormLoading = false
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.$emit('closeCaseForm')
          this.getList()
          if (shouldRun) {
            this.directRunDialogVisible = true
          }
        } else {
          this.caseFormLoading = false
          this.$message({
            message: response.errorMessage,
            type: 'error'
          })
        }
      })
    },
    // 提交新增用例表单
    submitAddCase (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { requestUri } = this.caseRowData
          const param = {
            url: requestUri,
            ...this.caseRowData,
            ...this.form,
            id: 0
          }

          const res = await saveApi(param)
          if (res.success) {
            this.$message.success(res.data)
            this.resetInfo()
            this.$emit('getList')
          }
        }
      })
    },
    resetInfo () {
      this.form.relyApiId = ''
      this.form.relyApiDetail = ''
      this.form.relyMqId = ''
      this.form.relyMqTopic = ''
      this.form.header = ''
      this.requestUri = ''
      this.$refs.form.resetFields()
      this.assertListProp = []
      this.isDisabled = false
      this.$emit('closeCaseForm')
    },
    getAssertResult () {
      this.assertListProp = []
      const tabs = this.$refs.editSmartAssert.editableTabs
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].assertRadio === '1') {
          if (tabs[i].schemaContent instanceof Object) {
            tabs[i].schemaContent = JSON.stringify(tabs[i].schemaContent)
          }
          const verifyData = tabs[i].schemaContent
            .replace(/\r\n/g, '')
            .replace(/\n/g, '')
          const assertType = 1
          this.assertListProp.push({
            id: tabs[i].id,
            assertContent: verifyData,
            assertType: assertType
          })
        } else if (tabs[i].assertRadio === '2') {
          const verifyData = this.getJsonPathAssert(tabs[i])
          const assertType = 2
          this.assertListProp.push({
            id: tabs[i].id,
            assertContent: verifyData,
            assertType: assertType
          })
        } else if (tabs[i].assertRadio === '3') {
          const verifyData = tabs[i].methodContent
          const assertType = 3
          this.assertListProp.push({
            id: tabs[i].id,
            assertContent: verifyData,
            assertType: assertType
          })
        } else {
          const verifyData = tabs[i].normalContent
          const assertType = 0
          this.assertListProp.push({
            id: tabs[i].id,
            assertContent: verifyData,
            assertType: assertType
          })
        }
      }
      this.form.assertList = this.assertListProp
      const ids = this.$refs.editSmartAssert.deleteAssertIds
      this.form.deleteAssertIds = ids.substring(0, ids.length - 1)
    },
    // 判断接口信息是否修改
    isApiParamChanged () {
      return (
        this.beforeApiParam.apiType !== this.form.apiType ||
        this.beforeApiParam.encryptType !== this.form.encryptType ||
        this.beforeApiParam.requestUri !== this.form.requestUri ||
        this.beforeApiParam.isRely !== this.form.isRely.toString() ||
        this.beforeApiParam.header !== this.form.header
      )
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
