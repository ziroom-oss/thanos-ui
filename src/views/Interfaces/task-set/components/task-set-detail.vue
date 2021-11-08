<template>
    <el-dialog
            title="单接口任务集合详情"
            :visible.sync="mockApiDetailForm"
            width="60%"
            @close="closeMockApiDetailForm"
    >
        <el-table :data="mockApiDetailTbl"
                  stripe
                  fit
                  border
                  highlight-current-row
                  style="width: 100%;font-size: 13px"
                  max-height="460"
        >
            <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
            <el-table-column label="请求方式" align="center" width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.requestType}}</span>
                </template>
            </el-table-column>
            <el-table-column label="接口名称" align="center" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.apiName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="接口URI" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.requestUri}}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否Mock" align="center" width="100">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isMock === 0" type="warning" size="mini">非Mock接口</el-tag>
                    <el-tag v-else type="success" size="mini">Mock接口</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="Mock开关" align="center" width="100">
                <template slot="header" slot-scope="slot">
                    <span>Mock开关</span>
                    <el-tooltip class="tooltip" effect="light" content="非Mock接口不支持启用开关" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </template>
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mockStatus" :active-value="1" :inactive-value="0"
                               active-color="#13ce66" :disabled="scope.row.isMock !== 1"
                               @change="changeCaseMockStatus(scope.row.id, scope.row.caseId, scope.row.mockStatus)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="最后修改人" align="center" width="110">
                <template slot-scope="scope">
                    <span>{{scope.row.updateUserName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="最后修改时间" align="center" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.updateTime}}</span>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
import { changeCaseMockStatus } from '@/api/model/taskSet'

export default {
  name: 'task-set-detail',
  filters: {
    mockFilter (status) {
      return status === 1
    }
  },
  props: {
    mockApiDetailTblProp: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      mockApiDetailForm: false,
      mockApiDetailTbl: this.mockApiDetailTblProp
    }
  },
  methods: {
    closeMockApiDetailForm () {
      this.mockApiDetailForm = false
    },
    changeCaseMockStatus (detailId, caseId, mockStatus) {
      const postData = new URLSearchParams()
      postData.append('detailId', detailId)
      postData.append('caseId', caseId)
      postData.append('mockStatus', mockStatus ? '1' : '0')

      changeCaseMockStatus(postData).then(response => {
        if (response.success) {
          this.$message({
            type: 'success',
            message: mockStatus ? '接口应用Mock开关已打开' : '接口应用Mock开关已关闭'
          })
        }
      })
    }
  },
  watch: {
    mockApiDetailTblProp: {
      handler (val) {
        this.mockApiDetailTbl = val
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
