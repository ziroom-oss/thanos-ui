<template>
  <div class="test-application">
    <el-card style="margin-bottom: 20px" shadow="hover">
      <!--查询区域 -->
      <el-card style="margin-bottom: 20px" shadow="hover">
        <div class="test-application-search">
          <el-form :model="testApplicationSearch" label-width="100px" ref="testAppForm">
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item label="应用名称:" prop="applicationName">
                  <el-input v-model="testApplicationSearch.applicationName" placeholder="请输入应用名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="关联域名:" prop="belongToSystem">
                  <el-select
                    v-model="testApplicationSearch.applicationHostname"
                    clearable
                    filterable
                    remote
                    placeholder="请输入关联域名"
                    :remote-method="remoteMethod"
                    :loading="loading"
                  >
                    <el-option
                      v-for="item in belongToSystemList"
                      :key="item.id"
                      :label="item.envDomain"
                      :value="item.envDomain">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="组织结构:" prop="ehrTreePath">
                  <el-cascader
                    ref="cascader"
                    v-model="testApplicationSearch.ehrTreePath"
                    :options="afterHandledeptOrgList"
                    separator="-"
                    size="mini"
                    filterable
                    :show-all-levels="false"
                    clearable
                    :props="{ multiple: cascaderConfig.multipleCheck, checkStrictly: true }"
                    placeholder="请选择所属组织结构"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="应用类型:" prop="applicationType">
                  <el-select v-model="testApplicationSearch.applicationType">
                    <el-option v-for="item in applicationTypeDataDictionaryList" :label="item.name" :key="item.englishName" :value="item.name" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item class="search-button">
              <el-button type="primary" @click="submitForm()">查询</el-button>
              <el-button plain type="primary" @click="resetForm('testAppForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <!--分页 -->
      <el-card shadow="hover">
        <el-button @click="addTestApplication()"  type="primary" plain > 新建应用 </el-button>
        <!--<el-button @click="updateUserInfo()"  type="primary" plain > 更新用户 </el-button>-->
        <el-table
          ref="multipleTable"
          :data="testApplicationList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="应用ID" prop="id" />
          <el-table-column label="应用名称" prop="applicationName"  />
          <el-table-column label="应用类型" prop="applicationType"/>

          <el-table-column label="关联域名" prop="applicationHostname"/>
          <el-table-column label="组织结构" prop="ehrGroup"  />
          <el-table-column label="更新人" prop="updateUserStr" />
          <el-table-column label="更新时间" prop="updateTime"  />
          <el-table-column label="操作" prop="id">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <li class="el-icon-edit icon" @click="editTestApplication(scope.row.id)" ></li>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <i class="el-icon-delete icon" @click="deleteTestApplicationById(scope.row.id)"></i>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="关联应用模块" placement="top-start">
                <i class="el-icon-circle-plus-outline icon" @click="handleAssociateModule(scope.row)"></i>
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
          <SaveOrUpdateTestApplicationDialog ref="SaveOrUpdateTestApplicationDialog" @querytestApplicationList="querytestApplicationList"></SaveOrUpdateTestApplicationDialog>
          <!-- <ApplicationMoudleDialog ref="ApplicationMoudleDialog"></ApplicationMoudleDialog> -->
        </div>
      </el-card>
    </el-card>
    </div>
