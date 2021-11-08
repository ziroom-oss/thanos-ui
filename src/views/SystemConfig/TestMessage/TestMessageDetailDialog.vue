<template>
  <div class="test-case-batch">
    <el-dialog
      title="消息"
      :visible.sync="TestMessageDetailDialog"
      :before-close="handleClose"
    >
      <el-form
        :model="detailDialogValue"
        ref="detailDialog"
        label-width="100px"
        class="detail-dialog"
      >
        <el-form-item label="消息标题:" prop="casename">
          <el-input
            v-model="detailDialogValue.msgTitle"
            clearable
            @change="checkNewMessageTitle"
          />
        </el-form-item>
        <el-form-item label="消息内容:" prop="content">
          <el-input
            type="textarea"
            clearable
            v-model="detailDialogValue.content"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="saveButtonStatus"
            @click="submitForm('detailDialog')"
          >保存
          </el-button
          >
          <el-button @click="resetForm('detailDialog')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  insertNewMessage,
  updateNewMessage,
  checkNewMessageTitle
} from '@/api/model/testMessage'

export default {
  name: 'TestMessageDetailDialog',
  data () {
    return {
      TestMessageDetailDialog: false,
      detailDialogValue: {
        id: '',
        msgTitle: '',
        content: ''
      },
      loading: false,
      saveButtonStatus: true,
      // 新增编辑标识
      caseType: 'add'
    }
  },
  computed: {
    cascaderConfig () {
      return {
        isToPerson: false, // true 细粒度到人 false 细粒度不到人
        multipleCheck: false
      }
    }
  },
  async mounted () {
  },
  methods: {
    handleClose () {
      this.$refs.detailDialog.resetFields()
      this.TestMessageDetailDialog = false
    },
    async checkNewMessageTitle (val) {
      // 校验msgTitle名称唯一
      const params = { msgTitle: val, msgId: this.detailDialogValue.id }
      const res = await checkNewMessageTitle(params)
      const respData = res.success
      this.saveButtonStatus = !respData
    },
    async saveMessage (params) {
      insertNewMessage(params)
        .then(res => {
          this.$notify({
            type: 'success',
            message: '保存成功'
          })
          this.$emit('querytestMessageList')
        })
    },
    async updateMessage (params) {
      updateNewMessage(params)
        .then(res => {
          this.$notify({
            type: 'success',
            message: '保存成功'
          })
          this.$emit('querytestMessageList')
        })
    },
    async submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            ...this.detailDialogValue
          }
          if (this.caseType === 'add') {
            this.saveMessage(params)
          } else {
            this.updateMessage(params)
          }
          this.$refs[formName].resetFields()
          this.TestMessageDetailDialog = false
        } else {
          this.TestMessageDetailDialog = false
          this.$notify({
            type: 'error',
            message: '保存失败'
          })
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.TestMessageDetailDialog = false
    }
  }
}
</script>
