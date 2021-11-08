<template>
  <div class="test-config-setting">
    <el-card style="margin-bottom: 20px" shadow="hover">
      <el-table
        ref="multipleTable"
        :data="testConfigSettingList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
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
    </el-card>
  </div>
</template>
<script>
import { queryTestConfigSettingByPage } from '@/api/model/testConfigSetting'

export default {
  name: 'testConfigSetting',
  async mounted () {
    await this.queryTestConfigSettingList(this.pagination)
  },
  data: () => ({
    testConfigSettingSearch: {},
    testConfigSettingList: [],
    pagination: {
      total: 0,
      current: 1,
      size: 10
    },
    loading: false
  }),
  methods: {
    async queryTestConfigSettingList () {
      const queryData = {
        page: {
          ...this.pagination
        },
        searchObj: {
          ...this.testConfigSettingSearch
        }
      }
      const res = await queryTestConfigSettingByPage(queryData)
      const resultData = res.data || []
      this.testConfigSettingList = resultData.records
      this.pagination.total = resultData.total
    },
    handleSelectionChange (val) {
      this.multipleSelectTestCase = val
    },
    handleCurrentChange (val) {
      // 分页
      this.pagination.current = val
      this.queryTestConfigSettingList(this.testConfigSettingSearch)
    },
    handleRowClick () {
      console.log('handleRowClick')
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
</style>
