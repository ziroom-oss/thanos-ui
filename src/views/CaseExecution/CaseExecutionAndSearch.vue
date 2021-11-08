<template>
  <div class="test-case-search">
    <el-form :model="testCaseForm" ref="testCaseForm" label-width="100px" class="test-testCaseForm">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="用例名称:" prop="casename">
            <el-input v-model="testCaseForm.casename" placeholder="请输入用例名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建人:" prop="createUser">
            <el-select
              v-model="testCaseForm.createUser"
              clearable
              filterable
              remote
              placeholder="创建人"
              :remote-method="remoteMethod"
              :loading="loading"
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
        <el-col :span="6">
          <el-form-item label="最后执行人:" prop="executionUser">
            <el-select
              v-model="testCaseForm.executionUser"
              clearable
              filterable
              remote
              placeholder="最后执行人"
              :remote-method="remoteMethod"
              :loading="loading"
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
        <el-col :span="6">
          <el-form-item label="最后执行结果:" prop="executionResult" >
            <el-select v-model="testCaseForm.executionResult" clearable >
              <el-option  v-for="(item,key) in executionResultList" :key="key" :value="key" :label="item"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="search-button">
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button plain type="primary" @click="resetForm('testCaseForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {getCaseStatus} from '@/api/model/testCase'
  import {getEhrUserDetailLikeUserName, getTestExecutionMap, queryCaseExecution} from '@/api/model/caseExecution'

  export default {
  name: 'TestCaseSearch',
  computed: {
    cascaderConfig () {
      return {
        isToPerson: false, // true 细粒度到人 false 细粒度不到人
        multipleCheck: false
      }
    }
  },
  watch: {
    testCaseForm (val) {
      if (val.belongToSystem) {
        this.queryModuleInAppList(val.belongToSystem)
      }
    }
  },
  data () {
    return {
      testCaseForm: {
        casename: '',
        testCaseLevel: '',
        relationRequirement: '',
        createUser: '',
        executionUser: '',
        createTimeVal: '',
        type: '',
        testCaseStatus: '',
        belongToSystem: '',
        belongToModule: '',
        belongToModuleList: [],
        moduleTreePath: '',
        executionResult: '' // 新加的执行结果
      },
      executionResultList: [],
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
  async mounted () {
    this.testCaseForm = {
      ...this.testCaseForm
      // executionResult: '失败'
    }
    await this.getCaseStatus()
  },

  methods: {
    async getCaseStatus () { // case状态变更
      const testRes = await getCaseStatus()
      this.testCaseStatusList = testRes.data
      const executionRes = await getTestExecutionMap()
      this.executionResultList = executionRes.data
    },
    async queryCaseExecution () { // 执行列表数据
      const { ehrTreePath, startTimeVal, endTimeVal } = this.caseExecutionForm // 查询条件
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
    submitForm () { // 查询
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
    async setSearchInfo () {
      if (this.testCaseForm.belongToModuleList) {
        const length = this.testCaseForm.belongToModuleList.length - 1
        const moduleList = this.testCaseForm.belongToModuleList
        this.testCaseForm.belongToModule = moduleList[length]
      }
    },
    // 获取用户名单
    async getEhrUserDetailLikeUserName (userName) {
      const params = {
        userName:userName
      }
      const res = await getEhrUserDetailLikeUserName(params)
      this.responsiblePersonList = res.data
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.getEhrUserDetailLikeUserName(query)
        }, 200)
      } else {
        this.options = []
      }
    },
    async onSearchApp () {
      await this.queryModuleInAppList(this.testCaseForm.belongToSystem)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped lang="scss">
.search-button{
  display: flex;
  justify-content: flex-end;
}
.reset-button {
  border:1px solid #DCDFE6;
}
</style>
