<!--
 * @Author: your name
 * @Date: 2021-03-09 17:49:12
 * @LastEditTime: 2021-04-23 14:35:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/Layout/Layout.vue
-->
<template>
  <div class="header" style="height: 100%">
    <div class="header-nav">
      <!-- <Zcloud-Head /> -->
      <Header />
    </div>
    <el-main style="clear: both; margin-top: 60px;height: 100%">
      <router-view />
    </el-main>
  </div>
</template>
<script>
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'LayoutHeader',
  mixins: [ResizeMixin],
  components: {
    Header: () => import('./Header')
  }
}
</script>
