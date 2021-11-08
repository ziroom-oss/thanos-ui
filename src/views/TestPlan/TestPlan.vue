<template>
  <div class="test-plan">
    <el-card shadow="hover" class="margin-bottom20">
      <Search
        :testPlanForm.sync="testPlanSearchValue"
        :environmentList.sync="environmentList"
        :strategyList.sync="strategyList"
        :responsiblePersonList.sync="responsiblePersonList"
        @queryTestPlanByPage="queryTestPlanByPage"
      />
    </el-card>
    <el-card shadow="hover">
      <el-button @click="addTestPlan()"> 新建计划 </el-button>
      <el-button @click="onBatchDelete()"> 批量删除 </el-button>
      <el-table
        ref="multipleTable"
        :data="testPlanList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="计划名称" prop="planName"  />
        <el-table-column label="关联需求" prop="relationRequirement"/>
        <el-table-column label="测试环境" prop="testEnvironmentStr"/>
        <el-table-column label="测试策略" prop="testStrategyStr"/>
        <el-table-column label="负责人" prop="testPlanMasterStr" />
        <el-table-column label="计划时间起" prop="testPlanStartTime" />
        <el-table-column label="计划时间止" prop="testPlanEndTime" />
        <el-table-column label="版本" prop="testPlanVersion"/>
        <el-table-column label="状态" prop="testPlanStatusStr" />

        <el-table-column label="操作" prop="id">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="审核" placement="top-start">
              <i class="el-icon-check icon" @click="appTestPlan(scope.row.id)" v-if="scope.row.testPlanStatus==2"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <i class="el-icon-edit icon" @click="editTestPlan(scope.row.id)" v-if="scope.row.testPlanStatus!=2" ></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="详情" placement="top-start">
              <i class="el-icon-info icon" @click="onInfoById(scope.row.id)" ></i>
            </el-tooltip>
           <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <i class="el-icon-delete icon" @click="delTestPlan(scope.row.id)" ></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :current-page="pagination.current"
        :total="pagination.total"
      >
      </el-pagination>
      <div>
        <TestPlanDetailDialog
          ref="detailDialog"
          :environmentList.sync="environmentList"
          :strategyList.sync="strategyList"
          :responsiblePersonList.sync="responsiblePersonList"
          @queryTestPlanByPage="queryTestPlanByPage"
        />
        <TestPlanBatchDialog
          ref="batchDialog"
          :multipleSelectTestPlan.sync="multipleSelectTestPlan"
          @queryTestPlanByPage="queryTestPlanByPage"
        />
        <TestPlanInfoDialog
          ref="infoDialog"
          @queryTestPlanByPage="queryTestPlanByPage"
        />
      </div>
    </el-card>
    </div>
</template>
<script>
import {
  deleteTestPlan,
  findPlanInfoById,
  queryTestPlanByPage,
  queryTestEnvironmentTypeList,
  queryTestStrategyTypeList,
  queryTestPlanHistoryByPlanKey
} from '@/api/model/testPlan.js'

