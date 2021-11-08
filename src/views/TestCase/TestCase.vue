<template>
  <div class="test-case">
    <el-card class="test-case-tree">
      <Tree
        ref="tree"
        :data="moduleList"
        :defaultProps="defaultProps"
        :treePath.sync="treePath"
        @queryModuleList="queryModuleList"
      />

    </el-card>
    <el-card>
      <Search
        ref="testCaseSearch"
        :testCaseForm.sync="testCaseSearchValue"
        :testLevelList.sync="testLevelList"
        @queryTestCaseDataFind="queryTestCaseDataFind"
      />
      <el-card shadow="hover">
        <div>
          <el-button @click="onBatchDelete"> 批量删除</el-button>
          <el-button @click="onAddNewCase" style="margin-right: 10px">
            <i class="el-icon-circle-plus-outline el-icon--right">新建用例</i>
          </el-button>
          <el-button @click="onUploadCase">
            <i class="el-icon-upload el-icon--right"> 点击上传 </i>
          </el-button>
          <el-dropdown>
            <el-button class="el-dropdown-link el-icon--right el-download">
              下载模版<i class="el-icon-arrow-down"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="downloadCaseDemo" type="primary">
                  <i class="el-icon-download el-icon--right">
                    下载Excel用例模版
                  </i>
                </span>
              </el-dropdown-item>
              <!-- <el-dropdown-item>
              <span @click="downloadCaseDemo">
                <i class="el-icon-download el-icon--right"> 下载Xmind用例模版 </i>
              </span>
            </el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
          <el-button @click="downloadSelectedCase">
            <i class="el-icon-download el-icon--right"> 下载选中用例 </i>
          </el-button>
        </div>
        <el-table
          ref="multipleTable"
          :data="testCaseData"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="tableLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="casename" label="用例名称"/>
          <el-table-column prop="testCaseLevelStr" label="用例等级"/>
          <el-table-column prop="relationRequirement" label="jira ID"/>
          <el-table-column prop="testCaseStatusStr" label="用例状态"/>

          <el-table-column prop="belongToSystemStr" label="所属应用"/>
          <el-table-column prop="belongToModuleStr" label="所属模块"/>
          <el-table-column prop="createUserStr" label="创建人"/>
          <el-table-column prop="createTime" label="创建时间"/>

          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="审核"
                placement="top-start"
              >
                <i
                  class="el-icon-check icon"
                  @click="singleCheck(scope.row.id)"
                  v-if="scope.row.testCaseStatus == 'pending'"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                placement="top-start"
              >
                <i
                  class="el-icon-edit icon"
                  @click="onEditNewCase(scope.row.id)"
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
                  @click="onDelNewCase(scope.row.id)"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="详情"
                placement="top-start"
              >
                <i
                  class="el-icon-info icon"
                  @click="onInfoNewCase(scope.row.id)"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          background
          :page-sizes="[10, 20, 50, 100, 200]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="pagination.current"
          :total="pagination.total"
        >
        </el-pagination>
      </el-card>
    </el-card>
    <div>
      <TestCaseBatchDialog
        ref="batchDialog"
        :multipleSelectTestCase.sync="multipleSelectTestCase"
        @queryTestCaseData="queryTestCaseData"
      />
      <TestCaseDetailDialog
        ref="detailDialog"
        :testLevelList.sync="testLevelList"
        @queryTestCaseData="queryTestCaseData"
      />
      <TestCaseUploadDialog
        ref="uploadDialog"
        @queryTestCaseData="queryTestCaseData"
      />
      <TestCaseInfoDialog
        ref="infoDialog"
        @queryTestCaseData="queryTestCaseData"
      />
    </div>
  </div>
