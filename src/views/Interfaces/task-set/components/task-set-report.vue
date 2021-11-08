<template>
    <el-container>
        <el-header>
            <i class="el-icon-s-promotion"></i>
            <span style="margin-left: 10px">接口任务集合运行报告详情</span>
        </el-header>
        <el-main>
            <el-row :xs="24" :sm="24" :lg="24">
                <el-card>
                    <el-col :xs="24" :sm="24" :lg="24">
                        <span class="card-title">【{{caseData.setName}}】接口任务集合运行详情</span>
                    </el-col>
                    <div style="text-align: center;margin: 50px 50px;">
                        <el-col :xs="24" :sm="24" :lg="8">
                            <el-progress type="dashboard" :percentage="caseRunStatusRate.passRate" color="#5cb87a"
                                         :stroke-width="8"></el-progress>
                            <br/>
                            <el-tag type="success" size="medium" style="margin-bottom: 20px">success数: {{caseData.successNum}}</el-tag>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="8">
                            <el-progress type="dashboard" :percentage="caseRunStatusRate.failRate" color="#f56c6c"
                                         :stroke-width="8"></el-progress>
                            <br/>
                            <el-tag type="danger" size="medium">failure数: {{caseData.failedNum}}</el-tag>
                        </el-col>
                        <el-col :xs="24" :sm="24" :lg="8">
                            <el-progress type="dashboard" :percentage="caseRunStatusRate.skippedRate" color="#e6a23c"
                                         :stroke-width="8"></el-progress>
                            <br/>
                            <el-tag type="warning" size="medium">skipped数: {{caseData.skippedNum}}</el-tag>
                        </el-col>
                    </div>
                </el-card>
            </el-row>
            <el-table
                    :data="tableData"
                    ref="reportTable"
                    style="padding-top: 30px;width: 100%"
                    stripe
                    row-key="id"
                    :expand-row-keys="expandRowKeys"
                    @row-click="expandRowEv"
            >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left">
                            <el-form-item label="【接口请求地址】:">
                                <span>{{ props.row.requestUrl }}</span>
                            </el-form-item>
                            <el-form-item label="【接口请求入参】:">
                                <span v-if="props.row.requestParam.length > 0">{{ props.row.requestParam }}</span>
                                <span v-else> - </span>
                            </el-form-item>
                            <el-form-item label="【接口预期结果】:">
                                <span>{{ props.row.expectedResults }}</span>
                            </el-form-item>
                            <el-form-item label="【接口实际结果】:">
                                <span>{{ props.row.actualResult }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
                <el-table-column label="用例ID" align="center" width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.caseId}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="50">
                    <template slot-scope="scope">
                        <el-tooltip placement="top" effect="light" content="Mocked接口运行结果">
                            <el-button v-if="scope.row.mockedResult" type="danger" size="mini" icon="el-icon-wind-power"
                                       plain circle></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="用例名称" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.caseName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="请求类型" align="center" width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.requestType}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="请求URL" align="center">
                    <template slot="header">
                        <span>请求URL</span>
                        <el-tooltip class="tooltip" effect="light" placement="top">
                            <div slot="content">内容过长时自动隐藏部分内容，<br/>展开行后可查看请求详情信息</div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                        <span>{{scope.row.requestUrl | ellipsis}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="响应时长(秒)" width="100" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.responseTime}}s</span>
                    </template>
                </el-table-column>
                <el-table-column label="步骤状态" width="120" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.recordResult ==='SUCCESS'"><el-tag type="success" effect="dark">{{scope.row.recordResult}}</el-tag></span>
                        <span v-else-if="scope.row.recordResult ==='FAILURE'"><el-tag type="danger" effect="dark">{{scope.row.recordResult}}</el-tag></span>
                        <span v-else><el-tag type="info" effect="dark">SKIPPED</el-tag></span>
                    </template>
                </el-table-column>
                <el-table-column label="运行用户" align="center" width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="运行时间" align="center" width="180">
                    <template slot-scope="scope">
                        <span>{{scope.row.runTime}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
import { getTaskSetByCdVersion, getTaskSetReportDetailByVersion } from '@/api/model/taskSet'

export default {
  name: 'task-set-report',
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 100) {
        return value.slice(0, 100) + '...'
      }
      return value
    }
  },
  data () {
    return {
      tableData: [],
      expandRowKeys: [],
      caseData: {
        setName: '',
        successNum: 0,
        failedNum: 0,
        skippedNum: 0,
        totalNum: 0
      },
      caseRunStatusRate: {
        passRate: 0.00,
        failRate: 0.00,
        notRunRate: 0.00
      }
    }
  },
  created () {
    if (this.$route.query.userCode !== undefined) {
      this.getReportDetailByVersion()
    } else {
      this.getTaskSetByCdVersion()
    }
  },
  methods: {
    getReportDetailByVersion () {
      const setId = this.$route.query.setId
      const userCode = this.$route.query.userCode
      const version = this.$route.query.version
      getTaskSetReportDetailByVersion({ setId: setId, userCode: userCode, version: version }).then(response => {
        if (response.success) {
          this.tableData = []
          this.expandRowKeys = []
          this.tableData = response.data.resultData

          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].recordResult === 'FAILURE') {
              this.expandRowKeys.push(this.tableData[i].id)
              break
            }
          }
          this.caseData = {
            setName: response.data.setName,
            successNum: response.data.successNum,
            failedNum: response.data.failNum,
            skippedNum: response.data.skippedNum,
            totalNum: response.data.totalNum
          }
          this.caseRunStatusRate = {
            passRate: this.caseData.totalNum !== 0 ? parseFloat((this.caseData.successNum / this.caseData.totalNum * 100).toFixed(2)) : 0.00,
            failRate: this.caseData.totalNum !== 0 ? parseFloat((this.caseData.failedNum / this.caseData.totalNum * 100).toFixed(2)) : 0.00,
            skippedRate: this.caseData.totalNum !== 0 ? parseFloat((this.caseData.skippedNum / this.caseData.totalNum * 100).toFixed(2)) : 0.00
          }
        }
      })
    },
    getTaskSetByCdVersion () {
      getTaskSetByCdVersion({ version: this.$route.params.version }).then(response => {
        if (response.success) {
          this.tableData = []
          this.expandRowKeys = []
          this.tableData = response.data.resultData

          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].recordResult === 'FAILURE') {
              this.expandRowKeys.push(this.tableData[i].id)
              break
            }
          }
          this.caseData = {
            setName: response.data.setName,
            successNum: response.data.successNum,
            failedNum: response.data.failNum,
            skippedNum: response.data.skippedNum,
            totalNum: response.data.totalNum
          }
          this.caseRunStatusRate = {
            passRate: this.caseData.totalNum !== 0 ? parseFloat((this.caseData.successNum / this.caseData.totalNum * 100).toFixed(2)) : 0.00,
            failRate: this.caseData.totalNum !== 0 ? parseFloat((this.caseData.failedNum / this.caseData.totalNum * 100).toFixed(2)) : 0.00,
            skippedRate: this.caseData.totalNum !== 0 ? parseFloat((this.caseData.skippedNum / this.caseData.totalNum * 100).toFixed(2)) : 0.00
          }
        }
      })
    },
    expandRowEv (row) {
      this.$refs.reportTable.toggleRowExpansion(row)
    }
  }
}
</script>

<style scoped>
    .el-header {
        background-color: rgb(48, 65, 86);
        color: white;
        line-height: 60px;
    }

    .el-container {
        margin-bottom: 40px;
        background-color: rgb(240, 242, 245);
    }

    .table-expand {
        font-size: 0;
    }

    .table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    /deep/ .el-form-item {
        margin-bottom: 18px;
    }
</style>
