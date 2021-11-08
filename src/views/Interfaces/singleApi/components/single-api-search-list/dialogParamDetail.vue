<template>
  <el-dialog title="参数详情" :visible="paramDetailVisible" @close="closeDialog">
    <el-row v-if="jsonRowShow === true">
      <el-input
        type="textarea"
        v-model="text"
        placeholder=""
        :autosize="{ minRows: 10 }"
      ></el-input>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="formatInparam" v-if="jsonRowShow === true"
        >格式化</el-button
      >
      <el-button type="primary" @click="commitFormat">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateSingleApiParam } from '@/api/model/singleApiList'
export default {
  name: 'dialogParamDetail',
  props: {
    id: [String, Number],
    paramDetailVisible: {
      type: Boolean,
      default: false
    },
    paramRowData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      text: '',
      jsonRowShow: true
    }
  },
  watch: {
    paramRowData (row) {
      if (row) this.text = row.requestParam
    }
  },
  methods: {
    closeDialog () {
      this.$emit('closeDialog')
    },
    // 提交接口
    commitFormat () {
      this.updateSingleApiParam()
    },
    formatInparam () {
      const json = JSON.parse(this.text)
      this.text = JSON.stringify(json, null, '\t')
    },
    // 提交参数修改
    updateSingleApiParam () {
      let params = ''
      if (this.jsonRowShow) {
        params = this.text
      } else {
        params = JSON.stringify(this.text)
      }
      const obj = { params, id: this.paramRowData.id.toString() }
      params = new URLSearchParams()
      for (const item in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, item)) {
          params.append(item, obj[item])
        }
      }
      updateSingleApiParam(params).then((response) => {
        if (response.success) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.updateForm()
        } else {
          this.$message({
            message: response.data,
            type: 'error'
          })
        }
      })
    },
    // 关闭表单
    updateForm () {
      this.text = ''
      this.$emit('updateForm')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  margin-top: 10px;
}
</style>
