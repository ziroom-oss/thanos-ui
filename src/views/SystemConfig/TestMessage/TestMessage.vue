<template>
  <div>
    <el-card shadow="hover">
      <el-button @click="addTestMessage()"> 新建消息 </el-button>
      <el-button @click="onBatchDelete()"> 批量删除 </el-button>
      <el-table
        ref="multipleTable"
        :data="testMessageList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="消息ID" prop="id" />
        <el-table-column label="消息标题" prop="msgTitle"  />
        <el-table-column label="创建人" prop="createUser"/>
        <el-table-column label="创建时间" prop="createTime"  />
        <el-table-column label="更新人" prop="updateUser" />
        <el-table-column label="更新时间" prop="updateTime"  />
        <el-table-column label="操作" prop="id">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <li class="el-icon-edit icon" @click="editTestMessage(scope.row.id)" ></li>
            </el-tooltip>
           <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <li class="el-icon-delete icon" @click="delTestMessage(scope.row.id)" ></li>
            </el-tooltip>
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
        <TestMessageDetailDialog
          ref="detailDialog"
          @querytestMessageList="querytestMessageList"
        />
      </div>
    </el-card>
    </div>
</template>
<script>
import { deleteNewMessage, findMessageById, queryTestMessageByPage } from '@/api/model/testMessage.js'

export default {
  name: 'TestMessage',
  components: {
    TestMessageDetailDialog: () => import('./TestMessageDetailDialog')
  },
  async mounted () {
    await this.querytestMessageList()
  },
  data: () => ({
    testMessageSearchValue: {},
    multipleSelectTestMessage: [],
    testMessageList: [],
    pagination: {
      total: 0,
      current: 1,
      size: 10
    },
    type: 'add'
  }),
  methods: {
    async querytestMessageList () {
      const queryData = {
        page: {
          ...this.pagination
        },
        searchObj: {
          ...this.testMessageSearchValue
        }
      } // 根据接口要求处理请求参数
      const res = await queryTestMessageByPage(queryData)
      const respData = res.data || []
      this.testMessageList = respData.records
      this.pagination.total = respData.total
    },
    handleSelectionChange (val) {
      this.multipleSelectTestMessage = val
    },
    handleCurrentChange (val) {
      // 分页
      this.pagination.current = val
      this.querytestMessageList(this.testMessageSearchValue)
    },
    handleRowClick (val) {
    },
    addTestMessage () {
      // 新建
      this.$refs.detailDialog.detailDialogValue = {}
      this.$refs.detailDialog.caseType = 'add'
      this.$refs.detailDialog.TestMessageDetailDialog = true
    },
    async editTestMessage (id) {
      // 编辑
      this.$refs.detailDialog.detailDialogValue = {}
      const params = { msgId: id }
      const res = await findMessageById(params)
      this.$refs.detailDialog.detailDialogValue = res.data
      this.$refs.detailDialog.caseType = 'edit'
      this.$refs.detailDialog.TestMessageDetailDialog = true
    },
    delTestMessage (id) {
      // delete
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = { msgIdList: id }
        const res = await deleteNewMessage(params)
        const response = res.message

        this.$notify({
          type: 'success',
          message: '删除' + response
        })
        this.querytestMessageList()
      })
    },
    onBatchDelete () {
      // 批量审批 选中用例为空，则提示
      this.multipleSelectTestMessage.length === 0
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
          this.multipleSelectTestMessage.forEach(function (item, index) {
            ids += item.id + ','
          })
          const params = { msgIdList: ids }
          const res = await deleteNewMessage(params)
          const response = res.message

          this.$notify({
            type: 'success',
            message: response
          })
          this.querytestMessageList()
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
.el-icon-info{
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
