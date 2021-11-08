<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal=false
  >
    <el-form :model="bugInfo" label-width="180px" :rules="rules" ref="bugInfoForm">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="BUG描述:" prop="bugSummaryStr">
            <el-input v-model="bugInfo.bugSummaryStr" placeholder="请输入BUG描述"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="缺陷类型:" prop="bugTypeStr">
            <el-select v-model="bugInfo.bugTypeStr" clearable filterable>
              <el-option v-for="item of bugTypeList" :key="item" :value="item" :label="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="缺陷等级:" prop="bugLevelStr">
            <el-select v-model="bugInfo.bugLevelStr" clearable filterable>
              <el-option v-for="item of bugLevelList" :key="item" :value="item" :label="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="缺陷所属端:" prop="bugEndTypeStr">
            <el-select v-model="bugInfo.bugEndTypeStr" clearable filterable>
              <el-option v-for="item of bugEndTypeList" :key="item" :value="item" :label="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="缺陷所属中心:" prop="bugCenterStr">
            <el-select v-model="bugInfo.bugCenterStr" clearable filterable>
              <el-option v-for="item of bugCenterList" :key="item" :value="item" :label="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="缺陷所属部门:" prop="bugDeptStr">
            <el-select v-model="bugInfo.bugDeptStr" clearable filterable multiple>
              <el-option v-for="item of bugDeptList" :key="item.name" :value="item.name" :label="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="缺陷模块:" prop="bugModuleStr">
            <el-select v-model="bugInfo.bugModuleStr" clearable filterable>
              <el-option v-for="item of moduleList" :key="item" :value="item" :label="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="缺陷负责人:" prop="bugUserStr">
            <el-select v-model="bugInfo.bugUserStr"
                       clearable
                       filterable
                       remote
                       :remote-method="remoteMethod"
                       :loading="loading"
                       @change="userDistricts">
              <el-option v-for="item of responsiblePersonList" :label="item.name + '-' + item.adCode" :key="item.emplid"
                         :value="item.adCode"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="预计修复日期:" prop="bugTimeStr">
            <el-date-picker
              v-model="bugInfo.bugTimeStr"
              type="datetime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期，不填默认当前日期+3天"
              clearable
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>


      <el-form-item class="search-button">
        <el-button type="primary" @click="submitForm('bugInfoForm')" :loading="buttonLoading">保 存</el-button>
        <el-button @click="cancelDialogVisible">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import {createBugByInfo, getEhrUserDetailLikeUserName, queryDemandInfo} from '@/api/model/caseExecution'
  import CASE_EXECUTION_CONFIG from "@/config/caseExecution.config";

  export default {
    name: 'BugInfoDialog',
    computed: {},
    async mounted() {
      await this.queryDemandInfo()
    },
    data: () => ({
      loading: false,
      dialogVisible: false,
      dialogTitle: '创建缺陷',
      rules: CASE_EXECUTION_CONFIG.bugRules,
      bugInfo: {
        executionTaskId: 0,
        bugSummaryStr: '',
        bugUserStr: '',
        bugTimeStr: '',
        bugModuleStr: '',
        bugDeptStr: [],
        bugCenterStr: '',
        bugTypeStr: '',
        bugLevelStr: '',
        bugEndTypeStr: ''
      },
      responsiblePersonList: [],
      bugTypeList: [],
      bugCenterList: [],
      bugDeptList: [],
      moduleList: [],
      bugLevelList: [],
      bugEndTypeList: [],
      buttonLoading: false
    }),
    props: {
      taskId: {
        type: String,
        required: true
      }
    },
    methods: {
      async queryDemandInfo() { // 测试执行类型
        const res = await queryDemandInfo(this.taskId)
        this.bugTypeList = res.data.bugTypeList
        this.bugCenterList = res.data.bugCenterList
        this.bugDeptList = res.data.bugDeptList
        this.moduleList = res.data.moduleList
        this.bugLevelList = res.data.bugLevelList
        this.bugEndTypeList = res.data.bugEndTypeList
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
      },
      userDistricts() {
        this.$forceUpdate()
      },
      async cancelDialogVisible() {
        this.bugInfo = {}
        this.dialogVisible = false
        this.buttonLoading = false
      },
      async submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.buttonLoading = true
            this.bugInfo.executionTaskId = this.taskId
            this.bugInfo.bugDeptStr = this.bugInfo.bugDeptStr.toString()
            this.bugInfo.exeRemark = this.bugInfo.bugSummaryStr
            this.saveBug(this.bugInfo)
          } else {
            this.$notify({
              type: 'error',
              message: '保存失败'
            })
          }
        })
      },
      async saveBug(params) {
        createBugByInfo(params)
          .then(res => {
            if (!res.success) {
              this.buttonLoading = false
              this.bugInfo.bugDeptStr = this.bugInfo.bugDeptStr ? this.bugInfo.bugDeptStr.split(',') : []
              return
            }
            this.$notify({
              type: 'success',
              message: res.message
            })
            this.$emit('queryTestCaseDataByTaskId')
            this.cancelDialogVisible()

          })
      }
    }
  }

</script>
