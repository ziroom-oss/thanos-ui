<template>
  <div class="add_footer">
    <el-divider></el-divider>
    <div v-if="selectTab.name !== 'Pre-request SQL'" class="footer_head">
      <div v-if="jsonData">
        <Tabs
          :tabsList="ADD_CASE_CONFIG.RESPONSE_TAB_LISTS"
          :current="ADD_CASE_CONFIG.RESPONSE_TAB_LISTS[0]"
        />
        <div class="footer_head_status">
          <el-link
            type="primary"
            :href="callbackBody.url"
            target="_blank"
            v-if="callbackBody.url"
            >{{ `请求地址：${callbackBody.url}` }}</el-link
          >
          <i class="el-icon-s-opportunity"></i>
          <p class="head_status">
            断言结果:
            <span
              :class="[
                'head_status_code',
                callbackBody.recordResult === 'FAILURE' ? 'fail' : 'success',
              ]"
              >{{ callbackBody.recordResult || "0" }}</span
            >
            <span
              v-if="callbackBody.recordResult !== 'FAILURE'"
              :class="[
                'head_status_code',
                'fail',
              ]"
              >{{ `断言覆盖率：${callbackBody.successCoverage || 0}%` }}</span
            >
          </p>
        </div>
      </div>
      <div v-else>
        <div class="head_title">Response</div>
      </div>
    </div>
    <template v-if="selectTab.name === 'Pre-request SQL'">
      <MultiTable
        class="footer_body_sql_show"
        v-if="preSqlallbackBody && preSqlallbackBody.length > 0"
        tableHeght="200"
        :runSqlResult="preSqlallbackBody"
      />
      <div v-else class="footer_body_text">暂无返回结果，请输入sql语句点击预览查询！</div>
    </template>
    <template v-else>
      <div v-if="jsonData && jsonData.data" class="footer_body_show">
        <json-viewer
          v-if="jsonData.type === 'JSON'"
          :value="jsonData.data"
          :expand-depth="1"
          copyable
          sort
          boxed
        ></json-viewer>
        <el-alert v-html="jsonData.data" type="info" v-else> </el-alert>
      </div>
      <div v-else class="footer_body_text">暂无返回结果，请点击运行！</div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import JsonViewer from 'vue-json-viewer'
import Tabs from './components/Tabs'
import MultiTable from '../components/MultiTable'
import { isJSON } from '@/utils/base'
import ADD_CASE_CONFIG from '@/config/addCaseConfig'

export default {
  name: 'Footer',
  components: {
    Tabs,
    JsonViewer,
    MultiTable
  },
  data () {
    return {
      ADD_CASE_CONFIG
    }
  },
  computed: mapState({
    callbackBody: (state) => state.cases.callbackBody || {},
    preSqlallbackBody: (state) => state.cases.preSqlallbackBody,
    selectTab: (state) => state.cases.selectTab,
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
    }
  })
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
@import "~@/styles/mixin.scss";

.add_footer {
  max-height: 50vh;
  .el-divider--horizontal {
    margin: 10px 0;
  }
  .footer_head div {
    display: flex;
    justify-content: space-between;
    .head_title {
      color: #d1d2c0;
      font-size: 14px;
    }
    .footer_head_status {
      display: flex;
      align-items: flex-start;
      a {
        @include article-container(2);
        margin: 0 10px;
      }
      .el-icon-s-opportunity {
        color: #909090;
      }
    }
    .footer_head_status .head_status {
      color: #909090;
      margin-left: 6px;
      flex-shrink: 0;
      .head_status_code {
        color: #909399;
        margin-right: 10px;
        &.fail {
          color: #f56c6c;
        }
        &.success {
          color: #67c23a;
        }
      }
    }
  }
  .footer_body {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 18vh;
    .footer_body_show {
      height: 18vh;
      overflow: auto;
      width: calc(100vw - 40px);
      ::v-deep .jv-more {
        position: sticky;
      }
      ::v-deep .jv-container .jv-code {
        padding: 1vh !important;
      }
    }
    .footer_body_sql_show {
      width: calc(100vw - 40px);
      overflow-x: scroll;
    }
  }
  .footer_body_text {
    font-size: 18px;
    font-weight: 700;
    height: 200px;
    line-height: 200px;
    text-align: center;
  }
}
</style>
