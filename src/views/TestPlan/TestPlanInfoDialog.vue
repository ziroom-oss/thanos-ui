<template>
  <div class="test-plan-info">
    <el-dialog
      title="用例计划详情"
      :visible.sync="testPlanInfoDialog"
      :before-close="handleClose"
    >
      <el-form
        :model="detailDialogValue"
        ref="infoDialog"
        label-width="100px"
        class="detail-dialog"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="计划名称:" >
              <span>{{ detailDialogValue.planName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联需求:">
              <span>{{ detailDialogValue.relationRequirement }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="计划时间起:" >
              <span>{{ detailDialogValue.testPlanStartTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划时间止:">
              <span>{{ detailDialogValue.testPlanEndTime }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="测试策略:" >
              <span>{{ detailDialogValue.testStrategyStr }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测试环境:">
              <span>{{ detailDialogValue.testEnvironmentStr }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="负责人:" >
              <span>{{ detailDialogValue.testPlanMaster }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测试人:">
              <span>{{ detailDialogValue.testPersionList }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="测试风险:" >
              <span>{{ detailDialogValue.testRisk }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测试范围:">
              <span>{{ detailDialogValue.testRange }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="版本:" >
              <span>{{ detailDialogValue.testPlanVersion }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态:">
              <span>{{ detailDialogValue.testPlanStatusStr }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="审核人:" >
              <span>{{ detailDialogValue.approveUser }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核时间:">
              <span>{{ detailDialogValue.approvedTime }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="备注:" >
              <span>{{ detailDialogValue.remark }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span>历史回溯</span>
      <el-table
        ref="multipleTable"
        :data="testPlanHisData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column label="计划名称" prop="planName"  />
        <el-table-column label="关联需求" prop="relationRequirement"/>
        <el-table-column label="测试环境" prop="testEnvironmentStr"/>
        <el-table-column label="测试策略" prop="testStrategyStr"/>
        <el-table-column label="负责人" prop="testPlanMaster" />
        <el-table-column label="计划时间起" prop="testPlanStartTime" />
        <el-table-column label="计划时间止" prop="testPlanEndTime" />
        <el-table-column label="版本" prop="testPlanVersion"/>
        <el-table-column label="状态" prop="testPlanStatusStr" />
      </el-table>

    </el-dialog>
  </div>
</template>
<script>
import {
} from '@/api/model/testPlan'

export default {
  name: 'TestPlanInfoDialog',
  data: () => ({
    testPlanInfoDialog: false,
    detailDialogValue: {
      id: '',
      planName: '',
      relationRequirement: '',
      testEnvironment: '',
      testRange: '',
      testStrategy: '',
      testPlanMaster: '',
      testPlanStartTime: '',
      testPlanEndTime: '',
      testPersionList: '',
      testRisk: '',
      testPlanVersion: '',
      testPlanStatus: '',
      // 备注
      remark: '',
      // 审核人
      approveUser: '',
      // 审核时间
      approvedTime: '',
      // 计划状态：1.待提交 2.待审核 3.审核通过 4.审核拒绝
      testPlanStatusStr: '',
      // 测试策略
      testStrategyStr: '',
      // 测试环境
      testEnvironmentStr: ''
    },
    testPlanHisData: [],
    loading: false
  }),
  computed: {
  },
  async mounted () {
  },
  methods: {
    handleClose () {
      this.testPlanInfoDialog = false
      this.$refs.infoDialog.resetFields()
    }
  }
}
</script>
