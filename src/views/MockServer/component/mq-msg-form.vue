<template>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="closeEv"
               width="65%">
        <el-form :model="msgForm" label-width="120px" :rules="rules" ref="ruleForm">
            <el-form-item label="消息名称" prop="name">
                <el-input v-model="msgForm.name" placeholder="请输入消息名称"></el-input>
            </el-form-item>
            <el-form-item label="消息主题" prop="topic">
                <el-input v-model="msgForm.topic" placeholder="请输入消息主题"></el-input>
            </el-form-item>
            <el-form-item label="服务器配置" prop="configId">
                <el-select class="search-item" v-model="msgForm.configId" filterable placeholder="可选择或输入搜索" value="">
                    <el-option
                            v-for="item in configList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="消息体" prop="message">
                <el-input
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 8}"
                        v-model="msgForm.message"
                        placeholder="请输入待发送消息体"
                        @change="checkIsParametric"
                >
                </el-input>
            </el-form-item>
            <el-form-item v-if="visible" label="参数化列表">
                <el-button size="mini" icon="el-icon-circle-plus-outline" type="primary" @click="addRowEv">新增
                </el-button>
                <span style="color: orange;font-size: 14px;margin: 12px 0 0 20px">
                    <i class="el-icon-info">表格列名称以<i class="el-icon-edit-outline"></i> 开头表示可编辑列，双击单元格进行编辑操作</i>
                </span>
                <vxe-table ref="paramTbl"
                           style="margin-top: 10px"
                           border
                           auto-resize
                           :data="tableData"
                           highlight-hover-row
                           :edit-rules="validRules"
                           :edit-config="{trigger: 'dblclick', mode: 'cell'}"
                >
                    <vxe-table-column type="index" title="序号" width="80" align="center"></vxe-table-column>
                    <vxe-table-column field="paramKey" title="参数名称" align="center"></vxe-table-column>
                    <vxe-table-column field="paramValue" title="参数值" align="center"
                                      :edit-render="{name: 'input'}"></vxe-table-column>
                    <vxe-table-column title="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" content="删除" placement="right">
                                <el-button @click.native.prevent="deletePlanRowEv(scope.$index)"
                                           size="mini"
                                           type="danger"
                                           plain
                                           circle
                                           :disabled="visible && tableData.length === 1"
                                           icon="el-icon-delete">
                                </el-button>
                            </el-tooltip>
                        </template>
                    </vxe-table-column>
                </vxe-table>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="sendMockMqMsgDirectly" :loading="buttonLoading">发送消息</el-button>
            </el-form-item>
        </el-form>
        <span slot="footer" style="text-align: center" class="dialog-footer">
            <el-button @click="closeEv">取 消</el-button>
            <el-button type="primary" @click="saveMqMsg">保 存</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {
  saveMockMqMsg,
  updateMockMqMsg,
  getMockMqConfigList,
  sendMockMqMsgDirectly
} from '@/api/model/mockMqMsg'

