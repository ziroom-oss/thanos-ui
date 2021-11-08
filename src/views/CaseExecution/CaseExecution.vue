<template>
  <div class="case-execution">
    <Search :caseExecutionForm.sync="caseExecutionForm" @onSearch="onSearch"/>
    <el-card shadow="hover">
      <div>
        <!-- <el-button @click="onBatchCheck">
          批量审批
        </el-button> -->
        <el-button @click="addTestTaskDialog" style="margin-right: 10px">
          <i class="el-icon-circle-plus-outline el-icon--right"></i>
          新建测试执行
        </el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="caseExecutionDataSource"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          prop="taskName"
          label="测试执行标题"
          width="200"
        />
        <el-table-column
          prop="templateFlag"
          label="是否模板"
        >
          <template slot-scope="scope">
            {{ scope.row.templateFlag ? '是' : '否' }}
          </template>
        </el-table-column>

        <el-table-column
          prop="testExecutionTypeStr"
          label="测试方法"
        />
        <el-table-column
          prop="statusStr"
          label="状态"
        >
        </el-table-column>
        <el-table-column
          prop="taskTypeStr"
          label="类型"
        >
        </el-table-column>
        <el-table-column
          label="总数/执行数(通过/失败/跳过)"
          width="170"
        >
          <template slot-scope="scope">
            {{ scope.row.testcaseCount || '0' }}/
            {{ scope.row.runCount || '0' }}
            ({{ scope.row.runSuccessCount || '0' }}/
            {{ scope.row.runFailCount || '0' }}/
            {{ scope.row.runSkipCount || '0' }})
          </template>
        </el-table-column>
        <el-table-column
          prop="createUserStr"
          label="创建人"
        />
        <el-table-column
          prop="testTaskMasterStr"
          label="负责人"
        />
        <el-table-column
          prop="testTaskExecutorsStr"
          label="测试执行人"
        />
        <el-table-column
          prop="ehrGroup"
          label="部门"
        />
        <el-table-column
          prop="relationRequirement"
          label="关联需求"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="120"
        />
        <el-table-column
          label="操作"
          fixed="right"
          width="200"
        >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="运行" placement="top-start" v-show=scope.row.runButtonFlag>
              <i class="el-icon-video-play icon" @click="handleAssociateCase(scope.row)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" v-show=scope.row.editButtonFlag>
              <i class="el-icon-edit icon" @click="editTestTaskDialog(scope.row.id)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="测试报告" placement="top-start">
              <i class="el-icon-document-checked icon" @click="TestTaskDialog(scope.row.id)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start" v-show=scope.row.delButtonFlag>
              <i class="el-icon-delete icon" @click="deleteTestTaskDialog(scope.row.id)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="完成" placement="top-start"
                        v-show=scope.row.completeButtonFlag>
              <i class="el-icon-check icon" @click="completeTestTaskDialog(scope.row.id)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="重启" placement="top-start"
                        v-show=scope.row.restartButtonFlag>
              <i class="el-icon-refresh-left icon" @click="restartTestTaskDialog(scope.row.id)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="发送邮件" placement="top-start"
                        v-show=scope.row.restartButtonFlag>
              <i class="el-icon-message icon" @click="openEmailPage(scope.row.id)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="pagination.current"
        :total="pagination.total"
      >
      </el-pagination>
      <div>
        <CaseReport ref="CaseReport" @queryCaseExecution="queryCaseExecution"></CaseReport>
        <SaveOrUpdateTestTaskDialog ref="SaveOrUpdateTestTaskDialog"
                                    @queryCaseExecution="queryCaseExecution"></SaveOrUpdateTestTaskDialog>
      </div>
    </el-card>
  </div>
