<template>
  <transition name="fade">
    <div class="sidebar-custom">
      <el-menu
        class="el-menu"
        mode="horizontal"
        :default-active="defaultActive"
        background-color="#fff"
        active-text-color="rgba(0,0,0,0.85)"
      >
        <menu-item
          v-for="route in routesPath"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </div>
  </transition>
</template>

<script>
import MenuItem from './MenuItem.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Sidebar',
  components: { MenuItem },
  data () {
    return {
      activeIndex: ''
    }
  },
  computed: {
    ...mapGetters(['routes']),
    routesPath () {
      return this.routes
      // return JSON.parse(this.routes)
    },
    defaultActive () {
      const { path } = this.$route
      return path
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu {
  height: 100%;
  position: relative;
  div {
    float: left;
  }
}
</style>

<style lang="scss">
// 小屏菜单栏相关样式
@media screen and (max-width: 992px) {
  .el-menu.el-menu--horizontal {
    position: fixed;
    height: 100vh;
    left: 0;
    top: 60px;
    z-index: 1001;
    div {
      width: 200px;
      float: none;
    }
  }
}
// 过渡相关
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.sidebar-custom .el-menu-item,
.el-submenu__title {
  height: 60px;
  line-height: 60px;
}
.el-menu-item {
  transition: 0.5s ease;
  padding: 0px 5px;
  margin: 0px 15px;
  &:hover {
    border-bottom: 3px solid #1b58f8 !important;
    background-color: #fff !important;
  }
}
.sidebar-custom {
  .is-active {
    border-bottom: 3px solid #1b58f8 !important;
    background-color: #fff !important;
  }
}
.sidebar-custom {
  height: 100%;
  .el-menu {
    border: none;
  }
  .el-scrollbar__view {
    height: 100%;
  }
  .el-menu-item {
    font-size: 15px;
    font-weight: 500;
  }
}
</style>