export default {
  name: 'mq-msg-form',
  props: {
    dialogTitleProp: {
      type: String,
      default: ''
    },
    dialogVisibleProp: {
      type: Boolean,
      default: false
    },
    msgFormProp: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      dialogTitle: this.dialogTitleProp,
      dialogVisible: this.dialogVisibleProp,
      msgForm: this.msgFormProp,
      configList: [],
      rules: {
        configId: [
          { required: true, message: '请选择MQ服务配置', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入MQ消息名称', trigger: 'blur' }
        ],
        topic: [
          { required: true, message: '请输入MQ消息主题', trigger: 'blur' }
        ]
      },
      buttonLoading: false,

      // 参数化列表
      visible: false,
      paramItem: { paramKey: '', paramValue: '' },
      tableData: [],
      validRules: {
        paramValue: [
          { required: true, message: '参数值不能为空' }
        ]
      }
    }
  },
  created () {
    this.getConfigList()
  },
  methods: {
    addRowEv () {
      const pattern = /\$\{(\w+)\}/g
      const paramArr = this.msgForm.message.match(pattern)

      if (paramArr != null) {
        let value = ''
        paramArr.forEach(item => {
          value += item.replace('${', '').replace('}', '') + ','
        })
        this.paramItem.paramKey = value.substr(0, value.length - 1)
      }
      this.tableData.push({ paramKey: this.paramItem.paramKey, paramValue: '' })
    },
    getParamVariableList () {

    },
    deletePlanRowEv (index) {
      this.tableData.splice(index, 1)
    },
    checkIsParametric () {
      if (this.msgForm.message != null && this.msgForm.message.length > 0) {
        const pattern = /\$\{(\w+)\}/g
        const paramArr = this.msgForm.message.match(pattern)

        if (paramArr != null) {
          let value = ''
          paramArr.forEach(item => {
            value += item.replace('${', '').replace('}', '') + ','
          })

          if (this.tableData.length === 0) {
            this.paramItem.paramKey = value.substr(0, value.length - 1)
            this.tableData.push(this.paramItem)
          } else {
            this.tableData.forEach(item => {
              item.paramKey = value.substr(0, value.length - 1)
            })
          }
          this.visible = true
        } else {
          this.tableData = []
          this.visible = false
        }
      }
    },
    getConfigList () {
      getMockMqConfigList().then(response => {
        if (response.success) {
          this.configList = response.data
        }
      })
    },
    saveMqMsg () {
      debugger
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const postData = {
            topic: this.msgForm.topic,
            name: this.msgForm.name,
            message: this.msgForm.message,
            configId: this.msgForm.configId,
            isMultiple: 0
          }

          if (this.tableData.length > 0) {
            postData.isMultiple = 1
            const msgList = []
            this.tableData.forEach(item => {
              msgList.push({ msgValue: item.paramValue })
            })
            this.$set(postData, 'msgList', msgList)
          }

          if (this.msgForm.editFlag) {
            postData.id = this.msgForm.id
            this.doEdit(postData)
          } else {
            this.doSave(postData)
          }

          this.paramItem = { paramKey: '', paramValue: '' }
        }
      })
    },
    doSave (postData) {
      saveMockMqMsg(postData).then(response => {
        if (response.success) {
          this.dialogVisible = false
          this.$refs.ruleForm.resetFields()
          this.$message({
            type: 'success',
            message: '新增MQ消息操作成功！'
          })
          this.$emit('saveMqMsgAndRefresh')
        }
      })
    },
    doEdit (postData) {
      updateMockMqMsg(postData).then(response => {
        if (response.success) {
          this.dialogVisible = false
          this.$refs.ruleForm.resetFields()
          this.$message({
            type: 'success',
            message: '编辑MQ消息操作成功！'
          })
          this.$emit('saveMqMsgAndRefresh')
        }
      })
    },
    closeEv () {
      this.$refs.ruleForm.resetFields()
      this.buttonLoading = false
      this.tableData = []
      this.visible = false
      this.$emit('closeEv')
    },
    sendMockMqMsgDirectly () {
      this.buttonLoading = true
      sendMockMqMsgDirectly(this.msgForm).then(response => {
        if (response.success) {
          this.$message({
            message: response.data,
            type: 'success'
          })
          this.buttonLoading = false
        } else {
          this.$message({
            message: response.errorMessage,
            type: 'error'
          })
        }
      })
    }
  },
  watch: {
    dialogTitleProp (val) {
      this.dialogTitle = val
    },
    dialogVisibleProp (val) {
      this.dialogVisible = val
    },
    msgFormProp: {
      handler (val) {
        this.msgForm = val
      },
      deep: true
    }
  }
}
</script>

<style scoped>
    .row-add-btn {
        float: left;
        margin: 7px 0 7px 0
    }
</style>
