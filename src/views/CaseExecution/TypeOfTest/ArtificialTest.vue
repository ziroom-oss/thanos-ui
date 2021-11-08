<template>
  <div>
    <el-card>
      <el-table
        :data="tableData"
        height="450"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
          <el-table-column
            type="selection"
            width="60"
          />
          <el-table-column
            v-if="artificialOrApi === '1'"
            label="用例名称"
            prop="casename"
            width="300"
          />
          <el-table-column
            v-if="artificialOrApi === '1'"
            label="测试用例等级"
            prop="testCaseLevelStr"
            width="190"
          >
          </el-table-column>
          <el-table-column
            v-if="artificialOrApi === '1'"
            label="对应jira ID"
            prop="relationRequirement"
            width="190"
          >
          </el-table-column>
          <el-table-column
            v-if="artificialOrApi === '1'"
            label="所属应用"
            prop="belongToSystemStr"
            width="190"
          >
          </el-table-column>
          <el-table-column
            v-if="artificialOrApi === '1'"
            label="所属模块"
            prop="belongToModuleStr"
            width="190"
          >
          </el-table-column>
          <el-table-column
            v-if="artificialOrApi === '1'"
            label="创建人"
            prop="createUserStr"
            width="130"
          >
          </el-table-column>
        <el-table-column
          v-if="artificialOrApi === '1'"
          label="创建时间"
          prop="createTime"
          width="180"
        >
        </el-table-column>
        <el-table-column
          v-if="artificialOrApi === '2'"
          label="用例名称"
          prop="caseName"
          width="210"
        />
        <el-table-column
          v-if="artificialOrApi === '2'"
          label="应用名"
          prop="applicationName"
          width="120"
        />
        <el-table-column
          v-if="artificialOrApi === '2'"
          label="请求URI"
          prop="requestUri"
          width="250"
        />
        <el-table-column
          v-if="artificialOrApi === '2'"
          label="请求类型"
          prop="requestType"
          width="100"
        />
        <el-table-column
          v-if="artificialOrApi === '2'"
          label="请求参数Param"
          prop="requestParam"
          width="300"
          :show-overflow-tooltip=true
        />
        <el-table-column
          v-if="artificialOrApi === '2'"
          label="请求参数Body"
          prop="requestBody"
          width="300"
          :show-overflow-tooltip=true
        />
        <el-table-column
          v-if="artificialOrApi === '2'"
          label="维护人"
          prop="updateUserCode"
          width="100"
        />
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArtificialTest',
  props: {
    artificialOrApi: String
  },
  data: () => ({
    tableData: [],
    taskTestCaseIdList: []
  }),
  methods: {
    handleSelectionChange (val) { // 提交
      this.taskTestCaseIdList = val.map(item => item.id)
    }
  }
}
</script>

<style>
.el-tooltip__popper {
  max-width: 500px;
}
</style>
