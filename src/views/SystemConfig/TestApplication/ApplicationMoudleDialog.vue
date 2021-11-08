<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" class="rela-module">
    <el-form :model="testApplication"  label-width="120px"  ref="applicationModuleForm" >
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="关联模块:">
            <el-button plain @click="appendRoot(testApplication.id)" >+ 新增根模块</el-button>
            <div class="block" >
              <el-tree
                :data="testApplication.applicationModuleTreeList"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span v-if ="data.active  == false" @click="changeEidtActive(node)"  >{{ node.label }}</span>
                  <el-input v-else v-model="data.label" @blur="updateModuleNameVal(data)" ></el-input>
                  <el-button v-if = "data.level != 3"
                    type="text"
                    size="mini"
                    @click="() => appendChild(data)">
                    追加子模块
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)">
                    删除
                  </el-button>
                </span>
              </el-tree>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>

// import { mapGetters } from 'vuex'

import TEST_APPLICATION_CONFIG from '@/config/testApplication.config.js'
import { deleteTestApplicationModuleById, updateApplicationModuleNameById, appendChildApplicationModule, appendRootApplicationModule, queryApplicationModuleTreeByApplicationId } from '@/api/model/testApplication'

export default {
  name: 'ApplicationMoudleDialog',

  components: {
  },
  computed: {
  },
  data: () => ({
    dialogVisible: false,
    dialogTitle: '',
    testApplication: {
      id: 0,
      applicationName: '',
      ehrTreePath: [''],
      applicationType: '',
      applicationHostname: '',
      updateUser: '',
      updateTime: '',
      applicationModuleTreeList: []
    },
    applicationTypeDataDictionaryList: [],
    afterHandledeptOrgList: [],
    deptOrgList: [],
    belongToSystemList: [],
    TEST_APPLICATION_CONFIG, // 枚举转换
    loading: false
  }),
  methods: {
    // async handleClose () {
    //   this.dialogVisible = false
    //   await this.$refs.ApplicationMoudleDialog.resetFields()
    // },
    changeEidtActive (node) {
      node.data.active = true
    },
    async updateModuleNameVal (data) {
      data.active = false
      await updateApplicationModuleNameById(data)
    },
    async appendRoot (id) {
      const rootTestApplicationModule = {
        moduleName: '新增根模块',
        applicationId: id
      }
      await appendRootApplicationModule(rootTestApplicationModule).then((applicationId) => {
        if (applicationId != null) {
          const params = { applicationId: applicationId }
          queryApplicationModuleTreeByApplicationId(params).then((result) => {
            this.testApplication.applicationModuleTreeList = result
          })
        }
      })
    },
    async appendChild (data) {
      const childTestApplicationModule = {
        moduleName: '新增子模块',
        parentId: data.id
      }
      await appendChildApplicationModule(childTestApplicationModule).then((childApplicationModuleTree) => {
        if (childApplicationModuleTree != null) {
          if (!data.children) {
            this.$set(data, 'children', [])
          }
          data.children.push(childApplicationModuleTree)
        }
      })
    },
    async remove (node, data) {
      await this.$confirm('确认要删除此模块吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTestApplicationModuleById({ id: data.id }).then((resultData) => {
          if (resultData.endsWith('成功')) {
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
            this.$message({
              type: 'error',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: '存在测试用例关联所属模块，删除失败!'
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
<style lang="scss">
  .rela-module{
    .custom-tree-node {
      position: relative;
      display: inline-block;
      span{
        float: left;
      }
      button {
        float: right;
      }
      .el-input--small .el-input__inner {
        height: 25px;
        line-height: 25px;
        margin-top: 30px;
      }
    }
  }
</style>
