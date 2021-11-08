<template>
  <div class="test-plan-search">
    <el-form :model="testPlanForm" :rules="rules" ref="testPlanForm" label-width="100px" class="test-testPlanForm">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="计划名称:" prop="planName">
            <el-input v-model="testPlanForm.planName" placeholder="请输入计划名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关联需求:" prop="relationRequirement">
            <el-input v-model="testPlanForm.relationRequirement" placeholder="请输入关联需求"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="测试环境:" prop="testEnvironment">
              <el-select
                v-model="testPlanForm.testEnvironment"
                clearable
                filterable
              >
                <el-option
                  v-for="item of environmentList"
                  :label="item.name"
                  :key="item.englishName"
                  :value="item.englishName"
                />
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-show="type !== 'add'">
          <el-form-item label="测试策略:" prop="testStrategy">
              <el-select
                v-model="testPlanForm.testStrategy"
                clearable
                filterable
              >
                <el-option
                  v-for="item of strategyList"
                  :label="item.name"
                  :key="item.englishName"
                  :value="item.englishName"
                />
              </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="负责人:" prop="testPlanMaster">
              <el-select
                v-model="testPlanForm.testPlanMaster"
                clearable
                filterable
                remote
                :remote-method="remoteMethod"
                :loading="loading"
                placeholder="测试人员默认为当前登录人"
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
          <el-form-item label="状态:" prop="testPlanStatus" v-show="type !== 'add'">
            <el-select v-model="testPlanForm.testPlanStatus" clearable>
              <el-option v-for="item of TEST_PLAN_CONFIG['planStatusList']" :label="item.value" :key="item.code" :value="item.code" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-show="type !== 'add'">
          <el-form-item label="计划开始时间:" prop="testPlanStartVal">
            <el-date-picker
              v-model="testPlanForm.testPlanStartVal"
              type="daterange"
              unlink-panels
              value-format="yyyy-MM-dd HH:ss"
              :picker-options="TEST_PLAN_CONFIG['pickerOptions']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-show="type !== 'add'">
          <el-form-item label="计划结束时间:" prop="testPlanEndVal">
            <el-date-picker
              v-model="testPlanForm.testPlanEndVal"
              type="daterange"
              unlink-panels
              value-format="yyyy-MM-dd HH:ss"
              :picker-options="TEST_PLAN_CONFIG['pickerOptions']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="search-button" v-show="type !== 'add'">
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button type="success" @click="checkForm">批量审批</el-button>
        <el-button plain type="primary" @click="resetForm('testPlanForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <TestPlanBatchDialog ref="batchDialog" :multipleSelectTestPlan.sync="multipleSelectTestPlan" />
  </div>
</template>
<script>
import TEST_PLAN_CONFIG from '@/config/testPlan.config.js'
import {
  getEhrUserDetailLikeUserName,
  queryIdsByUncheck
} from '@/api/model/testPlan'
export default {
  name: 'TestCaseSearch',
  components: {
    TestPlanBatchDialog: () => import('./TestPlanBatchDialog')
  },
  computed: {
    cascaderConfig () {
      return {
        isToPerson: false, // true 细粒度到人 false 细粒度不到人
        multipleCheck: false
      }
    }
  },
  props: {
    type: String,
    environmentList: {
      type: Array,
      required: true
    },
    strategyList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      testPlanForm: {
        planName: '',
        relationRequirement: '',
        testEnvironment: '',
        testStrategy: '',
        testPlanMaster: '',
        testPlanStartVal: '',
        testPlanEndVal: '',
        testPlanStatus: ''
      },
      rules: {}, // 为测试用时type为add
      TEST_PLAN_CONFIG,
      loading: false,
      responsiblePersonList: [],
      multipleSelectTestPlan: []
    }
  },
  methods: {
    submitForm () {
      this.$refs.testPlanForm.validate((valid) => {
        if (valid) {
          this.$emit('update:testPlanForm', this.testPlanForm)
          this.$emit('queryTestPlanByPage')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 批量审核
    checkForm () {
      this.$refs.testPlanForm.validate((valid) => {
        if (valid) {
          // 批量审批 根据查询条件查询审批的数量
          queryIdsByUncheck(this.testPlanForm).then(res => {
            this.multipleSelectTestPlan = res.data
            if (this.multipleSelectTestPlan && this.multipleSelectTestPlan.length > 0) {
              this.$refs.batchDialog.checkNum = this.multipleSelectTestPlan.length
              this.$refs.batchDialog.dialogVisible = true
            } else {
              this.$notify({
                type: 'error',
                message: '没有查询到待审核的测试计划'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
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
.search-button{
  display: flex;
  justify-content: flex-end;
}
.reset-button {
  border:1px solid #DCDFE6;
}
</style>
