<template>
  <div class="tree-content">
    <el-tree
      :data="data"
      class="el-scrollbar"
      :indent="indent"
      node-key="value"
      highlight-current
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent"
      :default-expanded-keys="showArray"
    >
    </el-tree>
  </div>
</template>
<script>
export default {
  name: 'databaseTree',
  props: {
    nodeDetails: {
      type: Object,
      default () {
        return {}
      }
    },
    data: {
      required: true,
      type: Array
    },
    pageType: {
      type: String,
      default () {
        return 'databaseSql'
      }
    }
  },
  data () {
    return {
      indent: 20,
      showArray: []
    }
  },
  methods: {
    renderContent (h, { node, data }) {
      const _this = this
      function handleEdit (nodeDetail, nodeData) {
        _this.$emit('changeFormDialogShow', true)
      }

      function checkMoreIcon () {
        return (
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more-outline treeIcon"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item nativeOnClick={() => handleEdit(node, data)}>编辑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        )
      }

      return (
        <div class="custom-tree-node" on-click={() => handleClick(node, data)}>
          {node.level === 1 && <i class="el-icon-coin icon-folder"></i>}
          <span class="node-label" style="width: 180px">{node.label}</span>
          {node.level === 1 && this.pageType === 'databaseSql' && checkMoreIcon(node, data)}
        </div>
      )
    }
  }
}
</script>
<style scoped lang="scss">
.tree-content {
  height: 100%;
  .el-scrollbar {
    overflow: scroll;
  }
}
</style>
