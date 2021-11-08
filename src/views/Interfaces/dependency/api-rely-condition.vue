<template>
    <el-container>
        <el-main style="overflow-x:hidden;overflow-y:hidden;height:900px">
            <div>
                <el-row style="margin-top: 10px;border-bottom: 1px solid #cccccc;padding-bottom:10px;height: 44px">
                    <el-col :xs="12"  :sm="9"  :md="7"  :lg="7" :xl="7" style="" ><h4 style="color: #7c7c7c;margin-top: 10px;margin-left: 20px;">单接口依赖列表</h4></el-col>
                </el-row>
            </div>
            <div class="search-wrap">
                <el-row :gutter="32">

                    <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">用例ID：</span>
                            <el-input
                                    class="search-item"
                                    placeholder="请输入用例ID"
                                    v-model="listQuery.id"
                                    clearable>
                            </el-input>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">请求URL：</span>
                            <el-input
                                    class="search-item"
                                    placeholder="请输入用例名称(支持模糊搜索)"
                                    v-model="listQuery.requestUri"
                                    clearable>
                            </el-input>
                        </div>
                    </el-col>

                    <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">用户姓名：</span>
                            <el-select v-model="listQuery.createUserCode" placeholder="请输入录入人名字" filterable clearable
                                       style="width: 300px" @change="getCreateUserCode(listQuery.createUserCode)">
                                <el-option
                                        v-for="user in users"
                                        :key="user.userCode"
                                        :label="user.realName"
                                        :value="user.userCode">
                                    <span style="float: left">{{ user.realName }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ user.oaName }}</span>
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>

                    <el-col :xs="24" :sm="24" :lg="8">
                        <div class="search-section">
                            <span class="search-label">域名：</span>
                            <el-select filterable placeholder="请输入线上域名" clearable v-model="listQuery.systemId"
                                       style="width: 300px" @change="getSystemInfoId(listQuery.systemId)">
                                <el-option
                                        v-for="system in systemList"
                                        :key="system.id"
                                        :value="system.id"
                                        :label="system.onlineDomainName"
                                >
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!--<div>-->
                <!--<div>-->
                    <!--<el-row style="padding-left: 10px;color: #7c7c7c;margin-top: 10px;">-->
                        <!--<el-col :xs="4" :sm="5" :md="4" :lg="8">-->
                            <!--<span style="margin-left:25px">用例ID：</span>-->
                            <!--<el-input placeholder="请输入用例ID" v-model="listQuery.id" style="width: 300px"></el-input>-->
                        <!--</el-col>-->
                        <!--<el-col :xs="4" :sm="5" :md="8" :lg="15">-->
                            <!--<span style="margin-left:300px">请求URL：</span>-->
                            <!--<el-input placeholder="请输入要搜索的URL" v-model="listQuery.requestUri" style="width: 300px"></el-input>-->
                        <!--</el-col>-->
                    <!--</el-row>-->
                    <!--<el-row style="padding-left: 10px;color: #7c7c7c;margin-top: 10px;">-->
                        <!--<el-col :xs="4" :sm="5" :md="4" :lg="8">-->
                            <!--<span style="margin-left:40px">姓名：</span>-->
                            <!--<el-select v-model="listQuery.createUserCode" placeholder="请输入录入人名字"  filterable clearable style="width: 300px" @change="getCreateUserCode(listQuery.createUserCode)">-->
                                <!--<el-option-->
                                        <!--v-for="user in users"-->
                                        <!--:key="user.userCode"-->
                                        <!--:label="user.realName"-->
                                        <!--:value="user.userCode">-->
                                    <!--<span style="float: left">{{ user.realName }}</span>-->
                                    <!--<span style="float: right; color: #8492a6; font-size: 13px">{{ user.oaName }}</span>-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</el-col>-->
                        <!--<el-col :xs="4" :sm="5" :md="8" :lg="15">-->
                            <!--<span style="margin-left:333px">域名：</span>-->
                            <!--<el-select filterable placeholder="请输入线上域名" clearable v-model="listQuery.systemId" style="width: 300px" @change="getSystemInfoId(listQuery.systemId)">-->
                                <!--<el-option-->
                                        <!--v-for="system in systemList"-->
                                        <!--:key="system.id"-->
                                        <!--:value="system.id"-->
                                        <!--:label="system.onlineDomainName"-->
                                <!--&gt;-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</el-col>-->
                    <!--</el-row>-->
                    <!--<el-row style="padding-left: 10px;color: #7c7c7c;margin-top: 10px;text-align:center">-->
                        <!--<el-col :xs="4" :sm="5" :md="5" :lg="24">-->
                            <!--<el-button type="primary" @click="searchEv" plain>查询</el-button>-->
                            <!--<el-button type="success" @click="resetSearchObj" plain>重置</el-button>-->
                        <!--</el-col>-->
                    <!--</el-row>-->
                <!--</div>-->
            <!--</div>-->
            <div>
                <el-row style="margin-top: 10px;height: 44px">
                    <el-col  :xs="12"  :sm="15"  :md="14"  :lg="14" :xl="17" style="padding-left:  10px">
                        <el-button-group>
                            <el-button  type="primary"  size="small"  @click="run('t')"  plain>T环境运行</el-button>
                            <el-button  type="warning"  size="small"  @click="run('q')"  plain>Q环境运行</el-button>
                            <el-button  type="success"  size="small"  icon="el-icon-data-analysis"  plain
                                        @click="toReportRouter">运行报告
                            </el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
                <el-table
                        :data="singleRelyApiTableList"
                        stripe
                        fit
                        border
                        highlight-current-row
                        style="width: 100%;font-size: 13px;"
                        height="550px"
                        @select="handleSelectionChangeCase" @select-all="handleSelectionChangeCase"
                >
                    <el-table-column type="selection"  align="center" fixed="left"></el-table-column>
                    <el-table-column label="用例ID" prop="id" align="center" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.id }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="用例名称" prop="id" align="center" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.caseName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="线上域名"  align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.onlineDomainName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="请求URL" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.requestUri }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="请求类型"  align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.requestType}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="录入人" align="center" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.realName }}({{scope.row.oaName}})</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" >
                        <template slot-scope="{row}">
                            <el-button-group>
                                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                                    <el-button type="primary" icon="el-icon-edit" size="mini"
                                               @click="caseEditShow(row)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                                    <el-button type="primary" icon="el-icon-delete" size="mini"
                                               @click="deleteCase(row)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="报告" placement="top-start">
                                    <el-button type="primary" icon="el-icon-data-analysis" size="mini"
                                               @click="routerReportCase(row)"></el-button>
                                </el-tooltip>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                            @pagination="getRelyApiCaseList" style="text-align:center"/>

                <rely-case-dialog :dialogVisible="dialogVisible" title="编辑依赖用例"
                                 :dialog-form-obj="dialogFormObj" @close="dialogVisible = false" v-on:listenSingleRelyApiTableList="listenSingleRelyApiTableList"></rely-case-dialog>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import Pagination from '@/components/Pagination/index'

