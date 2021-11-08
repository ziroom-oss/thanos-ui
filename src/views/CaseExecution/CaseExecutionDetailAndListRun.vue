<template>
  <div class="test-case-batch">
    <el-dialog
      title="测试用例执行"
      :visible.sync="testCaseDetailDialog"
      :before-close="handleClose"
      width="80%"
      custom-class="dialogClass"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="TabsShow" @tab-click="handleClick">
        <el-tab-pane label="用例信息" name="UseCaseMessage">
          <table class="mailTable">
            <tr v-for="(item,index) in dataMap" v-bind:key="index" >
                <td class="column" v-if="index%2 === 0">{{!dataMap[index] ? '' : dataMap[index].name}}</td>
                <td v-if="index%2 === 0"><div v-bind:class="(!item.value ? '' : item.value.length) > 80 ? 'txtB':'txtA'">{{!dataMap[index] ? '' : dataMap[index].value}}</div></td>
                <td class="column" v-if="index%2 === 0">{{!dataMap[index+1] ? '' : dataMap[index+1].name}}</td>
                <td v-if="!apiOrAutomatic && index%2 === 0">{{!dataMap[index+1] ? '' : dataMap[index+1].value}}</td>
                <td v-if="apiOrAutomatic && index%2 === 0"><div v-bind:class="(!dataMap[index+1] || !dataMap[index+1].value ? '':dataMap[index+1].value.length) > 80 ? 'txtB':'txtA'">{{!dataMap[index+1] ? '' : dataMap[index+1].value}}</div></td>
            </tr>
          </table>
        </el-tab-pane>
        <el-tab-pane
          label="执行历史"
          name="ExecutiveHistory"
        >
          <el-table
            :data="ExecutiveHistoryMessage"
            height="365"
            border
            style="width: 100%"
            v-if="!apiOrAutomatic"
          >
            <el-table-column label="执行时间" prop="executionTime"></el-table-column>
            <el-table-column label="执行人" prop="executionUser"></el-table-column>
            <el-table-column label="执行结果" prop="executionResult"></el-table-column>
            <el-table-column label="关联bug" prop="relationBug"></el-table-column>
            <el-table-column label="执行版本号" prop="executionVersion"></el-table-column>
            <el-table-column label="用例版本号" prop="testCaseVesion"></el-table-column>
          </el-table>
          <el-table
            :data="ExecutiveHistoryMessage"
            height="365"
            border
            style="width: 100%"
            v-if="apiOrAutomatic"
          >
            <el-table-column type="expand">
              <template #default="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="用例版本号：">
                    <span>{{ props.row.testCaseVesion }}</span>
                  </el-form-item>
                  <el-form-item label="执行版本号：">
                    <span>{{ props.row.executionVersion }}</span>
                  </el-form-item>
                  <el-form-item label="请求URL：">
                    <span>{{ props.row.url }}</span>
                  </el-form-item>
                  <el-form-item label="关联bug：">
                    <span>{{ props.row.relationBug }}</span>
                  </el-form-item>
                  <el-form-item label="断言：">
                    <vxe-grid
                      border
                      resizable
                      height="96"
                      :tree-config="{lazy: true, children: 'children', hasChild: 'hasChild'}"
                      :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
                      :columns="columnsConfig"
                      :data="JSON.parse(props.row.assertRecordList)"
                      show-overflow="tooltip"
                      show-header-overflow="tooltip"
                    />
                  </el-form-item>
                  <el-form-item label="请求参数Body：">
                    <span>{{ props.row.reqBody }}</span>
                  </el-form-item>
                  <el-form-item label="返回值：">
                    <span>{{ props.row.actualResult }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="请求方式" prop="requestType"></el-table-column>
            <el-table-column label="运行结果" prop="executionResult"></el-table-column>
            <el-table-column label="环境" prop="env"></el-table-column>
            <el-table-column label="响应时间(毫秒)" prop="responseTime"></el-table-column>
            <el-table-column label="执行时间" prop="executionTime"></el-table-column>
            <el-table-column label="执行人" prop="executionUser"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div>
        <span class="RunSpan"></span>
      </div>
      <div style="margin-top: 20px">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form class="detail-dialog" style="margin-top: -2px">
              <el-form-item label="运行版本号:" :required="true">
                <el-input
                  type="text"
                  placeholder="请输入测试版本号"
                  style="width: 130px"
                  size="mini"
                  v-model="detailDialogValue.executionVersion"
                  oninput="if(value.length>50)value=value.slice(0,49)"
                >
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6" v-if="apiOrAutomatic">
            <span>测试环境：</span>
            <el-select
              style="width: 120px"
              size="mini"
              v-model="detailDialogValue.env"
              placeholder="请选择"
            >
              <el-option
                v-for="item in runVersion"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <span>执行结果：</span>
            <el-select
              :disabled="apiOrAutomatic"
              style="width: 120px"
              size="mini"
              v-model="detailDialogValue.executionResult"
              placeholder="请选择"
            >
              <el-option
                v-for="item in PassAndFail"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <span>关联bug号：</span>
            <el-input
              type="text"
              placeholder="请输入jiraID"
              style="width: 140px"
              size="mini"
              v-model="detailDialogValue.relationBug"
              :disabled="BugTrueOrFalse"
              oninput="if(value.length>20)value=value.slice(0,19)"
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span>测试执行备注：</span>
            <el-input
              style="width: 90%;height: 30px;margin-top: -30px"
              type="textarea"
              clearable
              v-model="detailDialogValue.exeRemark"
              oninput="if(value.length>100)value=value.slice(0,99)"
            />
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="runTestCase" :loading="buttonLoading" type="primary">运行</el-button>
        <el-button @click="runTestCaseBug" type="warning" v-if="!saveBugShow&&apiOrAutomatic">保存bug</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TEST_CASE_CONFIG from '@/config/testCase.config.js'
import {
  checkOnlyCaseName,
  queryTestCaseTypeList,
  queryTestStrategyTypeList,
  validateIssueKey
} from '@/api/model/testCase'
import { moduleTreeMixin } from '../TestCase/mixin/mixin'
import { batchExecuteTestCase, getTestExecutionHistory, markTestCaseFail } from '@/api/model/testExecution'

export default {
  name: 'TestCaseDetailDialog',
  mixins: [moduleTreeMixin],
  data () {
    return {
      ExecutiveHistoryMessage: [{
        executionUser: '',
        executionTime: '',
        executionResult: '',
        relationBug: '',
        executionVersion: '',
        testCaseVesion: ''
      }],
      TabsShow: 'UseCaseMessage',
      UseCaseShow: true,
      BugTrueOrFalse: true,
      saveBugShow: false,
      PassAndFail: [{ value: 'pass', label: '通过' }, { value: 'skip', label: '跳过' }, { value: 'fail', label: '失败' }],
      runVersion: [{ value: 'qua', label: 'QA环境' }],
      value: '',
      checked: false,
      testCaseDetailDialog: false,
      caseKeyHistory: '',
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
        type: '',
        belongToModuleStr: '',
        caseKey: '',
        executionVersion: '',
        relationBug: '',
        exeRemark: '',
        executionResult: '',
        env: 'qua'
      },
      loading: false,
      belongEndList: [], // 所属平台（所属端）
      caseTypeList: [], // 测试类型
      TEST_CASE_CONFIG, // 枚举值
      caseType: 'add', // 新增编辑标识
      caseType_delete: 'add',
      dataMap: '',
      buttonLoading: false,
      apiOrAutomatic: true, // 判断人工还是自动
      columns: [],
      columnsConfig: [
        {
          title: 'assertContent',
          field: 'assertContent',
          width: 200
        },
        {
          title: 'assertResult',
          field: 'assertResult',
          width: 200
        },
        {
          field: 'assertType',
          title: 'assertType',
          width: 200,
          formatter: (row, column, cellValue) => {
            return '失败'
          }
        }
      ]
    }
  },
  props: {
    multipleSelectTestCase: {
      type: Array,
      required: true
    },
    taskId: {
      type: String,
      required: true
    },
    testLevelList: {
      type: Array,
      required: true
    },
    caseKey: {
      type: String,
      required: true
    }
  },
  async created () {
    await this.queryTestCaseTypeList()
    await this.queryTestStrategyTypeList()
  },
  watch: {
    // 监控executionResult数据变化，来修改BugTrueOrFalse的数据
    detailDialogValue: {
      handler () {
        if (this.detailDialogValue.executionResult === 'fail') {
          this.BugTrueOrFalse = false
        } else {
          this.BugTrueOrFalse = true
          this.detailDialogValue.relationBug = ''
        }
      },
      deep: true
    }
  },
  methods: {
    handleClick (tab) {
      if (tab.name === 'ExecutiveHistory') {
        this.ExecutiveHistory()
      }
    },
    async ExecutiveHistory () { // 历史
      const queryData = {
        executionTaskId: this.taskId,
        caseKey: this.caseKeyHistory
      }
      const res = await getTestExecutionHistory(queryData)
      const respData = res.data
      this.ExecutiveHistoryMessage = respData
    },
    async runTestCase () { // 运行保存按钮
      this.buttonLoading = true
      if (!this.detailDialogValue.executionVersion) {
        this.$notify({
          type: 'error',
          message: '请输入版本号'
        })
        this.buttonLoading = false
        return
      }
      if (this.multipleSelectTestCase.length === 0) {
        this.$notify({
          type: 'error',
          message: '请选择需要执行的测试用例'
        })
        this.buttonLoading = false
        return
      }
      if (this.BugTrueOrFalse || this.apiOrAutomatic) {
        if (!this.apiOrAutomatic) {
          if (!this.detailDialogValue.executionResult) {
            this.$notify({
              type: 'error',
              message: '请输入测试结果'
            })
            this.buttonLoading = false
            return
          }
        } else {
          if (!this.detailDialogValue.env) {
            this.$notify({
              type: 'error',
              message: '请输入测试环境'
            })
            this.buttonLoading = false
            return
          }
        }
        const queryData = {
          caseKeyList: this.multipleSelectTestCase,
          executionResult: this.detailDialogValue.executionResult,
          executionVersion: this.detailDialogValue.executionVersion,
          exeRemark: this.detailDialogValue.exeRemark,
          executionTaskId: this.taskId,
          env: this.detailDialogValue.env
        }
        const res = await batchExecuteTestCase(queryData)
          .finally(() => {
            this.buttonLoading = false
          })
        if (!res.success) {
          this.buttonLoading = false
          return
        }
        this.$notify({
          type: 'success',
          message: res.message
        })
        this.detailDialogValue.executionResult = ''
        this.detailDialogValue.executionVersion = ''
        this.detailDialogValue.relationBug = ''
        this.detailDialogValue.exeRemark = ''
        this.detailDialogValue.env = ''
        this.testCaseDetailDialog = false
        this.buttonLoading = false
        this.$emit('queryTestCaseDataByTaskId')
      } else {
        await this.runTestCaseBug()
      }
    },
    async runTestCaseBug () { // 保存BUG按钮
      if (!this.detailDialogValue.relationBug) {
        this.$notify({
          type: 'error',
          message: '请输入bug号'
        })
        this.buttonLoading = false
        return
      }
      const queryData = {
        caseKey: this.caseKey,
        executionResult: this.detailDialogValue.executionResult,
        executionVersion: this.detailDialogValue.executionVersion,
        executionTaskId: this.taskId,
        exeRemark: this.detailDialogValue.exeRemark,
        relationBug: this.detailDialogValue.relationBug
      }
      const res = await markTestCaseFail(queryData)
        .finally(() => {
          this.buttonLoading = false
        })
      if (!res.success) {
        this.buttonLoading = false
        return
      }
      this.$notify({
        type: 'success',
        message: res.message
      })
      this.detailDialogValue.executionResult = ''
      this.detailDialogValue.executionVersion = ''
      this.detailDialogValue.relationBug = ''
      this.detailDialogValue.exeRemark = ''
      this.detailDialogValue.env = ''
      this.testCaseDetailDialog = false
      this.buttonLoading = false
      this.$emit('queryTestCaseDataByTaskId')
    },
    handleClose () {
      this.TabsShow = 'UseCaseMessage'
      this.testCaseDetailDialog = false
      this.BugTrueOrFalse = true
      // this.$refs.detailDialog.resetFields()
      this.detailDialogValue.executionResult = ''
      this.detailDialogValue.relationBug = ''
      this.detailDialogValue.exeRemark = ''
      this.detailDialogValue.executionVersion = ''
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
      // this.$refs[formName].resetFields()
      this.testCaseDetailDialog = false
    }
  }
}
</script>
<style scoped lang="scss">
  .detail-dialog {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }

  .library-test-case-editor {
    min-width: 0;
    white-space: normal;
    display: flex;
    margin-top: 10px;
  }

  .edit-library-test-case-big-fields {
    flex: 1 1 auto;
    // \\overflow: auto;
    border-right: 2px solid #2157FB;
    padding-right: 30px;
  }

  .edit-library-test-case-small-fields {
    flex: 0 0 auto;
    width: 350px;
    border-left: 1px solid #dedede;
    // overflow: auto;
  }

  .footer {
    align-self: flex-end;
    margin-top: 30px;
  }

  .RunSpan {
    display: block;
    border-top: #545C64 solid 1px;
    width: 100%;
    margin-top: 10px;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .top {
    margin-bottom: 10px;
  }
</style>
<style lang="scss">
  .dialogClass {
    border-radius: 10px;

    .el-form-item__label {
      // font-size: 20px;
      font-weight: 700;
    }
  }

  .mailTable, .mailTable tr, .mailTable tr td {
    border: 1px solid #E6EAEE;
    width: 100%;
  }

  .mailTable {
    font-size: 16px;
    color: #71787E;
  }

  .mailTable tr td {
    border: 1px solid #E6EAEE;
    width: 150px;
    height: 50px;
    line-height: 35px;
    box-sizing: border-box;
    padding: 0 10px;
  }

  .mailTable tr td.column {
    background-color: #EFF3F6;
    color: #393C3E;
    width: 80px;
  }

  .txtA {
    overflow-y: hidden;
  }

  .txtB {
    overflow-y: scroll;
    height: 100px;
  }
</style>
