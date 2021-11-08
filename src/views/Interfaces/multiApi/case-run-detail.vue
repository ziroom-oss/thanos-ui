<template>
    <div class="app-container">
        <div style="height: 150px">
            <div style="width: 75%;float: left">
                <div class="height45"><span class="position-middle">用例名称：{{caseDetail.caseName}}</span>
                </div>
                <div class="height45">
                    <span class="position-middle">应用状态：</span>
                    <span class="position-middle" v-for="item in caseDetail.application" :key="item.domain">{{item.domain}}
                        <el-button class="status-btn" v-if="item.status === 'success'" type="success" circle
                                   size="mini"></el-button>
                        <el-button class="status-btn" v-else type="danger" circle size="mini"></el-button>
                    </span>
                </div>
                <div v-show="componmentListShow">
                    <div class="height45" v-for="componment in componmentList" :key="componment.id">
                        <span class="position-middle">{{componment.componmentName}}：</span>
                        <el-input class="position-middle" v-if="componment.componmentType === 1"
                                  v-model="componment.paramVal "
                                  style="width: 150px;"
                                  placeholder="请输入参数值">
                        </el-input>
                        <el-select class="position-middle" v-else v-model="componment.paramVal"
                                   placeholder="请选择" value=""
                                   clearable>
                            <el-option
                                    v-for="item in componment.wigetParamList"
                                    :key="item.paramVal"
                                    :value="item.paramVal"
                                    :label="item.paramLable">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn" style="width: 100px">
                <el-button style="float: right;" type="success" @click="runCaseToSelectEnvEv">运行</el-button>
                <div style="float: right">
                    <el-tooltip effect="dark" placement="left">
                        <div slot="content">当且仅当运行存在运行失败步骤时，<br/>点击右侧按钮从失败断点处重新继续运行</div>
                        <i style="color: lightgrey" class="el-icon-info"></i>
                    </el-tooltip>
                    <el-button class="bot-btn" type="warning" @click="failurePointRerun" :disabled="failureRetryFlag">
                        重试
                    </el-button>
                </div>
            </div>

            <el-dialog title="提示信息" :visible.sync="multiCaseRunDialogVisible" width="36%" :close-on-click-modal="false"
                       @close="closeEv">
                <div style="margin-bottom: 30px;color: orange"><i class="el-icon-info"></i>请先进行选择运行环境（默认测试环境）</div>
                <el-radio-group v-model="multiCaseRunEnv">
                    <el-radio label="t" size="small">测试环境</el-radio>
                    <el-radio label="q" size="small">准生产环境</el-radio>
                    <el-radio label="kt" size="small">kt环境</el-radio>
                    <el-radio label="p" size="small" disabled>生产环境</el-radio>
                </el-radio-group>
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeEv">取 消</el-button>
                <el-button type="primary" @click="multiCaseSelectEnvToRun" v-loading.fullscreen.lock="fullscreenLoading"
                           element-loading-text="正在拼命运行中">确 定</el-button>
            </span>
            </el-dialog>

            <el-dialog title="提示信息" :visible.sync="preMultiCaseRunDialogVisible" width="36%" :close-on-click-modal="false"
                       @close="closeEv">
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
        </div>

        <h4 class="h4-info-msg">用例步骤列表：
            <span style="font-size: 13px">（数量：{{caseDetail.caseSteps.length}} 条）</span>
            <span style="margin-left: 10px;color: orange;font-size: 13px">
                <i class="el-icon-info"></i> 运行完成后点击下方步骤名称，分别查看对应日志详情
            </span>
        </h4>

        <el-steps :active="activeStep" simple>
            <el-step style="cursor:pointer" v-for="(item,index) in caseDetail.caseSteps" :key="index"
                     :title="item.stepName"
                     :status="item.status | statusFilter" v-on:click.native="getStepResultLog(item.records)">
            </el-step>
        </el-steps>
        <h4>用例运行日志详情：</h4>
        <el-input type="textarea" :rows="20" v-model="caseDetail.resultLog" readonly></el-input>
    </div>
</template>

<script>
import {
  makeDataDetailInfo,
  moduleRunRecords,
  getCommonParamList,
  retryRunMultiCaseData,
  runMultiCaseData,
  preRunMultiCaseData
} from '../../../api/multi-api/multi-api-save'

