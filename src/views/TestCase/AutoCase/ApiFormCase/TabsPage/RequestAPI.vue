<template>
  <div class="JsonPretty_body">
    <div class="header" v-if="jsonDataList.length > 0">
      <el-button
        class="add_assert"
        type="primary"
        icon="el-icon-plus"
        @click="handleEdit"
      >继续选择接口</el-button>
    </div>
    <TestAssociation
      ref="testAssociation"
      isAppend
      dialogWidth="70%"
      v-model="addNewCase.taskTestCaseList"
      :apiFormData="apiFormData" 
      @handleSubmit="handleSubmit"
    />
    <div class="body_empty" v-if="jsonDataList.length === 0">
      <span>请添加接口 </span>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        @click="handleEdit"
      ></el-button>
    </div>
    <el-collapse
      v-model="activeNames"
      v-else
    >
      <el-collapse-item
        v-for="(item, index) in jsonDataList"
        :title="`${item.caseId} - ${item.caseName} ${item.recordResult === 'FAILURE' ? '【断言失败】！' : ''}`"
        :name='`${index}`'
        :key="item.id"
        class="collapse-item"
      >
        <JsonPretty
          :path="`${item.caseId}|$`"
          :jsonData="formatJsonData(item.actualResult)"
          @changePathData="changePathData"
        >
        </JsonPretty>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import JsonPretty from '@/components/JsonPretty/index.vue'
import TestAssociation from '@/views/CaseExecution/testAssociation'
import { runCase } from '@/api/model/singleApiList'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'RequestAPI',
  components: {
    JsonPretty,
    TestAssociation
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
    preRequest: (state) => state.cases.caseForm.preRequest
  }),
  data () {
    return {
      addNewCase: {
        taskTestCaseList: []
      },
      activeNames: ['0'],
      jsonDataList: [],
    }
  },
  watch: {
    preRequest: {
      handler (val) {
        this.handleSubmit(val, true)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['setPreRequest']),
    formatJsonData (val) {
      let jsonData = {}
      try {
        jsonData = JSON.parse(val)
      } catch {}

      return jsonData
    },
    changePathData (val) {
      if (val.length > 0) {
        this.copyToClipboard(`{{${val}}}`)
        this.$message({
          type: 'success',
          message: `已复制当前行路径值 {{${val}}}`
        })
      }
    },
    copyToClipboard(textToCopy) {
      // navigator clipboard 需要https等安全上下文
      if (navigator.clipboard && window.isSecureContext) {
          // navigator clipboard 向剪贴板写文本
          return navigator.clipboard.writeText(textToCopy);
      } else {
        // 创建text area
        let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        // 使text area不在viewport，同时设置不可见
        textArea.style.position = "absolute";
        textArea.style.opacity = 0;
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            // 执行复制命令并移除文本框
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
      }
    },
    handleEdit () {
      this.$refs.testAssociation.testAssociationShow = true
      this.$refs.testAssociation.artificialOrApi = '2'
      this.$refs.testAssociation.queryApiCaseRelevancy()
    },
    closeDialog () {
      this.$refs.testAssociation.testAssociationShow = false
    },
    async handleSubmit (val, first = false) {
      // 测试执行进行关联测试用例提交
      const newSelectedList = val
      this.setPreRequest(newSelectedList)
      if (newSelectedList && newSelectedList.length !== 0) {
        const data = {
          caseIdList: newSelectedList,
          env: "qua"
        }
        const res = await runCase(data)
        if (res.success && res.data && Array.isArray(res.data)) {
          this.jsonDataList = res.data
        }
        this.closeDialog()
      } else if (!first) {
        this.$message({
          type: 'error',
          message: '未选择关联用例！'
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .JsonPretty_body {
    min-height: 300px;
    max-height: 500px;
    overflow: scroll;
    border: 1px solid #EBEEF5;
    .body_empty {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      margin: 150px auto;
      font-size: 20px;
      span {
        margin-right: 4px;
        font-weight: 600;
        color: #e6a23c;
      }
    }
    .header {
      padding: 16px 0;
    }
    .collapse-item {
      padding-left: 16px;
    }
  }
</style>