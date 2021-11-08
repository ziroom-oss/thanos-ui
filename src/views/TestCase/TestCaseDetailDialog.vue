<template>
  <div class="test-case-batch">
    <el-dialog
      title="测试用例"
      :visible.sync="testCaseDetailDialog"
      :before-close="handleClose"
      width="80%"
      :close-on-click-modal=false
    >
      <el-form
        :model="detailDialogValue"
        ref="detailDialog"
        :rules="TEST_CASE_CONFIG['caseFormRules']"
        label-width="100px"
        class="detail-dialog"
      >
        <div class="library-test-case-editor">
          <div class="edit-library-test-case-big-fields">
            <el-form-item label="用例名称:" prop="casename">
              <el-input
                v-model="detailDialogValue.casename"
                clearable
                @change="checkOnlyCaseName"
              />
            </el-form-item>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="用例等级:" prop="testCaseLevel">
                  <el-select v-model="detailDialogValue.testCaseLevel" clearable>
                    <el-option
                      v-for="item of testLevelList"
                      :label="item.name"
                      :key="item.englishName"
                      :value="item.englishName"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="前置条件:" prop="preCondition">
              <el-input
                type="textarea"
                clearable
                v-model="detailDialogValue.preCondition"
              />
            </el-form-item>
            <el-form-item label="步骤描述:" prop="step">
              <el-input
                type="textarea"
                clearable
                v-model="detailDialogValue.step"
              />
            </el-form-item>
            <el-form-item label="预期结果:" prop="expectedResults">
              <el-input
                type="textarea"
                clearable
                v-model="detailDialogValue.expectedResults"
              />
            </el-form-item>

            <el-form-item label="jira ID:" prop="relationRequirement" >
              <el-input
                type="text"
                v-model="detailDialogValue.relationRequirement"
                clearable
                placeholder="请输入jira ID"
                @blur="validateIssueKey"
              />
            </el-form-item>
          </div>
          <div class="edit-library-test-case-small-fields">
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="所属应用:" prop="belongToSystem">
                  <el-select
                    v-model="detailDialogValue.belongToSystem"
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
                    v-model="detailDialogValue.belongToModule"
                    placeholder="2. 试试搜索: 所属模块"
                    :options="moduleInAppList"
                    filterable></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="用例类型:" prop="type">
                  <el-select
                    v-model="detailDialogValue.type"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item of caseTypeList"
                      :label="item.name"
                      :key="item.englishName"
                      :value="item.englishName"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="所属平台:" prop="belongPlatform">
                  <el-select
                    v-model="detailDialogValue.belongPlatform"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item of belongEndList"
                      :label="item.name"
                      :key="item.englishName"
                      :value="item.englishName"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="footer">
          <el-form-item>
            <el-checkbox v-model="checked" style="margin-right: 10px">保存并添加下一条  </el-checkbox>
            <el-button
              type="primary"
              @click="submitFormAndNext('detailDialog')"
            >保存
            </el-button
            >
            <el-button @click="resetForm('detailDialog')">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import TEST_CASE_CONFIG from '@/config/testCase.config.js'
