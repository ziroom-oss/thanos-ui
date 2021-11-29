<template>
  <div class="case-detail">
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="margin-bottom: 10px"
    >
      <el-breadcrumb-item :to="{ path: 'caseExecution' }">测试执行</el-breadcrumb-item>
      <el-breadcrumb-item>{{ this.testExecutionType === "1" ? "手动测试执行" : "自动测试执行" }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <span class="testTitle">{{
          this.testExecutionType === "1" ? "手动测试" : "自动测试"
        }}</span>
      <AddNewCaeList
        :type="$route.query.type"
        ref="addNewCaseList"
        :testLevelList.sync="testLevelList"
        :testCaseForm.sync="testCaseSearchValue"
        @queryTestCaseDataFind="queryTestCaseDataFind"
      />
      <div>
        <el-tooltip content="点击查看测试报告" placement="top-start">
          <el-card
            shadow="always"
            class="ding"
            style="margin-bottom: 10px;margin-top:-10px;width: 340px;border-radius: 4px;"
            @click.native="TestTaskDialog()">
            <div class="case-total">
              <span class="title" style="color: #409EFF">执行名称：{{ summaryCount.taskName }}</span>
            </div>
            <div class="case-total">
              <span class="title" style="color: #409EFF">执行状态：{{ summaryCount.taskStatusStr }}</span>
            </div>
            <div class="case-total">
              <span class="title" style="color: #409EFF">需求：{{ summaryCount.requirementSummary }}</span>
            </div>
            <div class="case-total">
              <span class="title"
                    style="color: #409EFF">{{ this.executionResultList.pass }}：{{ summaryCount.runSuccessCount }}</span>
              <span class="title"
                    style="color: #409EFF">{{ this.executionResultList.fail }}：{{ summaryCount.runFailCount }}</span>
              <span class="title"
                    style="color: #409EFF">{{ this.executionResultList.skip }}：{{ summaryCount.runSkipCount }}</span>
              <span class="title"
                    style="color: #409EFF">{{ this.executionResultList.notStarted }}：{{
                  summaryCount.notRunCount
                }}</span>
            </div>
          </el-card>
        </el-tooltip>
        <el-button
          class="case-button-find"
          @click="handleCaseSearch"
          type="primary"
        >去关联测试用例
        </el-button
        >
        <el-tooltip
          class="case-button-find"
          effect="dark"
          content="完成"
          placement="top-start"
        >
          <el-button type="primary" @click="completeTestTaskDialog"
                     v-if="summaryCount.comButtonFlag"
          >完成
          </el-button
          >
        </el-tooltip>
      </div>
      <div>
        <el-button plain type="primary" @click="onBatchCheck"
        >批量执行
        </el-button
        >
        <el-button plain type="primary" @click="handleBatchDelete"
        >批量删除
        </el-button
        >
      </div>
      <el-table
        :data="this.testExecutionType === '1' ? selectedCaseList : apiCaseList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="casename" label="用例名称" width="260"/>
        <el-table-column prop="createUser" label="创建人"/>
        <el-table-column prop="executionUser" label="最后执行人">
        </el-table-column>
        <el-table-column prop="executionResult" label="最后执行结果">
          <template slot-scope="scope">
            {{ scope.row.executionResult }}
          </template>
        </el-table-column>
        <!--        <el-table-column prop="testCaseLevel" label="用例等级">-->
        <!--        </el-table-column>-->
        <el-table-column prop="relationBug" label="最后关联BUG">]
          <template slot-scope="scope">
            <a :href="scope.row.relationBugUrl" target="_blank" class="buttonText">{{ scope.row.relationBug }}</a>
          </template>
        </el-table-column>

        <el-table-column prop="executionVersion" label="最后关联版本"/>
        <el-table-column prop="executionTime" label="执行时间"/>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="运行"
              placement="top-start"
            >
              <i
                class="el-icon-video-play icon"
                @click="handleExecution(scope.row)"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top-start"
            >
              <i
                class="el-icon-delete icon"
                @click="handleDelete(scope.row.id)"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="生成BUG"
              placement="top-start"
            >
              <i
                class="el-icon-s-promotion icon"
                @click="openBugPage(scope.row.caseKey)"
              ></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pagination.current"
        :total="pagination.total"
      >
      </el-pagination>
    </el-card>
    <div>
      <CaseReport ref="CaseReport"/>
      <testAssociation
        ref="testAssociation"
        v-model="addNewCase.taskTestCaseList"
        @handleSubmit="handleSubmit"
      />
      <CaseExecutionDialog
        ref="batchDialog"
        @queryTestCaseDataByTaskId="queryTestCaseData"
        :multipleSelectTestCase.sync="multipleSelectTestCase"
        :taskId="$route.query.taskId"
      />
      <CaseExecutionDetailAndListRun
        ref="detailDialog"
        :testLevelList.sync="testLevelList"
        @queryTestCaseDataByTaskId="queryTestCaseData"
        :multipleSelectTestCase.sync="multipleSelectTestCase"
        :taskId="$route.query.taskId"
        :caseKey="caseKey"
      />
      <BugInfoDialog
        ref="bugInfoDialog"
        @queryTestCaseDataByTaskId="queryTestCaseData"
        :taskId="$route.query.taskId"
      />
    </div>
  </div>
