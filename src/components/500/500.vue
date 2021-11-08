
<template>
  <div class="not-found">
    矮油，500了，用户不存在！
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
