<template>
  <div
    class="tree-content"
    v-bind="$props">
    <div class="icon-wrap">
      <h2 class="module">所有模块</h2>
      <el-tooltip class="item" effect="dark" content="新增模块" placement="top-start">
        <i class="el-icon-plus" v-show="icoVisible" @click="handleAdd()"></i>
      </el-tooltip>
    </div>
    <DeptOrg :deptCode.sync="treePath" :cascaderConfig="cascaderConfig"/>
    <el-input
      placeholder="请输入关键字查询"
      clearable
      size="mini"
      v-model="filterText"
      style="margin-top: 5px"
    >
    </el-input>
    <el-tabs type="card" v-model="activeName" @tab-click="myKeep">
      <el-tab-pane label="全部应用" name="allApp">
        <el-tree
          class="main-tree"
          ref="tree"
          :data="data"
          :indent="indent"
          node-key="id"
          highlight-current
          :expand-on-click-node="expandNode"
          :props="$props.defaultProps"
          :filter-node-method="filterNode"
          :render-content="renderContent"
          :default-expanded-keys="showArray"
        >
        </el-tree>
      </el-tab-pane>
      <el-tab-pane label="我的收藏" name="myApp">
        <el-tree
          class="main-tree"
          ref="treeMy"
          :data="myData"
          :indent="indent"
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
    <el-dialog
      title="添加模块"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form>
        <el-form-item label="模块名">
          <el-input v-model.trim="newModule" placeholder="请输入新的模块" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <moveModule ref="moveModule" @moduleMove="moduleMove"></moveModule>
  </div>
