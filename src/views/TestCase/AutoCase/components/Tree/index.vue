<template>
  <div class="tree-content" v-bind="$props">
    <div class="icon-wrap">
      <h2 class="module">所有模块</h2>
      <el-dropdown>
        <span class="el-dropdown-link">
          <i class="el-icon-question"></i>
          帮助
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <a
              href="https://ziroom.feishu.cn/docs/doccn0ESlWjCyg2SAeMh6VSbuNd"
              target="_blank"
              >帮助文档</a
            >
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-input
      placeholder="请输入关键字查询"
      clearable
      size="mini"
      v-model="filterText"
      style="margin-top: 5px"
      @keyup.enter.native="enter"
    >
    </el-input>
    <el-tabs type="card" v-model="activeName" @tab-click="myKeep">
      <el-tab-pane label="全部应用" name="allApp">
        <el-tree
          class="main-tree"
          :data="treeData"
          ref="tree"
          :indent="20"
          node-key="id"
          highlight-current
          :expand-on-click-node="expandNode"
          :props="$props.defaultProps"
          :render-content="renderContent"
          :default-expanded-keys="defaultTreeArr"
          :filter-node-method="filterNode"
        >
        </el-tree>
      </el-tab-pane>
      <el-tab-pane label="我的收藏" name="myApp">
        <el-tree
          class="main-tree"
          ref="treeMy"
          :data="followList"
          :indent="20"
          node-key="id"
          highlight-current
          :expand-on-click-node="expandNode"
          :props="$props.defaultProps"
          :filter-node-method="filterNode"
          :render-content="renderContent"
        >
        </el-tree>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import eventBus from '@/utils/eventBus'
import {
  followApplication,
  unFollowApplication
} from '@/api/model/singleApiSave'

