<template>
  <div>
    <el-card v-show="testAssociationFindShow">
      <el-form :model="testCaseForm" ref="testCaseForm" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="8" v-if="artificialOrApi==='1'">
            <el-form-item label="用例名称:" prop="casename">
              <el-input v-model="testCaseForm.casename" placeholder="请输入用例名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="artificialOrApi==='1'">
            <el-form-item label="用例等级:" prop="testCaseLevel">
              <el-select
                v-model="testCaseForm.testCaseLevel"
                clearable
              >
                <el-option v-for="item of testLevelList" :label="item.name" :key="item.englishName"
                           :value="item.englishName"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="artificialOrApi==='1'">
            <el-form-item label="对应jira ID:" prop="relationRequirement">
              <el-input v-model="testCaseForm.relationRequirement" placeholder="请输入对应JiraID"></el-input>
            </el-form-item>
          </el-col>
          <!--一下是API查询条件-->
          <el-col :span="8" v-if="artificialOrApi==='2'">
            <el-form-item label="用例名称:" prop="caseName">
              <el-input v-model="testCaseForm.caseName" placeholder="请输入用例名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="artificialOrApi==='2'">
            <el-form-item label="请求URI:" prop="requestUri">
              <el-input v-model="testCaseForm.requestUri" placeholder="请输入用例名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="artificialOrApi==='2'">
            <el-form-item label="维护人:" prop="updateUserCode">
              <el-select
                v-model="testCaseForm.updateUserCode"
                clearable
                filterable
                remote
                :remote-method="remoteMethod"
                :loading="loading"
                placeholder="创建人"
              >
                <el-option
                  v-for="item of responsiblePersonList"
                  :label="item.name + '-' + item.adCode"
                  :key="item.emplid"
                  :value="item.adCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8" v-if="artificialOrApi==='1'">
            <el-form-item label="所属应用:" prop="belongToSystem">
              <el-select
                v-model="testCaseForm.belongToSystem"
                clearable
                filterable
                placeholder="请选择所属应用"
                @change="onSearchApp"
              >
                <el-option
                  v-for="item of appList"
                  :label="item.applicationName"
                  :key="item.id"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="artificialOrApi==='1'">
            <el-form-item label="所属模块:" prop="belongToModuleList">
              <el-cascader
                clearable
                :show-all-levels="false"
                :props="{ checkStrictly: true }"
                v-model="testCaseForm.belongToModuleList"
                placeholder="请选择所属模块"
                :options="moduleInAppList"
                filterable
              >
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="artificialOrApi==='1'">
            <el-form-item label="创建人:" prop="createUser">
              <el-select
                v-model="testCaseForm.createUser"
                clearable
                filterable
                remote
                :remote-method="remoteMethod"
                :loading="loading"
                placeholder="创建人"
              >
                <el-option
                  v-for="item of responsiblePersonList"
                  :label="item.name + '-' + item.adCode"
                  :key="item.emplid"
                  :value="item.adCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--一下是API查询条件-->
          <el-col :span="8" v-if="artificialOrApi==='2'">
            <el-form-item label="应用名称:" prop="applicationName">
              <el-select
                v-model="testCaseForm.applicationName"
                clearable
                filterable
                placeholder="请选择目标应用"
                @change="getTagsList"
              >
                <el-option
                  v-for="item of omegaList"
                  :key="item.applicationName"
                  :label="item.applicationName"
                  :value="item.applicationName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="artificialOrApi==='2'">
            <el-form-item label="接口标签:" prop="controllerName">
              <el-select
                v-model="testCaseForm.controllerName"
                clearable
                filterable
                placeholder="请选择接口标签"
              >
                <el-option
                  v-for="item in tagsList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="float: right">
          <el-form-item class="search-button">
            <el-button type="primary" @click="handleSubmit">提交</el-button>
            <el-button type="primary" @click="submitForm">查询</el-button>
            <el-button plain type="primary" @click="resetForm('testCaseForm')">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {moduleTreeMixin} from '../TestCase/mixin/mixin'
  import {queryTestLevelTypeList,getEhrUserDetailLikeUserName} from '@/api/model/testCase'
  import {getApiTags, myJoinApplication} from '@/api/model/singleApiList'

  export default {
    name: 'testAssociationFind',
    mixins: [moduleTreeMixin],
    props: {
      artificialOrApi: String
    },
    data: () => ({
      loading: false,
      testAssociationFindShow: true,
      testCaseForm: {
        caseName: '',
        requestUri: '', // 请求URI
        updateUserCode: '', // 维护人
        testCaseLevel: '', // 用例等级
        relationRequirement: '', // jira ID
        belongToSystem: '', // 所属应用
        belongToModuleList: [], // 所属模块
        createUser: '', // 创建人
        belongToModule: '',
        applicationName: '',
        controllerName: ''
      },
      omegaList: '',
      tagsList: '',
      testLevelList: [],
      responsiblePersonList: []
    }),
    watch: {
      testCaseForm(val) {
        if (val.belongToSystem) {
          this.queryModuleInAppList(val.belongToSystem)
        }
      }
    },
    mounted() {
      this.OnTestCaseLevel()
      this.getOmegaList()
    },
    methods: {
      handleSubmit() {
        this.$emit('handleSubmit')
      },
      async onSearchApp() {
        await this.queryModuleInAppList(this.testCaseForm.belongToSystem)
      },
      async OnTestCaseLevel() { // 获取用例等级
        const res = await queryTestLevelTypeList()
        this.testLevelList = res.data
      },
      postData() {
        return this.testCaseForm
      },
      submitForm() { // 查询
        this.$refs.testCaseForm.validate((valid) => {
          if (valid) {
            this.setSearchInfo()
            this.$emit('queryTestCaseDataFind', this.testCaseForm)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 获取所属应用
      async getOmegaList() {
        const res = await myJoinApplication()
        this.omegaList = res.data
      },
      // 根据应用获取接口列表
      async getTagsList(applicationName) {
        const res = await getApiTags({applicationName})
        if (res.success) {
          const tagsList = []
          for (const key of Object.keys(res.data)) {
            tagsList.push(key)
          }
          this.tagsList = tagsList
        }
      },
      async setSearchInfo() {
        if (this.testCaseForm.belongToModuleList) {
          const length = this.testCaseForm.belongToModuleList.length - 1
          const moduleList = this.testCaseForm.belongToModuleList
          this.testCaseForm.belongToModule = moduleList[length]
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      // 获取用户名单
      async getEhrUserDetailLikeUserName (userName) {
        const params = {
          userName:userName
        }
        const res = await getEhrUserDetailLikeUserName(params)
        this.responsiblePersonList = res.data
      },
      remoteMethod (query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.getEhrUserDetailLikeUserName(query)
          }, 200)
        } else {
          this.options = []
        }
      }
    }
  }
</script>
