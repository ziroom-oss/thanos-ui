<template>
    <el-container>
        <el-header>
            <i class="el-icon-s-promotion"></i>
            <span style="margin-left: 10px">接口任务集合运行报告详情</span>
        </el-header>
        <el-main>
            <el-collapse v-model="activeNames" accordion @change="handleChange">
                <el-collapse-item v-for="(item, index) in totalData" :title="'【接口任务集合名称】- ' + item.setName" :name="index" :key="index">
                    <el-row :xs="24" :sm="24" :lg="24">
                        <div style="text-align: center;margin: 50px 50px;">
                            <el-col :xs="24" :sm="24" :lg="8">
                                <el-progress type="dashboard"
                                             :percentage="parseFloat((item.successNum / item.totalNum * 100).toFixed(2))"
                                             color="#5cb87a"
                                             :stroke-width="8"></el-progress>
                                <br/>
                                <el-tag type="success" size="medium" style="margin-bottom: 20px">success数:
                                    {{item.successNum}}
                                </el-tag>
                            </el-col>
                            <el-col :xs="24" :sm="24" :lg="8">
                                <el-progress type="dashboard"
                                             :percentage="parseFloat((item.failNum / item.totalNum * 100).toFixed(2))"
                                             color="#f56c6c"
                                             :stroke-width="8"></el-progress>
                                <br/>
                                <el-tag type="danger" size="medium">failure数: {{item.failNum}}</el-tag>
                            </el-col>
                            <el-col :xs="24" :sm="24" :lg="8">
                                <el-progress type="dashboard"
                                             :percentage="parseFloat((item.skippedNum / item.totalNum * 100).toFixed(2))"
                                             color="#e6a23c"
                                             :stroke-width="8"></el-progress>
                                <br/>
                                <el-tag type="warning" size="medium">skipped数: {{item.skippedNum}}</el-tag>
                            </el-col>
                        </div>
                    </el-row>
                    <el-table
                            :data="item.resultData"
                            style="padding-top: 30px;width: 100%"
                            stripe
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
                                <span v-else-if="scope.row.recordResult ==='FAILURE'"><el-tag type="danger"
                                                                                              effect="dark">{{scope.row.recordResult}}</el-tag></span>
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
                </el-collapse-item>
            </el-collapse>
        </el-main>
    </el-container>
</template>

<script>
import { getTotalTaskSetLatestReport } from '@/api/model/taskSet'

export default {
  name: 'total-task-set-report',
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
      activeNames: [0],
      totalData: []
    }
  },
  created () {
    this.getTotalTaskSetLatestReport()
  },
  methods: {
    getTotalTaskSetLatestReport () {
      getTotalTaskSetLatestReport({ setApiType: this.$route.query.setApiType }).then(response => {
        if (response.success) {
          this.totalData = response.data
        }
      })
    },
    handleChange (val) {
      if (val.length < 0) {
        return false
      }
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
</style>
