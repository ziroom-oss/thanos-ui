<template>
  <el-card style="margin-bottom: 20px" shadow="hover">
    <el-form :model="caseExecutionForm" :rules="rules" ref="caseExecutionForm" label-width="120px"
             class="test-caseExecution">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="测试执行标题:" prop="taskName">
            <el-input v-model="caseExecutionForm.taskName" placeholder="请输入测试执行标题" @change="checkOnlyCaseTitle"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否模板:" prop="status">
            <el-select v-model="caseExecutionForm.templateFlag" clearable filterable>
              <el-option key="false" value="false" label="否"/>
              <el-option key="true" value="true" label="是"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="组织结构:" prop="ehrTreePath">
            <DeptOrg :deptCode.sync="caseExecutionForm.ehrTreePath" :cascaderConfig="cascaderConfig"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="测试执行状态:" prop="status">
            <el-select v-model="caseExecutionForm.status" clearable filterable>
              <el-option v-for="(item,key) of caseStatusList" :key="key" :value="key" :label="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="测试执行类型:" prop="taskType">
            <el-select v-model="caseExecutionForm.taskType" clearable filterable>
              <el-option v-for="(item,key) of caseExecutionTypeList" :key="key" :value="key" :label="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="jira ID:" prop="relationRequirement">
            <el-input type="text" v-model="caseExecutionForm.relationRequirement" placeholder="请输入jira ID"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="负责人:" prop="testTaskMaster">
            <el-select v-model="caseExecutionForm.testTaskMaster"
                       clearable
                       filterable
                       remote
                       :remote-method="remoteMethod"
                       :loading="loading">
              <el-option v-for="item of responsiblePersonList" :label="item.name + '-' + item.adCode" :key="item.emplid"
                         :value="item.adCode"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目:" prop="testTopicId">
            <el-select v-model="caseExecutionForm.testTopicId" clearable filterable>
              <el-option v-for="item of testTopicList" :label="item.topicName" :key="item.topicName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="测试方法:" prop="testExecutionTypeStr">
            <el-select v-model="testExecutionTypeStr" filterable clearable placeholder="请选择">
              <el-option v-for="(item,key) of typeTestList" :key="key" :value="key" :label="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!--        <el-col :span="8" v-if="type === 'add'">-->
        <!--          <el-form-item prop="testTaskExecutors" label="测试执行人:">-->
        <!--            <el-select v-model="caseExecutionForm.testTaskExecutors" clearable :multiple="type === 'add' ? true : false"-->
        <!--                       filterable>-->
        <!--              <el-option v-for="item of responsiblePersonList" :label="item.name + '-' + item.adCode" :key="item.emplid"-->
        <!--                         :value="item.adCode"/>-->
        <!--            </el-select>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
      </el-row>
      <el-form-item class="search-button" v-if="type !== 'add'">
        <el-button type="primary" @click="submitForm('caseExecutionForm')">查询</el-button>
        <el-button plain type="primary" @click="resetForm('caseExecutionForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import CASE_EXECUTION_CONFIG from '@/config/caseExecution.config.js'
  import TEST_CASE_CONFIG from '@/config/testCase.config.js'

  import {
    getOnlyCaseTitle,
    getTestExeMethodMap,
    getTestTaskStatusList,
    getTestTaskTypeList,
    queryTopicDropdownList,
    getEhrUserDetailLikeUserName
  } from '@/api/model/caseExecution'

  export default {
    name: 'Search',
    components: {
      DeptOrg: () => import('@/components/DeptOrg/index')
    },
    props: {
      type: String,
      pass: Boolean
    },
    computed: {
      cascaderConfig() {
        return {
          isToPerson: false, // true 细粒度到人 false 细粒度不到人
          multipleCheck: false
        }
      }
    },
    async mounted() {
      await this.getTestTaskStatusList()
      await this.getTestTaskTypeList()
      await this.queryTopicDropdownList()
      await this.getTestExeMethodMap()
    },
    data() {
      return {
        loading: false,
        CASE_EXECUTION_CONFIG, // 枚举转换
        TEST_CASE_CONFIG,
        rules: this.type === 'add' ? CASE_EXECUTION_CONFIG.rules : {},
        caseExecutionForm: {
          taskName: '',
          status: '',
          ehrTreePath: [],
          relationRequirement: '',
          testTaskMaster: '',
          taskType: '',
          endTimeVal: '',
          startTimeVal: '',
          endTime: '',
          startTime: '',
          testTopicId: '',
          testExecutionType: '',
          templateFlag: null
        },
        testExecutionTypeStr: '',
        caseStatusList: [],
        caseExecutionTypeList: [],
        responsiblePersonList: [],
        testTopicList: [],
        typeTestList: ''
      }
    },
    methods: {
      async getTestExeMethodMap() {
        const res = await getTestExeMethodMap()
        this.typeTestList = res.data
      },
      submitForm() {
        this.$refs.caseExecutionForm.validate((valid) => {
          if (valid) {
            if (this.testExecutionTypeStr) {
              this.caseExecutionForm.testExecutionType = parseInt(this.testExecutionTypeStr)
            } else {
              this.caseExecutionForm.testExecutionType = ''
            }
            this.$emit('update:pass', valid)
            this.$emit('update:caseExecutionForm', this.caseExecutionForm) // 修改传递的参数
            this.$emit('onSearch') // 调用更新接口
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      async getTestTaskStatusList() { // 测试执行状态
        const res = await getTestTaskStatusList()
        this.caseStatusList = res.data
      },
      async getTestTaskTypeList() { // 测试执行类型
        const res = await getTestTaskTypeList()
        this.caseExecutionTypeList = res.data
      },
      async queryTopicDropdownList() { // 查询项目的下拉菜单
        const res = await queryTopicDropdownList()
        this.testTopicList = res.data
      },
      // 重置
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.testExecutionTypeStr = ''
      },
      async checkOnlyCaseTitle(val) {
        if (this.type !== 'add') {
          return
        }
        await getOnlyCaseTitle({taskName: val})
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
  .test-caseExecution {
    .search-button {
      display: flex;
      justify-content: flex-end;
    }

    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100%
    }
  }
</style>
