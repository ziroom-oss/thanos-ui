<template>
  <div class="from-container">
    <el-form
      :model="form"
      :rules="rules"
      label-width="120px"
      size="mini"
      ref="formRef"
    >
      <el-form-item label="数据库名称" prop="dbName">
        <el-input v-model="form.dbName" placeholder="请输入数据库名称"></el-input>
      </el-form-item>
      <el-form-item label="数据库类型" prop="dbType">
        <el-select v-model="form.dbType">
          <el-option label="mysql" value="mysql"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="IP" prop="dbIp">
        <el-input v-model="form.dbIp" placeholder="请输入IP"></el-input>
      </el-form-item>
      <el-form-item label="端口" prop="dbPort">
        <el-input v-model="form.dbPort" placeholder="请输入端口"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="userPassword">
          <el-input v-model="form.userPassword" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" placeholder="请输入描述"></el-input>
      </el-form-item>
    </el-form>
    <div class="aotu-case-footer" slot="footer">
      <el-button type="success" @click="onTestConnection(false)">测试链接</el-button>
      <div>
        <el-button type="success" :loading="submitLoading" @click="onTestConnection(true, 'formRef')">{{ formType === 'add' ? '保存' : '修改' }}</el-button>
        <el-button type="info" @click="handleCancel('formRef')">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { testConnection, saveConnection, updateConnection } from '@/api/model/testCase'

export default {
  name: 'DatabaseForm',
  components: { },
  props: {
    formData: {
      type: Object,
      default () {
        return {}
      }
    },
    formType: {
      type: String,
      default: 'add'
    },
    level: {
      type: Number
    },
    applicationDetails: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      submitLoading: false,
      form: {
        dbName: '',
        dbType: 'mysql',
        dbIp: '',
        dbPort: '',
        userName: '',
        userPassword: '',
        description: ''
      },
      rules: {
        dbName: [
          {
            required: true,
            message: '请输入数据库名称',
            trigger: 'blur'
          }
        ],
        dbType: [
          {
            required: true,
            message: '请输入数据库类型',
            trigger: 'change'
          }
        ],
        dbIp: [
          {
            required: true,
            message: '请输入IP',
            trigger: 'blur'
          }],
        dbPort: [
          {
            required: true,
            message: '请输入端口',
            trigger: 'blur'
          }
        ],
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
        userPassword: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        description: [
          {
            message: '请输入描述',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    formData: {
      handler (val) {
        this.form = {
          ...this.form,
          ...val
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    resetFrom (formName) {
      this.$refs[formName].resetFields()
      this.form = {
        dbName: '',
        dbType: 'mysql',
        dbIp: '',
        dbPort: '',
        userName: '',
        userPassword: '',
        description: ''
      }
    },
    // 提交编辑数据
    submitDatabaseInfo (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          const params = {
            applicationName: this.applicationDetails.applicationName,
            env: 'qua',
            ...this.form
          }
          const res = await (this.formType === 'edit' ? updateConnection({ id: this.formData.id, ...params }) : saveConnection(params))
          this.submitLoading = false
          if (res.success) {
            this.$message({
              message: this.formType === 'edit' ? ' 修改成功' : '添加成功',
              type: 'success'
            })
            this.resetFrom(formName)
            this.$emit('refrech')
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }
      })
    },
    async onTestConnection (isSave, formName) {
      const params = {
        applicationName: this.applicationDetails.applicationName,
        env: 'qua',
        ...this.form
      }

      await testConnection(params)
        .then(res => {
          if (res.success && res.data) {
            if (res.data.status) {
              console.log(isSave, 'isSave')
              if (isSave) {
                this.submitDatabaseInfo(formName)
              } else {
                this.$notify({
                  type: 'success',
                  message: '连接成功'
                })
              }
            } else {
              this.$message({
                message: res.data.errorMsg,
                type: 'error'
              })
            }
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
    },
    handleCancel (formName) {
      this.resetFrom(formName)
      this.$emit('handleCancel', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  .from-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
  .aotu-case-footer {
    padding-top: 8px;
    display: flex;
    justify-content: space-between;
  }
</style>
