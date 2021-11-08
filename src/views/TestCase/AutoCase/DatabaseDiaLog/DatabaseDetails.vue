<template>
  <div class="detail">
    <el-row class="top-button">
      <el-button
        @click="runSqlInfo"
        type="primary"
      >运行
      </el-button>
    </el-row>
    <el-row class="content-search">
      <Codemirror ref="sqleditor"
        :value="basicInfoForm.sqlTextarea"
        @changeTextarea="changeTextarea($event)"
      />
    </el-row>
    <div class="emptyResult" v-if="runSqlResult.length === 0">
      <span
        >暂无返回结果，请点击运行！
      </span>
    </div>
    <template v-else>
      <el-row>
        <MultiTable
          hasSerialNumber
          :runSqlResult="runSqlResult"
          :tableLoading="tableLoading"
        />
      </el-row>
    </template>
  </div>
</template>
<script>
import { execSQLList } from '@/api/model/testCase'
import Codemirror from '@/components/Codemirror'
import MultiTable from '../components/MultiTable'

export default {
  name: 'DatabaseDetails',
  props: {
    nodeDetails: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      basicInfoForm: {
        sqlTextarea: ''
      },
      runSqlResult: [],
      tableLoading: false
    }
  },
  components: {
    MultiTable,
    Codemirror
  },
  methods: {
    changeTextarea (val) {
      this.$set(this.basicInfoForm, 'sqlTextarea', val)
    },
    runSqlInfo () {
      const params = {
        databaseId: this.nodeDetails.id,
        sqlList: this.basicInfoForm.sqlTextarea.split(';').filter(item => item)
      }

      if (params.sql === '') {
        this.$message({
          message: '请输入SQL语句',
          type: 'warning'
        })
        return false
      }
      this.tableLoading = true
      execSQLList(params).then(response => {
        this.runSqlResult = response.data
        this.tableLoading = false
      })
    }
  }
}
</script>
<style scoped lang="scss">
.detail {
  height: 100%;
  .top-button {
    text-align: right;
  }
  .content-search {
    height: 200px;
    margin: 10px 0;
  }
  .emptyResult {
    height: 300px;
    line-height: 300px;
    text-align: center;
    border: 1px solid #EBEEF5;
  }
  .write-empty {
    padding: 10px 0;
  }
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
}

</style>
<style scoped>

</style>
