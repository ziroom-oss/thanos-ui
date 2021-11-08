<template>
    <el-form label-width="80px" size="mini">
        <el-form-item label="请求方式">
            <el-select v-model="form.apiType">
                <el-option label="GET" value="GET"></el-option>
                <el-option label="POST" value="POST"></el-option>
                <el-option label="PUT" value="PUT"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="加密方式">
            <el-select v-model="form.encrypt">
                <el-option label="不加密" value="0"></el-option>
                <el-option label="网关加密" value="1"></el-option>
                <el-option label="服务加密" value="2"></el-option>
                <el-option label="民宿加密" value="3"></el-option>
                <el-option label="自如驿加密" value="4"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="依赖类型">
            <el-select v-model="form.relyType">
                <el-option label="非依赖接口" value="0"></el-option>
                <el-option label="依赖接口" value="1"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="测试域名">
            <el-input v-model="form.requestUri"></el-input>
        </el-form-item>
        <el-form-item label="依赖API">
            <el-col :xs="5" :sm="5" :md="5" :lg="3">
                <el-select v-model="form.relyApiId" clearable placeholder="请选择依赖API" @change="displayRelyUri">
                    <el-option
                            v-for="item in relyList"
                            :key="item.id"
                            :value="item.relyId"
                            :label="item.caseName"
                    >
                    </el-option>
                </el-select>
            </el-col>
            <el-col :xs="19" :sm="19" :md="19" :lg="21">
                <el-input v-model="form.relyApiDetail" :disabled="true">
                    <template slot="prepend">依赖API地址:</template>
                </el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="SQL">
            <div v-for="item in sqlForm.items" :key="item.key">
                <el-col :xs="3" :sm="3" :md="3" :lg="3" style="padding-bottom: 10px">
                    <el-select v-model="item.sqlType" @change="reloadSqlList(item)">
                        <el-option label="前置SQL" value="1"></el-option>
                        <el-option label="后置SQL" value="0"></el-option>
                    </el-select>
                </el-col>
                <el-col :xs="4" :sm="4" :md="4" :lg="3" style="padding-bottom: 10px">
                    <el-select v-model="item.sqlName" filterable placeholder="请选择SQL名称" clearable
                               @change="displaySqlDetail(item)">
                        <el-option
                                v-for="sql in item.sqlList"
                                :key="sql.id"
                                :value="sql.sqlName"
                        >
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :xs="15" :sm="15" :md="15" :lg="16" style="padding-bottom: 10px">
                    <el-input v-model="item.sqlDetail" :disabled="true">
                        <template slot="prepend">用例所含SQL</template>
                    </el-input>
                </el-col>
                <el-col :xs="1" :sm="1" :md="1" :lg="1" style="padding-bottom: 10px">
                    <el-button @click.prevent="removeSqlList(item)" icon="el-icon-minus" type="primary" size="mini"
                               circle plain></el-button>
                </el-col>
            </div>
            <el-col :span="1">
                <el-button icon="el-icon-plus" type="primary" size="mini" circle @click="addItem" plain></el-button>
            </el-col>
        </el-form-item>
        <el-form-item label="Header">
            <div class="grid-content">
                <el-input class="grid-content"
                          type="textarea"
                          :autosize="{ minRows: 7}"
                          placeholder="Accept: application/json;version=2"
                >
                </el-input>

            </div>
        </el-form-item>
    </el-form>
</template>

<script>
import {
  getSqlList,
  getRelyList
} from '@/api/model/singleApiSave'

export default {
  data () {
    return {
      form: {
        apiType: '',
        encrypt: '',
        requestUri: '',
        relyType: '0',
        relyApiId: '',
        systemObj: {
          systemName: '',
          systemId: ''
        },
        relyApiDetail: ''
      },
      sqlForm: {
        items: [{
          sqlType: '1',
          sqlId: '',
          sqlName: '',
          sqlDetail: '',
          sqlList: [{
            sqlName: '',
            id: '',
            sqlData: ''

          }]
        }]
      },
      relyList: [{
        id: '',
        relyId: '',
        caseName: '',
        requestUri: ''
      }]
    }
  },
  methods: {
    getEditFormInfo (e) {
      // 获取依赖列表
      this.getRelyList()

      this.form.apiType = formInfo.requestType
      this.form.encrypt = formInfo.encryptType
      this.form.requestUri = formInfo.requestUri
      // ?字段有问题，待确认
      this.form.relyType = formInfo.rely
      // 获取依赖
      if (formInfo.relyId != null || formInfo.relyId !== '') {
        this.form.relyApiId = formInfo.relyId
        for (var i = 0; i < this.relyList.length; i++) {
          if (this.hideInfo.relyApiId === this.relyList[i].relyId) {
            this.form.relyApiDetail = this.relyList[i].requestUri
          }
          break
        }
      }

      // 获取sql
      if (formInfo.preSqlId != null) {
        var arr = []
        arr = formInfo.preSqlId.split(',')
        for (let i = 0; i < arr.length; i++) {
          getSqlList({ isPrep: '1' }).then(response => {
            this.sqlForm.items[i].sqlList = response.data
          })
          var obj = {
            sqlType: '1',
            sqlId: arr[i],
            sqlName: '',
            sqlDetail: '',
            sqlList: [{
              sqlName: '',
              id: '',
              sqlData: ''

            }]
          }
          this.sqlForm.items.push(obj)
        }
      }
    },
    getSqlList (sqlType) {
      getSqlList({ isPrep: sqlType }).then(response => {
        this.sqlForm.items[0].sqlList = response.data
      })
    },
    // 切换sqlType--获取sql列表
    reloadSqlList (item) {
      var type = item.sqlType
      var index = this.sqlForm.items.indexOf(item)
      getSqlList({ isPrep: type }).then(response => {
        this.sqlForm.items[index].sqlList = response.data
      })
    },
    // 选择的sql名称后，显示详细的sql信息sqlDetail
    displaySqlDetail (item) {
      // console.log(JSON.stringify(item));
      var index = this.sqlForm.items.indexOf(item)
      var sqlList = this.sqlForm.items[index].sqlList
      for (var i = 0; i < sqlList.length; i++) {
        var sqlObj = sqlList[i]
        if (item.sqlName === sqlObj.sqlName) {
          this.sqlForm.items[index].sqlId = sqlObj.id
          this.sqlForm.items[index].sqlDetail = sqlObj.sqlData
        }
      }
    },

    getRelyList () {
      getRelyList({ caseName: null }).then(response => {
        this.relyList = response.data
        // alert(JSON.stringify(this.relyList))
      })
    },
    // 获取依赖对应的uri
    displayRelyUri () {
      for (var i = 0; i < this.relyList.length; i++) {
        if (this.hideInfo.relyApiId === this.relyList[i].relyId) {
          this.hideInfo.relyApiDetail = this.relyList[i].requestUri
        }
        break
      }
    },
    // sql增加前/后置
    addItem () {
      var sqlType = '1'
      var sqlList = []
      getSqlList({ isPrep: sqlType }).then(response => {
        sqlList = response.data
        this.sqlForm.items.push({
          sqlType: sqlType,
          sqlName: '',
          sqlDetail: '',
          sqlList: sqlList
        })
      })
    },
    // 移除sql前/后置
    removeSqlList (item) {
      var index = this.sqlForm.items.indexOf(item)
      if (index !== -1) {
        this.sqlForm.items.splice(index, 1)
      }
    }

  }
}
</script>
<style scoped>
    .grid-content {
        border-radius: 4px;
        min-height: 160px;
    }
</style>
