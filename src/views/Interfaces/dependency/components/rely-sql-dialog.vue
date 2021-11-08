<template>
    <el-dialog v-el-drag-dialog :visible.sync="dialogVisibleVal" :title="title"
               @dragDialog="handleDrag" @close="closeEv">

        <div class="clearfix" style="width: 90%">

            <el-form ref="dialogForm" :model="dialogForm" label-width="130px">
                <el-form-item label="用例名称:">
                    <el-input v-model="dialogForm['sqlName']" ></el-input>
                </el-form-item>
            </el-form>
            <el-form ref="dialogForm" :model="dialogForm" label-width="130px">
                <el-form-item label="SQL类型:">
                    <el-select v-model="dialogForm.isPrep" placeholder="请选择">
                        <el-option label="前置" value="1"></el-option>
                        <el-option label="后置" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form ref="dialogForm" :model="dialogForm" label-width="130px">
                <el-form-item label="SQL语句:">
                    <el-input type="textarea"
                              :rows="3"
                              placeholder="请输入SQL语句"
                              v-model="dialogForm['sqlData']" >
                    </el-input>
                </el-form-item>
            </el-form>
            <div style="float: right">
                <el-button type="success" plain @click="submitRelySqlEditInfo()">保存</el-button>
                <el-button type="primary" plain @click="closeEv">取消
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import {
  updateSqlInfo
} from '@/api/model/sqlRelyList'

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
    submitRelySqlEditInfo () {
      var updateInfo = {
        id: this.dialogForm.id,
        sqlName: this.dialogForm.sqlName,
        sqlData: this.dialogForm.sqlData,
        isPrep: this.dialogForm.isPrep
      }
      updateSqlInfo(updateInfo).then(response => {
        if (response.success) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.$emit('listenTableList')
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
