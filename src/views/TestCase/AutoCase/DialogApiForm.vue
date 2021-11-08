<template>
  <div>
    <el-dialog
      :title="title"
      width="60%"
      :visible="apiFormShow"
      :close-on-click-modal="false"
      destroy-on-close
      @close="resetSql('formRef')"
      @open="open"
    >
      <el-form
        :model="form"
        :rules="rules"
        label-width="90px"
        size="mini"
        ref="formRef"
      >
        <el-form-item
          label="应用名称"
          prop="applicationName"
          :hidden="!isModule"
        >

          <el-input v-model="form.applicationName" disabled></el-input>
        </el-form-item>

        <el-form-item
          label="模块名称"
          :prop="!isModule ? 'controllerName' : ''"
          :hidden="level === 3 || isModule"
        >
          <el-input v-model="form.controllerName"></el-input>
        </el-form-item>
        <el-form-item
          label="接口名称:"
          :prop="!isModule ? 'apiName' : ''"
          :hidden="isModule"
        >
          <el-input
            v-model="form.apiName"
            placeholder="请添加接口名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="请求方式:"
          :prop="!isModule ? 'requestType' : ''"
          :hidden="isModule"
        >
          <el-select v-model="form.requestType">
            <el-option label="GET" value="GET"></el-option>
            <el-option label="POST" value="POST"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="URI:"
          :prop="!isModule ? 'requestUri' : ''"
          :hidden="isModule"
        >
          <el-input v-model="form.requestUri"></el-input>
        </el-form-item>
        <el-form-item label="Header:" prop="header">
          <div class="grid-content">
            <EditTable
              ref="xTable"
              :tableData="form.header"
              @removeData="removeData"
              @editClosedEvent="editClosedEvent"
            />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="success" @click="submitApiInfo('formRef')">{{
          title.includes("新增") ? "保存" : "修改"
        }}</el-button>
        <el-button type="info" @click="resetSql('formRef')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import EditTable from '@/components/EditTable'
import { parseHeader, parseHeaderTostring } from '@/utils/parse'
import { updateSingleApi } from '@/api/model/singleApiList'
import { saveSingleApiV2, headerUpdateByApp } from '@/api/model/singleApiSave'

export default {
  name: 'DialogApiForm',
  components: { EditTable },
  props: {
    title: String,
    apiFormShow: {
      type: Boolean,
      default: false
    },
    apiFormData: {
      type: Object,
      default () {
        return {}
      }
    },
    level: {
      type: Number
    }
  },
  computed: {
    isModule () {
      return this.title === '应用编辑'
    }
  },
  data () {
    return {
      form: {
        controllerName: '', // 模块名称
        requestType: '', // 请求方式
        requestUri: '',
        apiName: '', // 接口名称
        applicationName: '',
        header: [
          {
            key: '',
            value: ''
          }
        ]
      },
      rules: {
        requestUri: [{ required: true, message: '请输入URI', trigger: 'blur' }],
        controllerName: [
          {
            required: true,
            message: '请输入模块名称',
            trigger: 'blur'
          }
        ],
        applicationName: [
          {
            required: true,
            message: '请输入应用名称',
            trigger: 'blur'
          }
        ],
        requestType: [
          {
            required: true,
            message: '请选择请求方式',
            trigger: 'change'
          }
        ],
        apiName: [
          {
            required: true,
            message: '请输入接口名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    resetSql (formName) {
      this.$refs[formName].resetFields()
      this.form = {
        controllerName: '', // 模块名称
        requestType: '', // 请求方式
        requestUri: '',
        apiName: '', // 接口名称
        applicationName: '',
        header: [
          {
            key: '',
            value: ''
          }
        ]
      }
      this.$emit('closeApiForm')
    },
    // 提交编辑数据
    submitApiInfo (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { header, ...reset } = this.form
          const isEdit = this.level === 3
          const isModule = this.isModule

          let res = null
          const params = {
            ...reset,
            header: parseHeaderTostring(header),
            createTime: null,
            updateTime: null
          }
          // todo 模块功能
          if (isEdit) {
            res = await updateSingleApi(params)
          } else {
            res = isModule
              ? await headerUpdateByApp({
                header: params.header,
                applicationName: params.applicationName
              })
              : await saveSingleApiV2(params)
          }

          if (res.success) {
            this.$message({
              message: isEdit ? '编辑成功' : '添加成功',
              type: 'success'
            })
            this.resetSql(formName)
            this.$emit('getList')
          } else {
            this.$message({
              message: res.errorMessage,
              type: 'error'
            })
          }
        }
      })
    },
    open () {
      const level = this.level

      switch (level) {
        case 1: {
          const isModule = this.isModule
          const { header = '', applicationName } = this.apiFormData?.data

          this.form.applicationName = applicationName
          if (isModule) {
            this.form.header = parseHeader(header)
          }
          break
        }
        case 2: {
          const { label: controllerName } = this.apiFormData
          const { label: applicationName } = this.apiFormData.parent

          this.form = { ...this.form, controllerName, applicationName }
          break
        }
        default: {
          const { header } = this.apiFormData.data

          this.form = {
            ...this.form,
            ...this.apiFormData.data,
            header: parseHeader(header)
          }
          break
        }
      }
    },
    removeData (row) {
      this.form.header = this.form.header.filter(
        (item) => item._XID !== row._XID
      )
    },
    editClosedEvent (data) {
      this.form.header = data
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