export default {
  name: 'case-run-detail',
  filters: {
    statusFilter (status) {
      const statusMap = {
        success: 'success',
        failure: 'error',
        block: 'wait'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      caseDetail: {
        caseName: '',
        application: [],
        caseSteps: [],
        resultLog: '',
        pubParam: ''
      },
      componmentList: [],
      componmentListShow: false,
      payType: '1',
      routerParams: '',
      failureRetryFlag: true,
      multiCaseRunDialogVisible: false,
      preMultiCaseRunDialogVisible: false,
      multiCaseRunEnv: 't',
      varPool: {},
      failureOrderId: 0,
      fullscreenLoading: false,
      activeStep: 0,
      toRun: false,
      stepList: [],
      ktFlag: false
    }
  },
  created () {
    this.getRouterParam()
    if (this.$route.params.toRun) {
      this.fullscreenLoading = true
      this.toRun = true
      this.multiCaseRunEnv = this.$route.params.env
    }
  },
  methods: {
    getMultiCaseDataDtl (caseId) {
      makeDataDetailInfo({ caseId: caseId }).then(response => {
        if (response.success) {
          this.caseDetail = response.data
          // 公共参数反显
          this.showComponmentDetail()
          if (this.caseDetail.resultLog === null) {
            this.caseDetail.resultLog = '用例场景未运行，暂无用例场景日志详情信息'
          }
        }
      })
    },
    async showComponmentDetail () {
      this.componmentList = []
      if (this.caseDetail.pubParam !== '') {
        var returnObj = JSON.parse(this.caseDetail.pubParam)
        for (var i = 0; i < returnObj.length; i++) {
          var componment = {}
          var obj = returnObj[i]
          componment.componmentId = obj.componmentId
          componment.paramVal = obj.paramVal
          componment.componmentName = obj.componmentName
          componment.componmentType = obj.componmentType
          componment.paramKey = obj.paramKey
          await getCommonParamList({ componmentId: obj.componmentId }).then(response => {
            componment.wigetParamList = response.data
          })
          this.componmentList.push(componment)
        }
        this.componmentListShow = true
        if (this.toRun) {
          this.multiCaseSelectEnvToRun()
        }
      }
    },
    runCaseToSelectEnvEv () {
      this.multiCaseRunDialogVisible = true
      this.multiCaseRunEnv = 't'
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
    getStepResultLog (records) {
      if (records === undefined || records === '') {
        this.$message({
          type: 'warning',
          message: '当前选中步骤状态为未运行状态，暂无运行日志详情'
        })
        return false
      }
      moduleRunRecords({ recordIds: records }).then(response => {
        if (response.success) {
          this.caseDetail.resultLog = response.data
        }
      })
    },
    updateMultiCaseDataForm (response) {
      if (response.success) {
        this.caseDetail.caseSteps = response.data.caseSteps
        this.varPool = response.data.varPool
        // 判断失败步骤，如果全部成功停留在最后步骤
        for (let i = this.caseDetail.caseSteps.length - 1; i > 0; i--) {
          if (this.caseDetail.caseSteps[i].status !== 'block') {
            this.failureRetryFlag = this.caseDetail.caseSteps[this.caseDetail.caseSteps.length - 1].status === 'success'
            this.failureOrderId = i
            this.activeStep = i
            break
          }
        }
        this.$message({
          type: 'success',
          message: '造数据场景用例运行操作完成~'
        })
        // 运行结束后自动定位到失败步骤，并显示日志详情
        this.getStepResultLog(this.caseDetail.caseSteps[this.activeStep].records)
      } else {
        this.$message({
          type: 'error',
          message: response.errorMessage ? response.errorMessage : '造数据场景用例运行操作失败~'
        })
      }
      this.fullscreenLoading = false
    },
    formatComponmentList () {
      var pubParamStr = ''
      if (this.componmentList.length !== 0) {
        var pubParamTransfer = []
        var pubParam = this.componmentList
        for (var i = 0; i < pubParam.length; i++) {
          var obj = pubParam[i]
          if (obj.componmentType !== 2) {
            delete obj.wigetParamList
          }
          pubParamTransfer.push(obj)
          pubParamStr = JSON.stringify(pubParamTransfer)
        }
      }
      return pubParamStr
    },
    multiCaseSelectEnvToRun () {
      if (this.ktFlag) {
        this.multiCaseRunEnv = 'kt'
      }
      this.multiCaseRunDialogVisible = false
      this.preMultiCaseRunDialogVisible = false
      this.fullscreenLoading = true
      var pubParamStr = this.formatComponmentList()
      var totalParam = { caseId: this.routerParams, env: this.multiCaseRunEnv, pubParam: pubParamStr }
      var params = new URLSearchParams()
      for (const item in totalParam) {
        if (totalParam.hasOwnProperty(item)) {
          params.append(item, totalParam[item])
        }
      }
      if (this.ktFlag) {
        runMultiCaseData(params).then(response => {
          if (response.success) {
            this.updateMultiCaseDataForm(response)
          }
        })
        this.ktFlag = false
      } else {
        preRunMultiCaseData(params).then(response => {
          if (response.success && response.data.caseSteps != null) {
            this.updateMultiCaseDataForm(response)
          } else {
            this.preMultiCaseRunDialogVisible = true
            this.fullscreenLoading = false
            this.stepList = response.data.result
            this.ktFlag = true
          }
        })
      }
    },
    failurePointRerun () {
      this.multiCaseRunDialogVisible = false
      this.fullscreenLoading = true
      retryRunMultiCaseData({
        caseId: this.routerParams,
        orderId: this.failureOrderId + 1, // 失败重试顺序id从1开始
        env: this.multiCaseRunEnv
      }, this.varPool).then(response => {
        this.updateMultiCaseDataForm(response)
      })
    },
    getRouterParam () {
      this.routerParams = this.$route.query.id
      if (this.routerParams !== '' && this.routerParams !== undefined) {
        this.getMultiCaseDataDtl(this.routerParams)
      }
    }
  },
  watch: {
    $route (to, from) {
      // 增加判断指定情况下刷新页面列表
      if (to.name === 'case-run-detail' && from.name === 'make-data-list' && this.routerParams !== this.$route.query.id) {
        this.getRouterParam()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
    .height45 {
        height: 45px
    }

    .status-btn {
        margin-right: 30px;
        vertical-align: middle
    }

    .position-middle {
        vertical-align middle
    }

    .h4-info-msg {
        width: 100%;
        display: inline-block;
    }

    /deep/ .el-steps--simple {
        padding: 12px 2%
    }

    /deep/ .el-step.is-simple .el-step__title {
        font-size 13px
    }
</style>
