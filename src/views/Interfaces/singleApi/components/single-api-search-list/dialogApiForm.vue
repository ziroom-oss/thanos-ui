<template>
  <div>
    <el-dialog
      :title="formTitle"
      :visible="apiFormShow"
      @close="resetSql"
      width="60%"
    >
      <el-form label-width="80px" size="mini">
        <el-form-item label="请求方式:" prop="apiType">
          <el-select v-model="form.requestType">
            <el-option label="GET" value="GET"></el-option>
            <el-option label="POST" value="POST"></el-option>
            <el-option label="PUT" value="PUT"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加密方式:" prop="encryptType">
          <el-select v-model="form.encryptType">
            <el-option label="不加密" value="0"></el-option>
            <el-option label="网关加密" value="1"></el-option>
            <el-option label="服务加密" value="2"></el-option>
            <el-option label="民宿加密" value="3"></el-option>
            <el-option label="自如驿加密" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="依赖类型:" prop="isRely">
          <el-select v-model="form.isRely">
            <el-option label="非依赖接口" :value="0"></el-option>
            <el-option label="依赖接口" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="URI:" prop="requestUri">
          <el-col :xs="22" :sm="22" :md="22" :lg="22">
            <el-input v-model="form.requestUri"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="接口描述:" prop="apiName">
          <el-col :xs="22" :sm="22" :md="22" :lg="22">
            <el-input
              v-model="form.comment"
              placeholder="请对接口进行描述"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="SQL:" prop="sql">
          <div v-for="item in sqlForm.items" :key="item.key">
            <el-col
              :xs="3"
              :sm="3"
              :md="3"
              :lg="3"
              style="padding-bottom: 10px"
            >
              <el-select v-model="item.sqlType" @change="reloadSqlList(item)">
                <el-option label="前置SQL" value="1"></el-option>
                <el-option label="后置SQL" value="0"></el-option>
              </el-select>
            </el-col>
            <el-col
              :xs="4"
              :sm="4"
              :md="4"
              :lg="3"
              style="padding-bottom: 10px"
            >
              <el-select
                v-model="item.sqlName"
                filterable
                placeholder="请选择SQL名称"
                clearable
                @change="displaySqlDetail(item)"
              >
                <el-option
                  v-for="sql in item.sqlList"
                  :key="sql.id"
                  :value="sql.sqlName"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col
              :xs="12"
              :sm="12"
              :md="12"
              :lg="15"
              style="padding-bottom: 10px"
            >
              <el-input v-model="item.sqlDetail" :disabled="true">
                <template slot="prepend">用例所含SQL</template>
              </el-input>
            </el-col>
            <el-col
              :xs="2"
              :sm="2"
              :md="1"
              :lg="1"
              style="padding-bottom: 10px"
            >
              <el-button
                @click.prevent="removeSqlList(item)"
                icon="el-icon-minus"
                type="primary"
                size="mini"
                circle
                plain
              ></el-button>
            </el-col>
          </div>
          <el-col :xs="2" :sm="2" :md="1" :lg="1" style="padding-left: 10px">
            <el-button
              icon="el-icon-plus"
              type="primary"
              size="mini"
              circle
              plain
              @click="addItem"
            ></el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="Header:" prop="header">
          <div class="grid-content">
            <el-input
              class="grid-content"
              type="textarea"
              :autosize="{ minRows: 3 }"
              placeholder="Accept: application/json;version=2"
              v-model="form.header"
            >
            </el-input>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="success"
          v-show="formTitle === '接口编辑'"
          @click="submitApiEditInfo()"
          >提交修改</el-button
        >
        <el-button
          type="primary"
          v-show="formTitle === '接口复制'"
          @click="submitApiCopyInfo()"
          >提交复制</el-button
        >
        <el-button type="info" @click="resetSql">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateSingleApi, copySingleApi } from '@/api/model/singleApiList'
import { getSqlList } from '@/api/model/singleApiSave'

