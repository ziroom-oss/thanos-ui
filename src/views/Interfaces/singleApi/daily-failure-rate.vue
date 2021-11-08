<template>
    <el-container>
        <el-header>
            <div style="color: white; font-size:15px" align="left">
                单接口失败分析
            </div>
        </el-header>
        <el-main>
            <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :lg="24">
                    <div class="chart-wrapper">
                        <stack-bar-chart-with-pie :chartData="chartData"></stack-bar-chart-with-pie>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="24">
                    <div style=" background: #fff;padding: 16px 16px 0;">
                        <el-select v-model="postData.exceptionType"
                                   placeholder="请选择异常类型" value="" @change="triggerTableFilter">
                            <el-option
                                    v-for="item in exceptionTypeOptions"
                                    :key="item.label"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="postData.systemName"
                                   filterable
                                   placeholder="请选择系统" value="" @change="triggerTableFilter">
                            <el-option
                                    v-for="item in systemOptions"
                                    :key="item.label"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="postData.businessLine"
                                   placeholder="请选择业务线" value="" @change="triggerTableFilter">
                            <el-option
                                    v-for="item in businessLineOptions"
                                    :key="item.label"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="postData.creatorCode"
                                   placeholder="请选择录入人" value="" @change="triggerTableFilter">
                            <el-option
                                    v-for="item in creatorOptions"
                                    :key="item.label"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <el-button style="margin-left: 30px" type="primary" @click="triggerTableFilter">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                        <el-table :data="tableData" v-loading="queryLoading">
                            <el-table-column type="expand">
                                <template slot-scope="scope">
                                    <el-form label-position="left" inline class="table-expand">
                                        <el-form-item label="请求类型:">
                                            <span>{{ scope.row.requestType }}</span>
                                        </el-form-item>
                                        <el-form-item label="实际请求参数:">
                                            <span>{{ scope.row.realInParam }}</span>
                                        </el-form-item>
                                        <el-form-item label="预期结果:">
                                            <span>{{ scope.row.expectedResults }}</span>
                                        </el-form-item>
                                        <el-form-item label="返回结果:">
                                            <span>{{ scope.row.failReason }}</span>
                                        </el-form-item>
                                    </el-form>
                                </template>
                            </el-table-column>
                            <el-table-column label="用例ID" prop="apiId" align="center"/>
                            <el-table-column label="用例名称" prop="apiName" align="center"/>
                            <el-table-column label="异常类型" prop="exceptionType" align="center"/>
                            <el-table-column label="系统名称" prop="systemName" align="center"/>
                            <el-table-column label="Jira Key" align="center">
                                <template slot-scope="scope">
                                    <el-button size="small" type="danger" @click="visitJira(scope.row.validJiraKey)"
                                               plain v-if="scope.row.validJiraKey">
                                        {{ scope.row.validJiraKey}}
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="录入人" prop="realName" align="center"/>
                            <el-table-column label="所属组" prop="groupName" align="center"/>
                            <el-table-column label="运行时间" prop="version" align="center"/>
                        </el-table>
                        <pagination v-show="total > 0" :page.sync="postData.pageNum" :total="total"
                                    :limit.sync="postData.pageSize"
                                    @pagination="triggerTableFilter"/>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import
{
  fetchFailureRateTable,
  fetchChartData,
  fetchOptionList
} from '@/api/singleApi/single-api-failure-rate'
import Pagination from '@/components/Pagination/index'
import StackBarChartWithPie from './components/StackBarChartWithPie'

export default {
  name: 'dailyFailureRate',
  components: {
    StackBarChartWithPie,
    Pagination
  },
  data () {
    return {
      jiraUrlPrefix: 'jira.ziroom.com/projects/ISSUE/issues/',
      chartData: {
        businessLineList: [],
        exceptionTypeList: [],
        seriesData: {},
        pieData: []
      },
      postData: {
        systemName: '',
        exceptionType: '',
        businessLine: '',
        creatorCode: '',
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      queryLoading: false,
      systemOptions: [{
        value: '',
        label: '根据系统名称筛选'
      }],
      exceptionTypeOptions: [
        {
          value: '',
          label: '根据异常类型筛选'
        }
      ],
      businessLineOptions: [
        {
          value: '',
          label: '根据业务线范围筛选'
        }
      ],
      creatorOptions: [{
        value: '',
        label: '根据录入人筛选'
      }]
    }
  },
  created () {
    this.getChartData()
    this.initOptionList()
    this.triggerTableFilter()
  },
  methods: {
    getChartData () {
      fetchChartData().then(response => {
        if (response.success) {
          const allData = response.data
          this.chartData.businessLineList = allData.businessList
          this.chartData.exceptionTypeList = allData.exceptionList
          this.chartData.seriesData = allData.data
          for (const exType in allData.data) {
            let num = 0
            const arr = allData.data[exType]
            for (let i = 0; i < arr.length; i++) {
              num += arr[i]
            }
            this.chartData.pieData.push({
              name: exType,
              value: num
            })
          }
        }
      })
    },
    triggerTableFilter () {
      this.queryLoading = true
      fetchFailureRateTable(this.postData).then(response => {
        this.queryLoading = true
        this.tableData = response.data
        this.total = response.recordsTotal
        this.queryLoading = false
      })
    },
    resetSearch () {
      this.postData = {
        systemName: '',
        exceptionType: '',
        businessLine: '',
        creatorCode: '',
        pageNum: 1,
        pageSize: 10
      }
      this.triggerTableFilter()
    },
    initOptionList () {
      fetchOptionList().then(response => {
        if (response.success) {
          this.systemOptions = this.systemOptions.concat(response.data.systemNameOptions)
          this.exceptionTypeOptions = this.exceptionTypeOptions.concat(response.data.failureTypeOptions)
          this.businessLineOptions = this.businessLineOptions.concat(response.data.businessLineOptions)
          this.creatorOptions = this.creatorOptions.concat(response.data.creatorOptions)
        }
      })
    },
    visitJira (jiraKey) {
      window.open('http://jira.ziroom.com/projects/ISSUE/issues/' + jiraKey, '_blank')
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
        width: 100%;
    }

</style>
