<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{path: 'projectDashboard'}">项目</el-breadcrumb-item>
      <el-breadcrumb-item>日报</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h3 class="report-title margin-bottom15">{{projectName}}日报</h3>
      <el-row :gutter="24" class="margin-bottom15">
        <el-col :span="24">
          <span class="report-detail-title">测试风险:</span>
          <span class="margin-left10">{{dailyRiskNames || '暂无'}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" class="margin-bottom15">
          <span class="report-detail-title">整体进度:</span>
          <span class="report-detail-content margin-left10">{{dailyReportTotal['testcaseRate']}}%</span>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="16">
          <el-table
            :data="reportData"
            border
            class="margin-bottom15 margin-left10"
            style="width: 100%">
            <el-table-column
              prop="testcaseCount"
              label="总用例数"/>
            <el-table-column
              prop="runSuccessCount"
              label="成功用例数"
              width="180" />
            <el-table-column
              prop="runFailCount"
              label="失败用例数"/>
            <el-table-column
              prop="runSkipCount"
              label="跳过用例数"/>
            <el-table-column
              prop="notRunCount"
              label="待测用例数"/>
          </el-table>
        </el-col>
        <el-col :span="8">
          <div id="total" class="chart"></div>
        </el-col>
      </el-row>
      <el-row :gutter="24" class="bg">
        <el-col :gutter="12">
          <span class="report-detail-title">项目预期上线时间:{{projectOnlineDate}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="24" class="bg">
        <el-col :span="3">
          <span class="report-detail-title">今日工作进度:</span>
        </el-col>
        <el-col :span="10">
        <span class="report-detail-content">
          今日共测 {{dailyReportTotal['dailyCount']}} 个用例。
          其中,
          <span class="success">{{dailyReportTotal['dailySuccessCount']}}</span> 个成功,
          <span class="success">{{dailyReportTotal['dailySkipCount']}}</span> 个跳过,
          <span class="failure">{{dailyReportTotal['dailyFailCount']}}</span> 个失败。
        </span>
        </el-col>
      </el-row>
      <el-row :gutter="24" class="bg">
        <el-col :span="3">
          <span class="report-detail-title">BUG解决进度:</span>
        </el-col>
        <el-col :span="3">
          <span class="report-detail-content">{{dailyReportTotal['bugRate']}}%</span>
        </el-col>
        <el-col :span="3">
          <span class="report-detail-content">总bug数: {{dailyReportTotal['bugCount']}}个</span>
        </el-col>
        <el-col :span="3">
          <span class="report-detail-content success">成功解决bug数: {{dailyReportTotal['bugSuccessCount']}}个</span>
        </el-col>
        <el-col :span="3">
          <span class="report-detail-content failure">待解决bug数: {{dailyReportTotal['bugUnresolvedCount']}}个</span>
        </el-col>
      </el-row>
      <el-row :gutter="24" class="bg">
        <el-col :span="23">
          <span class="report-detail-title">BUG信息详情:</span>
        </el-col>
        <el-col :span="1">
          <i class="el-icon-caret-bottom check-more" v-show="!bugListVisible" @click="checkMoreBug"></i>
          <i class="el-icon-caret-top check-more" v-show="bugListVisible" @click="checkMoreBug"></i>
        </el-col>
      </el-row>
      <el-row :gutter="24" v-show="bugListVisible">
        <el-table
          :data="bugInfoList"
          style="width: 100%">
          <el-table-column
            label="BUG编号"
            prop="issueKey">
          </el-table-column>
          <el-table-column
            label="BUG优先级"
            prop="priority">
          </el-table-column>
          <el-table-column
            label="BUG状态"
            prop="bugStatus">
          </el-table-column>
        </el-table>
      </el-row>
      <el-row :gutter="24" class="bg">
        <el-col :span="23">
          <span class="report-detail-title">测试执行详情:</span>
        </el-col>
        <el-col :span="1">
          <i class="el-icon-caret-bottom check-more" v-show="!caseExecutionVisible" @click="checkMoreExecution"></i>
          <i class="el-icon-caret-top check-more" v-show="caseExecutionVisible" @click="checkMoreExecution"></i>
        </el-col>
      </el-row>
      <el-row :gutter="24" v-show="caseExecutionVisible">
        <el-table
          :data="caseExecutionData"
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="case-execution-expand">
                <el-form-item label="累计通过/失败/跳过/总用例数:">
                  <span>{{ props.row.runSuccessCount}}</span> /
                  <span>{{props.row.runFailCount}}</span> /
                  <span>{{props.row.runSkipCount}}</span> /
                  <span>{{props.row.testcaseCount }}</span>
                </el-form-item>
                <el-form-item label="总进度:">
                  <span>{{ props.row.testcaseRateStr}}</span>
                </el-form-item>
                <el-form-item label="总计发现bug总数:">
                  <span>{{ props.row.bugCount }}</span>
                </el-form-item>
                <el-form-item class="check-detail">
                  <span @click="checkExecutionDetail(props.row)">查看详情  ></span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="测试执行标题"
            prop="testTaskName">
          </el-table-column>
          <el-table-column
            label="测试执行类型"
          >
            <template slot-scope="scope">
              {{CASE_TYPE_CONFIG[scope.row.testExecutionType]}}
            </template>
          </el-table-column>
          <el-table-column
            label="总用例数"
            prop="testcaseCount">
          </el-table-column>
          <el-table-column
            label="当天通过/失败/跳过/执行总数"
          >
            <template slot-scope="scope">
              {{scope.row.dailySuccessCount}} /
              {{scope.row.dailyFailCount}} /
              {{scope.row.dailySkipCount}}/
              {{scope.row.dailyCount}}
            </template>
          </el-table-column>
          <el-table-column
            label="今日进度"
            prop="dailyRateStr">
          </el-table-column>
          <el-table-column
            label="测试执行负责人"
            prop="createUser">
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { queryCheckReport } from '@/api/model/project'
import { pieOption } from '@/config/pieChart.config.js'
import CASE_TYPE_CONFIG from '@/config/caseExecution.config.js'
export default {
  name: 'ProjectReport',
  data: () => ({
    reportData: [],
    projectOnlineDate: '',
    projectId: '',
    reportId: '',
    dailyReportTotal: {},
    risk: '',
    projectName: '',
    pieOption: Object.freeze(pieOption),
    bugDataSource: [],
    dailyRiskNames: '',
    bugListVisible: false,
    caseExecutionVisible: false,
    caseExecutionData: [],
    bugInfoList: [],
    CASE_TYPE_CONFIG: Object.freeze(CASE_TYPE_CONFIG.caseExecutionTypeList)
  }),
  created () {
    this.projectId = this.$route.query.id
    this.reportId = this.$route.query.reportId
  },
  async mounted () {
    await this.queryCheckReport()
  },
  methods: {
    async queryCheckReport () {
      const params = {
        id: this.reportId
      }
      const res = await queryCheckReport(params)
      const respData = res.data
      this.dailyReportName = respData?.dailyReportName
      this.projectName = `${respData.dailyReportName}-${respData?.testTopic?.topicName}-`
      this.dailyRiskNames = respData.dailyRiskNames
      this.projectOnlineDate = respData?.testTopic?.upTime
      this.dailyReportTotal = respData?.dailyReportSum
      this.caseExecutionData = respData?.dailyTestTaskList
      this.bugInfoList = respData?.dailyReportSum.bugInfoList
      this.handleChart(respData?.chartMap)
      this.reportData.push({
        testcaseCount: this?.dailyReportTotal.testcaseCount,
        runSuccessCount: this?.dailyReportTotal.runSuccessCount,
        runFailCount: this?.dailyReportTotal.runFailCount,
        runSkipCount: this?.dailyReportTotal.runSkipCount,
        notRunCount: this?.dailyReportTotal.notRunCount
      })
    },
    handleChart (val) {
      const ids = ['total']
      ids.map(id => {
        this.drawPieChart(id, val[id])
      })
    },
    checkMoreBug () {
      this.bugListVisible = !this.bugListVisible
    },
    checkMoreExecution () {
      this.caseExecutionVisible = !this.caseExecutionVisible
    },
    checkExecutionDetail (data) {
      this.$router.push({
        path: '/caseExecutionDetailAndList',
        query: {
          taskId: data.testTaskId,
          testExecutionType: data.testTaskType
        }
      })
      // let routeData = this.$router.resolve({
      //   name: "caseExecutionDetailAndList",
      //   query: {
      //     taskId: data.testTaskId,
      //     testExecutionType: data.testTaskType
      //   }
      // });
      // window.open(routeData.href, '_blank');
    },
    handleChartData (data = []) { // 处理数据
      const res = data.map(item => !item.value ? {
        name: item.chartKey,
        value: item.chartValue
      } : {})
      return res
    },
    drawPieChart (id, data) {
      const chartDom = document.getElementById(id)
      const chart = this.$echarts.init(chartDom)
      chart.setOption(pieOption(this.handleChartData(data), '整体进度'))
    }
  }
}
</script>
<style scoped lang="scss">
@import "./project-style/projectReport.scss";
</style>
