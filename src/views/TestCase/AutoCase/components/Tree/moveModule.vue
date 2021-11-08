<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="moveModuleShow"
      :close-on-click-modal="false"
      :lock-scroll="false"
      width="35%"
    >
      <el-row class="moduleMove" style="margin-top: -10px">
        <el-col
          :span="22"
        >
          <div>
            <span>{{moduleMove}}</span>
            <span>{{moduleMoveIs.label}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row class="moduleMove" style="margin-top: 12px">
        <el-col
          :span="22"
        >
          <div>
            <span>{{chooseModule}}</span>
            <div>
              <el-input
                size="small"
                :placeholder="pleaseEnterContent"
                class="input"
                v-model="moduleValue"
              ></el-input>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row
        class="moduleMove"
      >
        <el-col
          :span="22"
          class="table"
          style="border: black solid 1px"
        >
          <div class="moduleMoveTable">
            <el-tree
              ref="tree"
              class="moduleTree"
              :data="data"
              :default-expand-all=false
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
            >
            </el-tree>
          </div>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button @click="handleShow">取 消</el-button>
        <el-button @click="handleMove">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { shiftModule } from '@/api/model/testApplication'
export default {
  name: 'moveModule',
  data () {
    return {
      moveModuleShow: false,
      title: '移动到其他应用/模块',
      moduleMove: '待转移模块：',
      moduleMoveIs: '', // 待转移模块
      chooseModule: '选择目的应用/模块',
      pleaseEnterContent: '请输入目标应用/模块查询',
      moduleValue: '',
      data: [],
      goalModule: ''
    }
  },
  watch: {
    moduleValue (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleShow () {
      this.moveModuleShow = false
    },
    moduleJudge (val) { // 模块信息判断和数据信息拼装
      const sourceModuleId = val.id; const appFlag = this.goalModule.app
      const targetModuleId = this.goalModule.id
      const data = {
        sourceModuleId: sourceModuleId,
        targetModuleId: targetModuleId,
        appFlag: appFlag
      }
      return data
    },
    async handleMove () { // 点击确认按钮
      const val = this.moduleMoveIs
      const data = this.moduleJudge(val)
      await shiftModule(data)
        .then(res => {
          if (res.success) {
            this.$notify({
              type: 'success',
              message: res.message
            })
            this.moveModuleShow = false
            const goalId = this.goalModule.id
            this.$emit('moduleMove', goalId)
          }
        })
    },
    handleNodeClick (data) {
      this.goalModule = data
    }
  }
}
</script>
<style>
.moduleMove{
  width: 100%;
  margin-left: 30px;
  font-size: 16px;
}
.table{
  margin-top: 10px;
  margin-bottom: 10px;
}
.input{
  width: 100%;
  margin-top: 7px
}
.moduleMoveTable{
  height: 300px;
  overflow-y: scroll;
  padding: 10px 10px;
}
</style>
