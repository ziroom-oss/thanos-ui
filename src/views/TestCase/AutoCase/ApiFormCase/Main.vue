<template>
  <div class='add_main'>
    <Tabs
      :tabsList="addCaseConfig.REQUEST_TAB_LISTS"
      :current="selectTab"
      :apiFormData="apiFormData"
      @changeTab="changeTab"
      @resetHeight="resetHeight"
    />
    <!-- 异步组件会获取不到dom,需要刚上来就添加上 -->
    <!-- <keep-alive>
      <component :is="selectTab.name"></component>
    </keep-alive> -->
    <Tabs v-show="selectTab.name === 'Tabs'" />
    <Body v-show="selectTab.name === 'Body'" />
    <Headers v-show="selectTab.name === 'Headers'" />
    <Params v-show="selectTab.name === 'Params'" />
    <Tests v-show="selectTab.name === 'Tests'"/>
    <RequestSQL v-show="selectTab.name === 'Pre-request SQL'" :preSql='preSql' :apiFormData="apiFormData" :codeMirrorHeight="codeMirrorHeight" />
    <RequestAPI v-show="selectTab.name === 'Pre-request API'" :apiFormData="apiFormData" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import eventBus from '@/utils/eventBus'
import Tabs from './components/Tabs'
import Body from './TabsPage/Body'
import Headers from './TabsPage/Headers'
import Params from './TabsPage/Params'
import Tests from './TabsPage/Tests'
import RequestSQL from './TabsPage/RequestSQL'
import RequestAPI from './TabsPage/RequestAPI'
import addCaseConfig from '@/config/addCaseConfig'

export default {
  name: 'Main',
  components: {
    Tabs,
    Body,
    Headers,
    Params,
    Tests,
    RequestSQL,
    RequestAPI
  },
  props: {
    apiFormData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: mapState({
    requestType: (state) => state.cases.caseForm.requestType || 'GET',
    preSql: (state) => state.cases.caseForm.preSql
  }),
  watch: {
    // 首次进入判断方式改变Tab
    requestType (value) {
      if (value !== 'GET') {
        this.changeTab(addCaseConfig.REQUEST_TAB_LISTS[2])
      }
    }
  },
  data () {
    return {
      addCaseConfig,
      selectTab: addCaseConfig.REQUEST_TAB_LISTS[0],
      codeMirrorHeight: '300',
    }
  },
  mounted () {
    // 监听断言不存在
    eventBus.$on('changeTab', () =>
      this.changeTab(addCaseConfig.REQUEST_TAB_LISTS[3])
    )
  },
  methods: {
    ...mapActions(['setSelectTab']),
    // 改变标签页
    changeTab (name) {
      this.selectTab = name
      this.setSelectTab(name)
    },
    resetHeight (val) {
      this.codeMirrorHeight = val
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";

.add_main {
  position: relative;
  &.pt {
    padding-top: 32px;
  }
}
</style>
