<template>
    <el-container>
        <el-header>
            <i class="el-icon-s-promotion"></i>
            <span style="margin-left: 10px">接口任务集合运行报告详情</span>
            <el-tooltip placement="right" effect="light" content="上下滚动页面展开收起，查看其它多接口用例运行详情">
                <i style="margin-left: 10px;color: grey" class="el-icon-question"></i>
            </el-tooltip>
        </el-header>
        <el-main>
            <el-tabs v-model="activeTabIndex" type="border-card" @tab-click="handleClick">
                <el-tab-pane v-for="(report, index) in reportResult" :label="report.setName" :name="index.toString()" :key="index.toString()">
                    <el-collapse v-model="activeNames" accordion @change="handleChange">
                        <el-collapse-item v-for="(item, index) in report.totalData"
                                          :title="'【多接口用例名称】- ' + item.caseName"
                                          :name="index" :key="index">
                            <el-row :xs="24" :sm="24" :lg="24">
                                <div style="text-align: center;margin: 50px 50px;">
                                    <el-col :xs="24" :sm="24" :lg="8">
                                        <el-progress type="dashboard"
                                                     :percentage="parseFloat((item.passNum / item.allNum * 100).toFixed(2))"
                                                     color="#5cb87a"
                                                     :stroke-width="8"></el-progress>
                                        <br/>
                                        <el-tag type="success" size="medium" style="margin-bottom: 20px">success数:
                                            {{item.passNum}}
                                        </el-tag>
                                    </el-col>
                                    <el-col :xs="24" :sm="24" :lg="8">
                                        <el-progress type="dashboard"
                                                     :percentage="parseFloat((item.failedNum / item.allNum * 100).toFixed(2))"
                                                     color="#f56c6c"
                                                     :stroke-width="8"></el-progress>
                                        <br/>
                                        <el-tag type="danger" size="medium">failure数: {{item.failedNum}}</el-tag>
                                    </el-col>
                                    <el-col :xs="24" :sm="24" :lg="8">
                                        <el-progress type="dashboard"
                                                     :percentage="parseFloat((item.skippedNum / item.allNum * 100).toFixed(2))"
                                                     color="#e6a23c"
                                                     :stroke-width="8"></el-progress>
                                        <br/>
                                        <el-tag type="warning" size="medium">skipped数: {{item.skippedNum}}</el-tag>
                                    </el-col>
                                </div>
                            </el-row>

                            <el-table :data="item.stepResult" stripe>
                                <el-table-column type="expand">
                                    <template slot-scope="props">
                                        <el-form label-position="left" inline class="demo-table-expand">
                                            <el-form-item
                                                    v-show='props.row.stepType === 1 && props.row.stepStatus !== "SKIPPED"'
                                                    label="【接口预期结果】:">
                                                <span v-if="props.row.stepCheckPoint === null">无</span>
                                                <span v-else>{{ props.row.apiCheckPoint }}</span>
                                            </el-form-item>
                                            <el-form-item
                                                    v-show='props.row.stepType === 1 && props.row.stepStatus !== "SKIPPED"'
                                                    label="【接口地址】:">
                                                <span v-if="props.row.apiUrl === null">无</span>
                                                <span>{{ props.row.apiUrl }}</span>
                                            </el-form-item>
                                            <el-form-item
                                                    v-show='props.row.stepType === 1 && props.row.stepStatus !== "SKIPPED"'
                                                    label="【接口实际结果】:">
                                                <span v-if="props.row.apiOutput === null">无</span>
                                                <span>{{ props.row.apiOutput }}</span>
                                            </el-form-item>
                                            <el-form-item
                                                    v-show='props.row.stepType === 1 && props.row.stepStatus !== "SKIPPED"'
                                                    label="【接口真实入参】:">
                                                <span v-if="props.row.apiInParam === null">无</span>
                                                <span>{{ props.row.apiInParam }}</span>
                                            </el-form-item>
                                            <el-form-item
                                                    v-show='props.row.stepType === 0 && props.row.stepStatus !== "SKIPPED"'
                                                    label="【数据库名称】:">
                                                <span v-if="props.row.dbName === null">无</span>
                                                <span>{{ props.row.dbName }}</span>
                                            </el-form-item>
                                            <el-form-item
                                                    v-show='props.row.stepType === 0 && props.row.stepStatus !== "SKIPPED"'
                                                    label="【SQL执行结果】:">
                                                <span v-if="props.row.actualResult === null">无</span>
                                                <span>{{ props.row.actualResult }}</span>
                                            </el-form-item>
                                            <el-form-item
                                                    v-show='props.row.stepType === 0 && props.row.stepStatus !== "SKIPPED"'
                                                    label="【SQL名称】:">
                                                <span v-if="props.row.sqlName === null">无</span>
                                                <span>{{ props.row.sqlName }}</span>
                                            </el-form-item>
                                            <el-form-item
                                                    v-show='props.row.stepType === 0 && props.row.stepStatus !== "SKIPPED"'
                                                    label="【SQL语句】:">
                                                <span v-if="props.row.actualInparam === null">无</span>
                                                <span>{{ props.row.actualInparam }}</span>
                                            </el-form-item>
                                            <el-form-item v-show='props.row.stepStatus === "SKIPPED"' label="【步骤期望结果】:">
                                                <span v-if="props.row.stepCheckPoint === null || props.row.stepCheckPoint === ''">无</span>
                                                <span>{{ props.row.stepCheckPoint }}</span>
                                            </el-form-item>
                                        </el-form>
                                    </template>
                                </el-table-column>
                                <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
                                <el-table-column label="步骤名称">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.stepName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="接口/sql/用例Id" align="center">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.apiId}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="类型" width="70">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.stepType === 0">SQL</span>
                                        <span v-else-if="scope.row.stepType === 1">接口</span>
                                        <span v-else>用例</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="步骤入参">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark" :content="scope.row.inParam"
                                                    placement="top-start">
                                            <span>{{scope.row.inParam | ellipsis}}</span>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column label="步骤出参" :formatter="formatterOutParam" align="center">
                                </el-table-column>
                                <el-table-column label="响应时长" width="150" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.responseTime == null">-</span>
                                        <span v-else>{{scope.row.responseTime}}s</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="步骤状态" width="150" align="center">
                                    <template slot-scope="scope">
                        <span v-if="scope.row.stepStatus ==='SUCCESS'"><el-tag
                                type="success" effect="dark">{{scope.row.stepStatus}}</el-tag></span>
                                        <span v-else-if="scope.row.stepStatus ==='FAILURE'"><el-tag type="danger"
                                                                                                    effect="dark">{{scope.row.stepStatus}}</el-tag></span>
                                        <span v-else><el-tag type="info" effect="dark">SKIPPED</el-tag></span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-collapse-item>
                    </el-collapse>
                </el-tab-pane>
            </el-tabs>
        </el-main>
    </el-container>
