<template>
  <div class="test-case-batch">
    <el-dialog
      title="审批"
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
          {{detailDialogValue.checkNum}}
        </el-form-item>

        <el-form-item label="用例变更类型:" prop="changeType">
          <el-select v-model="detailDialogValue.changeType" clearable>
            <el-option
              v-for="item of changeList"
              :label="item.name"
              :key="item.englishName"
              :value="item.englishName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" prop="remarks">
          <el-input
            type="textarea"
            clearable
            v-model="detailDialogValue.remarks"
          />
        </el-form-item>
        <div class="footer">
          <el-form-item>
            <el-button type="primary" @click="handlePass">审批通过</el-button>
            <el-button @click="handleDeny">拒绝审批</el-button>
          </el-form-item>
        </div>
      </el-form>

    </el-dialog>
  </div>
</template>
<script>
import { batchApprovedTestCase, queryTestChangeTypeList } from '@/api/model/testCase'
export default {
  name: 'TestCaseBatchDialog',
  data: () => ({
    detailDialogValue: {
      remarks: '',
      checkNum: 1,
      changeType: 'iteration'
    },
    dialogVisible: false,
    changeList: []
  }),
  async mounted () {
    await this.queryTestChangeTypeList()
  },
  props: {
    multipleSelectTestCase: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleClose (done) {
      this.detailDialogValue.remarks = ''
      this.dialogVisible = false
    },
    async handlePass () {
      const data = {
        idList: this.multipleSelectTestCase,
        approve: 'approved',
        remark: this.detailDialogValue.remarks,
        changeType: this.detailDialogValue.changeType
      }
      await this.batchApproved(data)
      this.$emit('submitForm')
    },
    async handleDeny () {
      const data = {
        idList: this.multipleSelectTestCase,
        approve: 'rejected',
        remark: this.detailDialogValue.remarks
      }
      await this.batchApproved(data)
    },
    async batchApproved (data) {
      batchApprovedTestCase(data).then(res => {
        if (res.success) {
          this.$notify({
            type: 'success',
            message: res.data
          })
        }
        this.$emit('queryTestCaseData')
        this.remarks = ''
        this.dialogVisible = false
      })
    },
    // 测试变更类型
    async queryTestChangeTypeList () {
      const res = await queryTestChangeTypeList()
      this.changeList = res.data
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
