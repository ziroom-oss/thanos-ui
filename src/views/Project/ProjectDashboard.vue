
<template>
  <div class="project-dashboard">
    <el-card shadow="hover">
      <div class="project-search margin-bottom20">
        <el-input v-model="projectName" placeholder="项目名称" clearable/>
        <el-button icon="el-icon-search" class="icon-search" circle @click="handleSearchProject"></el-button>
      </div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="参与的项目" name="first">
          <div>
            <el-card shadow="hover" v-for="item of inProjectList" :key="item.id" class="margin-bottom20 project-init">
              <div style="margin-left: 10px">
                <span class="name">项目名称:</span>
                <span class="name content">{{item.topicName}}</span>
              </div>
              <div style="margin-left: 10px">
                <span class="name">关联需求:</span>
                <span class="name content">{{item.relationRequirement}}</span>
              </div>
              <div class="create-button">
                <el-button slot="reference" class="margin-left10" type="danger" @click="handleDailtReport(item)">创建日报</el-button>
                <el-button type="primary" class="check-button-history" @click="checkHistoryReport(item)">查看历史日报</el-button>
<!--                <el-button type="success" v-show="false" @click="checkDailyReport(item)">查看日报</el-button>-->
<!--                <el-button type="primary" v-show="false" @click="handleProjectRisk(item)">项目风险</el-button>-->
                <el-button slot="reference" class="margin-left10" type="sendmail" @click="sendMail(item)">发送日报邮件</el-button>
              </div>
            </el-card>
            <el-pagination
              class="pagination"
              background
              layout="total, jumper, prev, pager, next"
              @current-change="handleCurrentChange"
              :current-page="pagination.current"
              :total="pagination.total">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="全部项目" name="second">
          <div>
            <el-card shadow="hover" v-for="item of allProjectList" :key="item.id" class="margin-bottom20 project-init">
              <div>
                <span class="name">项目名称:</span>
                <span class="name content">{{item.topicName}}</span>
              </div>
              <div>
                <span class="name">关联需求:</span>
                <span class="name content">{{item.relationRequirement}}</span>
              </div>
              <div class="create-button">
                <el-button type="primary" class="check-button-history" @click="checkHistoryReport(item)">查看历史日报</el-button>
                <el-button type="success" v-show="item.newDailyId" @click="checkDailyReport(item)">查看日报</el-button>
              </div>
            </el-card>
            <el-pagination
              class="pagination"
              background
              layout="total, jumper, prev, pager, next"
              @current-change="handleCurrentChange"
              :current-page="allPagination.current"
              :total="allPagination.total">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="project-dashboard">
      </div>
      <el-dialog
        :title="title"
        :visible.sync="riskDialogVisible"
        width="30%"
        :close-on-click-modal="false"
        :before-close="handleClose">
        <div class="row">
          <span class="risk-title">新的项目风险: </span>
          <el-select v-model="projectRiskValue" filterable clearable @change="handleCreateRisk"  placeholder="请输入项目风险">
            <el-option
              v-for="item in notSelectProjectRisk"
              :key="item.riskId"
              :label="item.testRiskName"
              :value="item.riskId"
            >
            </el-option>
          </el-select>
        </div>
<!--        <div class="project-risk row">-->
<!--          <span class="risk-title">现有项目风险: </span>-->
<!--          <el-tag v-for="item of alreadyProjectRiskLists" :key="item.riskId" class="risk-title" closable @close="deleteProjectRisk(item.riskId)">-->
<!--            {{ item.testRiskName }}-->
<!--          </el-tag>-->
<!--        </div>-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="projectRiskSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <mail-send ref="sendMail" sendMail='false'></mail-send>
  </div>
</template>
<script>
import {
  queryAllrojectList,
  queryMyrojectList,
  queryCreateReport,
  queryAlreadyRiskList,
  queryUnknownRiskList,
  querySaveRiskList,
  queryCreateRisk,
  findDailyTestReportEmail,
  checkNewDailyReport
} from '@/api/model/project'
import { debounce } from '@/assets/js/utils.js'
import MailSend from './mailSend'

