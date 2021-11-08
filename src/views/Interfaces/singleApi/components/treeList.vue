<template>
    <div>
        <!--<el-button @click="showReturnTree('mta.ziroom.com')"></el-button>-->
        <el-tree
                class="filter-tree"
                ref="treeBox"
                :data="deptTree"
                auto-expand-parent
                node-key="label"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                highlight-current
                @node-click = nodeClick
        >
            //使用 scoped slot
            <span slot-scope="{ node, data }" style="width:200px"  >
                     <el-row >
                        <el-col :span="21"><i :class=data.icon ></i>
                            <span style="padding-left: 4px">{{node.label}}</span>
                        </el-col>
                        <el-col :span="2">
                            <el-dropdown v-show="node.level === 2 || node.level === 3">
                                <span class="el-dropdown-link">
                                    <i class="el-icon-more el-icon--right"></i>
                                </span>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-show="node.level === 2"
                                                      @click.native="addModel(data)">新增子模块</el-dropdown-item>
                                    <el-dropdown-item v-show="node.level === 3"
                                                      @click.native="editModel(data)">编辑</el-dropdown-item>
                                    <el-dropdown-item v-show="node.level === 3"
                                                      @click.native="deleteModel(node,data)">删除</el-dropdown-item>

                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-col>
                    </el-row>
                    </span>
        </el-tree>
        <el-dialog
                title="新建子模块"
                :visible.sync="addModelDialogShow"
                width="30%"
                left>
            <el-form ref="addForm" :model="addForm" label-width="100px">
                <el-form-item label="子模块名称:">
                    <el-input v-model="addForm.modelName" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="addModelDialogShow = false">取 消</el-button>
            <el-button type="primary" @click="commitaddModel()">提交</el-button>
        </span>
        </el-dialog>

        <el-dialog
                title="编辑子模块"
                :visible.sync="editModelDialogShow"
                width="30%"
                left>
            <el-form ref="editForm" :model="editForm" label-width="100px">
                <el-form-item label="子模块名称:">
                    <el-input v-model="editForm.editModelName" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editModelDialogShow = false">取 消</el-button>
            <el-button type="primary" @click="commitEditModel()">提交</el-button>
        </span>
        </el-dialog>
    </div>

</template>

<script>
import {
  deleteModule,
  addModule,
  commitEditModule
} from '@/api/model/singleApiList'

export default {

  name: 'TreeList',
  props: {
    deptTree: {
      type: Array,
      default: function () {
        return []
      }
    },
    filterText: {
      type: String,
      default: function () {
        return ''
      }
    },
    label: {
      type: String,
      default: function () {
        return ''
      }
    },
    onlineSystemName: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.treeBox.filter(val)
    },
    deptTree () {
      deep:true
      this.showReturnTree(this.onlineSystemName)
    }
  },

  data () {
    return {
      addModelDialogShow: false,
      editModelDialogShow: false,
      addForm: {
        modelName: ''
      },
      editForm: {
        editModelName: ''
      },
      triggerCurrenNodeData: {},
      labelReturnShow: ''
    }
  },

  methods: {

    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    addModel (data) {
      this.addModelDialogShow = true
      this.triggerCurrenNodeData = data
    },
    editModel (data) {
      this.editModelDialogShow = true
      this.editForm.editModelName = data.label
      this.triggerCurrenNodeData = data
    },
    // 树节点默认选中
    showReturnTree (data) {
      this.$nextTick(function () {
        return this.$refs.treeBox.setCurrentKey(data)
      })
    },

    nodeClick (item, node, self) {
      var id = item.id
      var level = item.level

      const treeClickInfo = {
        id: id,
        level: level
      }
      this.$emit('listenTreeClickInfo', treeClickInfo)
    },
    // 增加模块
    commitaddModel () {
      // 向后台传参
      const dataPost = {
        moduleName: this.addForm.modelName.trim(),
        parentId: this.triggerCurrenNodeData.id,
        level: this.triggerCurrenNodeData.level
      }
      addModule(dataPost).then(response => {
        if (response.success) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
        }
        // 调用接口,返回{id: id++, label: this.addForm.modelName, children: []}
        // 先写死
        // const newChild = {id: 111, label: this.addForm.modelName, children: []};
        if (!this.triggerCurrenNodeData.children) {
          this.$set(this.triggerCurrenNodeData, 'children', [])
        };
        // 如果已有子节点，就把返回的数据push进去，插入到树形数据中
        this.triggerCurrenNodeData.children.push(response.data)
        // 关闭弹窗，重置输入框
        this.addModelDialogShow = false
        this.addForm.modelName = ''
      })
    },
    commitEditModel () {
      const dataPost = {
        moduleName: this.editForm.editModelName.trim(),
        id: this.triggerCurrenNodeData.id
      }

      commitEditModule(dataPost).then(response => {
        if (response.success) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
          this.triggerCurrenNodeData.label = this.editForm.editModelName.trim()
          this.editModelDialogShow = false
        }
      })
    },

    deleteModel (n, d) {
      const parent = n.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(data => data.id === d.id)
      this.$confirm('确定要删除该节点吗？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteModule({ id: d.id }).then((response) => {
          if (response.success) {
            children.splice(index, 1)
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }

}
</script>

<style scoped>
    /deep/.el-tree {
        height: 86px;
        padding: 10px;
        font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 14px
    }
    /deep/.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background-color: #f5f8fd;
        color: #409EFF;
        font-weight:bold
    }
    /deep/.el-scrollbar .el-scrollbar__wrap {overflow-x: hidden;}
    /*/deep/.span-ellipsis {*/
        /*width: 140px;*/
        /*word-break:keep-all;*/
        /*white-space:nowrap;*/
        /*overflow: hidden;*/
        /*text-overflow:ellipsis;*/
        /*white-space: nowrap;*/
    /*}*/
</style>
