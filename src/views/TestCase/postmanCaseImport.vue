<template>
  <div class="postman">
    <el-card style="overflow-y: scroll">
      <h3 style="margin-bottom: 10px">{{ treeName }}</h3>
      <el-tree
        :data="data"
        :indent="20"
        node-key="id"
        highlight-current
        :props="defaultProps"
        @node-click="handleNodeClick"
        :render-content="renderContent"
      >
      </el-tree>
    </el-card>
    <el-card>
      <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <file-upload
        ref="fileUploadRef"
        v-if="showUpload"
        :acceptFileTypeProp="fileType"
        :limitFileCountProp="fileCount"
        :uploadFileListProp="fileList"
        @fileUploadFuncEv="fileUpload"
      >
      </file-upload>
      <!-- 按钮 -->
      <el-row v-if="uploadButtonVisible">
        <el-button
          style="float: right; margin-left: 10px"
          size="small"
          @click="returnHome"
          >返回</el-button
        >
        <el-button
          style="float: right; margin-left: 10px"
          type="primary"
          size="small"
          @click="fileUploadVisible = true"
          ><i class="el-icon-upload"></i>继续上传
        </el-button>
        <el-popover
          style="float: right; margin-left: 10px"
          placement="bottom-end"
          v-model="variablesVisible"
        >
          <h4 style="border-bottom: 1px solid #e4e7ed; font-weight: bold">
            {{ environment.name }}
          </h4>
          <el-table
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            :data="environment.values"
            class="customer-table"
          >
            <el-table-column prop="key" label="Key" width="100">
            </el-table-column>
            <!-- <el-table-column
              prop="value"
              label="Value"
              width="250"
            >
            </el-table-column> -->
            <el-table-column label="Application">
              <template slot-scope="scope">
                <el-select
                  v-model="environment.values[scope.$index].application"
                  filterable
                  :filter-method="selectApplication"
                  size="small"
                  @visible-change="changeApplication"
                >
                  <el-option
                    v-for="item in targetApplications"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
          <h4 style="border-bottom: 1px solid #e4e7ed; font-weight: bold">
            {{ global.name }}
          </h4>
          <el-table
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            :data="global.values"
            class="customer-table"
          >
            <el-table-column prop="key" label="Key" width="100">
            </el-table-column>
            <el-table-column prop="value" label="Value" width="450">
            </el-table-column>
          </el-table>
          <el-button
            slot="reference"
            icon="el-icon-view"
            style="
              background-color: #e4e7ed;
              color: #909090;
              font-size: 27px;
              padding: 0 10px;
            "
          ></el-button>
        </el-popover>
        <el-select style="float: right" v-model="runEnvironment" size="small">
          <el-option
            v-for="item in environments"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-row>
      <el-row v-if="uploadButtonVisible" style="height: 100%">
        <el-tabs
          v-model="editableTabsValue"
          type="card"
          closable
          @tab-remove="removeTab"
          @tab-click="handleClick"
        >
          <el-tab-pane
            :key="item.name"
            v-for="item in editableTabs"
            :label="item.title"
            :name="item.name"
          >
            <span v-if="!item.saved" slot="label">
              {{ item.title }}
              <i style="color: red">[未保存]</i>
            </span>
            <span v-else slot="label">
              {{ item.title }}
              <i style="color: green">[已保存]</i>
            </span>
          </el-tab-pane>
        </el-tabs>
        <!-- form表单 -->
        <el-form v-if="editableTabs.length > 0">
          <el-form-item
            ><el-input placeholder="请输入用例名称" v-model="form.name"
          /></el-form-item>
          <el-row class="runCaseRow">
            <span v-if="isSaveCase" style="margin-right: 10px">(点击保存按钮保存这条用例)</span>
            <el-button
              @click="saveCase"
              :disabled="!isSaveCase"
              >保存</el-button
            >
            <el-button
              class="runCaseItem"
              type="primary"
              @click="runTheCase"
              >试运行</el-button
            >
          </el-row>
          <el-row>
            <el-form-item style="float: right; width: calc(100% - 67px)">
              <el-input
                v-model="form.url"
                @input="urlChange($event)"
                class="input-with-select"
              >
                <el-select
                  v-model="form.method"
                  slot="prepend"
                  placeholder="请选择"
                  style="width: 130px"
                >
                  <el-option
                    v-for="item in requestMethods"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col
              :span="14"
              style="
                height: calc(100vh - 328px);
                border: 1px solid rgb(228, 231, 237);
              "
            >
              <el-tabs v-model="bodyActiveName" style="padding: 0 10px">
                <el-tab-pane label="Params" name="params">
                  <el-table :data="form.query" border>
                    <el-table-column label="KEY">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.key"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="VALUE">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.value"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="" width="80">
                      <template slot-scope="scope">
                        <el-button
                          @click.native.prevent="
                            deleteRow(scope.$index, form.query)
                          "
                          type="text"
                        >
                          移除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="Headers" name="headers">
                  <el-table :data="form.header" border>
                    <el-table-column label="KEY">
                      <template slot-scope="scope">
                        <span v-if="scope.row.key === 'Content-Type'">{{
                          scope.row.key
                        }}</span>
                        <el-input v-else v-model="scope.row.key"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="VALUE">
                      <template slot-scope="scope">
                        <span v-if="scope.row.key === 'Content-Type'">{{
                          scope.row.value
                        }}</span>
                        <el-input v-else v-model="scope.row.value"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="" width="80">
                      <template slot-scope="scope">
                        <el-button
                          v-if="scope.row.key !== 'Content-Type'"
                          @click.native.prevent="
                            deleteRow(scope.$index, form.header)
                          "
                          type="text"
                        >
                          移除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="Body" name="body">
                  <el-radio-group v-model="bodyType">
                    <el-radio disabled label="none">none</el-radio>
                    <el-radio disabled label="formdata">form-data</el-radio>
                    <el-radio disabled label="xwww"
                      >x-www-form-urlencoded</el-radio
                    >
                    <el-radio disabled label="raw">raw</el-radio>
                  </el-radio-group>
                  <div
                    v-show="bodyType === 'none'"
                    style="text-align: center; margin-top: 50px"
                  >
                    This request does not have a body
                  </div>
                  <el-table
                    v-show="bodyType === 'formdata'"
                    :data="form.formData"
                    border
                  >
                    <el-table-column label="KEY">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.key"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="VALUE">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.value"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="" width="80">
                      <template slot-scope="scope">
                        <el-button
                          @click.native.prevent="
                            deleteRow(scope.$index, form.formData)
                          "
                          type="text"
                        >
                          移除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-show="bodyType === 'xwww'"
                    :data="form.xwww"
                    border
                  >
                    <el-table-column label="KEY">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.key"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="VALUE">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.value"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="" width="80">
                      <template slot-scope="scope">
                        <el-button
                          @click.native.prevent="
                            deleteRow(scope.$index, form.xwww)
                          "
                          type="text"
                        >
                          移除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div v-show="bodyType === 'raw'">
                    <div style="height: 30px">
                      <el-tag v-show="tip !== ''" type="danger">{{
                        tip
                      }}</el-tag>
                    </div>
                    <el-input
                      type="textarea"
                      :rows="15"
                      v-model="form.raw"
                    ></el-input>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="Tests" name="test">
                  <el-tabs
                    v-model="testTabsValue"
                    class="test_card"
                    type="card"
                    closable
                    @tab-remove="handleTabsRemove"
                  >
                    <div class="card_tip" v-if="form.testTabs.length < 1">
                      <span>请添加断言 </span>
                      <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-plus"
                        @click="addTab"
                      ></el-button>
                    </div>
                    <el-tab-pane
                      :key="item.name"
                      v-for="item in form.testTabs"
                      v-else
                      :label="item.title"
                      :name="item.name"
                    >
                      <el-radio-group v-model="item.content.assertType">
                        <el-radio :label="0">normal</el-radio>
                      </el-radio-group>
                      <el-input
                        type="textarea"
                        :rows="10"
                        v-model="item.content.assertContent"
                      ></el-input>
                    </el-tab-pane>
                  </el-tabs>
                  <el-button
                    class="add_btn"
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    @click="addTab"
                  ></el-button>
                </el-tab-pane>
              </el-tabs>
            </el-col>
            <el-col
              :span="10"
              style="
                height: calc(100vh - 328px);
                border: 1px solid rgb(228, 231, 237);
                border-left: none;
              "
            >
              <el-row
                style="
                  background-color: rgb(228, 231, 237);
                  height: 30px;
                  line-height: 30px;
                  font-size: 16px;
                  color: dimgrey;
                  padding-left: 10px;
                "
              >
                Response
              </el-row>
              <el-row
                v-loading="loading"
                element-loading-text="拼命加载中"
                style="margin-top: 20px; margin-left: 20px; font-size: 14px"
              >
                <el-tag :type="tag">{{ statusText[0] }}</el-tag>
                <span>{{ statusText[1] }}</span>
                <div v-if="statusText[3]">
                  <pre
                    style="
                      overflow-y: scroll;
                      height: calc(100vh - 408px);
                      white-space: pre-wrap;
                      word-wrap: break-word;
                    "
                    class="json-result"
                    v-html="statusText[2]"
                  ></pre>
                </div>
                <div v-else v-html="statusText[2]" style="width: 90%"></div>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
        <div v-else class="emptySearch">
          <div class="emptyPrompt"><i class="el-icon-document-add"></i><span class="promptText">请选择接口后进行查询</span></div>
        </div>
      </el-row>
    </el-card>
    <el-dialog
      title="接口文件上传"
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
    </el-dialog>
  </div>