export default {
  name: 'TestPlan',
  components: {
    Search: () => import('./TestPlanSearch'),
    TestPlanDetailDialog: () => import('./TestPlanDetailDialog'),
    TestPlanBatchDialog: () => import('./TestPlanBatchDialog'),
    TestPlanInfoDialog: () => import('./TestPlanInfoDialog')

  },
  async mounted () {
    const data = {
      ...this.testPlanSearchValue
    }
    await this.queryTestPlanByPage(data)
    await this.queryTestEnvironmentTypeList()
    await this.queryTestStrategyTypeList()
  },
  data: () => ({
    testPlanSearchValue: {},
    multipleSelectTestPlan: [],
    testPlanList: [],
    pagination: {
      total: 0,
      current: 1,
      size: 10
    },
    type: 'add',
    environmentList: [],
    strategyList: [],
    environmentMap: new Map(),
    strategyMap: new Map(),
    responsiblePersonList: []
  }),
  methods: {
    async queryTestPlanByPage () {
      // 测试用例列表数据源
      const {
        testPlanStartVal,
        testPlanEndVal
      } = this.testPlanSearchValue
      const queryData = {
        page: {
          ...this.pagination
        },
        searchObj: {
          ...this.testPlanSearchValue,
          testPlanStartVal: testPlanStartVal ? testPlanStartVal.toString() : '',
          testPlanEndVal: testPlanEndVal ? testPlanEndVal.toString() : ''
        }
      }
      // 根据接口要求处理请求参数
      const res = await queryTestPlanByPage(queryData)
      const respData = res.data
      this.testPlanList = respData.records || []
      this.pagination.total = respData.total
    },
    handleSelectionChange (val) {
      this.multipleSelectTestPlan = val
    },
    handleCurrentChange (val) {
      // 分页
      this.pagination.current = val
      this.queryTestPlanByPage(this.testPlanSearchValue)
    },
    handleRowClick (val) {
    },
    addTestPlan () {
      // 新建
      this.$refs.detailDialog.detailDialogValue = {}
      this.$refs.detailDialog.caseType = 'add'
      this.$refs.detailDialog.TestPlanDetailDialog = true
    },
    async editTestPlan (id) {
      // 编辑
      this.$refs.detailDialog.detailDialogValue = {}
      const params = { id: id }
      const res = await findPlanInfoById(params)
      const resData = res.data
      this.$refs.detailDialog.detailDialogValue = resData
      this.$refs.detailDialog.caseType = 'edit'

      this.$refs.detailDialog.TestPlanDetailDialog = true
    },
    delTestPlan (id) {
      // delete
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = { idList: id }
        const res = await deleteTestPlan(params)
        const response = res.data
        this.$notify({
          type: 'success',
          message: response
        })
        await this.queryTestPlanByPage()
      })
    },
    onBatchDelete () {
      // 批量审批 选中用例为空，则提示
      this.multipleSelectTestPlan.length === 0
        ? this.$notify({
          type: 'error',
          title: 'Error',
          message: '先选择需要删除的消息吧～'
        })
        : this.$confirm('确定删除？', '提示', { // delete
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let ids = ''
          this.multipleSelectTestPlan.forEach(function (item, index) {
            ids += item.id + ','
          })
          const params = { idList: ids }
          const res = await deleteTestPlan(params)
          const response = res.data
          this.$notify({
            type: 'success',
            message: response
          })
          await this.queryTestPlanByPage()
        })
    },
    // 测试环境
    async queryTestEnvironmentTypeList () {
      const res = await queryTestEnvironmentTypeList()
      this.environmentList = res.data
    },
    // 测试策略
    async queryTestStrategyTypeList () {
      const res = await queryTestStrategyTypeList()
      this.strategyList = res.data
    },
    // 跳转单个审批
    appTestPlan (id) {
      // 批量审批 选中用例为空，则提示
      this.multipleSelectTestPlan.push(id)
      this.$refs.batchDialog.dialogVisible = true
    },
    // 详情页
    async onInfoById (id) {
      const params = { id: id }
      const res = await findPlanInfoById(params)
      const relospData = res.data
      this.$refs.infoDialog.detailDialogValue = relospData
      // 历史版本回溯
      const testPlanKey = relospData.testPlanKey
      if (testPlanKey) {
        const keys = { planKey: testPlanKey }
        const res = await queryTestPlanHistoryByPlanKey(keys)
        this.$refs.infoDialog.testPlanHisData = res.data
      }
      this.$refs.infoDialog.testPlanInfoDialog = true
    }
  }
}
</script>
<style scoped lang="scss">
.icon {
  margin-right: 10px;
  font-weight: bold;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  color: #fff;
}

.el-icon-check{
  background: #67c23a;
}
.el-icon-info{
  background: #909399;
}
.el-icon-edit {
  background: #1b58f8;
}
.el-icon-delete {
  background: #f76c6c;
}
.pagination {
  margin: 20px 10px 30px 0px;
  float: right;
}
.margin-bottom20{
  margin-bottom: 20px;
}
</style>
<style lang="scss">
  .test-plan {
  .el-select,
  .el-input__inner {
    width: 100%;
  }
  .el-cascader,
  .el-input__inner {
    width: 100%;
  }
  }
</style>
