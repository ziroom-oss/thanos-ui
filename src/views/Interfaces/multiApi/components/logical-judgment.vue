<template>
    <el-dialog title="逻辑判断编辑" :visible.sync="logicalDudgmentDialog" width="80%" @close="closeLogicalDialog">
        <el-tabs v-model="logicicalType" type="card">
            <el-tab-pane label="条件判断-if" name="If">
                <el-button size="mini" type="primary" class="el-icon-circle-plus-outline" @click="insertIfEvent(-1)"
                           style="margin-bottom:10px" plain>新增
                </el-button>
                <elx-editable ref="ifTable" :data.sync="ifData" border
                              empty-text="请点击【新增】添加条件判断详情">

                    <elx-editable-column prop="formula" align="center" label="类型"
                                         :edit-render="{name: 'ElSelect', options: conditonType}"
                    ></elx-editable-column>
                    <elx-editable-column prop="variable" align="center" label="变量"
                                         :edit-render="{name: 'ElInput'}"></elx-editable-column>
                    <elx-editable-column prop="operator" align="center" label="操作符"
                                         :edit-render="{name: 'ElSelect', options: variableTypeList}"></elx-editable-column>
                    <elx-editable-column prop="realValue" align="center" label="实际值"
                                         :edit-render="{name: 'ElInput'}"></elx-editable-column>
                    <elx-editable-column prop="link" align="center" label="or/and"
                                         :edit-render="{name: 'ElSelect', options: linkTypeList}"></elx-editable-column>

                    <elx-editable-column prop="dynamicOrderId" align="center" label="跳转到第N步"
                                         :edit-render="{name: 'ElSelect', options: this.orderList}"></elx-editable-column>
                    <elx-editable-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    @click.native.prevent="deleteIfRow(scope.$index, ifData,scope.row)"
                                    type="text"
                                    size="small">
                                删除
                            </el-button>
                        </template>
                    </elx-editable-column>
                </elx-editable>
            </el-tab-pane>
            <el-tab-pane label="循环-for" name="For">
                <el-button size="mini" type="primary" class="el-icon-circle-plus-outline" @click="insertForEvent(-1)"
                           style="margin-bottom:10px" plain>新增
                </el-button>
                <elx-editable ref="forTable" :data.sync="forData" border
                              empty-text="请点击【新增】添加循环判断详情">
                    <elx-editable-column prop="formula" align="center" label="类型"
                    ></elx-editable-column>
                    <elx-editable-column prop="variable" align="center" label="循环开始位置(不包含)"
                                         :edit-render="{name: 'ElInput'}"></elx-editable-column>
                    <elx-editable-column prop="realValue" align="center" label="循环结束位置(包含)"
                                         :edit-render="{name: 'ElInput'}"></elx-editable-column>
                    <elx-editable-column prop="dynamicOrderId" align="center" label="循环执行第N步"
                                         :edit-render="{name: 'ElSelect', options: this.orderList}"></elx-editable-column>
                    <elx-editable-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    @click.native.prevent="deleteForRow(scope.$index, forData,scope.row)"
                                    type="text"
                                    size="small">
                                删除
                            </el-button>
                        </template>
                    </elx-editable-column>
                </elx-editable>

            </el-tab-pane>
        </el-tabs>

        <span slot="footer" class="dialog-footer">
                <el-button @click="closeLogicalDialog">取消</el-button>
                <el-button type="primary" @click="commitLogicalList">确 定</el-button>
            </span>
    </el-dialog>

</template>

<script>
import {
  getOrderList
} from '@/api/model/getOrderList'

export default {
  name: 'logical-judgment',
  data () {
    return {
      logicalDudgmentDialog: this.logicalDudgmentShow,
      logicicalType: 'If',
      ifData: [],
      forData: [],
      deleteMakeDataFormulaEntityList: [],
      caseId: this.multiApiCaseId,
      variableTypeList: [
        {
          label: '>',
          value: '>'
        }, {
          label: '<',
          value: '<'
        }, {
          label: '=',
          value: '='
        }, {
          label: '>=',
          value: '>='
        }, {
          label: '<=',
          value: '<='
        }, {
          label: '!=',
          value: '!='
        },
        {
          label: 'contains',
          value: 'contains'
        },
        {
          label: 'equals',
          value: 'equals'
        },
        {
          label: 'not equals',
          value: 'not equals'
        }

      ],
      linkTypeList: [
        {
          label: '',
          value: ''
        },
        {
          label: 'or',
          value: 'or'
        },
        {
          label: 'and',
          value: 'and'
        }
      ],
      orderList: [],
      conditonType: [
        {
          label: '',
          value: ''
        },
        {
          label: 'if',
          value: 'if'
        }
      ],
      order: ''
    }
  },
  props: {
    logicalDudgmentShow: {
      type: Boolean,
      default: false
    },
    logicalData: {
      type: Array,
      default: () => {
        return []
      }

    },
    multiApiCaseId: {
      type: String,
      default: ''
    }
  },
  watch: {
    logicalDudgmentShow (value) {
      this.logicalDudgmentDialog = value
    },
    logicalData: {
      handler (value) {
        if (value != null) {
          if (value.length !== 0) {
            if (value[0].formula == 'if') {
              this.ifData = value
            } else {
              this.forData = value
            }
          }
        }
      },
      deep: true

    },
    multiApiCaseId (value) {
      this.caseId = value
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    // 关闭模态框
    closeLogicalDialog () {
      this.logicalDudgmentDialog = false
      this.$emit('changeLogicalStatus', false)
      if (this.logicalData.length !== 0) {
        if (this.logicalData[0].formula == 'if') {
          this.ifData = this.logicalData
        } else {
          this.forData = this.logicalData
        }
      }
      this.ifData = []
      this.forData = []
    },
    // 提交
    commitLogicalList () {
      if (this.logicicalType == 'If') {
        var commit = true
        var count = this.ifData.length
        if (count > 1) {
          for (var i = 0; i < count - 1; i++) {
            if (this.ifData[i].link == null || this.ifData[i].link == '') {
              commit = false
              break
            }
          }
        }
        if (commit) {
          this.$emit('commitLogicalData', this.ifData, this.deleteMakeDataFormulaEntityList)
        } else {
          this.$message({
            message: "if判断在多个条件组合时，需填写'or/and'连接符！！",
            type: 'warning'

          })
          return false
        }
      } else {
        this.$emit('commitLogicalData', this.forData, this.deleteMakeDataFormulaEntityList)
      }
      this.logicalDudgmentDialog = false
      this.$emit('changeLogicalStatus', false)
    },

    insertIfEvent (row) {
      this.$refs.ifTable.insertAt({ formula: 'if' }, row).then(({ row }) => this.$refs.ifTable.setActiveCell(row))
    },
    deleteIfRow (index, rows, row) {
      rows.splice(index, 1)
      if (row.id != null && row.id != '') {
        this.deleteMakeDataFormulaEntityList.push(row)
      }
    },

    insertForEvent (row) {
      this.$refs.forTable.insertAt({ formula: 'for' }, row).then(({ row }) => this.$refs.forTable.setActiveCell(row))
    },
    deleteForRow (index, rows, row) {
      rows.splice(index, 1)
      if (row.id != null && row.id != '') {
        this.deleteMakeDataFormulaEntityList.push(row)
      }
    },

    getOrderList () {
      getOrderList({ caseId: this.caseId }).then(response => {
        this.orderList = response.data
      })
    }

  }
}
</script>

<style scoped>
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

</style>
