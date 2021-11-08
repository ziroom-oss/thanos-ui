<template>
  <div class="project-config-detail">
    <el-dialog
      title="项目"
      :visible.sync="projectConfigVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="detailDialogValue"
        ref="detailDialog"
        :rules="PROJECT_CONFIG['projectRules']"
        label-width="120px"
        class="detail-dialog"
      >
        <el-form-item label="项目名称:" prop="topicName">
          <el-input
            v-model="detailDialogValue.topicName"
            clearable
            placeholder="请输入项目名称"
            @blur="checkNewTopicName"
          />
        </el-form-item>
        <el-form-item label="jira ID:" prop="relationRequirement">
          <el-input
            type="text"
            v-model="detailDialogValue.relationRequirement"
            clearable
            placeholder="请输入jira ID"
            @blur="validateIssueKey"
          />
        </el-form-item>
        <el-form-item label="预计上线时间:" prop="upTime">
          <el-date-picker
            v-model="detailDialogValue.upTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目负责人:" prop="topicMaster">
          <el-select
            v-model="detailDialogValue.topicMaster"
            clearable
            filterable
            remote
            :remote-method="remoteUserName"
            :loading="loading"
            placeholder='请选择项目负责人'
          >
            <el-option v-for="item of responsiblePersonList" :label="item.name + '-' + item.adCode" :key="item.emplid"
                       :value="item.adCode"/>
          </el-select>
        </el-form-item>
        <el-form-item label="项目参与人:" prop="topicParticipant">
          <el-select
            v-model="detailDialogValue.topicParticipant"
            clearable
            filterable
            remote
            :remote-method="remoteUserName"
            :loading="loading"
            multiple
            placeholder='请选择项目参与人'
          >
            <el-option v-for="item of responsiblePersonList" :label="item.name + '-' + item.adCode" :key="item.emplid"
                       :value="item.adCode"/>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="测试执行:" prop="taskIdList">
          <el-select
            v-model="detailDialogValue.taskIdList"
            multiple
            filterable
            remote
            placeholder="请输入测试执行"
            :remote-method="remoteMethod"
            :loading="loading">
              <el-option
                v-for="item in caseOptions"
                :key="item.taskId"
                :label="item.testTaskName"
                :value="item.taskId">
              </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="测试执行:" prop="taskIdList">
          <el-select
            v-model="detailDialogValue.taskIdList"
            multiple
            filterable
            placeholder="请输入测试执行"
            :loading="loading">
            <el-option
              v-for="item in caseOptions"
              :key="item.taskId"
              :label="item.testTaskName"
              :value="item.taskId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input
            type="textarea"
            clearable
            v-model="detailDialogValue.remark"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="saveButtonStatus"
            @click="submitForm('detailDialog')"
          >保存
          </el-button
          >
          <el-button @click="resetForm('detailDialog')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import {checkNewTopicName, getAllCaseExecution, saveTestTopic, updateTestTopic} from '@/api/model/projectConfig'
  import PROJECT_CONFIG from '@/config/projectConfig'
  import {allMixin} from '../../mixin/allMixin'
  import {getEhrUserDetailLikeUserName} from "@/api/model/testPlan";

  export default {
    name: 'ProjectConfigDetail',
    mixins: [allMixin],
    data() {
      return {
        saveButtonStatus: false,
        PROJECT_CONFIG,
        progressRatio: 0,
        projectConfigVisible: false,
        caseExecutionList: [],
        detailDialogValue: {
          id: '',
          topicName: '',
          taskIdList: '',
          relationRequirement: '',
          remark: '',
          topicMaster: '',
          upTime: '',
          topicParticipant: []
        },
        caseOptions: [],
        loading: false,
        // 新增编辑标识
        caseType: 'add',
        topicParticipant: '',
        responsiblePersonList: []
      }
    },
    mounted() {
      this.getAllCaseExecution()
      this.isValidateKey = (this.caseType === 'edit')
    },
    methods: {
      // ...mapActions(['queryStaffDataSource']),
      handleClose() {
        this.$refs.detailDialog.resetFields()
        this.projectConfigVisible = false
      },
      async getAllCaseExecution() { // 获取所有测试执行
        const params = {
          topicId: this.caseType === 'edit' ? this.detailDialogValue.id : ''
        }
        const res = await getAllCaseExecution(params)
        const respData = res.data || []
        this.caseExecutionList = respData
        this.caseOptions = this.caseExecutionList || []
      },
      remoteMethod(queryString) {
        if (queryString !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.caseOptions = this.caseExecutionList.filter(item => {
              return item.testTaskName.toLowerCase()
                .indexOf(queryString.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.caseOptions = []
        }
      },
      async checkNewTopicName(event) {
        // 校验名称唯一
        const params = {topicName: event.target.value, id: this.detailDialogValue.id}
        const res = await checkNewTopicName(params)
        const result = res.data
        if (result) {
          this.saveButtonStatus = false
        } else {
          this.saveButtonStatus = true
        }
      },
      async saveTopic(params) {
        saveTestTopic(params)
          .then(res => {
            if (!res.success) {
              return
            }
            this.$notify({
              type: 'success',
              message: '保存成功'
            })
            this.$emit('queryProjectList')
          })
      },
      async updateTopic(params) {
        updateTestTopic(params)
          .then(res => {
            if (!res.success) {
              return
            }
            this.$notify({
              type: 'success',
              message: '保存成功'
            })
            this.$emit('queryProjectList')
          })
      },
      async submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const {
              id,
              taskIdList,
              topicMaster,
              topicName,
              topicParticipant,
              relationRequirement,
              upTime,
              remark
            } = this.detailDialogValue
            const topicParticipantStr = topicParticipant && topicParticipant.toString()
            const params = {
              id,
              relationRequirement,
              taskIdList,
              topicMaster,
              topicName,
              upTime,
              remark,
              topicParticipant: topicParticipantStr
            }
            if (this.caseType === 'add') {
              this.saveTopic(params)
            } else {
              this.updateTopic(params)
            }
            this.$refs[formName].resetFields()
            this.projectConfigVisible = false
          } else {
            this.projectConfigVisible = true
            this.$notify({
              type: 'error',
              message: '保存失败'
            })
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.projectConfigVisible = false
      },
      // 获取用户名单
      async getEhrUserDetailLikeUserName(userName) {
        const params = {
          userName: userName
        }
        const res = await getEhrUserDetailLikeUserName(params)
        this.responsiblePersonList = res.data
      },
      remoteUserName(query) {
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
  @import "./projectConfig.scss";
</style>
