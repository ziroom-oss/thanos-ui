<template>
  <div class="test-case-batch">
    <el-dialog
      title="批量执行"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form
        :model="detailDialogValue"
        ref="detailDialog"
        label-width="100px"
        class="detail-dialog"
      >
        <el-form-item label="待审批数量:" prop="checkNum">
          <el-radio v-model="executionResultValue" label="pass">{{apiOrAutomatic ? passTxt : dailyTxt }}</el-radio>
          <el-radio v-model="executionResultValue" label="skip">{{apiOrAutomatic ? skipTxt : qaTxt }}</el-radio>
        </el-form-item>
        <el-form-item label="版本号:" prop="executionVersion">
          <el-input
            type="text"
            placeholder="请输入测试执行版本号"
            style="width: 160px"
            v-model="detailDialogValue.executionVersion"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="exeRemark">
          <el-input
            type="textarea"
            clearable
            v-model="detailDialogValue.exeRemark"
          />
        </el-form-item>
        <div class="footer">
          <el-form-item>
            <el-button @click="batchExecuteTestCase" type="primary">保存</el-button>
            <el-button @click="handleClose">取消</el-button>
          </el-form-item>
        </div>
      </el-form>

    </el-dialog>
  </div>
</template>
<script>
import { batchExecuteTestCase } from '@/api/model/testExecution'

export default {
  name: 'CaseExecutionDialog',
  data: () => ({
    dialogVisible: false,
    detailDialogValue: {
      executionResult: '',
      executionVersion: '',
      exeRemark: '',
      env: ''
    },
    executionResultValue: 'pass',
    passTxt: '通过',
    skipTxt: '跳过',
    dailyTxt: '日常环境',
    qaTxt: 'qa环境',
    apiOrAutomatic: true// 判断人工默认(true)还是自动(false)
  }),
  props: {
    multipleSelectTestCase: {
      type: Array,
      required: true
    },
    taskId: {
      type: String,
      required: true
    }
  },
  methods: {
    async batchExecuteTestCase () {
      if (!this.executionResultValue) {
        this.$notify({
          type: 'error',
          message: '请选择运行结果'
        })
        return
      }
      if (!this.detailDialogValue.executionVersion) {
        this.$notify({
          type: 'error',
          message: '请输入测试执行版本号'
        })
        return
      }
      if (this.multipleSelectTestCase.length === 0) {
        this.$notify({
          type: 'error',
          message: '请选择需要执行的测试用例'
        })
        return
      }
      if (this.apiOrAutomatic) {
        this.detailDialogValue.executionResult = this.executionResultValue
      } else {
        this.detailDialogValue.env = this.executionResultValue === 'pass' ? 'daily' : 'qua'
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
      if (!res.success) {
        return
      }
      this.$notify({
        type: 'success',
        message: res.message
      })
      this.detailDialogValue.executionResult = ''
      this.executionResultValue = 'pass'
      this.detailDialogValue.env = ''
      this.detailDialogValue.executionVersion = ''
      this.detailDialogValue.exeRemark = ''
      this.dialogVisible = false
      this.$emit('queryTestCaseDataByTaskId')
    },
    handleClose (done) {
      this.executionResultValue = 'pass'
      this.detailDialogValue.executionVersion = ''
      this.detailDialogValue.env = ''
      this.detailDialogValue.exeRemark = ''
      this.dialogVisible = false
    },
    handlePass () {
      this.executionResultValue = 'pass'
      this.detailDialogValue.executionVersion = ''
      this.detailDialogValue.env = ''
      this.detailDialogValue.exeRemark = ''
      this.dialogVisible = false
    }
  }
}
</script>
