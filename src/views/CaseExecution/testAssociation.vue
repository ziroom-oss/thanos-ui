<template>
  <div>
    <el-dialog
      :append-to-body="isAppend"
      :visible.sync="testAssociationShow"
      :width="dialogWidth"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      style="margin-top: -80px"
    >
      <div>
        <AssociationFind
          :artificialOrApi="artificialOrApi"
          ref="AssociationFind"
          :testCaseForm.sync="testCaseSearchValue"
          @queryTestCaseDataFind="queryTestCaseDataFind"
          @handleSubmit="handleSubmit"
        />
      </div>
      <div style="margin-top: 10px">
        <ArtificialTest
          :artificialOrApi="artificialOrApi"
          ref="ArtificialTest"
        />
      </div>
        <el-row :gutter="24" style="margin-top: 10px">
          <el-col :span="24">
            <el-pagination
              class="pagination"
              background
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pagination.size"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="total, sizes, prev, pager, next, jumper"
              :current-page="pagination.current"
              :total="pagination.total">
            </el-pagination>
          </el-col>
        </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { queryUnRelTestCaseByPage, queryUnRelApiCaseByPage } from '@/api/model/caseExecution.js'
export default {
  name: 'testAssociation',
  props: {
    isAppend: {
      type: Boolean,
      default: false
    },
    dialogWidth: {
      type: String,
      default: '80%'
    },
    apiFormData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data: () => ({
    testAssociationShow: false,
    caseListDataSource: '',
    pagination: {
      total: 0,
      current: 1,
      size: 10
    },
    testCaseSearchValue: {},
    artificialOrApi: ''
  }),
  components: {
    AssociationFind: () => import('./testAssociationFind'),
    ArtificialTest: () => import('./TypeOfTest/ArtificialTest')
  },
  methods: {
    async queryTestCaseDataFind () { // 查询方法
      this.pagination.current = 1
      if (this.artificialOrApi === '1') {
        this.queryCaseRelevancy()
      } else if (this.artificialOrApi === '2') {
        this.queryApiCaseRelevancy()
      }
    },
    queryCaseRelevancy () { // 获取未关联用例集合
      this.$nextTick(async () => {
        const { ehrTreePath } = this.testCaseSearchValue
        const queryData = {
          page: {
            ...this.pagination
          },
          searchObj: {
            ...this.$refs.AssociationFind.testCaseForm,
            ehrTreePath: ehrTreePath ? ehrTreePath.toString() : '',
            taskId: this.$route.query.taskId
          }
        }
        const res = await queryUnRelTestCaseByPage(queryData)
        this.caseListDataSource = res.data.records
        this.pagination.total = res.data.total
        this.$refs.ArtificialTest.tableData = res.data.records
      })
    },
    queryApiCaseRelevancy () { // 获取未关联用例集合
      this.$nextTick(async () => {
        const { ehrTreePath } = this.testCaseSearchValue
        const queryData = {
          page: {
            ...this.pagination
          },
          searchObj: {
            ...this.$refs.AssociationFind.testCaseForm,
            ehrTreePath: ehrTreePath ? ehrTreePath.toString() : '',
            taskId: this.$route.query.taskId,
            runnable: this.isAppend ? 1 : undefined
          }
        }
        const res = await queryUnRelApiCaseByPage(queryData)
        this.caseListDataSource = res.data.records
        this.pagination.total = res.data.total
        this.$refs.ArtificialTest.tableData = this.isAppend ? res.data.records.filter(item => item.id !== this.apiFormData.id) : res.data.records
        this.$refs.ArtificialTest.artificialOrApi = this.artificialOrApi
      })
    },
    handleSubmit () {
      const idList = this.$refs.ArtificialTest.taskTestCaseIdList
      this.$emit('handleSubmit', idList)
      this.$refs.ArtificialTest.taskTestCaseIdList = []
      this.$refs.ArtificialTest.taskTestCaseId = []
    },
    handleSizeChange (val) {
      this.pagination.size = val
      if (this.artificialOrApi === '1') {
        this.queryCaseRelevancy()
      } else if (this.artificialOrApi === '2') {
        this.queryApiCaseRelevancy()
      }
    },
    // 分页start
    handleCurrentChange (val) { // 分页
      this.pagination.current = val
      if (this.artificialOrApi === '1') {
        this.queryCaseRelevancy()
      } else if (this.artificialOrApi === '2') {
        this.queryApiCaseRelevancy()
      }
    }
  }
}
</script>

<style>

</style>
