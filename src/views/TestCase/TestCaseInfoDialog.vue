<template>
  <div>
    <el-dialog
      :title="testCaseInfoDialogTitle"
      :visible.sync="testCaseInfoDialog"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane :label="tabFirst" name="first" class="testCaseInfoDialogCss" style="border:#409EFF solid 1px;padding: 5px 0px">
          <el-row>
            <el-col :span="12">
              <div class="titleTest">用例名称: </div>
              <span style="float: right;width: 73%">{{ detailDialogValue.casename }}</span>
            </el-col>
            <el-col :span="12">
              <div class="titleTest">用例等级: </div>
              <span>{{ detailDialogValue.testCaseLevelStr }}</span>
            </el-col>
          </el-row>
          <el-row class="rowTest"></el-row>
          <el-row>
            <el-col :span="12">
              <div class="titleTest">用例版本: </div>
              <span>{{ detailDialogValue.version }}</span>
            </el-col>
            <el-col :span="12">
              <div class="titleTest">jira ID: </div>
              <span>{{ detailDialogValue.relationRequirement }}</span>
            </el-col>
          </el-row>
          <el-row class="rowTest"></el-row>
          <el-row>
            <el-col :span="12">
              <div class="titleTest">所属系统: </div>
              <span>{{ detailDialogValue.belongToSystemStr }}</span>
            </el-col>
            <el-col :span="12">
              <div class="titleTest">所属模块: </div>
              <span>{{ detailDialogValue.belongToModuleStr }}</span>
            </el-col>
          </el-row>
          <el-row class="rowTest"></el-row>
          <el-row>
            <el-col :span="12">
              <div class="titleTest">创建人: </div>
              <span>{{ detailDialogValue.createUser }}</span>
            </el-col>
            <el-col :span="12">
              <div class="titleTest">更新人: </div>
              <span>{{ detailDialogValue.updateUser }}</span>
            </el-col>
          </el-row>
          <el-row class="rowTest"></el-row>
          <el-row>
            <el-col :span="12">
              <div class="titleTest">创建时间: </div>
              <span>{{ detailDialogValue.createTime }}</span>
            </el-col>
            <el-col :span="12">
              <div class="titleTest">更新时间: </div>
              <span>{{ detailDialogValue.updateTime }}</span>
            </el-col>
          </el-row>
          <el-row class="rowTest"></el-row>
          <el-row>
            <el-col :span="12">
              <div class="titleTest">审批状态: </div>
              <span>{{ detailDialogValue.testCaseStatusStr }}</span>
            </el-col>
            <el-col :span="12">
              <div class="titleTest">前置条件: </div>
              <span>{{ detailDialogValue.preCondition }}</span>
            </el-col>
          </el-row>
          <el-row class="rowTest"></el-row>
          <el-row>
            <el-col :span="24">
              <div class="titleTest itemTest">步骤描述: </div>
              <span v-html="detailDialogValue.step" style="float: right;width: 87.5%"></span>
            </el-col>
          </el-row>
          <el-row class="rowTest"></el-row>
          <el-row>
            <el-col :span="24">
              <div class="titleTest itemTest">预期结果: </div>
              <span style="float: right;width: 87.5%">{{ detailDialogValue.expectedResults }}</span>
            </el-col>
          </el-row>
          <el-row class="rowTest"></el-row>
          <el-row>
            <el-col :span="24">
              <div class="titleTest itemTest">备注: </div>
              <span>{{ detailDialogValue.remark }}</span>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane :label="tabSecond" name="second">
          <el-table
            ref="multipleTable"
            :data="testCaseHisData"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column prop="casename" label="用例名称" />
            <el-table-column prop="testCaseLevelStr" label="用例等级" />
            <el-table-column prop="version" label="用例版本" />
            <el-table-column prop="relationRequirement" label="jira ID" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import TEST_CASE_CONFIG from '@/config/testCase.config.js'
export default {
  name: 'TestCaseInfoDialog',
  data: () => ({
    testCaseInfoDialog: false,
    testCaseInfoDialogTitle: '测试用例详情',
    tabFirst: '测试用例详情',
    tabSecond: '历史版本',
    activeName: 'first',
    detailDialogValue: {
      id: '',
      casename: '',
      version: '',
      type: '',
      testCaseLevel: '',
      preCondition: '',
      step: '',
      expectedResults: '',
      relationRequirement: '',
      createUser: '',
      belongToSystem: '',
      belongToModule: '',
      ehrTreePath: '',
      updateUser: '',
      createTime: '',
      updateTime: '',
      remark: '',
      ehrGroup: '',
      caseKey: '',
      belongToModuleStr: ''
    },
    testCaseHisData: [],
    belongToSystemList: [],
    loading: false,
    belongToModuleList: [],
    TEST_CASE_CONFIG, // 枚举值
    saveButtonStatus: true
  }),
  methods: {

  }
}
</script>
<style>
.testCaseInfoDialogCss{
  font-size: calc(80vw / 75);
}
.rowTest{
  border-top: #409EFF solid 1px;
  margin: 10px 0px
}
.titleTest{
  width: 25%;
  height: auto;
  float: left;
  text-align:left;
  line-height: 20px;
  padding-left: 10px;
}
.itemTest{
  width: 12.5%;
}
.testCaseInfoDialogCss span{
  font-family: 楷体;
}
</style>
