<template>
  <div class="test-case-search">
    <el-form :model="testCaseForm" :rules="rules" ref="testCaseForm" label-width="100px" class="test-testCaseForm">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="用例名称:" prop="casename">
            <el-input v-model="testCaseForm.casename" placeholder="请输入用例名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用例等级:" prop="testCaseLevel">
            <el-select v-model="testCaseForm.testCaseLevel" clearable>
              <el-option v-for="item of testLevelList" :label="item.name" :key="item.englishName"
                         :value="item.englishName"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="对应jira ID" prop="relationRequirement">
            <el-input v-model="testCaseForm.relationRequirement" placeholder="请输入jira ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用例状态:" prop="testCaseStatus">
            <el-select v-model="testCaseForm.testCaseStatus" clearable>
              <el-option v-for="(item,key) in testCaseStatusList" :key="key" :value="key" :label="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <!--        <el-col :span="6">-->
        <!--          <el-form-item label="组织结构:" prop="ehrTreePath">-->
        <!--            <DeptOrg :deptCode.sync="testCaseForm.ehrTreePath" :cascaderConfig="cascaderConfig"/>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <el-col :span="6">
          <el-form-item label="所属应用:" prop="belongToSystem">
            <el-select
              v-model="testCaseForm.belongToSystem"
              clearable
              filterable
              placeholder="1. 试试选择: 所属应用"
              @change="onSearchApp"
            >
              <el-option
                v-for="item of appList"
                :label="item.applicationName"
                :key="item.id"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属模块:" prop="belongToModuleList">
            <el-cascader
              clearable
              :show-all-levels="false"
              :props="{ checkStrictly: true }"
              v-model="testCaseForm.belongToModuleList"
              placeholder="2. 试试搜索: 所属模块"
              :options="moduleInAppList"
              filterable></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建人:" prop="createUser">
            <el-select
              v-model="testCaseForm.createUser"
              clearable
              filterable
              remote
              :remote-method="remoteMethod"
              :loading="loading"
              placeholder="创建人"

            >
              <el-option
                v-for="item of responsiblePersonList"
                :label="item.name + '-' + item.adCode"
                :key="item.emplid"
                :value="item.adCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="search-button">
        <el-button type="primary" @click="createTestCase" v-show="type !== 'add'">创建测试执行</el-button>
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button type="success" @click="checkForm" v-show="type !== 'add'">批量审批</el-button>
        <el-button plain type="primary" @click="resetForm('testCaseForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <TestCaseBatchDialog ref="batchDialog" :multipleSelectTestCase.sync="multipleSelectTestCase"
                         @submitForm="submitForm"/>
    <SaveOrUpdateTestTaskDialog ref="SaveOrUpdateTestTaskDialog"
                                @queryCaseExecution="queryCaseExecution"></SaveOrUpdateTestTaskDialog>
  </div>
