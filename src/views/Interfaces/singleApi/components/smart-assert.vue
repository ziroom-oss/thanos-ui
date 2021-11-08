<template>
  <el-card class="box-card">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      editable
      @edit="handleTabsEdit"
    >
      <div class="card_tip" v-if="editableTabs.length < 1">
        <span>无断言，请点击右上角添加</span>
      </div>
      <el-tab-pane
        v-for="item in editableTabs"
        v-else
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <el-row>
          <!-- <el-radio
            v-model="item.assertRadio"
            label="1"
            :style="assertProperty.radioMargin"
            @change="setAssertRadio(1, item)"
            >Json Schema
            <el-tooltip placement="top">
              <div slot="content">
                {<br />&nbsp;&nbsp;"type": "object",<br />&nbsp;&nbsp;"properties":
                {<br />&nbsp;&nbsp;&nbsp;&nbsp;"status": { "type": "string"
                },<br />&nbsp;&nbsp;&nbsp;&nbsp;"code": { "type": "number" },<br />&nbsp;&nbsp;&nbsp;&nbsp;"user":
                { <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type": "object",<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"properties":
                {<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name" :
                {"type": "string"},<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"age"
                : {"type": "number"}<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br />&nbsp;&nbsp;&nbsp;&nbsp;}<br />&nbsp;&nbsp;}<br />}
              </div>
              <span style="margin-left: 2px; color: orange; font-size: 13px">
                <i class="el-icon-info"></i>
              </span>
            </el-tooltip>
          </el-radio> -->
          <!-- <el-radio
            v-model="item.assertRadio"
            label="2"
            :style="assertProperty.radioMargin"
            @change="setAssertRadio(2, item)"
            >Json Path
          </el-radio> -->
          <!-- <el-radio disabled v-model="item.assertRadio" label="3" :style="assertProperty.radioMargin"
                              @change="setAssertRadio(3, item)">Method
                    </el-radio> -->
          <el-radio
            v-show="assertProperty.normalShow"
            v-model="item.assertRadio"
            label="4"
            :style="assertProperty.radioMargin"
            @change="setAssertRadio(4, item)"
            >Normal
          </el-radio>
        </el-row>
        <div class="text item">
          <!-- <div v-show="item.jsonSchemaShow">
            <el-scrollbar
              style="height: 290px"
              :wrapStyle="[{ 'overflow-x': 'hidden' }]"
            >
              <json-editor
                :ref="item.schemaEditor"
                v-model="item.schemaContent"
              />
            </el-scrollbar>
          </div> -->

          <!-- <div v-show="item.jsonPathShow">
            <el-button
              size="mini"
              type="primary"
              class="el-icon-circle-plus-outline"
              @click="insertEvent(-1, item)"
              style="margin-bottom: 10px; width: 120px"
              plain
              >新增
            </el-button>
            <elx-editable
              height="240"
              :ref="item.pathTable"
              :data.sync="item.pathContent"
              border
              empty-text="请点击【新增】添加断言条件判断"
            >
              <elx-editable-column
                prop="express"
                align="center"
                label="Json Path表达式"
                :edit-render="{ name: 'ElInput' }"
              ></elx-editable-column>
              <elx-editable-column
                prop="operator"
                align="center"
                label="匹配规则"
                :edit-render="{ name: 'ElSelect', options: variableTypeList }"
              ></elx-editable-column>
              <elx-editable-column
                prop="expectValue"
                align="center"
                label="期望结果"
                :edit-render="{ name: 'ElInput' }"
              ></elx-editable-column>
              <elx-editable-column
                prop="link"
                align="center"
                label="or/and"
                :edit-render="{ name: 'ElSelect', options: linkTypeList }"
              ></elx-editable-column>
              <elx-editable-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="
                      deleteRow(scope.$index, item.pathContent)
                    "
                    type="text"
                    size="small"
                  >
                    删除
                  </el-button>
                </template>
              </elx-editable-column>
            </elx-editable>
          </div> -->

          <!-- <div v-show="item.methodShow">
            <el-input
              class="grid-content"
              type="textarea"
              :autosize="{ minRows: 7 }"
              v-model="item.methodContent"
            >
            </el-input>
          </div> -->

          <div v-show="item.normalShow">
            <el-input
              class="grid-content"
              type="textarea"
              :autosize="{ minRows: 7 }"
              v-model="item.normalContent"
            >
            </el-input>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
// import JsonEditor from '@/components/JsonEditor'

export default {
//   components: { JsonEditor },
  name: 'smartAssert',
  props: {
    smartAssertProp: {
      type: Object,
      required: true
    },
    assertListProp: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      editableTabsValue: '1',
      activeName: '1',
      assertProperty: this.smartAssertProp,
      assertList: this.assertListProp,
      editableTabs: [],
      deleteAssertIds: '',
      tabIndex: 0,
      variableTypeList: [
        {
          label: '=',
          value: '#1'
        },
        {
          label: '!=',
          value: '#2'
        },
        {
          label: '>',
          value: '#7'
        },
        {
          label: '<',
          value: '#6'
        },
        {
          label: '>=',
          value: '#5'
        },
        {
          label: '<=',
          value: '#4'
        },
        {
          label: 'contains',
          value: '#3'
        }
      ],
      linkTypeList: [
        {
          label: '',
          value: ''
        },
        {
          label: 'and',
          value: '%1'
        },
        {
          label: 'or',
          value: '%2'
        }
      ]
    }
  },
  mounted () {
    this.updateAssertStatus(this.assertList)
  },
  watch: {
    assertListProp: {
      handler (val) {
        this.updateAssertStatus(val)
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    handleTabsEdit (targetName, action) {
      if (action === 'add') {
        const newTabName = ++this.tabIndex + ''
        this.editableTabs.push({
          title: '断言' + this.tabIndex,
          name: newTabName,
          assertType: 0,
          schemaContent: '',
          methodContent: '',
          normalContent: '',
          pathContent: [],
          assertRadio: '4',
          jsonSchemaShow: false,
          jsonPathShow: false,
          methodShow: false,
          normalShow: true,
          pathTable: 'pathTable' + this.tabIndex
        })
        this.editableTabsValue = newTabName
      }
      if (action === 'remove') {
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
        tabs.forEach((tab) => {
          if (tab.name === targetName) {
            if (tab.id !== undefined && tab.id !== '') {
              this.deleteAssertIds += tab.id + ','
            }
          }
        })
        this.editableTabsValue = activeName
        this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
      }
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    insertEvent (row, item) {
      this.$refs[item.pathTable][0]
        .insertAt({}, row)
        .then(({ row }) => this.$refs[item.pathTable][0].setActiveCell(row))
    },
    handleClick () {},
    splitPathAssert (pathAssert, tab) {
      while (pathAssert.indexOf('%') !== -1) {
        const aRow = pathAssert.substring(0, pathAssert.indexOf('%') + 2)
        const obj = { express: '', operator: '', expectValue: '', link: '' }
        obj.express = aRow.substring(0, aRow.indexOf('#'))
        obj.operator = aRow.substring(aRow.indexOf('#'), aRow.indexOf('#') + 2)
        obj.expectValue = aRow.substring(
          aRow.indexOf('#') + 2,
          aRow.indexOf('%')
        )
        obj.link = aRow.substring(aRow.indexOf('%'))
        tab.pathContent.push(obj)

        pathAssert = pathAssert.substring(pathAssert.indexOf('%') + 2)
      }
      const obj = { express: '', operator: '', expectValue: '' }
      obj.express = pathAssert.substring(0, pathAssert.indexOf('#'))
      obj.operator = pathAssert.substring(
        pathAssert.indexOf('#'),
        pathAssert.indexOf('#') + 2
      )
      obj.expectValue = pathAssert.substring(pathAssert.indexOf('#') + 2)
      tab.pathContent.push(obj)
    },
    resetContent (tab) {
      tab.schemaContent = ''
      tab.pathContent = []
      tab.methodContent = ''
      tab.normalContent = ''
    },
    updateAssertStatus (valList) {
      this.tabIndex = 0
      this.editableTabs = []
      this.deleteAssertIds = ''
      for (var i = 0; i < valList.length; i++) {
        const tab = {
          id: valList[i].id,
          title: '断言' + ++this.tabIndex,
          name: this.tabIndex + '',
          assertType: valList[i].assertType,
          schemaContent: '',
          methodContent: '',
          normalContent: '',
          pathContent: [],
          assertRadio: '1',
          jsonSchemaShow: true,
          jsonPathShow: false,
          methodShow: false,
          normalShow: false,
          pathTable: 'pathTable' + this.tabIndex,
          schemaEditor: 'schemaEditor' + this.tabIndex
        }
        this.resetContent(tab)
        if (valList[i].assertType === 1) {
          tab.schemaContent = this.parseJson(valList[i].assertContent)
          this.setAssertRadio(1, tab)
        } else if (valList[i].assertType === 2) {
          this.splitPathAssert(valList[i].assertContent, tab)
          this.setAssertRadio(2, tab)
        } else if (valList[i].assertType === 3) {
          tab.methodContent = valList[i].assertContent
          this.setAssertRadio(3, tab)
        } else if (valList[i].assertType === 0) {
          tab.normalContent = valList[i].assertContent
          this.setAssertRadio(4, tab)
        } else {
          this.setAssertRadio(0, tab)
        }
        this.editableTabs.push(tab)
        this.editableTabsValue = tab.name
      }
    },
    setAssertRadio (radio, tab) {
      switch (radio) {
        case 1:
          if (
            this.$refs[tab.schemaEditor] !== undefined &&
            tab.schemaContent === ''
          ) {
            this.$refs[tab.schemaEditor][0].refresh()
          }
          tab.assertRadio = '1'
          tab.jsonSchemaShow = true
          tab.jsonPathShow = false
          tab.methodShow = false
          tab.normalShow = false
          break
        case 2:
          tab.assertRadio = '2'
          tab.jsonSchemaShow = false
          tab.jsonPathShow = true
          tab.methodShow = false
          tab.normalShow = false
          break
        case 3:
          tab.assertRadio = '3'
          tab.jsonSchemaShow = false
          tab.jsonPathShow = false
          tab.methodShow = true
          tab.normalShow = false
          break
        case 4:
          tab.assertRadio = '4'
          tab.jsonSchemaShow = false
          tab.jsonPathShow = false
          tab.methodShow = false
          tab.normalShow = true
          break
        default:
          tab.assertRadio = ''
          tab.jsonSchemaShow = true
          tab.jsonPathShow = false
          tab.methodShow = false
          tab.normalShow = false
      }
    },
    parseJson (val) {
      if (this.isJSON(val)) {
        return JSON.parse(val)
      } else {
        return val
      }
    },
    isJSON (str) {
      if (typeof str === 'string') {
        try {
          var obj = JSON.parse(str)
          return !!(typeof obj === 'object' && obj)
        } catch (e) {
          return false
        }
      }
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
  min-height: 160px;
}

.bg-template {
  color: black;
}

.app-container {
  width: 100%;
}

.el-card.is-always-shadow {
  box-shadow: 0 0 0 0;
}

.card_tip {
  /* margin: 0 auto; */
  text-align: center;
  font-size: 24px;
  margin: 100px auto;
  span {
    font-weight: 700;
    color: #E6A23C;
  }
}
</style>
