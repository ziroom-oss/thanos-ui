<template>
  <div class="login-page">
    <div class="login-modal md-wrap">
      <el-form ref="loginForm" size="large" :model="loginForm" :rules="rules" label-width="0px" class="login-form">
        <el-form-item prop="userName">
          <el-input type="text" v-model="loginForm.userName"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <div class="slider-wrap">
          <SliderCheck :on-pass="checkPass" />
        </div>
        <el-form-item>
          <el-button :disabled="!checkFlag" class="login-btn" type="warning" @click="submitForm()">登录</el-button>
          <a class="forget-pwd" href="http://auth.ziroom.com/resetpwd">忘记密码</a>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script type="text/javascript">
import SliderCheck from '@/components/SliderCheck/index.vue'
export default {
  name: 'Login',
  components: { SliderCheck },
  data () {
    return {
      // 登录表单
      loginForm: {
        password: '',
        userName: ''
      },
      // 表单检验规则
      rules: {
        userName: [
          { requite: true, message: '请输入用户名', trigger: 'blur' }
        ],
        passowrd: [
          { requite: true, message: '请输入密码', trigger: 'blur' }
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
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          console.log(this.loginForm)
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-page{
    height: 100vh;
    width: 100%;
    background: url(../../assets/img/login-bg.png) no-repeat;
    background-size: cover;
    .login-bg-img{
      width: 100%;
      height: 100%;
    }
    .login-modal{
      background: rgba($color: #fff, $alpha: .8);
      border-radius: 8px;
      width: 350px;
      padding: 20px;
      .slider-wrap{
        margin-bottom: 18px;
      }
      .login-btn{
        width: 100%;
      }
      .forget-pwd{
        &:link{
          color: #999;
        }
        &:visited{
          color: #999;
        }
        &:hover{
          color: #ffa000;
        }
        // &:active{

        // }
      }
    }
  }
</style>
