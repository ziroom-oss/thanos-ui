<template>
    <div class="app-container">

        <div style="height: 150px">
            <div class="search-wrap">
                <el-row :gutter="32">
                    <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">用例ID：</span>
                            <el-input class="search-item" placeholder="请输入用例ID" v-model="searchObj.caseId" clearable
                                      @keyup.enter.native="searchEv">
                            </el-input>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">用例名称：</span>
                            <el-input class="search-item" placeholder="请输入用例名称(支持模糊搜索)" v-model="searchObj.caseName"
                                      clearable @keyup.enter.native="searchEv"></el-input>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">用户姓名：</span>
                            <el-input class="search-item" placeholder="请输入用户姓名(支持模糊搜索)" v-model="searchObj.userName"
                                      clearable @keyup.enter.native="searchEv"></el-input>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">最新结果：</span>
                            <el-select class="search-item" v-model="searchObj.executionResult" placeholder="请选择"
                                       value="" clearable @change="searchEv">
                                <el-option label="成功" value="SUCCESS"></el-option>
                                <el-option label="失败" value="FAILURE"></el-option>
                                <el-option label="未运行" value="UNEXECUTED"></el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">业务线：</span>
                            <el-select class="search-item" v-model="searchObj.businessLine" placeholder="请选择"
                                       value="" clearable @change="searchEv">
                                <el-option
                                        v-for="item in this.businessList"
                                        :key="item.businessCode"
                                        :label="item.businessName"
                                        :value="item.businessCode"
                                ></el-option>
                            </el-select>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="search-btn">
                <el-button type="primary" @click="searchEv">查询</el-button>
                <el-button class="bot-btn" @click="resetSearchObj">重置</el-button>
            </div>
        </div>

        <el-row :gutter="32" style="margin-bottom: 20px">
                            <el-col :xs="2" :sm="2" :lg="2" style="margin-left:-10px">
                                <div class="search-section">
                                    <el-button type="success" size="small" style="margin-bottom: 10px" @click="addMultiCase">新增用例 </el-button>
                                </div>
                            </el-col>
                            <el-col :xs="48" :sm="48" :lg="16">
                                <div class="search-section">
                                        <span>执行情况统计范围【默认本周】：</span>
                                        <el-date-picker
                                            v-model="searchObj.startTime"
                                            format="yyyy-MM-dd"
                                            value-format="timestamp"
                                            type="daterange"
                                            align="right"
                                            unlink-panels
                                            range-separator="-"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            @change="searchEv"
                                            :picker-options="pickerOptions">
                                            </el-date-picker>
                                </div>
                            </el-col>
                </el-row>

        <el-table
                v-loading="listLoading"
                element-loading-text="拼命加载中，请稍候"
                :data="multiApiTableList"
                stripe
                fit
                border
                highlight-current-row
                style="width: 100%;font-size: 13px;"
                height="500px"
                @select="handleSelectionChange" @select-all="handleSelectionChange"
        >
            <el-table-column
                    type="selection"
                    width="50" align="center" fixed="left">
            </el-table-column>
            <el-table-column label="用例ID" align="center" width="65">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否可运行" align="center" width="90">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.runnable"
                               @change="updateMultiCaseStatusEv(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="用例名称" align="center">
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" @click="getMultiCaseDetail(scope.row.id)"><span>{{ scope.row.caseName }}</span>
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column label="业务线名称" align="center" width="140">
                <template slot-scope="scope">
                    <span>{{scope.row.businessName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户姓名" align="center" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.userName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" width="150">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="成功数/失败数/执行总数" align="center" width="135">
                <template slot-scope="scope">
                    <span>{{ scope.row.exeSuccessTotal }}/{{scope.row.exefailedTotal}}/{{scope.row.exeTotal}}</span>
                </template>
            </el-table-column>
            <el-table-column label="修改参数" align="center" width="80">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.change"
                               @change="updateMultiEditStatusEv(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="报告" align="center" width="80">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="报告" placement="top">
                        <el-button type="success" size="mini" icon="el-icon-tickets"
                                   @click="multiCaseReportToSelectEnv(scope.row.id)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="220">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-tooltip class="item" effect="dark" content="运行" placement="top">
                            <el-button type="primary" size="mini" icon="el-icon-video-play"
                                       @click="multiCaseRunToSelectEnv(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="复制" placement="top">
                            <el-button type="primary" size="mini" icon="el-icon-document-copy"
                                       @click="selectCaseToCopy(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <el-button type="primary" size="mini" icon="el-icon-edit"
                                       @click="selectCaseToEdit(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <el-button type="danger" size="mini" icon="el-icon-delete"
                                       @click="delMultiCaseById(scope.row.id)"></el-button>
                        </el-tooltip>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="multiCase.total>0" :total="multiCase.total"
                    :page.sync="multiCase.pageNum" :limit.sync="multiCase.pageSize"
                    @pagination="getMultiCaseListByPage"></pagination>

        <el-dialog title="提示信息" :visible.sync="multiCaseRunDialogVisible" width="36%" :close-on-click-modal="false"
                   @close="closeEv">
            <div style="margin-bottom: 30px;color: orange"><i class="el-icon-info"></i>请先选择多接口测试用例运行环境（默认测试环境）</div>
            <el-radio-group v-model="multiCaseRunEnv">
                <el-radio label="t" size="small">测试环境</el-radio>
                <el-radio label="q" size="small">准生产环境</el-radio>
                <el-radio label="kt" size="small">kt环境</el-radio>
                <el-radio label="p" size="small" disabled>生产环境</el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeEv">取 消</el-button>
                <el-button type="primary" @click="multiCaseSelectEnvToRun" v-loading.fullscreen.lock="fullscreenLoading"
                           element-loading-text="正在拼命运行中，请稍候">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示信息" :visible.sync="preMultiCaseRunDialogVisible" width="36%" :close-on-click-modal="false"
                   @close="preCloseEv">
            <div style="margin-bottom: 30px;color: orange;font-size: 18px"><i class="el-icon-question"></i>以下用例未查询到kt环境,是否以t环境运行?</div>
            <el-table :data="stepList" border stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="单接口ID" prop="apiId" width="100px"></el-table-column>
                <el-table-column label="用例名称" prop="content"></el-table-column>
            </el-table>
            <div style="margin-top: 30px;color: orange"><i class="el-icon-info"></i>(提示:如kt环境已上线,请检查是否将域名已维护进自动化平台~)</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="preCloseEv">取 消</el-button>
                <el-button type="primary" @click="multiCaseSelectEnvToRun" v-loading.fullscreen.lock="fullscreenLoading"
                           element-loading-text="正在拼命运行中">确 定</el-button>
                </span>
        </el-dialog>
        <el-dialog title="多接口测试用例详情" :visible.sync="multiCaseDetailDialogVisible">
            <el-table :data="multiApiDetailTbl"
                      stripe
                      fit
                      border
                      highlight-current-row
                      style="width: 100%;font-size: 13px"
                      max-height="460"
            >
                <el-table-column label="步骤序号" align="center" width="80">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="名称（用例/接口/SQL）" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.apiName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数据类型" align="center" width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.dataType | dateTypeFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import {
  deleteMultiApiCaseById, getMultiCaseDtl, getMultiCaseList,
  runMultiApiCaseById, updateMultiCaseStatus, updateMultiEditStatus, multiCaseReportToSelect, preRunMultiApiCaseById
} from '@/api/model/multiApiList'
import { getBusinessList } from '@/api/model/jmxLoadCase'

export default {
  name: 'multi-api-list',
  components: { Pagination },
  filters: {
    dateTypeFilter (dataType) {
      const dateTypeInfo = {
        0: 'SQL类型',
        1: '单接口类型',
        2: '多接口类型'
      }
      return dateTypeInfo[dataType]
    },
    resultStatusFilter (status) {
      const resultStatusInfo = {
        SUCCESS: '成功',
        FAILURE: '失败',
        UNEXECUTED: '未运行'
      }
      return resultStatusInfo[status]
    }
  },
  data () {
    return {
      businessList: '',
      listLoading: false,
      multiApiTableList: [],

      multiCase: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      fullscreenLoading: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },

      searchObj: {
        caseId: '',
        caseName: '',
        executionResult: '',
        userName: '',
        startTime: '',
        endTime: '',
        businessLine: ''
      },
      activeName: '1',
      multiCaseRunDialogVisible: false,
      preMultiCaseRunDialogVisible: false,
      multiCaseRunEnv: 't',
      multiCaseRunId: '',
      multiApiDetailTbl: [],
      multiCaseDetailDialogVisible: false,
      ktFlag: false,
      stepList: []
    }
  },
  created () {
    this.getMultiCaseListByPage()
    this.getBusinessList()
    if (this.$route.params.toRun) {
      this.multiCaseRunId = this.$route.params.caseId
      this.multiCaseRunEnv = this.$route.params.env
      this.multiCaseSelectEnvToRun()
    }
  },
  methods: {
    getMultiCaseListByPage () {
      this.listLoading = true
      const params = {
        pageNum: this.multiCase.pageNum,
        pageSize: this.multiCase.pageSize,
        id: this.searchObj.caseId,
        caseName: this.searchObj.caseName,
        userName: this.searchObj.userName,
        caseType: this.activeName,
        executionResult: this.searchObj.executionResult,
        endTime: this.searchObj.endTime,
        startTime: this.searchObj.startTime,
        busiCode: this.searchObj.businessLine
      }
      const postData = new URLSearchParams()
      Object.keys(params).forEach((item) => {
        postData.append(item, params[item])
      })

      getMultiCaseList(postData).then(response => {
        if (response.success) {
          this.multiApiTableList = response.data.records
          this.multiCase.total = response.data.total
        }
        this.listLoading = false
      })
    },
    getBusinessList () {
      getBusinessList().then(response => {
        this.businessList = response.data
      })
    },
    resetSearchObj () {
      this.searchObj = {
        caseId: '',
        caseName: '',
        executionResult: '',
        userName: '',
        startTime: '',
        endTime: ''
      }
      this.getMultiCaseListByPage()
    },
    searchEv () {
      this.getMultiCaseListByPage()
    },
    selectCaseReadyToRun (rowId) {
      this.$router.push({ path: '/interfaces/multiApi/case-run-detail', query: { id: rowId } })
    },
    // 多接口复制
    selectCaseToCopy (rowId) {
      const { href } = this.$router.resolve({
        path: '/interfaces/multiApi/multi-api-save',
        query: { id: rowId, flag: '1' }
      })
      window.open(href, '_blank')
    },
    // 多接口编辑
    selectCaseToEdit (rowId) {
      const { href } = this.$router.resolve({
        path: '/interfaces/multiApi/multi-api-save',
        query: { id: rowId, flag: '2' }
      })
      window.open(href, '_blank')
    },
    // 多接口录入
    addMultiCase () {
      const { href } = this.$router.resolve({
        path: '/interfaces/multiApi/multi-api-save',
        query: { id: '', flag: '0' }
      })
      window.open(href, '_blank')
    },
    multiCaseRunToSelectEnv (rowId) {
      this.multiCaseRunDialogVisible = true
      this.multiCaseRunId = rowId + ''
    },
    multiCaseSelectEnvToRun () {
      if (this.ktFlag) {
        this.multiCaseRunEnv = 'kt'
      }
      this.multiCaseRunDialogVisible = false
      this.preMultiCaseRunDialogVisible = false
      this.fullscreenLoading = true
      const postData = new URLSearchParams()
      postData.append('caseId', this.multiCaseRunId)
      postData.append('env', this.multiCaseRunEnv)
      if (this.ktFlag) {
        runMultiApiCaseById(postData).then(response => {
          if (response.success) {
            this.fullscreenLoading = false
            this.$message({
              type: 'success',
              message: '多接口测试用例运行操作成功~'
            })
          }
          this.fullscreenLoading = false
        })
        this.ktFlag = false
      } else {
        preRunMultiApiCaseById(postData).then(response => {
          if (response.success) {
            this.fullscreenLoading = false
            this.$message({
              type: 'success',
              message: '多接口测试用例运行操作成功~'
            })
          } else {
            this.fullscreenLoading = false
            this.preMultiCaseRunDialogVisible = true
            this.stepList = response.data.result
            this.ktFlag = true
          }
          this.fullscreenLoading = false
        })
      }
    },
    closeEv () {
      this.multiCaseRunDialogVisible = false
      this.multiCaseRunEnv = 't'
    },
    preCloseEv () {
      this.preMultiCaseRunDialogVisible = false
      this.multiCaseRunEnv = 't'
      this.ktFlag = false
    },
    updateMultiCaseStatusEv (row) {
      const isRunnable = row.runnable ? '1' : '0'
      updateMultiCaseStatus({ caseId: row.id, isEnable: isRunnable }).then(response => {
        if (response.success) {
          this.$message({
            type: 'success',
            message: '多接口测试用例可运行状态更新操作成功~'
          })
        }
      })
    },
    updateMultiEditStatusEv (row) {
      const isChange = row.change ? '1' : '0'
      updateMultiEditStatus({ caseId: row.id, isChange: isChange }).then(response => {
        if (response.success) {
          this.$message({
            type: 'success',
            message: '多接口测试用例是否需修改参数状态更新操作成功~'
          })
        }
      })
    },
    delMultiCaseById (rowId) {
      this.$confirm('确定删除本条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMultiApiCaseById({ id: rowId, caseType: this.activeName }).then(response => {
          if (response.success) {
            this.$message({
              type: 'success',
              message: '删除操作成功~'
            })
            this.getMultiCaseListByPage()
          }
        })
      }).catch(() => {
      })
    },
    getMultiCaseDetail (rowId) {
      this.multiCaseDetailDialogVisible = true
      getMultiCaseDtl({ multiCaseId: rowId, caseType: this.activeName }).then(response => {
        if (response.success) {
          this.multiApiDetailTbl = response.data
        }
      })
    },

    multiCaseReportToSelectEnv (rowId) {
      const { href } = this.$router.resolve({
        path: '/interfaces/multiApi/multi-api-report',
        query: { id: rowId }
      })
      window.open(href, '_blank')
    },
    handleSelectionChange (selection) {
      // this.$emit("apiSelection", selection)
    }
  },
  watch: {
    // 路由跳转回来之后，刷新列表
    $route () {
      this.getMultiCaseListByPage()
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
