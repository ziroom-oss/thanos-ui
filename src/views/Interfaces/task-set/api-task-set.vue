<template>
  <div class="app-container">
    <div style="height: 140px">
      <div class="search-wrap">
        <el-row :gutter="32">
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="search-section">
              <span class="search-label">任务集合名称：</span>
              <el-input
                class="search-item"
                placeholder="请输入任务集合名称(支持模糊搜索)"
                v-model="searchObj.setName"
                clearable
                @keyup.enter.native="searchEv"
              >
              </el-input>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="search-section">
              <span class="search-label">任务集合类型：</span>
              <el-select
                class="search-item"
                v-model="searchObj.setType"
                placeholder="请选择任务集合类型"
                value=""
                @change="searchEv"
              >
                <el-option label="自定义测试集合" value="0"></el-option>
                <el-option label="冒烟测试集合" value="1"></el-option>
                <el-option label="回归测试集合" value="2"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="search-section">
              <span class="search-label">项目名称：</span>
              <el-select
                class="search-item"
                v-model="searchObj.omegaName"
                placeholder="请选择项目名称"
                value=""
                filterable
                @change="searchEv"
              >
                <el-option
                  v-for="item in omegaProjectList"
                  :key="item.id"
                  :label="item.applicationName"
                  :value="item.applicationName"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="search-section">
              <span class="search-label">创建人姓名：</span>
              <el-input
                class="search-item"
                placeholder="请输入用户姓名(支持模糊搜索)"
                v-model="searchObj.userName"
                clearable
                @keyup.enter.native="searchEv"
              >
              </el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="search-btn">
        <el-button type="primary" @click="searchEv">查询</el-button>
        <el-button class="bot-btn" @click="resetSearchEv">重置</el-button>
      </div>
    </div>

    <el-row style="margin-bottom: 30px">
      <el-button type="primary" size="small" @click="addTaskSet"
        >新增集合</el-button
      >
      <el-button type="primary" size="small" @click="multiSelectedTaskSetToRun"
        >运行勾选</el-button
      >
      <el-button type="default" size="small" @click="multiSelectedTaskSetReport"
        >运行报告</el-button
      >
      <!--            <el-button type="success" size="small" @click="testMyFunc">测试按钮</el-button>-->
    </el-row>

    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="单接口任务集合" name="first">
        <data-list-table
          ref="singleTable"
          :task-set-list-prop="taskSetList"
          :page-info-prop="pageInfo"
          @getDataListEv="getDataList"
          @getTaskSetDetailEv="getTaskSetDetail"
          @editTaskSetEv="editTaskSet"
          @getLatestReportEv="getLatestReport"
        >
        </data-list-table>
      </el-tab-pane>
      <el-tab-pane label="多接口任务集合" name="second">
        <data-list-table
          ref="multiTable"
          :task-set-list-prop="taskSetList"
          :page-info-prop="pageInfo"
          @getDataListEv="getDataList"
          @getTaskSetDetailEv="getMultiTaskSetDetail"
          @editTaskSetEv="editTaskSet"
          @getLatestReportEv="getLatestReport"
        >
        </data-list-table>
      </el-tab-pane>
    </el-tabs>
    <new-task-set ref="dialogRef" :omega-project-list-prop="omegaProjectList">
    </new-task-set>
    <task-set-detail
      ref="detailRef"
      :mock-api-detail-tbl-prop="mockApiDetailTbl"
    >
    </task-set-detail>
    <multi-api-task-set-detail
      ref="multiDetailRef"
      :multi-api-detail-tbl-prop="multiApiDetailTbl"
    >
    </multi-api-task-set-detail>
    <env-selected-to-run
      :env-dialog-prop="envDialog"
      :env-prop="envVal"
      @selectEnvToRunEv="multiSelectToRun"
      @closeEnvEv="closeEnvDialog"
    >
    </env-selected-to-run>
    <history-report
      ref="historyReportRef"
      :visible-prop="historyReportVisible"
      :table-data-prop="historyReportList"
      @closeEv="historyReportVisible = false"
    >
    </history-report>
  </div>
</template>

<script>
import NewTaskSet from './components/new-task-set'
import TaskSetDetail from './components/task-set-detail'
import DataListTable from './components/data-list-table'
import {
  checkIsExistLatestReportBySetApiType,
  getApiTaskSetList,
  getMultiApiTaskSetReport,
  getMultiTaskSetDetailBySetId,
  getOmegaProjectList,
  getTaskSetDetailBySetId,
  multiApiTaskSetRun,
  singleApiTaskSetRun,
  taskSetAutoRunByOmega
} from '@/api/model/taskSet'
import EnvSelectedToRun from './components/env-selected-to-run'
import MultiApiTaskSetDetail from './components/multi-api-task-set-detail'
import HistoryReport from './components/history-report'

