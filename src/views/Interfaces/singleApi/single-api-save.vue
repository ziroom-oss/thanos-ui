<template>
  <div class="app-container">
    <div class="common-container">
      <el-row :gutter="10">
        <el-col :xs="3" :sm="3" :md="4" :lg="3">
          <el-select
            v-model="initObj.apiType"
            @change="changeType(initObj.apiType)"
            value=""
          >
            <el-option label="GET" value="GET"></el-option>
            <el-option label="POST" value="POST"></el-option>
            <el-option label="PUT" value="PUT"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="3">
          <el-select v-model="initObj.encrypt" value="">
            <el-option label="不加密" value="0"></el-option>
            <el-option label="网关加密" value="1"></el-option>
            <el-option label="服务加密" value="2"></el-option>
            <el-option label="民宿加密" value="3"></el-option>
            <el-option label="自如驿加密" value="4"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="13" :sm="13" :md="12" :lg="15">
          <el-input
            v-model="initObj.url"
            placeholder="请输入录入的URL"
            @blur="showbelong"
          ></el-input>
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="3">
          <el-select v-model="initObj.isRelyApi" value="">
            <el-option label="非依赖接口" value="0"></el-option>
            <el-option label="依赖接口" value="1"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row v-if="initObj.showParamForm">
        <el-col :xs="3" :sm="3" :md="3" :lg="3">
          <div class="grid-content pri-font">接口参数:</div>
        </el-col>
        <el-col :xs="16" :sm="16" :md="16" :lg="19">
          <div class="grid-content">
            <el-input
              class="grid-content"
              type="textarea"
              :autosize="{ minRows: 8 }"
              placeholder="点击发送按钮后会在此处显示结果"
              v-model="initObj.param"
            >
            </el-input>
          </div>
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="2" class="btn-group">
          <el-button
            type="primary"
            size="mini"
            plain
            style="margin: 10px 10px 10px 10px"
            @click="cryptParam(1)"
            >参数加密
          </el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            style="margin-bottom: 10px"
            @click="cryptParam(2)"
            >参数解密
          </el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            style="margin-bottom: 10px"
            @click="cryptParam(3)"
            >业务加密
          </el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            style="margin-bottom: 10px"
            @click="cryptParam(4)"
            >业务解密
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" justify="center">
        <el-col :span="8" :offset="3">
          <el-button
            type="primary"
            size="small"
            @click="addSql(hideInfo.showSqlForm)"
          >
            <i class="el-icon-circle-plus el-icon--left"></i>SQL语句
          </el-button>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-button
            type="primary"
            size="small"
            @click="addHeader(hideInfo.showHeaderForm)"
          >
            <i class="el-icon-circle-plus el-icon--left"></i>HEAD
          </el-button>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-button
            type="primary"
            size="small"
            @click="addRely(hideInfo.showRelyForm)"
          >
            <i class="el-icon-circle-plus el-icon--left"></i>依赖API
          </el-button>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-button type="primary" size="small" @click="addMqRely()">
            <i
              :class="
                hideInfo.showMqRelyForm
                  ? 'el-icon-remove'
                  : 'el-icon-circle-plus'
              "
              class="el-icon--left"
            ></i
            >依赖MQ
          </el-button>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-button type="primary" size="small" @click="addEsRely()">
            <i
              :class="
                hideInfo.showEsRelyForm
                  ? 'el-icon-remove'
                  : 'el-icon-circle-plus'
              "
              class="el-icon--left"
            ></i
            >依赖ES
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="hideInfo.showSqlForm">
        <div v-for="item in sqlForm.items" :key="item.key">
          <el-col :xs="3" :sm="3" :md="3" :lg="3" style="padding-bottom: 10px">
            <el-select
              v-model="item.sqlType"
              @change="reloadSqlList(item)"
              value=""
            >
              <el-option label="前置SQL" value="1"></el-option>
              <el-option label="后置SQL" value="0"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="4" :sm="4" :md="4" :lg="3" style="padding-bottom: 10px">
            <el-select
              v-model="item.sqlName"
              filterable
              placeholder="请选择SQL名称"
              clearable
              @change="displaySqlDetail(item)"
              value=""
            >
              <el-option
                v-for="sql in item.sqlList"
                :key="sql.id"
                :value="sql.sqlName"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col
            :xs="15"
            :sm="15"
            :md="15"
            :lg="16"
            style="padding-bottom: 10px"
          >
            <el-input v-model="item.sqlDetail" :disabled="true">
              <template slot="prepend">用例所含SQL</template>
            </el-input>
          </el-col>
          <el-col :xs="1" :sm="1" :md="1" :lg="1" style="padding-bottom: 10px">
            <el-button
              @click.prevent="removeSqlList(item)"
              icon="el-icon-minus"
              type="primary"
              size="mini"
              circle
              plain
            ></el-button>
          </el-col>
        </div>
        <el-col :span="1">
          <el-button
            icon="el-icon-plus"
            type="primary"
            size="mini"
            circle
            @click="addItem"
            plain
          ></el-button>
        </el-col>
      </el-row>
      <el-row v-if="hideInfo.showHeaderForm">
        <el-col :span="3">
          <div class="grid-content pri-font">头部信息:</div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content">
            <el-input
              class="grid-content"
              type="textarea"
              :autosize="{ minRows: 7 }"
              placeholder="Accept: application/json;version=2"
              v-model="hideInfo.header"
            >
            </el-input>
          </div>
        </el-col>
        <el-col :span="3">
          <el-radio
            v-model="radio"
            label="1"
            style="margin: 10px 10px 12px 10px"
            @change="urlHeaders(1)"
          >
            x-www-form-urlencoded
          </el-radio>
          <el-radio
            v-model="radio"
            label="2"
            style="margin: 10px 60px 12px 10px"
            @change="urlHeaders(2)"
          >
            JavaScript
          </el-radio>
          <el-radio
            v-model="radio"
            label="3"
            style="margin: 10px 80px 12px 10px"
            @change="urlHeaders(3)"
          >
            JSON
          </el-radio>
          <el-radio
            v-model="radio"
            label="4"
            style="margin: 10px 10px 12px 10px"
            @change="urlHeaders(4)"
          >
            Text
          </el-radio>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="hideInfo.showRelyForm">
        <el-col :xs="5" :sm="5" :md="6" :lg="4">
          <el-select
            v-model="hideInfo.relyApiId"
            filterable
            placeholder="请选择依赖API"
            @change="displayRelyUri"
            clearable
            value=""
          >
            <el-option
              v-for="item in relyList"
              :key="item.id"
              :value="item.id"
              :label="item.caseName"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="19" :sm="19" :md="18" :lg="20">
          <el-input v-model="hideInfo.relyApiDetail" :disabled="true">
            <template slot="prepend">依赖API地址:</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="hideInfo.showMqRelyForm">
        <el-col :xs="5" :sm="5" :md="6" :lg="4">
          <el-select
            v-model="hideInfo.relyMqId"
            filterable
            placeholder="请选择依赖MQ消息"
            @change="getMqRelyTopic"
            clearable
            value=""
          >
            <el-option
              v-for="item in relyMqList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="19" :sm="19" :md="18" :lg="20">
          <el-input v-model="hideInfo.relyMqTopic" :disabled="true">
            <template slot="prepend">MQ消息主题:</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="hideInfo.showEsRelyForm">
        <el-col :xs="5" :sm="5" :md="6" :lg="4">
          <el-select
            v-model="hideInfo.relyEsId"
            filterable
            placeholder="请选择依赖ES数据项"
            @change="getEsRelyName"
            clearable
            value=""
          >
            <el-option
              v-for="item in relyEsList"
              :key="item.id"
              :value="item.id"
              :label="item.configName"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="19" :sm="19" :md="18" :lg="20">
          <el-input v-model="hideInfo.relyEsName" :disabled="true">
            <template slot="prepend">ES依赖名称:</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <div class="grid-content pri-font">运行结果:</div>
        </el-col>
        <el-col :span="21">
          <el-scrollbar
            style="height: 164px"
            :wrapStyle="[{ 'overflow-x': 'hidden' }]"
          >
            <json-viewer
              class="grid-content"
              :value="initObj.result"
              :expand-depth="5"
              copyable
              boxed
              sort
            >
            </json-viewer>
          </el-scrollbar>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-button-group style="float: right">
          <el-button type="success" size="mini" @click="runT"
            >T环境发送</el-button
          >
          <el-button type="warning" size="mini" @click="runQ"
            >Q环境发送</el-button
          >
        </el-button-group>
      </el-row>
    </div>
    <br />
    <br />
    <div class="common-container">
      <el-row :gutter="10" type="flex" justify="center">
        <el-col :xs="4" :sm="5" :md="5" :lg="3">
          <el-input
            v-model="initObj.systemObj.systemName"
            placeholder="默认系统名称"
          ></el-input>
        </el-col>
        <el-col :xs="4" :sm="5" :md="5" :lg="3">
          <el-select
            v-model="initObj.businessLine"
            filterable
            placeholder="请选择业务线"
            clearable
            value=""
          >
            <el-option
              v-for="item in businessList"
              :key="item.businessCode"
              :value="item.businessCode"
              :label="item.businessName"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="4" :sm="5" :md="5" :lg="3">
          <el-select
            v-model="initObj.deptInfo"
            filterable
            placeholder="请选择部门信息"
            clearable
            value=""
          >
            <el-option
              v-for="dept in depts"
              :key="dept.deptCode"
              :value="dept.deptName"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="5" :sm="6" :md="6" :lg="7">
          <el-input placeholder="请输入接口名称" v-model="initObj.apiName">
            <template slot="prepend" class="bg-template">接口名称:</template>
          </el-input>
        </el-col>
        <el-col :xs="5" :sm="5" :md="4" :lg="11">
          <el-input placeholder="请输入用例名称" v-model="initObj.apiCaseName">
            <template slot="prepend" class="bg-template">用例名称:</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <smart-assert
          ref="smartAssert"
          :smart-assert-prop="this.smartAssertProp"
          :assert-list-prop="this.assertListProp"
        >
        </smart-assert>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="如有需要，添加备注信息"
            v-model="initObj.common"
          >
            <template slot="prepend" class="bg-template">备注:</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-button
          type="primary"
          size="primary"
          style="float: right"
          @click="saveInfo"
          >保存</el-button
        >
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  cryptParam,
  getbelong,
  getBusiList,
  getDeptList,
  getRelyList,
  getSqlList,
  runApi,
  saveApi
} from '@/api/model/singleApiSave'
import { getMockMqMsgInfo, getMockMsgList } from '@/api/model/mockMqMsg'
import {
  getEsSearchConditionById,
  getEsSearchConditionList
} from '@/api/model/esSearchConfiguration'
import JsonViewer from 'vue-json-viewer'
import smartAssert from './components/smart-assert'

