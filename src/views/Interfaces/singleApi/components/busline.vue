<template>
    <div class="busLine">
        <div class="divClass">
            <el-row style="color: #7c7c7c;margin-top:10px" type="flex" justify="left">
                <el-col :xs="3" :sm="4" :md="3" :lg="3" style="padding-top:10px;align:left " >
                    <router-link to='/interfaces/singleApi/single-api-search-list'>
                        <el-button type="primary" size="medium">切换搜索视图
                        </el-button>
                        <!--<el-link type="primary" style="font-size: large">>>进入快捷搜索页面</el-link>-->
                    </router-link>
                </el-col>

                <el-col :xs="3" :sm="4" :md="4" :lg="4" style="padding-top:10px">
                    <router-link to='/interfaces/singleApi/single-api-save'>
                        <el-button type="success" size="medium">新增单接口用例
                        </el-button>
                    </router-link>
                </el-col>

                <!--<el-col :xs="6" :sm="16" :md="16" :lg="16" float="right">-->
                <!--快捷搜索域名:-->
                <!--<el-select filterable placeholder="请输入查询的线上域名"-->
                <!--clearable v-model="systemId">-->
                <!--<el-option-->
                <!--v-for="system in systemList"-->
                <!--:key="system.id"-->
                <!--:value="system.id"-->
                <!--:label="system.onlineDomainName"-->
                <!--&gt;-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--<el-button type="primary" icon="el-icon-search" size="mini" @click="toApiSystem" plain></el-button>-->
                <!--</el-col>-->

            </el-row>

        </div>
        <el-row>
            <el-col :xs="8" :sm="6" :md="4" :lg="4" :xl="4" v-for="item in items" :key="item.id" style="margin:40px">
                <el-card :body-style="{ padding: '0px', height:'200px'}" shadow="hover"
                         style="width: 260px;height: 210px;">
                    <div style="padding: 6px;height: 230px;" @click="selectBusiCode(item)">
                        <img src="@/assets/img/home.jpg" class="image">
                        <div style="padding: 0px;">
                            <div class="bottom clearfix " style="align:center">
                                <el-button type="text" class="button" @click="selectBusiCode(item)">
                                    {{item.businessName}}
                                </el-button>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {
  getAllBusinessLineList, getSytemList

} from '@/api/model/singleApiList'

export default {

  name: 'busline',
  created () {
    this.getBusiline()
    this.getSystemList()
  },
  data () {
    return {
      items: [{
        id: '',
        businessCode: '',
        businessName: ''
      }],
      systemId: '',
      onlineDomainName: '',
      systemList: [{
        id: '',
        onlineDomainName: ''
      }]
    }
  },
  methods: {
    getBusiline () {
      getAllBusinessLineList().then(response => {
        if (response.success) {
          this.items = response.data
          console.log(this.items)
        }
      })
    },
    selectBusiCode (item) {
      this.$emit('selectBusiCode', item)
    },
    getSystemList () {
      getSytemList().then(response => {
        if (response.success) {
          this.systemList = response.data
        }
      })
    },
    toApiSystem () {
      for (var index in this.systemList) {
        if (this.systemList[index].id === this.systemId) {
          this.onlineDomainName = this.systemList[index].onlineDomainName
        }
        var dataObj = {
          systemId: this.systemId,
          label: this.onlineDomainName
        }
      }

      this.$emit('searchSystem', dataObj)
    },
    clearSearchStatus () {
      this.systemId = ''
    }
  }
}
</script>

<style scoped>
    .time {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        display: block;
        margin: 0 auto
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .busLine {
      width: 100%;
    }

    .divClass {
        margin-top: 20px;
        padding: 10px;
        background-color: white;
        border: 1px;
        color: #333;
        text-align: center;
    }

</style>
