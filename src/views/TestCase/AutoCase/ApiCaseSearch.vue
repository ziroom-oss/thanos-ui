<template>
  <div class="test-case-search">
    <el-form
      :model="mySearchForm"
      ref="mySearchForm"
      label-width="100px"
      class="test-mySearchForm"
    >
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="用例ID:" prop="id">
            <el-input
              v-model="mySearchForm.id"
              placeholder="请输入用例ID"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用例名称:" prop="caseName">
            <el-input
              v-model="mySearchForm.caseName"
              placeholder="请输入用例名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="请求URL:" prop="requestUri">
            <el-input
              v-model="mySearchForm.requestUri"
              placeholder="请输入请求URI"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户姓名:" prop="updateUserCode">
             <el-select
              v-model="mySearchForm.updateUserCode"
              clearable
              filterable
              placeholder="请选择用户"
            >
              <el-option
                v-for="item of userList"
                :key="item.emplid"
                :label="`${item.name}-${item.adCode}`"
                :value="item.adCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="应用名称:" prop="applicationName">
            <el-select
              v-model="mySearchForm.applicationName"
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
        <el-col :span="6">
          <el-form-item label="接口标签:" prop="controllerName">
            <el-select
              v-model="mySearchForm.controllerName"
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
        <el-col :span="6">
          <el-form-item label="是否可运行:" prop="runnable">
            <el-select
              v-model="mySearchForm.runnable"
              clearable
              filterable
              placeholder="请选择运行状态"
            >
              <el-option
                v-for="item in runList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="search-button">
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button plain type="primary" @click="resetForm('mySearchForm')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'ApiCaseSearch',
  props: {
    omegaList: {
      type: Array,
      default () {
        return []
      }
    },
    tagsList: {
      type: Array,
      default () {
        return []
      }
    },
    userList: {
      type: Array,
      default () {
        return []
      }
    },
    apiCaseForm: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    mySearchForm: {
      get () {
        return this.apiCaseForm
      }
    }
  },
  data () {
    return {
      runList: [
        { value: 1, label: '可运行' },
        { value: 2, label: '不可运行' }
      ]
    }
  },

  methods: {
    // 查询
    submitForm () {
      this.$refs.mySearchForm.validate((valid) => {
        if (valid) {
          this.$emit('update:apiCaseForm', this.mySearchForm)
          this.$emit('findSingleApiListTableDataV3', { pageNum: 1 })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    getTagsList (name) {
      this.$emit('getTagsList', name)
    }
  }
}
</script>
<style scoped lang="scss">
.search-button {
  display: flex;
  justify-content: flex-end;
}
.reset-button {
  border: 1px solid #dcdfe6;
}
</style>
