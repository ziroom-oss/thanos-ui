<template>
  <div class="test-case-batch">
    <el-dialog
      title="用例计划"
      :visible.sync="TestPlanDetailDialog"
      :before-close="handleClose"
      :close-on-click-modal=false
    >
      <el-form
        :model="detailDialogValue"
        ref="detailDialog"
        :rules="TEST_PLAN_CONFIG['planFormRules']"
        label-width="100px"
        class="detail-dialog"
      >
        <el-form-item label="计划名称:" prop="planName">
          <el-input
            v-model="detailDialogValue.planName"
            clearable
            @change="checkNewPlanName"
          />
        </el-form-item>
        <el-form-item label="关联需求:" prop="relationRequirement">
          <el-input
            v-model="detailDialogValue.relationRequirement"
            clearable
            @blur="validateIssueKey"
          />
        </el-form-item>
        <!-- <el-form-item label="计划起止日期:" prop="testPlanTime">
          <el-date-picker
            v-model="detailDialogValue.testPlanTime"
            type="daterange"
            unlink-panels
            value-format="yyyy-MM-dd HH:ss"
            :picker-options="TEST_PLAN_CONFIG['pickerOptions']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable>
          </el-date-picker>
        </el-form-item> -->
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="计划时间起:" prop="testPlanStartTime">
              <el-date-picker
                v-model="detailDialogValue.testPlanStartTime"
                type="datetime"
                format="yyyy-MM-dd hh:mm"
                value-format="yyyy-MM-dd hh:mm"
                placeholder="选择日期时间"
                clearable
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="计划时间止:" prop="testPlanEndTime">
              <el-date-picker
                v-model="detailDialogValue.testPlanEndTime"
                type="datetime"
                format="yyyy-MM-dd hh:mm"
                value-format="yyyy-MM-dd hh:mm"
                placeholder="选择日期时间"
                clearable
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="测试策略:" prop="testStrategy">
              <el-select
                v-model="detailDialogValue.testStrategy"
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
          <el-col :span="12">
            <el-form-item label="测试环境:" prop="testEnvironment">
              <el-select
                v-model="detailDialogValue.testEnvironment"
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
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="负责人:" prop="testPlanMaster">
              <el-select
                v-model="detailDialogValue.testPlanMaster"
                clearable
                filterable
                remote
                :remote-method="remoteMethod"
                :loading="loading"
                placeholder="负责人"
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
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="测试人员:" prop="testPersionList">
              <el-select
                v-model="detailDialogValue.testPersionList"
                clearable
                filterable
                remote
                :remote-method="remoteMethod"
                :loading="loading"
                placeholder="测试人员"
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
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="测试风险:" prop="testRisk">
              <el-input
                type="textarea"
                clearable
                v-model="detailDialogValue.testRisk"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="测试范围:" prop="testRange">
              <el-input
                type="textarea"
                clearable
                v-model="detailDialogValue.testRange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="primary"
            @click="saveForm('detailDialog')"
            v-if="caseType == 'add'"
          >保存草稿
          </el-button>
          <el-button
            type="primary"
            @click="submitForm('detailDialog')"
          >提交
          </el-button>
          <el-button @click="resetForm('detailDialog')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import {checkNewPlanName, getEhrUserDetailLikeUserName, insertTestPlan, updateTestPlan} from '@/api/model/testPlan'
  import {validateIssueKey} from '@/api/model/jiraIssue'
  import TEST_PLAN_CONFIG from '@/config/testPlan.config.js'

  export default {
    name: 'TestPlanDetailDialog',
    data() {
      return {
        TestPlanDetailDialog: false,
        detailDialogValue: {
          id: '',
          planName: '',
          relationRequirement: '',
          testEnvironment: '',
          testRange: '',
          testStrategy: '',
          testPlanMaster: '',
          testPlanStartTime: '',
          testPlanEndTime: '',
          testPersionList: '',
          testRisk: '',
          testPlanTime: ''
        },
        responsiblePersonList: [],
        loading: false,
        // 新增编辑标识
        caseType: 'add',
        TEST_PLAN_CONFIG
      }
    },
    computed: {
      cascaderConfig() {
        return {
          isToPerson: false, // true 细粒度到人 false 细粒度不到人
          multipleCheck: false
        }
      }
    },
    props: {
      environmentList: {
        type: Array,
        required: true
      },
      strategyList: {
        type: Array,
        required: true
      }
    },
    methods: {
      handleClose() {
        this.$refs.detailDialog.resetFields()
        this.TestPlanDetailDialog = false
      },
      async checkNewPlanName(val) {
        // 校验msgTitle名称唯一
        const params = {id: this.detailDialogValue.id, planName: val}
        await checkNewPlanName(params)
      },
      async insertTestPlan(params, formName) {
        insertTestPlan(params).then((res) => {
          if (!res) {
            return
          }
          this.$notify({
            type: 'success',
            message: '保存成功'
          })
          this.$emit('queryTestPlanByPage')
          this.$refs[formName].resetFields()
          this.TestPlanDetailDialog = false
        })
      },
      async updateTestPlan(params, formName) {
        updateTestPlan(params).then((res) => {
          if (!res) {
            return
          }
          this.$notify({
            type: 'success',
            message: '保存成功'
          })
          this.$emit('queryTestPlanByPage')
          this.$refs[formName].resetFields()
          this.TestPlanDetailDialog = false
        })
      },
      async submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 提交按钮设置为true，为保存并提交
            this.detailDialogValue.submitFlag = true
            const params = {
              ...this.detailDialogValue
            }
            if (this.caseType === 'add') {
              this.insertTestPlan(params, formName)
            } else {
              this.updateTestPlan(params, formName)
            }
          } else {
            // this.TestPlanDetailDialog = false
            this.$notify({
              type: 'error',
              message: '保存失败'
            })
            return false
          }
        })
      },
      async saveForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = {
              ...this.detailDialogValue
            }
            if (this.caseType === 'add') {
              this.insertTestPlan(params)
            } else {
              this.updateTestPlan(params)
            }
            this.$refs[formName].resetFields()
            this.TestPlanDetailDialog = false
          } else {
            // this.TestPlanDetailDialog = false
            this.$notify({
              type: 'error',
              message: '保存失败'
            })
            return false
          }
        })
      },
      async validateIssueKey(event) {
        // 校验issueKey名称是否正确
        await validateIssueKey({issueKey: event.target.value})
      },

      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.TestPlanDetailDialog = false
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
