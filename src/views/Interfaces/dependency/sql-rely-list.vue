<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>SQL列表</span>
        </div>

        <div>
            <el-row style="margin-top: 20px">
                <el-col :span="6">
                    <el-input placeholder="用例名称" v-model="inputCaseName">
                        <template slot="prepend">用例名称</template>
                    </el-input>
                </el-col>
                <el-col :span="6" style="margin-left: 10px">
                    <el-input placeholder="数据库IP" v-model="inputDatabaseIp">
                        <template slot="prepend">数据库IP</template>
                    </el-input>
                </el-col>
                <el-col :span="6" style="margin-left: 10px">
                    <el-input placeholder="数据库名称" v-model="inputDatabaseName">
                        <template slot="prepend">数据库名称</template>
                    </el-input>
                </el-col>
                <el-col :span="1" style="margin-left: 50px; float:left">
                    <el-button type="primary" @click="getSqlInfoList">查 询</el-button>
                </el-col>
                <el-col :span="1" style="margin-left: 30px; float:left">
                    <el-button type="success" @click="restSqlInfo">重 置</el-button>
                </el-col>
            </el-row>
        </div>

        <div>
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%; line-height: 40px;margin-top: 40px">
                <el-table-column
                        prop="id"
                        label="用例ID"
                        width="70">
                </el-table-column>
                <el-table-column
                        prop="sqlName"
                        label="用例名称"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="testDbUrl"
                        label="数据IP"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="testDbName"
                        label="数据库名"
                        width="100">
                </el-table-column>
                <el-table-column prop="isPrep" label="SQL类型" width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.isPrep == '1'">前置
                        </div>
                        <div v-if="scope.row.isPrep == '0'">后置
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="sqlData"
                        label="SQL语句">
                </el-table-column>
                <!--<el-table-column-->
                        <!--prop="note"-->
                        <!--label="备注">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                        <!--prop="inputPerson"-->
                        <!--label="录入人">-->
                <!--</el-table-column>-->
                <el-table-column prop="operate" label="操作" width="150" align="center">
                    <template slot-scope="{row}">
                        <el-button-group>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="caseEditShow(row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top-start" style="margin-left: 20px">
                                <el-button type="primary" icon="el-icon-delete" size="mini" @click="deleteCase(row)"></el-button>
                            </el-tooltip>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :page.sync="pageQuery.pageNum" :total="total" :limit.sync="pageQuery.pageSize" @pagination="getSqlInfoList"/>

            <rely-sql-dialog :dialogVisible="dialogVisible" title="SQL编辑"
                              :dialog-form-obj="dialogFormObj" @close="dialogVisible = false" v-on:listenTableList="listenTableList"></rely-sql-dialog>
        </div>
    </el-card>
</template>

<script>

import {
  getSqlInfoList,
  deleteSql,
  getSqlInfoById
} from '@/api/model/sqlRelyList'

import Pagination from '@/components/Pagination/index'

import relySqlDialog from './components/rely-sql-dialog'

export default {

  name: 'sql-rely-list',
  components: { Pagination, relySqlDialog },
  data () {
    return {
      tableData: [],
      loading: true,
      pageQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      inputCaseName: '',
      inputDatabaseName: '',
      inputDatabaseIp: '',

      dialogFormObj: {},
      dialogVisible: false
    }
  },

  created () {
    this.getSqlInfoList()
  },

  methods: {
    getSqlInfoList () {
      getSqlInfoList({
        inputCaseName: this.inputCaseName,
        inputDatabaseIp: this.inputDatabaseIp,
        inputDatabaseName: this.inputDatabaseName,
        pageNum: this.pageQuery.pageNum,
        pageSize: this.pageQuery.pageSize
      }).then(response => {
        this.tableData = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    restSqlInfo () {
      this.inputCaseName = '',
      this.inputDatabaseName = '',
      this.inputDatabaseIp = '',
      this.getSqlInfoList()
    },
    deleteCase (data) {
      this.$confirm('确定要删除SQL吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSql({ id: data.id }).then((response) => {
          if (response.success) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getSqlInfoList()
          } else {
            this.$message({
              message: response.errorMessage,
              type: 'warn'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    caseEditShow (data) {
      getSqlInfoById({ id: data.id }).then(response => {
        this.dialogFormObj = response.data
        this.dialogFormObj.isPrep = response.data.isPrep.toString()
      }),
      this.dialogVisible = true
    },

    listenTableList () {
      this.getSqlInfoList()
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
