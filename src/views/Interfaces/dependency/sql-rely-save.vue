<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>SQL录入</span>
        </div>
        <div>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入用例名称" v-model="inputCaseName">
                        <template slot="prepend">用例名称:</template>
                    </el-input>
                </el-col>
                <el-col :span="2" style="margin-left: 10px">
                    <div class="grid-content pri-font">数据库IP</div>
                </el-col>
                <el-col :span="6">
                    <el-select v-model="value" filterable placeholder="请选择" style="width: 100%" value="">
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.testDbUrl"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>

                <el-col :span="2" style="margin-left: 10px">
                    <div class="grid-content pri-font">数据库名称:</div>
                </el-col>
                <el-col :span="5">
                    <el-select v-model="value2" filterable placeholder="请选择所属数据库" style="width: 100%"
                               @focus="getDatabaseName" value="">
                        <el-option
                                v-for="item in options2"
                                :key="item.value"
                                :label="item.testDbName"
                                :value="item.testDbName">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>

            <el-row style="margin-top: 20px">
                <el-col :span="2">
                    <div>
                        <el-radio v-model="radio1" label="1" border style="margin-bottom:25px">前置SQL</el-radio>
                        <el-radio v-model="radio1" label="2" border style="margin-left:0px;margin-bottom:0px">后置SQL
                        </el-radio>
                    </div>
                </el-col>
                <el-col :span="21" style="margin-left: 0px">
                    <el-input
                            type="textarea"
                            :rows="4"
                            placeholder="请输入SQL内容"
                            v-model="sqlTextarea">
                    </el-input>
                </el-col>
            </el-row>

            <el-row style="margin-top: 20px">
                <el-col :span="23">
                    <el-input placeholder="请输入描述" v-model="description">
                        <template slot="prepend">描述</template>
                    </el-input>
                </el-col>
            </el-row>

            <el-row style="margin-top: 20px;" type="textarea">
                <el-col :span="23">
                    <el-input
                            type="textarea"
                            :rows="8"
                            placeholder="点击运行按钮后在此处显示运行结果"
                            v-model="runSqlResult">
                        <template slot="prepend">运行结果</template>
                    </el-input>
                </el-col>
            </el-row>

            <el-row style="margin-top: 30px; margin-left: 87%">
                <el-button type="success" @click="runSqlInfo">运行</el-button>
                <el-button type="primary" @click="saveSqlInfo">保存</el-button>
            </el-row>

        </div>
    </el-card>
</template>

<script>

import {
  getDatabaseIp,
  getDatabaseName,
  saveSqlInfo,
  runSqlInfo
} from '@/api/model/sqlRelySave'

export default {
  name: 'sql-rely-save',
  data () {
    return {
      radio1: '1',
      inputCaseName: '',
      sqlTextarea: '',
      description: '',
      databaseIp: '',
      runSqlResult: '',

      options: [],
      value: '',

      options2: [],
      value2: ''
    }
  },

  methods: {
    getDatabaseIp () {
      getDatabaseIp().then(response => {
        this.options = response.data
      })
    },
    getDatabaseName () {
      getDatabaseName({ id: this.value }).then(response => {
        this.options2 = response.data
      })
    },
    saveSqlInfo () {
      var list = {
        testDbName: this.value2,
        sqlName: this.inputCaseName,
        sqlData: this.sqlTextarea,
        databaseId: this.value,
        isPrep: this.radio1
      }
      if (list.sqlName === '') {
        this.$message({
          message: '请输入用例名称',
          type: 'warning'
        })
        return false
      }
      if (list.sqlData === '') {
        this.$message({
          message: '请输入SQL语句',
          type: 'warning'
        })
        return false
      }
      saveSqlInfo(list).then(response => {
        if (response.data === 'success') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        } else if (response.data === 'exist') {
          this.$message({
            message: '已存在，不能保存',
            type: 'warning'
          })
          return false
        } else {
          this.$message.error('保存失败')
        }
      })
    },
    runSqlInfo () {
      var list = {
        databaseId: this.value,
        testDbName: this.value2,
        sqlData: this.sqlTextarea
      }
      if (list.sqlData === '') {
        this.$message({
          message: '请输入SQL语句',
          type: 'warning'
        })
        return false
      }
      runSqlInfo(list).then(response => {
        this.runSqlResult = JSON.stringify(response.data)
      })
    }
  },
  created () {
    this.getDatabaseIp()
  }
}

</script>

<style lang="stylus" scoped>
    .pri-font {
        font-size: 15px;
        color: #909399;
        background-color: #f5f7fa;
        text-align: center;
        font-weight: normal;
        white-space: nowrap;
        vertical-align: middle;
        padding-top: 8px;
        border: 1px solid #e4e4e4;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 37px;
    }

</style>
