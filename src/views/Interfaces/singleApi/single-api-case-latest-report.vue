<template>
    <el-container>
        <el-header>
            <div style="color: white; font-size:15px" align="left"><i class="el-icon-s-promotion"></i>
                运行报告
            </div>
        </el-header>
        <el-container>
            <el-aside width="20%">
                <el-table
                        :data="tableCaseName"
                        style="width: 100%; line-height: 40px; box-shadow: 0 1px 4px 1px rgba(1, 0, 0, 0.2)"
                        @row-click="oneApiCase">
                    <el-table-column
                            prop="caseName"
                            label="用例名称"
                            width="auto"
                            height="auto">
                        <template slot-scope="scope">
                            <span>{{ scope.row.caseName }}</span>
                            <span style="display: none">{{ scope.row.id }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-aside>
            <el-main>
                <el-table
                        :data="tableCaseData"
                        default-expand-all
                        style="width: 100%; line-height: 40px; box-shadow: 0 1px 4px 1px rgba(1, 0, 0, 0.2)">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left"  class="runResult-table-expand">
                                <el-form-item label="URL：">
                                    <span>{{ props.row.url }}</span>
                                </el-form-item>
                                <el-form-item label="断言：">
                                    <el-table style="width:80%" size="small" :data="props.row.assertRecordList" >
                                        <el-table-column type="index" width="50" label="序号">
                                        </el-table-column>
                                        <el-table-column width="100" prop="assertResult" label="运行状态">
                                            <template slot-scope="scope">
                                                <label style="color: yellowgreen"  v-if="scope.row.assertResult == 'SUCCESS'">SUCCESS</label>
                                                <label style="color: #ff6670" v-if="scope.row.assertResult == 'FAILURE'">FAILURE</label>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="assertContent" label="断言内容">
                                        </el-table-column>
                                    </el-table>
                                </el-form-item>
                                <el-form-item label="参数：">
                                    <span>{{ props.row.realInParam }}</span>
                                </el-form-item>
                                <el-form-item label="响应内容：">
                                    <span>{{ props.row.actualResult }}</span>
                                </el-form-item>
                                <el-form-item v-show="props.row.preSqlRecord!==null" label="前置sql执行情况：">
                                    <el-table :data="[props.row.preSqlRecord]" >
                                        <el-table-column width="80" prop="apiId" label="sqlId">
                                        </el-table-column>
                                        <el-table-column width="100" prop="recordResult" label="运行状态">
                                            <template slot-scope="scope">
                                                <label style="color: yellowgreen"  v-if="scope.row.recordResult == 'SUCCESS'">SUCCESS</label>
                                                <label style="color: #ff6670" v-if="scope.row.recordResult == 'FAILURE'">FAILURE</label>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="180" prop="realInParam" label="sql语句">
                                        </el-table-column>
                                        <el-table-column prop="actualResult" label="返回结果">
                                        </el-table-column>
                                    </el-table>
                                </el-form-item>
                                <el-form-item v-show="props.row.postSqlRecord!==null" label="后置sql执行情况：">
                                    <el-table :data="[props.row.postSqlRecord]">
                                        <el-table-column width="80" prop="apiId" label="sqlId">
                                        </el-table-column>
                                        <el-table-column width="100" prop="recordResult" label="运行状态">
                                            <template slot-scope="scope">
                                                <label style="color: yellowgreen"  v-if="scope.row.recordResult == 'SUCCESS'">SUCCESS</label>
                                                <label style="color: #ff6670" v-if="scope.row.recordResult == 'FAILURE'">FAILURE</label>
                                            </template>
                                        </el-table-column>
                                        <el-table-column width="180" prop="realInParam" label="sql语句">
                                        </el-table-column>
                                        <el-table-column prop="actualResult" label="返回结果">
                                        </el-table-column>
                                    </el-table>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>

                    <el-table-column
                            label="用例ID"
                            prop="caseId">
                    </el-table-column>
                    <el-table-column
                            label="用例名称"
                            prop="caseName">
                    </el-table-column>
                    <el-table-column
                            label="请求方式"
                            prop="requestType">
                    </el-table-column>
                    <el-table-column label="运行结果" prop="recordResult">
                        <template slot-scope="scope">
                            <label style="color: yellowgreen"  v-if="scope.row.recordResult == 'SUCCESS'">SUCCESS
                            </label>
                            <label style="color: #ff6670" v-if="scope.row.recordResult == 'FAILURE'">FAILURE
                            </label>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="环境"
                            prop="envFlag">
                    </el-table-column>
                    <el-table-column
                            label="响应时间(毫秒)"
                            prop="responseTime">
                    </el-table-column>
                    <el-table-column
                            label="执行时间"
                            prop="startTime">
                    </el-table-column>
                </el-table>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import {
  getCaseList,
  caseLatestDetail
} from '@/api/model/singleApiCaseLatestReport'

export default {
  data () {
    return {
      tableCaseName: [],
      tableCaseData: [],
      routerParams: ''
    }
  },

  created () {
    this.getRouterParam()
    this.getApiCaseList()
    this.getCaseListReport()
  },
  watch: {
    $route: 'getRouterParam'
  },

  methods: {
    getRouterParam () {
      const routerParams = this.$route.query.caseIds
      this.routerParams = routerParams
    },
    getApiCaseList () {
      // 获取case名称列表
      getCaseList({ caseIds: this.routerParams }).then(response => {
        console.log(response.data)
        this.tableCaseName = response.data
      })
    },

    getCaseListReport () {
      // 获取CASE历史列表报告
      caseLatestDetail({ caseIds: this.routerParams }).then(response => {
        this.tableCaseData = response.data
      })
    },

    // 点击左侧接口名称
    oneApiCase (row) {
      caseLatestDetail({ caseIds: row.id }).then(response => {
        this.tableCaseData = response.data
      })
    }
  }

}
</script>

<style lang="stylus" scoped>

    /deep/.el-table_1_column_1 {
        line-height: 20px;
    }

    /deep/.el-table_2_column_2 {
        line-height: 40px;
    }
    /deep/.el-table_2_column_3 {
        line-height: 40px;
    }
    /deep/.el-table_2_column_4 {
        line-height: 40px;
    }
    /deep/.el-table_2_column_5 {
        line-height: 40px;
    }
    /deep/.el-table_2_column_6 {
        line-height: 40px;
    }

    .el-header {
        background-color: #42b983;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #FFFFFF;
        color: #333;
        text-align: center;
        line-height: 200px;
        padding:20px 10px 20px 20px
    }

    .el-main {
        background-color: #FFFFFF;
        color: #333;
        text-align: center;
        line-height: 160px;
        padding:20px 20px 20px 10px
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }

    .runResult-table-expand {
        font-size: 0;
    }
    .runResult-table-expand label {
        width: 90px;
        color: #99a999;
    }
    .runResult-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }

</style>
