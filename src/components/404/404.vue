<!--
 * @Author: your name
 * @Date: 2021-06-17 09:57:35
 * @LastEditTime: 2021-06-17 10:48:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /quality-defense-initiative/src/components/404.vue
-->
<template>
  <div class="not-found">
    矮油，404了
    <span @click="$router.push({path: ''})">返回主页面</span>
  </div>
</template>
<style scoped>
  .not-found{
    text-align: center;
    align-content: center;
    font-size: 20px;
    font-weight: bold;
  }
</style>
