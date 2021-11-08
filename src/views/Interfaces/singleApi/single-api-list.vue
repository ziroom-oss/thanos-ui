<template>
    <el-container>
        <businessLine @selectBusiCode="selectBusiCodeEnter" @searchSystem="searchSystemEnter" ref="businessLine"
                      v-show="this.buslineShow"></businessLine>

        <div style="box-shadow: 0 1px 4px 1px rgba(1, 0, 0, 0.2);height:900px;margin-top: 10px;width: 250px"
             v-show="treeMenu">
            <el-row style="margin: 10px;">
                <el-col :span="4">
                    <svg-icon icon-class="dragon" style="
                background: #fff;height: 2em ;width:2em "/>
                </el-col>
                <el-col :span="18">
                    <el-input style=""
                              size="small"
                              placeholder="输入关键字过滤"
                              suffix-icon="el-icon-search"
                              v-model="filterText" clearable>
                    </el-input>
                </el-col>
            </el-row>
            <div style="height: 860px;width: 250px; overflow-x: hidden;">
                <el-scrollbar style="height: 100% ;border-top: 1px solid #cccccc;">
                    <tree-list :deptTree="this.deptTree" ref="tree" :onlineSystemName="this.onlineSystemName"
                               :filterText="this.filterText.trim()"
                               v-on:listenTreeClickInfo="listenTreeClickInfo"></tree-list>
                </el-scrollbar>
            </div>
        </div>

        <el-main style="overflow-x:hidden;overflow-y:hidden;height:900px" v-show="this.tableMenu">
            <div>
                <el-row style="margin-top: 10px;border-bottom: 1px solid #cccccc;padding-bottom:10px;height: 44px">

                    <el-col :xs="12" :sm="1" :md="1" :lg="1" :xl="1" style="padding-left:  10px;padding-top:0px">
                        <el-button type="text" v-show="fold" icon="el-icon-s-fold" class="foldButton"
                                   @click="treeMenu=false,fold = false,unfold =true "></el-button>
                        <el-button type="text" v-show="unfold" icon="el-icon-s-unfold" class="foldButton"
                                   @click="treeMenu=true,fold = true,unfold =false "></el-button>
                    </el-col>
                    <el-col :xs="12" :sm="9" :md="7" :lg="7" :xl="7"><h4 style="color: #7c7c7c;margin-top: 10px">
                        {{headerName}}</h4></el-col>
                    <el-col :xs="12" :sm="15" :md="15" :lg="7" :xl="5" style="padding-left:  10px;float:right">
                        <el-button type="text" icon="el-icon-back"
                                   v-show="this.busMenuShow" @click="returnBusMenu">返回业务线业务页
                        </el-button>
                        <el-button type="text" icon="el-icon-back"
                                   v-show="this.caseTableShow" @click="returnApiTable">返回上一层
                        </el-button>

                    </el-col>
                </el-row>
                <el-row style="margin-top: 10px;height: 44px">
                    <el-col :xs="12" :sm="15" :md="14" :lg="14" :xl="17" style="padding-left:  10px">

                        <el-button type="danger" size="small" @click="modelBound"
                                   v-show="this.treeInfo.systemId  !==''  &&  this.apiTableShow  ===true"
                                   plain>模块绑定
                        </el-button>

                        <router-link to='/interfaces/singleApi/single-api-save'>
                            <el-button type="success" size="small">新增用例
                            </el-button>
                        </router-link>

                        <el-button-group>

                            <el-button type="primary" size="small" @click="chooseEnv()" plain>T环境运行</el-button>
                            <el-button type="warning" size="small" @click="run('q')" plain>Q环境运行</el-button>
                            <el-button type="success" size="small" icon="el-icon-data-analysis" plain
                                       @click="toReportRouter">运行报告
                            </el-button>
                        </el-button-group>
                    </el-col>
                    <el-col :xs="5" :sm="5" :md="6" :lg="7" :xl="4" style="float:right;">

                        <div v-show="this.apiTableShow" style="display: inline-block">
                            <el-input
                                    placeholder="请输入接口id或uri"
                                    prefix-icon="el-icon-search"
                                    v-model="searchUri"
                                    @keyup.enter.native="searchApiUri"
                            >
                                <el-button type="info" slot="append" icon="el-icon-search" size="mini"
                                           @click="searchApiUri"></el-button>
                            </el-input>

                        </div>
                        <div v-show="this.caseTableShow">
                            <el-select v-model="userCodeForSearch" placeholder="请输入录入人名字" filterable clearable>
                                <el-option
                                        v-for="user in users"
                                        :key="user.userCode"
                                        :label="user.realName"
                                        :value="user.userCode">
                                    <span style="float: left">{{ user.realName }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ user.oaName }}</span>
                                </el-option>

                            </el-select>
                            <el-button type="info" slot="append" icon="el-icon-search" size="medium"
                                       @click="searchCaseUser" plain></el-button>
                        </div>

                    </el-col>
                </el-row>
            </div>
            <div>
                <api-table ref="apiTable" v-show="this.apiTableShow" v-on:listenChangeApiShow="listenChangeApiShow"
                           v-on:apiSelection="apiSelection" :treeInfo="JSON.stringify(this.treeInfo)"
                           :searchUri="this.searchUri"></api-table>
                <case-table ref="caseTable" v-show="this.caseTableShow" v-on:caseSelection="caseSelection"></case-table>
            </div>
        </el-main>
        <el-dialog
                title="模块绑定"
                :visible.sync="modelBoundForm"
                width="30%"
                left>
            <el-form label-width="100px" size="mini">
                <el-form-item label="所选接口ID:">
                    <el-col :xs="20" :sm="20" :md="20" :lg="20">
                        <el-input v-model="this.selectionApiId" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="模块绑定至:">
                    <el-col :xs="20" :sm="20" :md="22" :lg="22">
                        <el-select v-model="modelId" filterable placeholder="请选择模块">
                            <el-option
                                    v-for="item in options"
                                    :key="item.id"
                                    :label="item.moduleName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitBound()" size="mini">提交绑定</el-button>
                <el-button type="info" @click="modelBoundForm = false" size="mini">取消</el-button>
            </div>

        </el-dialog>

        <el-dialog title="提示信息" :visible.sync="runDialogVisible" width="30%" :close-on-click-modal="false"
                   @close="closeEv">
            <div style="margin-bottom: 30px;color: orange"><i class="el-icon-info"></i>请先选择环境（默认t环境）</div>
            <el-radio-group v-model="caseRunEnv">
                <el-radio label="t" size="small">t环境</el-radio>
                <el-radio label="kt" size="small">kt环境</el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeEv">取 消</el-button>
                <el-button type="primary" @click="run(caseRunEnv)"
                          >确 定</el-button>
            </span>
        </el-dialog>
    </el-container>