import {
  checkOnlyCaseName,
  saveTestCase,
  updateTestCase,
  validateIssueKey,
  queryTestCaseTypeList,
  queryTestStrategyTypeList
} from '@/api/model/testCase'
import { moduleTreeMixin } from './mixin/mixin'
import ElementUI from 'element-ui/lib/checkbox'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
Vue.use(ElementUI)
export default {
  name: 'TestCaseDetailDialog',
  mixins: [moduleTreeMixin],
  data () {
    return {
      checked: true,
      testCaseDetailDialog: false,
      detailDialogValue: {
        casename: '',
        version: '',
        testCaseLevel: '',
        preCondition: '',
        step: '',
        expectedResults: '',
        relationRequirement: '',
        createUser: '',
        belongToSystem: 0,
        belongToModule: [],
        belongPlatform: '',
        type: ''
      },
      loading: false,
      belongEndList: [], // 所属平台
      caseTypeList: [], // 测试类型
      TEST_CASE_CONFIG, // 枚举值
      caseType: 'add', // 新增编辑标识
      caseType_delete: 'add'
    }
  },
  props: {
    testLevelList: {
      type: Array,
      required: true
    }
  },
  async created () {
    await this.queryTestCaseTypeList()
    await this.queryTestStrategyTypeList()
  },
  watch: {
    detailDialogValue (val) {
      if (val.belongToSystem) {
        this.queryModuleInAppList(val.belongToSystem)
        this.detailDialogValue.belongToModule = val.moduleTreePath
      }
    }
  },
  methods: {
    handleClose () {
      this.$refs.detailDialog.resetFields()
      this.testCaseDetailDialog = false
    },
    async checkOnlyCaseName (val) {
      // 校验case名称唯一
      const params = { id: this.detailDialogValue.id, casename: val }
      await checkOnlyCaseName(params)
    },
    async validateIssueKey (event) {
      // 校验issueKey名称是否正确
      await validateIssueKey({ issueKey: event.target.value })
    },
    async saveTC (params, formName) {
      saveTestCase(params)
        .then(res => {
          if (res.success) {
            this.$notify({
              type: 'success',
              message: '保存成功'
            })
          }
          this.$emit('queryTestCaseData')
          this.$emit('queryModuleList')

          this.$refs[formName].resetFields()
          this.testCaseDetailDialog = false
        })
    },
    async saveTCDelete (params) {
      saveTestCase(params)
        .then(res => {
          if (res.success) {
            this.$notify({
              type: 'success',
              message: '保存成功'
            })
          }
          this.$emit('queryTestCaseData')
          this.$emit('queryModuleList')
          // this.onAddNewCaseAndSubmit()
          this.testCaseDetailDialog = true
        })
    },
    async updateTC (params, formName) {
      updateTestCase(params)
        .then(res => {
          if (res.success) {
            this.$notify({
              type: 'success',
              message: '保存成功'
            })
          }
          this.$emit('queryTestCaseData')
          this.$emit('queryModuleList')
          this.$refs[formName].resetFields()
          this.testCaseDetailDialog = false
        })
    },
    submitForm_delete () { // 保存不清空
      this.caseType_delete = ''
      this.submitForm('detailDialog')
      this.caseType_delete = 'add'
    },
    // 清空新建左边
    // async onAddNewCaseAndSubmit () {
    //   this.detailDialogValue.casename = ''
    //   this.detailDialogValue.version = ''
    //   this.detailDialogValue.testCaseLevel = ''
    //   this.detailDialogValue.preCondition = ''
    //   this.detailDialogValue.step = ''
    //   this.detailDialogValue.expectedResults = ''
    // },
    submitFormAndNext (formName) {
      if (this.checked) {
        this.submitForm_delete() // 保存不清空
      } else {
        this.submitForm(formName)// 保存清空
      }
    },
    async submitForm (formName) {
      let { belongToModule } = this.detailDialogValue
      belongToModule = belongToModule[belongToModule.length - 1]
      this.detailDialogValue.moduleTreePath = ''
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            ...this.detailDialogValue,
            belongToModule
          }
          if (this.caseType === 'add') {
            if (this.caseType_delete === 'add') {
              this.saveTC(params, formName)
            } else {
              this.saveTCDelete(params)
            }
          } else {
            this.updateTC(params, formName)
          }
        } else {
          this.$notify({
            type: 'error',
            message: '保存失败'
          })
          return false
        }
      })
    },
    async queryTestCaseTypeList () { // 用例类型
      const res = await queryTestCaseTypeList()
      this.caseTypeList = res.data
    },
    async queryTestStrategyTypeList () { // 所属平台
      const res = await queryTestStrategyTypeList()
      this.belongEndList = res.data
    },
    async onSearchApp () {
      await this.queryModuleInAppList(this.detailDialogValue.belongToSystem)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.testCaseDetailDialog = false
    }
  }
}
</script>
<style scoped lang="scss">
.detail-dialog{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.library-test-case-editor{
  min-width: 0;
  white-space: normal;
  display: flex;
}
.edit-library-test-case-big-fields {
  flex: 1 1 auto;
  // overflow: auto;
  border-right: 2px solid #2157FB;
  padding-right: 30px;
}
.edit-library-test-case-small-fields{
  flex: 0 0 auto;
  width: 350px;
  border-left: 1px solid #dedede;
  // overflow: auto;
}
.footer{
  align-self: flex-end;
  margin-top: 30px;
}
</style>
