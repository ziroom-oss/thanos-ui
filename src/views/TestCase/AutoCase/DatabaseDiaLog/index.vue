<template>
  <el-dialog
    :title="title"
    width="60%"
    :visible="databaseShow"
    :close-on-click-modal="false"
    destroy-on-close
    @close="handleClose"
  >
    <div class="database-dialog-content" v-if="moduleList.length > 0">
      <el-row class="content-left">
        <DatabaseTree
          ref="databaseTree"
          :data="moduleList"
          @changeFormDialogShow="changeFormDialogShow"
        />
      </el-row>
      <el-row class="content-right">
        <DatabaseDetails
          v-if="!formDialogShow"
          :nodeDetails="nodeDetails"
        />
        <DatabaseForm
          v-else
          :formType="formType"
          :formData="nodeDetails"
          :applicationDetails="applicationDetails"
          @handleCancel="handleCancel"
          @refrech='refrech'
        />
      </el-row>
    </div>
    <DatabaseForm
      v-else
      :formType="formType"
      :formData="nodeDetails"
      :applicationDetails="applicationDetails"
      @handleCancel="handleCancel"
      @refrech='refrech'
    />
  </el-dialog>
</template>

<script>

import { queryDatabaseList } from '@/api/model/testCase'

export default {
  name: 'DatabaseDiaLog',
  components: {
    DatabaseTree: () => import('./DatabaseTree'),
    DatabaseDetails: () => import('./DatabaseDetails'),
    DatabaseForm: () => import('./DatabaseForm')
  },
  props: {
    applicationDetails: {
      type: Object,
      default () {
        return {}
      }
    },
    databaseShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    databaseShow: {
      async handler (val) {
        if (val) {
          await this.queryDatabaseList()
        }
      },
      deep: true
    }
  },
  computed: {
    title () {
      return this.moduleList.length > 0 ? '测试连接' : '新建连接'
    }
  },
  data () {
    return {
      moduleList: [], // 数据库list
      formDialogShow: false, // 编辑数据库连接或批量查询sql
      formType: 'add', // 连接是新增或编辑
      nodeDetails: {}
    }
  },
  async mounted () {
    await this.queryDatabaseList()
  },
  methods: {
    refrech () {
      this.queryDatabaseList()
    },
    handleClose () {
      this.$emit('closeDatabase', false)
    },
    handleCancel (val) {
      this.formType === 'add' ? this.$emit('closeDatabase', val) : this.changeFormDialogShow(false)
    },
    changeFormDialogShow (val) {
      this.formDialogShow = val
    },
    // 查询数据库和表
    async queryDatabaseList () {
      const params = {
        applicationName: this.applicationDetails.applicationName,
        env: 'qua'
      }
      const resData = await queryDatabaseList(params)

      if (resData.data && Array.isArray(resData.data)) {
        this.moduleList = this.handleModuleTree(resData.data)
        this.nodeDetails = resData.data[0]
        this.formType = resData.data.length > 0 ? 'edit' : 'add'
      }
    },
    handleModuleTree (arr = []) {
      const newArr = arr.map(item => ({
        label: item.dbName,
        id: item.id,
        children: item.tablesList ? item.tablesList.map(key => ({
          label: key,
          id: key
        })) : []
      }))

      return newArr
    }
  }
}
</script>

<style lang="scss" scoped>
.database-dialog-content {
  height: 550px;
  display: flex;
  justify-content: space-between;
  .content-left {
    width: 25%;
    border: 1px solid #EBEEF5;
    padding-top: 10px;
    overflow: scroll;
  }

  .content-right {
    width: 75%;
    margin-left: 10px;
    padding-left: 10px;
    border-left: 1px solid #EBEEF5;
  }
}
</style>
