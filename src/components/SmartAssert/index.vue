<template>
  <el-card class="box-card">
    <div class="tabs_body">
      <el-radio-group
        v-model="assertData.assertType"
        class="body_radio"
      >
        <el-radio
          v-for="item of editableTabRadios"
          :label="item.assertType"
          :key="item.assertType"
        >
          {{ item.assertTabName }}
        </el-radio>
      </el-radio-group>
      <div v-if="assertData.assertType === 1">
        <JsonPretty
          v-if="Object.keys(intelligentList).length > 0"
          selectableType="multiple"
          :pathDataProps="pathDataProps"
          :jsonData="intelligentList"
          @changePathData="changePathData"
        >
        </JsonPretty>
        <div v-else class="footer_body_text">暂无返回结果，运行后展示断言数据！</div>
      </div>
      <el-input
        v-else
        class="grid-content"
        type="textarea"
        :autosize="{ minRows: 7 }"
        placeholder="返回体包含该字符串"
        v-model="assertData.normalContent.assertContent"
      >
      </el-input>
    </div>
  </el-card>
</template>

<script>
import JsonPretty from '@/components/JsonPretty'
import { mapState } from 'vuex'
import { isJSON } from '@/utils/base'
import JSONPath from 'JSONPath'
import { mapActions } from 'vuex'

export default {
  components: { JsonPretty },
  name: 'smartAssert',
  props: {
    smartAssertProp: {
      type: Object,
      required: true
    },
    assertListProp: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
    computed: mapState({
    callbackBody: (state) => state.cases.callbackBody || {},
    jsonData () {
      const obj = { data: null, type: null }
      const { actualResult } = this.callbackBody

      if (!actualResult) return null
      if (/^(<pre>|<!doctype|<html)/.exec(actualResult)) {
        obj.data = actualResult?.replace(/h1,.*\}/i, '')
        obj.type = 'HTML'
      } else {
        obj.data = isJSON(actualResult) ? JSON.parse(actualResult) : ''
        obj.type = 'JSON'
      }
      return obj
    },
    intelligentList: (state) => state.cases.intelligentList || {},
  }),
  data () {
    return {
      editableTabRadios: [{
        assertType: 0,
        assertTabName: 'Normal'
      }, {
        assertType: 1,
        assertTabName: 'JsonPath'
      }],
      assertData: this.assertListProp,
      assertListData: [],
      pathDataProps: [],
      editableTabsValue: '1',
      activeName: '1',
      assertProperty: this.smartAssertProp,
      assertList: this.assertListProp,
      editableTabs: [],
      deleteAssertIds: '',
      tabIndex: 0,
    }
  },
  watch: {
    assertListProp: {
      handler (val) {
        this.pathDataProps = Object.keys(val.jsonPathContent)
        this.assertData = val
      },
      deep: true
    },
    assertData: {
      handler (val) {
        let data = []
        if (val.assertType === 1) {
          Object.keys(val.jsonPathContent).forEach(key => {
            data.push({
              assertType: 1,
              assertContent: JSON.stringify({
                key: key,
                value: val.jsonPathContent[key]
              })
            })
          })
        } else {
          data.push({
            assertType: 0,
            assertContent: val.normalContent.assertContent
          })
        }

        this.assertListData = data
      },
      deep: true,
    } 
  },

  methods: {
    ...mapActions(['setIntelligentAssertions', 'setCaseForm']),
    handleClick () {},
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
    changePathData (val) {
      let arr = []
      val.forEach(key => {
        const value = JSONPath({
          json: this.intelligentList,
          path: key
        })

        arr.push({
          assertContent: JSON.stringify({
            key,
            value: value[0],
          }),
          assertType: 1
        })
      })

      this.assertListData = arr
    }
  }
}
</script>

<style lang='scss' scoped>
.add_assert {
  position: absolute;
  right: 0;
  top: 1px;
}

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
.text {
  min-height: 100px;
}

.footer_body_text {
  border-radius: 4px;
  height: 160px;
  padding: 5px 15px;
  border: 1px solid #e4e4e4;
  color: #DCDFE6;
}
.tabs_body {
  .body_radio {
    margin-bottom: 20px;
  }
}
</style>
