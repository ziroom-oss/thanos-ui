<template>
  <div>
    <el-card shadow="hover">
      <div class="project-search margin-bottom20">
        <el-input v-model="testTopicSearchValue.topicName" placeholder="项目名称" clearable/>
        <el-button icon="el-icon-search" class="icon-search" circle @click="handleSearchProject"></el-button>
      </div>
      <el-button @click="addProjectConfig()"> 新建 </el-button>
      <el-button @click="onBatchDelete()"> 批量删除 </el-button>
      <el-table
        ref="multipleTable"
        :data="projectList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="项目名称" prop="topicName"/>
        <el-table-column label="关联需求" prop="relationRequirement"/>
        <el-table-column label="项目负责人" prop="topicMasterStr"/>
        <el-table-column label="项目参与人" prop="topicParticipantStr"/>
        <el-table-column label="操作" prop="id">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <li class="el-icon-edit icon" @click="editTestTopic(scope.row.id)" ></li>
            </el-tooltip>
           <!-- <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <li class="el-icon-delete icon" @click="delTestTopic(scope.row.id)" ></li>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :current-page="pagination.current"
        :total="pagination.total"
      >
      </el-pagination>
      <div>
        <ProjectConfigDetail
          ref="projectDetail"
          @queryProjectList="queryProjectList"
        />
      </div>
    </el-card>
    </div>
</template>
<script>
import { batchDeleteByIdList, findInfoById, queryListByPage, getAllCaseExecution } from '@/api/model/projectConfig.js'

export default {
  name: 'Project',
  components: {
    ProjectConfigDetail: () => import('./ProjectConfigDetail')
  },
  async mounted () {
    await this.queryProjectList()
  },
  data: () => ({
    testTopicSearchValue: {
      topicName: ''
    },
    multipleSelectTestTopic: [],
    projectList: [],
    pagination: {
      total: 0,
      current: 1,
      size: 10
    },
    type: 'add'
  }),
  methods: {
    async queryProjectList () { // 项目列表
      const queryData = {
        page: {
          ...this.pagination
        },
        searchObj: {
          ...this.testTopicSearchValue
        }
      } // 根据接口要求处理请求参数
      const res = await queryListByPage(queryData)
      const respData = res.data || []
      this.projectList = respData.records
      this.pagination.total = respData.total
    },
    async handleSearchProject () {
      await this.queryProjectList()
    },
    handleSelectionChange (val) {
      this.multipleSelectTestTopic = val
    },
    handleCurrentChange (val) {
      // 分页
      this.pagination.current = val
      this.queryProjectList()
    },
    handleRowClick (val) {
    },
    addProjectConfig () {
      // 新建
      this.$refs.projectDetail.detailDialogValue = {}
      this.$refs.projectDetail.caseType = 'add'
      this.getAllCaseExecution()
      this.$refs.projectDetail.projectConfigVisible = true
    },
    async editTestTopic (id) {
      // 编辑
      this.$refs.projectDetail.detailDialogValue = {}
      const params = { id: id }
      const res = await findInfoById(params)
      const respData = res.data
      this.$refs.projectDetail.detailDialogValue = respData
      this.$refs.projectDetail.detailDialogValue.checkedStaff = respData.topicMaster
      this.$refs.projectDetail.detailDialogValue.topicParticipant = respData.topicParticipant && respData.topicParticipant.split(',')
      this.$refs.projectDetail.caseType = 'edit'
      this.getAllCaseExecution(id)
      this.$refs.projectDetail.projectConfigVisible = true
    },
    async getAllCaseExecution (id) { // 获取所有测试执行
      const params = {
        topicId: id
      }
      const res = await getAllCaseExecution(params)
      const respData = res.data || []
      this.caseExecutionList = respData
      this.$refs.projectDetail.caseOptions = this.caseExecutionList || []
    },
    delTestTopic (id) {
      // delete
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = { idList: id }
        const res = await batchDeleteByIdList(params)
        const response = res.message

        this.$notify({
          type: 'success',
          message: response
        })
        this.queryProjectList()
      })
    },
    onBatchDelete () {
      // 批量审批 选中用例为空，则提示
      this.multipleSelectTestTopic.length === 0
        ? this.$notify({
          type: 'error',
          title: 'Error',
          message: '先选择需要删除的消息吧～'
        })
        : this.$confirm('确定删除？', '提示', { // delete
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let ids = ''
          this.multipleSelectTestTopic.forEach(function (item, index) {
            ids += item.id + ','
          })
          const params = { idList: ids }
          const res = await batchDeleteByIdList(params)
          const response = res.message
          if (res.success) {
            this.$notify({
              type: 'success',
              message: response
            })
          }
          await this.queryProjectList()
        })
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

.el-icon-check{
  background: #67c23a;
}
.margin-bottom20{
  margin-bottom: 20px;
}
.project-search{
  .el-input{
    width: 200px
  }
  .icon-search{
    background: #1b58f8;
    color: #fff;
    margin-left: 10px;
  }
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
