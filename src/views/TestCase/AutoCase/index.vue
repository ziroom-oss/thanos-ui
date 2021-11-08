<template>
  <div class="test-case">
    <el-card class="test-case-tree">
      <Tree
        ref="tree"
        :treeData="omegaList"
        :defaultProps="defaultProps"
        :treePath.sync="treePath"
        :defaultTreeArr.sync="defaultTreeArr"
        @getOmegaList="getOmegaList"
        @queryModuleList="queryModuleList"
        @saveTreeApiData="saveTreeApiData"
        @updateTagsList="(data) => (tagsList = data)"
      />
    </el-card>
    <el-card>
      <Search
        ref="testCaseSearch"
        :apiCaseForm.sync="apiCaseForm"
        :omegaList="omegaList"
        :tagsList="tagsList"
        :userList="userList"
        @getTagsList="getTagsList"
        @findSingleApiListTableDataV3="findSingleApiListTableDataV3"
      />
      <el-card shadow="hover">
        <div>
          <el-button @click="onBatchDelete"> 批量删除 </el-button>
          <el-button @click="onShowRun"> 批量运行 </el-button>
          <el-button @click="onToReport"> 运行报告 </el-button>
          <el-button @click="goToPostmanPage"
            ><i class="el-icon-upload el-icon--right">Postman导入</i></el-button
          >
          <el-tooltip
            effect="dark"
            content="请选择左侧接口"
            placement="top-start"
          >
            <el-button @click="onAddNewCase" style="margin-right: 10px">
              <i class="el-icon-circle-plus-outline el-icon--right">新建用例</i>
            </el-button>
          </el-tooltip>
        </div>

        <el-table
          ref="multipleTable"
          :data="apiCaseData"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="tableLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="id" label="用例id" width="60" />
          <el-table-column label="应用名称" prop="applicationName">
            <template slot-scope="scope">
              {{ scope.row.applicationName || "暂无名称" }}
            </template>
          </el-table-column>
          <el-table-column label="用例名称" prop="caseName">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.caseName"
                placement="top"
              >
                <span>{{ scope.row.caseName || "暂无名称" }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="请求方式" prop="requestType" />
          <el-table-column label="请求URL" prop="requestUri">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.requestUri"
                placement="top"
              >
                <span>{{ scope.row.requestUri || "暂无URL" }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="参数详情">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.requestParam || '暂无参数'"
                placement="top"
              >
                <span :class="{ 'link-type': scope.row.requestParam }">{{
                  scope.row.requestParam || "暂无参数"
                }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" prop="updateTime" align="center" />
          <el-table-column label="最终维护人" prop="updateUserName">
            <template slot-scope="scope">
              {{ scope.row.updateUserName || "暂无最终维护人" }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                placement="top-start"
              >
                <i
                  class="el-icon-edit icon"
                  @click="handleEditCase(scope.row)"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="复制"
                placement="top-start"
              >
                <i
                  class="el-icon-document-copy icon"
                  @click="handleCopyCase(scope.row)"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="运行"
                placement="top-start"
              >
                <i
                  class="el-icon-video-play icon"
                  @click="onShowRun(scope.row)"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="历史报告"
                placement="top-start"
              >
                <i
                  class="el-icon-printer icon"
                  @click="handleHistoryCase(scope.row)"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top-start"
              >
                <i
                  class="el-icon-delete icon"
                  @click="handleDelectCase(scope.row.id)"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="pagination.pageNum"
          :total="pagination.total"
        >
        </el-pagination>
      </el-card>
    </el-card>
    <div>
      <RunDialog
        :dialogVisible="runDialogVisible"
        @close="closeRunDialog"
        @runCase="runCase"
      />
      <ApiFormCaseDiaLog
        :dialogVisible="formDialogVisible"
        :apiFormData="apiFormData"
        :type="type"
        @updateData="findSingleApiListTableDataV3"
        @close="closeCaseDialog"
      />
      <ReportDialog
        :title="reportTitle"
        :dialogVisible="reportDialogVisible"
        :reportList="reportList"
        @closeReportDialog="closeReportDialog"
      />
      <SwaggerUploadDialog
        :applicationDetails="applicationDetails"
        :dialogVisible="swaggerDialogVisible"
        :omegaList="omegaList"
        @close="swaggerDialogVisible = false"
        @getList="getList"
      />
      <DiaLogApiForm
        :title="apiFormTitle"
        :level="level"
        :apiFormData="apiForm"
        :apiFormShow="apiFormShow"
        @closeApiForm="closeApiForm"
        @getList="getList"
      />
      <DatabaseDiaLog
        :applicationDetails="applicationDetails"
        :level="level"
        :databaseShow="databaseShow"
        @closeDatabase="closeDatabase"
      />
    </div>
  </div>
</template>
<script>
import eventBus from '@/utils/eventBus'
import {
  runCase,
  deleteCase,
  findSingleApiListTableDataV3,
  myJoinApplication,
  getApiTags
} from '@/api/model/singleApiList'
import { mapActions } from 'vuex'
// import { getEhrPerson } from '@/api/model/caseExecution'

export default {
  name: 'ApiCase',
  components: {
    Tree: () => import('./components/Tree/index'),
    Search: () => import('./ApiCaseSearch'),
    RunDialog: () => import('./RunDialog'),
    ApiFormCaseDiaLog: () => import('./ApiFormCase'),
    SwaggerUploadDialog: () => import('./SwaggerUploadDialog'),
    DiaLogApiForm: () => import('./DialogApiForm'),
    ReportDialog: () => import('./ReportDialog'),
    DatabaseDiaLog: () => import('./DatabaseDiaLog/index')
  },
  computed: {
    defaultProps () {
      return {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      }
    }
  },
  data () {
    return {
      apiCaseForm: {
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
        controllerName: '',
        updateUserCode: '',
        runnable: '' // 是否可运行
      },
      multipleSelectApiCase: [], // 多选列表
      apiCaseData: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      treePath: 1, // 树默认选中
      defaultTreeArr: [], // 树默认选中
      omegaList: [], // 应用列表
      tagsList: [], // 接口标签列表
      envList: [], // 环境列表
      tableLoading: false, // 表格Loading
      runDialogVisible: false, // 运行弹框
      treeApiData: {}, // 右侧树选中api数据
      formDialogVisible: false, // 编辑弹框
      apiFormData: {}, // 当前选中用例数据
      type: 'ADD', // 用例弹框类型
      swaggerDialogVisible: false, // swager上传弹框
      apiFormTitle: '', // 接口对话框标题
      databaseDataTitle: '', // 对话框标题
      apiFormShow: false, // 接口对话弹框
      databaseShow: false,
      applicationDetails: {},
      apiForm: {},
      reportDialogVisible: false, // 历史报告对话框
      reportList: [], // 历史报告数组
      reportTitle: '', // 报告标题
      level: 0,
      userList: [] // 用户下拉数组
    }
  },
  created () {
    this.findSingleApiListTableDataV3()
    this.getOmegaList()
    // this.getUserList()
  },
  mounted () {
    this.handleEditApi()
  },
  methods: {
    ...mapActions([
      'setSelectTab'
    ]),
    goToPostmanPage () {
      this.$router.push({
        path: '/testCase/postmanCaseImport'
      })
    },
    getList () {
      this.getOmegaList()
      this.findSingleApiListTableDataV3()
    },
    // 接口编辑
    handleEditApi () {
      eventBus.$on('handleEditApi', ({ node, title, level }) => {
        this.apiFormTitle = title
        this.apiForm = node
        this.level = level
        this.apiFormShow = true
      })
      eventBus.$on('handleEditDatabase', (data) => {
        this.applicationDetails = data
        this.databaseShow = true
      })
      eventBus.$on('onSwaggerUploadCase', (isShow, data) => {
        this.applicationDetails = data
        this.swaggerDialogVisible = isShow
      })
    },
    // async getUserList () {
    //   const res = await getEhrPerson()
    //   if (res.success) {
    //     this.userList = res.data
    //   }
    // },
    // 根据接口要求处理请求参数
    async findSingleApiListTableDataV3 (pramas) {
      this.tableLoading = true

      const res = await findSingleApiListTableDataV3(
        { ...this.pagination, ...pramas },
        this.apiCaseForm
      ).finally(() => {
        this.tableLoading = false
      })
      const respData = res.data
      this.apiCaseData = respData.records || []
      this.pagination = {
        total: respData.total,
        pageNum: respData.current,
        pageSize: respData.size
      }
    },
    // 编辑
    handleEditCase (row) {
      this.setApiFormDialog(row, 'EDIT', true)
    },
    // 复制
    handleCopyCase (row) {
      this.setApiFormDialog(row, 'COPY', true)
    },
    // 新增
    onAddNewCase () {
      if (this.treePath !== 3) {
        return this.$message.warning('请先选中左侧接口！')
      }
      this.setApiFormDialog(this.treeApiData, 'ADD', true)
    },
    // 设置用例对话框
    setApiFormDialog (data, type, show = false) {
      this.apiFormData = { ...data }
      this.setSelectTab('')
      this.type = type
      this.formDialogVisible = show
    },
    // 删除测试用例
    handleDelectCase (ids) {
      this.$confirm('此操作将永久删除该用例, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteCase([ids])
        if (res.success) {
          (!res.data || res.data.length === 0) ? this.$message.success('删除成功') : this.$message.warning('删除失败')
        }
        this.findSingleApiListTableDataV3()
      })
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelectApiCase = val
    },
    // 批量删除
    async onBatchDelete () {
      await this.checkIsSelect('删除')
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const ids = this.multipleSelectApiCase
            .map((item) => item.id)
          deleteCase([...ids]).then((res) => {
            if (res.success) {
              if (!res.data || res.data.length === 0) {
                this.$notify({
                  type: 'success',
                  message: '删除成功'
                })
              } else {
                this.$notify({
                  type: 'warning',
                  message: `用例id为${res.data.join('、')}的用例删除失败`
                })
              }
            }
            this.findSingleApiListTableDataV3()
          })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 改变页码
    handleCurrentChange (val) {
      this.pagination.pageNum = val
      this.findSingleApiListTableDataV3()
      this.toScrollTop()
    },
    // 改变页数
    handleSizeChange (val) {
      this.pagination.pageSize = val
      this.findSingleApiListTableDataV3()
      this.toScrollTop()
    },
    // 获取所属应用
    async getOmegaList () {
      const res = await myJoinApplication()
      this.omegaList = res.data
    },
    // 根据应用获取接口列表
    async getTagsList (applicationName) {
      const res = await getApiTags({ applicationName })
      if (res.success) {
        const tagsList = []
        for (const key of Object.keys(res.data)) {
          tagsList.push(key)
        }
        this.tagsList = tagsList
      }
    },
    // 根据右侧查询
    queryModuleList (data) {
      this.apiCaseForm = { ...this.apiCaseForm, ...data }
      this.findSingleApiListTableDataV3()
    },
    // 批量报告
    async onToReport () {
      await this.checkIsSelect('查看报告')
      this.reportTitle = '运行报告'
      this.reportList = this.multipleSelectApiCase
      this.reportDialogVisible = true
    },
    handleHistoryCase (row) {
      this.reportTitle = '历史报告'
      this.reportList = [row]
      this.reportDialogVisible = true
    },
    // 运行弹框
    async onShowRun (row) {
      // 判断是单选还是多选
      if (!row.id) {
        await this.checkIsSelect('运行')
      } else {
        this.multipleSelectApiCase = [row]
      }
      this.runDialogVisible = true
    },
    // 运行用例
    async runCase (env) {
      const loading = this.setLoading()
      const caseIdList = this.multipleSelectApiCase
        .map((item) => item.id)

      const res = await runCase({ caseIdList, env }).finally(() => {
        loading.close()
      })

      const resCount = {
        success: 0,
        fail: 0
      }

      // 统计成功失败
      for (const item of res?.data) {
        if (item?.recordResult === 'SUCCESS') {
          resCount.success++
        } else {
          resCount.fail++
        }
      }

      // 运行结果
      // const { href } = this.$router.resolve({
      //   path: '/interfaces/singleApi/single-api-case-latest-report',
      //   query: {
      //     caseIds
      //   }
      // })

      this.$notify({
        title: '运行结果',
        dangerouslyUseHTMLString: true,
        message: `
          <div>
            <span style="color:#67C23A">成功${resCount.success}条</span>
          </div>
          <div>
            <span style="color:#F56C6C">失败${resCount.fail}条</span>
          </div>
          <div>
            <span style="cursor:pointer;">查看运行报告</span>
          </div>
        `,
        onClick: () => {
          this.onToReport()
        }
      })
    },
    // 校验是否选中
    checkIsSelect (type) {
      if (this.multipleSelectApiCase.length < 1) {
        this.$notify({
          type: 'error',
          title: 'Error',
          message: `先选择需要${type}的用例吧～`
        })
        return Promise.reject(new Error('is Empty'))
      }
      return Promise.resolve()
    },
    // 关闭运行对话框
    closeRunDialog () {
      this.runDialogVisible = false
    },
    // 关闭历史报告对话框
    closeReportDialog () {
      this.reportList = []
      this.reportDialogVisible = false
    },
    // 关闭用例对话框
    closeCaseDialog () {
      this.setApiFormDialog({}, 'ADD', false)
    },
    // 保存右侧传来的接口数据
    saveTreeApiData (data) {
      this.treeApiData = data
    },
    // 跳转到顶部
    toScrollTop () {
      this.$nextTick(() => {
        document.body.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      })
    },
    setLoading () {
      const loading = this.$loading({
        lock: true,
        text: '运行中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      return loading
    },
    closeApiForm () {
      this.apiFormShow = false
      this.apiForm = {}
      this.apiFormTitle = ''
    },
    closeDatabase () {
      this.databaseShow = false
      this.databaseDetails = {}
    }
  }
}
</script>
<style scoped lang="scss">
.icon {
  margin-right: 10px;
  font-weight: bold;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  color: #fff;
}

.el-icon-video-play {
  background: #67c23a;
}
.el-icon-printer {
  background: #909399;
}
.el-icon-edit {
  background: #1b58f8;
}
.el-icon-document-copy {
  background: #e6a23c;
}
.el-icon-delete {
  background: #f76c6c;
}
.pagination {
  margin: 20px 10px 30px 0px;
  float: right;
}
</style>
<style lang="scss">
@import "~@/styles/mixin.scss";

.test-case {
  display: grid;
  grid-template-columns: 310px 1fr;
  grid-gap: 15px;
  .el-table .cell,
  .link-type {
    @include article-container(3);
  }

  .is-leaf ~ div > .node-label {
    @include new-line;
  }

  .el-select,
  .el-input__inner {
    width: 100%;
  }
  .el-cascader,
  .el-input__inner {
    width: 100%;
  }
  .el-download {
    margin: 0 10px;
  }
}
</style>
