<template>
    <div>
        <el-tag style="margin-right: 15px;cursor: pointer" type="success" @click="singleApiType">单接口用例</el-tag>
        <el-tag style="margin-right: 15px;cursor: pointer" type="success" @click="multiApiType">多接口用例</el-tag>
        <el-tag style="margin-right: 15px;cursor: pointer" type="success" @click="makeDataType" v-if="showMakeDataButton">数据工具</el-tag>
        <el-tag style="cursor: pointer" type="success" @click="sqlApiType">SQL</el-tag>

        <span style="margin-left: 25px;color: orange;font-size: 13px">
            <i class="el-icon-info"></i> 点击左侧按钮对应选择不同步骤列表
        </span>
        <el-dialog
                title="添加单接口用例"
                :visible.sync="singleApiChooseForm"
                width="60%"
                @close="closeSingleApiChooseForm"
        >
            <div style="text-align: center">
                <!--<el-transfer-->
                        <!--filterable-->
                        <!--style="text-align: left; display: inline-block"-->
                        <!--filter-placeholder="请输入多接口用例名称"-->
                        <!--v-model="selectedApi"-->
                        <!--:titles="['未选择-单接口用例', '已选择-单接口用例']"-->
                        <!--:props="{-->
                              <!--key: 'id',-->
                              <!--label: 'caseName'-->
                            <!--}"-->
                        <!--:data="singleApiCaseData">-->
                <!--</el-transfer>-->
                <transfer-main
                        style="text-align: left; display: inline-block"
                        filterable
                        v-model="selectedApi"
                        :titles="['未选择-单接口用例', '已选择-单接口用例']"
                        :props="{
                              key: 'id',
                              label: 'caseName'
                            }"
                        :data="singleApiCaseData"

                       >
                    <span slot-scope="{ option }">{{ option.id }} - {{ option.caseName }}</span>
                </transfer-main>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="closeSingleApiChooseForm">取 消</el-button>
    <el-button type="primary" @click="commitSelectedSingleApiCase">确 定</el-button>
  </span>
        </el-dialog>

        <el-dialog
                title="添加多接口用例"
                :visible.sync="multiApiChooseForm"
                width="60%"
                @close="closeMultiApiChooseForm"
        >
            <div style="text-align: center">
                <el-transfer
                        filterable
                        style="text-align: left; display: inline-block"
                        filter-placeholder="请输入多接口用例名称"
                        v-model="selectedMutiApi"
                        :titles="['未选择-多接口用例', '已选择-多接口用例']"
                        :props="{
                              key: 'id',
                              label: 'caseName'
                            }"
                        :data="multiApiCaseData">
                </el-transfer>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="closeMultiApiChooseForm">取 消</el-button>
    <el-button type="primary" @click="commitSelectedMultiApiCase">确 定</el-button>
  </span>
        </el-dialog>

        <el-dialog
                title="添加数据工具用例"
                :visible.sync="makeDataChooseForm"
                width="60%"
                @close="closeMakeDataChooseForm"
        >
            <div style="text-align: center">
                <el-transfer
                        filterable
                        style="text-align: left; display: inline-block"
                        filter-placeholder="请输入数据工具用例名称"
                        v-model="selectedMakeData"
                        :titles="['未选择-数据工具', '已选择-数据工具']"
                        :props="{
                              key: 'id',
                              label: 'caseName'
                            }"
                        :data="makeDataData">
                </el-transfer>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="closeMakeDataChooseForm">取 消</el-button>
    <el-button type="primary" @click="commitSelectedMakeDataChoose">确 定</el-button>
  </span>
        </el-dialog>

        <el-dialog
                title="添加SQL"
                :visible.sync="sqlChooseForm"
                width="60%"
                @close="closeSqlChooseForm"
        >
            <div style="text-align: center">
                <el-transfer
                        filterable
                        style="text-align: left; display: inline-block"
                        filter-placeholder="请输入SQL用例名称"
                        v-model="selectedSql"
                        :titles="['未选择-SQL列表', '已选择-SQL列表']"
                        :props="{
                              key: 'id',
                              label: 'sqlName'
                            }"
                        :data="SQLData">
                </el-transfer>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="closeSqlChooseForm">取 消</el-button>
    <el-button type="primary" @click="commitSelectedSql">确 定</el-button>
  </span>
        </el-dialog>

    </div>
