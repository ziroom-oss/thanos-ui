<template>
  <div>
    <table class="mailTable">
      <tr v-for="(item,index) in dataMap" v-if="index%2 == 0">
        <td class="column">{{dataMap[index] == null ? '' : dataMap[index].name}}</td>
        <td>{{dataMap[index] == null ? '' : dataMap[index].value}}</td>
        <td class="column">{{dataMap[index+1] == null ? '' : dataMap[index+1].name}}</td>
        <td>{{dataMap[index+1] == null ? '' : dataMap[index+1].value}}</td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  name: 'CaseExecutionRunTable',
  data: () => ({
    dataMap: ''
  })
}
</script>
<style>
.mailTable,.mailTable tr,.mailTable tr td{
  border:1px solid #E6EAEE;
  width: 100%;
}
.mailTable{
  font-size: 16px;
  color: #71787E;
}
.mailTable tr td{
  border:1px solid #E6EAEE;
  width: 150px;
  height: 50px;
  line-height: 35px;
  box-sizing: border-box;
  padding: 0 10px;
}
.mailTable tr td.column {
  background-color: #EFF3F6;
  color: #393C3E;
  width: 80px;
}
</style>
