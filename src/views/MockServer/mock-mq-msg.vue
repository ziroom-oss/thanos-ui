<template>
  <div class="app-container">
    <div style="height: 150px">
      <div class="search-wrap">
        <el-row :gutter="32">
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="search-section">
              <span class="search-label">消息名：</span>
              <el-input class="search-item"
                        placeholder="请输入mq消息名称(支持模糊搜索)"
                        v-model="searchObj.name"
                        clearable @keyup.enter.native="getListByPage">
              </el-input>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="search-section">
              <span class="search-label">消息主题：</span>
              <el-input class="search-item"
                        placeholder="请输入mq消息主题(支持模糊搜索)"
                        v-model="searchObj.topic"
                        clearable @keyup.enter.native="getListByPage">
              </el-input>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="search-section">
              <span class="search-label">创建人：</span>
              <el-select class="search-item" v-model="searchObj.createUserCode" filterable placeholder="可选择或输入搜索"
                         value="">
                <el-option
                        v-for="item in userList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="search-btn">
        <el-button type="primary" @click="getListByPage">查询</el-button>
        <el-button class="bot-btn" @click="resetSearchEv">重置</el-button>
      </div>
    </div>

    <el-row style="margin-bottom: 20px">
      <el-button type="primary" size="small" @click="createMsg">新增MQ消息</el-button>
      <el-button type="default" size="small" @click="visitMqConfigPage">MQ配置管理</el-button>
    </el-row>

    <el-table
            :data="msgList"
            stripe
            fit
            highlight-current-row
            height="550"
            v-loading="loading"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="消息信息">
              <span>{{ scope.row.message }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="消息ID" prop="id" width="80"/>
      <el-table-column align="center" label="消息名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="消息主题">
        <template slot-scope="scope">
          <span>{{scope.row.topic}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后修改人" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.updateUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后修改时间" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="small" icon="el-icon-message"
                     @click="sendMqMsg(scope.row.id)">发送
          </el-button>

          <el-dropdown size="small" split-button
                       @click="editMqMsg(scope.row.id)"
                       type="primary"
                       @command="handleMoreCommand">编辑
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-delete" :command="commandWrapper(scope.row.id, 1)">删除</el-dropdown-item>
              <el-dropdown-item icon="el-icon-document" :command="commandWrapper(scope.row.id, 2)">复制</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                @pagination="getListByPage">
    </pagination>
    <mqMsgForm ref="msgRef" :dialog-visible-prop="dialogVisibleVal" :msg-form-prop="msgFormVal"
               :dialog-title-prop="dialogTitleVal"
               @saveMqMsgAndRefresh="getListByPage" @closeEv="closeDialog"></mqMsgForm>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import {
  getMockMsgList,
  deleteMockMqMsg,
  getMockMqMsqCreators,
  getMockMqMsgInfo,
  sendMockMqMsg
} from '@/api/model/mockMqMsg'
import mqMsgForm from './component/mq-msg-form'

export default {
  name: 'mock-mq-msg',
  components: { Pagination, mqMsgForm },
  data () {
    return {
      searchObj: {
        name: '',
        topic: '',
        createUserCode: ''
      },
      userList: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      msgList: [],
      loading: false,
      dialogVisibleVal: false,
      msgFormVal: {
        configId: '',
        name: '',
        topic: ''
      },
      dialogTitleVal: ''
    }
  },
  created () {
    this.getListByPage()
    this.getOwnerList()
  },
  methods: {
    getListByPage () {
      this.loading = true
      getMockMsgList({ pageNum: this.pageNum, pageSize: this.pageSize }, this.searchObj).then(response => {
        this.msgList = response.data.records
        this.total = response.data.total
        this.loading = false
      })
    },
    resetSearchEv () {
      this.searchObj = {
        name: '',
        topic: '',
        createUserCode: ''
      }
      this.getListByPage()
    },
    getOwnerList () {
      getMockMqMsqCreators().then(response => {
        if (response.success) {
          this.userList = response.data
        } else {
          this.$message({
            message: '查询用户信息失败！',
            type: 'error'
          })
        }
      })
    },
    createMsg () {
      this.msgFormVal = {}
      this.dialogTitleVal = '新增MQ消息'
      this.dialogVisibleVal = true
    },
    editMqMsg (id, title = '编辑MQ消息', editFlag = true) {
      getMockMqMsgInfo({ id: id }).then(response => {
        if (response.success) {
          this.msgFormVal = response.data
          if (response.data.isMultiple > 0) {
            this.$refs.msgRef.visible = true
            this.$refs.msgRef.tableData = []

            let value = ''
            const pattern = /\$\{(\w+)\}/g
            const paramArr = response.data.message.match(pattern)
            paramArr.forEach(item => {
              value += item.replace('${', '').replace('}', '') + ','
            })
            value = value.substr(0, value.length - 1)

            response.data.msgList.forEach(item => {
              this.$refs.msgRef.tableData.push({
                paramKey: value,
                paramValue: item.msgValue
              })
            })
          }
          if (editFlag) {
            this.msgFormVal.editFlag = true
          }
          this.dialogTitleVal = title
          this.dialogVisibleVal = true
        } else {
          this.$message({
            message: '获取MQ消息信息失败！',
            type: 'error'
          })
        }
      })
    },
    deleteMqMsg (id) {
      this.$confirm('是否确认删除MQ消息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMockMqMsg({ id: id }).then(response => {
          var thus = this
          this.handleCommonMessage(response, new function () {
            thus.getListByPage()
            thus.getOwnerList()
          }())
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    visitMqConfigPage () {
      this.$router.push({
        path: '/mock-server/mock-mq-config'
      })
    },
    handleCommonMessage (response, func) {
      if (response.success) {
        this.$message({
          message: response.data,
          type: 'success'
        })
        if (func instanceof Function) {
          func()
        }
      } else {
        this.$message({
          message: response.errorMessage,
          type: 'error'
        })
      }
    },
    closeDialog () {
      this.dialogVisibleVal = false
    },
    sendMqMsg (id) {
      sendMockMqMsg({ id: id }).then(response => {
        this.handleCommonMessage(response, new function () {
        }())
      })
    },
    commandWrapper (id, ops) {
      return {
        id: id,
        ops: ops
      }
    },
    handleMoreCommand (command) {
      switch (command.ops) {
        case 1:
          this.deleteMqMsg(command.id)
          break
        case 2:
          this.copyMqMsg(command.id)
          break
        default:
          return false
      }
    },
    copyMqMsg (id) {
      this.editMqMsg(id, '复制MQ消息', false)
    }
  }
}
</script>

<style scoped>
  .search-label {
    float: left;
    width: 22%;
    margin-top: 1.5%;
    font-size: 14px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
