<template>
  <div class="app-container">
    <div>
      <div class="search-wrap">
        <el-row :gutter="32">
          <el-col :xs="24" :sm="24" :lg="8">
            <div class="search-section">
              <span class="search-label">用例ID：</span>
              <el-input
                class="search-item"
                placeholder="请输入用例ID"
                v-model="initObj.id"
                clearable
              >
              </el-input>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="8">
            <div class="search-section">
              <span class="search-label">接口ID：</span>
              <el-input
                class="search-item"
                placeholder="请输入接口ID"
                v-model="initObj.apiId"
                clearable
              >
              </el-input>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="8">
            <div class="search-section">
              <span class="search-label">用例名称：</span>
              <el-input
                class="search-item"
                placeholder="请输入用例名称(支持模糊搜索)"
                v-model="initObj.caseName"
                clearable
              >
              </el-input>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="8">
            <div class="search-section">
              <span class="search-label">请求URI：</span>
              <el-input
                class="search-item"
                placeholder="请输入请求URI"
                v-model="initObj.requestUri"
                clearable
              >
              </el-input>
            </div>
          </el-col>

          <el-col :xs="24" :sm="24" :lg="8">
            <div class="search-section">
              <span class="search-label">用户姓名：</span>
              <el-input
                class="search-item"
                placeholder="请输入用户姓名"
                v-model="initObj.realName"
                clearable
              >
              </el-input>
            </div>
          </el-col>

          <el-col :xs="24" :sm="24" :lg="8">
            <div class="search-section">
              <span class="search-label">应用名称：</span>
              <el-select
                class="search-item"
                v-model="initObj.applicationName"
                filterable
                clearable
                placeholder="请选择目标应用"
                @change="getTagsList"
                value=""
              >
                <el-option
                  v-for="item in omegaList"
                  :key="item.applicationName"
                  :label="item.applicationName"
                  :value="item.applicationName"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :xs="24" :sm="24" :lg="8">
            <div class="search-section">
              <span class="search-label">接口标签：</span>
              <el-select
                class="search-item"
                v-model="initObj.controllerName"
                filterable
                clearable
                placeholder="请选择接口标签"
                value=""
              >
                <el-option
                  v-for="item in tagsList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="8">
            <div class="search-section">
              <span class="search-label">是否可运行：</span>
              <el-select
                class="search-item"
                v-model="initObj.isRunnable"
                filterable
                clearable
                placeholder="请选择运行结果"
                value=""
              >
                <el-option label="可运行" value="1"></el-option>
                <el-option label="不可运行" value="0"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="8">
            <div class="search-section">
              <span class="search-label">日期范围：</span>
              <el-date-picker
                class="search-item"
                v-model="daterange"
                format="yyyy-MM-dd"
                value-format="timestamp"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="datePickerChange"
              >
              </el-date-picker>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="search-btn">
        <el-button type="primary" @click="searchEv">查询</el-button>
        <el-button class="bot-btn" @click="resetSearchObj">重置</el-button>
      </div>
    </div>
    <el-button-group class="run-btn">
      <el-button
        type="primary"
        size="small"
        @click="chooseEnv()"
        element-loading-text="正在拼命运行中"
        >T环境运行
      </el-button>
      <el-button
        type="warning"
        size="small"
        @click="run('q')"
        v-loading.fullscreen.lock="fullscreenLoading"
        element-loading-text="正在拼命运行中"
        >Q环境运行
      </el-button>
      <!-- <el-button
        type="primary"
        size="small"
        element-loading-text="正在拼命运行中"
        @click="runCase"
        >运行
      </el-button> -->
      <el-button
        type="success"
        size="small"
        icon="el-icon-data-analysis"
        @click="toReportRouter"
        >运行报告
      </el-button>
    </el-button-group>

    <el-dialog
      title="提示信息"
      :visible.sync="runDialogVisible"
      width="30%"
      :close-on-click-modal="false"
      @close="closeEv"
    >
      <div style="margin-bottom: 30px; color: orange">
        <i class="el-icon-info"></i>请先进行选择运行环境（默认测试环境）
      </div>
      <el-radio-group v-model="caseRunEnv">
        <el-radio label="t" size="small">t环境</el-radio>
        <el-radio label="kt" size="small">kt环境</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEv">取 消</el-button>
        <el-button
          type="primary"
          @click="run(caseRunEnv)"
          v-loading.fullscreen.lock="fullscreenLoading"
          element-loading-text="正在拼命运行中"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="提示信息"
      :visible.sync="directRunDialogVisible"
      width="30%"
      :close-on-click-modal="false"
      @close="closeEv"
    >
      <div style="margin-bottom: 30px; color: orange">
        <i class="el-icon-info"></i>请先进行选择运行环境（默认测试环境）
      </div>
      <el-radio-group v-model="caseRunEnv">
        <el-radio label="t" size="small">t环境</el-radio>
        <el-radio label="kt" size="small">kt环境</el-radio>
        <el-radio label="q" size="small">q环境</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDirectRunEv">取 消</el-button>
        <el-button
          type="primary"
          @click="run(caseRunEnv)"
          v-loading.fullscreen.lock="fullscreenLoading"
          element-loading-text="正在拼命运行中"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- @select="handleSelectionChangeCase"
      @select-all="handleSelectionChangeCase" -->
    <el-table
      v-loading="listLoading"
      :data="tableList"
      style="width: 100%; font-size: 13px"
      max-height="500"
      highlight-current-row
      border
      fit
    >
      <!-- 展开行 -->
      <el-table-column type="expand" label="用例列表">
        <template slot-scope="scope">
          <case-list
            :rowData="scope.row"
            :rowIndex="scope.$index"
            @updateListTable="getList"
            @caseCopyShow="caseCopyShow"
            @routerReportCase="routerReportCase"
            @selectCaseList="selectCaseList"
          ></case-list>
        </template>
      </el-table-column>
      <!-- <el-table-column type="selection" width="50" align="center" fixed="left">
      </el-table-column> -->
      <el-table-column label="接口ID" prop="apiId" align="center" width="85">
        <template slot-scope="scope">
          <span>{{ scope.row.apiId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用名" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.applicationName || "暂无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求类型" width="170px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.requestType }}</span>
        </template>
      </el-table-column>
      <!--            <el-table-column label="用例数量" width="100px" align="center">-->
      <!--                <template slot-scope="scope">-->
      <!--                    <span>{{ scope.row.caseTotal }}</span>-->
      <!--                </template>-->
      <!--            </el-table-column>-->
      <el-table-column label="所含用例数" width="85px" align="center">
        <template slot-scope="scope">
          <el-tooltip
            placement="top"
            :content="scope.row.caseTotal + '' || '0'"
          >
            <el-tag>{{ scope.row.caseTotal }}</el-tag>
            <!-- <div slot="content">点击后将跳转到<br />对应的用例列表</div>
            <span
              class="link-type"
              @click="getApiTable(scope.row.id, scope.row.encryptType)"
              >编辑用例({{ scope.row.caseTotal }})</span
            > -->
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="新增用例" width="80px" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-circle-plus"
            type="primary"
            @click="handleAddCase(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="请求URI" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.requestUri }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维护人" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.realName || "暂无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="220px">
        <template slot-scope="{ row }">
          <el-button-group>
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top-start"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="caseEditShow(row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="复制"
              placement="top-start"
            >
              <el-button
                type="primary"
                icon="el-icon-document-copy"
                size="mini"
                @click="caseCopyShow(row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="历史报告"
              placement="top-start"
            >
              <el-button
                type="primary"
                icon="el-icon-data-analysis"
                size="mini"
                @click="routerReportCase(row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top-start"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteCase(row)"
              ></el-button>
            </el-tooltip>
            <!-- 新增用例 -->
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="pageNum"
      :limit.sync="pageSize"
      @pagination="getList"
    />

    <!-- 用例弹框 -->
    <!-- <dialog-case-form
      :formTitle="formTitle"
      :apiFormShow="apiFormShow"
      :caseRowData="caseRowData"
      :caseFormData="form"
      @closeCaseForm="closeCaseForm"
      @getList="getList"
    /> -->

    <!-- 接口编辑弹框 -->
    <DiaLogApiForm
      :formTitle="formTitle"
      :apiFormShow="apiFormShow"
      :apiFormData="form"
      @closeApiForm="closeApiForm"
      @getList="getList"
    />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import CaseList from './components/single-api-search-list/caseList'
import DiaLogApiForm from './components/single-api-search-list/dialogApiForm'
// import DialogCaseForm from './components/single-api-search-list/dialogCaseForm'
import {
  getSytemList,
  // fetchCaseList,
  changeCaseRunStatus,
  runCase,
  deleteCase,
  findSingleApiListTableDataV2,
  myJoinApplication,
  getApiTags
} from '@/api/model/singleApiList'
import { getBusinessList } from '@/api/model/jmxLoadCase'
import {
  getSqlList,
  getRelyList,
  getSqlInfoById,
  getSqlByName
} from '@/api/model/singleApiSave'
import { getMockMsgList } from '@/api/model/mockMqMsg'
import { getEsSearchConditionList } from '@/api/model/esSearchConfiguration'

export default {
  name: 'single-api-search-list',
  components: {
    Pagination,
    CaseList,
    DiaLogApiForm
    // DialogCaseForm
  },
  data () {
    var verifyAssert = (rule, value, callback) => {
      if (this.form.assertList.length === 0) {
        callback(new Error('断言不能为空'))
      } else {
        callback()
      }
    }
    return {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      initObj: {
        id: '',
        caseName: '',
        apiId: '',
        requestUri: '',
        realName: '',
        businessLine: '',
        systemName: '',
        isRunnable: '',
        startDate: '',
        endDate: '',
        applicationName: '',
        controllerName: ''
      },
      daterange: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ],
        disabledDate (time) {
          // 限制结束日期（不限制时分秒）小于等于当天
          return time.getTime() > new Date() * 1 + 600 * 1000
        }
      },
      apiId: '',
      singleApiCaseIdList: [],
      formTitle: '', // 对话框标题
      apiFormShow: false, // 对话框显示隐藏
      selectionCaseId: '',
      businessList: [],
      omegaList: [],
      systemList: [],
      tagsList: [],

      teamList: [],
      listLoading: false,
      tableList: [],
      form: {
        requestParam: '',
        relyApiId: '',
        relyApiDetail: '',
        relyMqId: '',
        relyMqTopic: '',
        relyEsId: '',
        relyEsName: '',
        comment: '',
        expectedResults: '',
        assertType: 0,
        caseName: '',
        originalCaseName: '',
        apiType: '',
        encryptType: '',
        relyType: '',
        header: '',
        isRely: '',
        requestUri: '',
        preSqlId: '',
        postSqlId: '',
        assertList: [],
        deleteAssertIds: ''
      },
      beforeApiParam: {
        apiType: '',
        encryptType: '',
        isRely: '',
        requestUri: '',
        header: ''
      },
      sqlForm: {
        items: []
      },
      preSqlList: [],
      postSqlList: [],
      sqlList: [],
      relyList: [
        {
          id: '',
          relyId: '',
          caseName: '',
          requestUri: ''
        }
      ],
      relyMqList: [],
      relyEsList: [],
      fullscreenLoading: false,
      radio: '',
      runDialogVisible: false,
      directRunDialogVisible: false,
      caseRunEnv: 't',
      caseFormLoading: false,
      rules: {
        assertList: [{ validator: verifyAssert }]
      },
      smartAssertProp: {
        normalShow: true,
        titleHeight: 'height:30px',
        radioMargin: 'margin:10px 10px 10px 10px'
      },
      assertListProp: [],
      caseIds: '', // 选中要运行的
      selectCaseGroup: []
    }
  },
  created () {
    // this.getBusinessList();
    //
    this.getOmegaList()
    // this.getSystemList();
    this.getList()
    this.getMqRelyList()
    this.getEsRelyList()
  },
  methods: {
    // 向父组件传递apiId等信息
    getApiTable (id, encryptType) {
      const caseInfo = {
        id: id,
        apiShow: false,
        encryptType: encryptType
      }
      this.$emit('listenChangeApiShow', caseInfo)
    },
    // 隐藏接口 展示用例
    listenChangeApiShow (data) {
      this.apiId = data.id.toString()
      this.apiTableShow = data.caseShow
      this.caseTableShow = true
      this.headerName = '用例列表'
      this.$refs.caseTable.getInitList(this.apiId, data.encryptType)
    },
    isJSON (str) {
      if (typeof str === 'string') {
        try {
          var obj = JSON.parse(str)
          return !!(typeof obj === 'object' && obj)
        } catch (e) {
          return false
        }
      }
    },
    datePickerChange () {
      if (this.daterange !== null && this.daterange.length === 2) {
        this.initObj.startDate = Math.round(this.daterange[0] / 1000)
        // 结束时间加1天秒数
        this.initObj.endDate = Math.round(this.daterange[1] / 1000) + 86400
        this.getList()
      } else {
        this.initObj.startDate = ''
        this.initObj.endDate = ''
        this.getList()
      }
    },
    getBusinessList () {
      getBusinessList().then((response) => {
        this.businessList = response.data
      })
    },
    getOmegaList () {
      myJoinApplication().then((response) => {
        this.omegaList = response.data
      })
    },
    getTagsList () {
      getApiTags({ applicationName: this.initObj.applicationName }).then(
        (response) => {
          this.tagsList = response.data
        }
      )
    },
    getSystemList () {
      getSytemList().then((response) => {
        this.systemList = response.data
      })
    },
    getList () {
      this.listLoading = true
      this.initObj.requestUri = this.initObj.requestUri.trim()
      findSingleApiListTableDataV2(
        { pageNum: this.pageNum, pageSize: this.pageSize },
        this.initObj
      ).then((response) => {
        if (response.success) {
          this.listLoading = false
          var tableList = response.data.records
          this.tableList = []
          for (var i = 0; i < tableList.length; i++) {
            var tableObj = tableList[i]
            tableObj.isRunnable = tableList[i].isRunnable === 1
            this.tableList.push(tableObj)
          }
          this.total = response.data.total
        }
      })
    },
    searchEv () {
      this.getList()
    },
    // 更改运行状态
    changeCaseRunStatus (row) {
      changeCaseRunStatus({ id: row.id, isRunnable: row.isRunnable }).then(
        (response) => {
          if (response.success) {
            this.getList()
          } else {
            this.$message({
              type: 'error',
              message: '更改失败!'
            })
          }
        }
      )
    },
    resetSearchObj () {
      this.initObj = {
        id: '',
        caseName: '',
        requestUri: '',
        realName: '',
        businessLine: '',
        systemName: '',
        isRunnable: ''
      }
      this.daterange = ''
      this.getList()
    },
    handleSelectionChangeCase (selection) {
      var id = ''
      for (var i = 0; i < selection.length; i++) {
        id += selection[i].id + ','
      }
      this.selectionCaseId = id.substring(0, id.length - 1)
    },
    chooseEnv () {
      if (this.caseIds.length < 1) {
        this.$message({
          message: '请选中后再运行！',
          type: 'error'
        })
        return false
      }
      this.runDialogVisible = true
    },
    closeEv () {
      this.runDialogVisible = false
      this.caseRunEnv = 't'
    },
    closeDirectRunEv () {
      this.directRunDialogVisible = false
      this.caseRunEnv = 't'
    },
    run (env) {
      if (this.caseIds.length < 1) {
        this.$message({
          message: '请选中后再运行！',
          type: 'error'
        })
        return false
      }
      const param = {}
      this.directRunDialogVisible = false
      this.runDialogVisible = false
      this.fullscreenLoading = true
      param.caseIds = this.caseIds
      param.env = env
      runCase(param).then((response) => {
        if (response.success) {
          const sum = response.data.sum
          const success = response.data.success
          const failure = response.data.failure
          this.$message({
            message:
              '共执行测试用例总数：' +
              sum +
              ',执行成功：' +
              success +
              ',执行失败:' +
              failure,
            type: 'success'
          })
        }
      }).finally(() => {
        console.log('aaa')
        this.getList()
        this.fullscreenLoading = false
      })
    },
    // 获取用例选择
    selectCaseList ({ data, index }) {
      this.selectCaseGroup[index] = data
      const caseIds = this.selectCaseGroup.flat(1).map(item => item.id)
      this.caseIds = caseIds.join(',')
    },
    getJsonPathAssert (tab) {
      let content = ''
      const array = tab.pathContent
      for (let i = 0; i < array.length; i++) {
        content +=
          array[i].express +
          array[i].operator +
          array[i].expectValue +
          array[i].link
      }
      if (content.substring(content.length - 4) === 'null') {
        return content.substring(0, content.length - 4)
      }
      return content
    },
    toReportRouter () {
      if (this.caseIds === '') {
        this.$message({
          message: '请选中用例后再查看报告！',
          type: 'error'
        })
        return false
      }
      const caseIds = this.caseIds
      const { href } = this.$router.resolve({
        path: '/interfaces/singleApi/single-api-case-latest-report',
        query: {
          caseIds: caseIds
        }
      })
      window.open(href, '_blank')
    },
    routerReportCase (row) {
      // 编辑row下的id
      const { singleApiCaseList = [] } = row
      if (singleApiCaseList.every(item => item.recordResult !== null)) {
        this.$message({
          message: '该接口是有用例是【未执行】状态,无报告信息！',
          type: 'error'
        })
        return false
      }

      const { href } = this.$router.resolve({
        path: '/interfaces/singleApi/single-api-case-history-report',
        query: {
          caseIds: singleApiCaseList.some(item => item.id)
        }
      })
      window.open(href, '_blank')
    },
    // 编辑dialog显示
    caseEditShow (row) {
      this.formTitle = '接口编辑'
      this.apiId = row.apiId
      this.form = row
      this.apiFormShow = true
      console.log(row)
    },
    // 复制dialog显示
    caseCopyShow (row) {
      this.formTitle = '接口复制'
      this.apiId = row.apiId
      this.form = row
      this.apiFormShow = true
    },

    // 编辑dialog显示后加载依赖列表
    getRelyList () {
      getRelyList({ caseName: null }).then((response) => {
        this.relyList = response.data
      })
    },
    // 获取relyMqList
    getMqRelyList () {
      getMockMsgList({ pageNum: 1, pageSize: 10000 }, {}).then((response) => {
        this.relyMqList = response.data.records
      })
    },
    // 获取relyEsList
    getEsRelyList () {
      getEsSearchConditionList({ pageNum: 1, pageSize: 10000 }, {}).then(
        (response) => {
          if (response.success) {
            this.relyEsList = response.data.records
          }
        }
      )
    },
    reloadSqlList (item) {
      if (item.sqlType === '1') {
        debugger
        this.sqlList = this.preSqlList
      } else {
        this.sqlList = this.postSqlList
      }
    },
    async displaySqlDetail (item) {
      let sql = {}
      await getSqlByName({ sqlName: item.sqlName }).then((response) => {
        sql = response.data
      })
      item.sqlDetail = sql.sqlData
      item.sqlId = sql.id
      if (item.sqlType === '1') {
        this.form.preSqlId = item.sqlId
      } else {
        this.form.postSqlId = item.sqlId
      }
    },
    async getSqlInfoById (sqlId, sqlType) {
      let sql = {}
      await getSqlInfoById({ id: sqlId }).then((response) => {
        sql = response.data
      })
      const obj = {
        sqlType: sqlType,
        sqlId: sqlId,
        sqlName: sql.sqlName,
        sqlDetail: sql.sqlData
      }
      this.sqlForm.items.push(obj)
    },
    // 初始化加载--获取sql列表
    getSqlList () {
      getSqlList({ isPrep: '1' }).then((response) => {
        this.preSqlList = response.data
      })
      getSqlList({ isPrep: '0' }).then((response) => {
        this.postSqlList = response.data
      })
    },
    // 获取编辑前的接口信息
    getBeforeApiParam (formInfo) {
      this.beforeApiParam.apiType = formInfo.requestType
      this.beforeApiParam.encryptType = formInfo.encryptType
      this.beforeApiParam.isRely = formInfo.isRely.toString()
      this.beforeApiParam.requestUri = formInfo.requestUri
      this.beforeApiParam.header = formInfo.header
    },
    // 编辑/复制的接口信息返显
    getEditFormInfo (formInfo) {
      console.log('forminfo', formInfo)
      // 获取编辑前的接口信息
      this.getBeforeApiParam(formInfo)
      // 获取sql
      this.getSqlList()
      if (formInfo.preSqlId != null && formInfo.preSqlId !== '') {
        this.form.preSqlId = formInfo.preSqlId
        this.getSqlInfoById(this.form.preSqlId, '1')
      }
      if (formInfo.postSqlId != null && formInfo.postSqlId !== '') {
        this.form.postSqlId = formInfo.postSqlId
        this.getSqlInfoById(this.form.postSqlId, '0')
      }
      console.log(this.sqlForm.items)
      this.form.comment = formInfo.comment
      this.form.requestParam = formInfo.requestParam
      this.form.expectedResults = formInfo.expectedResults
      this.form.assertType = formInfo.assertType
      this.form.apiCaseName = formInfo.caseName
      this.form.originalCaseName = formInfo.caseName
      this.form.testEnvUrl = formInfo.testEnvUrl
      this.form.apiType = formInfo.requestType
      this.form.requestUri = formInfo.requestUri
      this.form.encryptType = formInfo.encryptType
      this.form.isRely = formInfo.isRely.toString()
      this.form.requestParam = formInfo.requestParam
      this.form.comment = formInfo.comment
      this.form.header = formInfo.header

      if (
        formInfo.assertType !== null &&
        formInfo.assertType !== '' &&
        formInfo.expectedResults !== null &&
        formInfo.expectedResults !== ''
      ) {
        this.assertListProp = [
          {
            assertContent: formInfo.expectedResults,
            assertType: formInfo.assertType
          }
        ]
      } else {
        this.assertListProp = formInfo.assertList
      }

      this.getRelyList()
      if (formInfo.relyId != null && formInfo.relyId !== '') {
        this.form.relyApiId = formInfo.relyId
        for (var i = 0; i < this.relyList.length; i++) {
          if (this.form.relyApiId === this.relyList[i].id) {
            this.form.relyApiDetail = this.relyList[i].requestUri
            break
          }
        }
      }

      // MQ依赖反显
      if (formInfo.relyMqId != null && formInfo.relyMqId !== '') {
        this.form.relyMqId = formInfo.relyMqId
        this.form.relyMqTopic = this.relyMqList.filter(
          (item) => item.id === this.form.relyMqId
        )[0].topic
      } else {
        this.form.relyMqId = ''
        this.form.relyMqTopic = ''
      }

      // ES依赖反显
      if (formInfo.relyEsId != null && formInfo.relyEsId !== '') {
        this.form.relyEsId = formInfo.relyEsId
        const item = this.relyEsList.filter(
          (item) => item.id === this.form.relyEsId
        )[0]
        this.form.relyEsName =
          item.configName + '【索引名称:' + item.indexName + '】'
      } else {
        this.form.relyEsId = ''
        this.form.relyEsName = ''
      }
    },
    displayRelyUri () {
      for (var i = 0; i < this.relyList.length; i++) {
        if (this.form.relyApiId === this.relyList[i].id) {
          this.form.relyApiDetail = this.relyList[i].requestUri
        }
      }
    },
    displayRelyMqTopic () {
      this.form.relyMqTopic = this.relyMqList.filter(
        (item) => item.id === this.form.relyMqId
      )[0].topic
    },
    // 根据ID查询ES依赖名称
    displayRelyEsName () {
      const item = this.relyEsList.filter(
        (item) => item.id === this.form.relyEsId
      )[0]
      this.form.relyEsName =
        item.configName + '【索引名称:' + item.indexName + '】'
    },
    // sql增加前/后置
    addItem () {
      this.sqlForm.items.push({
        sqlType: '1',
        sqlName: '',
        sqlDetail: ''
      })
      this.sqlList = this.preSqlList
    },
    // 移除sql前/后置
    removeSqlList (item) {
      var index = this.sqlForm.items.indexOf(item)
      if (index !== -1) {
        this.sqlForm.items.splice(index, 1)
        if (item.sqlType === '1') {
          this.form.preSqlId = ''
        } else {
          this.form.postSqlId = ''
        }
      }
    },

    // 删除操作
    deleteCase (row) {
      this.$confirm('您确认删除该用例吗', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteCase({ id: row.id }).then((response) => {
            if (response.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 跳转到新增用例
    handleAddCase (row) {
      this.$router.push({
        name: 'AddCase',
        params: { apiData: row, type: 'ADD' }
      })
    },
    closeApiForm () {
      this.formTitle = ''
      this.apiFormShow = false
      this.form = {}
    }
  }
}
</script>

<style lang="stylus" scoped>
.divClass {
  margin-top: 20px;
  padding: 10px;
  background-color: white;
  border: 1px;
  color: #333;
  text-align: center;
}

/deep/ .el-range-separator {
  margin-right: 8px;
}

.run-btn {
  float: left;
  width: 100%;
  margin-top: 40px;
  margin-bottom: 20px;
}
</style>
