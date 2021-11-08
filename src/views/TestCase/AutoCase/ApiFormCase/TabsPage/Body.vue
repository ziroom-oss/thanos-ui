<template>
  <div class="tabs_body">
    <el-radio-group
      v-model="contentType"
      class="body_radio"
      @change="changeContentType"
      disabled
    >
      <el-radio
        v-for="item of ADD_CASECONFIG.CONTENT_TYPE"
        :label="item.value"
        :key="item.name"
      >
        {{ item.name }}
      </el-radio>
    </el-radio-group>
    <template>
      <edit-table
        v-if="
          contentType === ADD_CASECONFIG.CONTENT_TYPE[1].value ||
          contentType === ADD_CASECONFIG.CONTENT_TYPE[2].value
        "
        :tableData="body"
        @editClosedEvent="editClosedEvent"
        @changeEditData="editClosedEvent"
        @removeData="removeData"
      />
      <div v-else-if="contentType === ''" class="body_empty">
        This Request does not have a body
      </div>
      <div v-else class="raw_body">
        <el-input
          type="textarea"
          v-model="jsonData"
          :autosize="{
            minRows: 6,
            maxRows: 12,
          }"
          placeholder="请输入JSON格式数据"
          resize="none"
          clearable
          @blur="changeRawData"
        >
        </el-input>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { formatJSON } from '@/utils/format'
import { isJSON } from '@/utils/base'
import EditTable from '@/components/EditTable'
import ADD_CASECONFIG from '@/config/addCaseConfig'

export default {
  name: 'Body',
  components: { EditTable },
  computed: {
    ...mapState({
      body: (state) => state.cases.caseForm.body,
      headerTableDom: (state) => state.cases.headerTableDom,
      header: (state) => state.cases.caseForm.header
    }),
    contentType: {
      get () {
        // 从表格中查找content-type,并取出
        const contentTypes = this.header?.find(
          (item) => item.key?.toLowerCase() === 'content-type'
        )
        return contentTypes?.value?.replace(/\n|\t| /g, '') || ''
      },
      async set (contentType) {
        // 在表格中查找contentType,并且更改
        const $table = this.headerTableDom.$refs.xTable
        const contentTypeRow = this.headerTableDom?.tableData?.find(
          (item) => item.key?.toLowerCase() === 'content-type'
        )

        if (contentTypeRow) {
          contentTypeRow.value = contentType
          contentTypeRow.key = 'content-type'
          // 如果contentType的值为空就清空table
          if (!contentType) {
            $table.remove(contentTypeRow)
          }
        } else if (!contentTypeRow && contentType) {
          // 在表格中没有存在并且有值就插入
          const data = {
            value: contentType,
            key: 'Content-Type'
          }
          const { row: newRow } = await $table.insertAt(data)
          await $table.setActiveCell(newRow)
        }

        this.setCaseForm({ contentType })
        this.setCaseForm({ header: $table.afterFullData })
      }
    },
    rawData () {
      const rawData = this.$store.state.cases.caseForm.rawData
      return isJSON(rawData) ? formatJSON(rawData) : rawData
    }
  },
  watch: {
    //  不需要实时联动，会有问题
    rawData: {
      immediate: true,
      handler (value) {
        this.jsonData = value
      }
    }
  },
  data () {
    return {
      contype: 'none',
      ADD_CASECONFIG,
      jsonData: ''
    }
  },
  methods: {
    ...mapActions(['setCaseForm']),
    editClosedEvent (body) {
      this.setCaseForm({ body })
    },
    changeContentType (value) {
      console.log(value)
    },
    removeData (row) {
      const body = this.body.filter((item) => item._XID !== row._XID)
      this.setCaseForm({ body })
    },
    changeRawData (e) {
      const { value: rawData } = e.target
      this.setCaseForm({ rawData })
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs_body {
  margin-top: 20px;
  .body_radio {
    padding-bottom: 15px;
  }
  .body_empty {
    text-align: center;
    font-weight: 700;
    padding: 10px;
    margin: 11vh 0;
    font-size: 16px;
    color: #a6b8ce;
  }
}
</style>
