<template>
  <div class="app-container">
    <div style="width: 100%; height: 80px">
      <h2>单接口导入及多接口加载</h2>
      <div style="color: orange" class="el-upload__tip" slot="tip">
        <i class="el-icon-warning" style="margin-right: 5px"></i>
        支持har(Fiddler,Charles)、jmx(Jmeter)、json(Postman collection
        v2.1)多文件导入
      </div>
    </div>
    <el-row>
      <el-button
        class="upload-btn"
        type="primary"
        size="small"
        @click="openFileUpload"
        ><i class="el-icon-upload"></i>上传文件
      </el-button>
      <el-button
        class="upload-btn"
        type="success"
        size="small"
        @click="handleSaveAll"
        ><i class="el-icon-circle-check"></i>全部保存
      </el-button>
      <el-button
        class="upload-btn"
        type="warning"
        size="small"
        @click="loadMultApiPage"
        ><i class="el-icon-tickets"></i>多接口加载
      </el-button>
      <el-button
        class="upload-btn"
        type="info"
        size="small"
        @click="swaggerDialogVisible = true"
        ><i class="el-icon-download"></i>swagger导入
      </el-button>
    </el-row>
    <!-- v-loading="pubAndTableLoading" -->
    <div>
      <el-row v-show="pubParamShow">
        <el-col :span="2"><span>公共参数：</span></el-col>
        <el-col :span="22" style="margin-bottom: 15px">
          <el-button type="primary" size="small" @click="showPubParamTable"
            >{{pubParamText}}
          </el-button>
        </el-col>
      </el-row>
      <el-col style="margin-bottom: 20px" v-show="pubParamTableShow">
        <div>
          <elx-editable
            ref="editable"
            :data.sync="pubParam"
            border
            style="width: 60%; font-size: 13px"
          >
            <elx-editable-column
              prop="paramKey"
              align="center"
              label="参数名称"
              :edit-render="{ name: 'ElInput' }"
            ></elx-editable-column>
            <elx-editable-column
              prop="paramVal"
              align="center"
              label="参数值"
              :edit-render="{ name: 'ElInput' }"
            ></elx-editable-column>
            <elx-editable-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, pubParam)"
                  type="text"
                  size="small"
                  >删除
                </el-button>
              </template>
            </elx-editable-column>
          </elx-editable>
        </div>
      </el-col>
      <el-row>
        <api-storage-table
          ref="apiTable"
          :apiDataTableProp="apiDataList"
          :page-size-prop="pageSize"
          :current-page-prop="currentPage"
          :pubParamProp="pubParam"
          @errorAlert="handleErrorAlert"
        />
        <pagination
          v-show="currentTotal > 20"
          :page.sync="currentPage"
          :total="currentTotal"
          :limit.sync="pageSize"
          @pagination="handlePagination"
        >
        </pagination>
      </el-row>
    </div>
    <el-dialog
      :title="uploadDialogTitle"
      :visible="fileUploadVisible"
      @close="fileUploadVisible = false"
    >
      <file-upload
        ref="fileUploadRef"
        :acceptFileTypeProp="fileType"
        :limitFileCountProp="fileCount"
        :uploadFileListProp="fileList"
        @fileUploadFuncEv="fileUpload"
      >
      </file-upload>
      <el-row style="text-align: center">
        <el-button size="lg" type="primary" @click="analyzeApiFiles"
          >解析接口文件</el-button
        >
      </el-row>
    </el-dialog>
    <!-- swagger导入 -->
    <el-dialog
      title="swagger导入"
      :visible="swaggerDialogVisible"
      @close="closeSwaggerDialog"
    >
      <el-form
        :inline="true"
        :model="importForm"
        :rules="importRules"
        ref="importRef"
      >
        <el-form-item label="应用名称" prop="applicationName">
          <el-select
            v-model="importForm.applicationName"
            placeholder="请选择应用名称"
          >
            <el-option
              v-for="item in appOptions"
              :key="item.id"
              :label="item.applicationName"
              :value="item.applicationName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="域名/URL" prop="swaggerUrl">
          <el-input
            v-model="importForm.swaggerUrl"
            placeholder="带http头的URL"
            style="width: 450px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="importLoading"
            @click="analyzeSwagger('importRef')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-drawer title="接口/用例未全部保存成功" :visible.sync="drawer">
      <div style="overflow-y: scroll; height: 850px; text-align: center">
        <ul
          class="infinite-list"
          v-infinite-scroll="load"
          style="overflow: auto"
        >
          <li
            v-for="i in messageList.length"
            :key="i"
            class="infinite-list-item"
          >
            {{ messageList[i] }}
          </li>
        </ul>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import fileUpload from '@/components/FileUpload'
