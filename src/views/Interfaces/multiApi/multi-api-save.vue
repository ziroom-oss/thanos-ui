<template>
    <div class="app-container">
        <H3 class="h-font">{{titleName}}</H3>
        <el-divider></el-divider>
        <el-form :label-position="labelPosition" ref="multiSaveForm" :model="multiSaveForm" :rules="rules"
                 class="demo-ruleForm" label-width="140px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="场景名称:" prop="multiCaseName" style="width: 60%">
                        <el-input v-model="multiSaveForm.multiCaseName" placeholder="请输入场景名称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="公共参数:">
                        <div>
                            <div style="margin-bottom: 5px">
                                <el-button size="mini" type="success"
                                           icon="el-icon-circle-plus-outline" @click="insertEvent(-1)">新增
                                </el-button>
                                <el-tooltip content="点击左侧按钮新增多接口用例公共参数（支持单次新增多条）" placement="right">
                                    <i style="margin-left: 5px;color: gray;" class="el-icon-question"></i>
                                </el-tooltip>
                            </div>
                            <div>
                                <elx-editable ref="editable" :data.sync="multiSaveForm.pubParamData" border
                                              style="width: 55%;font-size: 13px"
                                              empty-text="请点击【新增】添加公共参数">
                                    <elx-editable-column prop="paramKey" align="center" label="参数名称"
                                                         :edit-render="{name: 'ElInput'}"></elx-editable-column>
                                    <elx-editable-column prop="paramVal" align="center" label="参数值"
                                                         :edit-render="{name: 'ElInput'}"></elx-editable-column>
                                    <elx-editable-column align="center" label="操作">
                                        <template slot-scope="scope">
                                            <el-button
                                                    @click.native.prevent="deleteRow(scope.$index, multiSaveForm.pubParamData)"
                                                    type="text"
                                                    size="small">删除
                                            </el-button>
                                        </template>
                                    </elx-editable-column>
                                </elx-editable>
                            </div>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label=":" prop="busCode">
                        <el-select v-model="multiSaveForm.busCode" filterable placeholder="请选择业务线信息" clearable value=""
                                   style="width: 100%;">
                            <el-option
                                    v-for="item in businessList"
                                    :key="item.businessCode"
                                    :value="item.businessCode"
                                    :label="item.businessName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="录入步骤类型:" prop="stepType">
                        <saveTypeChoose :showMakeDataButton="false"
                                        v-on:transferSingleApi="transferSingleApi"
                                        v-on:transferMultiApi="transferMultiApi"
                                        v-on:transferSql="transferSql"></saveTypeChoose>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="步骤详情列表:" prop="stepDetail">
                        <multiStepTable :multiApiStepListF="this.multiSaveForm.multiApiStepList" :colShow="false"
                                        :typeFlag="this.editCopyInfo.flag"
                                        v-on:changeStatus="changeStatus"
                                        v-on:stepOrder="stepOrder"
                                        v-on:getDeleteMultiApiStepIds="getDeleteMultiApiStepIds"
                                        :loading="loading"></multiStepTable>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="手动造数据用时:" prop="saveTime" width="200px">
                    <el-input style="width:100px" v-model="multiSaveForm.saveTime"></el-input>
                    h(例如:0.5h,2h,24h，单位统一为小时)
                    <el-button style="margin-left: 30px" type="primary" @click="commitCase(1, true)" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="正在拼命保存中">保存</el-button>
                    <el-button style="margin-left: 30px" type="success" @click="commitCase(2, true)" v-if="editCopyInfo.flag == '1' ">保存至数据工具</el-button>
                    <el-button style="margin-left: 30px" type="success" @click="runCaseToSelectEnvEv" >一键运行</el-button>
                </el-form-item>
            </el-row>
        </el-form>
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
                           element-loading-text="正在保存中，请稍候">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getBusiList } from '@/api/model/singleApiSave'
