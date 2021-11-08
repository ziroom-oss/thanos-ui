<template>
    <el-dialog title="提示信息 - 运行环境选择" :visible.sync="envDialog" width="30%" :close-on-click-modal="false"
               @close="closeEv">
        <div style="margin-bottom: 30px;color: orange">
            <i class="el-icon-info"></i>
            请先选择测试用例运行环境（默认测试环境）
        </div>
        <el-radio-group v-model="env">
            <el-radio label="t" size="small">测试环境</el-radio>
            <el-radio label="q" size="small">准生产环境</el-radio>
            <el-radio label="p" size="small" disabled>生产环境</el-radio>
            <div style="margin-top: 25px">
                <el-radio label="kt" size="small">日常环境
                    <el-tooltip style="margin-left: 5px" effect="light" content="Omega项目KT环境" placement="right">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </el-radio>
            </div>
        </el-radio-group>
        <span slot="footer" class="dialog-footer">
                <el-button @click="closeEv">取 消</el-button>
                <el-button type="primary" @click="selectEnvToRun">确 定</el-button>
            </span>
    </el-dialog>
</template>

<script>
export default {
  name: 'env-selected-to-run',
  props: {
    envDialogProp: {
      type: Boolean,
      default: false
    },
    envProp: {
      type: String,
      default: 't'
    }
  },
  data () {
    return {
      envDialog: this.envDialogProp,
      env: this.envProp
    }
  },
  methods: {
    closeEv () {
      this.$emit('closeEnvEv')
      this.env = 't'
    },
    selectEnvToRun () {
      this.$emit('selectEnvToRunEv', this.env)
    }
  },
  watch: {
    envDialogProp (val) {
      this.envDialog = val
    },
    envProp (val) {
      this.env = val
    }
  }
}
</script>

<style scoped>

</style>