</template>
<script>
  import {moduleTreeMixin} from './mixin/mixin'
  import TEST_CASE_CONFIG from '@/config/testCase.config.js'
  import {
    getCaseStatus,
    getEhrUserDetailLikeUserName,
    queryIdsByCheckPass,
    queryIdsByUncheck
  } from '@/api/model/testCase'
  import {queryCaseExecution} from '@/api/model/caseExecution'

  export default {
    name: 'TestCaseSearch',
    mixins: [moduleTreeMixin],
    components: {
      // DeptOrg: () => import('@/components/DeptOrg/index'),
      TestCaseBatchDialog: () => import('./TestCaseBatchDialog'),
      SaveOrUpdateTestTaskDialog: () => import('../CaseExecution/SaveOrUpdateTestTaskDialog')
    },
    computed: {
      cascaderConfig() {
        return {
          isToPerson: false, // true 细粒度到人 false 细粒度不到人
          multipleCheck: false
        }
      }
    },
    watch: {
      testCaseForm(val) {
        if (val.belongToSystem) {
          this.queryModuleInAppList(val.belongToSystem)
        }
      }
    },
    props: {
      type: String,
      testLevelList: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        testCaseForm: {
          casename: '',
          testCaseLevel: '',
          relationRequirement: '',
          // ehrTreePath: [],
          createUser: '',
          createTimeVal: '',
          type: '',
          testCaseStatus: '',
          belongToSystem: '',
          belongToModule: '',
          belongToModuleList: [],
          moduleTreePath: ''
        },
        rules: {}, // 为测试用时type为add
        TEST_CASE_CONFIG,
        testCaseStatusList: [],
        deptInfo: [],
        loading: false,
        multipleSelectTestCase: [],
        responsiblePersonList: [],
        caseExecutionForm: {},
        pagination: {
          current: 1,
          size: 10,
          total: 0
        },
        taskTestCaseIdList: ''
      }
    },
    async mounted() {
      await this.getCaseStatus()
    },
    methods: {
      async getCaseStatus() { // case状态变更
        const res = await getCaseStatus()
        this.testCaseStatusList = res.data
      },
      // 一件创建测试用例
      async queryIdsByCheckPass() {
        const testCaseInfo = this.testCaseForm
        const res = await queryIdsByCheckPass(testCaseInfo)
        const taskTestCaseIdList = res.data
        this.taskTestCaseIdList = taskTestCaseIdList
        this.$refs.SaveOrUpdateTestTaskDialog.testCaseNumber = this.taskTestCaseIdList.length
        this.$refs.SaveOrUpdateTestTaskDialog.createRelationCaseTest.taskTestCaseIdList = this.taskTestCaseIdList
      },
      async createTestCase() {
        await this.queryIdsByCheckPass()
        this.$refs.SaveOrUpdateTestTaskDialog.testTask = {}
        this.$refs.SaveOrUpdateTestTaskDialog.dialogTitle = '创建测试执行'
        this.$refs.SaveOrUpdateTestTaskDialog.testCaseNumberShow = true
        this.$refs.SaveOrUpdateTestTaskDialog.testTask.testExecutionType = '1'
        await this.$refs.SaveOrUpdateTestTaskDialog.getTestExeMethodMap() // 手动还是自动
        this.$refs.SaveOrUpdateTestTaskDialog.dialogVisible = true
      },
      async queryCaseExecution() { // 执行列表数据
        const {ehrTreePath, startTimeVal, endTimeVal} = this.caseExecutionForm // 查询条件
        const data = {
          searchObj: {
            ...this.caseExecutionForm,
            ehrTreePath: ehrTreePath ? ehrTreePath.toString() : '',
            startTimeVal: startTimeVal ? startTimeVal.toString() : '',
            endTimeVal: endTimeVal ? endTimeVal.toString() : ''
          },
          page: {
            ...this.pagination
          }
        } // 根据接口要求处理请求参数
        const res = await queryCaseExecution(data)
        var respData = res.data
        this.caseExecutionDataSource = respData.records
        this.pagination.total = respData.total
      },
      submitForm() {
        this.$refs.testCaseForm.validate((valid) => {
          if (valid) {
            this.setSearchInfo()
            this.$emit('update:testCaseForm', this.testCaseForm)
            this.$emit('queryTestCaseDataFind')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 批量审核
      checkForm() {
        this.$refs.testCaseForm.validate((valid) => {
          if (valid) {
            // 批量审批 根据查询条件查询审批的数量
            this.setSearchInfo()
            // console.log('所属模块：' + this.testCaseForm.belongToModule)
            const testCaseInfo = this.testCaseForm
            // testCaseInfo.ehrTreePath = testCaseInfo.ehrTreePath.toString()
            queryIdsByUncheck(testCaseInfo).then(res => {
              this.multipleSelectTestCase = res.data
              if (this.multipleSelectTestCase && this.multipleSelectTestCase.length > 0) {
                this.$refs.batchDialog.detailDialogValue.checkNum = this.multipleSelectTestCase.length
                this.$refs.batchDialog.dialogVisible = true
              } else {
                this.$notify({
                  type: 'error',
                  message: '没有查询到待审核的测试用例'
                })
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      async setSearchInfo() {
        if (this.testCaseForm.belongToModuleList) {
          const length = this.testCaseForm.belongToModuleList.length - 1
          const moduleList = this.testCaseForm.belongToModuleList
          this.testCaseForm.belongToModule = moduleList[length]
        }
      },
      async onSearchApp() {
        await this.queryModuleInAppList(this.testCaseForm.belongToSystem)
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
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
<style scoped lang="scss">
  .search-button {
    display: flex;
    justify-content: flex-end;
  }

  .reset-button {
    border: 1px solid #DCDFE6;
  }
</style>