</template>
<script>
import {
  appendChildApplicationModule,
  deleteTestApplicationModule,
  updateApplicationModuleName,
  followApplication,
  unfollowApplication,
  queryMyApplicationAndModule
} from '@/api/model/testApplication'
import { mapActions } from 'vuex'
export default {
  name: 'Tree',
  watch: {
    filterText (val) {
      if (this.activeName === 'allApp') {
        this.$refs.tree.filter(val)
      } else {
        this.$refs.treeMy.filter(val)
      }
    },
    treePath (val) {
      if (this.activeName === 'allApp') {
        this.$emit('update:treePath', val)
        this.$emit('queryModuleList')
      } else {
        this.$emit('update:treePath', val)
        this.queryMyApplicationAndModule()
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
  components: {
    DeptOrg: () => import('@/components/DeptOrg/index'),
    moveModule: () => import('./moveModule')
  },
  props: {
    data: {
      required: true,
      type: Array
    },
    defaultProps: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      filterText: '',
      icoVisible: false,
      dialogVisible: false,
      newModule: '',
      node: {},
      nodeData: {},
      indent: 20,
      type: 'add',
      treePath: '',
      expandNode: true,
      activeName: 'allApp',
      myData: [],
      littleStars: true,
      showArray: []
    }
  },
  methods: {
    ...mapActions(['queryCheckedModuleData']),
    filterNode (value, data, node) {
      if (!value) {
        node.expanded = false
        return true
      }
      // return data.label.indexOf(value) !== -1
      return this.chooseNode(value, data, node)
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
    renderContent (h, { node, data }) {
      const _this = this
      function handleClick (node, data) {
        _this.node = node
        _this.nodeData = data
        _this.queryCheckedModuleData(data)
        if (_this.nodeData.leaf) {
          _this.icoVisible = false
        } else {
          _this.icoVisible = true
        }
      }
      function handleIcon (node, data) { // 为应用时，带icon
        const { app } = data
        if (app) {
          return (
            <i class="el-icon-folder icon-folder"></i>
          )
        }
      }
      const fileIcon = handleIcon(node, data)
      function handleDelete () {
        _this.$confirm('将删除本条数据', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleteModle()
        }).catch(() => {
          _this.$notify({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
      function handleEdit (data) {
        _this.dialogVisible = true
        _this.newModule = data.label
        _this.type = 'edit'
      }
      function handleAdd () { // 新增
        if (_this.nodeData.leaf) {
          _this.$notify({
            type: 'error',
            message: '只能新增4级模块'
          })
        } else {
          _this.dialogVisible = true
          _this.type = 'add'
        }
      }
      function handleMove () { // 移动
        _this.$refs.moveModule.moveModuleShow = true
        _this.$refs.moveModule.moduleMoveIs = data
        _this.$refs.moveModule.data = _this.$props.data
      }

      function checkMoreIcon (node, data) {
        if (!data.app) {
          return (
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-more-outline treeIcon"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item nativeOnClick={() => handleDelete()}>删除</el-dropdown-item>
                <el-dropdown-item nativeOnClick={() => handleEdit(data)}>编辑</el-dropdown-item>
                <el-dropdown-item nativeOnClick={() => handleAdd()}>新增</el-dropdown-item>
                <el-dropdown-item nativeOnClick={() => handleMove()}>移动</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          )
        }
      }

      const moreIcon = checkMoreIcon(node, data)
      function handleKeep (node, data) { // 为应用时，带icon
        const { app, followFlag } = data
        if (app && followFlag) { // 为应用并且关注
          return (
            <i class="el-icon-star-on keepOn"></i>
          )
        } else if (app && !followFlag) { // 为应用并且不关注
          return (
            <i class="el-icon-star-off keepOff"></i>
          )
        }
      }
      function keepClick (data) { // 点击小星星按钮事件函数
        _this.littleStars = false
        const followFlag = data.followFlag
        _this.expandNode = false
        if (!followFlag) {
          _this.handleKeep(data.id)
        } else {
          _this.deleteKeep(data.id)
        }
      }
      const keepIcon = handleKeep(node, data)
      async function treeIcon () {
        _this.expandNode = true
      }

      return (
        <div class="custom-tree-node" on-click={() => handleClick(node, data)}>
          {fileIcon}
          <span class="node-label">{node.label}</span>
          <div style="margin-left:38px" on-click={() => keepClick(data)}>{keepIcon}</div>
          <div on-click={() => treeIcon()}>{moreIcon}</div>
        </div>
      )
    },
    async handleKeep (val) { // 关注
      const resData = {
        appId: val
      }
      await followApplication(resData)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '关注成功'
            })
            this.$emit('queryModuleList')
            this.expandNode = true
          }
        })
    },
    async deleteKeep (val) { // 取消关注
      const resData = {
        appId: val
      }
      await unfollowApplication(resData)
        .then(res => {
          if (res) {
            this.$message({
              message: '取消关注成功'
            })
            this.$emit('queryModuleList')
            this.queryMyApplicationAndModule()
            this.expandNode = true
          }
        })
    },
    myKeep (tab) { // 当点击我的搜藏的时候调用我的搜藏接口
      if (tab.name === 'myApp') {
        this.queryMyApplicationAndModule()
      }
    },
    async queryMyApplicationAndModule () {
      const params = { treePath: this.treePath.toString() }
      const res = await queryMyApplicationAndModule(params)
      this.myData = res.data
    },
    async addModule (data) { // 新增模块
      await appendChildApplicationModule(data)
        .then(res => {
          if (res.success) {
            this.$notify({
              type: 'success',
              message: '保存成功'
            })
            const prentId = []
            if (data.parentId) {
              prentId.push(data.parentId)
            } else {
              prentId.push(data.applicationId)
            }
            this.showArray = prentId
            this.dialogVisible = false
            this.newModule = ''
            this.$emit('queryModuleList')
          }
        })
    },
    async updateModule () { // todo 更新名称不成功
      const reqData = {
        id: this.nodeData.id,
        moduleName: this.newModule
      }
      await updateApplicationModuleName(reqData)
        .then(res => {
          if (res.success) {
            this.$notify({
              type: 'success',
              message: res.data
            })
            const prentId = []
            prentId.push(reqData.id)
            this.showArray = prentId
            this.dialogVisible = false
            this.newModule = ''
            this.$emit('queryModuleList')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    async deleteModle () {
      const reqData = {
        id: this.nodeData.id
      }
      const applicationId = this.nodeData.applicationId ? this.nodeData.applicationId : this.nodeData.id
      await deleteTestApplicationModule(reqData)
        .then((respData) => {
          if (respData.success) {
            this.$notify({
              type: 'success',
              message: '删除成功'
            })
            const prentId = []
            prentId.push(applicationId)
            this.showArray = prentId
            this.nodeData = {}
            this.$emit('queryModuleList')
          }
        })
    },
    handleAdd () {
      this.dialogVisible = true
      this.type = 'add'
    },
    handleClose () {
      this.dialogVisible = false
      this.newModule = ''
    },
    async onConfirm () {
      if (this.nodeData.applicationId || this.nodeData.id) {
        const data = {
          applicationId: this.nodeData.applicationId ? this.nodeData.applicationId : this.nodeData.id,
          moduleName: this.newModule,
          parentId: this.nodeData.app ? '' : this.nodeData.id
        }
        this.type === 'add' ? await this.addModule(data) : await this.updateModule()
      } else {
        this.$notify({
          type: 'error',
          message: '请先选择应用'
        })
      }
    },
    moduleMove (val) {
      const prentId = []
      prentId.push(val)
      this.showArray = prentId
      this.$emit('queryModuleList')
    }
  }
}
</script>
<style scoped lang="scss">
.icon-wrap{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .module{
    color: #303030;
    font-size: 18px;
    flex-shrink: 0;
    font-weight: 545;
  }
  i{
    cursor: pointer;
  }
}

</style>
<style lang="scss">
.keepOff:hover {
  color: #ff962b;
}
.keepOn {
  color: red;
  font-size: 18px;
  margin-left: -3px;
}
.treeIcon {
  display: block;
  color: black;
  margin-top: -6px;
}
.tree-content {
  .el-tabs__nav {
    width: 100% !important;
  }
  #tab-myApp, #tab-allApp {
    padding-left: 40px;
    padding-right: 40px;
  }

  .el-tree-node__content {
    transition: 1s ease;
    font-size: 13px;
    font-weight: bold;
    width: 90%;
  }
  .custom-tree-node {
    width: 100%;
    height: 100%;
    align-items: center;
    display: flex;
    padding: 0px 2px;
    .node-label {
      display: inline-block;
      width: 120px;
    }
    .el-dropdown {
      position: absolute;
      right: 10px;
    }
  }
  .main-tree {
    margin-top: 10px;
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background: #537be0;
    color: #fff;
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    .el-tree-node__content
    .custom-tree-node
    > .el-icon-folder {
    color: #eee;
    font-weight: bold;
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    .custom-tree-node
    .el-dropdown
    .el-dropdown-link
    > .el-icon-more {
    color: #eee;
    font-weight: bold;
  }
  .icon-folder {
    margin: 0px 6px;
    color: #555;
    font-weight: bold;
  }
}
</style>