import saveTypeChoose from './components/save-type-choose'
import multiStepTable from './components/multi-step-table'
import {
  getComponmentList,
  getCommonParamList,
  saveMultiApiCase,
  checkCaseName,
  editMultiApiCase
  , formatMultiApiCaseSteps
} from '@/api/model/multiApiSave'
import { mapState } from 'vuex'
import { getMultiCaseToEditDtl } from '@/api/model/multiApiList'

export default {
  name: 'multi-api-save',
  components: { saveTypeChoose, multiStepTable },
  data () {
    var validateCheckCaseName = (rule, value, callback) => {
      if (value !== '' && this.editCopyInfo.flag != '2') {
        checkCaseName({ caseName: value }).then(response => {
          if (response.data) {
            callback(new Error('该用例名称已被使用，请更换！'))
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    }
    return {
      multiSaveForm: {
        multiCaseName: '',
        busCode: '',
        multiApiStepList: [],
        saveTime: '',
        pubParamData: [],
        deleteMultiApiStepIds: [],
        runnable: 1,
        createUserCode: '',
        updateUserCode: '',
        del: 0,
        change: 0,
        createTime: ''

      },
      rules: {
        busCode: [
          { required: true, message: '请选择业务线信息', trigger: 'blur' }
        ],
        multiCaseName: [
          { required: true, message: '请输入场景名称', trigger: 'blur' },
          { validator: validateCheckCaseName, trigger: 'blur' }
        ],

        saveTime: [
          { required: true, message: '请输入时间', trigger: 'blur' }
        ]
      },
      labelPosition: 'left',
      // 业务线列表信息
      businessList: [
        {
          businessName: '',
          businessCode: ''
        }
      ],
      // 公共参数用
      createForm: false,
      widgetId: '',
      widgetList: [],
      caseType: '1',
      pubJson: {},
      widgetDetailList: [],
      multiApiList: [],
      stepOrder1: '',

      editCopyInfo: {
        caseId: '',
        flag: ''// flag:1 - 复制，flag:2 - 编辑
      },
      titleName: '',
      loadedFromApiStorage: false,
      loading: false,
      fullscreenLoading: false,
      multiCaseRunDialogVisible: false,
      multiCaseRunEnv: 't',
      caseRunId: ''
    }
  },
  created () {
    this.getRouterParam()
    this.loadApiStorageSteps()
    this.getBusiList()
    // this.getComponmentList();
    this.caseRunId = this.editCopyInfo.caseId
  },
  methods: {
    getRouterParam () {
      this.editCopyInfo.caseId = this.$route.query.id
      this.editCopyInfo.flag = this.$route.query.flag
      if (this.$route.query.loaded) {
        this.loadedFromApiStorage = true
      }
      this.setTitle(this.editCopyInfo.flag)
      if (this.editCopyInfo.caseId !== '' && this.editCopyInfo.flag !== '') {
        this.getMultiApiCaseDtlForEditOrCopy(this.editCopyInfo.caseId)
      }
    },
    // 复制和编辑操作时，根据caseId查询详情
    getMultiApiCaseDtlForEditOrCopy (rowId) {
      getMultiCaseToEditDtl({ id: rowId }).then(response => {
        if (response.success) {
          const responseData = response.data
          this.multiSaveForm = {
            multiCaseName: responseData.caseName,
            busCode: responseData.busiCode,
            multiApiStepList: responseData.stepList,
            saveTime: responseData.manualTime,
            deleteMultiApiStepIds: [],
            runnable: responseData.runnable,
            createUserCode: responseData.createUserCode,
            updateUserCode: responseData.updateUserCode,
            del: responseData.del,
            change: responseData.change,
            createTime: responseData.createTime
          }
          if (responseData.pubParam !== null && responseData.pubParam !== '') {
            this.multiSaveForm.pubParamData = JSON.parse(responseData.pubParam)
          } else {
            this.multiSaveForm.pubParamData = []
          }
        }
      })
    },
    setTitle (flag) {
      if (flag === '0') {
        this.titleName = '多接口录入页面'
      } else if (flag === '1') {
        this.titleName = '多接口复制页面'
      } else {
        this.titleName = '多接口编辑页面'
      }
    },
    // 获取业务线列表
    getBusiList () {
      getBusiList().then(response => {
        this.businessList = response.data
      })
    },
    // 公共参数用
    async createWidget () {
      if (this.widgetId.length === 0) {
        this.$message({
          message: '请先选择控件名称，之后进行控件一键生成操作',
          type: 'warning'
        })
        return false
      }

      this.createForm = true
      for (var i = 0; i < this.widgetId.length; i++) {
        for (var j = 0; j < this.widgetList.length; j++) {
          if (this.widgetId[i] === this.widgetList[j].id) {
            var wigetDetail = this.widgetList[j]
            await getCommonParamList({ componmentId: this.widgetId[i] }).then(response => {
              wigetDetail.wigetParamList = response.data
            })
            this.widgetDetailList.push(wigetDetail)
          }
        }
      }
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    insertEvent (row) {
      this.$refs.editable.insertAt({}, row).then(({ row }) => this.$refs.editable.setActiveCell(row))
    },

    removeWigetList (item) {
      var index = this.widgetDetailList.indexOf(item)
      if (index !== -1) {
        this.widgetDetailList.splice(index, 1)
      }
    },
    // --------------------------
    // 录入步骤子组件-》父组件
    // 单接口
    transferSingleApi (data) {
      for (var i = 0; i < data.length; i++) {
        var obj = data[i]
        debugger
        this.multiSaveForm.multiApiStepList.push(obj)
      }
    },
    // 多接口
    transferMultiApi (data) {
      for (var i = 0; i < data.length; i++) {
        var obj = data[i]
        this.multiSaveForm.multiApiStepList.push(obj)
      }
    },
    // sql
    transferSql (data) {
      for (var i = 0; i < data.length; i++) {
        var obj = data[i]
        this.multiSaveForm.multiApiStepList.push(obj)
      }
    },
    // ------
    // 同步验证结果
    changeStatus (data) {
      this.multiSaveForm.multiApiStepList = data
    },
    // 获取step删除的ID
    getDeleteMultiApiStepIds (data) {
      this.multiSaveForm.deleteMultiApiStepIds = data
    },

    runCaseToSelectEnvEv () {
      // 先保存
      this.commitCase(1, false)
    },

    multiCaseSelectEnvToRun () {
      this.$router.push({ name: 'multiApiList', params: { toRun: true, caseId: this.caseRunId, env: this.multiCaseRunEnv } })
    },

    closeEv () {
      this.multiCaseRunDialogVisible = false
      this.multiCaseRunEnv = 't'
    },

    commitCase (flag, closePage) {
      this.$refs.multiSaveForm.validate((valid) => {
        if (valid) {
          var publicData = ''
          if (flag !== 2) {
            if (this.multiSaveForm.pubParamData.length !== 0) {
              publicData = JSON.stringify(this.multiSaveForm.pubParamData)
            }
          }

          var steps = ''
          for (var j = 0; j < this.multiSaveForm.multiApiStepList.length; j++) {
            this.multiSaveForm.multiApiStepList[j].orderId = j + 1
            steps += this.multiSaveForm.multiApiStepList[j].orderId + ','
          }
          steps = steps.substring(0, steps.length - 1)

          var stepListStr = ''
          var length = this.multiSaveForm.multiApiStepList.length
          if (length !== 0) {
            if (flag === 2) {
              this.multiSaveForm.multiApiStepList[length - 1].stepName = ''
            }
            stepListStr = JSON.stringify(this.multiSaveForm.multiApiStepList)
          }
          var caseType1 = 1
          if (flag === 2) {
            caseType1 = 2
          }
          this.fullscreenLoading = true

          var totalParam = {
            caseName: this.multiSaveForm.multiCaseName,
            busiCode: this.multiSaveForm.busCode,
            pubParam: publicData,
            steps: steps,
            manualTime: this.multiSaveForm.saveTime,
            stepListStr: stepListStr,
            caseType: caseType1,
            deleteMultiApiStepIds: ''
          }
          if (this.editCopyInfo.flag == '2') {
            totalParam.id = parseInt(this.editCopyInfo.caseId)
            if (this.multiSaveForm.deleteMultiApiStepIds.length !== 0) {
              totalParam.deleteMultiApiStepIds = JSON.stringify(this.multiSaveForm.deleteMultiApiStepIds)
            }
            totalParam.runnable = this.multiSaveForm.runnable
            totalParam.createUserCode = this.multiSaveForm.createUserCode
            totalParam.updateUserCode = this.multiSaveForm.updateUserCode
            totalParam.del = this.multiSaveForm.del
            totalParam.change = this.multiSaveForm.change
            totalParam.createTime = new Date(this.multiSaveForm.createTime)
          }

          var params = new URLSearchParams()
          params.append('flag', this.$route.query.flag)
          for (const item in totalParam) {
            if (totalParam.hasOwnProperty(item)) {
              params.append(item, totalParam[item])
            }
          }
          if (this.editCopyInfo.flag == '2') {
            // 编辑提交
            editMultiApiCase(params).then(response => {
              if (response.success) {
                this.fullscreenLoading = false
                this.$message({
                  message: '多接口用例编辑保存成功！',
                  type: 'success'

                })
                if (closePage) {
                  window.close()
                  this.$router.replace({ name: 'cart' })// 处理返回刷新问题
                  this.$router.push({ path: '/interfaces/multiApi/multi-api-list' })
                } else {
                  this.multiCaseRunDialogVisible = true
                }
              }
            })
          } else {
            // 复制/新增提交
            saveMultiApiCase(params).then(response => {
              if (response.success) {
                this.fullscreenLoading = false
                if (flag === 2) {
                  this.$message({
                    message: '已保存至数据工具，请至数据生成器列表查看！',
                    type: 'success'

                  })
                } else {
                  this.$message({
                    message: '多接口用例保存成功！',
                    type: 'success'

                  })
                }
                if (closePage) {
                  window.close()
                  this.$router.push({ path: '/interfaces/multiApi/multi-api-list' })
                } else {
                  this.caseRunId = response.data
                  this.multiCaseRunDialogVisible = true
                }
              }
            })
          }
        } else {
          return false
        }
      })
    },
    stepOrder (data) {
      this.stepOrder1 = JSON.stringify(data)
    },
    loadApiStorageSteps () {
      if (this.loadedFromApiStorage) {
        this.multiSaveForm.pubParamData = JSON.parse(localStorage.getItem('pubParam'))
        const idList = JSON.parse(localStorage.getItem('ids'))
        const obj = { typeIds: idList, dataType: 1, isExpanded: true }
        this.loading = true
        var params = new URLSearchParams()
        for (const item in obj) {
          if (obj.hasOwnProperty(item)) {
            params.append(item, obj[item])
          }
        }
        formatMultiApiCaseSteps(params).then(response => {
          if (response.success) {
            this.loading = false
            this.multiSaveForm.multiApiStepList = response.data
            debugger
            const paramList = JSON.parse(localStorage.getItem('paramList'))
            // 将参数替换成${}的
            this.replaceParam(this.multiSaveForm.multiApiStepList, paramList)
          }
        })
        this.loadedFromApiStorage = false
      }
    },
    replaceParam (stepList, paramList) {
      debugger
      for (var i = 0; i < stepList.length; i++) {
        for (var j = 0; j < paramList.length; j++) {
          if (stepList[i].apiName === paramList[j].caseName) {
            stepList[i].inParam = paramList[j].param
          }
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
    .link-type, .link-type:focus {
        color: #3757f5;
        cursor: pointer;
        text-decoration: underline
    }

    .app-container {
        width: 100%;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }

    /deep/ .foldButton {
        color: #555555;
        font-size 20px
        padding-top: 10px
    }

    .form-content {
        line-height: 20px;
    }

    .component-section {
        margin-top: 12px;
        width: 100%
    }

    .component-item {
        float: left;
        width: 60% !important;
        vertical-align middle
    }

    .component-label {
        float: left;
        width: 35%;
        font-size: 14px;
        vertical-align middle
    }

    .h-font {
        color: #606266
    }
</style>
