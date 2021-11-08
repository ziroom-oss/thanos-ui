<template>
  <div :class="['add_header', { '_h': height <= 768 }]">
    <div class="header_box">
      <div class="header_box_title">
        <el-form-item>
          <el-input placeholder="请输入用例名称" v-model="caseName" clearable />
        </el-form-item>
      </div>
      <div class="header_box_menu">
        <el-form-item>
          <el-select placeholder="请选择环境" v-model="env" size="medium">
            <el-option
              v-for="item in ADD_CASE_CONFIG.ENVIRONMENT_OPTIONS"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </div>

    <div class="header_config">
      <el-form-item class="config_methods" size="medium">
        <el-input
          placeholder="请输入方法"
          :value="requestType"
          :disabled="true"
        >
        </el-input>
      </el-form-item>
      <el-form-item class="config_url" size="medium">
        <el-input :value="requestUri" disabled />
      </el-form-item>
      <el-button
        @click="saveCase"
        :disabled="!isSaveCase"
        >保存</el-button
      >
      <el-button class="config_btn" type="primary" @click="runCase">
        试运行
      </el-button>
      <!-- <el-button
        type="primary"
        size="medium"
        class="add_main_save"
        :disabled="isRun"
        @click="saveCase"
      >
        {{ buttonType }}
      </el-button> -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { throttle } from '@/utils/base'
import { getEnvList } from '@/api/model/singleApiList'
import ADD_CASE_CONFIG from '@/config/addCaseConfig'

export default {
  name: 'Header',
  props: {
    apiFormData: {
      type: Object,
      default () {
        return {}
      }
    },
    isSaveCase: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      ADD_CASE_CONFIG,
      envList: [], // 环境列表
      height: ''
    }
  },
  computed: {
    ...mapState({
      isRun: (state) => state.cases.isRun,
      type: (state) => state.cases.type,
      requestType: (state) => state.cases.caseForm.requestType,
      selectTab: (state) => state.cases.selectTab,
      sqlList: (state) => {
        return state.cases.caseForm.preSql ? state.cases.caseForm.preSql.split(';') : ''
      }
    }),
    buttonType () {
      switch (this.type) {
        case 'EDIT':
          return '用例修改'
        case 'COPY':
          return '用例保存'
        default:
          return '用例保存'
      }
    },
    env: {
      get () {
        return this.$store.state.cases.caseForm.env
      },
      set (env) {
        this.setCaseForm({ env })
      }
    },
    caseName: {
      get () {
        return this.$store.state.cases.caseForm.caseName
      },
      set (caseName) {
        this.setCaseForm({ caseName })
      }
    },
    requestType () {
      return this.$store.state.cases.caseForm.requestType
    },
    requestUri () {
      return this.$store.state.cases.caseForm.requestUri
    }
  },
  created () {
    window.addEventListener('resize', throttle(this.getHeight))
    this.getHeight()
    this.getEnv()
  },
  methods: {
    ...mapActions(['setCaseForm']),
    runCase () {
      this.$emit('runCase')
    },
    // 获取环境列表
    async getEnv () {
      const res = await getEnvList()
      this.envList = res
    },
    saveCase () {
      this.$store.dispatch('saveCase').then((res) => {
        this.$message.success(res)
        this.$emit('close')
        this.$emit('updateData')
      })
    },
    // 获取浏览器高度 768 1080一般笔记本浏览器高度
    getHeight () {
      const height = window.innerHeight
      this.height = height
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getHeight)
  }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
.add_header {
  height: $header_height;
  &._h{
    height: 14vh;
  }
  .header_box {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .header_box_title {
      display: flex;
      align-items: center;
      .el-form-item {
        margin-bottom: 0;
      }
      .el-button {
        width: 100px;
      }
      .el-input {
        margin-left: 10px;
        font-weight: 700;
        font-size: 16px;
      }
    }
    ::v-deep .header_box_menu .el-form-item--small.el-form-item {
      margin: 0;
    }
  }
  .header_config {
    display: flex;
    height: 36px;

    ::v-deep .config_select .el-input .el-input__inner {
      font-weight: 700;
      color: #000;
    }

    .config_methods,
    .config_url,
    .el-button {
      height: 100%;
    }
    .config_methods {
      flex-basis: 80px;
    }
    .config_url {
      flex: 1;
      ::v-deep .el-input,
      ::v-deep .el-form-item__content {
        width: 100%;
      }
    }
  }
  .config_btn {
    width: 100px;
    margin-left: 10px;
  }
}
</style>