export default {
  name: 'Tree',
  props: {
    defaultProps: {
      required: true,
      type: Object
    },
    treeData: {
      type: Array,
      require: true,
      default () {
        return []
      }
    },
    treePath: {
      type: Number,
      default: 1
    },
    defaultTreeArr: {
      type: Array,
      default () {
        return []
      }
    }
  },
  watch: {
    filterText (value) {
      this.filterTree(value)
    },
    treeData: {
      handler (arr) {
        if (Array.isArray(arr)) {
          const follow = []
          for (const item of arr) {
            if (item.follow) {
              follow.push(item)
            }
          }
          this.followList = follow
          // 首次进入，收藏有数据跳转
          if (this.followList.length > 0 && !this.flag) {
            this.flag = true
            this.activeName = 'myApp'
          }
        }
      }
    }
  },
  computed: {
    cascaderConfig () {
      return {
        isToPerson: false, // true 细粒度到人 false 细粒度不到人
        multipleCheck: false
      }
    }
  },
  filters: {
    treeFormat (obj) {
      return obj.map((item) => ({
        label: item.applicationName,
        id: item.id
      }))
    }
  },
  data () {
    return {
      filterText: '',
      dialogVisible: false,
      expandNode: true,
      activeName: 'allApp',
      type: '',
      tabsList: {},
      followList: [],
      flag: false // 是否首次进入页面
    }
  },
  methods: {
    // 过滤节点
    filterNode (value, data, node) {
      if (!value) {
        node.expanded = false
        return true
      }
      // return data.label.indexOf(value) !== -1
      return this.chooseNode(value, data, node)
    },
    // 回车过滤
    enter (e) {
      const { value } = e.target
      this.filterTree(value)
    },
    filterTree (value) {
      if (this.activeName === 'allApp') {
        this.$refs.tree.filter(value)
      } else {
        this.$refs.treeMy.filter(value)
      }
    },
    // 筛选节点
    chooseNode (value, data, node) {
      if (data.label.indexOf(value) !== -1) {
        return true
      }
      const level = node.level
      if (level === 1) {
        return false
      }
      // 先取得父節點
      let parentData = node.parent
      let index = 0
      while (index < level - 1) {
        if (parentData.data.label.indexOf(value) !== -1) {
          return true
        }
        parentData = parentData.parent
        index++
      }
      return false
    },
    // 点击左侧树查询条件| 渲染树
    renderContent (h, { node, data }) {
      const handleClick = (node) => {
        const { level } = node
        let applicationName = null
        let controllerName = null
        let requestUri = null
        switch (level) {
          case 1:
            applicationName = node.label
            this.$emit(
              'updateTagsList',
              data.children.map((item) => item.label)
            )
            break
          case 2: {
            applicationName = node.parent.label
            controllerName = node.label
            break
          }
          case 3: {
            applicationName = node.parent.parent.label
            controllerName = node.parent.label
            requestUri = node.label
            this.$emit('saveTreeApiData', data)
            break
          }
          default:
            applicationName = node.label
        }
        if (level > 1) {
          this.$emit('update:defaultTreeArr', [node?.key])
        }
        this.$emit('update:treePath', level)
        this.$emit('queryModuleList', {
          applicationName,
          controllerName,
          requestUri
        })
      }

      // 第一层，带icon
      const handleIcon = (node) => {
        const { level } = node
        if (level === 1) {
          return <i class="el-icon-folder icon-folder"></i>
        }
      }

      const fileIcon = handleIcon(node, data)

      function handleKeep (node) {
        const {
          level,
          data: { follow }
        } = node

        // 为应用并且关注
        if (level === 1 && follow) {
          return <i class="el-icon-star-on keepOn"></i>
        } else if (level === 1 && !follow) {
          // 为应用并且不关注
          return <i class="el-icon-star-off keepOff"></i>
        }
      }

      // 收藏点击
      const keepClick = (node) => {
        const {
          data: { follow }
        } = node
        this.expandNode = false
        if (!follow) {
          // 关注
          this.handleKeep(data)
        } else {
          // 取消关注
          this.deleteKeep(data)
        }
      }
      const keepIcon = handleKeep(node, data)

      // 编辑接口,使用this.$emit无效
      const handleEdit = (node) => {
        const { level } = node
        const title = level === 3 ? '接口编辑' : '接口新增'
        eventBus.$emit('handleEditApi', { node, title, level })
      }

      const handleEditModule = (node) => {
        const { level } = node
        const title = '应用编辑'
        eventBus.$emit('handleEditApi', { node, title, level })
      }

      const handleEditDatabase = (data) => {
        eventBus.$emit('handleEditDatabase', data)
      }

      const onSwaggerUploadCase = (data) => {
        eventBus.$emit('onSwaggerUploadCase', true, data)
      }

      function checkMoreIcon (node, data) {
        const { level } = node
        return (
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more-outline treeIcon"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item nativeOnClick={() => handleEdit(node)}>
                {level === 3 ? '编辑' : '新增接口'}
              </el-dropdown-item>
              {level === 1 && (
                <el-dropdown-item nativeOnClick={() => handleEditModule(node)}>
                  编辑接口
                </el-dropdown-item>
              )}
              {level === 1 && (
                <el-dropdown-item nativeOnClick={() => handleEditDatabase(data)}>
                  数据库
                </el-dropdown-item>
              )}
              {level === 1 && (
                <el-dropdown-item nativeOnClick={() => onSwaggerUploadCase(data)}>
                  swagger导入
                </el-dropdown-item>
              )}
            </el-dropdown-menu>
          </el-dropdown>
        )
      }
      const moreIcon = checkMoreIcon(node, data)

      const treeIcon = async () => {
        this.expandNode = true
      }

      return (
        <div class="custom-tree-node" on-click={() => handleClick(node, data)}>
          {fileIcon}
          <span class="node-label">{node.label}</span>
          <div style="margin-left:38px;" on-click={() => keepClick(node)}>
            {keepIcon}
          </div>
          <div on-click={() => treeIcon()}>{moreIcon}</div>
        </div>
      )
    },
    // 当点击我的搜藏的时候调用我的搜藏接口
    myKeep (tab) {
      if (tab.name === 'myApp') {
        this.$emit('getOmegaList')
      }
    },
    async deleteKeep (val) {
      // 取消关注
      const { applicationName } = val
      const res = await unFollowApplication({
        applicationCode: applicationName
      })
      if (res.success) {
        this.$message({
          message: '取消关注成功'
        })
        this.$emit('getOmegaList')
        this.expandNode = true
      }
    },
    async handleKeep (val) {
      // 关注
      const { applicationName } = val
      const res = await followApplication({ applicationCode: applicationName })
      if (res.success) {
        this.$message({
          type: 'success',
          message: '关注成功'
        })
        this.$emit('getOmegaList')
        this.expandNode = true
      }
    }
  }
}
</script>
<style scoped lang="scss">
.icon-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .module {
    color: #303030;
    font-size: 18px;
    flex-shrink: 0;
    font-weight: 545;
  }
  i {
    cursor: pointer;
  }
}
</style>
