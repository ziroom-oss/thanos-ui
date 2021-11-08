<template>
  <div>
    <el-radio-group size="medium" v-model="testName">
      <el-radio-button :label="HANDNAME">{{ HANDNAME }}</el-radio-button>
      <el-radio-button :label="AUTONAME">{{ AUTONAME }}</el-radio-button>
    </el-radio-group>
    <TestCase v-if="testName === HANDNAME" />
    <AutoCase v-else />
    <el-backtop target=".el-main"></el-backtop>
  </div>
</template>

<script>
export default {
  name: 'testCaseIndex',
  components: {
    TestCase: () => import('./TestCase.vue'),
    AutoCase: () => import('./AutoCase')
  },
  data () {
    return {
      testName: '手动测试',
      HANDNAME: '手动测试',
      AUTONAME: '自动测试'
    }
  },
  created () {
    const { name } = this.$route.query
    if (name) {
      this.testName = this.AUTONAME
    }
  },
  methods: {
    toggleType (type) {
      this.testType = type
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