export default {
  name: 'DialogApiForm',
  props: {
    formTitle: String,
    apiFormShow: {
      type: Boolean,
      default: false
    },
    apiRowData: {
      type: Object,
      default () {
        return {}
      }
    },
    apiFormData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    apiFormData (value) {
      if (value) {
        console.log(value)
        this.form = { ...this.form, ...value }
      }
    }
  },
  data () {
    return {
      form: {
        apiType: '',
        encryptType: '',
        requestUri: '',
        originalUri: '',
        relyType: '',
        isRely: '',
        relyApiId: '',
        systemObj: {
          systemName: '',
          systemId: ''
        },
        relyApiDetail: '',
        header: '',
        apiName: '',
        systemId: '',
        sql: {
          items: [
            {
              sqlType: '1',
              sqlId: '',
              sqlName: '',
              sqlDetail: '',
              sqlList: [
                {
                  sqlName: '',
                  id: '',
                  sqlData: ''
                }
              ]
            }
          ]
        }
      },
      sqlForm: {
        items: []
      }
    }
  },
  methods: {
    resetSql () {
      this.$emit('closeApiForm')
      this.sqlForm = {
        items: []
      }
    },
    // 提交编辑数据
    submitApiEditInfo () {
      const obj = this.segmentSqlIds()
      const updateInfo = {
        encryptType: this.form.encryptType,
        header: this.form.header,
        id: this.form.apiId,
        isRely: parseInt(this.form.isRely),
        relyId: this.form.relyApiId,
        requestType: this.form.requestType,
        requestUri: this.form.requestUri,
        preSqlId: obj.preSqlIds,
        postSqlId: obj.postSqlIds,
        systemId: this.form.systemId,
        apiName: this.form.applicationName
      }

      console.log(updateInfo)
      updateSingleApi(updateInfo).then((response) => {
        if (response.success) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.resetSql()
          this.$emit('getList')
        } else {
          this.$message({
            message: response.errorMessage,
            type: 'error'
          })
        }
      })
    },
    // 提交复制数据
    submitApiCopyInfo () {
      var updateInfo = {
        encryptType: this.form.encryptType,
        header: this.form.header,
        id: this.apiIdForCopy,
        isRely: parseInt(this.form.relyType),
        relyId: this.form.relyApiId,
        requestType: this.form.apiType,
        requestUri: this.form.requestUri,
        preSqlId: '',
        postSqlId: '',
        systemId: this.form.systemId
      }
      if (this.form.originalUri === this.form.requestUri) {
        this.$message({
          message: '您没有修改请求URI,不能提交修改！',
          type: 'error'
        })
        return false
      }
      copySingleApi(updateInfo).then((response) => {
        if (response.success) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.resetSql()
          this.$emit('getList')
        } else {
          this.$message({
            message: response.errorMessage,
            type: 'error'
          })
        }
      })
    },
    // sql增加前/后置
    addItem () {
      const sqlType = '1'
      let sqlList = []
      getSqlList({ isPrep: sqlType }).then((response) => {
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
      const index = this.sqlForm.items.indexOf(item)
      if (index !== -1) {
        this.sqlForm.items.splice(index, 1)
      }
    },
    // 切换sqlType--获取sql列表
    reloadSqlList (item) {
      const type = item.sqlType
      const index = this.sqlForm.items.indexOf(item)
      getSqlList({ isPrep: type }).then(response => {
        this.sqlForm.items[index].sqlList = response.data
      })
    },
    // 选择的sql名称后，显示详细的sql信息sqlDetail
    displaySqlDetail (item) {
      // console.log(JSON.stringify(item));
      const index = this.sqlForm.items.indexOf(item)
      const sqlList = this.sqlForm.items[index].sqlList
      for (let i = 0; i < sqlList.length; i++) {
        const sqlObj = sqlList[i]
        if (item.sqlName === sqlObj.sqlName) {
          this.sqlForm.items[index].sqlId = sqlObj.id
          this.sqlForm.items[index].sqlDetail = sqlObj.sqlData
        }
      }
    },
    // 分离前置后置
    segmentSqlIds () {
      var postSqlIds = ''
      var preSqlIds = ''
      var sqlItems = this.sqlForm.items
      console.log(sqlItems)
      for (var i = 0; i < sqlItems.length; i++) {
        if (sqlItems[i].sqlType === '1') {
          preSqlIds += sqlItems[i].sqlId + ','
        } else if (sqlItems[i].sqlType === '0') {
          postSqlIds += sqlItems[i].sqlId + ','
        }
      }
      postSqlIds = postSqlIds.substring(0, postSqlIds.length - 1)
      preSqlIds = preSqlIds.substring(0, preSqlIds.length - 1)
      var obj = { postSqlIds: postSqlIds, preSqlIds: preSqlIds }
      return obj
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
