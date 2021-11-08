<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose " class="config-dialog">
    <el-form :model="testConfig"  label-width="120px" ref="testConfigForm" :rules="rules">
      <el-row :gutter="24" >
        <el-col :span="24">
          <el-form-item label="中文名称" prop="lable" >
            <el-input v-model="testConfig.lable" placeholder="请输入属性中文名称（如：用例等级、前置条件）" clearable ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" >
        <el-col :span="24">
          <el-form-item label="英文名称" prop="name" >
            <el-input v-model="testConfig.name" placeholder="请输入属性英文名称（如：level、preCondition）" clearable :disabled="editFieldTypeStatus" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" >
        <el-col :span="24">
          <el-form-item label="属性类型" prop="fieldType" >
            <el-select
              v-model="testConfig.fieldType"
              clearable
              filterable
              remote
              placeholder="请选择属性类型"
              :loading="loading"
              :disabled="editFieldTypeStatus"
            >
              <el-option
                v-for="item in fieldTypeList"
                :key="item.englishName"
                :label="item.name"
                :value="item.englishName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" :hidden="testConfig.fieldType != 'select'">
        <el-col :span="24">
          <el-form-item label="选项值" prop="testConfigOptionVal" >
            <el-input v-model="testConfigOptionVal" placeholder="请输入选项值" clearable ></el-input><el-button @click="addTestConfigOption()" :disabled="disabledVal"  type="primary">添加</el-button>
            <el-table
              ref="singleTable"
              stripe
              :data="testConfig.testConfigOptionsList"
              highlight-current-row
              @row-click="handleCurrentChange"
              style="width: 100%">
              <el-table-column
                label="属性值"
              >
                <template scope="scope">
                  <el-input v-if="scope.row.editStatus" v-model="scope.row.optionVal" @change="handleEdit(scope.$index, scope.row)" />
                  <span v-else>{{ scope.row.optionVal }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="id">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                    <i class="el-icon-delete icon" @click="deleteTestOption(scope.row)" ></i>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm('testConfigForm')">取 消</el-button>
      <el-button type="primary" @click="submitTestConfig()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>

import { queryFieldTypeList } from '@/api/model/dataDictionary'
import { saveOrUpdateTestConfig, deteleTestConfigOptionsById } from '@/api/model/testConfig'
import TEST_CONFIG from '@/config/testConfig.config'

export default {
  name: 'SaveOrUpdateTestConfigDialog',
  computed: {
  },
  async mounted () {
    await this.queryFieldType()
  },
  data: () => ({
    dialogVisible: false,
    dialogTitle: '',
    editFieldTypeStatus: false,
    loading: false,
    fieldTypeList: [],
    disabledVal: true,
    optionVisible: false,
    rules: TEST_CONFIG.rules,
    testConfig: {
      id: 0,
      lable: '',
      name: '',
      fieldType: '',
      fieldTypeLable: '',
      required: false,
      testConfigOptionsList: []
    },
    testConfigOptionVal: '',
    testConfigOptions: {
      optionVal: '',
      editStatus: false
    },
    optionsValList: ['']
  }),
  watch: {
    testConfigOptionVal: function (val) {
      if (val !== '') {
        this.disabledVal = false
      } else {
        this.disabledVal = true
      }
    }
  },
  methods: {
    async queryFieldType () {
      await queryFieldTypeList().then((result) => {
        this.fieldTypeList = result.data
      })
    },
    async handleClose () {
      this.dialogVisible = false
    },
    addTestConfigOption () {
      const opsVal = this.testConfigOptionVal
      const configOps = {
        ...this.testConfigOptions,
        optionVal: opsVal
      }
      const len = this.testConfig.testConfigOptionsList.length
      if (len > 0) {
        const index = this.optionsValList.indexOf(opsVal)
        if (index < 0) {
          this.optionsValList.push(opsVal)
          this.testConfig.testConfigOptionsList.push(configOps)
        } else {
          this.$notify({
            type: 'error',
            message: '选项值重复'
          })
        }
      } else {
        this.optionsValList.push(opsVal)
        this.testConfig.testConfigOptionsList.push(configOps)
      }
    },
    async submitTestConfig () {
      this.$refs.testConfigForm.validate((valid) => {
        if (valid) {
          if (this.testConfig.fieldType !== 'select') {
            const params = {
              ...this.testConfig,
              testConfigOptionsList: []
            }
            this.saveOrUpdateConfig(params)
          } else {
            const len = this.testConfig.testConfigOptionsList.length
            if (len > 0) {
              this.saveOrUpdateConfig(this.testConfig)
            } else {
              this.$notify({
                type: 'error',
                message: '请填写选项值'
              })
            }
          }
        } else {
          this.$notify({
            type: 'error',
            message: '保存失败'
          })
        }
      })
    },
    async saveOrUpdateConfig (data) {
      await saveOrUpdateTestConfig(data)
        .then(res => {
          this.$notify({
            type: 'success',
            message: '保存成功'
          })
          this.resetForm('testConfigForm')
          this.$emit('queryTestConfigList')
        })
    },
    async deleteTestOption (option) {
      const len = this.optionsValList.length
      if (len > 1) {
        this.$confirm('当前正在删除属性值「' + option.optionVal + '」,此操作不可撤销，是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const params = { id: option.id }
          const res = await deteleTestConfigOptionsById(params)
          const config = res.data
          const optionsValList = config.testConfigOptionsList.map(options => options.optionVal)
          this.testConfig = config
          this.optionsValList = optionsValList
          this.$notify({
            type: 'success',
            message: '删除成功'
          })
        })
      } else {
        this.$notify({
          type: 'error',
          message: '选项值不得少于 1 个'
        })
      }
    },
    handleEdit (index, row) {
      row.editStatus = false
    },
    handleCurrentChange (row, event, column) {
      row.editStatus = true
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss">
  .config-dialog {
    .el-select{
      width: 100%
    }
  }
</style>
