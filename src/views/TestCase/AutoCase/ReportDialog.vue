<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    width="80%"
    custom-class="dialogClass"
    :close-on-click-modal="false"
    @open="getreportList"
    @close="$emit('closeReportDialog')"
  >
    <el-tabs>
      <el-tab-pane
        :label="item.caseName"
        v-for="item of reportList"
        :key="item.id"
        :name="item.name"
      >
        <el-table
          :data="reportDetails[item.id]"
          height="365"
          border
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template #default="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="用例版本号：">
                  <span>{{ props.row.version }}</span>
                </el-form-item>
                <el-form-item label="记录名称">
                  <span>{{ props.row.recordName }}</span>
                </el-form-item>
                <el-form-item label="请求URL：">
                  <span>{{ props.row.requestUrl }}</span>
                </el-form-item>
                <el-form-item label="断言：">
                  <span>{{ props.row.list }}</span>
                </el-form-item>
                <el-form-item label="请求参数Body：">
                  <span>{{ props.row.requestBody }}</span>
                </el-form-item>
                <el-form-item label="请求参数Param：">
                  <span>{{ props.row.realInParam }}</span>
                </el-form-item>
                <el-form-item label="返回值：">
                  <span>{{ props.row.actualResult }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="请求方式"
            prop="requestType"
          ></el-table-column>
          <el-table-column label="运行结果" prop="recordResult">
            <template slot-scope="scope">
              <span>
                {{ scope.row.recordResult === "SUCCESS" ? "通过" : "失败" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="环境" prop="envFlag"></el-table-column>
          <el-table-column
            label="响应时间(毫秒)"
            prop="responseTime"
          ></el-table-column>
          <el-table-column label="执行时间" prop="startTime"></el-table-column>
          <el-table-column label="执行人" prop="userCode"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { caseLatestDetail } from '@/api/model/singleApiCaseLatestReport'
export default {
  name: 'ApiCaseSearch',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    reportList: {
      type: Array,
      default () {
        return []
      }
    },
    title: {
      type: String,
      default: '历史报告'
    }
  },
  data: function () {
    return {
      reportDetails: {},
      tabsShow: ''
    }
  },
  methods: {
    async getreportList () {
      const caseIdList = this.reportList.map((item) => item.id)
      const res = await caseLatestDetail({ caseIdList })
      if (res.success) {
        const obj = {}
        for (const item of res.data) {
          const { caseId } = item
          if (Array.isArray(obj[caseId])) {
            obj[caseId].push(item)
          } else {
            obj[caseId] = [item]
          }
        }

        this.reportDetails = obj
      }
    }
  }
}
</script>

<style scoped lang="scss">
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
  width: 50%;
}
</style>
<style lang="scss">
.dialogClass {
  border-radius: 10px;
  .el-form-item__label {
    // font-size: 20px;
    font-weight: 700;
  }
}
.mailTable,
.mailTable tr,
.mailTable tr td {
  border: 1px solid #e6eaee;
  width: 100%;
}
.mailTable {
  font-size: 16px;
  color: #71787e;
}
.mailTable tr td {
  border: 1px solid #e6eaee;
  width: 150px;
  height: 50px;
  line-height: 35px;
  box-sizing: border-box;
  padding: 0 10px;
}
.mailTable tr td.column {
  background-color: #eff3f6;
  color: #393c3e;
  width: 80px;
}
</style>
