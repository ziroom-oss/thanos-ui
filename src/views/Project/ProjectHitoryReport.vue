<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{path: 'projectDashboard'}">项目</el-breadcrumb-item>
      <el-breadcrumb-item>历史日报</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h3 class="report-title margin-bottom15">历史日报</h3>
      <el-table
        :data="historyReportList"
        border
        style="width: 100%">
        <el-table-column
          prop="dailyDate"
          label="日期"/>
        <el-table-column
          prop="detailVo.dailyReportSum.testcaseRate"
          label="整体进度(%)"/>
        <el-table-column
          label="成功用例数(个)">
          <template slot-scope="scope">
            <span class="success">{{scope.row.detailVo.dailyReportSum.runSuccessCount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="失败用例数(个)">
          <template slot-scope="scope">
            <span class="failure">{{scope.row.detailVo.dailyReportSum.runFailCount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="detailVo.dailyReportSum.dailyCount"
          label="当日用例数(个)"/>
        <el-table-column
          prop="detailVo.dailyReportSum.bugCount"
          label="bug总数(个)"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
          <span
            class="project-history"
            @click="handleDetail(scope.row)">查看具体日报详情</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { queryHistoryReportList } from '@/api/model/project'
export default {
  name: 'ProjectHitoryReport',
  data: () => ({
    historyReportList: [],
    pagination: {
      size: 10,
      total: 0,
      current: 1
    }
  }),
  async mounted () {
    await this.queryHistoryReportList()
  },
  methods: {
    async queryHistoryReportList () {
      const data = {
        page: {
          ...this.pagination
        },
        searchObj: {
          topicId: this.$route.query.id
        }
      }
      const res = await queryHistoryReportList(data)
      const respData = res.data
      this.historyReportList = respData.records || []
    },
    handleDetail (data) {
      this.$router.push({
        path: '/projectReport',
        query: {
          reportId: data.id
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import "./project-style/projectReport.scss";
</style>
