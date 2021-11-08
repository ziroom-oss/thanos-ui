<template>
    <el-dialog v-el-drag-dialog :visible.sync="dialogVisibleVal" :title="title"
               @dragDialog="handleDrag" @close="closeEv">

        <div class="clearfix">

            <el-form ref="dialogForm" :model="dialogForm" label-width="160px">
                <el-form-item label="用例名称">
                    <el-input v-model="dialogForm['caseName']" ></el-input>
                </el-form-item>
            </el-form>
            <el-form ref="dialogForm" :model="dialogForm" label-width="160px">
                <el-form-item label="用例参数">
                    <el-input v-model="dialogForm['requestParam']" ></el-input>
                </el-form-item>
            </el-form>
            <el-form ref="dialogForm" :model="dialogForm" label-width="160px">
                <el-form-item label="断言">
                    <el-input v-model="dialogForm['expectedResults']" ></el-input>
                </el-form-item>
            </el-form>
            <el-form ref="dialogForm" :model="dialogForm" label-width="160px">
                <el-form-item label="用例描述">
                    <el-input v-model="dialogForm['comment']" ></el-input>
                </el-form-item>
            </el-form>
            <div style="float: right">
                <el-button type="success" plain @click="submitRelyCaseEditInfo()">保存</el-button>
                <el-button type="primary" plain @click="closeEv">取消
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import {
  updateSingleApiCase
} from '@/api/model/singleApiList'

export default {
  name: 'rely-case-dialog',
  directives: { elDragDialog },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '默认标题'
    },
    dialogFormObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data () {
    return {
      dialogVisibleVal: this.dialogVisible,
      dialogForm: this.dialogFormObj
    }
  },
  watch: {
    dialogFormObj (newValue) {
      this.dialogForm = newValue
    },
    dialogVisible (newVal) {
      this.dialogVisibleVal = newVal
    }
  },
  methods: {
    handleDrag () {

    },
    closeEv () {
      this.$emit('close')
    },
    // 提交编辑数据
    submitRelyCaseEditInfo () {
      var updateInfo = {
        comment: this.dialogForm.comment,
        requestParam: this.dialogForm.requestParam,
        expectedResults: this.dialogForm.expectedResults,
        caseName: this.dialogForm.caseName,
        id: this.dialogForm.id
      }
      updateSingleApiCase(updateInfo).then(response => {
        if (response.success) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.$emit('listenSingleRelyApiTableList')
          this.dialogVisibleVal = false
        } else {
          this.$message({
            message: response.errorMessage,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
    .form-sub-title {
        font-weight: bold;
        margin-top: 10px;
        margin-left: 15px;
        font-size: 15px;
    }

    /deep/ .el-form-item__label {
        font-weight: normal;
    }

    .form-checkbox-group {
        margin: 15px 0 15px 40px
    }

</style>
