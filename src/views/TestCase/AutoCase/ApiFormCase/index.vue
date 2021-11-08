<template>
  <el-dialog
    :visible="dialogVisible"
    width="70%"
    v-loading="loading"
     element-loading-text="拼命运行中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="add_case"
    :close-on-click-modal="false"
    destroy-on-close
    @close="handleClose"
    @open="isDefault"
  >
    <el-form ref="form" :model="form" inline>
      <Header
        :apiFormData="apiFormData"
        :isSaveCase="isSaveCase"
        @saveCase="confrimSaveCase"
        @runCase="runCase"
        @close="handleClose"
        @updateData="$emit('updateData')"
      ></Header>
      <el-divider></el-divider>
      <Main :apiFormData="apiFormData" @runCase="runCase"></Main>
      <Footer v-show="selectTab.name !== 'Pre-request API'"></Footer>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import store from 'store'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import { parseParamToArr, parseHeader } from '@/utils/parse'
import { getSingleApiCaseById } from '@/api/model/singleRelyApiList'
import { baseKey } from '@/config/baseConfig.config'

export default {
  name: 'ApiFormCase',
  components: {
    Header,
    Main,
    Footer
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'ADD'
    },
    apiFormData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: mapState({
    form: (state) => state.cases.caseForm,
    loading: (state) => state.cases.loading,
    selectTab: (state) => state.cases.selectTab,
    isSaveCase: (state) => state.cases.isSaveCase
  }),
  watch: {
    bodyType: {
      handler (newval, oldval) {
        if (oldval === 'none') {
          switch (newval) {
            case 'formdata': {
              if (this.form.header[0].key !== 'Content-Type') {
                this.form.header.unshift({
                  key: 'Content-Type',
                  value: 'multipart/form-data'
                })
              }
              this.ifAppendElement(this.form.formData)
              break
            }
            case 'xwww': {
              if (this.form.header[0].key !== 'Content-Type') {
                this.form.header.unshift({
                  key: 'Content-Type',
                  value: 'application/x-www-form-urlencoded'
                })
              }
              this.ifAppendElement(this.form.xwww)
              break
            }
            case 'raw': {
              if (this.form.header[0].key !== 'Content-Type') {
                this.form.header.unshift({
                  key: 'Content-Type',
                  value: 'application/json'
                })
              }
              break
            }
          }
        } else {
          switch (newval) {
            case 'none': {
              this.form.header.shift()
              break
            }
            case 'formdata': {
              this.form.header[0].value = 'multipart/form-data'
              this.ifAppendElement(this.form.formData)
              break
            }
            case 'xwww': {
              this.form.header[0].value = 'application/x-www-form-urlencoded'
              this.ifAppendElement(this.form.xwww)
              break
            }
            case 'raw': {
              this.form.header[0].value = 'application/json'
              break
            }
          }
        }
        this.form.bodyType = newval
      },
      deep: true
    },
    form: {
      handler (val) {
        this.setIsSaveCase(false)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'setCaseForm',
      'setType',
      'runCase',
      'resetFormData',
      'saveCase',
      'setIsSaveCase',
      'runCaseFisrt'
    ]),
    // 取路由跳转过来的值
    async isDefault () {
      const type = this.type
      const data = this.apiFormData
      const { requestParam = {}, requestBody = {}, header = [], id, preSql, preRequest } = data

      data.requestType = data.requestType.toLocaleUpperCase()
      // 复制,编辑
      if (type !== 'ADD') {
        Promise.allSettled([
          parseParamToArr(requestParam),
          parseParamToArr(requestBody)
        ]).then(async ([params, body]) => {
          const STATUS = 'fulfilled'
          const paramsValue = params.status === STATUS ? params.value : []
          const bodyValue = body.status === STATUS ? body.value : []
          const res = await getSingleApiCaseById({ caseId: id })

          if (res.success) {
            data.assertList = res?.data?.assertList || []
          }
          data.params = [...paramsValue, { key: '', value: '' }]
          data.header = parseHeader(header)
          data.preSql = preSql
          data.preRequest = preRequest ? preRequest.split(',') : ''

          const contentType = data.header.find(
            (item) => item.key?.toLowerCase() === 'content-type'
          )
          // 判断contentType的类型并且放到不同的地方
          if (
            contentType &&
            contentType?.value?.toLowerCase() !== 'application/json'
          ) {
            data.body = [...bodyValue, { key: '', value: '' }]
          } else {
            // 解析body放到rawData中
            const obj = {}
            for (const item of bodyValue) {
              obj[item.key] = item.value
            }
            data.rawData = JSON.stringify(obj)
          }

          this.setCaseForm(data)
          this.runCaseFisrt();
        })
      } else {
        data.header = parseHeader(header)
        this.setCaseForm(data)
      }

      this.setType(type)
      this.getTip()
    },
    async getTip () {
      const tip = store.get(`${baseKey}tip1`)
      if (!tip) {
        store.set(`${baseKey}tip1`, true)
        this.$message({
          message: '运行并断言成功才能保存',
          type: 'warning',
          duration: 5000,
          offset: 50
        })
      }
    },
    async confrimSaveCase () {
      await this.saveCase()
        .then((res) => {
          this.$message({
            message: res || '保存失败',
            type: res ? 'success' : 'warning'
          })
        })
        .catch(() => {})
    },
    handleClose () {
      this.$emit('close')
      this.$emit('updateData')
      this.resetFormData()
    }
  }
}
</script>

<style lang="scss" scoped>
.add_case {
  ::v-deep .el-dialog {
    margin-top: 10vh !important;
  }
  ::v-deep .el-divider--horizontal {
    margin-top: 10px;
  }
}
</style>
