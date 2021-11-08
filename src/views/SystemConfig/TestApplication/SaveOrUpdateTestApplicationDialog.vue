<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose" :close-on-click-modal="false">
    <el-form :model="testApplication"  label-width="140px"  :rules="rules" ref="testApplicationForm" >
      <el-row :gutter="24">
        <el-col :span="24" >
          <el-form-item label="应用所属组织结构:" prop="ehrTreePath">
            <el-cascader
              ref="cascader"
              v-model="testApplication.ehrTreePath"
              :options="afterHandledeptOrgList"
              separator="-"
              size="mini"
              filterable
              :show-all-levels="false"
              clearable
              :props="{ multiple: cascaderConfig.multipleCheck, checkStrictly: true }"
              placeholder="请选择应用所属的组织结构"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="应用类型:" prop="applicationType">
            <el-radio-group v-model="testApplication.applicationType">
              <el-radio v-for="item in applicationTypeDataDictionaryList" :label="item.name" :key="item.englishName" :value="item.englishName" :name="item.englishName" > </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="应用名称:" prop="applicationName">
            <el-input v-model="testApplication.applicationName" placeholder="请输入应用名称" @blur="validateApplicationName($event)" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="关联域名:" prop="belongToSystem">
            <el-select
              v-model="testApplication.applicationHostname"
              clearable
              filterable
              remote
              placeholder="请输入关联域名"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in belongToSystemList"
                :key="item.id"
                :label="item.envDomain"
                :value="item.envDomain">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm('testApplicationForm')">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdateTestApplication()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>

import TEST_APPLICATION_CONFIG from '@/config/testApplication.config.js'
import { queryTestApplicationTypeList } from '@/api/model/dataDictionary'
import { getBelongSystem, getEhrInfo } from '@/api/model/testCase'
import { validateTestApplicationName, saveOrUpdateTestApplication } from '@/api/model/testApplication'

export default {
  name: 'SaveOrUpdateTestApplicationDialog',

  components: {
  },
  computed: {
    cascaderConfig () {
      return {
        isToPerson: false, // true 细粒度到人 false 细粒度不到人
        multipleCheck: false
      }
    }
  },
  async mounted () {
    await this.queryTestApplicationTypeList()
    await this.getDepartOrg()
  },
  data: () => ({
    dialogVisible: false,
    dialogTitle: '',
    rules: TEST_APPLICATION_CONFIG.rules,
    testApplication: {
      id: 0,
      applicationName: '',
      ehrTreePath: [''],
      applicationType: '',
      applicationHostname: '',
      updateUser: '',
      updateTime: '',
      applicationModuleTreeList: []
    },
    applicationTypeDataDictionaryList: [],
    afterHandledeptOrgList: [],
    deptOrgList: [],
    belongToSystemList: [],
    TEST_APPLICATION_CONFIG, // 枚举转换
    loading: false

  }),
  watch: {
    testApplication (val) {
    }
  },
  methods: {
    async handleClose () {
      this.dialogVisible = false
      await this.$refs.SaveOrUpdateTestApplicationDialog.resetFields()
    },
    async queryTestApplicationTypeList () {
      const res = await queryTestApplicationTypeList()
      this.applicationTypeDataDictionaryList = res.data
    },
    async getBelongSystem (query) { // 所属系统
      const params = {
        belongToSystem: query
      }
      const res = await getBelongSystem(params)
      this.belongToSystemList = res.data
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.belongToSystemList = this.getBelongSystem(query)
        }, 200)
      } else {
        this.options = []
      }
    },
    async validateApplicationName (event) {
      await validateTestApplicationName({ applicationName: event.target.value })
    },
    async saveOrUpdateTestApplication () {
      await this.$refs.testApplicationForm.validate((valid) => {
        if (valid) {
          const ehrTreePath = this.testApplication.ehrTreePath.toString()
          const params = {
            ...this.testApplication,
            ehrTreePath
          }
          saveOrUpdateTestApplication(params)
            .then(() => {
              this.$notify({
                type: 'success',
                message: '保存成功'
              })
              this.resetForm('testApplicationForm')
              this.$emit('querytestApplicationList')
            })
        } else {
          this.$notify({
            type: 'error',
            message: '保存失败'
          })
        }
      })
    },
    async getDepartOrg () { // 获取组织结构
      const res = await getEhrInfo()
      const childDept = res.data || []
      this.deptOrgList = childDept.childDept
      this.handleDeartOrg()
    },
    handleDeartOrg () {
      this.afterHandledeptOrgList = this.flattenNotToPersonChild(this.deptOrgList)
    },
    flattenNotToPersonChild (options) { // 不到人
      const that = this
      const deptOptions = []
      options.forEach(item => {
        if (!item.last && item.childDept) {
          deptOptions.push({
            label: item.deptName,
            value: item.deptCode,
            children: (function () {
              return that.flattenNotToPersonChild(item.childDept)
            })()
          })
        } else if (item.last && item.childDept) {
          deptOptions.push({
            label: item.deptName,
            value: item.deptCode
          })
        } else {
          return false
        }
      })
      return deptOptions
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
