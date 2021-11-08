<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal=false
  >
    <span style="display: block;margin-top: -20px;margin-left: 20px;margin-bottom: 10px;color: darkgreen"
          v-show="testCaseNumberShow"
    >当前筛选条件下，用例有{{ this.testCaseNumber }}条</span>
    <el-form :model="testTask" label-width="180px" :rules="rules" ref="testTaskForm">

      <el-row :gutter="24" v-show="!testCaseNumberShow">
        <el-col :span="24">
          <el-form-item label="请选择测试方法:" prop="testExecutionType">
            <el-select v-model="testTask.testExecutionType" filterable placeholder="请选择" @change="userDistricts">
              <el-option v-for="(item,key) of typeTestList" :key="key" :value="key" :label="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="测试执行标题:" prop="taskName">
            <el-input v-model="testTask.taskName" placeholder="请输入测试执行标题" @blur="checkOnlyCaseTitle($event)"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="测试执行所属的组织结构:" prop="ehrTreePath">
            <el-cascader
              ref="cascader"
              v-model="testTask.ehrTreePath"
              :options="afterHandledeptOrgList"
              separator="-"
              size="mini"
              filterable
              :show-all-levels="false"
              clearable
              :props="{ multiple: cascaderConfig.multipleCheck, checkStrictly: true }"
              placeholder="请选择测试执行所属的组织结构"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="测试执行类型:" prop="taskType">
            <el-select v-model="testTask.taskType" clearable filterable>
              <el-option v-for="(item,key) of caseExecutionTypeList" :key="key" :value="key" :label="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="jira ID:" prop="relationRequirement">
            <el-input type="text" v-model="testTask.relationRequirement" placeholder="请输入jira ID"
                      @blur="validateIssueKey($event)"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="负责人:" prop="testTaskMaster">
            <el-select v-model="testTask.testTaskMaster"
                       clearable
                       filterable
                       remote
                       :remote-method="remoteMethod"
                       :loading="loading"
                       placeholder="测试负责人默认为当前登录人"
                       @change="userDistricts">
              <el-option v-for="item of responsiblePersonList" :label="item.name + '-' + item.adCode" :key="item.emplid"
                         :value="item.adCode"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item prop="testTaskExecutors" label="测试执行人:">
            <el-select v-model="testTask.testTaskExecutors"
                       clearable
                       filterable
                       remote
                       :remote-method="remoteMethod"
                       :loading="loading"
                       multiple
                       placeholder="测试执行人默认为当前登录人"
                       @change="userDistricts">
              <el-option v-for="item of responsiblePersonList" :label="item.name + '-' + item.adCode" :key="item.emplid"
                         :value="item.adCode"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="项目:" prop="testTopic">
            <el-select v-model="testTask.testTopicId" clearable filterable>
              <el-option v-for="item of testTopicList" :label="item.topicName" :key="item.topicName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="是否模板:" prop="templateFlag">
            <el-switch
              v-model="testTask.templateFlag"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
            >
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="appID:" prop="appId" v-show="this.testTask.templateFlag">
            <el-select v-model="testTask.appId" filterable multiple placeholder="请选择">
              <el-option v-for="item of appInfoList" :label="item.label" :key="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="search-button">
        <el-button type="primary" @click="saveOrUpdateTestTask">保 存</el-button>
        <el-button @click="cancelDialogVisible">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

  import {
    getAppInfoList,
    getOnlyCaseTitle,
    getTestExeMethodMap,
    getTestTaskTypeList,
    queryTopicDropdownList,
    saveOrUpdateTestTask,
    saveTestCaseWithExecution,
    getEhrUserDetailLikeUserName
  } from '@/api/model/caseExecution'
  import CASE_EXECUTION_CONFIG from '@/config/caseExecution.config'
  import {validateIssueKey} from '@/api/model/jiraIssue'
  import {getEhrInfo} from '@/api/model/testCase'

  export default {
    name: 'SaveOrUpdateTestTaskDialog',
    computed: {
      cascaderConfig() {
        return {
          isToPerson: false, // true 细粒度到人 false 细粒度不到人
          multipleCheck: false
        }
      }
    },
    async mounted() {
      await this.getTestTaskTypeList()
      await this.getDepartOrg()
      await this.queryTopicDropdownList()
      await this.getAppInfoList()
    },
    data: () => ({
      createRelationCaseTest: {
        taskId: '',
        taskTestCaseIdList: ''
      },
      testCaseNumber: '',
      testCaseNumberShow: false,
      dialogVisible: false,
      dialogTitle: '',
      rules: CASE_EXECUTION_CONFIG.rules,
      testTask: {
        id: 0,
        taskName: '',
        ehrTreePath: [''],
        taskType: '',
        relationRequirement: '',
        testTaskMaster: '',
        testTaskExecutors: [],
        testTopicId: '',
        testExecutionType: '',
        templateFlag: false,
        appId: []
      },
      testTopicList: [],
      caseExecutionTypeList: [],
      responsiblePersonList: [],
      CASE_EXECUTION_CONFIG, // 枚举转换
      afterHandledeptOrgList: [],
      deptOrgList: [],
      typeTestList: '',
      appInfoList: [],
      loading: false
    }),
    methods: {
      // appIdChange() {
      //   this.testTask.appId = this.testTask.appId.replace(/[\W]/g, '');
      // },
      async getTestExeMethodMap() {
        const res = await getTestExeMethodMap()
        this.typeTestList = res.data
      },
      userDistricts() {
        this.$forceUpdate()
      },
      async checkOnlyCaseTitle(event) {
        getOnlyCaseTitle({taskName: event.target.value})
      },
      async getTestTaskTypeList() { // 测试执行类型
        const res = await getTestTaskTypeList()
        this.caseExecutionTypeList = res.data
      },
      async getDepartOrg() { // 获取组织结构
        const res = await getEhrInfo() || []
        const childDept = res.data
        this.deptOrgList = childDept.childDept
        this.handleDeartOrg()
      },
      handleDeartOrg() {
        this.afterHandledeptOrgList = this.flattenNotToPersonChild(this.deptOrgList)
      },
      flattenNotToPersonChild(options) { // 不到人
        const that = this
        const deptOptions = []
        options.forEach(item => {
          if (!item.last && item.childDept) {
            deptOptions.push({
              label: item.deptName,
              value: item.deptCode,
              children: (function () {
                return that.flattenNotToPersonChild(item.childDept)
              })()
            })
          } else if (item.last && item.childDept) {
            deptOptions.push({
              label: item.deptName,
              value: item.deptCode
            })
          } else {
            return false
          }
        })
        return deptOptions
      },
      async validateIssueKey(event) {
        validateIssueKey({issueKey: event.target.value})
      },
      async saveOrUpdateTestTask() {
        await this.$refs.testTaskForm.validate((valid) => {
          if (valid) {
            const templateFlag = this.testTask.templateFlag
            if (templateFlag && !this.testTask.appId) {
              this.$notify({
                type: 'error',
                message: '选择为模板类型,则必须有模板ID!!!'
              })
              return
            }
            const ehrTreePath = this.testTask.ehrTreePath.toString()
            const testTaskExecutorsStr = this.testTask.testTaskExecutors && this.testTask.testTaskExecutors.toString()
            this.testTask.testTaskExecutors = testTaskExecutorsStr
            const appIdStr = this.testTask.appId && this.testTask.appId.toString()
            this.testTask.appId = appIdStr
            const params = {
              ...this.testTask,
              ehrTreePath
            }
            saveOrUpdateTestTask(params)
              .then(res => {
                if (!res.success) {
                  return
                }
                this.$notify({
                  type: 'success',
                  message: '保存成功'
                })
                if (this.testCaseNumberShow) {
                  this.createRelationCaseTest.taskId = res.data
                  this.createRelationCase()
                }
                this.$emit('queryCaseExecution')
                this.cancelDialogVisible()
              })
          } else {
            this.$notify({
              type: 'error',
              message: '保存失败'
            })
          }
        })
      },
      async createRelationCase() {
        const data = this.createRelationCaseTest
        if (this.createRelationCaseTest.taskId && this.createRelationCaseTest.taskTestCaseIdList) {
          await saveTestCaseWithExecution(data).then((res) => {
            if (!res.success) {
              return
            }
            this.$notify({
              type: 'success',
              message: '关联成功'
            })
            this.handleAssociateCase(data.taskId)
          })
        } else {
          this.handleAssociateCase(data.taskId)
        }
      },
      handleAssociateCase(data) { // 关联测试执行
        this.$router.push({
          path: '/caseExecutionDetailAndList',
          query: {
            type: 'add',
            taskId: data,
            testExecutionType: '1'
          }
        })
      },
      async cancelDialogVisible() {
        this.testTask = {}
        this.dialogVisible = false
      },
      async queryTopicDropdownList() { // 查询项目的下拉菜单
        const res = await queryTopicDropdownList()
        this.testTopicList = res.data
      },
      async getAppInfoList() { // 查询appid集合
        const res = await getAppInfoList()
        this.appInfoList = res.data
      },
      // 获取用户名单
      async getEhrUserDetailLikeUserName(userName) {
        const params = {
          userName: userName
        }
        const res = await getEhrUserDetailLikeUserName(params)
        this.responsiblePersonList = res.data
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.getEhrUserDetailLikeUserName(query)
          }, 200)
        } else {
          this.options = []
        }
      }
    }
  }
</script>
