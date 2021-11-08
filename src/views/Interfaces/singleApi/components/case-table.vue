<template>
    <div>
        <el-table
                v-loading="listLoading"
                :data="tableList"
                fit
                border
                highlight-current-row
                style="width: 100%;font-size: 13px"
                height="700"
                @select="handleSelectionChangeCase" @select-all="handleSelectionChangeCase">
            >
            <el-table-column
                    type="selection"
                    width="50" align="center" fixed="left">
            </el-table-column>
            <el-table-column label="用例id" prop="id" align="center" width="85">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="用例名称" prop="id" align="center" width="180">
                <template slot-scope="scope">
                    <span>{{ scope.row.caseName }}</span>
                </template>
            </el-table-column
            >
            <el-table-column label="是否可运行" width="70" align="center">
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.runnable" @change="changeCaseRunStatus(scope.row)">
                    </el-switch>

                </template>
            </el-table-column>
            <el-table-column label="参数详情" align="left">
                <template slot-scope="scope">
                    <span v-if="scope.row.encryptType !== 0">{{ scope.row.requestParam | ellipsis}}</span>
                    <span v-else-if="scope.row.requestParam !='' "
                          style="text-overflow: ellipsis;word-break:keep-all;white-space:nowrap;overflow:hidden;"
                          class="link-type"
                          @click="handleParam(scope.$index,scope.row)">{{ scope.row.requestParam | ellipsis }}</span>
                </template>
            </el-table-column>
            <el-table-column label="运行结果" width="100" align="center">
                <template slot-scope="scope">
                    <el-tag type="info" plain size="small" v-if="scope.row.executionRecordEntity == null">未执行
                    </el-tag>
                    <el-tag type="success" plain size="small"
                            v-else-if="scope.row.executionRecordEntity.recordResult == 'SUCCESS'">运行成功
                    </el-tag>
                    <el-tag type="danger" plain size="small"
                            v-else-if="scope.row.executionRecordEntity.recordResult == 'FAILURE'">运行失败
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="运行时间" width="100" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.executionRecordEntity == null">-</span>
                    <span v-else>{{scope.row.executionRecordEntity.startTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="用例描述" width="150px" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.comment == ''">暂无</span>
                    <span v-else>{{scope.row.comment}}</span>
                </template>
            </el-table-column>
            <el-table-column label="维护人" align="center" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.createUserCode }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200px" fixed="right">
                <template slot-scope="{row}">
                    <el-button-group>
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                       @click="caseEditShow(row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="复制" placement="top-start">
                            <el-button type="primary" icon="el-icon-document-copy" size="mini"
                                       @click="caseCopyShow(row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="历史报告" placement="top-start">
                            <el-button type="primary" icon="el-icon-data-analysis" size="mini"
                                       @click="routerReportCase(row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click="deleteCase(row)"></el-button>
                        </el-tooltip>

                        <!--<el-dropdown>-->
                        <!--<el-button type="primary" size="mini">-->
                        <!--<i class="el-icon-more"></i>-->
                        <!--</el-button>-->
                        <!--<el-dropdown-menu slot="dropdown">-->
                        <!--<el-dropdown-item>报告</el-dropdown-item>-->
                        <!--<el-dropdown-item>复制</el-dropdown-item>-->
                        <!--</el-dropdown-menu>-->
                        <!--</el-dropdown>-->
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getcaseList1" style="text-align:center"/>

        <!-- <el-dialog-->
        <!--title="参数详情"-->
        <!--:visible.sync="paramFormatTableShow"-->
        <!--width="40%"-->
        <!--left>-->
        <!--<el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addParam">增加</el-button>-->
        <!--<el-table :data="formatData" fit highlight-current-row style="width: 100%;margin-top:10px" border>-->
        <!--<el-table-column label="参数名称" align="center" width="180">-->
        <!--<template slot-scope="{row}">-->
        <!--<template v-if="row.edit">-->
        <!--<el-input v-model="row.key" class="edit-input" size="small" clearable/>-->
        <!--</template>-->
        <!--<span v-else>{{ row.key }}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="参数值" align="center" width="180">-->
        <!--<template slot-scope="{row}">-->
        <!--<template v-if="row.edit">-->
        <!--<el-input v-model="row.value" class="edit-input" size="small" clearable/>-->
        <!--</template>-->
        <!--<span v-else>{{ row.value }}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="操作" align="center">-->
        <!--<template slot-scope="scope">-->
        <!--<el-button-group>-->

        <!--<el-button-->
        <!--v-if="scope.row.edit"-->
        <!--type="success"-->
        <!--size="mini"-->
        <!--icon="el-icon-success"-->
        <!--@click="confirmEdit(scope.row)"-->
        <!--&gt;-->
        <!--</el-button>-->
        <!--<el-button-->
        <!--v-else-->
        <!--type="primary"-->
        <!--size="mini"-->
        <!--icon="el-icon-edit"-->
        <!--@click="scope.row.edit=!scope.row.edit"-->
        <!--&gt;</el-button>-->
        <!--<el-button type="primary" icon="el-icon-delete" size="mini"-->
        <!--@click="deleteParam(scope.$index,formatData)"></el-button>-->
        <!--</el-button-group>-->
        <!--</template>-->

        <!--</el-table-column>-->
        <!--</el-table>-->
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button type="primary" @click="commitFormat()" size="small" >提交</el-button>-->
        <!--</span>-->
        <!--</el-dialog> -->

        <el-dialog title="参数详情" :visible.sync="paramFormatTableShow">
            <el-row v-if="jsonRowShow === true">
                <el-input type="textarea" v-model="inParamData" placeholder="" :autosize="{ minRows: 10}"
                ></el-input>
            </el-row>
            <el-row v-if="jsonRowShow === false">
                <el-button size="mini" type="primary" class="el-icon-circle-plus-outline" @click="insertInParam(-1)"
                           style="margin-bottom:10px" plain>新增
                </el-button>
                <elx-editable ref="inParamTable" :data.sync="inParamTableData" border empty-text="请点击【新增】添加入参呦">
                    <elx-editable-column prop="key" align="center" label="参数名称"
                                         :edit-render="{name: 'ElInput'}"></elx-editable-column>
                    <elx-editable-column prop="value" align="center" label="参数值"
                                         :edit-render="{name: 'ElInput'}"></elx-editable-column>
                    <elx-editable-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    @click.native.prevent="deleteInparamStep(scope.$index, inParamTableData)"
                                    type="text"
                                    size="small">
                                删除
                            </el-button>
                        </template>
                    </elx-editable-column>
                </elx-editable>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="formatInparam" v-if="jsonRowShow === true">格式化</el-button>
                <el-button type="primary" @click="commitFormat()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="formTitle" :visible.sync="caseFormShow" width="60%" @close="resetInfo">
            <el-form label-width="80px" size="mini" ref="form" :rules="rules" :model="form">
                <el-form-item label="用例名称:" prop="apiCaseName">
                    <el-col :xs="22" :sm="22" :md="22" :lg="22">
                        <el-input v-model="form.apiCaseName" clearable></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="参数详情:" prop="requestParam">
                    <el-col :xs="22" :sm="22" :md="22" :lg="22">
                        <div class="grid-content">
                            <el-input class="grid-content"
                                      type="textarea"
                                      :autosize="{ minRows: 3}"
                                      v-model="form.requestParam"
                            >
                            </el-input>
                        </div>
                    </el-col>
                </el-form-item>
                <el-form-item label="依赖API:" prop="relyApiId">
                    <el-col :xs="5" :sm="5" :md="6" :lg="5">
                        <el-select v-model="form.relyApiId" placeholder="请选择依赖API" @change="displayRelyUri" filterable
                                   clearable value="">
                            <el-option
                                    v-for="item in relyList"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.caseName"
                            >
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :xs="16" :sm="16" :md="16" :lg="16">
                        <el-input v-model="form.relyApiDetail" :disabled="true">
                            <template slot="prepend">依赖API地址:</template>
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="依赖MQ:" prop="relyMqId">
                    <el-col :xs="5" :sm="5" :md="6" :lg="5">
                        <el-select v-model="form.relyMqId" placeholder="请选择依赖MQ" @change="displayRelyMqTopic" filterable
                                   clearable value="">
                            <el-option
                                    v-for="item in relyMqList"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.name"
                            >
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :xs="16" :sm="16" :md="16" :lg="16">
                        <el-input v-model="form.relyMqTopic" :disabled="true">
                            <template slot="prepend">依赖MQ主题:</template>
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="依赖ES:" prop="relyEsId">
                    <el-col :xs="5" :sm="5" :md="6" :lg="5">
                        <el-select v-model="form.relyEsId" placeholder="请选择依赖ES检索配置项" @change="displayRelyEsName"
                                   filterable
                                   clearable value="">
                            <el-option
                                    v-for="item in relyEsList"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.configName"
                            >
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :xs="16" :sm="16" :md="16" :lg="16">
                        <el-input v-model="form.relyEsName" :disabled="true">
                            <template slot="prepend">依赖ES名称:</template>
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="依赖SQL:" prop="sqlType">
                    <div v-for="item in sqlForm.items" :key="item.key">
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" style="padding-bottom: 10px">
                            <el-select v-model="item.sqlType" @change="reloadSqlList(item)" value="">
                                <el-option label="前置SQL" value="1"></el-option>
                                <el-option label="后置SQL" value="0"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="3" style="padding-bottom: 10px">
                            <el-select v-model="item.sqlName" filterable placeholder="请选择SQL名称" clearable
                                       @change="displaySqlDetail(item)" value="">
                                <el-option
                                        v-for="sql in item.sqlList"
                                        :key="sql.id"
                                        :value="sql.sqlName"
                                >
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="15" style="padding-bottom: 10px">
                            <el-input v-model="item.sqlDetail" :disabled="true">
                                <template slot="prepend">用例所含SQL</template>
                            </el-input>
                        </el-col>
                        <el-col :xs="2" :sm="1" :md="1" :lg="1" style="padding-bottom: 10px">
                            <el-button @click.prevent="removeSqlList(item)" icon="el-icon-minus" type="primary"
                                       size="mini"
                                       circle plain></el-button>
                        </el-col>
                    </div>
                    <el-col :xs="2" :sm="2" :md="1" :lg="1" style="padding-left:10px">
                        <el-button icon="el-icon-plus" type="primary" size="mini" circle plain
                                   @click="addItem"></el-button>
                    </el-col>
                </el-form-item>
                <el-form-item label="断言:" prop="expectedResults">
                    <smart-assert
                            ref="editSmartAssert"
                            :smart-assert-prop=this.smartAssertProp
                            :assert-list-prop="this.assertListProp"
                    >
                    </smart-assert>
                </el-form-item>
                <el-form-item label="用例描述:" prop="comment">
                    <el-col :xs="22" :sm="22" :md="22" :lg="22">
                        <el-input v-model="form.comment" placeholder="请对用例进行描述"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" v-show="formTitle === '用例编辑'" @click="submitCaseEditInfo()">提交修改</el-button>
                <el-button type="primary" v-show="formTitle === '用例复制'" @click="submitCaseCopyInfo()">提交复制</el-button>
                <el-button type="info" @click="resetInfo">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
  deleteCase,
  parseJson,
  updateSingleApiParam,
  getCaseTableList,
  changeCaseRunStatus,
  updateSingleApiCase,
  updateCopySingleApiCase
} from '@/api/model/singleApiList'
import { getSqlInfoById, getSqlList, getRelyList } from '@/api/model/singleApiSave'

