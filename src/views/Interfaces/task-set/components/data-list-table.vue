<template>
    <div>
        <el-table :data="taskSetList"
                  ref="multipleTable"
                  highlight-current-row
                  style="width: 100%;overflow-y: scroll"
                  height="480"
        >
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
            <el-table-column label="任务集合名称" align="center">
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" @click="getTaskSetDetail(scope.row.id)">
                        {{scope.row.name}}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column label="项目名称" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.omegaName === ''">-</span>
                    <span v-else>{{scope.row.omegaName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="任务集合类型" align="center" width="160">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.type | statusFilter">{{scope.row.type | filter}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="创建人" align="center" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.userName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="最后修改人" align="center" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.updateUserName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="最后修改时间" align="center" width="160">
                <template slot-scope="scope">
                    <span>{{scope.row.updateTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="220">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit"
                               @click="editTaskSet(scope.row.id)">
                        编辑
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-document"
                               @click="getLatestReport(scope.row.id)">
                        报告
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
                v-show="pageInfo.total > 0"
                :total="pageInfo.total"
                :page.sync="pageInfo.pageNum"
                :limit.sync="pageInfo.pageSize"
                @pagination="getDataList"
        >
        </pagination>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'

export default {
  name: 'data-list-table',
  components: { Pagination },
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: 'default',
        1: 'warning',
        2: 'success'
      }
      return statusMap[status]
    },
    filter (status) {
      const statusMap = {
        0: '自定义测试集合',
        1: '冒烟测试集合',
        2: '回归测试集合'
      }
      return statusMap[status]
    }
  },
  props: {
    taskSetListProp: {
      type: Array,
      default: () => {
        return []
      }
    },
    pageInfoProp: {
      type: Object,
      default: () => {
        return {
          total: 0,
          pageNum: 1,
          pageSize: 10
        }
      }
    }
  },
  data () {
    return {
      taskSetList: this.taskSetListProp,
      pageInfo: this.pageInfoProp
    }
  },
  methods: {
    getDataList () {
      this.$emit('getDataListEv')
    },
    getTaskSetDetail (setId) {
      this.$emit('getTaskSetDetailEv', setId)
    },
    editTaskSet (setId) {
      this.$emit('editTaskSetEv', setId)
    },
    getLatestReport (setId) {
      this.$emit('getLatestReportEv', setId)
    }
  },
  watch: {
    taskSetListProp: {
      handler (val) {
        this.taskSetList = val
      },
      deep: true
    },
    pageInfoProp: {
      handler (val) {
        this.pageInfo = val
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