export default {
  name: 'api-task-set',
  components: {
    HistoryReport,
    MultiApiTaskSetDetail,
    EnvSelectedToRun,
    DataListTable,
    TaskSetDetail,
    NewTaskSet
  },
  data () {
    return {
      searchObj: {
        setType: '',
        setName: '',
        omegaName: '',
        userName: ''
      },
      omegaProjectList: [],
      mockApiDetailTbl: [],
      multiApiDetailTbl: [],
      activeName: 'first',
      taskSetList: [],
      pageInfo: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },

      envDialog: false,
      envVal: 't',
      taskSetMultiSelection: [],

      historyReportVisible: false,
      historyReportList: []
    }
  },
  created () {
    this.total = this.taskSetList.length
    this.getDataList()
    this.getOmegaProjectList()
  },
  methods: {
    searchEv () {
      this.getDataList()
    },
    resetSearchEv () {
      this.searchObj = {}
      this.getDataList()
    },
    testMyFunc () {
      taskSetAutoRunByOmega().then((response) => {
        console.log(response)
      })
    },
    addTaskSet () {
      if (this.activeName === 'first') {
        this.$refs.dialogRef.form.apiType = 0
        this.$refs.dialogRef.getSingleApiCaseList()
      } else {
        this.$refs.dialogRef.form.apiType = 1
        this.$refs.dialogRef.getMultiApCaseList()
      }
      this.$refs.dialogRef.isEditTaskSet = false
      this.$refs.dialogRef.mockApiChooseForm = true
    },
    multiSelectedTaskSetToRun () {
      this.taskSetMultiSelection =
        this.activeName === 'first'
          ? this.$refs.singleTable.$refs.multipleTable.selection
          : this.$refs.multiTable.$refs.multipleTable.selection
      if (!this.taskSetMultiSelection.length > 0) {
        this.$message({
          type: 'warning',
          message: '请先选择需要运行的接口任务集合列表'
        })
        return false
      } else if (this.taskSetMultiSelection.length > 5) {
        this.$message({
          type: 'warning',
          message: '最多支持同时运行 5 条接口任务集合，请重新选择'
        })
        return false
      } else {
        this.envDialog = true
      }
    },
    multiSelectToRun (env) {
      this.envDialog = false
      let setIdListStr = ''
      this.taskSetMultiSelection.forEach((item) => {
        setIdListStr += item.id + ','
      })

      if (setIdListStr.length > 0) {
        setIdListStr = setIdListStr.substr(0, setIdListStr.length - 1)
      }

      const loading = this.$loading({
        lock: true,
        text: '正在拼命运行中，请稍候',
        spinner: 'el-icon-loading'
      })

      const postData = new URLSearchParams()
      postData.append('env', env)
      postData.append('setIdList', setIdListStr)

      if (this.activeName === 'first') {
        singleApiTaskSetRun(postData).then((response) => {
          loading.close()
          if (response.success) {
            this.$message({
              type: 'success',
              message: '多接口任务集合运行操作成功'
            })
          }
        })
      } else {
        multiApiTaskSetRun(postData).then((response) => {
          loading.close()
          if (response.success) {
            this.$message({
              type: 'success',
              message: '多接口任务集合运行操作成功'
            })
          }
        })
      }
    },
    getDataList () {
      const postData = {
        type: this.searchObj.setType,
        name: this.searchObj.setName,
        omegaName: this.searchObj.omegaName,
        userName: this.searchObj.userName
      }
      if (this.activeName === 'first') {
        postData.apiType = 0
      } else {
        postData.apiType = 1
      }
      getApiTaskSetList(
        {
          pageNum: this.pageInfo.pageNum,
          pageSize: this.pageInfo.pageSize
        },
        postData
      ).then((response) => {
        if (response.success) {
          this.taskSetList = response.data.records
          this.pageInfo.total = response.data.total
        }
      })
    },
    getLatestReport (setId) {
      getMultiApiTaskSetReport({ setId: setId, number: 5 }).then((response) => {
        if (response.success) {
          this.historyReportList = response.data
          this.historyReportVisible = true
        }
      })
    },
    editTaskSet (id) {
      if (this.activeName === 'first') {
        this.$refs.dialogRef.form.apiType = 0
        this.$refs.dialogRef.getSingleApiCaseList()
      } else {
        this.$refs.dialogRef.form.apiType = 1
        this.$refs.dialogRef.getMultiApCaseList()
      }

      this.$refs.dialogRef.getTaskSetDetailInfoBySetId(id)
      this.$refs.dialogRef.formTitle = '接口任务集合编辑'
      this.$refs.dialogRef.isEditTaskSet = true
      this.$refs.dialogRef.mockApiChooseForm = true
    },
    getTaskSetDetail (setId) {
      getTaskSetDetailBySetId({ setId: setId }).then((response) => {
        if (response.success) {
          this.mockApiDetailTbl = response.data
          this.$refs.detailRef.mockApiDetailForm = true
        }
      })
    },
    getMultiTaskSetDetail (setId) {
      getMultiTaskSetDetailBySetId({ setId: setId }).then((response) => {
        if (response.success) {
          this.multiApiDetailTbl = response.data
          this.$refs.multiDetailRef.multiApiDetailForm = true
        }
      })
    },
    handleClick () {
      this.getDataList()
    },
    getOmegaProjectList () {
      getOmegaProjectList().then((response) => {
        this.omegaProjectList = response.data.data
      })
    },
    closeEnvDialog () {
      this.envVal = 't'
      this.envDialog = false
    },
    multiSelectedTaskSetReport () {
      checkIsExistLatestReportBySetApiType({
        setApiType: this.activeName === 'first' ? 0 : 1
      }).then((response) => {
        if (response.success) {
          if (response.data) {
            const { href } = this.$router.resolve({
              path:
                this.activeName === 'first'
                  ? '/interfaces/task-set/components/total-task-set-report'
                  : '/interfaces/task-set/components/multi-task-set-report',
              query: { setApiType: this.activeName === 'first' ? 0 : 1 }
            })
            window.open(href, '_blank')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
/deep/ .search-wrap {
  width: 94%;
}

/deep/ .search-label {
  width: 18%;
}

/deep/ .search-wrap {
  height: 140px;
}
</style>