export default {
  components: { JsonViewer, smartAssert },
  data () {
    return {
      initObj: {
        apiType: 'POST',
        encrypt: '0',
        url: '',
        isRelyApi: '0',
        result: '',
        systemObj: {
          systemName: '',
          systemId: ''
        },
        businessLine: '',
        deptInfo: '',
        apiCaseName: '',
        assert: '',
        common: '',
        showParamForm: true,
        param: '',
        apiName: '',
        assertType: 0,
        assertList: []
      },
      hideInfo: {
        header: '',
        showSqlForm: false,
        showHeaderForm: false,
        showRelyForm: false,
        showMqRelyForm: false,
        showEsRelyForm: false,
        relyApiId: '',
        relyApiDetail: '',
        relyMqId: '',
        relyMqTopic: '',
        relyEsId: '',
        relyEsName: ''
      },
      sqlForm: {
        items: [
          {
            sqlType: '1',
            sqlId: '',
            sqlName: '',
            sqlDetail: '',
            sqlList: [
              {
                sqlName: '',
                id: '',
                sqlData: ''
              }
            ]
          }
        ]
      },
      // 业务线列表信息
      businessList: [
        {
          businessName: '',
          businessCode: ''
        }
      ],
      depts: [
        {
          deptCode: '',
          deptName: ''
        }
      ],
      relyList: [
        {
          id: '',
          relyId: '',
          caseName: '',
          requestUri: ''
        }
      ],
      relyMqList: [],
      relyEsList: [],
      radio: '',
      smartAssertProp: {
        titleHeight: 'height:50px',
        radioMargin: 'margin:20px 10px 10px 10px'
      },
      assertListProp: [{ assertContent: '', assertType: 1 }],
      businessLineName: ''
    }
  },
  created () {
    this.getBusiList()
    this.getDeptList()
  },
  methods: {
    isJSON (str) {
      if (typeof str === 'string') {
        try {
          var obj = JSON.parse(str)
          return !!(typeof obj === 'object' && obj)
        } catch (e) {
          return false
        }
      }
    },
    // api类型切换，form展开/折叠
    changeType (type) {
      this.initObj.showParamForm = type === 'POST'
      this.initObj.showParamForm = type === 'PUT'
    },
    // sql增加的时候，form展开/折叠
    addSql (showSqlForm) {
      this.hideInfo.showSqlForm = !this.hideInfo.showSqlForm
      this.getSqlList(this.sqlForm.items[0].sqlType)
    },
    // header增加的时候，form展开/折叠
    addHeader () {
      this.hideInfo.showHeaderForm = !this.hideInfo.showHeaderForm
      this.hideInfo.header = ''
      this.radio = ''
    },
    // 依赖增加的时候，form展开/折叠
    addRely () {
      this.hideInfo.showRelyForm = !this.hideInfo.showRelyForm
      this.getRelyList()
    },
    addMqRely () {
      this.hideInfo.showMqRelyForm = !this.hideInfo.showMqRelyForm
      if (!this.hideInfo.showMqRelyForm) {
        this.hideInfo.relyMqId = ''
        this.hideInfo.relyMqTopic = ''
      }
      this.getMqRelyList()
    },
    addEsRely () {
      this.hideInfo.showEsRelyForm = !this.hideInfo.showEsRelyForm
      if (!this.hideInfo.showEsRelyForm) {
        this.hideInfo.relyEsId = ''
        this.hideInfo.relyEsName = ''
      }
      this.getEsRelyList()
    },
    // sql增加前/后置
    addItem () {
      var sqlType = '1'
      var sqlList = []
      getSqlList({ isPrep: sqlType }).then((response) => {
        sqlList = response.data
        this.sqlForm.items.push({
          sqlType: sqlType,
          sqlName: '',
          sqlDetail: '',
          sqlList: sqlList
        })
      })
    },
    // 移除sql前/后置
    removeSqlList (item) {
      var index = this.sqlForm.items.indexOf(item)
      if (index !== -1) {
        this.sqlForm.items.splice(index, 1)
      }
    },
    // 获取业务线列表
    getBusiList () {
      getBusiList().then((response) => {
        this.businessList = response.data
      })
    },
    // 获取部门列表
    getDeptList () {
      getDeptList().then((response) => {
        this.depts = response.data
      })
    },
    // 初始化加载--获取sql列表
    getSqlList (sqlType) {
      getSqlList({ isPrep: sqlType }).then((response) => {
        this.sqlForm.items[0].sqlList = response.data
      })
    },
    // 切换sqlType--获取sql列表
    reloadSqlList (item) {
      var type = item.sqlType
      var index = this.sqlForm.items.indexOf(item)
      getSqlList({ isPrep: type }).then((response) => {
        this.sqlForm.items[index].sqlList = response.data
      })
    },
    // 选择的sql名称后，显示详细的sql信息sqlDetail
    displaySqlDetail (item) {
      // console.log(JSON.stringify(item));
      var index = this.sqlForm.items.indexOf(item)
      var sqlList = this.sqlForm.items[index].sqlList
      for (var i = 0; i < sqlList.length; i++) {
        var sqlObj = sqlList[i]
        if (item.sqlName === sqlObj.sqlName) {
          this.sqlForm.items[index].sqlId = sqlObj.id
          this.sqlForm.items[index].sqlDetail = sqlObj.sqlData
        }
      }
    },
    // 获取relyList
    getRelyList () {
      getRelyList({ caseName: null }).then((response) => {
        this.relyList = response.data
      })
    },
    // 获取relyMqList
    getMqRelyList () {
      getMockMsgList({ pageNum: 1, pageSize: 10000 }, {}).then((response) => {
        this.relyMqList = response.data.records
      })
    },
    // 获取relyEsList
    getEsRelyList () {
      getEsSearchConditionList({ pageNum: 1, pageSize: 10000 }, {}).then(
        (response) => {
          if (response.success) {
            this.relyEsList = response.data.records
          }
        }
      )
    },
    // 获取依赖对应的uri
    displayRelyUri () {
      for (var i = 0; i < this.relyList.length; i++) {
        if (parseInt(this.hideInfo.relyApiId) === this.relyList[i].id) {
          this.hideInfo.relyApiDetail = this.relyList[i].requestUri
        }
      }
    },
    // 获取MQ依赖对应的消息主题Topic
    getMqRelyTopic () {
      if (this.hideInfo.relyMqId !== '') {
        getMockMqMsgInfo({ id: this.hideInfo.relyMqId }).then((response) => {
          if (response.success) {
            this.hideInfo.relyMqTopic = response.data.topic
          }
        })
      } else {
        this.hideInfo.relyMqTopic = ''
      }
    },
    // 获取ES依赖对应的配置项名称
    getEsRelyName () {
      if (this.hideInfo.relyEsId !== '') {
        getEsSearchConditionById({ id: this.hideInfo.relyEsId }).then(
          (response) => {
            if (response.success) {
              this.hideInfo.relyEsName =
                response.data.configName +
                '【索引名称:' +
                response.data.indexName +
                '】'
            }
          }
        )
      } else {
        this.hideInfo.relyEsName = ''
      }
    },
    // 输入url，自动带出系统，业务线，组信息
    showbelong () {
      var re = new RegExp(/(http|https):\/\/([\w.]+\/?)\S*/)
      if (this.initObj.url !== '') {
        if (!re.test(this.initObj.url)) {
          this.$message({
            message: 'url格式不正确，请以http:///https://开头!',
            type: 'error'
          })
        }
      }
      getbelong({ url: this.initObj.url }).then((response) => {
        if (response.success) {
          var belongList = response.data
          console.log(belongList)
          this.initObj.systemObj.systemName = belongList.systemName
          this.initObj.systemObj.systemId = belongList.systemId
          this.initObj.businessLine = belongList.businessLineCode
          this.initObj.deptInfo = belongList.deptName
          this.initObj.apiName = belongList.apiName
          this.businessLineName = belongList.businessLineName
          var arr = Object.keys(response.data)
          if (arr.length === 0) {
            this.$message({
              message: '该系统信息不存在，请至【域名管理】模块维护！',
              type: 'warning'
            })
          }
        } else {
          this.$message({
            message: response.errorMessage,
            type: 'warning'
          })
        }
      })
    },
    saveInfo () {
      if (this.initObj.apiCaseName === '') {
        this.$message({
          message: '请输入用例名称',
          type: 'warning'
        })
        return false
      }
      if (this.initObj.url === '') {
        this.$message({
          message: '请输入URL',
          type: 'warning'
        })
        return false
      }
      this.getAssertResult()
      if (this.initObj.assertList.length === 0) {
        this.$message({
          message: '请输入断言',
          type: 'warning'
        })
        return false
      }
      var list = this.dtoSave()
      saveApi(list).then((response) => {
        if (response.success) {
          this.$confirm(
            '用例已成功保存在<strong>' +
              this.businessLineName +
              '</strong>下，您可在该业务线或者单接口搜索页面找到~ 是否清除当前页面数据？',
            '温馨提示',
            {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确认清除',
              cancelButtonText: '不清除',
              type: 'warning'
            }
          )
            .then(() => {
              this.initObj = {
                apiCaseName: '',
                common: '',
                encrypt: '',
                assert: '',
                assertType: 0,
                param: '',
                apiType: '',
                url: '',
                isRelyApi: '',
                businessLine: '',
                deptInfo: '',
                systemObj: {
                  systemName: '',
                  systemId: ''
                }
              }
              this.assertContentProp = {
                assertType: 1,
                assertContent: ''
              }
              this.relyList = [
                {
                  id: '',
                  relyId: '',
                  caseName: '',
                  requestUri: ''
                }
              ]
              this.hideInfo = {
                header: '',
                showSqlForm: false,
                showHeaderForm: false,
                showRelyForm: false,
                showMqRelyForm: false,
                showEsRelyForm: false,
                relyApiId: '',
                relyApiDetail: '',
                relyMqId: '',
                relyMqTopic: '',
                relyEsId: '',
                relyEsName: ''
              }
              this.sqlForm = {
                items: [
                  {
                    sqlType: '1',
                    sqlId: '',
                    sqlName: '',
                    sqlDetail: '',
                    sqlList: [
                      {
                        sqlName: '',
                        id: '',
                        sqlData: ''
                      }
                    ]
                  }
                ]
              }
              this.initObj.result = ''
              this.initObj.apiName = ''
            })
            .catch(() => {})
        }
      })
    },
    // 分离前置后置
    segmentSqlIds () {
      var postSqlIds = ''
      var preSqlIds = ''
      var sqlItems = this.sqlForm.items
      for (var i = 0; i < sqlItems.length; i++) {
        if (sqlItems[i].sqlType === '1') {
          preSqlIds += sqlItems[i].sqlId + ','
        } else if (sqlItems[i].sqlType === '0') {
          postSqlIds += sqlItems[i].sqlId + ','
        }
      }
      postSqlIds = postSqlIds.substring(0, postSqlIds.length - 1)
      preSqlIds = preSqlIds.substring(0, preSqlIds.length - 1)
      var obj = { postSqlIds: postSqlIds, preSqlIds: preSqlIds }
      return obj
    },
    runT () {
      if (this.initObj.url === '') {
        this.$message({
          message: '请输入URL',
          type: 'warning'
        })
        return false
      }
      var list = this.dtoSave()
      list.env = 't'
      this.runApi(list)
    },
    runQ () {
      if (this.initObj.url === '') {
        this.$message({
          message: '请输入URL',
          type: 'warning'
        })
        return false
      }
      var list = this.dtoSave()
      list.env = 'q'
      this.runApi(list)
    },
    dtoSave () {
      const obj = this.segmentSqlIds()
      return {
        caseName: this.initObj.apiCaseName,
        comment: this.initObj.common,
        encryptType: this.initObj.encrypt,
        expectedResults: this.initObj.assert,
        assertType: this.initObj.assertType,
        header: this.hideInfo.header,
        param: this.initObj.param,
        postSqlIds: obj.postSqlIds,
        preSqlIds: obj.preSqlIds,
        relyId: this.hideInfo.relyApiId,
        relyMqId: this.hideInfo.relyMqId,
        relyEsId: this.hideInfo.relyEsId,
        requestType: this.initObj.apiType,
        systemId: this.initObj.systemObj.systemId,
        url: this.initObj.url,
        isRely: this.initObj.isRelyApi,
        apiName: this.initObj.apiName,
        assertList: this.initObj.assertList
      }
    },
    runApi (list) {
      runApi(list).then((response) => {
        if (response.success) {
          if (this.isJSON(response.data.returnValue)) {
            this.initObj.result = JSON.parse(response.data.returnValue)
          } else {
            this.initObj.result = response.data.returnValue
          }
          this.$message({
            message: '运行成功',
            type: 'success'
          })
        } else {
          this.$alert(response.errorMessage, '运行失败', {})
        }
      })
    },
    cryptParam (flag) {
      var obj = {
        flag: flag,
        param: this.initObj.param,
        encryptValue: this.initObj.encrypt
      }
      var params = new URLSearchParams()
      for (const item in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, item)) {
          params.append(item, obj[item])
        }
      }
      cryptParam(params).then((response) => {
        if (response.success) {
          this.initObj.param = response.data
        }
      })
    },
    urlHeaders (flag) {
      var contentType = 'Content-Type:'
      switch (flag) {
        case 1:
          this.hideInfo.header =
            contentType + 'application/x-www-form-urlencoded'
          break
        case 2:
          this.hideInfo.header = contentType + 'application/javascript'
          break
        case 3:
          this.hideInfo.header = contentType + 'application/json'
          break
        case 4:
          this.hideInfo.header = contentType + 'text/plain'
          break
        default:
          break
      }
    },
    getAssertResult () {
      this.assertListProp = []
      const tabs = this.$refs.smartAssert.editableTabs
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].assertRadio === '1') {
          if (tabs[i].schemaContent instanceof Object) {
            tabs[i].schemaContent = JSON.stringify(tabs[i].schemaContent)
          }
          const verifyData = tabs[i].schemaContent
            .replace(/\r\n/g, '')
            .replace(/\n/g, '')
          const assertType = 1
          this.assertListProp.push({
            id: tabs[i].id,
            assertContent: verifyData,
            assertType: assertType
          })
        } else if (tabs[i].assertRadio === '2') {
          const verifyData = this.getJsonPathAssert(tabs[i])
          const assertType = 2
          this.assertListProp.push({
            id: tabs[i].id,
            assertContent: verifyData,
            assertType: assertType
          })
        } else if (tabs[i].assertRadio === '3') {
          const verifyData = tabs[i].methodContent
          const assertType = 3
          this.assertListProp.push({
            id: tabs[i].id,
            assertContent: verifyData,
            assertType: assertType
          })
        } else {
          const verifyData = tabs[i].normalContent
          const assertType = 0
          this.assertListProp.push({
            id: tabs[i].id,
            assertContent: verifyData,
            assertType: assertType
          })
        }
      }
      this.initObj.assertList = this.assertListProp
    },
    getJsonPathAssert (tab) {
      let content = ''
      const array = tab.pathContent
      for (let i = 0; i < array.length; i++) {
        content +=
          array[i].express +
          array[i].operator +
          array[i].expectValue +
          array[i].link
      }
      if (content.substring(content.length - 4) === 'null') {
        return content.substring(0, content.length - 4)
      }
      return content
    }
  }
}
</script>

<style lang='scss' scoped>
.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}

.pri-font {
  font-size: 15px;
  color: #909399;
  background-color: #f5f7fa;
  text-align: center;
  font-weight: normal;
  white-space: nowrap;
  vertical-align: middle;
  padding-top: 60px;
  border: 1px solid #e4e4e4;
}

.grid-content {
  border-radius: 4px;
  min-height: 164px;
}

.bg-template {
  color: black;
}
.el-button-group .el-button {
  width: 50%;
}
.btn-group .el-button {
  width: 100%;
}
.app-container {
  width: 100%;
}
</style>