</template>
<script>
import TEST_APPLICATION_CONFIG from '@/config/testApplication.config.js'
import { mapGetters } from 'vuex'
import { queryTestApplicationByPage, queryTestApplicationDetailById, queryApplicationModuleTreeByApplicationId, deleteTestApplicationById } from '@/api/model/testApplication'
import { getBelongSystem, getEhrInfo } from '@/api/model/testCase'
import { queryTestApplicationTypeList } from '@/api/model/dataDictionary'
export default {
  name: 'TestApplication',
  components: {
    SaveOrUpdateTestApplicationDialog: () => import('./SaveOrUpdateTestApplicationDialog')
    // ApplicationMoudleDialog: () => import('./ApplicationMoudleDialog')
  },
  computed: {
    ...mapGetters(['userInfo']),
    cascaderConfig () {
      return {
        isToPerson: false, // true 细粒度到人 false 细粒度不到人
        multipleCheck: false
      }
    }
  },
  async mounted () {
    await this.querytestApplicationList(this.pagination)
    await this.getDepartOrg()
    await this.queryTestApplicationTypeList()
  },
  data: () => ({
    TEST_APPLICATION_CONFIG,
    testApplicationSearch: {
      applicationName: '',
      applicationType: '',
      applicationHostname: '',
      ehrTreePath: ''
    },
    applicationTypeDataDictionaryList: [],
    afterHandledeptOrgList: [],
    deptOrgList: [],
    belongToSystemList: [],
    testApplicationList: [],
    pagination: {
      total: 0,
      current: 1,
      size: 10
    },
    loading: false
  }),
  methods: {
    async querytestApplicationList () {
      const {
        ehrTreePath,
        createTimeVal,
        updateTimeVal
      } = this.testApplicationSearch
      const queryData = {
        page: {
          ...this.pagination
        },
        searchObj: {
          ...this.testApplicationSearch,
          ehrTreePath: ehrTreePath ? ehrTreePath.toString() : '',
          createTimeVal: createTimeVal ? createTimeVal.toString() : '',
          updateTimeVal: updateTimeVal ? updateTimeVal.toString() : ''
        }
      } // 根据接口要求处理请求参数
      const res = await queryTestApplicationByPage(queryData)
      const respData = res.data || []
      this.testApplicationList = respData.records
      this.pagination.total = respData.total
    },
    handleSelectionChange (val) {
      this.multipleSelectTestCase = val
    },
    handleCurrentChange (val) {
      // 分页
      this.pagination.current = val
      this.querytestApplicationList(this.testApplicationSearch)
    },
    async getBelongSystem (query) { // 所属系统
      const params = {
        belongToSystem: query
      }
      const res = await getBelongSystem(params)
      this.belongToSystemList = res.data
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          const res = this.getBelongSystem(query)
          this.belongToSystemList = res.data
        }, 200)
      } else {
        this.options = []
      }
    },
    handleRowClick (val) {
    },
    addTestApplication () {
      this.$refs.SaveOrUpdateTestApplicationDialog.testApplication = {}
      this.$refs.SaveOrUpdateTestApplicationDialog.dialogVisible = true
      this.$refs.SaveOrUpdateTestApplicationDialog.dialogTitle = '新建应用'
    },
    async editTestApplication (id) {
      const res = await queryTestApplicationDetailById({ id: id })
      const testApp = res.data
      const deptCodeArr = testApp.ehrTreePath.split(',')
      const deptCodeArray = deptCodeArr.splice(0, deptCodeArr.length)
      testApp.ehrTreePath = deptCodeArray
      this.$refs.SaveOrUpdateTestApplicationDialog.testApplication = testApp
      this.$refs.SaveOrUpdateTestApplicationDialog.dialogVisible = true
      this.$refs.SaveOrUpdateTestApplicationDialog.dialogTitle = '编辑应用'
    },
    async handleAssociateModule (data) {
      await queryApplicationModuleTreeByApplicationId({ applicationId: data.id }).then((res) => {
        const applicationModuleTreeList = res.data
        data.applicationModuleTreeList = applicationModuleTreeList
        this.$refs.ApplicationMoudleDialog.testApplication = data
        this.$refs.ApplicationMoudleDialog.dialogVisible = true
        this.$refs.ApplicationMoudleDialog.dialogTitle = '关联模块'
      })
    },
    async deleteTestApplicationById (id) {
      await this.$confirm('确定要删除此应用吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTestApplicationById({ id: id }).then(() => {
          this.querytestApplicationList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async getDepartOrg () { // 获取组织结构
      const res = await getEhrInfo()
      const childDept = res.data || []
      this.deptOrgList = childDept.childDept
      this.handleDeartOrg()
    },
    handleDeartOrg () {
      this.afterHandledeptOrgList = this.flattenNotToPersonChild(this.deptOrgList)
    },
    flattenNotToPersonChild (options) { // 不到人
      const that = this
      const deptOptions = []
      options.forEach(item => {
        if (!item.last && item.childDept) {
          deptOptions.push({
            label: item.deptName,
            value: item.deptCode,
            children: (function () {
              return that.flattenNotToPersonChild(item.childDept)
            })()
          })
        } else if (item.last && item.childDept) {
          deptOptions.push({
            label: item.deptName,
            value: item.deptCode
          })
        } else {
          return false
        }
      })
      return deptOptions
    },
    submitForm () {
      this.querytestApplicationList(this.testApplicationSearch)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    async queryTestApplicationTypeList () {
      const res = await queryTestApplicationTypeList()
      this.applicationTypeDataDictionaryList = res.data
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
.el-icon-circle-plus-outline {
  background: #1b58f8;
}
.pagination {
  margin: 20px 10px 30px 0px;
  float: right;
}
</style>
<style lang="scss">
  .search-button{
    display: flex;
    justify-content: flex-end;
  }
  .test-application {
  .el-select,
  .el-input__inner {
    width: 100%;
  }
  .el-cascader,
  .el-input__inner {
    width: 100%;
  }
  }
</style>