</template>
<script>
import { deleteCase, saveTestCaseWithExecution } from '@/api/model/caseExecution.js'
// 合并之后的接口queryTestCaseDataByTaskId,
import { getCaseDetailById, getCaseStatusNumber, queryRelTestCaseByPage } from '@/api/model/testExecution'
import store from '@/store'

export default {
  name: 'CaseExecutionDetail',
  data () {
    return {
      userName: store.getters.userInfo.userName,
      testCaseSearchValue: {},
      testExecutionType: this.$route.query.testExecutionType, // 测试类型1为手动测试，2为自动测试
      dialogVisible: false,
      addNewCase: {
        taskTestCaseList: []
      },
      caseExecutionForm: {},
      caseList: [],
      caseListDataSource: [],
      selectedCaseList: [], // 手动测试查询列表
      apiCaseList: [], // 自动测试查询列表
      testLevelList: [],
      pagination: {
        total: 0,
        current: 1,
        size: 10
      },
      summaryCount: {
        runSuccessCount: 0,
        runFailCount: 0,
        runCount: 0,
        notRunCount: 0,
        runSkipCount: 0,
        requirementSummary: '',
        taskStatusStr: '',
        taskName: '',
        comButtonFlag: false
      },
      multipleSelectTestCase: [],
      multipleSelectTestCaseDelete: [],
      taskId: 0,
      caseKey: '',
      testCaseId: 0,
      executionResultList: []
    }
  },
  components: {
    CaseExecutionDialog: () => import('./CaseExecutionDialog'),
    AddNewCaeList: () => import('./CaseExecutionAndSearch'),
    CaseExecutionDetailAndListRun: () => import('./CaseExecutionDetailAndListRun'),
    testAssociation: () => import('./testAssociation'),
    CaseReport: () => import('./CaseReport'),
    BugInfoDialog: () => import('./CaseExecutionDetailAndListBug')
  },
  async mounted () {
    const data = {
      ...this.testCaseSearchValue,
      taskId: this.$route.query.taskId
    }
    await this.queryTestCaseData(data)
    this.caseExecutionResultList()
  },
  methods: {
    async TestTaskDialog () { // 查看测试报告
      this.$refs.CaseReport.CaseReportShow = true
      await this.$refs.CaseReport.CaseReportClick(this.$route.query.taskId)
    },
    caseExecutionResultList () {
      this.executionResultList = this.$refs.addNewCaseList.executionResultList
    },
    // 查询
    async queryTestCaseData () {
      // 测试用例列表数据源手动和自动
      const { ehrTreePath, createTimeVal, updateTimeVal } =
          this.testCaseSearchValue
      const queryData = {
        page: {
          ...this.pagination
        },
        searchObj: {
          // executionResult: this.testExecutionType === '1' ? '' : 'fail',
          // executionResult: 'fail',
          ...this.testCaseSearchValue,
          ehrTreePath: ehrTreePath ? ehrTreePath.toString() : '',
          createTimeVal: createTimeVal ? createTimeVal.toString() : '',
          updateTimeVal: updateTimeVal ? updateTimeVal.toString() : '',
          taskId: this.$route.query.taskId,
          testExecutionType: this.testExecutionType
        }
      } // 根据接口要求处理请求参数
      const res = await queryRelTestCaseByPage(queryData)
      const respData = res.data || []
      this.testExecutionType === '1'
        ? (this.selectedCaseList = respData.records)
        : (this.apiCaseList = respData.records)
      this.pagination.total = respData.total
      const taskId = this.$route.query.taskId
      await this.getCaseStatusNumber(taskId)
    },
    async queryTestCaseDataFind () {
      this.pagination.current = 1
      await this.queryTestCaseData()
    },
    // 批量执行
    handleSelectionChange (val) {
      // this.multipleSelectTestCase = val.map(item => item.testCaseId)
      this.multipleSelectTestCase = val.map((item) => item.caseKey)
      this.multipleSelectTestCaseDelete = val.map((item) => item.id)
    },
    onBatchCheck () {
      // 批量执行 选中用例为空，则提示
      this.multipleSelectTestCase.length === 0
        ? this.$notify({
          type: 'error',
          title: 'Error',
          message: '先选择需要执行的测试用例吧～'
        })
        : this.onBatchShow()
    },
    onBatchShow () {
      if (this.testExecutionType === '1') {
        this.$refs.batchDialog.dialogVisible = true
      } else {
        this.$refs.batchDialog.apiOrAutomatic = false
        this.$refs.batchDialog.dialogVisible = true
      }
    },
    // 批量删除
    handleBatchDelete () {
      this.multipleSelectTestCaseDelete.length === 0
        ? this.$notify({
          type: 'error',
          title: 'Error',
          message: '先选择需要删除的测试用例吧~'
        })
        : this.BatchDelete(this.multipleSelectTestCaseDelete)
    },
    async BatchDelete (id) {
      await this.$confirm('将删除选中数据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const reqData = {
            taskTestCaseIdList: id,
            taskId: this.$route.query.taskId
          }
          deleteCase(reqData)
          this.queryTestCaseData()
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 分页start
    handleCurrentChange (val) {
      // 分页
      this.pagination.current = val
      this.queryTestCaseData()
    },
    handleSizeChange (val) {
      this.pagination.size = val
      this.queryTestCaseData()
    },
    async getCaseStatusNumber (taskId) {
      const queryData = {
        taskId: taskId || this.$route.query.taskId
      }
      const res = await getCaseStatusNumber(queryData)
      const respData = res.data
      this.summaryCount.runSuccessCount = respData.runSuccessCount ?? 0
      this.summaryCount.runFailCount = respData.runFailCount ?? 0
      this.summaryCount.runCount = respData.runCount ?? 0
      this.summaryCount.notRunCount = respData.notRunCount ?? 0
      this.summaryCount.runSkipCount = respData.runSkipCount ?? 0
      this.summaryCount.requirementSummary = respData.requirementSummary
      this.summaryCount.taskStatusStr = respData.taskStatusStr
      this.summaryCount.taskName = respData.taskName
      this.summaryCount.comButtonFlag = respData?.comButtonFlag ?? false
    },
    async handleExecution (data) {
      // 运行按钮
      const RunData = this.$refs.detailDialog
      RunData.apiOrAutomatic = this.testExecutionType !== '1'
      this.testCaseId = data.testCaseId
      this.caseKey = data.caseKey
      const params = { id: data.id }
      const res = await getCaseDetailById(params)
      const resData = res.data
      this.multipleSelectTestCase = [data.caseKey]
      RunData.caseKeyHistory = resData.caseKey
      const dataMap = new Map()
      const list = []
      if (this.testExecutionType === '1') {
        dataMap.set('用例名称', resData.casename)
        dataMap.set('jira ID', resData.relationRequirement)
        dataMap.set('前置条件', resData.preCondition)
        dataMap.set('用例等级', resData.testCaseLevelStr)
        dataMap.set('步骤描述', resData.step)
        dataMap.set('预期结果', resData.expectedResults)
        dataMap.set('所属应用', resData.belongToSystemStr)
        dataMap.set('所属模块', resData.belongToModuleStr)
        dataMap.set('用例类型', resData.typeStr)
        dataMap.set('所属平台', resData.belongPlatformStr)
      } else {
        dataMap.set('用例名称', resData.casename)
        dataMap.set('应用名', resData.applicationName)
        dataMap.set('维护人', resData.updateUser)
        dataMap.set('请求类型', resData.requestType)
        dataMap.set('协议类型', resData.protocolType)
        dataMap.set('请求URI', resData.requestUri)
        dataMap.set('请求参数Param', resData.realInParam)
        dataMap.set('请求参数Body', resData.reqBody)
      }
      dataMap.forEach((value, key) => {
        const testcase = {
          name: key,
          value: value
        }
        list.push(testcase)
      })
      RunData.dataMap = list
      if (
        resData.executionResult === 'skip' ||
          resData.executionResult === 'fail' ||
          resData.executionResult === 'pass'
      ) {
        RunData.detailDialogValue.executionResult = resData.executionResult
      } else {
        RunData.detailDialogValue.executionResult = ''
      }
      if (this.testExecutionType === '2') {
        if (resData.executionResult === 'fail') {
          RunData.saveBugShow = false
        } else {
          RunData.saveBugShow = true
        }
      }
      RunData.detailDialogValue.executionVersion = resData.executionVersion
      RunData.detailDialogValue.relationBug = resData.relationBug
      RunData.detailDialogValue.exeRemark = resData.exeRemark
      RunData.detailDialogValue.casename = resData.casename

      RunData.testCaseDetailDialog = true
    },
    async handleDelete (id) {
      // 单个删除
      await this.$confirm('将删除本条数据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const reqData = {
            taskTestCaseIdList: [id],
            taskId: this.$route.query.taskId
          }
          deleteCase(reqData)
          this.queryTestCaseData()
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 打开一键提交bug页面
    async openBugPage (caseKey) {
      this.$refs.bugInfoDialog.bugInfo.caseKey = caseKey
      this.$refs.bugInfoDialog.dialogVisible = true
    },
    async handleSubmit (val) {
      // 测试执行进行关联测试用例提交
      const newSelectedList = val
      if (newSelectedList && newSelectedList.length !== 0) {
        const data = {
          taskTestCaseIdList: newSelectedList,
          taskId: this.$route.query.taskId
        }
        const res = await saveTestCaseWithExecution(data)
        if (res.success) {
          this.$notify({
            type: 'success',
            message: res.message
          })
        } else {
          return
        }
        await this.queryTestCaseData()
        this.testExecutionType === '1'
          ? this.$refs.testAssociation.queryCaseRelevancy()
          : this.$refs.testAssociation.queryApiCaseRelevancy()
      } else {
        this.$message({
          type: 'error',
          message: '未选择关联用例！'
        })
      }
    },
    handleCaseSearch () {
      // 选择测试用例集
      this.$refs.testAssociation.testAssociationShow = true
      this.$refs.testAssociation.artificialOrApi =
          this.$route.query.testExecutionType
      this.testExecutionType === '1'
        ? this.$refs.testAssociation.queryCaseRelevancy()
        : this.$refs.testAssociation.queryApiCaseRelevancy()
    },
    // async completeTestTaskDialog () {
    //   // 完成按钮
    //   const { taskId: idList } = this.$route.query
    //   const res = await completeTaskStatus({ idList })
    //   if (res.success) {
    //     this.$notify({
    //       type: 'success',
    //       message: '完成执行' + res.message
    //     })
    //     this.$router.go(-1)
    //   }
    // },
    async completeTestTaskDialog () {
      this.$refs.CaseReport.CaseReportShow = true
      this.$refs.CaseReport.complateFlag = true
      this.$refs.CaseReport.emailInfo.sender = this.userName
      await this.$refs.CaseReport.CaseReportClick(this.$route.query.taskId)
    }

  }
}
</script>
<style lang="scss">

  .testTitle {
    display: block;
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
    font-family: 楷体;
  }

  .revert {
    display: inline;
    margin-top: -8px;
    margin-bottom: 10px;
  }

  .case-detail {
    .el-select,
    .el-input__inner {
      width: 100%;
    }

    .el-cascader,
    .el-input__inner {
      width: 100%;
    }

    .check-case-button {
      display: flex;
      justify-content: center;
      margin-bottom: 15px;
    }
  }
</style>
<style scoped lang="scss">

  .buttonText {
    color: blue;
  }

  .ding {
    cursor: pointer;
    background-size: 30px;
    background-position-x: 305px;
  }

  .title {
    //margin: 20px;
    color: #606266;
    font-size: 15px;
    margin-right: 10px;
  }

  .case-list-title {
    margin-top: 5px;
    font-size: 15px;
    display: block;
    color: #606266;
    margin-bottom: 20px;
  }

  .case-button {
    height: 15px;
    width: auto;
    display: inline-block;
  }

  //查询测试用例
  .case-button-find {
    float: right;
    margin-left: 6px;
  }

  .icon {
    cursor: pointer;
    margin-right: 5px;
    padding: 6px;
    border-radius: 50%;
    color: #fff;
    background: #f96c6c;
  }

  .el-icon-video-play {
    background: #1b58f8;
  }

  .el-icon-s-promotion {
    background: #67C23A;
  }

  .el-icon-attract {
    background: #1b58f8;
  }

  .el-icon-check {
    background: #67c23a;
  }

  .case-total {
    margin: 10px 0px;
  }

  .pagination {
    margin: 20px 10px 30px 0px;
    float: right;
  }

  .case-total {
    margin: 10px 0px;
  }
</style>
<style scoped>
  .edit_dev >>> .el-transfer-panel {
    width: 40%;
  }
</style>
<style scoped lang="scss">
  @import "../Project/project-style/projectReport.scss";
</style>