export default {
  name: 'ProjectDashboard',
  components: { MailSend },
  data: () => ({
    inProjectList: [],
    allProjectList: [],
    riskDialogVisible: false,
    activeName: 'first',
    pagination: {
      size: 10,
      total: 0,
      current: 1
    },
    allPagination: {
      size: 10,
      total: 0,
      current: 1
    },
    projectName: '',
    projectRiskValue: '',
    existProjectLists: [],
    notSelectProjectRisk: [],
    alreadyProjectRiskLists: [],
    projectId: '',
    title: '',
    getId: ''
  }),
  async mounted () {
    await this.queryAllrojectList() // 全部项目
    await this.queryMyrojectList() // 参与的项目
  },
  methods: {
    async queryAllrojectList () { // 全部项目
      const data = {
        page: {
          ...this.allPagination
        },
        searchObj: {
          topicName: this.projectName
        }
      }
      const res = await queryAllrojectList(data)
      const respData = res.data
      this.allPagination.total = respData.total
      this.allProjectList = respData.records || []
    },
    async queryMyrojectList () { // 我参与的项目
      const data = {
        page: {
          ...this.pagination
        },
        searchObj: {
          topicName: this.projectName
        }
      }
      const res = await queryMyrojectList(data)
      const respData = res.data
      this.inProjectList = respData.records || []
      this.pagination.total = respData.total
    },
    async handleCurrentChange (val) {
      this.pagination.current = val
      this.activeName === 'first' ? await debounce(this.queryMyrojectList()) : await debounce(this.queryAllrojectList())
    },
    handleDailtReport (data) {
      this.riskDialogVisible = true
      this.projectId = data.id
      this.title = '新建项目日报'
      this.queryAlreadyRiskList(data.id)
      this.queryUnknownRiskList(data.id)
    },
    async createDailtReport () {
      queryCreateReport({ topicId: this.projectId }).then((res) => {
        if (!res.success) {
          return
        }
        this.$router.push({
          path: '/projectReport',
          query: {
            id: this.projectId,
            reportId: res.data
          }
        })
      })
    },
    async handleSearchProject () {
      this.activeName === 'first' ? await debounce(this.queryMyrojectList()) : await debounce(this.queryAllrojectList())
    },
    // handleProjectRisk (rowData) {
    //   this.riskDialogVisible = true
    //   this.projectId = rowData.id
    //   this.title = '项目风险'
    //   this.queryAlreadyRiskList(rowData.id)
    //   this.queryUnknownRiskList(rowData.id)
    // },
    async queryAlreadyRiskList (id) {
      const params = {
        topicId: this.projectId
      }
      const res = await queryAlreadyRiskList(params)
      this.alreadyProjectRiskLists = res.data
    },
    async queryUnknownRiskList (id) {
      const params = {
        topicId: this.projectId
      }
      const res = await queryUnknownRiskList(params)
      this.notSelectProjectRisk = res.data
    },
    handleCreateRisk (val) {
      if (val === '') {
        return false
      }
      typeof (val) === 'number' ? this.handleAlreadyRisk(val) : this.createRisk()
    },
    handleAlreadyRisk (val) {
      if (this.alreadyProjectRiskLists.filter(item => item.riskId === val).length === 0) {
        const selectedVal = this.notSelectProjectRisk.filter(item => item.riskId === val)[0]
        this.alreadyProjectRiskLists.push(selectedVal)
      }
    },
    async saveRisk () { // 保存

    },
    async createRisk () {
      const params = {
        topicId: this.projectId,
        riskName: this.projectRiskValue
      }
      await queryCreateRisk(params)
        .then(res => {
          this.$notify({
            type: 'success',
            message: res.message
          })
          this.queryAlreadyRiskList()
          this.queryUnknownRiskList()
        })
    },
    async deleteProjectRisk (tagId) { // 删除单个风险
      await this.$confirm('确定删除吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.alreadyProjectRiskLists.map(item => item.riskId)
        this.alreadyProjectRiskLists.splice(ids.indexOf(tagId), 1)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async projectRiskSubmit () {
      if (this.projectRiskValue) {
        if (this.title === '新建项目日报') {
          const data = {
            topicId: this.projectId,
            riskIdList: this.projectRiskValue
          }
          // await querySaveRiskList(data)
          querySaveRiskList(data).then((res) => {
            if (res.success) {
              this.projectRiskValue = ''
              queryCreateReport({ topicId: this.projectId }).then((res) => {
                if (!res.success) {
                  return
                }
                this.$router.push({
                  path: '/projectReport',
                  query: {
                    id: this.projectId,
                    reportId: res.data
                  }
                })
              })
            }
          })
        }
      } else {
        this.$notify({
          type: 'error',
          message: '请输入项目风险！'
        })
      }
    },
    // 查看项目
    checkDailyReport (rowData) {
      this.$router.push({
        path: '/projectReport',
        query: {
          id: rowData.id,
          reportId: rowData.newDailyId
        }
      })
    },
    checkHistoryReport (rowData) {
      this.$router.push({
        path: '/projectHitoryReport',
        query: {
          id: rowData.id
        }
      })
    },
    handleClose () {
      this.riskDialogVisible = false
      this.projectRiskValue = ''
    },
    // 点击发送按钮出发事件
    sendMail (val) {
      this.checkNewDailyReport(val)
    },
    // 查询今天是否创建日报
    async checkNewDailyReport (val) {
      const resData = {
        topicId: val.id
      }
      await checkNewDailyReport(resData)
        .then(res => {
          if (res.success) {
            this.findDailyTestReportEmail(val)
            this.$refs.sendMail.sendMailShow = true
          }
        })
    },
    // 今天创建日报调用接口查询今日邮箱信息
    async findDailyTestReportEmail (val) {
      const resData = {
        topicId: val.id,
        dailyId: val.newDailyId
      }
      const res = await findDailyTestReportEmail(resData)
      const getId = res.data
      this.getId = getId.id
      this.$refs.sendMail.mailBody.id = getId.id ? getId.id : ''
      this.$refs.sendMail.mailBody.addresser = getId.addresser ? getId.addresser : ''

      this.$refs.sendMail.mailBody.addressee = getId.addressee ? getId.addressee.split(',') : ''
      this.$refs.sendMail.mailBody.testVersion = getId.testVersion ? getId.testVersion : ''
      this.$refs.sendMail.mailBody.testStage = getId.testStage ? getId.testStage : ''
      this.$refs.sendMail.mailBody.cc = getId.cc ? getId.cc.split(',') : ''
      this.$refs.sendMail.mailBody.bugUrl = getId.bugUrl ? getId.bugUrl : ''
      this.$refs.sendMail.mailBody.ccGroup = getId.ccGroup ? getId.ccGroup : ''
      this.$refs.sendMail.mailBody.emailRemark = getId.emailRemark ? getId.emailRemark : ''
    }
  }
}
</script>
<style lang="scss">
@import "./project-style/project.scss";
.el-button--sendmail{
  background: #23C6C8;
  border-color: #8cd8da;
  color: #FFF;
  &:hover{
    background: #8cd8da;
    color: #FFF;
  }
}
</style>
