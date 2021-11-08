<template>
  <el-card>
    <el-table
      :data="rowData.singleApiCaseList"
      v-loading="tableLoading"
      style="width: 100%"
      @select="selectCaseList"
      @select-all="selectCaseList"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="用例id" prop="id" align="center" />
      <el-table-column label="用例名称" prop="caseName" align="center">
        <template slot-scope="scope">
          {{ scope.row.caseName || "暂无名称" }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="!scope.row.runnable ? 'danger' : ''">
            {{ scope.row.runnable ? "可运行" : "不可运行" }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="参数详情" align="center">
        <template slot-scope="scope">
          <span
            :class="{ 'link-type': scope.row.requestParam }"
            @click="handleParamDeatil(scope.row)"
            >{{ scope.row.requestParam || "暂无参数" }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="运行时间"
        width="180"
        prop="updateTime"
        align="center"
      />
      <el-table-column
        label="用例描述"
        width="180"
        prop="comment"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.comment || "暂无描述" }}
        </template>
      </el-table-column>
      <el-table-column label="维护人" width="180" prop="createUserCode" />
      <el-table-column label="操作" width="210" align="center">
        <template slot-scope="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleEditCase(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="复制" placement="top">
            <el-button
              type="primary"
              icon="el-icon-document-copy"
              @click="handleCopyCase(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="历史报告" placement="top">
            <el-button
              type="primary"
              icon="el-icon-data-analysis"
              @click="handleHistoryCase(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDelectCase(scope.row.id)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <dialog-param-detail
      :paramDetailVisible="paramDetailVisible"
      :paramRowData="paramRowData"
      @closeDialog="closeDialogParam"
      @updateForm="updateForm"
    />
  </el-card>
</template>

<script>
import dialogParamDetail from './dialogParamDetail.vue'
import { parseJson, deleteCase } from '@/api/model/singleApiList'
export default {
  components: { dialogParamDetail },
  name: 'caseList',
  props: {
    rowData: {
      type: Object,
      default () {
        return {}
      }
    },
    rowIndex: {
      type: Number
    }
  },
  data () {
    return {
      tableLoading: false,
      caseFormShow: false, // 用例对话框展示
      paramDetailVisible: false, // 参数详情对话框
      dialogformTitle: '', // 用例对话框标题
      paramRowData: {}
    }
  },
  methods: {
    selectCaseList (row) {
      console.log(row)
      this.$emit('selectCaseList', {
        data: row,
        index: this.rowIndex
      })
    },
    handleEditCase (row) {
      this.$router.push({
        name: 'AddCase',
        params: { caseForm: row, apiData: this.rowData, type: 'EDIT' }
      })
    },
    handleCopyCase (row) {
      this.$router.push({
        name: 'AddCase',
        params: { caseForm: row, apiData: this.rowData, type: 'COPY' }
      })
    },
    // 历史报告
    handleHistoryCase (row) {
      console.log(row)
      if (!row.recordResult) {
        this.$message({
          message: '该用例是【未执行】状态,无报告信息！',
          type: 'error'
        })
        return
      }

      const { href } = this.$router.resolve({
        path: '/interfaces/singleApi/single-api-case-history-report',
        query: {
          caseIds: row.id
        }
      })

      window.open(href, '_blank')
    },
    // 删除测试用例
    handleDelectCase (id) {
      this.$confirm('此操作将永久删除该用例, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteCase({ id })
        if (res.success) {
          this.$message.success('删除成功')
          this.$emit('updateListTable')
        }
      })
    },
    closeCaseFormShow () {
      this.dialogformTitle = ''
      this.caseFormShow = false
    },
    // 打开参数详情
    handleParamDeatil (row) {
      if (row.requestParam) {
        this.paramDetailVisible = true
        this.paramRowData = row
      }
    },
    handleParam (row) {
      if (row.requestParam) {
        if (
          !this.isJSON(row.requestParam) &&
          row.requestParam.indexOf('=') !== -1
        ) {
          // 调用接口转为table
          this.jsonRowShow = false
          this.getFormatList(row.requestParam)
        } else if (this.isJSON(row.requestParam)) {
          const json = JSON.parse(row.requestParam)
          this.inParamData = JSON.stringify(json, null, '\t')
        } else {
          this.inParamData = row.inParam
        }
      } else {
        this.inParamData = row.inParam
      }
      this.paramFormatTableShow = true
      this.formatParamId = row.id
    },
    isJSON (str) {
      if (typeof str === 'string') {
        try {
          var obj = JSON.parse(str)
          return !!(typeof obj === 'object' && obj)
        } catch (e) {
          return false
        }
      }
    },
    // 参数格式化-----获取param
    async getFormatList (param) {
      // this.formatData = [{"key": "login", "value": "123"}, {"key": "userName", "value": "zhangw"}]
      const obj = { paramterStr: param }
      const params = new URLSearchParams()
      for (const item in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, item)) {
          params.append(item, obj[item])
        }
      }
      await parseJson(params).then((response) => {
        if (response.success) {
          this.inParamTableData = JSON.parse(response.data)
        }
      })
    },
    closeDialogParam () {
      this.paramDetailVisible = false
    },
    updateForm () {
      this.closeDialogParam()
      this.$emit('updateListTable')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.el-button + .el-button {
  margin-left: 2px;
}
.link-type {
  @include new-line;
}
</style>