</template>
<script>
  import {
    batchDeleteTestCase,
    getTestCaseDetailById,
    queryTestCaseData,
    queryTestCaseHistoryByCaseId,
    queryTestLevelTypeList
  } from '@/api/model/testCase'
  import axios from 'axios'
  import {mapGetters} from 'vuex'
  import {moduleTreeMixin} from './mixin/mixin'

  export default {
    name: 'TestCase',
    mixins: [moduleTreeMixin],
    components: {
      Tree: () => import('@/components/Tree/index'),
      Search: () => import('./TestCaseSearch'),
      TestCaseBatchDialog: () => import('./TestCaseBatchDialog'),
      TestCaseDetailDialog: () => import('./TestCaseDetailDialog'),
      TestCaseUploadDialog: () => import('./TestUploadDialog'),
      TestCaseInfoDialog: () => import('./TestCaseInfoDialog')
    },
    computed: {
      ...mapGetters(['userInfo', 'checkedModuleData']),
      defaultProps() {
        return {
          children: 'children',
          label: 'label'
        }
      }
    },
    async mounted() {
      const data = {
        ...this.testCaseSearchValue
      }
      await this.queryTestCaseData(data)
      await this.queryTestLevelTypeList()
    },
    data() {
      return {
        testCaseSearchValue: {},
        multipleSelectTestCase: [],
        testCaseData: [],
        pagination: {
          total: 0,
          current: 1,
          size: 100
        },
        type: 'add',
        testLevelList: [],
        treePath: '',
        //
        detailDialogValue: {
          relationRequirement: '',
          createUser: '',
          belongToSystem: 0,
          belongToModule: [],
          belongPlatform: '',
          type: ''
        },
        tableLoading: false
      }
    },
    watch: {
      checkedModuleData(applicationModuleTree) {
        if (applicationModuleTree.app) {
          const applicationId = applicationModuleTree.id
          // 应用层级
          const testCaseSearch = {
            ...this.testCaseSearchValue,
            applicationId: applicationId,
            belongToSystem: applicationId,
            belongToModule: ''
          }
          this.testCaseSearchValue = testCaseSearch
        } else {
          const moduleTreePath = applicationModuleTree.moduleTreePath.split(',')
          const testCaseSearch = {
            ...this.testCaseSearchValue,
            belongToSystem: applicationModuleTree.applicationId,
            belongToModule: applicationModuleTree.id,
            belongToModuleList: moduleTreePath.map((item) => +item)
          }
          this.testCaseSearchValue = testCaseSearch
        }
        this.$refs.testCaseSearch.testCaseForm = this.testCaseSearchValue
        const littleStars = this.$refs.tree.littleStars
        if (littleStars) {
          this.queryTestCaseData()
        }
        this.$refs.tree.littleStars = true
      },
      treePath(val) {
        this.testCaseSearchValue.belongToModule = ''
        this.testCaseSearchValue.belongToSystem = ''
        this.testCaseSearchValue.ehrTreePath = val.toString()
        this.queryTestCaseData()
      }
    },
    methods: {
      async queryTestCaseData() {
        // 测试用例列表数据源
        const {ehrTreePath, createTimeVal, updateTimeVal} =
          this.testCaseSearchValue
        const queryData = {
          page: {
            ...this.pagination
          },
          searchObj: {
            ...this.testCaseSearchValue,
            ehrTreePath: ehrTreePath ? ehrTreePath.toString() : '',
            createTimeVal: createTimeVal ? createTimeVal.toString() : '',
            updateTimeVal: updateTimeVal ? updateTimeVal.toString() : ''
          }
        } // 根据接口要求处理请求参数
        this.tableLoading = true
        const res = await queryTestCaseData(queryData)
          .finally(() => {
            this.tableLoading = false
          })
        const respData = res.data
        this.testCaseData = respData.records || []
        this.pagination.total = respData.total
      },
      async queryTestCaseDataFind() {
        this.pagination.current = 1
        await this.queryTestCaseData()
      },
      downloadCaseDemo() {
        this._downLaod(
          '',
          '/testCase/exportTestCaseExcelTemplate?idList=',
          '测试用例模版.xlsx'
        )
      },
      handleSelectionChange(val) {
        this.multipleSelectTestCase = val
      },
      onBatchCheck() {
        // 批量审批 选中用例为空，则提示
        this.multipleSelectTestCase.length === 0
          ? this.$notify({
            type: 'error',
            title: 'Error',
            message: '先选择需要审批的测试用例吧～'
          })
          : (this.$refs.batchDialog.dialogVisible = true)
      },
      onBatchDelete() {
        // 批量审批 选中用例为空，则提示
        this.multipleSelectTestCase.length === 0
          ? this.$notify({
            type: 'error',
            title: 'Error',
            message: '先选择需要删除的测试用例吧～'
          })
          : this.$confirm('确定删除？', '提示', {
            // delete
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async () => {
              let ids = ''
              this.multipleSelectTestCase.forEach(function (item, index) {
                ids += item.id + ','
              })
              const params = {idList: ids}
              // await batchDeleteTestCase(params)
              batchDeleteTestCase(params).then((res) => {
                if (res.success) {
                  this.$notify({
                    type: 'success',
                    message: '删除' + res.message
                  })
                }
                this.queryTestCaseData(this.testCaseSearchValue)
              })
            })
            .catch(() => {
              this.$notify({
                type: 'info',
                message: '已取消删除'
              })
            })
      },
      // 跳转单个审批
      singleCheck(id) {
        // 批量审批 选中用例为空，则提示
        this.multipleSelectTestCase = [id]
        this.$refs.batchDialog.dialogVisible = true
      },
      handleCurrentChange(val) {
        // 分页
        this.pagination.current = val
        this.queryTestCaseData(this.testCaseSearchValue)
      },
      handleSizeChange(val) {
        this.pagination.size = val
        this.queryTestCaseData(this.testCaseSearchValue)
      },
      checkboxT(row, rowIndex) {
        // 判断只有是待审核的才可以选中
        if (row.testCaseStatus === 'pending') {
          return true // 不禁用
        } else {
          return false // 禁用
        }
      },
      onAddNewCase() {
        // 应用 没有applicationId id为applicationId 模块 有applicationId id
        let {id, applicationId, moduleTreePath} = this.checkedModuleData
        const detailDialog = this.$refs.detailDialog
        detailDialog.detailDialogValue = Object.assign(
          {},
          detailDialog.detailDialogValue
        )
        if (!applicationId) {
          detailDialog.detailDialogValue.belongToSystem = id
        } else {
          moduleTreePath = moduleTreePath.split(',')
          detailDialog.detailDialogValue.belongToSystem = applicationId
          detailDialog.detailDialogValue.moduleTreePath = moduleTreePath.map(
            (item) => +item
          ) // 将moduletreepath =》数值
        }
        // 新建
        detailDialog.caseType = 'add'
        detailDialog.testCaseDetailDialog = true
      },
      async onEditNewCase(id) {
        // 编辑
        const refInstance = this.$refs.detailDialog
        refInstance.detailDialogValue = Object.assign(
          {},
          refInstance.detailDialogValue
        )
        const params = {id}
        const res = await getTestCaseDetailById(params)
        const relospData = res.data
        relospData.belongToSystem = +relospData.belongToSystem
        refInstance.caseType = 'edit'
        refInstance.detailDialogValue = relospData
        let {moduleTreePath} = relospData
        if (moduleTreePath) {
          moduleTreePath = moduleTreePath.split(',')
          refInstance.detailDialogValue.moduleTreePath = moduleTreePath.map(
            (item) => +item
          )
        }
        refInstance.testCaseDetailDialog = true
      },

      // 详情页
      async onInfoNewCase(id) {
        const params = {id: id}
        const res = await getTestCaseDetailById(params)
        const relospData = res.data
        this.$refs.infoDialog.detailDialogValue = relospData
        // 历史版本回溯
        const caseKey = relospData.caseKey
        if (caseKey) {
          const keys = {caseKey: caseKey}
          const res = await queryTestCaseHistoryByCaseId(keys)
          this.$refs.infoDialog.testCaseHisData = res.data
        }
        this.$refs.infoDialog.testCaseInfoDialog = true
      },
      onDelNewCase(id) {
        // delete
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            const params = {idList: id}
            const res = await batchDeleteTestCase(params)
            const response = res.data
            if (response === '成功') {
              this.$notify({
                type: 'success',
                message: response
              })
            }
            await this.queryTestCaseData(this.testCaseSearchValue)
          })
          .catch(() => {
            this.$notify({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      onUploadCase() {
        // 上传
        const uploadDialog = this.$refs.uploadDialog
        uploadDialog.testCaseUploadDialog = true
        const {id, applicationId, moduleTreePath} = this.checkedModuleData
        if (!applicationId) {
          uploadDialog.testCaseUploadForm.belongToSystem = id
        } else {
          uploadDialog.queryModuleInAppList(applicationId)
          const modulePath = moduleTreePath.split(',')
          uploadDialog.testCaseUploadForm.belongToSystem = applicationId
          uploadDialog.belongToModule = modulePath.map((item) => +item) // 将moduletreepath =》数值
        }
      },
      downloadSelectedCase() {
        // 批量 选中用例为空，则提示
        if (this.multipleSelectTestCase.length === 0) {
          this.$notify({
            type: 'error',
            title: 'Error',
            message: '先选择需要审批的测试用例吧～'
          })
          return
        }
        let ids = ''
        this.multipleSelectTestCase.forEach(function (item, index) {
          ids += item.id + ','
        })
        this._downLaod(
          ids,
          '/testCase/exportTestCaseExcelTemplate?idList=',
          '选中测试用例列表.xlsx'
        )
      },
      _downLaod(val, url, fileName) {
        axios
          .post(
            `${process.env.VUE_APP_BASE_API}${url}` + (val ?? ''),
            {},
            {
              headers: {
                userName: this.userInfo.userName,
                uid: this.userInfo.uid,
                nickName: encodeURIComponent(this.userInfo.nickName),
                userType: this.userInfo.userType
              },
              responseType: 'blob'
            }
          )
          .then((res) => {
            const blob = new Blob([res.data])
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            // 释放URL对象
            URL.revokeObjectURL(link.href)
            document.body.removeChild(link)
          })
          .catch((err) => {
            console.log(err)
          })
      },
      // 测试级别
      async queryTestLevelTypeList() {
        const res = await queryTestLevelTypeList()
        this.testLevelList = res.data
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

  .el-icon-check {
    background: #67c23a;
  }

  .el-icon-info {
    background: #909399;
  }

  .el-icon-edit {
    background: #1b58f8;
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
  .test-case {
    display: grid;
    grid-template-columns: 310px 1fr;
    grid-gap: 15px;

    .test-case-tree {
      //height: 1000px;
      //overflow-y: auto;
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
