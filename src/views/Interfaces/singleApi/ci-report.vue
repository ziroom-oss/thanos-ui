<template>
    <el-container>
        <el-header>
            <div style="color: white; font-size:15px" align="left"><i class="el-icon-s-promotion"></i>
                单接口报告
            </div>
        </el-header>
        <el-main>
            <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :lg="24">
                    <box-card :cardData="chartData['totalSummary']"></box-card>
                </el-col>

                <el-col :xs="24" :sm="24" :lg="24">
                    <div style=" background: #fff;padding: 16px 16px 0;">
                        <el-select v-model="postData.systemName"
                                   filterabledata-v-62e65443
                                   @change="triggerTableFilter"
                                   placeholder="请选择系统">
                            <el-option
                                    v-for="item in systemOptions"
                                    :key="item.label"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="postData.recordResult"
                                   @change="triggerTableFilter"
                                   placeholder="请选择用例结果">
                            <el-option
                                    v-for="item in resultOptions"
                                    :key="item.label"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="postData.responseTime"
                                   @change="triggerTableFilter"
                                   placeholder="请选择响应时间">
                            <el-option
                                    v-for="item in responseTimeOptions"
                                    :key="item.label"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="postData.creatorCode"
                                   @change="triggerTableFilter"
                                   placeholder="请选择录入人">
                            <el-option
                                    v-for="item in creatorOptions"
                                    :key="item.creatorName"
                                    :label="item.creatorName"
                                    :value="item.creatorCode">
                            </el-option>
                        </el-select>
                        <el-table :data="tableData" v-loading="queryLoading">
                            <el-table-column type="expand">
                                <template slot-scope="scope">
                                    <el-form label-position="left" inline class="table-expand">
                                        <el-form-item label="请求类型:">
                                            <span>{{ scope.row.requestType }}</span>
                                        </el-form-item>
                                        <el-form-item label="预期结果:">
                                            <span>{{ scope.row.expectedResult }}</span>
                                        </el-form-item>
                                        <el-form-item label="实际请求参数:">
                                            <span>{{ scope.row.requestParams }}</span>
                                        </el-form-item>
                                        <el-form-item label="返回结果: ">
                                            <span>{{ scope.row.actualResult }}</span>
                                        </el-form-item>
                                    </el-form>
                                </template>
                            </el-table-column>
                            <el-table-column label="用例ID" prop="caseId" align="center"/>
                            <el-table-column label="用例名称" prop="caseName" align="center"/>
                            <el-table-column label="请求URL" prop="requestUrl" align="center" width="500"/>
                            <el-table-column label="运行结果" align="center">
                                <template slot-scope="scope">
                                    <el-tag :type="scope.row.recordResult == 'SUCCESS'?'success':'danger'" size="medium">{{scope.row.recordResult}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="响应时间" prop="responseTime" align="center"/>
                            <el-table-column label="录入人" prop="creatorName" align="center"/>
                        </el-table>
                        <pagination v-show="total > 0" :page.sync="queryParam.pageNum" :total="total"
                                    :limit.sync="queryParam.pageSize"
                                    @pagination="triggerTableFilter"/>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import BoxCard from './components/BoxCard'
import
{
  fetchDailyReportSummary,
  fetchDailyReportTableData
} from '@/api/singleApi/timing-task-report'
import Pagination from '@/components/Pagination/index'

export default {
  name: 'dailyReport',
  components: {
    BoxCard,
    Pagination
  },
  data () {
    return {
      chartData: {
        stackBarChart: {
          systemList: []
        }
      },
      queryParam: {
        pageNum: 1,
        pageSize: 10
      },
      postData: {
        version: this.$route.params.version,
        systemName: '',
        responseTime: '',
        recordResult: '',
        creatorCode: ''
      },
      total: 0,
      tableData: [],
      queryLoading: false,
      systemOptions: [{
        value: '',
        label: '根据系统筛选'
      }],
      resultOptions: [
        {
          value: '',
          label: '根据用例结果筛选'
        },
        {
          value: 'SUCCESS',
          label: '成功'
        },
        {
          value: 'FAILURE',
          label: '失败'
        },
        {
          value: 'NOTRUN',
          label: '未执行'
        }
      ],
      responseTimeOptions: [
        {
          value: '',
          label: '根据响应时间范围筛选'
        },
        {
          value: '0.5',
          label: '>0.5秒'
        },
        {
          value: '1.0',
          label: '>1.0秒'
        },
        {
          value: '3.0',
          label: '>3.0秒'
        }
      ],
      creatorOptions: []
    }
  },
  created () {
    this.getChartData()
    this.triggerTableFilter()
  },
  methods: {
    getChartData () {
      fetchDailyReportSummary({
        version: this.postData.version
      }).then(response => {
        if (response.success) {
          const data = response.data
          this.chartData = {
            stackBarChart: data.stackBarChart,
            totalSummary:
                                {
                                  totalCount: data.total,
                                  passCount: data.success,
                                  failCount: data.failure,
                                  notRunCount: data.notrun
                                }
          }
          this.chartData.stackBarChart.title = '系统单接口用例结果'
          this.total = data.total
          const size = this.chartData.stackBarChart.systemList.length
          for (let i = 0; i < size; i++) {
            this.systemOptions.push({
              label: this.chartData.stackBarChart.systemList[i],
              value: this.chartData.stackBarChart.systemList[i]
            })
          }
        }
      })
    },
    triggerTableFilter () {
      this.queryLoading = true
      fetchDailyReportTableData(this.queryParam, this.postData).then(response => {
        this.queryLoading = false
        if (response.success) {
          const data = response.data.pageData
          this.tableData = data.records
          this.total = data.total
          this.creatorOptions = [{
            creatorCode: '',
            creatorName: '根据录入人筛选'
          }].concat(response.data.creatorOptions)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
    .el-header {
        background-color: rgb(48, 65, 86);
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .dashboard-editor-container {
        padding: 32px;
        background-color: rgb(240, 242, 245);
        position: relative;
    }

    .chart-wrapper {
        background: #fff;
        padding: 16px 16px 0;
        margin-bottom: 30px;
        height: 320px;
    }

    @media (max-width: 1024px) {
        .chart-wrapper {
            padding: 8px;
        }
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

</style>
