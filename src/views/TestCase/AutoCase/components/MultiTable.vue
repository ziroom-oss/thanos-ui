<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    class="content-textarea"
  >
    <el-tab-pane
      v-for="(item, index) in runSqlResult"
      :key="index.toString()"
      :label="'结果' + (index + 1)"
      :name="item.index"
    >
      <el-input
        v-if="item.sqlType === 'write'"
        type="textarea"
        :autosize="{
          minRows: 6,
          maxRows: 16,
        }"
        class="write-empty"
        v-model="item.data"
      >
      </el-input>
      <vxe-grid
        v-else
        border
        resizable
        ref="xGrid"
        :height="tableHeght"
        highlight-hover-row
        :tree-config="{lazy: true, children: 'children', hasChild: 'hasChild', loadMethod: loadChildrenMethod}"
        :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
        :columns="columns"
        :data="JSON.parse(item.data)"
        show-overflow="tooltip"
        show-header-overflow="tooltip"
        :loading="tableLoading"
      />
    </el-tab-pane>
  </el-tabs>
</template>
<script>

export default {
  name: 'MultiTable',
  props: {
    runSqlResult: {
      type: Array,
      default () {
        return []
      }
    },
    tableLoading: {
      type: Boolean,
      default () {
        return false
      }
    },
    tableHeght: {
      type: String,
      default () {
        return '250'
      }
    },
    hasSerialNumber: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  watch: {
    runSqlResult() {
      this.editableTabsValue = '0'
    }
  },
  data () {
    return {
      editableTabsValue: '0'
    }
  },
  components: { },
  computed: {
    runSqlResultColumns () {
      let columns = {}

      this.runSqlResult.forEach((item, index) => {
        if (item.sqlType === 'read') {
          const head = { type: 'seq', width: 50, fixed: 'left' }
          let tableData = [];

          try {
            tableData = JSON.parse(item.data)
          } catch {}
          
          columns = {
            ...columns,
            [index]: Array.isArray(tableData) && tableData.length > 0 ? Object.keys(tableData[0]).map((key) => ({
              title: key,
              width: 100,
              field: key,
              showOverflow: true
            })) : []
          }

          if (this.hasSerialNumber) {
            columns[index].unshift(head)
          }
        }
      })
      return columns
    },
    columns () {
      return this.runSqlResultColumns[this.editableTabsValue]
    }
  },
  methods: {
    loadChildrenMethod () {

    }
  }
}
</script>
<style lang="scss">

</style>
<style scoped lang="scss">
.content-textarea {
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
}

</style>
<style scoped>

</style>