import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { getMockMsgList } from '@/api/model/mockMqMsg'
import { getEsSearchConditionList } from '@/api/model/esSearchConfiguration'
import smartAssert from './smart-assert'

export default {
  components: { Pagination, smartAssert },
  directives: { waves },
  // 下拉框监听值的改变不生效
  // props:{
  //     userCodeForSearch:{
  //         type: String,
  //         default: function () {
  //             return ""
  //         }
  //     }
  // },
  // watch: {
  //     //搜索条件清空
  //     userCode() {
  //         alert(this.userCodeForSearch)
  //         if(this.userCodeForSearch == "") {
  //                 this.listQuery.createUserCode = ""
  //                 this.getcaseList(this.apiId,this.encryptType);
  //         }
  //     }
  //
  // },
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 100) {
        return value.slice(0, 100) + '...'
      }
      return value
    }
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
      teamList: [],
      listLoading: false,
      total: 0,
      tableList: [],
      multipleSelection: [],
      paramFormatTableShow: false,
      formatData: [],
      formatParamId: '',
      apiId: '',
      encryptType: 0,
      listQuery: {
        page: 1,
        limit: 20,
        apiId: this.apiId,
        createUserCode: ''
      },
      formTitle: '',
      caseFormShow: false,
      caseIdForEdit: '',
      caseIdForCopy: '',
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
        apiCaseName: '',
        originalCaseName: '',
        assertList: [],
        deleteApiIds: ''
      },
      sqlForm: {
        items: []
      },
      inParamTableData: [],
      relyList: [{
        id: '',
        relyId: '',
        caseName: '',
        requestUri: ''
      }],
      relyMqList: [],
      relyEsList: [],
      inParamData: '',
      jsonRowShow: true,
      rules: {
        assertList: [{ validator: verifyAssert }]
      },
      smartAssertProp: {
        normalShow: true,
        titleHeight: 'height:30px',
        radioMargin: 'margin:10px 10px 10px 10px'
      },
      assertListProp: []
    }
  },
  created () {
    this.getMqRelyList()
    this.getEsRelyList()
  },
  methods: {
    getcaseList (id, encryptType) {
      this.listLoading = true
      getCaseTableList(this.listQuery).then(response => {
        this.listLoading = false
        var tableList = response.data.resultList
        this.tableList = []
        for (var i = 0; i < tableList.length; i++) {
          var tableObj = tableList[i]
          tableObj.encryptType = encryptType
          this.tableList.push(tableObj)
        }
        this.total = parseInt(response.data.total)
        this.encryptType = encryptType
      })
      this.apiId = id
      this.listQuery.apiId = id
    },
    getInitList (id, encryptType) {
      this.listQuery.createUserCode = ''
      this.getcaseList(id, encryptType)
    },

    getcaseList1 () {
      this.listLoading = true
      getCaseTableList(this.listQuery).then(response => {
        this.listLoading = false
        this.tableList = []
        var tableList = response.data.resultList
        for (var i = 0; i < tableList.length; i++) {
          var tableObj = tableList[i]
          tableObj.encryptType = this.encryptType
          this.tableList.push(tableObj)
        }
        this.total = parseInt(response.data.total)
      })
    },
    getListForSearch (user) {
      this.listQuery.createUserCode = user
      this.getcaseList(this.apiId, this.encryptType)
    },
    // 多选取值
    handleSelectionChangeCase (selection) {
      this.$emit('caseSelection', selection)
    },
    // 删除操作
    deleteCase (row) {
      this.$confirm('您确认删除该用例吗', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCase({ id: row.id }).then((response) => {
          if (response.success) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
          this.getcaseList(this.apiId, this.encryptType)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      getcaseList(this.apiId, this.encryptType)
    },

    getApiTable (id) {
      const caseInfo = {
        id: id,
        caseShow: false
      }
      this.$emit('listenChangeCaseShow', caseInfo)
    },
    // 参数format
    handleParam (index, row) {
      if (row.requestParam != '' && row.requestParam != null) {
        if (!this.isJSON(row.requestParam) && row.requestParam.indexOf('=') != -1) {
          // 调用接口转为table
          this.jsonRowShow = false
          this.getFormatList(row.requestParam)
        } else if (this.isJSON(row.requestParam)) {
          var json = JSON.parse(row.requestParam)
          this.inParamData = JSON.stringify(json, null, '\t')
        } else {
          this.inParamData = row.inParam
        }
      } else {
        this.inParamData = row.inParam
      }
      this.paramFormatTableShow = true
      this.formatParamId = row.id
    },
    // 入参--格式化
    formatInparam () {
      var json = JSON.parse(this.inParamData)
      this.inParamData = JSON.stringify(json, null, '\t')
    },
    // 入参--新增
    insertInParam (row) {
      this.$refs.inParamTable.insertAt({}, row).then(({ row }) => this.$refs.inParamTable.setActiveCell(row))
    },
    // 入参--删除参数
    deleteInparamStep (index, rows) {
      rows.splice(index, 1)
    },
    // 参数格式化-----获取param
    async getFormatList (param) {
      // this.formatData = [{"key": "login", "value": "123"}, {"key": "userName", "value": "zhangw"}]
      var obj = { paramterStr: param }
      var params = new URLSearchParams()
      for (const item in obj) {
        if (obj.hasOwnProperty(item)) {
          params.append(item, obj[item])
        }
      }
      await parseJson(params).then(response => {
        if (response.success) {
          this.inParamTableData = JSON.parse(response.data)
        }
      })
      // await parseJson(params).then(response => {
      //     if (response.success) {
      //         this.formatData = response.data;
      //         this.formatData = JSON.parse(this.formatData).map(v => {
      //             this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
      //             v.originalKey = v.key
      //             v.originValue = v.value //  will be used when user click the cancel botton
      //             return v
      //         })
      //         this.listLoading = false
      //     }
      //
      // })
      // const items = data.items
    },
    // 参数格式化-----编辑
    confirmEdit (row) {
      row.edit = false
      row.originalKey = row.key
      row.originValue = row.value
    },
    // 参数格式化-----删除
    deleteParam (index, formatData) {
      formatData.splice(index, 1)
    },
    // 参数格式化-----提交
    commitFormat () {
      // 提交接口
      this.updateSingleApiParam()
      this.getcaseList(this.apiId, this.encryptType)
    },
    // 新增参数
    addParam () {
      // var newData = {
      //     "key": "",
      //     "value": ""
      // }
      // this.formatData.push(newData)
      // this.formatData = this.formatData.map(v => {
      //     this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
      //     v.originalKey = v.key
      //     v.originValue = v.value //  will be used when user click the cancel botton
      //     return v
      // })
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
    // 提交参数修改
    updateSingleApiParam () {
      var params = ''
      if (this.jsonRowShow) {
        params = this.inParamData
      } else {
        params = JSON.stringify(this.inParamTableData)
      }
      var obj = { params: params, id: this.formatParamId.toString() }
      var params = new URLSearchParams()
      for (const item in obj) {
        if (obj.hasOwnProperty(item)) {
          params.append(item, obj[item])
        }
      }
      updateSingleApiParam(params).then(response => {
        if (response.success) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.paramFormatTableShow = false
          this.getcaseList(this.apiId, this.encryptType)
        } else {
          this.$message({
            message: response.data,
            type: 'error'

          })
        }
      })
    },
    // 更改运行状态
    changeCaseRunStatus (row) {
      changeCaseRunStatus({ id: row.id, isRunnable: row.runnable }).then(response => {
        if (response.success) {
          this.getcaseList(this.apiId, this.encryptType)
        } else {
          this.$message({
            type: 'error',
            message: '更改失败!'
          })
        }
      })
    },
    // 编辑dialog显示
    caseEditShow (row) {
      this.formTitle = '用例编辑'
      this.caseFormShow = true
      this.caseIdForEdit = row.id
      this.getEditFormInfo(row)
    },
    // 复制dialog显示
    caseCopyShow (row) {
      this.formTitle = '用例复制'
      this.caseFormShow = true
      this.caseIdForCopy = row.id
      this.getEditFormInfo(row)
    },
    // 编辑/复制的接口信息返显
    async getEditFormInfo (formInfo) {
      // 获取依赖列表
      this.getRelyList()
      // 获取sql
      // this.getSqlList(this.sqlForm.items[0].sqlType)
      this.form.comment = formInfo.comment
      this.form.requestParam = formInfo.requestParam
      this.form.expectedResults = formInfo.expectedResults
      this.form.assertType = formInfo.assertType
      this.form.apiCaseName = formInfo.caseName
      this.form.originalCaseName = formInfo.caseName
      debugger

      if (formInfo.assertType !== null && formInfo.assertType !== '' && formInfo.expectedResults !== null && formInfo.expectedResults !== '') {
        this.assertListProp = [{ assertContent: formInfo.expectedResults, assertType: formInfo.assertType }]
      } else {
        this.assertListProp = formInfo.assertList
      }
      // 获取依赖
      if (formInfo.relyId != null && formInfo.relyId != '') {
        this.form.relyApiId = formInfo.relyId
        for (var i = 0; i < this.relyList.length; i++) {
          if (this.form.relyApiId == this.relyList[i].id) {
            this.form.relyApiDetail = this.relyList[i].requestUri
          }
          break
        }
      }

      // MQ依赖反显
      if (formInfo.relyMqId != null && formInfo.relyMqId !== '') {
        this.form.relyMqId = formInfo.relyMqId
        this.form.relyMqTopic = this.relyMqList.filter(item => item.id === this.form.relyMqId)[0].topic
      } else {
        this.form.relyMqId = ''
        this.form.relyMqTopic = ''
      }

      // ES依赖反显
      if (formInfo.relyEsId != null && formInfo.relyEsId !== '') {
        this.form.relyEsId = formInfo.relyEsId
        const item = this.relyEsList.filter(item => item.id === this.form.relyEsId)[0]
        this.form.relyEsName = item.configName + '【索引名称:' + item.indexName + '】'
      } else {
        this.form.relyEsId = ''
        this.form.relyEsName = ''
      }
      // 获取sql
      if (formInfo.preSqlId != null) {
        // this.sqlForm.items.shift()
        var arr = []
        var sqlList = []
        arr = formInfo.preSqlId.split(',')
        for (var i = 0; i < arr.length; i++) {
          let sql = {}
          await getSqlInfoById({ id: arr[i] }).then(response => {
            sql = response.data
          })

          await getSqlList({ isPrep: '1' }).then(response => {
            sqlList = response.data
          })
          debugger

          var obj = {
            sqlType: '1',
            sqlId: arr[i],
            sqlName: sql.sqlName,
            sqlDetail: sql.sqlData,
            sqlList: sqlList
          }
          this.sqlForm.items.push(obj)
        }
      }
    },
    // 关闭dialog特殊清除rely和sql
    resetInfo () {
      this.caseFormShow = false
      this.sqlForm = {
        items: []
      }
      this.form.relyApiId = ''
      this.form.relyApiDetail = ''
      this.form.relyMqId = ''
      this.form.relyMqTopic = ''
      this.$refs.form.resetFields()
      this.assertListProp = []
    },

    // 初始化加载--获取sql列表
    getSqlList (sqlType) {
      getSqlList({ isPrep: sqlType }).then(response => {
        this.sqlForm.items[0].sqlList = response.data
      })
    },
    // sql增加前/后置
    addItem () {
      var sqlType = '1'
      var sqlList = []
      getSqlList({ isPrep: sqlType }).then(response => {
        sqlList = response.data
        this.sqlForm.items.push({
          sqlType: sqlType,
          sqlName: '',
          sqlDetail: '',
          sqlList: sqlList
        })
      })
    },
    // 移除sql前/后置
    removeSqlList (item) {
      var index = this.sqlForm.items.indexOf(item)
      if (index !== -1) {
        this.sqlForm.items.splice(index, 1)
      }
    },
    // 初始化加载--获取sql列表

    // 切换sqlType--获取sql列表
    reloadSqlList (item) {
      var type = item.sqlType
      var index = this.sqlForm.items.indexOf(item)
      getSqlList({ isPrep: type }).then(response => {
        this.sqlForm.items[index].sqlList = response.data
      })
    },
    // 选择的sql名称后，显示详细的sql信息sqlDetail
    displaySqlDetail (item) {
      var index = this.sqlForm.items.indexOf(item)
      var sqlList = this.sqlForm.items[index].sqlList
      for (var i = 0; i < sqlList.length; i++) {
        var sqlObj = sqlList[i]
        if (item.sqlName == sqlObj.sqlName) {
          this.sqlForm.items[index].sqlId = sqlObj.id
          this.sqlForm.items[index].sqlDetail = sqlObj.sqlData
        }
      }
    },
    // 分离前置后置
    segmentSqlIds () {
      var postSqlIds = ''
      var preSqlIds = ''
      var sqlItems = this.sqlForm.items
      for (var i = 0; i < sqlItems.length; i++) {
        if (sqlItems[i].sqlType == '1') {
          preSqlIds += sqlItems[i].sqlId + ','
        } else if (sqlItems[i].sqlType == '0') {
          postSqlIds += sqlItems[i].sqlId + ','
        }
      }
      postSqlIds = postSqlIds.substring(0, postSqlIds.length - 1)
      preSqlIds = preSqlIds.substring(0, preSqlIds.length - 1)
      var obj = { postSqlIds: postSqlIds, preSqlIds: preSqlIds }
      return obj
    },
    getAssertResult () {
      this.assertListProp = []
      const tabs = this.$refs.editSmartAssert.editableTabs
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].assertRadio === '1') {
          if (tabs[i].schemaContent instanceof Object) {
            tabs[i].schemaContent = JSON.stringify(tabs[i].schemaContent)
          }
          const verifyData = tabs[i].schemaContent.replace(/\r\n/g, '').replace(/\n/g, '')
          const assertType = 1
          this.assertListProp.push({ id: tabs[i].id, assertContent: verifyData, assertType: assertType })
        } else if (tabs[i].assertRadio === '2') {
          const verifyData = this.getJsonPathAssert(tabs[i])
          const assertType = 2
          this.assertListProp.push({ id: tabs[i].id, assertContent: verifyData, assertType: assertType })
        } else if (tabs[i].assertRadio === '3') {
          const verifyData = tabs[i].methodContent
          const assertType = 3
          this.assertListProp.push({ id: tabs[i].id, assertContent: verifyData, assertType: assertType })
        } else {
          const verifyData = tabs[i].normalContent
          const assertType = 0
          this.assertListProp.push({ id: tabs[i].id, assertContent: verifyData, assertType: assertType })
        }
      }
      this.form.assertList = this.assertListProp
      const ids = this.$refs.editSmartAssert.deleteAssertIds
      this.form.deleteAssertIds = ids.substring(0, ids.length - 1)
    },
    getJsonPathAssert (tab) {
      let content = ''
      const array = tab.pathContent
      for (let i = 0; i < array.length; i++) {
        content += (array[i].express + array[i].operator + array[i].expectValue + array[i].link)
      }
      if (content.substring(content.length - 4) === 'null') {
        return content.substring(0, content.length - 4)
      }
      return content
    },
    // 提交编辑数据
    submitCaseEditInfo () {
      var obj = this.segmentSqlIds()
      this.getAssertResult()
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          var updateInfo = {
            comment: this.form.comment,
            requestParam: this.form.requestParam,
            expectedResults: this.form.expectedResults,
            caseName: this.form.apiCaseName,
            id: this.caseIdForEdit,
            apiId: this.apiId,
            relyId: this.form.relyApiId,
            preSqlId: obj.preSqlIds,
            postSqlId: obj.postSqlIds,
            assertType: this.form.assertType,
            assertList: this.form.assertList,
            deleteAssertIds: this.form.deleteAssertIds
          }
          updateSingleApiCase(updateInfo).then(response => {
            if (response.success) {
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.caseFormShow = false
              this.getcaseList(this.apiId, this.encryptType)
            } else {
              this.$message({
                message: response.errorMessage,
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 提交复制数据
    submitCaseCopyInfo () {
      this.getAssertResult()
      if (this.form.originalCaseName === this.form.apiCaseName) {
        this.$message({
          message: '您没有修改用例名称,不能提交修改！',
          type: 'error'
        })
        return false
      }
      var updateInfo = {
        comment: this.form.comment,
        requestParam: this.form.requestParam,
        expectedResults: this.form.expectedResults,
        assertType: this.form.assertType,
        caseName: this.form.apiCaseName,
        apiId: this.apiId,
        relyId: this.form.relyApiId,
        relyMqId: this.form.relyMqId,
        relyEsId: this.form.relyEsId,
        preSqlId: '',
        postSqlId: ''
      }
      updateCopySingleApiCase(updateInfo).then(response => {
        if (response.success) {
          this.$message({
            message: '复制成功',
            type: 'success'
          })
          this.caseFormShow = false
          this.getcaseList(this.apiId, this.encryptType)
        } else {
          this.$message({
            message: response.errorMessage,
            type: 'error'
          })
        }
      })
    },
    // 编辑dialog显示后加载依赖列表
    getRelyList () {
      getRelyList({ caseName: null }).then(response => {
        this.relyList = response.data
        // alert(JSON.stringify(this.relyList))
      })
    },
    // 获取relyMqList
    getMqRelyList () {
      getMockMsgList({ pageNum: 1, pageSize: 10000 }, {}).then(response => {
        this.relyMqList = response.data.records
      })
    },
    // 获取relyEsList
    getEsRelyList () {
      getEsSearchConditionList({ pageNum: 1, pageSize: 10000 }, {}).then(response => {
        if (response.success) {
          this.relyEsList = response.data.records
        }
      })
    },
    // 获取依赖对应的uri
    displayRelyUri () {
      for (var i = 0; i < this.relyList.length; i++) {
        if (this.form.relyApiId == this.relyList[i].id) {
          this.form.relyApiDetail = this.relyList[i].requestUri
        }
      }
    },
    // 根据ID查询MQ消息主题
    displayRelyMqTopic () {
      this.form.relyMqTopic = this.relyMqList.filter(item => item.id === this.form.relyMqId)[0].topic
    },
    // 根据ID查询ES依赖名称
    displayRelyEsName () {
      const item = this.relyEsList.filter(item => item.id === this.form.relyEsId)[0]
      this.form.relyEsName = item.configName + '【索引名称:' + item.indexName + '】'
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
    }

  }
}
</script>

<style lang="stylus" scoped>
    .pagination-container {
        margin-top: 0;
    }

    .button-ziroom {
        background-color: #ffa000
        border-color: #ffa000
    }

    .link-type, .link-type:focus {
        color: #337ab7;
        cursor: pointer;
    }

</style>
