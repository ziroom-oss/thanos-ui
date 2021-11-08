<template>
  <el-dialog
    title="swagger导入"
    :visible="dialogVisible"
    width="50%"
    style="margin-top: -50px"
    :close-on-click-modal="false"
    @close="closeSwaggerDialog('importRef')"
  >
    <el-form
      :model="importForm"
      label-width="100px"
      :rules="importRules"
      ref="importRef"
    >
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="应用名称:" prop="applicationName">
            <el-select
              v-model="importForm.applicationName"
              placeholder="请选择应用名称"
              disabled
            >
              <el-option
                v-for="item in omegaList"
                :key="item.id"
                :label="item.applicationName"
                :value="item.applicationName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="域名/URL:" prop="swaggerUrl">
            <el-input
              v-model="importForm.swaggerUrl"
              placeholder="带http头的URL"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-form-item>
          <el-button
            type="primary"
            :loading="importLoading"
            @click="validateAnalyzeSwagger('importRef', false)"
            >手动导入</el-button
          >
          <el-button
            :loading="updateLoading"
            @click="validateAnalyzeSwagger('importRef', true)"
            >更新</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { analyzeSwaggerApiByUrl, updateAnalyzeSwagger, getSwagger } from '@/api/model/apiStorage'
import API_STORAGE_CONFIG from '@/config/apiStorage.config'
export default {
  name: 'ApiCaseSwaggerUploadDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      defalut: false
    },
    omegaList: {
      type: Array,
      defalut () {
        return []
      }
    },
    applicationDetails: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    dialogVisible: {
      async handler (val) {
        if (val) {
          this.importForm.applicationName = this.applicationDetails.applicationName
          await this.getSwagger()
        }
      },
      deep: true
    }
  },
  data () {
    return {
      importForm: {
        applicationName: '',
        swaggerUrl: ''
      },
      importRules: API_STORAGE_CONFIG.appFormRules, // 导入表单校验规则
      importLoading: false, // swagger导入按钮loading
      updateLoading: false
    }
  },
  methods: {
    async getSwagger () {
      const params = {
        applicationName: this.applicationDetails.applicationName,
        env: 'qua'
      }
      const res = await getSwagger(params)

      if (res.success && res.data) {
        this.importForm = {
          applicationName: res.data.applicationName,
          swaggerUrl: decodeURI(atob(res.data.swaggerUrl))
        }
      }
    },
    import (formName, pramas) {
      analyzeSwaggerApiByUrl(pramas)
        .then((res) => {
          if (res.success) {
            this.$notify({
              title: '导入成功',
              dangerouslyUseHTMLString: true,
              message: `<p>重新导入${res.data}条</p>`,
              type: 'success'
            })
            this.closeSwaggerDialog(formName)
            this.$emit('getList')
          }
        })
        .finally(() => {
          this.importLoading = false
        })
    },
    update (formName, pramas) {
      updateAnalyzeSwagger(pramas)
        .then((res) => {
          if (res.success) {
            this.$notify({
              title: '更新成功',
              type: 'success'
            })
            this.closeSwaggerDialog(formName)
            this.$emit('getList')
          }
        })
        .finally(() => {
          this.updateLoading = false
        })
    },
    validateAnalyzeSwagger (formName, isUpdate) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (isUpdate) {
            this.updateLoading = true
          } else {
            this.importLoading = true
          }

          const pramas = {
            ...this.importForm,
            swaggerUrl: btoa(encodeURI(this.importForm.swaggerUrl))
          }

          isUpdate ? this.update(formName, pramas) : this.import(formName, pramas)
        }
      })
    },
    // 关闭swagger导入对话框
    closeSwaggerDialog (formName) {
      this.importForm = {
        swaggerUrl: '',
      }
      this.$emit('close')
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
