<template>
  <div class="register-page">
    <div class="register-modal md-wrap">
      <div class="register-title">注册</div>
      <el-form ref="registerForm" size="large" :model="registerForm" :rules="rules" label-width="80px" class="register-form">
        <el-form-item prop="userName" label="用户名">
          <el-input type="text" v-model="registerForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input type="password" v-model="registerForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="确认密码">
          <el-input type="password" v-model="registerForm.newPassword" autocomplete="off"></el-input>
        </el-form-item>
        <div class="slider-wrap">
          <SliderCheck :on-pass="checkPass" />
        </div>
          <el-button :disabled="!checkFlag" class="register-btn" size="large" type="warning" @click="submitForm()">注册</el-button>
        <div class="do-login" @click="goLogin">去登录</div>
      </el-form>
    </div>

  </div>
</template>

<script type="text/javascript">
import SliderCheck from '@/components/SliderCheck/index.vue'
import { DO_REGISTER } from '@/api/model/login.fetch'
export default {
  name: 'Register',
  components: { SliderCheck },
  data () {
    var validatePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.registerForm.password !== '') {
          this.$refs.registerForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePwdPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 登录表单
      registerForm: {
        password: '',
        userName: '',
        newPassword: ''
      },
      // 表单检验规则
      rules: {
        userName: [
          { requite: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { validator: validatePwd, trigger: 'blur' }
        ],
        newPassword: [
          { validator: validatePwdPass, trigger: 'blur' }
        ]
      },
      // 滑块状态
      checkFlag: false
    }
  },
  methods: {
    /*
     *@description: 表单提交
     *@params: 无
     *@author: 李少斌
     *@date: 2021-11-24 18:22:31
    */
    submitForm () {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          DO_REGISTER({ ...this.registerForm }).then(async res => {
            if (res.success) {
              this.$notify({
                title: '成功',
                message: '注册成功',
                type: 'success'
              })
              this.$router.push('/login')
            }
            // await store.dispatch('getToken', data.token)
            // await store.dispatch('getUserinfo', data)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /*
     *@description: 滑块成功回调
     *@params: 无
     *@author: 李少斌
     *@date: 2021-11-24 18:22:55
    */
    checkPass () {
      this.checkFlag = true
    },
    /*
     *@description: 去登录
     *@params: 无
     *@author: 李少斌
     *@date: 2021-11-25 11:07:47
    */
    goLogin () {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
  .register-page{
    height: 100vh;
    width: 100%;
    background: url(../../assets/img/login-bg.png) no-repeat;
    background-size: cover;
    .register-bg-img{
      width: 100%;
      height: 100%;
    }
    .register-modal{
      background: rgba($color: #fff, $alpha: .8);
      border-radius: 8px;
      width: 350px;
      padding: 20px;
      .register-title{
        height: 40px;
        text-align: center;
        line-height: 40px;
      }
      .slider-wrap{
        margin-bottom: 18px;
      }
      .register-btn{
        width: 100%;
      }
      .do-login{
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #ffa000;
        cursor: pointer;
      }
    }
  }
</style>