</template>
<script>
  import {
    batchDeleteTestTask,
    getTaskTestCaseListByTaskId,
    getTestTaskDetailById,
    queryCaseExecution,
    restartTaskStatus
  } from '@/api/model/caseExecution'
  import store from '@/store'

  export default {
    name: 'CaseExecution',
    components: {
      Search: () => import('./CaseExecutionSearch'),
      SaveOrUpdateTestTaskDialog: () => import('./SaveOrUpdateTestTaskDialog'),
      CaseReport: () => import('./CaseReport')
    },
    async mounted() {
      await this.queryCaseExecution()
    },
    data: () => ({
      userName: store.getters.userInfo.userName,
      caseExecutionForm: {},
      multipleSelectValue: [],
      pagination: {
        current: 1,
        size: 10,
        total: 0
      },
      caseExecutionDataSource: []
    }),
    methods: {
      async queryCaseExecution() { // 执行列表数据
        const {ehrTreePath, startTimeVal, endTimeVal, testExecutionType} = this.caseExecutionForm // 查询条件
        const data = {
          searchObj: {
            ...this.caseExecutionForm,
            ehrTreePath: ehrTreePath ? ehrTreePath.toString() : '',
            startTimeVal: startTimeVal ? startTimeVal.toString() : '',
            endTimeVal: endTimeVal ? endTimeVal.toString() : '',
            testExecutionType: testExecutionType || ''
          },
          page: {
            ...this.pagination
          }
        } // 根据接口要求处理请求参数
        const res = await queryCaseExecution(data)
        var respData = res.data
        this.caseExecutionDataSource = respData.records
        this.pagination.total = respData.total
      },
      async handleCurrentChange(val) { // 分页
        this.pagination.current = val
        await this.queryCaseExecution()
      },
      handleSizeChange(val) {
        this.pagination.size = val
        this.queryCaseExecution()
      },
      async onSearch() {
        this.pagination.current = 1
        await this.queryCaseExecution()
      },
      handleAssociateCase(data) { // 运行按钮
        this.$router.push({
          path: '/caseExecutionDetailAndList',
          query: {
            type: 'add',
            taskId: data.id,
            testExecutionType: data.testExecutionType
          }
        })
      },
      async addTestTaskDialog() {
        this.$refs.SaveOrUpdateTestTaskDialog.testTask = {}
        this.$refs.SaveOrUpdateTestTaskDialog.dialogTitle = '新建测试执行任务'
        this.$refs.SaveOrUpdateTestTaskDialog.testTask.testTaskMaster = this.userName
        this.$refs.SaveOrUpdateTestTaskDialog.testTask.testTaskExecutors = this.userName.split(',')
        this.$refs.SaveOrUpdateTestTaskDialog.testTask.testExecutionType = '1'
        await this.$refs.SaveOrUpdateTestTaskDialog.getTestExeMethodMap()
        this.$refs.SaveOrUpdateTestTaskDialog.dialogVisible = true
      },
      async editTestTaskDialog(id) { // 编辑
        await this.$refs.SaveOrUpdateTestTaskDialog.getTestExeMethodMap()
        const res = await getTestTaskDetailById({id: id})
        const respData = res.data
        const deptCodeArr = respData.ehrTreePath ? respData.ehrTreePath.split(',') : ''
        const deptCodeArray = deptCodeArr ? deptCodeArr.splice(0, deptCodeArr.length) : ''
        respData.ehrTreePath = deptCodeArray
        this.$refs.SaveOrUpdateTestTaskDialog.testTask = respData
        this.$refs.SaveOrUpdateTestTaskDialog.testTask.testExecutionType = this.$refs.SaveOrUpdateTestTaskDialog.testTask.testExecutionType.toString()
        this.$refs.SaveOrUpdateTestTaskDialog.testTask.testTaskExecutors = respData.testTaskExecutors && respData.testTaskExecutors.split(',')
        this.$refs.SaveOrUpdateTestTaskDialog.testTask.appId = respData.appId && respData.appId.split(',')
        this.$refs.SaveOrUpdateTestTaskDialog.dialogTitle = '编辑测试执行任务'
        this.$refs.SaveOrUpdateTestTaskDialog.dialogVisible = true
      },
      async openEmailPage(id) {
        this.$refs.CaseReport.CaseReportShow = true
        this.$refs.CaseReport.emailFlag = true
        this.$refs.CaseReport.emailInfo.sender = this.userName
        await this.$refs.CaseReport.CaseReportClick(id)
      },
      async completeTestTaskDialog(id) {
        this.$refs.CaseReport.CaseReportShow = true
        this.$refs.CaseReport.complateFlag = true
        this.$refs.CaseReport.emailInfo.sender = this.userName
        await this.$refs.CaseReport.CaseReportClick(id)
      },
      async TestTaskDialog(id) { // 查看测试报告
        this.$refs.CaseReport.CaseReportShow = true
        this.$refs.CaseReport.emailFlag = false
        await this.$refs.CaseReport.CaseReportClick(id)
      },
      async deleteTestTaskDialog(id) {
        const res = await getTaskTestCaseListByTaskId({taskId: id})
        const result = res.data
        if (result.length <= 0) {
          await this.batchDeleteTestTask('此操作将永久删除测试执行任务, 是否继续?\', \'提示', id)
        } else {
          const deleteMessage = '已关联测试用例总数为：' + result.length + '条确定要删除吗？'
          await this.batchDeleteTestTask(deleteMessage, id)
        }
      },

      async restartTestTaskDialog(id) { // 重启按钮
        const res = await restartTaskStatus({idList: id})
        if (res.success) {
          this.$notify({
            type: 'success',
            message: '重启' + res.message
          })
          await this.queryCaseExecution()
        }
      },
      async batchDeleteTestTask(title, id) {
        await this.$confirm(title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchDeleteTestTask({idList: id}).then((resultData) => {
            this.queryCaseExecution()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      onBatchDelete() {
        // 批量审批 选中用例为空，则提示
        this.multipleSelectValue.length === 0
          ? this.$notify({
            type: 'error',
            title: 'Error',
            message: '先选择需要删除的信息～'
          })
          : this.$confirm('确定删除？', '提示', { // delete
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            let ids = ''
            this.multipleSelectValue.forEach(function (item, index) {
              ids += item.id + ','
            })
            const params = {idList: ids}
            await batchDeleteTestTask(params)
            await this.queryCaseExecution()
          })
      },
      handleSelectionChange(val) {
        this.multipleSelectValue = val
      }

    }
  }
</script>
<style scoped lang="scss">
  .pagination {
    margin: 20px 10px 30px 0px;
    float: right;
  }

  .icon {
    cursor: pointer;
    margin-right: 5px;
    padding: 6px;
    border-radius: 50%;
    color: #fff;
  }

  .el-icon-video-play {
    background: chocolate;
  }

  .el-icon-edit {
    background: #1B58F8;
  }

  .el-icon-document-checked {
    background: darkgreen;
  }

  .el-icon-delete {
    background: #F96C6C;
  }

  .el-icon-check {
    background: #67C23A;
  }

  .el-icon-refresh-left {
    background: #E6A23C;
  }

  .el-icon-link {
    background: #2E2F41;
  }

  .el-icon-message {
    background: grey;
  }

</style>
<style lang="scss">
  .case-execution {
    .el-select, .el-input__inner {
      width: 100%
    }

    .el-cascader, .el-input__inner {
      width: 100%
    }
  }
</style>
