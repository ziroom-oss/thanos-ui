<template>
  <div>
    <el-dialog
      :visible.sync="CaseReportShow"
      width="90%"
      :title="CaseReportTitle"
      :before-close="closeChange"
      style="margin-top: -30px"
    >
      <el-row
        :gutter="24"
        class="margin-bottom15 bg"
        style="margin-top: -30px"
      >
        <el-col :span="24">
          <span class="report-detail-title">测试执行结果:</span>
          <span class="margin-left10">
              <span class="success">{{ caseExecutionResult.status }}</span>
            </span>
          <span class="margin-left10">(当前进度)
              <span class="failure">{{ caseExecutionResult.progress }}</span>
            </span>
        </el-col>
      </el-row>
      <el-row :gutter="24" class="bg">
        <el-col :span="23">
          <span class="report-detail-title">测试结果汇总:</span>
          <span class="report-detail-content margin-left10">{{ summaryCaseReport.taskName }}</span>
        </el-col>
        <el-col :span="1">
          <i class="el-icon-caret-bottom check-more" v-show="!bugListVisible" @click="bugListVisibleChange"></i>
          <i class="el-icon-caret-top check-more" v-show="bugListVisible" @click="bugListVisibleChange"></i>
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        v-show="bugListVisible"
        style="margin-top: -10px"
      >
        <el-col :span="20" class="margin-bottom15">
          <div class="margin-bottom">
              <span class="case-report title margin-left">
                关联需求:
                {{ summaryCaseReport.jiraRequirement }}
              </span>
            <span class="case-report title margin-left">
                测试用例总数:
                <span style="color: green">{{ summaryCaseReport.totalCount }}</span>
                个
              </span>
            <span class="case-report title margin-left">
                执行通过率:
                <span class="success">{{ summaryCaseReport.passedRatio }}</span>
              </span>
            <span class="case-report title margin-left">
                执行失败率:
                <span class="failure">{{ summaryCaseReport.failedRatio }}</span>
              </span>
            <span class="case-report title margin-left">
                执行跳过率:
                <span style="color: yellowgreen">{{ summaryCaseReport.skippedRatio }}</span>
              </span>
            <span class="case-report title margin-left">
                总计发现BUG总数:
                <span style="color: pink">{{ pagination.total }}</span>
                个
              </span>
          </div>
        </el-col>
      </el-row>
      <el-row
        :gutter="24"
        v-show="bugListVisible"
        style="margin-bottom: -20px"
      >
        <el-col :span="24"
        >
          <el-table
            :data="caseResultList"
            border
            style="width: 100%">
            <el-table-column
              prop="issueKey"
              label="ISSUE-KEY"
              width="180">
            </el-table-column>
            <el-table-column
              prop="description"
              label="描述"
              width="180">
            </el-table-column>
            <el-table-column
              prop="bugStatus"
              label="BUG-状态">
            </el-table-column>
            <el-table-column
              prop="priority"
              label="优先级">
            </el-table-column>
            <el-table-column
              prop="bugEndTypeStr"
              label="BUG所属端">
            </el-table-column>
            <el-table-column
              prop="executionVersion"
              label="执行版本号">
            </el-table-column>
            <el-table-column
              prop="executorName"
              label="测试执行人">
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination"
            background
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next, jumper"
            :current-page="pagination.current"
            :total="pagination.total">
          </el-pagination>
        </el-col>
      </el-row>
      <el-row :gutter="24" class="bg">
        <el-col :span="23">
          <span class="report-detail-title">测试执行明细:</span>
        </el-col>
        <el-col :span="1">
          <i class="el-icon-caret-bottom check-more" v-show="!caseExecutionVisible"
             @click="caseExecutionVisibleChange"></i>
          <i class="el-icon-caret-top check-more" v-show="caseExecutionVisible" @click="caseExecutionVisibleChange"></i>
        </el-col>
      </el-row>
      <el-row
        v-show="caseExecutionVisible"
        style="margin-bottom: -20px;margin-top: -15px;margin-left: 10px"
        :gutter="18"
      >
        <el-tabs @tab-click="handleTabClick" v-model="tabName">
          <el-tab-pane v-for="(item, index) of caseDetailLabel" :label="CASE_REPORT_CONFIG['caseReportLabrl'][item]"
                       :name="item" :key="index">
          </el-tab-pane>
        </el-tabs>
        <el-table
          border
          :data="caseDetailList"
          style="width: 99%">
          <el-table-column
            prop="id"
            label="用例ID">
          </el-table-column>
          <el-table-column
            prop="casename"
            label="用例名称"/>
          <el-table-column
            prop="testCaseLevel"
            label="用例等级"
            width="180">
          </el-table-column>
          <el-table-column
            prop="type"
            label="用例类型">
          </el-table-column>
          <el-table-column
            prop="executionVersion"
            label="执行版本号">
          </el-table-column>
          <el-table-column
            prop="relationBug"
            label="最后关联BUG">
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          background
          @current-change="handleDetailCurrentChange"
          layout="total, prev, pager, next, jumper"
          :current-page="detailPagination.current"
          :total="detailPagination.total">
        </el-pagination>
      </el-row>
      <el-form :model="emailInfo" ref="emailInfoForm" v-show="emailFlag || complateFlag">
        <el-row
          :gutter="24"
          class="bg"
        >
          <el-col :span="24">
            <span class="report-detail-title">报告通知:</span>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="发件人:" prop="sender">
              <el-select v-model="emailInfo.sender"
                         clearable
                         filterable
                         remote
                         :remote-method="remoteMethod"
                         :loading="loading"
                         @change="userDistricts">
                <el-option v-for="item of responsiblePersonList" :label="item.name + '-' + item.adCode"
                           :key="item.emplid"
                           :value="item.adCode"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收件人:" prop="addressee">
              <el-select v-model="emailInfo.addressee"
                         clearable
                         filterable
                         remote
                         :remote-method="remoteMethod"
                         :loading="loading"
                         multiple
                         @change="userDistricts">
                <el-option v-for="item of responsiblePersonList" :label="item.name + '-' + item.adCode"
                           :key="item.emplid"
                           :value="item.adCode"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抄送人:" prop="ccUser">
              <el-select v-model="emailInfo.ccUser"
                         clearable
                         filterable
                         remote
                         :remote-method="remoteMethod"
                         :loading="loading"
                         multiple
                         @change="userDistricts">
                <el-option v-for="item of responsiblePersonList" :label="item.name + '-' + item.adCode"
                           :key="item.emplid"
                           :value="item.adCode"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