</template>
<script>
import store from 'store'
import fileUpload from '@/components/FileUpload'
import { saveApi, runApi, checkExit } from '@/api/model/singleApiSave'
import { myJoinApplicationSimple } from '@/api/model/singleApiList'
import { uploadApiFile, getApplicationName } from '@/api/model/apiStorage'
import { baseKey } from '@/config/baseConfig.config'

export default {
  name: 'postmanCaseImport',
  components: { fileUpload },
  data () {
    return {
      loading: false,
      testTabsValue: '0',
      testIndex: 0,
      variablesVisible: false,
      runEnvironment: 'qua',
      data: [],
      defaultProps: {
        children: 'item',
        label: 'name'
      },
      fileList: [],
      fileCount: 5,
      fileType: 'har,jmx,json',
      showUpload: true,
      fileUploadVisible: false,
      treeName: '',
      uploadButtonVisible: false,
      editableTabsValue: '1',
      editableTabs: [],
      tabIndex: 0,
      environment: {
        values: [{ application: '', key: '', value: '' }]
      },
      global: {},
      activeApplication: '',
      form: {
        name: '',
        parentName: '',
        method: 'GET',
        url: '',
        query: [],
        header: [],
        formData: [],
        raw: '',
        xwww: [],
        body: null,
        bodyType: 'none',
        protocol: 'http',
        path: [],
        testTabs: [],
        host: [],
        port: []
      },
      requestMethods: [
        { name: 'GET', value: 'GET' },
        { name: 'POST', value: 'POST' }
      ],
      environments: [
        // { name: '日常环境', value: 'daily' },
        { name: 'QA环境', value: 'qua' }
      ],
      applications: [{ name: '', value: '' }],
      targetApplications: [{ name: '', value: '' }],
      bodyActiveName: 'params',
      bodyType: 'none',
      tip: '',
      tag: 'info',
      statusText: ['run', '', '', false],
      isSaveCase: false
    }
  },
  mounted () {
    this.updateTree()
    this.loadVariables()
    this.getOmegaList()
  },
  watch: {
    bodyType: {
      handler (newval, oldval) {
        if (oldval === 'none') {
          switch (newval) {
            case 'formdata': {
              if (this.form.header[0].key !== 'Content-Type') {
                this.form.header.unshift({
                  key: 'Content-Type',
                  value: 'multipart/form-data'
                })
              }
              this.ifAppendElement(this.form.formData)
              break
            }
            case 'xwww': {
              if (this.form.header[0].key !== 'Content-Type') {
                this.form.header.unshift({
                  key: 'Content-Type',
                  value: 'application/x-www-form-urlencoded'
                })
              }
              this.ifAppendElement(this.form.xwww)
              break
            }
            case 'raw': {
              if (this.form.header[0].key !== 'Content-Type') {
                this.form.header.unshift({
                  key: 'Content-Type',
                  value: 'application/json'
                })
              }
              break
            }
          }
        } else {
          switch (newval) {
            case 'none': {
              this.form.header.shift()
              break
            }
            case 'formdata': {
              this.form.header[0].value = 'multipart/form-data'
              this.ifAppendElement(this.form.formData)
              break
            }
            case 'xwww': {
              this.form.header[0].value = 'application/x-www-form-urlencoded'
              this.ifAppendElement(this.form.xwww)
              break
            }
            case 'raw': {
              this.form.header[0].value = 'application/json'
              break
            }
          }
        }
        this.form.bodyType = newval
      },
      deep: true
    },
    form: {
      handler (newval, oldval) {
        this.processURL(newval)
        this.ifAppendElement(newval.query)
        this.ifAppendElement(newval.header)
        this.ifAppendElement(newval.xwww)
        this.ifAppendElement(newval.formData)
        this.isSaveCase = false
        try {
          JSON.parse(newval.raw)
          this.tip = ''
        } catch (e) {
          this.tip = '请输入JSON格式的数据'
        }
      },
      deep: true
    }
  },
  methods: {
    // 文件上传
    fileUpload (param) {
      uploadApiFile(param).then((response) => {
        if (response.success) {
          this.fileUploadVisible = false
          this.showUpload = false
          const str = response.data
          // response.data是按 | 分开的，前面是文件名，后面是解析文件的JSON字符串
          const fileNameArr = str.slice(0, str.indexOf('|')).split('.') // 取出第一个 | 前面的内容，按.拆分开
          const jsonStr = str.slice(str.indexOf('|') + 1)
          // 文件名例子： xxx.collection.json 取出中间的部分，存到不同的localSotarge中
          if (
            fileNameArr[fileNameArr.length - 2].indexOf('collection') !== -1
          ) {
            localStorage.setItem('postmanCollectionObject', jsonStr)
          } else if (
            fileNameArr[fileNameArr.length - 2].indexOf('environment') !== -1
          ) {
            localStorage.setItem('postmanEnvironmentObject', jsonStr)
          } else if (
            fileNameArr[fileNameArr.length - 2].indexOf('globals') !== -1
          ) {
            localStorage.setItem('postmanGlobalsObject', jsonStr)
          }
          this.updateTree()
          this.loadVariables()
          this.getTip()
        } else {
          this.$message({
            message: response.errorMessage,
            type: 'error'
          })
        }
      })
    },
    // 提示信息
    async getTip () {
      const key = `${baseKey}tip2`
      const tip = store.get(key)

      if (!tip) {
        store.set(key, true)
        this.$message({
          message: '运行并断言成功才能保存',
          type: 'warning',
          duration: 5000,
          offset: 50
        })
      }
    },
    // 从localStorage引入环境变量和全局变量并请求应用名
    loadVariables () {
      let envir = {}
      envir =
        JSON.parse(localStorage.getItem('postmanEnvironmentObject')) !== null
          ? JSON.parse(localStorage.getItem('postmanEnvironmentObject'))
          : { values: [], name: '' }
      this.global =
        JSON.parse(localStorage.getItem('postmanGlobalsObject')) !== null
          ? JSON.parse(localStorage.getItem('postmanGlobalsObject'))
          : { values: [], name: '' }
      const promiseList = []
      // 使用Promise.all处理多个请求，所有请求都完成后才有response
      for (let i = 0; i < envir.values.length; i++) {
        const p = new Promise((resolve, reject) => {
          let domain = ''
          // domain没有'/'时，value值就是domain，有'/'时拆成数组，取第一个
          if (envir.values[i].value.indexOf('/') === -1) {
            domain = envir.values[i].value
          } else {
            domain = envir.values[i].value.split('/')[0]
          }
          // 如果domain中没有ziroom.com,没法处理，resolve一个空字符串
          if (domain.indexOf('ziroom.com') === -1) {
            resolve('')
          } else {
            getApplicationName({ domain: domain })
              .then((res) => {
                if (res.success) {
                  resolve(res.data)
                } else {
                  // eslint-disable-next-line prefer-promise-reject-errors
                  reject('error')
                }
              })
              // eslint-disable-next-line prefer-promise-reject-errors
              .catch((e) => reject('error'))
          }
        })
        promiseList.push(p)
      }
      // 下面的res是一个数组，和promiseList顺序一致
      Promise.all(promiseList)
        .then((res) => {
          for (let i = 0; i < envir.values.length; i++) {
            envir.values[i].application = res[i]
          }
          this.environment = envir
        })
        .catch((err) => console.log(err))
    },
    returnHome () {
      this.$router.push({
        path: '/testCase',
        query: {
          name: true
        }
      })
    },
    saveTheCase () {
      this.getRunParams(this.form).then((params) => {
        saveApi(params)
          .then((response) => {
            if (response.success) {
              // 更新本地缓存
              // TODO: 遗留bug
              // const path = this.getTreePath(this.form.node)
              // let nowData = this.data
              // for (let i = 0; i < path.length - 1; i++) {
              //   nowData = nowData.find((value) => value.name === path[i]).item
              // }
              // nowData = nowData.find(
              //   (value) => value.name === path[path.length - 1]
              // )
              // delete nowData.parentName
              // this.FromToData(nowData)
              // const tempObj = JSON.parse(
              //   localStorage.getItem('postmanCollectionObject')
              // )
              // tempObj.item = this.data
              // const str = JSON.stringify(tempObj)
              // localStorage.setItem('postmanCollectionObject', str)
              // this.updateTree(path.slice())
              this.removeTab(this.editableTabsValue)
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: response.errorMessage,
                type: 'error'
              })
            }
          })
          .catch((err) => {
            this.$message({
              message: err,
              type: 'error'
            })
          })
      })
    },
    // 获取所属应用名
    async getOmegaList () {
      const res = await myJoinApplicationSimple()
      const array = []
      for (let i = 0; i < res.data.length; i++) {
        array.push({
          name: res.data[i].applicationName,
          value: res.data[i].applicationName
        })
      }
      this.applications = array
      this.targetApplications = this.applications
    },
    ifAppendElement (value) {
      // 键和值都不是空字符串或者value是空数组，加一行
      if (
        value[value.length - 1] === undefined ||
        (value[value.length - 1].key !== '' &&
          value[value.length - 1].value !== '')
      ) {
        value.push({ key: '', value: '' })
      }
    },
    handleNodeClick (data, node) {
      if (!data.item) {
        data.parentName = node.parent.data.name
        if (data.parentName === undefined) {
          data.parentName = this.treeName
        }
        if (data.request.method === 'GET' || data.request.method === 'POST') {
          let tag = true
          let index = 0
          for (let i = 0; i < this.editableTabs.length; i++) {
            if (this.editableTabs[i].content === data) {
              tag = false
              index = i
              break
            }
          }
          if (tag) {
            const newTabName = ++this.tabIndex + ''
            this.updateForm(data)
            this.getRunParams(this.form).then((params) => {
              // params是false
              if (!params || params === 'noParams') {
                this.editableTabs.push({
                  title: data.name,
                  name: newTabName,
                  content: data,
                  saved: false
                })
                this.editableTabsValue = newTabName
                // 是noParams，代表在环境或全局中没有找到变量
              } else {
                checkExit(params)
                  .then((response) => {
                    if (response.success) {
                      this.editableTabs.push({
                        title: data.name,
                        name: newTabName,
                        content: data,
                        saved: response.data
                      })
                      this.editableTabsValue = newTabName
                    } else {
                      this.editableTabs.push({
                        title: data.name,
                        name: newTabName,
                        content: data,
                        saved: false
                      })
                      this.editableTabsValue = newTabName
                    }
                  })
                  .catch((err) => {
                    this.editableTabs.push({
                      title: data.name,
                      name: newTabName,
                      content: data,
                      saved: false
                    })
                    this.editableTabsValue = newTabName
                  })
              }
            })
            this.editableTabsValue = newTabName
          } else {
            this.editableTabsValue = this.editableTabs[index].name
            this.handleClick({ index: index })
          }
        }
      }
    },
    // 点击一个标签页时，刷新form
    handleClick (tab, event) {
      this.updateForm(this.editableTabs[tab.index].content)
    },
    // 关闭一个标签页，数组中删除对应的元素
    removeTab (targetName) {
      const tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
      if (this.editableTabs.length !== 0) {
        this.updateForm(
          this.editableTabs.find((value) => value.name === activeName).content
        )
      }
    },
    // 左侧树的渲染
    renderContent (h, { node, data }) {
      if (node.childNodes.length !== 0) {
        return (
          <div style="padding: 0 10px;font-size: 14px">
            <i class="el-icon-folder-opened"></i>
            <span> {data.name}</span>
          </div>
        )
      } else {
        if (data.request.method === 'GET') {
          return (
            <div style="padding: 0 10px;font-size: 14px">
              <span style="color: #71d29c;font-size: 13px">
                {data.request.method}
              </span>
              <span> {data.name}</span>
            </div>
          )
        } else if (data.request.method === 'POST') {
          return (
            <div style="padding: 0 10px;font-size: 14px">
              <span style="color: #febb57;font-size: 13px">
                {data.request.method}
              </span>
              <span> {data.name}</span>
            </div>
          )
        } else {
          return (
            <div style="padding: 0 10px;font-size: 14px">
              <span style="color: red;font-size: 13px">
                {data.request.method}
              </span>
              <span> {data.name}</span>
            </div>
          )
        }
      }
    },
    updateTree () {
      const collection = JSON.parse(localStorage.getItem('postmanCollectionObject'))
      this.treeName = collection !== null ? collection.info.name : ''
      this.data = collection !== null ? collection.item : []
      if (collection !== null) {
        this.treeName = collection.info.name
        this.data = collection.item
        this.showUpload = false
        this.uploadButtonVisible = true
      } else {
        this.treeName = ''
        this.data = []
        this.showUpload = true
        this.uploadButtonVisible = false
      }
    },
    updateForm (value) {
      this.bodyActiveName = 'params'
      this.tag = 'info'
      this.statusText = ['run', '']
      this.form.testTabs = []
      this.testTabsValue = '0'
      this.testIndex = 0
      this.form.name = value.name
      this.form.parentName = value.parentName
      this.form.method = value.request.method
      this.form.protocol = value.request.url.protocol
      let domain = value.request.url.host
        ? value.request.url.host.join('.')
        : ''
      if (value.request.url.port) {
        domain += ':' + value.request.url.port[0]
      }
      this.form.path = value.request.url.path
        ? [domain, ...value.request.url.path]
        : [domain]
      if (value.request.url.query) {
        this.form.query = [...value.request.url.query, { key: '', value: '' }]
      } else {
        this.form.query = [{ key: '', value: '' }]
      }
      this.form.body = value.request.body !== null ? value.request.body : null
      if (value.request.body) {
        if (value.request.body.mode === 'formdata') {
          this.bodyType = 'formdata'
          this.form.formData = [
            ...value.request.body.formdata,
            { key: '', value: '' }
          ]
          this.form.header = [
            { key: 'Content-Type', value: 'multipart/form-data' },
            ...value.request.header,
            { key: '', value: '' }
          ]
        } else if (value.request.body.mode === 'raw') {
          this.form.raw = value.request.body.raw
          this.bodyType = 'raw'
          this.form.header = [
            { key: 'Content-Type', value: 'application/json' },
            ...value.request.header,
            { key: '', value: '' }
          ]
        } else if (value.request.body.mode === 'urlencoded') {
          this.form.xwww = [
            ...value.request.body.urlencoded,
            { key: '', value: '' }
          ]
          this.bodyType = 'xwww'
          this.form.header = [
            { key: 'Content-Type', value: 'application/x-www-form-urlencoded' },
            ...value.request.header,
            { key: '', value: '' }
          ]
        }
      } else {
        this.bodyType = 'none'
        this.form.body = null
        this.form.header = [...value.request.header, { key: '', value: '' }]
      }
    },
    // 把form中的内容回填到节点中
    FromToData (data) {
      data.name = this.form.name
      data.request.method = this.form.method
      data.request.url.raw = this.form.url
      if (this.form.query.length > 1) {
        data.request.url.query = this.form.query.slice()
        data.request.url.query.pop()
      }
      data.request.url.path = this.form.path.slice()
      const domain = data.request.url.path.shift()
      const arr = domain.split(':')
      data.request.url.host =
        arr[0].indexOf('{{') !== -1 && arr[0].indexOf('}}') !== -1
          ? [arr[0]]
          : arr[0].split('.')
      if (arr[1]) {
        data.request.url.port = arr[1]
      }
      switch (this.bodyType) {
        case 'none': {
          data.request.body = null
          data.request.header = this.form.header.slice()
          data.request.header.pop()
          break
        }
        case 'formdata': {
          data.request.body.mode = 'formdata'
          data.request.body.formdata = this.form.formData.slice()
          data.request.body.formdata.pop()
          data.request.header = this.form.header.slice()
          data.request.header.pop()
          data.request.header.shift()
          break
        }
        case 'xwww': {
          data.request.body.mode = 'urlencoded'
          data.request.body.urlencoded = this.form.xwww.slice()
          data.request.body.urlencoded.pop()
          data.request.header = this.form.header.slice()
          data.request.header.pop()
          data.request.header.shift()
          break
        }
        case 'raw': {
          data.request.body.mode = 'raw'
          data.request.body.raw = this.form.raw
          data.request.header = this.form.header.slice()
          data.request.header.pop()
          data.request.header.shift()
          break
        }
      }
      let testObj
      if (this.form.testTabs.length > 0) {
        if (data.event) {
          const test = data.event.find((val) => val.listen === 'test')
          if (test) {
            test.script.exec = []
            testObj = test.script.exec
          } else {
            data.event.push({
              listen: 'test',
              script: { type: 'text/javascript', exec: [] }
            })
            testObj = data.event[data.event.length - 1].script.exec
          }
        } else {
          data.event = [
            {
              listen: 'test',
              script: {
                type: 'text/javascript',
                exec: []
              }
            }
          ]
          testObj = data.event[0].script.exec
        }
      }
      for (let i = 0; i < this.form.testTabs.length; i++) {
        testObj.push('pm.test("Body matches string", function () {')
        testObj.push(
          '    pm.expect(pm.response.text()).to.include("' +
            this.form.testTabs[i].content.assertContent +
            '");'
        )
        testObj.push('});')
      }
    },
    runTheCase () {
      // 从form里得到参数，然后判断
      this.getRunParams(this.form).then((params) => {
        // params是false
        if (!params) {
          this.$message({
            message: '环境选择错误',
            type: 'error'
          })
        } else if (params === 'noParams') {
          this.$message({
            message: '找不到变量',
            type: 'error'
          })
        } else {
          this.loading = true
          runApi(params)
            .then((response) => {
              this.loading = false
              if (response.success) {
                // 成功，tag是success
                this.tag = 'success'
                // 看看actualResult是不是JSON格式，（还可能是<pre></pre>）
                try {
                  const str = JSON.stringify(
                    JSON.parse(response.data.actualResult),
                    null,
                    2
                  )
                  // 第四个元素，true代表是JSON，false代表不是
                  this.statusText = ['pass', 'Status code is 200', str, true]
                } catch (e) {
                  this.statusText = [
                    'pass',
                    'Status code is 200',
                    response.data.actualResult,
                    false
                  ]
                }
                // 判断是否可以保存用例
                if (response.data.recordResult === 'FAILURE') {
                  this.$message({
                    message: this.form.testTabs.length < 1
                      ? '未添加断言'
                      : '断言失败',
                    type: 'error'
                  })
                  this.bodyActiveName = 'test'
                } else {
                  this.isSaveCase = true
                }
              } else {
                this.tag = 'danger'
                this.statusText = [
                  'error',
                  response.errorMessage,
                  response.data.actualResult,
                  false
                ]
              }
            })
            .catch((err) => {
              this.loading = false
              this.tag = 'danger'
              this.statusText = ['error', err, '请求失败', true]
            })
        }
      })
    },
    saveCase () {
      this.$confirm('是否保存这条用例?', '用例保存', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'info'
      }).then(() => {
        this.saveTheCase()
      })
    },
    async getRunParams (value) {
      const params = {}
      // 处理请求参数param
      params.requestParam = ''
      for (let i = 0; i < value.query.length - 1; i++) {
        if (
          value.query[i].key.indexOf('{{') === -1 ||
          value.query[i].key.indexOf('}}') === -1
        ) {
          params.requestParam += value.query[i].key + '='
        } else {
          const active = value.query[i].key.slice(
            value.query[i].key.indexOf('{{') + 2,
            value.query[i].key.indexOf('}}')
          )
          const selectedValue = this.global.values.find(
            (value) => value.key === active
          )
          if (selectedValue) {
            params.requestParam += selectedValue.value + '='
          } else {
            const active = value.query[i].key.slice(
              value.query[i].key.indexOf('{{') + 2,
              value.query[i].key.indexOf('}}')
            )
            const selectedValue = this.environment.values.find(
              (value) => value.key === active
            )
            if (selectedValue) {
              params.requestParam += selectedValue.application + '='
            } else {
              return 'noParams'
            }
          }
        }
        if (
          value.query[i].value.indexOf('{{') === -1 ||
          value.query[i].value.indexOf('}}') === -1
        ) {
          params.requestParam += value.query[i].value + '&'
        } else {
          const active = value.query[i].value.slice(
            value.query[i].value.indexOf('{{') + 2,
            value.query[i].value.indexOf('}}')
          )
          const selectedValue = this.global.values.find(
            (value) => value.key === active
          )
          if (selectedValue) {
            params.requestParam += selectedValue.value + '&'
          } else {
            const active = value.query[i].value.slice(
              value.query[i].value.indexOf('{{') + 2,
              value.query[i].value.indexOf('}}')
            )
            const selectedValue = this.environment.values.find(
              (value) => value.key === active
            )
            if (selectedValue) {
              params.requestParam += selectedValue.application + '&'
            } else {
              return 'noParams'
            }
          }
        }
      }
      params.requestParam = params.requestParam.slice(
        0,
        params.requestParam.length - 1
      )
      // 处理header
      params.header = ''
      for (let i = 0; i < value.header.length - 1; i++) {
        params.header +=
          value.header[i].key + ':' + value.header[i].value + ';'
      }
      params.header = params.header.slice(0, params.header.length - 1)
      // 处理请求体
      if (value.method === 'GET') {
        params.requestBody = ''
      } else {
        switch (value.bodyType) {
          case 'none': {
            params.requestBody = ''
            break
          }
          case 'formdata': {
            const obj = {}
            for (let i = 0; i < value.formData.length - 1; i++) {
              obj[value.formData[i].key] = value.formData[i].value
            }
            params.requestBody = JSON.stringify(obj)
            break
          }
          case 'xwww': {
            const obj = {}
            for (let i = 0; i < value.xwww.length - 1; i++) {
              obj[value.xwww[i].key] = value.xwww[i].value
            }
            params.requestBody = JSON.stringify(obj)
            break
          }
          case 'raw': {
            params.requestBody = value.raw
            break
          }
        }
      }
      // 处理断言
      params.assertList = []
      for (let i = 0; i < value.testTabs.length; i++) {
        params.assertList.push(value.testTabs[i].content)
      }
      params.caseName = value.name
      params.requestType = value.method
      params.protocolType = value.protocol ? value.protocol : 'http'
      params.env = this.runEnvironment
      params.requestUri = '/'
      for (let i = 0; i < value.path.length; i++) {
        // 处理application
        if (i === 0) {
          // 没有使用{{}}的方式，手写的域名
          if (
            value.path[i].indexOf('{{') === -1 ||
            value.path[i].indexOf('}}') === -1
          ) {
            if (value.path[i].indexOf('ziroom.com') === -1) {
              return false
            } else {
              let domain = ''
              if (value.path[i].indexOf(':') === -1) {
                domain = value.path[i]
              } else {
                domain = value.path[i].split(':')[0]
              }
              const res = await getApplicationName({ domain: domain })
              if (res.success) {
                params.applicationName = res.data
              } else {
                return false
              }
            }
            // 选择的域名
          } else {
            const active = value.path[i].slice(
              value.path[i].indexOf('{{') + 2,
              value.path[i].indexOf('}}')
            )
            const selectedValue = this.environment.values.find(
              (value) => value.key === active
            )
            if (selectedValue) {
              params.applicationName = selectedValue.application
              if (
                selectedValue.value.substr(
                  selectedValue.value.length - 10,
                  10
                ) !== 'ziroom.com'
              ) {
                const array = selectedValue.value.split('/')
                array.shift()
                for (let i = 0; i < array.length; i++) {
                  params.requestUri += array + '/'
                }
              }
            } else {
              const active = value.path[i].slice(
                value.path[i].indexOf('{{') + 2,
                value.path[i].indexOf('}}')
              )
              const selectedValue = this.global.values.find(
                (value) => value.key === active
              )
              if (selectedValue) {
                if (selectedValue.value.indexOf('ziroom.com') === -1) {
                  return false
                } else {
                  let domain
                  if (
                    selectedValue.value.substr(
                      selectedValue.value.length - 10,
                      10
                    ) === 'ziroom.com'
                  ) {
                    domain = selectedValue.value
                  } else {
                    const arr = selectedValue.value.split('/')
                    domain = arr.shift()
                    for (let i = 0; i < arr.length; i++) {
                      params.requestUri += arr + '/'
                    }
                  }
                  const res = await getApplicationName({ domain: domain })
                  if (res.success) {
                    params.applicationName = res.data
                  } else {
                    return false
                  }
                }
              } else {
                return false
              }
            }
          }
          // 处理path
        } else {
          if (
            value.path[i].indexOf('{{') === -1 ||
            value.path[i].indexOf('}}') === -1
          ) {
            params.requestUri += value.path[i] + '/'
          } else {
            const active = value.path[i].slice(
              value.path[i].indexOf('{{') + 2,
              value.path[i].indexOf('}}')
            )
            const selectedValue = this.global.values.find(
              (value) => value.key === active
            )
            if (selectedValue) {
              params.requestUri += selectedValue.value + '/'
            } else {
              params.requestUri += value.path[i] + '/'
            }
          }
        }
      }
      params.requestUri = params.requestUri.slice(
        0,
        params.requestUri.length - 1
      )
      params.controllerName = value.parentName
      return params
    },
    // 下拉菜单打开，tag是false
    changeApplication (tag) {
      if (!tag) {
        this.targetApplications = this.applications
      }
    },
    // 选择应用名
    selectApplication (query) {
      if (query === '') {
        this.targetApplications = this.applications
      } else {
        this.targetApplications = this.applications.filter((item) => {
          return item.name.indexOf(query) > -1
        })
      }
    },
    // 由input框调用，来改变form里的path和query两个数组
    urlChange (event) {
      const index = event.indexOf('?')
      let path, query
      if (index === -1) {
        query = []
        if (event.substr(0, 7) === 'http://') {
          path = event.replace('http://', '').split('/')
        } else if (event.substr(0, 8) === 'https://') {
          path = event.replace('https://', '').split('/')
        } else {
          path = event.split('/')
        }
      } else {
        path = event.slice(0, index)
        if (path.substr(0, 7) === 'http://') {
          path = path.replace('http://', '').split('/')
        } else if (path.substr(0, 8) === 'https://') {
          path = path.replace('https://', '').split('/')
        } else {
          path = path.split('/')
        }
        query = event.slice(index + 1).split('&')
      }
      this.form.path = path
      for (let i = 0; i < query.length; i++) {
        const index = query[i].indexOf('=')
        let key, value
        if (index === -1) {
          key = query[i]
          value = ''
        } else {
          key = query[i].slice(0, index)
          value = query[i].slice(index + 1)
        }
        query[i] = { key: key, value: value }
      }
      query.push({ key: '', value: '' })
      this.form.query = query
    },
    // 由watch调用，每次form有变化都会对url进行处理
    processURL (value) {
      if (value.name === 'Untitled Request') {
        this.form.url = ''
      } else {
        let temp = value.path.join('/')
        let params = ''
        if (value.query.length > 1) {
          for (let i = 0; i < value.query.length - 1; i++) {
            params += value.query[i].key + '=' + value.query[i].value + '&'
          }
          params = params.slice(0, params.length - 1)
          temp = temp + '?'
        }
        this.form.url = temp + params
      }
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    // 移除断言
    handleTabsRemove (targetName) {
      const tabs = this.form.testTabs
      let activeName = this.testTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }

      this.testTabsValue = activeName
      this.form.testTabs = tabs.filter((tab) => tab.name !== targetName)
    },
    addTab (targetName) {
      const newTabName = ++this.testIndex + ''
      this.form.testTabs.push({
        title: '断言' + newTabName,
        name: newTabName,
        content: { assertContent: '', assertType: 0 }
      })
      this.testTabsValue = newTabName
    }
  }
}
</script>
<style scoped lang="scss">
.postman {
  display: grid;
  grid-template-columns: 310px 1fr;
  grid-gap: 15px;
  height: 100%;
}
.test_card {
  position: relative;
  width: 100%;
  // height: 20vh;
  .card_tip {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 10vh auto;
    font-size: 24px;
    span {
      margin-right: 4px;
      font-weight: 700;
      color: #e6a23c;
    }
  }
}
.add_btn {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
<style lang="scss">
.el-popover {
  height: 50%;
  overflow: auto;
}
// 去掉表格单元格边框
.customer-table th {
  border: none;
}
.customer-table td,
.customer-table th.is-leaf {
  border: none;
}
.customer-table::before {
  width: 0;
}
.customer-table .el-table__fixed-right::before,
.el-table__fixed::before {
  width: 0;
}
pre {
  white-space: pre-wrap; /* CSS-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}
.test_card {
  .el-tabs__header {
    padding-right: 60px;
  }
}
.emptySearch {
  text-align: center;
  height: 500px;
  line-height: 500px;
  .emptyPrompt {
    .promptText {
      margin-left: 10px;
    }
  }
}
.runCaseRow {
  text-align: right;
  .runCaseitem {
    margin-left: 10px;
  }
}
</style>
