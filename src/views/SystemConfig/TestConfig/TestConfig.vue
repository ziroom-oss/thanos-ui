<template>
  <div class="test-config">
    <el-card style="margin-bottom: 20px" shadow="hover">
      <h1>用例属性</h1>
      <el-row :gutter="24" style="margin-bottom: 10px;margin-top: 20px">
        <el-col :span="6">
          <el-input v-model="configLable" placeholder="搜索用例属性" size="small" @keyup.enter.native="search()" ></el-input>
        </el-col>
      </el-row>
      <el-card style="margin-bottom: 20px" shadow="hover">
        <el-button @click="addTestConfig()"  type="primary" > 新建应用 </el-button>
        <el-table
          ref="multipleTable"
          :data="testConfigList"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
          :stripe="true"
        >
          <el-table-column prop="lable" label="属性名称">
            <template slot-scope="scope">
              <span>{{ scope.row.lable}}</span>
              <el-tag size="mini" v-if="scope.row.systemConfig == true" plain circle>系统</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="fieldTypeLable" label="属性类型">
          </el-table-column>
          <el-table-column label="操作" prop="id">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.systemConfig === false" class="item" effect="dark" content="编辑" placement="top-start">
                <i class="el-icon-edit icon" @click="editTestConfig(scope.row.id)" ></i>
              </el-tooltip>
              <el-tooltip v-if="scope.row.systemConfig === false" class="item" effect="dark" content="刪除" placement="top-start">
                <i class="el-icon-delete icon" @click="deleteTestConfig(scope.row)" ></i>
              </el-tooltip>
              <span v-else>——</span>
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
          <SaveOrUpdateTestConfigDialog ref="SaveOrUpdateTestConfigDialog" @queryTestConfigList="queryTestConfigList"></SaveOrUpdateTestConfigDialog>
        </div>
      </el-card>
    </el-card>
  </div>
</template>
<script>
import { queryTestConfigByPage, queryTestConfigById, deleteTestConfigById } from '@/api/model/testConfig'

export default {
  name: 'testConfig',
  async mounted () {
    await this.queryTestConfigList(this.pagination)
  },
  components: {
    SaveOrUpdateTestConfigDialog: () => import('./SaveOrUpdateTestConfigDialog')
  },
  watch: {
    configLable: function (value) {
      this.configLable = value
    }
  },
  data: () => ({
    configLable: '',
    testConfigSearch: {
      lable: ''
    },
    testConfigList: [],
    pagination: {
      total: 0,
      current: 1,
      size: 10
    },
    loading: false
  }),
  methods: {
    async queryTestConfigList () {
      const queryData = {
        page: {
          ...this.pagination
        },
        searchObj: {
          ...this.testConfigSearch
        }
      }
      const res = await queryTestConfigByPage(queryData)
      const resultData = res.data
      this.testConfigList = resultData.records || []
      this.pagination.total = resultData.total
    },
    handleSelectionChange (val) {
      this.multipleSelectTestCase = val
    },
    handleCurrentChange (val) {
      // 分页
      this.pagination.current = val
      this.queryTestConfigList(this.testConfigSearch)
    },
    handleRowClick () {
      console.log('handleRowClick')
    },
    addTestConfig () {
      this.$refs.SaveOrUpdateTestConfigDialog.dialogVisible = true
      this.$refs.SaveOrUpdateTestConfigDialog.dialogTitle = '新建用例属性'
    },
    async editTestConfig (id) {
      const res = await queryTestConfigById({ id: id })
      const testConfig = res.data
      this.$refs.SaveOrUpdateTestConfigDialog.dialogVisible = true
      this.$refs.SaveOrUpdateTestConfigDialog.dialogTitle = '编辑用例属性'
      this.$refs.SaveOrUpdateTestConfigDialog.testConfig = testConfig
      this.$refs.SaveOrUpdateTestConfigDialog.editFieldTypeStatus = true
      if (testConfig.testConfigOptionsList != null) {
        const optionsValList = testConfig.testConfigOptionsList.map(options => options.optionVal)
        this.$refs.SaveOrUpdateTestConfigDialog.optionsValList = optionsValList
      }
    },
    async search () {
      this.testConfigSearch.lable = this.configLable
      await this.queryTestConfigList(this.testConfigSettingSearch)
    },
    async deleteTestConfig (testConfig) {
      this.$confirm('当前正在删除用例属性「' + testConfig.lable + '」,此操作不可撤销，是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = { id: testConfig.id }
        const res = await deleteTestConfigById(params)
        const result = res.success
        if (result) {
          this.queryTestConfigList(this.testConfigSearch)
          this.$notify({
            type: 'success',
            message: '删除成功'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .search-button{
    display: flex;
    justify-content: flex-end;
  }
  .test-config-setting {
    .el-select,
    .el-input__inner {
      width: 100%;
    }
    .el-cascader,
    .el-input__inner {
      width: 100%;
    }
  }
 .el-icon-delete{
   margin-left: 20px;
 }
</style>