</template>

<script>
import {
  getDeptTreeList, runInterface, runCase, getModelList, submitBound, getUserList
} from '@/api/model/singleApiList'

import treeList from './components/treeList'
import apiTable from './components/api-table'
import caseTable from './components/case-table'
import businessLine from './components/busline'

export default {
  name: 'singleApiList',
  components: {
    treeList,
    caseTable,
    apiTable,
    businessLine
  },
  data () {
    return {
      filterText: '',
      deptTree: [],
      search: '',
      caseTableShow: false,
      apiTableShow: true,
      selectionApiId: '',
      selectionCaseId: '',
      apiId: '',
      treeInfo: {
        businessCode: '',
        deptCode: '',
        moduleId: '',
        systemId: ''

      },
      businessName: '',
      buslineShow: true,
      treeMenu: false,
      tableMenu: false,
      busMenuShow: true,
      // modelBoundShow: false,
      modelBoundForm: false,
      options: [{
        id: '',
        moduleName: ''
      }],
      modelId: '',
      fold: true,
      unfold: false,
      headerName: '',
      onlineSystemName: '',
      searchUri: '',
      users: [{
        oaName: '',
        realName: '',
        userCode: ''
      }],
      userCodeForSearch: '',
      caseRunEnv: 't',
      runDialogVisible: false

    }
  },
  created () {
    this.getUserList()
  },

  methods: {
    getUserList () {
      getUserList().then(response => {
        this.users = response.data
      })
    },
    // 点击业务线跳转到接口列表
    selectBusiCodeEnter (data) {
      this.buslineShow = false
      this.treeMenu = true
      this.tableMenu = true
      this.caseTableShow = false
      this.apiTableShow = true
      this.headerName = this.businessName + '— 接口列表'
      var obj = {
        businessCode: data.businessCode,
        systemId: ''
      }
      this.getDeptTreeList(obj)
      this.treeInfo.businessCode = data.businessCode
      this.businessName = data.businessName
      this.$refs.apiTable.getList()
    },
    // 全局搜索
    searchSystemEnter (data) {
      this.buslineShow = false
      this.treeMenu = true
      this.tableMenu = true
      this.caseTableShow = false
      this.apiTableShow = true
      this.headerName = '接口列表'
      var obj = { businessCode: '', systemId: data.systemId }
      // 树返现时的唯一标识用树的label定义
      this.onlineSystemName = data.label
      this.treeInfo.systemId = data.systemId
      this.getDeptTreeList(obj)
      this.$refs.apiTable.getGlobalApiList(obj)
    },
    // 获取树信息
    getDeptTreeList (obj) {
      getDeptTreeList(obj).then(response => {
        console.log(response)
        this.deptTree = response.data
      })
    },
    // 隐藏接口 展示用例
    listenChangeApiShow (data) {
      this.apiId = data.id.toString()
      this.apiTableShow = data.caseShow
      this.caseTableShow = true
      this.headerName = '用例列表'
      this.$refs.caseTable.getInitList(this.apiId, data.encryptType)
    },
    returnApiTable () {
      this.apiTableShow = true
      this.caseTableShow = false
      this.selectionCaseId = ''
      this.selectionApiId = ''
      this.headerName = this.businessName + '- 接口列表'
      this.userCodeForSearch = ''
      this.$refs.apiTable.getList()
    },

    returnBusMenu () {
      this.buslineShow = true
      this.treeMenu = false
      this.tableMenu = false
      this.treeInfo.systemId = ''
      this.treeInfo.deptCode = ''
      this.treeInfo.moduleId = ''
      this.selectionCaseId = ''
      this.selectionApiId = ''
      this.searchUri = ''
      this.userCodeForSearch = ''
      this.$refs.businessLine.clearSearchStatus()
    },
    // 获取接口table选中的apiId
    apiSelection (selection) {
      var id = ''
      for (var i = 0; i < selection.length; i++) {
        id += selection[i].id + ','
      }
      this.selectionApiId = id.substring(0, id.length - 1)
    },
    caseSelection (selection) {
      var id = ''
      for (var i = 0; i < selection.length; i++) {
        id += selection[i].id + ','
      }
      this.selectionCaseId = id.substring(0, id.length - 1)
    },

    // 模块绑定
    modelBound () {
      if (this.selectionApiId === '') {
        this.$message({
          message: '请选择需要绑定的接口！',
          type: 'error'

        })
        return false
      }

      getModelList({ systemId: parseInt(this.treeInfo.systemId) }).then(response => {
        if (response.success) {
          if (response.data.length === 0) {
            this.$message({
              message: '该系统下没有模块，请添加模块',
              type: 'warn'

            })
            return false
          }
          this.modelBoundForm = true
          this.options = response.data
        }
      })
    },
    // 提交绑定
    submitBound () {
      submitBound({ ids: this.selectionApiId, moduleId: parseInt(this.modelId) }).then(response => {
        if (response.success) {
          this.$message({
            message: '提交成功',
            type: 'success'

          })
        } else {
          this.$message({
            message: response.errorMessage,
            type: 'error'

          })
        }
        this.modelBoundForm = false
        this.$refs.apiTable.getList()
      })
    },
    chooseEnv () {
      if (this.apiTableShow && this.caseTableShow === false) {
        if (this.selectionApiId === '') {
          this.$message({
            message: '请选中后再运行！',
            type: 'error'

          })
          return false
        }
      }
      // 用例层面运行
      if (this.apiTableShow === false && this.caseTableShow === true) {
        if (this.selectionCaseId === '') {
          this.$message({
            message: '请选中后再运行！',
            type: 'error'

          })
          return false
        }
      }
      this.runDialogVisible = true
    },
    // chooseEnv () {
    //     console.log("xianshi")
    //     this.runDialogVisible = true
    // },

    run (env) {
      var param = {}
      this.runDialogVisible = false
      // 接口层面运行
      if (this.apiTableShow && this.caseTableShow === false) {
        if (this.selectionApiId === '') {
          this.$message({
            message: '请选中后再运行！',
            type: 'error'

          })
          return false
        }

        this.selectionCaseId = ''
        param.apiIds = this.selectionApiId
        param.env = env
        // alert("runInterface"+JSON.stringify(param))
        runInterface(param).then(response => {
          if (response.success) {
            this.$message({
              message: '运行成功',
              type: 'success'

            })
            this.$refs.apiTable.getList()
          }
        })
      }
      // 用例层面运行
      if (this.apiTableShow === false && this.caseTableShow === true) {
        if (this.selectionCaseId === '') {
          this.$message({
            message: '请选中后再运行！',
            type: 'error'

          })
          return false
        }
        this.selectionApiId = ''
        param.caseIds = this.selectionCaseId
        param.env = env
        // alert("runCase"+JSON.stringify(param))
        runCase(param).then(response => {
          if (response.success) {
            var sum = response.data.sum
            var success = response.data.success
            var failure = response.data.failure
            this.$message({
              message: '共执行测试用例总数：' + sum + ',执行成功：' + success + ',执行失败:' + failure,
              type: 'success'

            })
            this.$refs.caseTable.getListForSearch('')
          }
        })
      }
    },
    searchApiUri () {
      this.$refs.apiTable.getListForSearch(this.searchUri)
    },
    searchCaseUser () {
      this.$refs.caseTable.getListForSearch(this.userCodeForSearch)
    },
    toReportRouter () {
      // 接口层面报告
      if (this.apiTableShow && this.caseTableShow === false) {
        if (this.selectionApiId === '') {
          this.$message({
            message: '请选中接口后再查看报告！',
            type: 'error'

          })
          return false
        }
        this.selectionCaseId = ''
        const apiIds = this.selectionApiId
        const { href } = this.$router.resolve({

          path: '/interfaces/singleApi/single-api-report',
          query: {
            apiIds: apiIds
          }
        })
        window.open(href, '_blank')
      }
      // 用例层面报告
      if (this.apiTableShow === false && this.caseTableShow) {
        if (this.selectionCaseId === '') {
          this.$message({
            message: '请选中用例后再查看报告！',
            type: 'error'

          })
          return false
        }
        this.selectionApiId = ''
        const caseIds = this.selectionCaseId
        const { href } = this.$router.resolve({
          path: '/interfaces/singleApi/single-api-case-latest-report',
          query: {
            caseIds: caseIds
          }
        })
        window.open(href, '_blank')
      }
    },
    listenTreeClickInfo (data) {
      if (data.level === 1) {
        this.treeInfo.deptCode = data.id
        this.treeInfo.systemId = ''
        this.treeInfo.moduleId = ''
      } else if (data.level === 2) {
        this.treeInfo.systemId = data.id
        this.treeInfo.deptCode = ''
        this.treeInfo.moduleId = ''
      } else {
        this.treeInfo.moduleId = data.id
        this.treeInfo.systemId = ''
        this.treeInfo.deptCode = ''
      }
      this.$refs.apiTable.getList()
      this.returnApiTable()
    },

    closeEv () {
      this.runDialogVisible = false
      this.caseRunEnv = 't'
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
    }
    .divClass {
        margin-top: 20px
        padding: 10px
        background-color: white;
        border: 1px;
        color: #333;
        text-align: center;
    }

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

    /deep/ .el-scrollbar__bar.is-horizontal {
        height: 0px;
        left: 0px;
    }

    /deep/ .foldButton {
        color: #555555;
        font-size 18px
        padding-top: 10px
    }

</style>
