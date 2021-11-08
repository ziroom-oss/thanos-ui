<template>
    <div>
        <el-table
                ref="multiStepTable"
                v-loading="listLoading"
                :data.sync="multiStepTableList"
                row-key="apiName"
                border
                fit
                highlight-current-row
                style="width: 100%"
        >
            <el-table-column label="步骤Id" align="center" width="70">
                <template slot-scope="scope">
                    <span>{{ scope.$index +1 }}</span>
                </template>
            </el-table-column>

            <el-table-column width="80" align="center" label="步骤类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.dataType === 0">SQL</span>
                    <span v-if="scope.row.dataType === 1">单接口</span>
                    <span v-else>用例</span>
                </template>
            </el-table-column>

            <el-table-column width="140" label="接口/SQL/场景ID" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.apiId }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="名称" prop="apiName" :edit-render="{name: 'ElInput'}">
                <template slot-scope="scope">
                    <span @click="paramEdit(scope.$index,scope.row)"
                          style="text-overflow: ellipsis;word-break:keep-all;white-space:nowrap;overflow:hidden;"
                          class="link-type">{{ scope.row.apiName }}</span>

                </template>
            </el-table-column>

            <el-table-column label="uri/sql" prop="content">
                <template slot-scope="scope">
                    <span @click="contentEdit(scope.$index,scope.row)"
                          style="text-overflow: ellipsis;word-break:keep-all;white-space:nowrap;overflow:hidden;"
                          class="link-type">{{ scope.row.content }}</span>
                </template>
            </el-table-column>

            <el-table-column label="分类执行步骤" width="130px" :edit-render="{name: 'ElInput'}" prop="stepName"
                             align="center" v-if="colShow">
                <template slot-scope="scope">
                    <span v-if="scope.row.stepName ==='' ||scope.row.stepName ===null  "
                          @click="stepNameEdit(scope.$index,scope.row)"
                          style="text-overflow: ellipsis;word-break:keep-all;white-space:nowrap;overflow:hidden;"
                          class="link-type">+</span>
                    <span v-else @click="stepNameEdit(scope.$index,scope.row)"
                          style="text-overflow: ellipsis;word-break:keep-all;white-space:nowrap;overflow:hidden;"
                          class="link-type">{{ scope.row.stepName }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="300px" fixed="right" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="inparamEdit(scope.$index,scope.row)"
                    >入参
                    </el-button>
                    <el-button type="text" size="mini" @click="outparamEdit(scope.$index,scope.row)"
                    >出参
                    </el-button>
                    <el-button type="text" size="mini" @click="verifyEdit(scope.$index,scope.row)"
                    >验证点
                    </el-button>
                    <el-button type="text" size="mini" @click="headerEdit(scope.$index,scope.row)"
                    >header
                    </el-button>
                    <el-button type="text" v-if="colShow" size="mini" @click="logicalEdit(scope.$index,scope.row)"
                    >逻辑判断
                    </el-button>
                    <el-button type="text" size="mini" @click="deleteStep(scope.$index,multiStepTableList,scope.row)"
                    >删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="入参编辑" :visible.sync="inparamDialogShow" @close="closeInparam">
            <el-row v-if="jsonRowShow === true">
                <el-input type="textarea" v-model="inParamData" placeholder="" :autosize="{ minRows: 10}"
                ></el-input>
            </el-row>
            <el-row v-if="jsonRowShow === false">
                <el-button size="mini" type="primary" class="el-icon-circle-plus-outline" @click="insertInParam(-1)"
                           style="margin-bottom:10px" plain>新增
                </el-button>
                <elx-editable ref="inParamTable" :data.sync="inParamTableData" border empty-text="请点击【新增】添加入参呦">
                    <elx-editable-column prop="key" align="center" label="参数名称"
                                         :edit-render="{name: 'ElInput'}"></elx-editable-column>
                    <elx-editable-column prop="value" align="center" label="参数值"
                                         :edit-render="{name: 'ElInput'}"></elx-editable-column>
                    <elx-editable-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    @click.native.prevent="deleteInparamStep(scope.$index, inParamTableData)"
                                    type="text"
                                    size="small">
                                删除
                            </el-button>
                        </template>
                    </elx-editable-column>
                </elx-editable>
            </el-row>

            <span slot="footer" class="dialog-footer">
            <el-button @click="formatInparam" v-if="jsonRowShow === true">格式化</el-button>
                <el-button @click="closeInparam">取消</el-button>
            <el-button type="primary" @click="commitInparam()">确 定</el-button>
            </span>

        </el-dialog>
        <el-dialog title="出参编辑" :visible.sync="outparamDialogShow" @close="cancelOutParamshow">
            <el-button size="mini" type="primary" class="el-icon-circle-plus-outline" @click="insertOutParam(-1)"
                       style="margin-bottom:10px" plain>新增
            </el-button>
            <elx-editable ref="outParamParamTable" :data.sync="outParamData" border empty-text="请点击【新增】添加出参呦">
                <elx-editable-column prop="key" align="center" label="参数名称"
                                     :edit-render="{name: 'ElInput'}"></elx-editable-column>
                <elx-editable-column prop="keyAs" align="center" label="参数别名"
                                     :edit-render="{name: 'ElInput'}"></elx-editable-column>
                <elx-editable-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button
                                @click.native.prevent="deleteOutInparamStep(scope.$index, outParamData)"
                                type="text"
                                size="small">
                            删除
                        </el-button>
                    </template>
                </elx-editable-column>
            </elx-editable>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelOutParamshow">取消</el-button>
                <el-button type="primary" @click="commitOutparam()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="断言编辑" :visible.sync="verifyDialogShow" @close="cancelVerifyshow">
            <el-row>
                <smart-assert
                        ref="editSmartAssert"
                        :smart-assert-prop="this.smartAssertProp"
                        :assert-list-prop="this.assertListProp"
                >
                </smart-assert>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelVerifyshow">取消</el-button>
                <el-button type="primary" @click="commitVerify()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="header编辑" :visible.sync="headerDialogShow" @close="cancelHeadershow">
            <el-row>
                <el-form-item label="验证点:" prop="verify" label-width="60px">
                    <el-input type="textarea" v-model="headerData" placeholder="请输入Header" :autosize="{ minRows: 6}"
                    ></el-input>
                </el-form-item>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelHeadershow">取消</el-button>
                <el-button type="primary" @click="commitHeader()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="名称编辑" :visible.sync="nameDialogShow" @close="cancelNameshow">
            <el-row>
                <el-form-item label="名称:" prop="verify" label-width="60px">
                    <el-input v-model="apiNameData" placeholder="请输入名称"
                    ></el-input>
                </el-form-item>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelNameshow">取消</el-button>
                <el-button type="primary" @click="commitName()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="url/sql编辑" :visible.sync="contentShow" @close="cancelContentshow">
            <el-row>
                <el-form-item label="url/sql:" prop="content" label-width="60px">
                    <el-input type="textarea" v-model="contentData" :rows="3" placeholder="请输入名称"
                    ></el-input>
                </el-form-item>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelContentshow">取消</el-button>
                <el-button type="primary" @click="commitContent()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="分类执行步骤编辑" :visible.sync="stepNameDialogShow" @close="cancelStepNameShow">
            <el-row>
                <el-form-item label="名称:" prop="verify" label-width="60px">
                    <el-input v-model="stepNameData" placeholder="请输入名称"
                    ></el-input>
                </el-form-item>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelStepNameShow">取消</el-button>
                <el-button type="primary" @click="commitStepName()">确 定</el-button>
            </span>
        </el-dialog>
        <logical-judgment ref="logical" :logicalDudgmentShow="this.logicalDudgmentShow" :logicalData="this.logicalData" :multiApiCaseId="this.apiCaseId"
                          v-on:changeLogicalStatus="changeLogicalStatus"
                          v-on:commitLogicalData="commitLogicalData"
        ></logical-judgment>

    </div>
</template>

<script>
import Sortable from 'sortablejs'
import JsonEditor from '@/components/JsonEditor'
import logicalJudgment from './logical-judgment'
import {
  parseJson, convertPostParamToStr
} from '@/api/model/singleApiList'
import smartAssert from '../../singleApi/components/smart-assert'

export default {
  name: 'multi-step-table',
  components: { logicalJudgment, smartAssert },
  props: {
    multiApiStepListF: {
      type: Array,
      default: () => {
        return []
      }

    },
    colShow: {
      type: Boolean,
      default: false

    },
    typeFlag: {
      type: String,
      default: ''
    },
    caseId: {
      type: String,
      default: ''
    }
  },
  watch: {
    multiApiStepListF (value) {
      this.multiStepTableList = value

      this.listLoading = false
      this.$nextTick(function () {
        this.setSort()
      })
    },
    multiStepTableList (val) {
      this.$emit('changeStatus', val)
    },
    typeFlag (value) {
      this.type = value
    },
    caseId (value) {
      this.apiCaseId = value
    }

  },
  // mounted: function() {
  //     //这个是钩子函数
  //     //如果cartView函数要执行，必须先执行钩子函数
  //     //这个钩子函数完成了对cratView函数的调用
  //     //应该注意的是，使用mounted 并不能保证钩子函数中的 this.$el 在 document 中。为此还应该引入    Vue.nextTick/vm.$nextTick
  //     this.listLoading = false
  //     this.$nextTick(function () {
  //         this.setSort()
  //     })
  // },

  data () {
    return {
      multiStepTableList: this.multiApiStepListF,
      total: null,
      listLoading: false,
      sortable: null,
      oldList: [],
      newList: [],
      inparamDialogShow: false,
      stepNameDialogShow: false,
      outparamDialogShow: false,
      headerDialogShow: false,
      verifyDialogShow: false,
      logicalDudgmentShow: false,
      nameDialogShow: false,
      contentShow: false,
      rowIndex: 0,
      apiNameData: '',
      inParamData: {},
      outParamData: [],
      verifyData: '',
      headerData: '',
      logicalData: [],
      stepNameData: '',
      contentData: '',
      deleteMultiApiStepIds: [],
      type: this.typeFlag,
      inParamTableData: [],
      jsonRowShow: true,
      apiCaseId: this.caseId,
      assertType: 0,
      smartAssertProp: {
        normalShow: true,
        titleHeight: 'height:30px',
        radioMargin: 'margin:10px 10px 10px 10px'
      },
      assertListProp: []
    }
  },

  methods: {
    // async getList() {
    //     this.dragShow = false
    //     this.$nextTick(() => {
    //         this.setSort()
    //     })
    // }
    // ,
    setSort () {
      const el = this.$refs.multiStepTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.multiStepTableList.splice(evt.oldIndex, 1)[0]
          this.multiStepTableList.splice(evt.newIndex, 0, targetRow)
        }
      })
    },
    // 名称编辑
    paramEdit (index, row) {
      this.nameDialogShow = true
      this.apiNameData = row.apiName
      this.rowIndex = index
    },
    // sql/url编辑
    contentEdit (index, row) {
      this.contentShow = true
      this.contentData = row.content
      this.rowIndex = index
    },
    // sql/url编辑取消
    cancelContentshow () {
      this.contentShow = false
      this.contentData = ''
    },
    // sql/url名称提交
    commitContent () {
      this.multiStepTableList[this.rowIndex].content = this.contentData
      this.$emit('changeStatus', this.multiStepTableList)
      this.contentShow = false
    },
    // 编辑取消
    cancelNameshow () {
      this.nameDialogShow = false
      this.apiNameData = ''
    },
    // 名称提交
    commitName () {
      this.multiStepTableList[this.rowIndex].apiName = this.apiNameData
      this.$emit('changeStatus', this.multiStepTableList)
      this.nameDialogShow = false
    },
    // 步骤名称编辑
    stepNameEdit (index, row) {
      this.stepNameDialogShow = true
      this.stepNameData = row.stepName
      this.rowIndex = index
    },
    // 步骤名称编辑取消
    cancelStepNameShow () {
      this.stepNameDialogShow = false
      this.stepNameData = ''
    },
    // 步骤名称提交
    commitStepName () {
      this.multiStepTableList[this.rowIndex].stepName = this.stepNameData
      this.$emit('changeStatus', this.multiStepTableList)
      this.stepNameDialogShow = false
    },

    // 入参--编辑
    inparamEdit (index, row) {
      // 判定是json/&符号连接
      if (row.inParam != '' && row.inParam != null) {
        debugger
        if (!this.isJSON(row.inParam) && row.inParam.indexOf('=') != -1) {
          // 调用接口转为table
          this.jsonRowShow = false
          this.getFormatList(row.inParam)
        } else if (this.isJSON(row.inParam)) {
          var json = JSON.parse(row.inParam)
          this.inParamData = JSON.stringify(json, null, '\t')
        } else {
          this.inParamData = row.inParam
        }
      } else {
        this.inParamData = row.inParam
      }
      this.inparamDialogShow = true
      this.rowIndex = index
    },

    // 入参--新增
    insertInParam (row) {
      this.$refs.inParamTable.insertAt({}, row).then(({ row }) => this.$refs.inParamTable.setActiveCell(row))
    },
    // 入参--删除参数
    deleteInparamStep (index, rows) {
      rows.splice(index, 1)
    },
    // 入参--格式化
    formatInparam () {
      var json = JSON.parse(this.inParamData)
      this.inParamData = JSON.stringify(json, null, '\t')
    },
    // 入参 -- 取消
    closeInparam () {
      this.inparamDialogShow = false
      this.inParamData = ''
      this.inParamTableData = []
      this.jsonRowShow = true
    },
    // 入参--提交
    async commitInparam () {
      // 判断入参方式
      if (this.jsonRowShow) {
        this.multiStepTableList[this.rowIndex].inParam = this.inParamData
      } else {
        var obj = { param: JSON.stringify(this.inParamTableData) }
        var params = new URLSearchParams()
        var inparamAnd = ''
        for (const item in obj) {
          if (obj.hasOwnProperty(item)) {
            params.append(item, obj[item])
          }
        }
        await convertPostParamToStr(params).then(response => {
          if (response.success) {
            inparamAnd = response.data
          }
        })
        this.multiStepTableList[this.rowIndex].inParam = inparamAnd
      }
      this.$emit('changeStatus', this.multiStepTableList)
      this.inparamDialogShow = false
    },

    // 出参--编辑
    outparamEdit (index, row) {
      this.outparamDialogShow = true
      // 调用format接口

      if (row.outParam !== '') {
        this.outParamData = JSON.parse(row.outParam)
      }

      this.rowIndex = index
    },
    // 出参--新增
    insertOutParam (row) {
      this.$refs.outParamParamTable.insertAt({}, row).then(({ row }) => this.$refs.outParamParamTable.setActiveCell(row))
    },
    // 出参--删除参数
    deleteOutInparamStep (index, rows) {
      rows.splice(index, 1)
    },
    // 出参--取消更改
    cancelOutParamshow () {
      this.outparamDialogShow = false
      this.outParamData = []
    },
    // 出参--提交
    commitOutparam () {
      // 调用format接口
      if (this.outParamData !== []) {
        this.multiStepTableList[this.rowIndex].outParam = JSON.stringify(this.outParamData)
        this.$emit('changeStatus', this.multiStepTableList)
      }

      this.outparamDialogShow = false
    },

    // 验证点--编辑
    verifyEdit (index, row) {
      this.verifyDialogShow = true
      // 调用format接口
      // this.verifyData = row.checkPoint;
      // this.assertType = row.assertType
      this.rowIndex = index
      debugger
      // if(this.verifyData !== null && this.verifyData !== "" && this.assertType !== null && this.assertType !== "") {
      //     this.assertListProp = [{"assertContent": row.checkPoint, "assertType" : row.assertType}]
      // } else {
      this.assertListProp = row.assertList
      // }
    },
    // 验证点--取消更改
    cancelVerifyshow () {
      this.verifyDialogShow = false
      this.verifyData = ''
      this.assertType = 0
      this.assertListProp = []
    },
    getAssertResult () {
      this.assertListProp = []
      const tabs = this.$refs.editSmartAssert.editableTabs
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].assertRadio === '1') {
          if (tabs[i].schemaContent instanceof Object) {
            tabs[i].schemaContent = JSON.stringify(tabs[i].schemaContent)
          }
          const verifyData = tabs[i].schemaContent.replace(/\r\n/g, '').replace(/\n/g, '')
          const assertType = 1
          this.assertListProp.push({ id: tabs[i].id, assertContent: verifyData, assertType: assertType })
        } else if (tabs[i].assertRadio === '2') {
          const verifyData = this.getJsonPathAssert(tabs[i])
          const assertType = 2
          this.assertListProp.push({ id: tabs[i].id, assertContent: verifyData, assertType: assertType })
        } else if (tabs[i].assertRadio === '3') {
          const verifyData = tabs[i].methodContent
          const assertType = 3
          this.assertListProp.push({ id: tabs[i].id, assertContent: verifyData, assertType: assertType })
        } else {
          const verifyData = tabs[i].normalContent
          const assertType = 0
          this.assertListProp.push({ id: tabs[i].id, assertContent: verifyData, assertType: assertType })
        }
      }
    },
    getJsonPathAssert (tab) {
      let content = ''
      const array = tab.pathContent
      for (let i = 0; i < array.length; i++) {
        content += (array[i].express + array[i].operator + array[i].expectValue + array[i].link)
      }
      if (content.substring(content.length - 4) === 'null') {
        return content.substring(0, content.length - 4)
      }
      return content
    },
    // 验证点--提交
    commitVerify () {
      this.getAssertResult()
      if (this.assertListProp.length === 0) {
        this.$message({
          message: '请输入断言',
          type: 'warning'
        })
        return false
      }
      this.multiStepTableList[this.rowIndex].assertList = this.assertListProp
      const ids = this.$refs.editSmartAssert.deleteAssertIds
      this.multiStepTableList[this.rowIndex].deleteAssertIds = ids.substring(0, ids.length - 1)
      this.$emit('changeStatus', this.multiStepTableList)
      this.verifyDialogShow = false
    },

    // header--编辑
    headerEdit (index, row) {
      this.headerDialogShow = true
      // 调用format接口
      this.headerData = row.header
      this.rowIndex = index
    },
    // header--取消更改
    cancelHeadershow () {
      this.headerDialogShow = false
      this.headerData = ''
    },
    // header--提交
    commitHeader () {
      this.multiStepTableList[this.rowIndex].header = this.headerData
      this.$emit('changeStatus', this.multiStepTableList)
      this.headerDialogShow = false
    },
    // 逻辑编辑-编辑
    logicalEdit (index, row) {
      this.logicalDudgmentShow = true
      // 调用format接口
      this.logicalData = row.makeDataFormulaEntityList
      this.rowIndex = index
    },
    // 逻辑判断（子组件）编辑
    changeLogicalStatus (data) {
      this.logicalDudgmentShow = data
      if (!data) {
        this.logicalData = []
      }
    },
    // 逻辑判断（子组件）--提交
    commitLogicalData (data, deleteList) {
      this.multiStepTableList[this.rowIndex].makeDataFormulaEntityList = data
      this.multiStepTableList[this.rowIndex].deleteMakeDataFormulaEntityList = deleteList
      this.$emit('changeStatus', this.multiStepTableList)
      this.logicalDudgmentShow = false
    },

    deleteStep (index, rows, row) {
      rows.splice(index, 1)
      if (this.type === '2') {
        this.deleteMultiApiStepIds.push(row.id)
        this.$emit('getDeleteMultiApiStepIds', this.deleteMultiApiStepIds)
      }
    },
    // 格式化
    async getFormatList (param) {
      // this.formatData = [{"key": "login", "value": "123"}, {"key": "userName", "value": "zhangw"}]
      var obj = { paramterStr: param }
      var params = new URLSearchParams()
      for (const item in obj) {
        if (obj.hasOwnProperty(item)) {
          params.append(item, obj[item])
        }
      }
      await parseJson(params).then(response => {
        if (response.success) {
          this.inParamTableData = JSON.parse(response.data)
        }
      })
    },
    // 格式化反显
    async enformatInparam () {
      var param = ''
      var obj = { param: JSON.stringify(this.inParamTableData) }
      var params = new URLSearchParams()
      for (const item in obj) {
        if (obj.hasOwnProperty(item)) {
          params.append(item, obj[item])
        }
      }
      await convertPostParamToStr(params).then(response => {
        if (response.success) {
          param = response.data
          return param
        }
      })
      return param
    },
    isJSON (str) {
      if (typeof str === 'string') {
        try {
          var obj = JSON.parse(str)
          if (typeof obj === 'object' && obj) {
            return true
          } else {
            return false
          }
        } catch (e) {
          return false
        }
      }
    }

  }
}
</script>

<style>
    .sortable-ghost {
        opacity: .8;
        color: #fff !important;
        background: #42b983 !important;
    }
</style>

<style scoped>
    .icon-star {
        margin-right: 2px;
    }

    .drag-handler {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }

    .show-d {
        margin-top: 15px;
    }

    .editor-container {
        position: relative;
        height: 100%;
    }

    /deep/ .el-dialog__body {
        padding: 20px 20px 0px 20px;
        color: #606266;
        font-size: 14px;
        word-break: break-all;
    }

    /deep/ .cm-s-rubyblue.CodeMirror {
        background: #e0dee0;
        color: black;
    }

    /deep/ .cm-s-rubyblue .CodeMirror-linenumber {
        color: black;
    }

    /deep/ .cm-s-rubyblue .CodeMirror-gutters {
        background: #f7f7f7;
        border-right: 1px solid #909399
    }

    /deep/ .el-tag.el-tag--info {
        background-color: #f4f4f5;
        border-color: #e9e9eb;
        color: #909399;
    }

</style>
