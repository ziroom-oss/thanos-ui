<template>
  <div class="info-center">
    <el-popover
      placement="bottom"
      title="消息中心"
      width="500"
      trigger="click"
      popper-class="popover-center"
    >
      <el-badge :value="newsNumber" class="popover" slot="reference">
        <i class="el-icon-bell"></i>
      </el-badge>
      <div>
        <ul>
          <li
            v-for="item of newsList"
            :key="item.id"
            class="each-content"
            :style="{background: checkoutColor(item.msgStatus)}"
          >
            <h4 class="title" @click="onCheckNews(item)">{{item.msgTitle}}</h4>
            <div>{{item.content}}</div>
          </li>
        </ul>
        <el-button type="primary" size="mini" style="padding: 8px 0px;text-align:center;width: 60px;float: right;margin-bottom: 20px" @click="checkAllRead">全部已读</el-button>
      </div>
    </el-popover>
  </div>
</template>
<script>
import { getNewsList, getNewsStatusChange } from '@/api/model/infoCenter'
export default {
  name: 'InfoCenter',
  data: () => ({
    newsNumber: 0,
    newsList: []
  }),
  async mounted () {
    await this.getNewsList()
  },
  methods: {
    checkoutColor (status) {
      return status === 1 ? '#EBEEF5' : ''
    },
    getNewsList () { // 消息中心列表
      getNewsList()
        .then(res => {
          this.newsNumber = res.msgCount
          this.newsList = res.testMessageVo || []
        })
        .catch((Err) => {
          console.log(Err)
        })
    },
    changeNewsStatus (ids) { // 改变消息状态
      const params = {
        msgIdList: ids
      }
      getNewsStatusChange(params)
        .then(res => {
          this.getNewsList()
        })
        .catch((Err) => {
          console.log(Err)
        })
    },
    checkAllRead () {
      const ids = this.newsList.map(item => item.testMessageId)
      const id = ids.toString()
      id ? this.changeNewsStatus(id) : this.$notify({
        type: 'info',
        message: '暂无新消息'
      })
    },
    onCheckNews (data) {
      this.changeNewsStatus(data.testMessageId)
    }
  }
}
</script>
<style scoped lang="scss">
@media screen and (max-width: 900px) {
  .info-center {
    width: 40px !important;
  }
}
.info-center{
  width: 50px;
}
.popover{
  cursor: pointer;
}
.title{
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;
  min-width: 100px;
  transition: 1s all;
}
.title:hover{
  color: #2157FB;
}
.each-content{
  border-bottom: 1px solid #EBEEF5;
  padding-bottom: 7px;
  margin-bottom: 6px;
}
.activeColor{
  background: #ff0;
}
.readColor{
  background: #f00;
}
</style>
<style lang="scss">
.info-center{
  .el-badge__content.is-fixed{
    transform: translateY(0%) translateX(100%);
  }
}
.popover-center{
  top: 60px !important;
  height: 500px;
  overflow: scroll;
}
</style>