import Pagination from '@/components/Pagination/index'
import {
  uploadApiFile,
  readApiList,
  saveSingleApiList,
  removeFiles,
  analyzeSwaggerApiByUrl
} from '@/api/model/apiStorage'
import apiStorageTable from './api-storage-table'
import { myJoinApplication } from '@/api/model/singleApiList'
import API_STORAGE_CONFIG from '@/config/apiStorage.config'

export default {
  name: 'api-storage',
  components: { apiStorageTable, fileUpload, Pagination },
  data () {
    return {
      currentTotal: 0,
      pageSize: 10,
      currentPage: 1,
      apiDataList: [],
      fileType: 'har,jmx,json',
      fileList: [],
      fileCount: 5,
      uploadDialogTitle: '接口文件上传',
      fileUploadVisible: false,
      allDataList: [],
      swaggerDialogVisible: false,
      swaggerAddress: '',
      messageList: [],
      drawer: false,
      count: 0,
      pubParam: [],
      pubParamShow: false,
      pubAndTableLoading: false,
      pubParamTableShow: false,
      pubParamText: '展开',
      paramList: [],
      importForm: {
        // swagger导入表单
        swaggerUrl: '',
        applicationName: ''
      },
      appOptions: [], // 应用下拉选项
      importRules: API_STORAGE_CONFIG.appFormRules, // 导入表单校验规则
      importLoading: false // swagger导入按钮loading
    }
  },
  created () {
    this.getAppOptions()
  },
  methods: {
    load () {
      this.count += 5
    },
    fileUpload (param) {
      uploadApiFile(param).then((response) => {
        this.handleCommonMessage(response, function () {})
      })
    },
    openFileUpload () {
      this.fileUploadVisible = true
    },
    handleCommonMessage (response, func) {
      if (response.success) {
        this.$message({
          message: response.data,
          type: 'success'
        })
        func()
      } else {
        this.$message({
          message: response.errorMessage,
          type: 'error'
        })
      }
    },
    analyzeApiFiles () {
      this.pubParamTableShow = false
      this.fileUploadVisible = false
      this.$refs.apiTable.apiTableLoading = true
      this.pubAndTableLoading = true
      readApiList().then((response) => {
        if (response.success) {
          this.$refs.apiTable.apiTableLoading = false
          this.pubAndTableLoading = false
          this.allDataList = response.data
          // 获取带${}的动态参数，用于后续保存至多接口
          this.setParamListForMulti(response.data)
          // 取出公共参数并展示
          if (this.allDataList.length > 0) {
            this.pubParam = JSON.parse(this.allDataList[0].pubParam)
          }
          this.pubParamShow =
            this.pubParam !== null && this.pubParam.length !== 0
          this.currentTotal = this.allDataList.length
          this.pageSize = 10
          this.currentPage = 1
          this.handlePagination()
        }
        this.removeUploadFiles()
        this.$refs.apiTable.idList = []
        this.fileList = []
      })
    },
    handleSaveAll () {
      this.$refs.apiTable.apiTableLoading = true
      const validList = this.allDataList.filter(function (data) {
        if (data.systemId) {
          return true
        }
      })
      if (validList.length > 0) {
        validList[0].pubParam = JSON.stringify(this.pubParam)
      }
      saveSingleApiList(validList).then((response) => {
        if (response.success) {
          this.$message({
            message: '全部保存成功！',
            type: 'success'
          })
          for (let i = 0; i < this.allDataList.length; i++) {
            this.allDataList[i].isSaved = 1
          }
        } else {
          this.handleErrorAlert(response.data)
        }
        this.$refs.apiTable.apiTableLoading = false
        this.$refs.apiTable.storeIdList(response)
        this.removeUploadFiles()
      })
    },
    handleErrorAlert (data) {
      const dupSet = new Set()
      const unSaveSet = new Set()
      const dupList = data.duplicatedSingleApis
      const unSaveList = data.unsavedSingleApis
      for (let i = 0; i < dupList.length; i++) {
        dupSet.add(dupList[i].apiName)
      }
      for (let i = 0; i < unSaveList.length; i++) {
        unSaveSet.add(unSaveList.apiName)
      }
      for (let i = 0; i < this.apiDataList.length; i++) {
        if (
          dupSet.has(this.apiDataList[i].apiName) ||
          unSaveSet.has(this.apiDataList[i].apiName)
        ) {
          this.apiDataList[i].isSaved = 2
        } else if (this.apiDataList[i].systemId) {
          this.apiDataList[i].isSaved = 1
        }
      }
      // const message = this.$refs.apiTable.convertMessageToHTML(
      //   dupList,
      //   unSaveList
      // )
      for (let i = 0; i < dupList.length; i++) {
        this.messageList.push(
          dupList[i].url +
            '=>' +
            (dupList[i].caseName ? dupList[i].caseName : '空')
        )
      }
      this.drawer = true
    },
    loadMultApiPage () {
      if (this.$refs.apiTable.idList.length < 50) {
        localStorage.setItem('ids', JSON.stringify(this.$refs.apiTable.idList))
        localStorage.setItem('pubParam', JSON.stringify(this.pubParam))
        localStorage.setItem('paramList', JSON.stringify(this.paramList))
        const { href } = this.$router.resolve({
          path: '/interfaces/multiApi/multi-api-save',
          query: { id: '', flag: '0', loaded: 1 }
        })
        window.open(href, '_blank')
      } else {
        this.$alert('接口数量过多，无法在多接口页面加载！', '提示')
      }
    },
    setParamListForMulti (dataList) {
      this.paramList = []
      for (var i = 0; i < dataList.length; i++) {
        for (var j = 0; j < dataList[i].caseList.length; j++) {
          const obj = { caseName: '', param: '' }
          obj.caseName = dataList[i].caseList[j].caseName
          obj.param = dataList[i].caseList[j].param
          this.paramList.push(obj)
        }
      }
    },
    removeUploadFiles () {
      removeFiles().then((response) => {})
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    insertEvent (row) {
      this.$refs.editable
        .insertAt({}, row)
        .then(({ row }) => this.$refs.editable.setActiveCell(row))
    },
    handlePagination () {
      const start = this.pageSize * (this.currentPage - 1)
      this.apiDataList = this.allDataList.slice(start, start + this.pageSize)
    },
    showPubParamTable () {
      if (this.pubParamTableShow) {
        this.pubParamTableShow = false
        this.pubParamText = '展开'
      } else {
        this.pubParamTableShow = true
        this.pubParamText = '关闭'
      }
    },
    analyzeSwagger (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // const params = new URLSearchParams(url)
          const params = { ...this.importForm }
          this.importLoading = true
          analyzeSwaggerApiByUrl(params)
            .then((res) => {
              if (res.success) {
                this.$notify({
                  title: '导入成功',
                  dangerouslyUseHTMLString: true,
                  message: `<p>重新导入${res.data}条</p>`,
                  type: 'success'
                })
                this.closeSwaggerDialog()
              }
            })
            .finally(() => {
              this.importLoading = false
            })
        }
      })
    },
    // 关闭swagger导入对话框
    closeSwaggerDialog () {
      this.importForm = {
        swaggerUrl: '',
        applicationName: ''
      }
      this.swaggerDialogVisible = false
    },
    async getAppOptions () {
      const { data } = await myJoinApplication()
      this.appOptions = data
    }
  }
}
</script>

<style scoped>
.upload-btn {
  margin: 5px 0 15px 0;
}
</style>