</template>

<script>
import {
  getSingleApiCaseList,
  formatMultiApiCaseSteps,
  getMultiApiCaseList,
  getSqlList
} from '@/api/model/multiApiSave'
import transferMain from '@/components/Transfer/transfer-main'

export default {
  name: 'save-type-choose',
  components: { transferMain },
  props: {
    showMakeDataButton: {
      type: Boolean,
      default: false

    }

  },

  data () {
    return {
      stepType: '',
      singleApiChooseForm: false,
      singleApiCaseData: [],
      selectedApi: [],
      selectedApiCopy: [],
      multiApiChooseForm: false,
      multiApiCaseData: [],
      selectedMutiApi: [],
      selectedMutiApiCopy: [],
      sqlChooseForm: false,
      SQLData: [],
      selectedSql: [],
      selectedSqlCopy: [],
      makeDataData: [],
      makeDataChooseForm: false,
      selectedMakeData: [],
      selectedMakeDataCopy: []

    }
  },

  methods: {
    singleApiType () {
      this.singleApiChooseForm = true
      this.getSingleApCaseList()
    },
    multiApiType () {
      this.multiApiChooseForm = true
      this.getMultiApCaseList()
    },
    makeDataType () {
      this.makeDataChooseForm = true
      this.getMakeDataList()
      // this.getMultiApCaseList()
    },

    sqlApiType () {
      this.sqlChooseForm = true
      this.getSqlList()
    },
    //
    // //切替后显示穿梭框dialog
    // changeStepType() {
    //     if (this.stepType === "0") {
    //         this.singleApiChooseForm = true
    //         this.getSingleApCaseList()
    //     } else if (this.stepType === "1") {
    //         this.multiApiChooseForm = true
    //         this.getMultiApCaseList()
    //     } else {
    //         this.sqlChooseForm = true
    //         this.getSqlList()
    //     }
    //     this.stepType = ""
    // },
    // 选择单接口-----获取全部单接口
    getSingleApCaseList () {
      // -- 获取所有单接口用例
      getSingleApiCaseList({ searchContent: '' }
      ).then(response => {
        this.singleApiCaseData = response.data
      })
    },
    // 选择多接口-----获取全部单接口
    getMultiApCaseList () {
      // -- 获取所有多接口用例
      getMultiApiCaseList({ searchContent: '', caseType: 1 }
      ).then(response => {
        this.multiApiCaseData = response.data
      })
    },
    // 选择数据工具-----获取全部单接口
    getMakeDataList () {
      getMultiApiCaseList({ searchContent: '', caseType: 2 }
      ).then(response => {
        this.makeDataData = response.data
      })
    },
    // 选择SQL-----获取全部单接口
    getSqlList () {
      // 获取所有SQL
      getSqlList({ searchContent: '' }
      ).then(response => {
        this.SQLData = response.data
      })
    },

    // //选择单接口-----条件筛选
    // filterMethod(query, item) {
    //     return item.label.indexOf(query) > -1;
    // },
    // //选择多接口-----条件筛选
    // filterMethodForMulti(query, item) {
    //     return item.label.indexOf(query) > -1;
    // },
    // //选择SQL-----条件筛选
    // filterMethodForSql(query, item) {
    //     return item.label.indexOf(query) > -1;
    // },
    // 选择单接口-----关闭dialog
    closeSingleApiChooseForm () {
      this.singleApiChooseForm = false
      this.singleApiCaseData = []
      this.selectedApi = []
    },
    // 选择多接口-----关闭dialog
    closeMultiApiChooseForm () {
      this.multiApiChooseForm = false
      this.multiApiCaseData = []
      this.selectedMutiApi = []
    },
    // 选择SQL-----关闭dialog
    closeSqlChooseForm () {
      this.sqlChooseForm = false
      this.SQLData = []
      this.selectedSql = []
    },
    // 选择数据工具-----关闭dialog
    closeMakeDataChooseForm () {
      this.makeDataChooseForm = false
      this.makeDataData = []
      this.selectedMakeData = []
    },

    // 选择单接口-----提交选择的接口用例Id
    async commitSelectedSingleApiCase () {
      if (this.selectedApi === []) {
        this.$message({
          message: '已选择列表为空！',
          type: 'warning'

        })
        return false
      }

      var obj = { typeIds: this.selectedApi, dataType: 1, isExpanded: false }
      var params = new URLSearchParams()
      for (const item in obj) {
        if (obj.hasOwnProperty(item)) {
          params.append(item, obj[item])
        }
      }
      // 根据id获取获取选择的单接口用例
      await formatMultiApiCaseSteps(params
      ).then(response => {
        this.selectedApiCopy = response.data
      })
      this.singleApiChooseForm = false
      this.$emit('transferSingleApi', this.selectedApiCopy)
    },

    // 选择多接口-----提交选择的接口用例Id
    commitSelectedMultiApiCase () {
      if (this.selectedApi === []) {
        this.$message({
          message: '已选择列表为空！',
          type: 'warning'

        })
        return false
      }

      this.$confirm('是否展开选择的多接口用例,请确认~', '二次提醒', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.getMultiApiCase(true)
      }).catch(() => {
        this.getMultiApiCase(false)
      })
    },
    async getMultiApiCase (isExpanded) {
      var obj = { typeIds: this.selectedMutiApi, dataType: 2, isExpanded: isExpanded }
      var params = new URLSearchParams()
      for (const item in obj) {
        if (obj.hasOwnProperty(item)) {
          params.append(item, obj[item])
        }
      }
      // 根据id获取获取选择的多接口用例
      await formatMultiApiCaseSteps(params
      ).then(response => {
        this.selectedMutiApiCopy = response.data
      })
      this.multiApiChooseForm = false
      this.$emit('transferMultiApi', this.selectedMutiApiCopy)
    },

    // 选择数据工具-----提交选择的接口用例Id
    async commitSelectedMakeDataChoose () {
      if (this.selectedMakeData === []) {
        this.$message({
          message: '已选择列表为空！',
          type: 'warning'

        })
        return false
      }
      this.$confirm('是否展开选择的数据工具,,请确认~', '二次提醒', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.getMakeDataSave(true)
      }).catch(() => {
        this.getMakeDataSave(false)
      })
    },
    async getMakeDataSave (isExpanded) {
      var obj = { typeIds: this.selectedMakeData, dataType: 2, isExpanded: isExpanded }
      var params = new URLSearchParams()
      for (const item in obj) {
        if (obj.hasOwnProperty(item)) {
          params.append(item, obj[item])
        }
      }
      // 根据id获取获取选择的多接口用例
      await formatMultiApiCaseSteps(params
      ).then(response => {
        this.selectedMakeDataCopy = response.data
      })
      this.makeDataChooseForm = false
      this.$emit('transferMakeData', this.selectedMakeDataCopy)
    },
    // 选择SQL-----提交选择的SQL用例Id
    async commitSelectedSql () {
      if (this.selectedApi === []) {
        this.$message({
          message: '已选择列表为空！',
          type: 'warning'

        })
        return false
      }
      var obj = { typeIds: this.selectedSql, dataType: 0, isExpanded: false }
      var params = new URLSearchParams()
      for (const item in obj) {
        if (obj.hasOwnProperty(item)) {
          params.append(item, obj[item])
        }
      }
      // 根据id获取获取选择的单接口用例
      await formatMultiApiCaseSteps(params
      ).then(response => {
        this.selectedSqlCopy = response.data
      })
      this.sqlChooseForm = false
      this.$emit('transferSql', this.selectedSqlCopy)
    }
    // transferSingleApi (data) {
    //     // -- 获取所有单接口用例
    //     getSingleApiCaseList({"searchContent": data}
    //     ).then(response => {
    //         if (response.success) {
    //             this.singleApiCaseData = response.data;
    //         }
    //
    //     })
    // }

  }
}
</script>

<style scoped>
    /deep/ .el-transfer-panel {
        width: 300px
    }

    /deep/ .el-transfer-panel__list.is-filterable {
        height: 270px;
        padding-top: 0;
    }

    /deep/ .el-transfer-panel__body {
        height: 270px;
    }

</style>
