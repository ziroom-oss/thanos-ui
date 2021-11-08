<template>
  <div class="test-case-batch">
    <el-dialog
      title="关联bug"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div class="section">
        <span>关联bug号：</span>
        <el-input
          type="text"
          placeholder="请输入jiraID"
          style="width: 160px"
          v-model="relationBug"
          >
        </el-input>
      </div>
      <div class="section">
        <span>运行版本号：</span>
        <el-input
          type="text"
          placeholder="请输入测试执行版本号"
          style="width: 160px"
          v-model="executionVersion"
          >
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleSave">保存</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { queryAssociateJira } from '@/api/model/testExecution'

export default {
  name: 'LinkBugDialog',
  data: () => ({
    dialogVisible: false,
    executionResult: 'fail',
    executionVersion: '',
    relationBug: ''
  }),
  props: {
    taskId: {
      type: String,
      required: true
    },
    caseId: {
      type: Number,
      required: true
    }
  },
  methods: {
    async queryAssociateJira () { // 关联bug
      if (!this.relationBug) {
        this.$notify({
          type: 'error',
          message: '请输入jiraID'
        })
        return
      }
      if (!this.executionVersion) {
        this.$notify({
          type: 'error',
          message: '请输入运行版本号'
        })
        return
      }
      if (!this.caseId) {
        this.$notify({
          type: 'error',
          message: '请输入测试用例'
        })
        return
      }
      const queryData = {
        caseId: this.caseId,
        executionResult: this.executionResult,
        executionVersion: this.executionVersion,
        executionTaskId: this.taskId,
        relationBug: this.relationBug
      }
      await queryAssociateJira(queryData)
      this.$emit('queryTestCaseDataByTaskId')
      this.dialogVisible = false
      this.executionVersion = ''
      this.relationBug = ''
    },
    handleSave () {
      this.queryAssociateJira()
    },
    handleClose (done) {
      this.dialogVisible = false
      this.executionVersion = ''
      this.relationBug = ''
    }
  }
}
</script>
<style scoped lang="scss">
.notes{
  margin-bottom: 10px;
  display: inline-block;
}
.section{
  margin: 15px;
}
</style>
