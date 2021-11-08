<template>
    <el-dialog v-el-drag-dialog :visible.sync="visible" :title="title" @dragDialog="dragEv" @close="closeEv">
        <el-table :data="tableData">
            <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
            <el-table-column label="集合名称" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.setName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="运行环境" align="center" width="100">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.env | statusFilter" size="mini">{{scope.row.env | envFilter}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="运行用户" align="center" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.userName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="运行时间" align="center" width="160">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="110">
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" @click="getReportDetailByVersion(
                    scope.row.setId, scope.row.createUserCode, scope.row.setVersion)">详情
                    </el-link>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import { getTaskSetTypeBySetId } from '@/api/model/taskSet'

export default {
  name: 'history-report',
  directives: { elDragDialog },
  filters: {
    envFilter (env) {
      const envMap = {
        t: '测试环境',
        q: '准生产环境',
        kt: '日常环境'
      }
      return envMap[env]
    },
    statusFilter (env) {
      const envMap = {
        t: 'default',
        q: 'warning',
        kt: 'success'
      }
      return envMap[env]
    }
  },
  props: {
    visibleProp: {
      type: Boolean,
      default: false
    },
    titleProp: {
      type: String,
      default: '接口任务集合近5次历史报告'
    },
    tableDataProp: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      visible: this.visibleProp,
      title: this.titleProp,
      tableData: this.tableDataProp
    }
  },
  methods: {
    dragEv () {

    },
    closeEv () {
      this.$emit('closeEv')
    },
    getReportDetailByVersion (setId, userCode, setVersion) {
      getTaskSetTypeBySetId({ setId: setId }).then(response => {
        if (response.success) {
          const { href } = this.$router.resolve({
            path: response.data > 0 ? '/interfaces/task-set/components/multi-task-set-report' : '/interfaces/task-set/components/task-set-report',
            query: { setId: setId, userCode: userCode, version: setVersion }
          })
          window.open(href, '_blank')
        }
      })
    }
  },
  watch: {
    visibleProp (val) {
      this.visible = val
    },
    titleProp (val) {
      this.title = val
    },
    tableDataProp: {
      handler (val) {
        this.tableData = val
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
