<template>
    <el-dialog
            :title="formTitle"
            :visible.sync="mockApiChooseForm"
            width="55%"
            :close-on-click-modal="false"
            @close="closeMockApiChooseForm"
    >
        <el-form :model="form" :rules="rules" ref="ruleForm" label-position="right" label-width="100px">
            <el-form-item label="集合名称" prop="setName">
                <el-input class="width-90pct" v-model="form.setName" placeholder="请输入接口任务集合名称"></el-input>
            </el-form-item>
            <el-form-item label="接口类型" prop="apiType">
                <el-radio-group v-model="form.apiType" @change="changeApiCaseType" :disabled="isEditTaskSet">
                    <el-radio :label="0">单接口任务集合</el-radio>
                    <el-radio :label="1">多接口任务集合</el-radio>
                </el-radio-group>
                <el-tooltip v-if="isEditTaskSet" style="margin-left: 15px" effect="dark" content="不允许修改接口类型"
                            placement="right">
                    <i class="el-icon-question"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="集合类型" prop="setType">
                <el-select class="width-50pct" value="" v-model="form.setType" clearable placeholder="请选择任务集合类型">
                    <el-option label="自定义测试集合" :value="0"></el-option>
                    <el-option label="冒烟测试集合" :value="1"></el-option>
                    <el-option label="回归测试集合" :value="2"></el-option>
                </el-select>
                <el-tooltip style="margin-left: 5px" effect="dark" content="用户自定义测试集合类型，项目名称信息非必填" placement="right">
                    <i class="el-icon-question"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="项目名称" prop="omegaInfo"
                          :rules="form.setType !== 0 ? rules.omegaInfo : [{ required: false}]">
                <el-select class="width-50pct" value="" v-model="form.omegaInfo" clearable filterable
                           value-key="projectId"
                           placeholder="请输入选择项目名称">
                    <el-option v-for="item in omegaProjectList" :key="item.id" :label="item.applicationName"
                               :value="item"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div v-show="form.apiType === 0" style="text-align: center;margin-top: 35px">
            <transfer-main
                    filterable
                    style="text-align: left; display: inline-block"
                    v-model="selectedApi"
                    :titles="['未选择-单接口用例', '已选择-单接口用例']"
                    :props="{ key: 'id', label: 'caseName' }"
                    :data="mockApiCaseData"
            >
                <span slot-scope="{ option }">{{ option.id }} - {{ option.caseName }}</span>
            </transfer-main>
        </div>
        <div v-show="form.apiType === 1" style="text-align: center;margin-top: 35px">
            <el-transfer
                    filterable
                    style="text-align: left; display: inline-block"
                    filter-placeholder="请输入多接口用例名称"
                    v-model="selectedApi2"
                    :titles="['未选择-多接口用例', '已选择-多接口用例']"
                    :props="{ key: 'id', label: 'caseName' }"
                    :data="mockApiCaseData2">
            </el-transfer>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeMockApiChooseForm">取 消</el-button>
            <el-button type="primary" @click="commitSelectedMockApiCase">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import transferMain from '@/components/Transfer/transfer-main'
import { getMultiApiCaseList, getSingleApiCaseList } from '@/api/model/multiApiSave'
import {
  addApiTaskSet,
  editTaskSetInfoBySetId,
  getTaskSetDetailInfoBySetId
} from '@/api/model/taskSet'

export default {
  name: 'new-task-set',
  components: { transferMain },
  props: {
    omegaProjectListProp: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      mockApiChooseForm: false,
      mockApiCaseData: [],
      selectedApi: [],
      mockApiCaseData2: [],
      selectedApi2: [],
      formTitle: '新增接口任务集合',

      form: {
        setName: '',
        apiType: '',
        setType: '',
        omegaInfo: {
          projectId: '',
          applicationName: ''
        }
      },
      isEditTaskSet: false,
      tempSetId: '',
      omegaProjectList: this.omegaProjectListProp,
      rules: {
        setName: [
          { required: true, message: '请输入任务集合名称', trigger: 'blur' }
        ],
        apiType: [
          { required: true, message: '请选择任务集合接口类型', trigger: 'change' }
        ],
        setType: [
          { required: true, message: '请选择任务集合类型', trigger: 'change' }
        ],
        omegaInfo: [
          { required: true, message: '请输入选择项目名称', trigger: 'change' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    closeMockApiChooseForm () {
      this.mockApiChooseForm = false
      this.mockApiCaseData = []
      this.selectedApi = []
      this.mockApiCaseData2 = []
      this.selectedApi2 = []
      this.resetForm('ruleForm')
    },
    commitSelectedMockApiCase () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.selectedApi.length === 0 && this.selectedApi2.length === 0) {
            this.$message({
              type: 'warning',
              message: '穿梭框右侧已选择测试用例列表不能为空'
            })
            return false
          } else {
            const postData = {
              omegaId: this.form.omegaInfo.projectId,
              omegaName: this.form.omegaInfo.applicationName,
              name: this.form.setName,
              type: parseInt(this.form.setType),
              apiType: this.form.apiType,
              caseIdList: this.form.apiType === 0 ? this.selectedApi : this.selectedApi2
            }

            if (!this.isEditTaskSet) {
              await this.addNewTaskSetInfo(postData)
            } else {
              postData.id = this.tempSetId
              await this.editTaskSetInfo(postData)
            }
            this.$parent.getDataList()
          }
        } else {
          return false
        }
      })
    },
    async addNewTaskSetInfo (postData) {
      await addApiTaskSet(postData).then(response => {
        if (response.success) {
          this.$message({
            type: 'success',
            message: '新增接口任务集合操作成功'
          })
        }
        this.closeMockApiChooseForm()
      })
    },
    async editTaskSetInfo (postData) {
      await editTaskSetInfoBySetId(postData).then(response => {
        if (response.success) {
          this.$message({
            type: 'success',
            message: '接口任务集合编辑操作成功'
          })
        }
        this.closeMockApiChooseForm()
      })
    },
    getTaskSetDetailInfoBySetId (setId) {
      getTaskSetDetailInfoBySetId({ setId: setId }).then(response => {
        if (response.success) {
          this.form = {
            setName: response.data.name,
            apiType: response.data.apiType,
            setType: response.data.type,
            omegaInfo: {
              projectId: response.data.omegaId,
              applicationName: response.data.omegaName
            }
          }
          this.tempSetId = response.data.id

          if (this.form.apiType === 0) {
            this.selectedApi = response.data.caseIdList
          } else {
            this.selectedApi2 = response.data.caseIdList
          }
        }
      })
    },
    getSingleApiCaseList () {
      getSingleApiCaseList({ searchContent: '' }
      ).then(response => {
        if (response.success) {
          this.mockApiCaseData = response.data
        }
      })
    },
    getMultiApCaseList () {
      getMultiApiCaseList({ searchContent: '', caseType: 1 }
      ).then(response => {
        this.mockApiCaseData2 = response.data
      })
    },
    changeApiCaseType () {
      if (this.form.apiType === 0) {
        this.getSingleApiCaseList()
      } else {
        this.getMultiApCaseList()
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  watch: {
    omegaProjectListProp: {
      handler (val) {
        this.omegaProjectList = val
      },
      deep: true
    }
  }
}
</script>

<style scoped>
    /deep/ .el-transfer-panel {
        width: 320px
    }

    /deep/ .el-transfer-panel__list.is-filterable {
        height: 300px;
        padding-top: 0;
    }

    /deep/ .el-transfer-panel__body {
        height: 300px;
    }

    .width-90pct {
        width: 90%;
    }

    .width-50pct {
        width: 50%;
    }
</style>