</template>

<script>
import { getMultiApiTaskSetReportDetail, getTotalTaskSetLatestReport } from '@/api/model/taskSet'

export default {
  name: 'multi-task-set-report',
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
      activeTabIndex: '0',
      activeNames: [0],
      reportResult: [],
      totalData: []
    }
  },
  created () {
    if (this.$route.query.userCode !== undefined) {
      this.getMultiApiTaskSetReportDetail()
    } else {
      this.getTotalTaskSetLatestReport()
    }
  },
  methods: {
    getMultiApiTaskSetReportDetail () {
      const loading = this.$loading({
        lock: true,
        text: '正在拼命汇总统计报告详情，请稍候',
        spinner: 'el-icon-loading'
      })

      const setId = this.$route.query.setId
      const userCode = this.$route.query.userCode
      const version = this.$route.query.version
      getMultiApiTaskSetReportDetail({
        setId: setId,
        userCode: userCode,
        version: version
      }).then(response => {
        loading.close()
        if (response.success) {
          this.reportResult = response.data
        }
      })
    },

    getTotalTaskSetLatestReport () {
      const loading = this.$loading({
        lock: true,
        text: '正在拼命汇总统计报告详情，请稍候',
        spinner: 'el-icon-loading'
      })
      getTotalTaskSetLatestReport({ setApiType: this.$route.query.setApiType }).then(response => {
        loading.close()
        if (response.success) {
          this.reportResult = response.da
        }
      })
    },

    handleChange (val) {
      if (val.length < 0) {
        return false
      }
    },
    formatterOutParam (row) {
      if (row.outParam == null || row.outParam === '') {
        return ''
      }
      const arr = eval(row.outParam)
      if (arr.length === 0) {
        return ''
      }
      let result = ''
      for (let i = 0; i < arr.length; i++) {
        result = result + arr[i].key + '(' + arr[i].keyAs + '),'
      }
      return result.substring(0, result.length - 1)
    },
    handleClick () {

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

    /deep/ .el-collapse-item__header {
        font-size: 16px;
    }

    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }
</style>
