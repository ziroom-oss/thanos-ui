<template>
  <div class="test-plan-batch">
    <el-dialog
      title="审批"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span class="notes">待审批数量：</span>{{checkNum}}
      <br/>
      <br/>
      <span class="notes">备注：</span>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="remarks">
      </el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDeny">拒绝审批</el-button>
        <el-button type="primary" @click="handlePass">审批通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { batchApprovedTestPlan } from '@/api/model/testPlan'
export default {
  name: 'TestPlanBatchDialog',
  data: () => ({
    dialogVisible: false,
    remarks: '',
    checkNum: 1
  }),
  props: {
    multipleSelectTestPlan: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleClose (done) {
      this.remarks = ''
      this.dialogVisible = false
    },
    async handlePass () {
      const params = { idList: this.multipleSelectTestPlan.toString(), approve: 3, remark: this.remarks }
      await this.batchApproved(params)
    },
    async handleDeny () {
      const params = { idList: this.multipleSelectTestPlan.toString(), approve: 4, remark: this.remarks }
      await this.batchApproved(params)
    },
    async batchApproved (params) {
      batchApprovedTestPlan(params).then((res) => {
        console.log(res)
        this.$notify({
          type: 'success',
          message: '审核成功'
        })
        this.$emit('queryTestPlanByPage')
      })
      this.remarks = ''
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped lang="scss">
.notes{
  margin-bottom: 10px;
  display: inline-block;
}
</style>
