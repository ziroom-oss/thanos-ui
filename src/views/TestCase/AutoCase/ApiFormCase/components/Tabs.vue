<template>
  <div class="main_content">
    <ul class="main_tabs">

      <li
        :class="['tabs_info', item === current && 'active']"
        v-for="item of tabsList"
        :key="item.name"
        @click="handleChangeTab(item)"
      >
        <el-badge :value="item.badge" class="item" type="primary" v-if="item.badge">
          <span>{{ item.name }}</span>
        </el-badge>
        <span v-else>{{ item.name }}</span>
      </li>
    </ul>
    <el-button v-if="selectTab.name === 'Pre-request SQL' && preSql" class="config_btn" type="primary" @click="queryDatabaseList">
      预览
    </el-button>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { queryDatabaseList } from '@/api/model/testCase'

export default {
  name: 'Tabs',
  props: {
    tabsList: {
      type: Array,
      default () {
        return []
      }
    },
    current: {
      type: Object,
      default () {
        return {}
      }
    },
    apiFormData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters({
      BodyValue: 'bodyCount',
      HeadersValue: 'headersCount',
      ParamsValue: 'paramsCount'
    }),
    ...mapState({
      selectTab: (state) => state.cases.selectTab,
      preSql: (state) => state.cases.caseForm.preSql,
      sqlList: (state) => {
        return state.cases.caseForm.preSql ? state.cases.caseForm.preSql.split(';').filter(item => item) : ''
      }
    })
  },
  methods: {
    ...mapActions(['apiSqlInfo']),
    async queryDatabaseList () {
      const params = {
        applicationName: this.apiFormData.applicationName,
        env: 'qua'
      }
      const res = await queryDatabaseList(params)
      if (res.data && res.data.length > 0) {
        this.runSqlInfo(res.data[0].id)
        this.$emit('resetHeight', '300');
      } else {
        this.$message({
          message: '请先绑定数据库，再进行预览！',
          type: 'error'
        })
      }
    },
    runSqlInfo (id) {
      const params = {
        databaseId: id,
        sqlList: this.sqlList
      }

      if (params.sqlList === '' && this.selectTab.name === 'Pre-request SQL') {
        this.$message({
          message: '请输入SQL语句',
          type: 'warning'
        })
        return false
      }
      this.apiSqlInfo(params)
    },
    handleChangeTab (item) {
      this.$emit('changeTab', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.main_content {
  display: flex;
  justify-content: space-between;
  .main_tabs {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    .tabs_info {
      padding: 4px 10px;
      color: #8d8d8d;
      border-radius: 2px;
      font-size: 18px;
      &.active {
        background-color: #f0f0f0;
        color: #000;
        border-bottom: 2px solid #409EFF;
      }
    }
  }
}
</style>
<style lang="scss">
.main_tabs {
  .el-badge__content--primary {
    background-color: #fff;
  }
  .el-badge__content {
    color: #8D8d8d;
    border: 1px solid #ccc;
  }
}
</style>
