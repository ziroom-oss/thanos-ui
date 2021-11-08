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
                @select="handleSelectionChange" @select-all="handleSelectionChange">
            >
            <el-table-column
                    type="selection"
                    width="50" align="center" fixed="left">
            </el-table-column>
            <el-table-column label="接口id" prop="id" align="center" width="85">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="接口名称" width="150" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.apiName}}</span>

                </template>
            </el-table-column>
            <!--<el-table-column label="是否可运行" width="70" align="center">-->
                <!--<template slot-scope="scope">-->
                    <!--<el-switch-->
                            <!--v-model="scope.row.runnable" @change="changeRunStatus(scope.row)">-->
                    <!--</el-switch>-->

                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="请求url" align="left">
                <template slot-scope="scope">
                    <span>{{ scope.row.requestUri }}</span>
                </template>
            </el-table-column>
            <el-table-column label="请求类型" width="80" align="center">
                <template slot-scope="scope">
                    <a href>{{ scope.row.requestType }}</a>
                </template>
            </el-table-column>

            <!--<el-table-column label="请求参数Api" width="80" align="center">-->
                <!--<template slot-scope="scope">-->
                    <!--<el-button type="info" icon="el-icon-view" size="mini"-->
                               <!--@click="swaggerApiClick(scope.row)"></el-button>-->
                <!--</template>-->
            <!--</el-table-column>-->

            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="所含用例数" width="80px" align="center">
                <template slot-scope="scope">
                    <el-tooltip placement="top"  :content="scope.row.singleApiCaseList.length">
                        <div slot="content">点击后将跳转到<br/>对应的用例列表</div>
                        <span class="link-type" @click="getApiTable(scope.row.id,scope.row.encryptType)">{{ scope.row.singleApiCaseList.length }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <!--<el-table-column label="成功/运行个数" align="center" width="80px">-->
            <!--<template slot-scope="scope">-->
            <!--<span>{{ scope.row.userName }}</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="操作" align="center" width="200px" fixed="right">
                <template slot-scope="{row}">
                    <el-button-group>
                        <el-button-group>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                           @click="apiEdtiShow(row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="复制" placement="top-start">
                                <el-button type="primary" icon="el-icon-document-copy" size="mini"
                                           @click="apiCopyShow(row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="运行报告" placement="top-start">
                                <el-button type="primary" icon="el-icon-data-analysis" size="mini"
                                           @click="routerReport(row.id)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click="deleteApi(row)"></el-button>
                            </el-tooltip>
                        </el-button-group>

                    </el-button-group>

                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList" style="text-align:center"/>
        <el-dialog :title="formTitle" :visible.sync="apiFormShow" @close="resetSql" width="60%">
            <el-form label-width="80px" size="mini">
                <el-form-item label="请求方式:" prop="apiType">
                    <el-select v-model="form.apiType">
                        <el-option label="GET" value="GET"></el-option>
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="PUT" value="PUT"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="加密方式:" prop="encrypt">
                    <el-select v-model="form.encrypt">
                        <el-option label="不加密" value="0"></el-option>
                        <el-option label="网关加密" value="1"></el-option>
                        <el-option label="服务加密" value="2"></el-option>
                        <el-option label="民宿加密" value="3"></el-option>
                        <el-option label="自如驿加密" value="4"></el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item label="依赖类型:" prop="relyType">
                    <el-select v-model="form.relyType">
                        <el-option label="非依赖接口" value="0"></el-option>
                        <el-option label="依赖接口" value="1"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="URI:"  prop="requestUri">
                    <el-col :xs="22" :sm="22" :md="22" :lg="22">
                        <el-input v-model="form.requestUri"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="接口描述:" prop="apiName">
                    <el-col :xs="22" :sm="22" :md="22" :lg="22">
                        <el-input v-model="form.apiName" placeholder="请对接口进行描述"></el-input>
                    </el-col>
                </el-form-item>
                <!-- <el-form-item label="SQL:" prop="sql">
                    <div v-for="item in sqlForm.items" :key="item.key">
                        <el-col :xs="3" :sm="3" :md="3" :lg="3" style="padding-bottom: 10px">
                            <el-select v-model="item.sqlType" @change="reloadSqlList(item)">
                                <el-option label="前置SQL" value="1"></el-option>
                                <el-option label="后置SQL" value="0"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="3" style="padding-bottom: 10px">
                            <el-select v-model="item.sqlName" filterable placeholder="请选择SQL名称" clearable
                                       @change="displaySqlDetail(item)">
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
                        <el-col :xs="2" :sm="2" :md="1" :lg="1" style="padding-bottom: 10px">
                            <el-button @click.prevent="removeSqlList(item)" icon="el-icon-minus" type="primary"
                                       size="mini"
                                       circle plain></el-button>
                        </el-col>
                    </div>
                    <el-col :xs="2" :sm="2" :md="1" :lg="1" style="padding-left:10px">
                        <el-button icon="el-icon-plus" type="primary" size="mini" circle plain @click="addItem"></el-button>
                    </el-col>
                </el-form-item> -->
                <el-form-item label="Header:" prop="header">
                    <div class="grid-content">
                        <el-input class="grid-content"
                                  type="textarea"
                                  :autosize="{ minRows: 3}"
                                  placeholder="Accept: application/json;version=2" v-model="form.header"
                        >
                        </el-input>

                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" v-show="formTitle === '接口编辑'" @click="submitApiEditInfo()">提交修改</el-button>
                <el-button type="primary" v-show="formTitle === '接口复制'" @click="submitApiCopyInfo()">提交复制</el-button>
                <el-button type="info" @click="resetSql">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="参数API详情录入" :visible.sync="swaggerApiShow"  width="60%" @close="swaggerApiShow = false;swaggerTableData = []">
            <el-button-group>
            <el-button size="small" type="primary" plain @click="$refs.editable.insert({})">新  增</el-button>
            <el-button  size="small" type="danger" plain @click="$refs.editable.removeSelecteds()">删除选中</el-button>
            </el-button-group>
            <elx-editable ref="editable" :data.sync="swaggerTableData">
                <elx-editable-column type="selection" width="55"></elx-editable-column>
                <elx-editable-column prop="paramName"   align="center" label="参数名称"  :edit-render="{name: 'ElInput'}"></elx-editable-column>
                <elx-editable-column prop="type"  align="center" label="数据类型" :edit-render="{name: 'ElSelect', options: typeList}"></elx-editable-column>
                <elx-editable-column prop="len"  align="center" label="数据长度"  :edit-render="{name: 'ElInputNumber'}"></elx-editable-column>
                <elx-editable-column prop="isRequired" align="center" label="是否必须" :edit-render="{name: 'ElSelect', options: isRequiredList}"></elx-editable-column>
            </elx-editable>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="swaggerApiShow = false;swaggerTableData = []">取 消</el-button>
                <el-button type="primary" size="small" @click="swaggerApiCommit">提交修改</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
import {
  deleteCase,
  getSingleApiList,
  updateSingleApi,
  copySingleApi,
  deleteApi,
  changeRunStatus,
  swaggerApiInfoCommit,
  getSwaggerApiParam
} from '@/api/model/singleApiList'
import {
  getSqlList, getRelyList,
  getSqlInfoById
} from '@/api/model/singleApiSave'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  directives: { waves },
  props: {
    treeInfo: {
      type: String,
      default: function () {
        return ''
      }
    },
    searchUri: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
      searchObj: {
        caseId: '',
        caseName: '',
        jmxName: '',
        userName: '',
        teamName: ''
      },
      apiIdForEdit: '',
      apiIdForCopy: '',
      formTitle: '',
      form: {
        apiType: '',
        encrypt: '',
        requestUri: '',
        originalUri: '',
        relyType: '',
        relyApiId: '',
        systemObj: {
          systemName: '',
          systemId: ''
        },
        relyApiDetail: '',
        header: '',
        apiName: '',
        systemId: '',
        sql: {
          items: [{
            sqlType: '1',
            sqlId: '',
            sqlName: '',
            sqlDetail: '',
            sqlList: [{
              sqlName: '',
              id: '',
              sqlData: ''

            }]
          }]
        }

      },
      sqlForm: {
        items: []
      },
      relyList: [{
        id: '',
        relyId: '',
        caseName: '',
        requestUri: ''
      }],
      listLoading: false,
      total: 0,
      tableList: null,
      multipleSelection: [],
      apiFormShow: false,
      listQuery: {
        page: 1,
        limit: 20,
        businessCode: '',
        deptCode: '',
        moduleId: '',
        systemId: '',
        searchContent: ''
      },
      swaggerApiShow: false,
      swaggerTableData: [],
      typeList: [
        {
          label: 'string',
          value: 'string'
        }, {
          label: 'int',
          value: 'int'
        }, {
          label: 'long',
          value: 'int'
        }, {
          label: 'boolean',
          value: 'boolean'
        }, {
          label: 'decimal',
          value: 'decimal'
        }, {
          label: 'json',
          value: 'dict'
        }, {
          label: 'list',
          value: 'list'
        }

      ],
      isRequiredList: [
        {
          label: 'true',
          value: '1'
        }, {
          label: 'false',
          value: '0'
        }

      ],
      swaggerApiId: ''

    }
  },
  computed: {
    // offset() {
    //     return this.pageNum * this.pageSize - this.pageSize
    // }
  },
  created () {
    this.getList()
  },
  watch: {
    treeInfo (val) {
      var valJson = JSON.parse(val)
      this.listQuery.deptCode = valJson.deptCode
      this.listQuery.systemId = valJson.systemId
      this.listQuery.moduleId = valJson.moduleId
      this.listQuery.businessCode = valJson.businessCode
    },
    searchUri () {
      this.listQuery.searchContent = this.searchUri
      // if (this.searchUri == "") {
      //     this.listQuery.searchContent = ""
      //     this.getList()
      // }
    }
  },
  methods: {
    getList () {
      this.listLoading = true
      getSingleApiList(this.listQuery
      ).then(response => {
        this.listLoading = false
        this.tableList = response.data.items
        this.total = parseInt(response.data.total)
      })
    },
    getGlobalApiList (obj) {
      this.listQuery.businessCode = obj.businessCode
      this.listQuery.systemId = obj.systemId
      this.getList()
    },

    getListForSearch (uri) {
      this.listQuery.searchContent = uri.trim()
      this.getList()
    },

    // 向父组件传递apiId等信息
    getApiTable (id, encryptType) {
      const caseInfo = {
        id: id,
        apiShow: false,
        encryptType: encryptType
      }
      this.$emit('listenChangeApiShow', caseInfo)
    },
    // changeRunStatus(row) {
    //     changeRunStatus({"id": row.id, "isRunnable": row.runnable}).then(response => {
    //         if (response.success) {
    //             getList();
    //         } else {
    //             this.$message({
    //                 type: 'error',
    //                 message: '更改失败!'
    //             });
    //         }
    //     })
    //
    // },

    // 运行 --- 多选取值
    handleSelectionChange (selection) {
      this.$emit('apiSelection', selection)
    },
    // 编辑dialog显示
    apiEdtiShow (row) {
      this.formTitle = '接口编辑'
      this.apiFormShow = true
      this.apiIdForEdit = row.id
      // this.$refs[form].resetFields();
      this.getEditFormInfo(row)
    },
    // 复制dialog显示
    apiCopyShow (row) {
      this.formTitle = '接口复制'
      this.apiFormShow = true
      this.apiIdForCopy = row.id
      this.getEditFormInfo(row)
    },

    // api删除操作
    deleteApi (row) {
      this.$confirm('删除该接口后，其所含的用例将一并删除,请确认！', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteApi({ id: row.id }).then((response) => {
          if (response.success) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList()
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
    // 编辑/复制的接口信息返显
    async getEditFormInfo (formInfo) {
      // this.$refs[form].resetFields();
      // 获取依赖列表
      this.getRelyList()
      this.form.apiType = formInfo.requestType
      this.form.encrypt = formInfo.encryptType.toString()
      this.form.requestUri = formInfo.requestUri
      this.form.originalUri = formInfo.requestUri
      this.form.header = formInfo.header
      this.form.relyType = formInfo.isRely.toString()
      this.form.apiName = formInfo.apiName
      this.form.systemId = formInfo.systemId
      // 获取依赖
      if (formInfo.relyId != null && formInfo.relyId != '') {
        this.form.relyApiId = formInfo.relyId
        for (var i = 0; i < this.relyList.length; i++) {
          if (this.form.relyApiId == this.relyList[i].relyId) {
            this.form.relyApiDetail = this.relyList[i].requestUri
          }

          break
        }
      }
      // this.getSqlList(this.sqlForm.items[0].sqlType)

      // 加载sql列表
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
    // 提交编辑数据
    submitApiEditInfo () {
      var obj = this.segmentSqlIds()
      var updateInfo = {
        encryptType: this.form.encrypt,
        header: this.form.header,
        id: this.apiIdForEdit,
        isRely: parseInt(this.form.relyType),
        relyId: this.form.relyApiId,
        requestType: this.form.apiType,
        requestUri: this.form.requestUri,
        preSqlId: obj.preSqlIds,
        postSqlId: obj.postSqlIds,
        systemId: this.form.systemId,
        apiName: this.form.apiName
      }
      updateSingleApi(updateInfo).then(response => {
        if (response.success) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.apiFormShow = false
          this.getList()
        } else {
          this.$message({
            message: response.errorMessage,
            type: 'error'
          })
        }
      })
    },
    // 分离前后置sql
    segmentSqlIds () {
      var postSqlIds = ''
      var preSqlIds = ''
      var sqlItems = this.sqlForm.items
      console.log(sqlItems)
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
    // 提交复制数据
    submitApiCopyInfo () {
      var updateInfo = {
        encryptType: this.form.encrypt,
        header: this.form.header,
        id: this.apiIdForCopy,
        isRely: parseInt(this.form.relyType),
        relyId: this.form.relyApiId,
        requestType: this.form.apiType,
        requestUri: this.form.requestUri,
        preSqlId: '',
        postSqlId: '',
        systemId: this.form.systemId
      }
      if (this.form.originalUri === this.form.requestUri) {
        this.$message({
          message: '您没有修改请求URI,不能提交修改！',
          type: 'error'
        })
        return false
      }
      copySingleApi(updateInfo).then(response => {
        if (response.success) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.apiFormShow = false
          this.getList()
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
    routerReport (id) {
      const { href } = this.$router.resolve({
        path: '/interfaces/singleApi/single-api-report',
        query: {
          apiIds: id
        }
      })
      window.open(href, '_blank')
    },

    getSqlList (sqlType) {
      getSqlList({ isPrep: sqlType }).then(response => {
        this.sqlForm.items[0].sqlList = response.data
      })
    },
    // 关闭时重置sql内容
    resetSql () {
      this.apiFormShow = false
      this.sqlForm = {
        items: []
      }
    },

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
      // console.log(JSON.stringify(item));
      var index = this.sqlForm.items.indexOf(item)
      var sqlList = this.sqlForm.items[index].sqlList
      for (var i = 0; i < sqlList.length; i++) {
        var sqlObj = sqlList[i]
        if (item.sqlName === sqlObj.sqlName) {
          this.sqlForm.items[index].sqlId = sqlObj.id
          this.sqlForm.items[index].sqlDetail = sqlObj.sqlData
        }
      }
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
    // swaggerApi
    swaggerApiClick (row) {
      this.swaggerApiShow = true
      this.swaggerApiId = row.id
      // 调接口获取参数信息
      getSwaggerApiParam({ id: this.swaggerApiId }
      ).then(response => {
        if (response.success) {
          this.listLoading = false
          this.swaggerTableData = response.data
        }
      })
    },
    swaggerApiCommit () {
      var obj = { id: this.swaggerApiId, apiParamInfo: JSON.stringify(this.swaggerTableData) }
      alert(JSON.stringify(this.swaggerTableData))
      var params = new URLSearchParams()
      for (const item in obj) {
        if (obj.hasOwnProperty(item)) {
          params.append(item, obj[item])
        }
      }

      swaggerApiInfoCommit(params).then(response => {
        if (response.success) {
          this.swaggerApiShow = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })

          this.getList()
        }
      })
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

    /deep/ .link-type, .link-type:focus {
        color: #3757f5;
        cursor: pointer;
        text-decoration: underline
    }

    /deep/ .link-type:hover {
        color: #e6a23c;
        cursor: pointer;
    }

</style>