<!--                    <el-form-item label="邮件内容:" prop="emailContent">-->
<!--                      <el-input-->
<!--                        type="textarea"-->
<!--                        clearable-->
<!--                        v-model="emailInfo.emailContent"-->
<!--                      />-->
<!--                    </el-form-item>-->
          <el-form-item label="邮件内容:" prop="emailContent">
            <quill-editor class="editor"
                          ref="myTextEditor"
                          v-model="emailInfo.emailContent"
                          :options="editorOption"
                          @blur="onEditorBlur($event)"
                          @focus="onEditorFocus($event)"
                          @ready="onEditorReady($event)"
                          @change="onEditorChange($event)">
            </quill-editor>
          </el-form-item>
        </el-row>
        <el-form-item class="search-button">
          <el-button type="primary" @click="submitTestTask(false)" :loading="buttonLoading" style="float:right"
                     v-if="emailFlag">发送邮件
          </el-button>
          <el-button type="primary" @click="submitTestTask(true)" :loading="buttonLoading" style="float:right"
                     v-if="complateFlag">完成
          </el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
  import {
    getCaseReportResult,
    getSummaryCaseExecution,
    queryCaseTestDetail,
    querySummaryData
  } from '@/api/model/caseReport'
  import CASE_REPORT_CONFIG from '@/config/caseReport.config.js'
  import {completeTaskAndEmail, getEhrUserDetailLikeUserName, sendTestTaskEmail} from "@/api/model/caseExecution";


  export default {
    name: 'CaseReport',
    data: () => ({
      loading: false,
      CaseReportShow: false,
      emailFlag: false,
      complateFlag: false,
      CaseReportTitle: '测试报告',
      summaryCaseReport: {},
      caseExecutionResult: {}, // 测试执行结果
      pagination: {
        total: 0,
        current: 1,
        size: 10
      },
      detailPagination: {
        total: 0,
        current: 1,
        size: 10
      },
      caseResultList: [],
      caseExecutionVisible: true,
      bugListVisible: true,
      caseDetailList: [],
      taskId: '',
      tabName: 'run',
      CASE_REPORT_CONFIG,
      caseDetailLabel: [
        'notStarted',
        'skip',
        'run'
      ],
      emailInfo: {
        sender: "",
        addressee: "",
        ccUser: "",
        emailContent: ""
      },
      responsiblePersonList: [],
      buttonLoading: false,
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
            ["blockquote", "code-block"], // 引用  代码块
            [{header: 1}, {header: 2}], // 1、2 级标题
            [{list: "ordered"}, {list: "bullet"}], // 有序、无序列表
            [{script: "sub"}, {script: "super"}], // 上标/下标
            [{indent: "-1"}, {indent: "+1"}], // 缩进
            // [{'direction': 'rtl'}],                         // 文本方向
            [{size: ["small", false, "large", "huge"]}], // 字体大小
            [{header: [1, 2, 3, 4, 5, 6, false]}], // 标题
            [{color: []}, {background: []}], // 字体颜色、字体背景颜色
            [{font: []}], // 字体种类
            [{align: []}], // 对齐方式
            ["clean"], // 清除文本格式
            ["link", "image", "video"] // 链接、图片、视频
          ], //工具菜单栏配置
        },
        placeholder: '请在这里添加产品描述', //提示
        readyOnly: false, //是否只读
        theme: 'snow', //主题 snow/bubble
        syntax: true, //语法检测
      }
    }),
    computed: {
      editor() {
        return this.$refs.myTextEditor.quillEditor;
      }
    },
    methods: {
      CaseReportClick(id) {
        this.taskId = id
        this.getCaseReportResult(id)
        this.queryCaseTestDetail(this.taskId)
        this.querySummaryData(this.taskId)
        this.getSummaryCaseExecution(this.taskId)
      },
      async getCaseReportResult(id) { // 测试执行结果
        const params = {
          taskId: id
        }
        const res = await getCaseReportResult(params)
        this.caseExecutionResult = res.data
      },
      async getSummaryCaseExecution(id) { // 测试结果汇总
        const params = {
          taskId: id
        }
        const res = await getSummaryCaseExecution(params)
        this.summaryCaseReport = res.data
      },
      bugListVisibleChange() {
        this.bugListVisible = !this.bugListVisible
      },
      caseExecutionVisibleChange() {
        this.caseExecutionVisible = !this.caseExecutionVisible
      },
      async querySummaryData(id) { // 测试结果汇总表格数据源
        const data = {
          page: {...this.pagination},
          searchObj: {
            executionTaskId: id
          }
        }
        const res = await querySummaryData(data)
        const respData = res.data
        this.caseResultList = respData.records || []
        this.pagination.total = respData.total
      },
      async queryCaseTestDetail(id) { // 测试执行明细列表
        const data = {
          page: {...this.detailPagination},
          searchObj: {
            taskId: id,
            type: this.tabName || 'notStarted'
          }
        }
        const res = await queryCaseTestDetail(data)
        const respData = res.data
        this.caseDetailList = respData.records || []
        this.detailPagination.total = respData.total
      },
      handleCurrentChange(val) { // 分页
        this.pagination.current = val
        this.querySummaryData(this.taskId)
      },
      handleDetailCurrentChange(val) { // 分页
        this.detailPagination.current = val
        this.queryCaseTestDetail(this.taskId)
      },
      handleTabClick(tab) {
        this.tabName = tab.name
        this.queryCaseTestDetail(this.taskId)
      },
      closeChange() {
        this.CaseReportShow = false
        this.emailFlag = false
        this.complateFlag = false
        this.caseExecutionVisible = true
        this.bugListVisible = true
        this.emailInfo = {}
        this.buttonLoading = false
      },
      userDistricts() {
        this.$forceUpdate()
      },
      submitTestTask(complateFlag) {
        this.buttonLoading = true
        this.emailInfo.addressee = this.emailInfo.addressee && this.emailInfo.addressee.toString()
        this.emailInfo.ccUser = this.emailInfo.ccUser && this.emailInfo.ccUser.toString()
        this.emailInfo.taskId = this.taskId
        if (!this.emailInfo.sender) {
          this.$notify({
            type: 'error',
            message: '发件人不能为空!!!'
          })
          this.changeDropDownListType()
          return
        }
        if (!this.emailInfo.addressee) {
          this.$notify({
            type: 'error',
            message: '收件人不能为空!!!'
          })
          this.changeDropDownListType()
          return
        }
        if (!this.emailInfo.emailContent) {
          this.$notify({
            type: 'error',
            message: '邮件内容不能为空!!!'
          })
          this.changeDropDownListType()
          return
        }

        const params = {
          ...this.emailInfo
        }
        if (complateFlag) {
          completeTaskAndEmail(params).then(res => {
            if (!res.success) {
              this.changeDropDownListType()
              return
            }
            this.$notify({
              type: 'success',
              message: '保存成功'
            })
            this.$emit('queryCaseExecution')
            this.closeChange()
            this.$router.replace('/caseExecution')
          })
        } else {
          sendTestTaskEmail(params).then(res => {
            if (!res.success) {
              this.changeDropDownListType()
              return
            }
            this.$notify({
              type: 'success',
              message: '保存成功'
            })
            this.$emit('queryCaseExecution')
            this.closeChange()
            this.$router.replace('/caseExecution')
          })
        }
      },
      changeDropDownListType(){
        this.emailInfo.addressee = this.emailInfo.addressee && this.emailInfo.addressee.split(',')
        this.emailInfo.ccUser = this.emailInfo.ccUser && this.emailInfo.ccUser.split(',')
        this.buttonLoading = false
      },
      // 失去焦点
      onEditorBlur(editor) {
      },
      // 获得焦点
      onEditorFocus(editor) {
      },
      // 开始
      onEditorReady(editor) {
      },
      // 值发生变化
      onEditorChange(editor) {
        this.emailInfo.emailContent = editor.html;
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
  @import "./CaseExecutionStyle/CaseReport.scss";

  .margin-bottom {
    margin-top: 15px;
  }

  .margin-left {
    margin-left: 15px
  }

  .case-report {
    display: inline-block;
  }

  .border-left {
    border-left: 4px #1B58F8 solid;
    font-size: 14px;
    padding: 10px;
    color: #606266;
    background: #eee;
  }

  .pagination {
    margin: 20px 10px 30px 0px;
    float: right;
  }

  .case-detail {
    clear: both
  }

  ::v-deep .el-dialog__body {
    overflow-y: auto;
    height: 74vh;
  }

  .title {
    font-size: 14px;
    color: #444;
    font-weight: 500;
  }

  .case-report-title {
    font-size: 24px;
  }

  .back {
    cursor: pointer;
  }
</style>
