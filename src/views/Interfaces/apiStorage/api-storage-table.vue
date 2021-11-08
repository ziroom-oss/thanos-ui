<template>
  <el-table
    :data="apiDataTable"
    border
    default-expand-all
  >
    <!-- v-loading="apiTableLoading" -->
    <el-table-column type="expand">
      <template slot-scope="scope">
        <el-form
          v-for="(caseInfo, index) in scope.row.caseList"
          label="用例参数"
          :key="index"
          :style="index % 2 == 0 ? 'background:#F7F7F7' : 'background:#F9F9F9'"
        >
          <el-form-item :label="'用例参数' + (index + 1)">
            <el-input
              style="width: 80%"
              type="textarea"
              v-model="caseInfo.param"
            ></el-input>
          </el-form-item>
          <el-form-item :label="'用例名称' + (index + 1)">
            <el-input style="width: 80%" v-model="caseInfo.caseName"></el-input>
          </el-form-item>
          <el-form-item
            :label="'预处理信息' + (index + 1)"
            v-show="
              caseInfo.preRequest !== undefined && caseInfo.preRequest !== ''
            "
          >
            <el-input
              style="width: 80%"
              v-model="caseInfo.preRequest"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="'断言' + (index + 1)"
            v-show="
              caseInfo.assertList !== undefined &&
              caseInfo.assertList.length > 0
            "
          >
            <div style="padding-left: 50px">
              <div v-for="(ass, ind) in caseInfo.assertList" :key="ind">
                <el-input
                  v-model="ass.assertContent.replace('#1', ' = ')"
                  style="width: 50%"
                >
                  <template slot="prepend">{{ ind + 1 }}</template>
                </el-input>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column align="center" type="index" :index="countIndex" />
    <el-table-column prop="apiUrl" label="请求URL" header-align="center" />
    <el-table-column label="接口名" header-align="center">
      <template slot-scope="scope">
        <el-input v-model="scope.row.apiName" placeholder="请输入接口名称">
        </el-input>
      </template>
    </el-table-column>
    <el-table-column
      prop="systemName"
      label="系统名"
      align="center"
      width="200px"
    />
    <el-table-column label="操作" width="150px" align="center">
      <template slot-scope="scope">
        <el-button
          v-if="!scope.row.isSaved && scope.row.systemId"
          type="success"
          size="mini"
          @click="handleSave(scope.row)"
          >保存
        </el-button>
        <el-tag type="success" size="medium" v-else-if="scope.row.isSaved == 1">
          已保存
        </el-tag>
        <el-tag type="warning" size="medium" v-else-if="scope.row.isSaved == 2">
          已存在/未保存
        </el-tag>
        <el-tag type="danger" size="medium" v-else-if="!scope.row.systemId">
          系统不存在
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { saveSingleApiList } from '@/api/model/apiStorage'

export default {
  name: 'api-storage-table',
  data () {
    return {
      apiDataTable: this.apiDataTableProp,
      isSaved: '',
      idList: [],
      apiTableLoading: false,
      currentPage: this.currentPageProp,
      pageSize: this.pageSizeProp,
      pubParam: this.pubParamProp
    }
  },
  props: {
    apiDataTableProp: {
      type: Array,
      default: () => {
        return []
      }
    },
    currentPageProp: {
      type: Number,
      default: 0
    },
    pageSizeProp: {
      type: Number,
      default: 0
    },
    pubParamProp: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    apiDataTableProp: {
      handler (val) {
        this.apiDataTable = val
      },
      deep: true
    },
    currentPageProp: {
      handler (val) {
        this.currentPage = val
      }
    },
    pageSizeProp: {
      handler (val) {
        this.pageSize = val
      }
    },
    pubParamProp: {
      handler (val) {
        this.pubParam = val
      },
      deep: true
    }
  },
  methods: {
    handleSave (rowData) {
      rowData.pubParam = JSON.stringify(this.pubParam)
      saveSingleApiList([rowData]).then((response) => {
        if (response.success) {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
          rowData.isSaved = 1
        } else {
          rowData.isSaved = 2
          this.$alert(
            this.convertMessageToHTML(
              response.data.duplicatedSingleApis,
              response.data.unsavedSingleApis
            ),
            '接口/用例未全部保存成功',
            {
              confirmButtonText: '确定',
              dangerouslyUseHTMLString: true,
              type: 'warning'
            }
          )
        }
        this.storeIdList(response)
      })
    },
    convertMessageToHTML (dupList, unSaveList) {
      let msg = ''
      if (dupList.length > 0) {
        msg += '<b><p>重复用例为：</p></b>'
        for (let i = 0; i < dupList.length; i++) {
          msg +=
            "<p style='color: orange'>" +
            dupList[i].url +
            ':' +
            +dupList[i].caseName +
            '</p>'
        }
      }
      if (unSaveList.length > 0) {
        msg += '<b><p>未保存用例为：</p></b>'
        for (let i = 0; i < unSaveList.length; i++) {
          msg +=
            "<p style='color: red'>" +
            unSaveList[i].url +
            ':' +
            +unSaveList[i].caseName +
            '</p>'
        }
      }
      return msg
    },
    storeIdList (response) {
      const existList = response.data.savedSingleApis.concat(
        response.data.duplicatedSingleApis
      )
      for (let i = 0; i < existList.length; i++) {
        this.idList.push(existList[i].caseId)
      }
    },
    countIndex (index) {
      alert
      return (this.currentPage - 1) * this.pageSize + index + 1
    }
  }
}
</script>

<style scoped>
</style>
