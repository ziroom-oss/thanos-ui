<template>
  <div>
    <el-dialog
      title="提示"
      :visible="dialogVisible"
      width="30%"
      @close="closeDialog"
    >
      <div style="margin-bottom: 30px; color: orange">
        <i class="el-icon-info"></i>请先进行选择运行环境（默认QA环境）
      </div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="env">
          <el-radio-group v-model="form.env">
            <el-radio
              v-for="item of envList"
              :label="item.value"
              :key="item.value"
            >{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="runCase('form')">运行</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getEnvList } from '@/api/model/singleApiList'
export default {
  name: 'ApiCaseRunDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: { // 表单
        env: 'qua'
      },
      envList: [], // 环境列表
      rules: { // 校验规则
        env: [{ required: true, message: '请选择环境', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getEnvList()
  },
  methods: {
    // 关闭弹框
    closeDialog () {
      this.$refs.form.resetFields()
      this.$emit('close')
    },
    runCase (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('runCase', this.form.env)
          this.closeDialog()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取环境列表
    async getEnvList () {
      const res = await getEnvList()
      this.envList = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
