<template>
  <div class="tabs_body">
    <div class="tabs_request" v-if="moduleList.length > 0">
      <DatabaseTree
        class="content-left"
        ref="databaseTreeSql"
        :data="moduleList"
        pageType='preSql'
        @changeFormDialogShow="changeFormDialogShow"
      />
      <Codemirror
        class="content-right"
        :value="preSql"
        :codeMirrorHeight="codeMirrorHeight"
        @changeTextarea="changeTextarea"
      />
    </div>
    <div v-else class="body_empty">
      <div>
        <span>暂未绑定数据库，请先进行绑定！ </span>
        <el-button
          type="primary"
          @click="changeFormShow"
        >去绑定</el-button>
      </div>
    </div>
    <el-dialog
      title="绑定数据库"
      width="60%"
      :visible="isFormShow"
      :close-on-click-modal="false"
      destroy-on-close
      @close="handleCancel"
      append-to-body
    >
      <DatabaseForm
        :applicationDetails="apiFormData"
        @handleCancel="handleCancel"
        @refrech='refrech'
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Codemirror from '@/components/Codemirror/index.vue'
import { queryDatabaseList } from '@/api/model/testCase'

export default {
  name: 'RequestSQL',
  components: {
    DatabaseTree: () => import('../../DatabaseDiaLog/DatabaseTree'),
    DatabaseForm: () => import('../../DatabaseDiaLog/DatabaseForm'),
    Codemirror,
  },
  props: {
    preSql: {
      type: String,
      default () {
        return ''
      }
    },
    apiFormData: {
      type: Object,
      default () {
        return {}
      } 
    },
    codeMirrorHeight: {
      type: String,
    }
  },
  watch: {
    apiFormData: {
      handler(val) {
        this.queryDatabaseList()
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      moduleList: [], // 数据库list
      isFormShow: false,
    }
  },
  methods: {
    ...mapActions(['setCaseForm']),
    changeTextarea (val) {
      this.setCaseForm({ preSql: val })
    },
    async queryDatabaseList () {
      const params = {
        applicationName: this.apiFormData.applicationName,
        env: 'qua'
      }
      const resData = await queryDatabaseList(params)

      if (resData.data && Array.isArray(resData.data)) {
        this.moduleList = this.handleModuleTree(resData.data)

      }
    },
    changeFormDialogShow () {

    },
    handleCancel () {
      this.isFormShow = false
    },
    refrech () {
      this.queryDatabaseList()
      this.handleCancel()
    },
    changeFormShow () {
      this.isFormShow = true
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
  .tabs_request {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .content-left {
      width: 25%;
      border: 1px solid #EBEEF5;
      padding-top: 10px;
      overflow: scroll;
      height: 300px;
    }

    .content-right {
      width: 75%;
      margin-left: 10px;
    }
  }
  .body_empty {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 150px auto;
    font-size: 20px;
    span {
      margin-right: 4px;
      font-weight: 600;
      color: #e6a23c;
    }
  }
</style>