import {
  getRelyApiCaseList,
  getSingleApiCaseById,
  getUserList,
  getSytemList
} from '@/api/model/singleRelyApiList'
import {
  runCase
} from '@/api/model/singleApiList'
import relyCaseDialog from './components/rely-case-dialog'

export default {
  components: { Pagination, relyCaseDialog },
  data () {
    return {
      singleRelyApiTableList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        id: '',
        createUserCode: '',
        requestUri: '',
        systemId: ''
      },
      dialogFormObj: {},
      dialogVisible: false,
      users: [{
        oaName: '',
        realName: '',
        userCode: ''
      }],
      systemList: [{
        id: '',
        onlineDomainName: ''
      }],
      selectionCaseId: ''
    }
  },
  created () {
    this.getRelyApiCaseList()
    this.getUserList()
    this.getSystemList()
  },
  methods: {
    getRelyApiCaseList (data) {
      getRelyApiCaseList(this.listQuery).then(response => {
        this.singleRelyApiTableList = response.data.resultList
        this.total = parseInt(response.data.total)
      })
    },
    getUserList () {
      getUserList().then(response => {
        this.users = response.data
      })
    },
    getSystemList () {
      getSytemList().then(response => {
        if (response.success) {
          this.systemList = response.data
        }
      })
    },
    caseEditShow (data) {
      getSingleApiCaseById({ caseId: data.id }).then((response) => {
        this.dialogFormObj = response.data
      })
      this.dialogVisible = true
    },
    deleteCase (data) {
      this.$confirm('确定要删除依赖接口吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteApi({ id: data.id }).then((response) => {
          if (response.success) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getRelyApiCaseList()
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
    handleSelectionChangeCase (selection) {
      var id = ''
      for (var i = 0; i < selection.length; i++) {
        id += selection[i].id + ','
      }
      var caseIds = id.substring(0, id.length - 1)
      this.selectionCaseId = caseIds
    },
    run (env) {
      if (this.selectionCaseId === '') {
        this.$message({
          message: '请选中后再运行！',
          type: 'error'

        })
        return false
      }
      var param = {}
      param.caseIds = this.selectionCaseId
      param.env = env
      runCase(param).then(response => {
        if (response.success) {
          var sum = response.data.sum
          var success = response.data.success
          var failure = response.data.failure
          this.$message({
            message: '共执行测试用例总数：' + sum + ',执行成功：' + success + ',执行失败:' + failure,
            type: 'success'

          })
        }
      })
    },
    toReportRouter () {
      if (this.selectionCaseId === '') {
        this.$message({
          message: '请选中接口后再查看报告！',
          type: 'error'

        })
        return false
      }
      const caseIds = this.selectionCaseId
      const { href } = this.$router.resolve({
        path: '/interfaces/singleApi/single-api-case-latest-report',
        query: {
          caseIds: caseIds
        }
      })
      window.open(href, '_blank')
    },
    routerReportCase (row) {
      if (row.executionRecordEntity === null) {
        this.$message({
          message: '该用例是【未执行】状态,无报告信息！',
          type: 'error'
        })
        return false
      }
      const { href } = this.$router.resolve({
        path: '/interfaces/singleApi/single-api-case-history-report',
        query: {
          caseIds: row.id
        }
      })
      window.open(href, '_blank')
    },
    resetSearchObj () {
      this.listQuery = {
        page: 1,
        limit: 20,
        id: '',
        createUserCode: '',
        requestUri: '',
        systemId: ''
      }
      this.getRelyApiCaseList()
    },
    getSystemInfoId (systemId) {
      this.listQuery.systemId = systemId
    },
    getCreateUserCode (createUserCode) {
      this.listQuery.createUserCode = createUserCode
    },
    searchEv () {
      this.getRelyApiCaseList(this.listQuery)
    },
    // 刷新分页数据
    listenSingleRelyApiTableList () {
      this.getRelyApiCaseList()
    }

  }
}
</script>

<style lang="stylus" scoped>

    .el-main {
        background: #fff;
        box-shadow: 0 1px 4px 1px rgba(1, 0, 0, 0.2);
        padding: 10;
        height: 620px
        margin: 10px
    }

    aside {
        padding: 5px 2px
    }

    .el-col {
        margin-left 2px
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }s

         .el-scrollbar__wrap {
             overflow-x: hidden;
         }

    /deep/ .el-dialog__body {
        padding: 30px 10px 30px 10px;
    }

    /deep/ .el-main {
        padding 0px 0px 10px 0px
        margin-right 0px

    }

    .button-ziroom {
        background-color: #ffa000
        border-color: #ffa000
    }

    /deep/ .pagination-container {
        padding: 10px 16px 0px 16px;
    }
    /deep/.el-scrollbar__bar.is-horizontal {
        height: 0px;
        left: 0px;
    }

</style>
