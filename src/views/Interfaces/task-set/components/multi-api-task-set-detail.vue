<template>
    <el-dialog
            title="多接口任务集合详情"
            :visible.sync="multiApiDetailForm"
            width="60%"
            @close="closeMultiApiDetailForm"
    >
        <el-table :data="multiApiDetailTbl"
                  stripe
                  fit
                  border
                  highlight-current-row
                  style="width: 100%;font-size: 13px"
                  max-height="460"
        >
            <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
            <el-table-column label="用例ID" align="center" width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column label="业务线名称" align="center" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.businessName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="用例名称" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.caseName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户姓名" align="center" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.userName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" width="160">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime}}</span>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
export default {
  name: 'multi-api-task-set-detail',
  props: {
    multiApiDetailTblProp: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      multiApiDetailForm: false,
      multiApiDetailTbl: this.multiApiDetailTblProp
    }
  },
  methods: {
    closeMultiApiDetailForm () {
      this.multiApiDetailForm = false
    }
  },
  watch: {
    multiApiDetailTblProp: {
      handler (val) {
        this.multiApiDetailTbl = val
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
