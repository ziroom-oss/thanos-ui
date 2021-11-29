<template>
  <div class="header">
    <div class="system">
      <Hamburger
        @toggleClick="toggleSideBar"
        v-show="device === 'mobile'"
      />
    </div>
    <div class="headerLogo">
      <div class="header-logo"></div>
      <h3 class="logoText">THANOS</h3>
    </div>
    <Menu class="menu mobie" v-show="sidebar.opened || device === 'desktop'" />
    <div class="header-right">
      <InfoCenter />
      <div class="user">
        <el-dropdown @command="onUserLogout">
          <span class="el-dropdown-link">
            {{ userInfo.nickName }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger/index'
import { getUserInfo, removeToken, removeUserInfo } from '@/utils/auth'

export default {
  name: 'Header',
  data () {
    return {
      userInfo: getUserInfo()
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'device'])
  },
  components: {
    Menu: () => import('./Menu/Menu'),
    InfoCenter: () => import('@/views/InfoCenter/InfoCenter'),
    Hamburger
  },
  methods: {
    onUserLogout () {
      const r = window.confirm('是否退出登陆？')
      if (r) {
        removeUserInfo()
        removeToken()
        this.$router.push('/login')
      }
    },
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    handleClickOutside () {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>
<style scoped lang="scss">
// 小屏菜单栏相关样式
@media screen and (max-width: 992px) {
  .header {
    & .menu.mobie {
      margin-left: 0;
      width: 0;
    }
    .header-logo {
      margin-left: 0 !important;
    }
  }
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  height: 60px;
  line-height: 60px;
  color: #fff;
  width: 100%;
  z-index: 11;
  -webkit-transition: none !important;
  transition: none !important;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.85) !important;
  -webkit-box-shadow: 0 2px 8px 0 rgb(0 0 0 / 8%);
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 8%);
  padding: 0px 10px;
  display: flex;
  justify-content: space-between;
  .header-right,
  .header-left {
    display: flex;
    justify-content: space-between;
  }
  .system,
  .menu {
    float: left;
  }
  .menu {
    margin-left: 40px;
    width: 72%;
  }
  .user {
    flex-shrink: 0;
    // margin-right: 40px;
    // margin-left: 4px;
  }
  .headerLogo {
    cursor: pointer;
    width: 290px;
    height: 60px;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .header-logo {
    cursor: pointer;
    width: 40px;
    margin-left: 60px;
    margin-right: 10px;
    height: 40px;
    background: url(../assets/img/logo.png) no-repeat center;
    background-size: 100% 100%;
    float: left;
  }
  .logoText {
    display: block;
    font-size: 1.17em;
    font-weight: bold;
  }
  .el-dropdown-link {
    cursor: pointer;
  }
}
</style>
