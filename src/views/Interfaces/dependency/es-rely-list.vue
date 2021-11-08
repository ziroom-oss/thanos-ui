<template>
    <div class="app-container">
        <div class="container-header" style="height: 140px">
            <div class="search-wrap">
                <el-row :gutter="32">
                    <el-col :xs="24" :sm="24" :lg="12">
                        <div class="search-section">
                            <span class="search-label">ES链接：</span>

                            <el-select class="search-item" v-model="searchObj.esConnectionId" placeholder="请输入选择ES链接信息"
                                       value="" filterable @change="searchEv">
                                <el-option v-for="item in esConnectionList" :key="item.id" :label="item.esConnection"
                                           :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="12">
                        <div class="search-section">
                            <span class="search-label">配置名称：</span>
                            <el-input class="search-item" placeholder="请输入检索配置名称信息(支持模糊搜索)"
                                      v-model="searchObj.configName"
                                      clearable @keyup.enter.native="searchEv">
                            </el-input>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="12">
                        <div class="search-section">
                            <span class="search-label">索引名称：</span>
                            <el-input class="search-item" placeholder="请输入ES索引名称信息(支持模糊搜索)"
                                      v-model="searchObj.indexName"
                                      clearable @keyup.enter.native="searchEv">
                            </el-input>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :lg="12">
                        <div class="search-section">
                            <span class="search-label">用户姓名：</span>
                            <el-input class="search-item" placeholder="请输入用户姓名(支持模糊搜索)"
                                      v-model="searchObj.userName"
                                      clearable @keyup.enter.native="searchEv">
                            </el-input>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="search-btn">
                <el-button type="primary" @click="searchEv">查询</el-button>
                <el-button class="bot-btn" @click="resetSearchEv">重置</el-button>
            </div>
        </div>

        <el-row style="margin-bottom: 30px">
            <el-button type="primary" size="small" @click="addEsConfiguration">新增配置</el-button>
        </el-row>

        <el-table :data="tableData" border fit height="530" row-key="id" :expand-row-keys="expandRowKeys">
            <el-table-column type="expand">
                <template v-if="scope.row.requestForm !== undefined" slot-scope="scope">
                    <el-form :model="requestForm" label-position="left" class="table-expand">
                        <el-form-item label="请求方式:">
                            <span>{{ scope.row.requestForm.requestType }}</span>
                        </el-form-item>
                        <el-form-item label="请求URL:">
                            <span>{{ scope.row.requestForm.requestUrl }}</span>
                        </el-form-item>
                        <el-form-item label="请求头:">
                            <span>{{ scope.row.requestForm.requestHeader }}</span>
                        </el-form-item>
                        <el-form-item label="请求参数:">
                            <span>{{ scope.row.requestForm.requestParam }}</span>
                        </el-form-item>
                        <el-form-item label="返回结果: ">
                            <span>{{ scope.row.requestForm.responseData }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="70" align="center">
            </el-table-column>
            <el-table-column label="配置名称" align="center">
                <template slot-scope="scope">
                    {{scope.row.configName}}
                </template>
            </el-table-column>
            <el-table-column label="ES链接" align="center">
                <template slot-scope="scope">
                    {{scope.row.esConnection}}
                </template>
            </el-table-column>
            <el-table-column label="所属环境" align="center" width="90">
                <template slot-scope="scope">
                    {{scope.row.env | envFilter}}
                </template>
            </el-table-column>
            <el-table-column label="索引名称" align="center" width="160">
                <template slot-scope="scope">
                    {{scope.row.indexName}}
                </template>
            </el-table-column>
            <el-table-column label="检索条件" align="center" width="200">
                <template slot-scope="scope">
                    {{scope.row.jsonCondition | ellipsis}}
                </template>
            </el-table-column>
            <el-table-column label="用户姓名" align="center" width="80">
                <template slot-scope="scope">
                    {{scope.row.userName}}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" width="160">
                <template slot-scope="scope">
                    {{scope.row.createTime}}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="220">
                <template slot-scope="scope">
                    <el-button size="mini" @click="requestRow(scope.row.id)">发送</el-button>
                    <el-button size="mini" type="primary" @click="editRow(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="deleteRow(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                    @pagination="searchEv"/>

        <el-dialog :title="dialogTitle" :visible="dialogVisible" width="45%" @close="dialogCloseEv">
            <el-form :model="modelForm" ref="modelRef" :rules="rules" label-width="110px">
                <el-form-item label="配置名称" prop="configName">
                    <el-input v-model="modelForm.configName" placeholder="请输入配置名称信息"></el-input>
                </el-form-item>
                <el-form-item label="ES链接" prop="esConnectionId">
                    <el-select v-model="modelForm.esConnectionId" placeholder="请输入选择ES链接信息"
                               value="" filterable @change="getEnvByEsConnectionId" style="width: 100%">
                        <el-option v-for="item in esConnectionList" :key="item.id" :label="item.esConnection"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="modelForm.esConnectionId !== ''" label="所属环境" prop="env">
                    <el-tag type="success" size="medium">{{modelForm.env | envFilter}}</el-tag>
                    <i style="margin-left: 10px;color: orange;font-size: 13px" class="el-icon-info">当前选择的ES链接所属环境</i>
                </el-form-item>
                <el-form-item label="索引名称" prop="indexName">
                    <el-input v-model="modelForm.indexName" placeholder="请输入索引名称信息"></el-input>
                </el-form-item>
                <el-form-item label="检索条件" prop="jsonCondition">
                    <el-input v-model="modelForm.jsonCondition" type="textarea" :autosize="{ minRows: 3, maxRows: 12}"
                              placeholder="请输入JSON格式检索条件信息"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogCloseEv">取 消</el-button>
                <el-button type="primary" @click="commitSaveModel">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import {
  deleteEsSearchConditionById, esSearchConditionSearch,
  getEsConfigurationById,
  getEsConnectionList, getEsSearchConditionById, getEsSearchConditionList,
  insertEsSearchCondition, updateEsSearchConditionById
} from '@/api/model/esSearchConfiguration'

export default {
  name: 'es-rely-list',
  components: { Pagination },
  filters: {
    envFilter (status) {
      const envMap = {
        t: '测试环境',
        q: '准生产环境',
        p: '生产环境'
      }
      return envMap[status]
    },
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 25) {
        return value.slice(0, 25) + '...'
      }
      return value
    }
  },
  data () {
    return {
      searchObj: {
        esConnectionId: '',
        configName: '',
        indexName: '',
        userName: ''
      },
      total: 0,
      pageNum: 1,
      pageSize: 10,

      esConnectionList: [],
      tableData: [],
      expandRowKeys: [],

      dialogTitle: '',
      dialogVisible: false,
      modelForm: {
        esConnectionId: '',
        configName: '',
        env: '',
        indexName: '',
        jsonCondition: ''
      },

      rules: {
        configName: [
          { required: true, message: '请输入配置名称信息', trigger: 'blur' }
        ],
        esConnectionId: [
          { required: true, message: '请输入选择ES配置链接信息', trigger: 'change' }
        ],
        indexName: [
          { required: true, message: '请选择所属环境信息', trigger: 'blur' }
        ],
        jsonCondition: [
          { required: true, message: '请输入配置描述信息', trigger: 'blur' }
        ]
      },

      rowId: null,

      requestForm: {
        requestType: '',
        requestUrl: '',
        requestHeader: '',
        requestParam: '',
        responseData: ''
      }
    }
  },
  created () {
    this.getEsConnectionList()
    this.searchEv()
  },
  methods: {
    searchEv () {
      const postData = {
        configName: this.searchObj.configName,
        esConfigId: this.searchObj.esConnectionId,
        indexName: this.searchObj.indexName,
        userName: this.searchObj.userName
      }
      getEsSearchConditionList({ pageNum: this.pageNum, pageSize: this.pageSize }, postData).then(response => {
        if (response.success) {
          this.tableData = response.data.records
          this.total = response.data.total
        }
      })
      this.requestForm = {
        requestType: '',
        requestUrl: '',
        requestHeader: '',
        requestParam: '',
        responseData: ''
      }
      this.expandRowKeys = []
    },
    getEsConnectionList () {
      getEsConnectionList().then(response => {
        if (response.success) {
          this.esConnectionList = response.data
        }
      })
    },
    getEnvByEsConnectionId (connectionId) {
      getEsConfigurationById({ id: connectionId }).then(response => {
        if (response.success) {
          this.modelForm.env = response.data.env
        }
      })
    },
    resetSearchEv () {
      this.searchObj = {
        esConnectionId: '',
        configName: '',
        indexName: '',
        userName: ''
      }
      this.searchEv()
    },
    addEsConfiguration () {
      this.dialogTitle = '新增ES检索条件配置'
      this.dialogVisible = true
      this.rowId = null
    },
    dialogCloseEv () {
      this.dialogVisible = false
      this.$refs.modelRef.resetFields()
    },
    commitSaveModel () {
      this.$refs.modelRef.validate((valid) => {
        if (valid) {
          const postData = {
            esConfigId: this.modelForm.esConnectionId,
            configName: this.modelForm.configName,
            indexName: this.modelForm.indexName,
            jsonCondition: this.modelForm.jsonCondition
          }
          if (this.rowId == null) {
            insertEsSearchCondition(postData).then(response => {
              if (response.success) {
                this.$message({
                  type: 'success',
                  message: '新增操作成功'
                })
              }
              this.dialogCloseEv()
              this.searchEv()
            })
          } else {
            postData.id = this.rowId
            updateEsSearchConditionById(postData).then(response => {
              if (response.success) {
                this.$message({
                  type: 'success',
                  message: '更新操作成功'
                })
              }
              this.dialogCloseEv()
              this.searchEv()
            })
          }
        } else {
          return false
        }
      })
    },
    getDetailById (rowId) {
      getEsSearchConditionById({ id: rowId }).then(response => {
        if (response.success) {
          this.getEnvByEsConnectionId(response.data.esConfigId)
          this.modelForm.esConnectionId = response.data.esConfigId
          this.modelForm.configName = response.data.configName
          this.modelForm.env = response.data.env
          this.modelForm.indexName = response.data.indexName

          // 简易JSON格式化
          const json = JSON.parse(response.data.jsonCondition)
          this.modelForm.jsonCondition = JSON.stringify(json, null, '\t')
        }
      })
    },
    editRow (rowId) {
      this.getDetailById(rowId)
      this.dialogTitle = '编辑ES检索条件配置'
      this.dialogVisible = true
      this.rowId = rowId
    },
    deleteRow (rowId) {
      this.$confirm('确定要删除本条记录吗？', '二次提醒', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        deleteEsSearchConditionById({ id: rowId }).then(response => {
          if (response.success) {
            this.$message({
              type: 'success',
              message: '删除操作成功'
            })
          }
          this.searchEv()
        })
      }).catch(() => {

      })
    },
    requestRow (rowId) {
      esSearchConditionSearch({ id: rowId }).then(response => {
        if (response.success) {
          this.tableData.forEach(item => {
            if (item.id === rowId) {
              this.$set(item, 'requestForm', response.data)
            }
          })
          this.expandRowKeys = []
          this.expandRowKeys.push(rowId)
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
    .app-container .container-header {
      position: relative;
      height: 140px;
      // .search-btn {
      //   position: absolute;
      //   right: 0;
      //   top: 10px;
      // }
    }

    ::v-deep .search-wrap {
        width: 94%
    }

    ::v-deep .search-label {
        width: 18%;
    }

    ::v-deep .search-wrap {
        height: 140px;
    }
</style>
