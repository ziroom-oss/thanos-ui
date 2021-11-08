<template>
  <div class="edit_table_box" :style="{ height: tableHeight }">
    <vxe-table
      v-show="isKeyValue"
      border
      show-overflow
      keep-source
      auto-resize
      ref="xTable"
      max-height="auto"
      :data="tableData"
      :edit-rules="tableRules"
      :edit-config="{
        trigger: 'click',
        mode: 'cell',
        icon: 'fa fa-pencil',
        activeMethod: activeCellMethod,
      }"
      @edit-closed="editClosedEvent"
      @edit-disabled="editDisabledEvent"
      v-bind="$attrs"
    >
      <vxe-table-column
        field="key"
        title="key"
        :edit-render="{
          name: 'input',
          defaultValue: '',
          placeholder: 'key',
          events: { change: valueChangeEvent },
        }"
      ></vxe-table-column>
      <vxe-table-column
        field="value"
        title="value"
        :edit-render="{
          name: 'input',
          defaultValue: '',
          placeholder: 'value',
        }"
      >
        <!-- events: { change: valueChangeEvent }, -->
      </vxe-table-column>
      <vxe-table-column v-if="isCanHandle" width="200px">
        <template #header>
          <div class="table_operate">
            <span>操作</span>
            <span class="bulk_edit" @click="toggleType">
              <i class="el-icon-edit-outline"></i>
              Bulk Edit
            </span>
          </div>
        </template>
        <template slot-scope="row">
          <i class="el-icon-close" @click="removeColumn(row)"></i>
        </template>
      </vxe-table-column>
    </vxe-table>
    <div class="bulk_edit_block" v-show="!isKeyValue">
      <header class="bulk_edit_header">
        <span @click="toggleType">Key-Value Edit</span>
      </header>
      <main>
        <el-input
          ref="editInput"
          v-model="editData"
          type="textarea"
          placeholder="
          Rows are separated by new lines
          Keys and values are separated by :
          Prepend // to any row you want to add but keep disabled
          "
          :autosize="{
            minRows: 6,
            maxRows: 12,
          }"
          @blur="changeEditData"
          clearable
        >
        </el-input>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditTable',
  props: {
    tableData: {
      type: Array,
      default () {
        return [{ key: '', value: '' }]
      }
    },
    tableHeight: {
      type: String,
      default () {
        return this.isKeyValue ? 'calc(35vh)' : 'calc(30vh)'
      }
    },
    tableRules: {
      type: Object,
      default () {
        const rules = {
          key: [
            {
              required: true,
              message: 'key值必须填写',
              trigger: 'change'
            }
          ]
        }
        return rules
      }
    },
    isCanHandle: {
      type: Boolean,
      default: true
    },
    isReadonly: {
      type: Boolean,
      default: false
    },
    // 只读属性key，不允许在EDIT中修改
    readonlyKeys: {
      type: Array,
      default () {
        // data: {key: 'key',value: ''}  key对应着要禁用的key,value为提示的信息
        return []
      }
    }
  },
  data () {
    return {
      isKeyValue: true,
      editData: '',
      saveEditData: '' // 暂存只读的数据，不允许在edit中存在
    }
  },
  watch: {
    tableData: {
      immediate: true,
      handler (value) {
        let str = ''
        let saveStr = ''

        for (const item of Object.values(value)) {
          const key = item?.key?.trim() || ''
          const value = item?.value?.trim() || ''
          const isKeys = this.hasKeys(key, this.readonlyKeys)

          if ((key || value) && !isKeys) {
            str += `${key}:${value}\n`
          } else if (key || value) {
            saveStr += `${key}:${value}\n`
          }
        }
        this.saveEditData = saveStr
        this.editData = str
      }
    }
  },
  methods: {
    // 插入一行数据
    insertEvent (row) {
      const record = {
        key: '',
        value: ''
      }
      this.$refs.xTable
        .insertAt(record, row)
        .then(({ row }) => this.$refs.xTable.setActiveCell(row))
    },
    // 自动增加行
    valueChangeEvent ({ row, data, seq }) {
      if (seq === data.length) {
        setTimeout(() => {
          const { key } = JSON.parse(JSON.stringify(row))
          if (key) {
            this.insertEvent(-1)
          }
        }, 0)
      }
    },
    // 编辑完成即时保存功能
    editClosedEvent ({ $table }) {
      const { afterFullData } = $table
      this.$emit('editClosedEvent', afterFullData)
    },
    // 移除元素
    removeColumn ({ row, data, seq }) {
      const isKeys = this.hasKeys(row.key, this.readonlyKeys)

      if (seq !== data.length && !isKeys) {
        this.$confirm('您确定要删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const $table = this.$refs.xTable
            $table.remove(row)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$emit('removeData', row)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.$message({
          type: 'warning',
          message: '不允许删除'
        })
      }
    },
    editDisabledEvent ({ row }) {
      const isKeys = this.hasKeys(row.key, this.readonlyKeys)

      if (isKeys) {
        this.$message.warning(isKeys.value || '禁止编辑')
      } else {
        this.$message.warning('禁止编辑')
      }
    },
    // 禁用
    activeCellMethod ({ row }) {
      const isKeys = this.hasKeys(row.key, this.readonlyKeys)

      if (this.isReadonly || isKeys) {
        return false
      }
      return true
    },
    // 切换输入方式，获取焦点
    toggleType () {
      this.isKeyValue = !this.isKeyValue
      if (!this.isKeyValue) {
        this.$nextTick(() => {
          this.$refs.editInput.focus()
        })
      }
    },
    // 失去焦点保存
    changeEditData (event) {
      const { value } = event.target
      const values = this.saveEditData + value
      const arr = values
        .split('\n')
        .map((item) => {
          const [key, value] = item.split(':')
          if (key || value) {
            return { key, value }
          }
        })
        .filter((item) => item)

      arr.push({ key: '', value: '' })
      this.saveEditData = ''
      this.$emit('changeEditData', arr)
    },
    // 是否包含禁用的key
    hasKeys (key, readonlyKeys) {
      key = key?.toLowerCase()
      return readonlyKeys.find((item) => item?.key?.toLowerCase() === key)
    }
  }
}
</script>

<style lang="scss" scoped>
.edit_table_box {
  .el-icon-close {
    cursor: pointer;
    &:hover {
      color: #000;
    }
  }
  .bulk_edit_block {
    main {
      padding-bottom: 10px;
    }
    .bulk_edit_header {
      border: 1px solid #dcdfe6;
      height: 36px;
      line-height: 36px;
      text-align: right;
    }
    ::v-deep .el-textarea__inner {
      border: none;
      background: #f9f9f9;
      &:hover {
        background: #ededed;
      }
    }
  }
  .table_operate {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }
  .bulk_edit,
  .bulk_edit_header span {
    border-left: 1px solid #dcdfe6;
    padding-left: 4px;
    font-size: 14px;
    font-weight: 700;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
  }
  ::v-deep .vxe-cell--title,
  .table_operate span {
    font-size: 14px;
    font-weight: 700;
  }
  .table_operate {
    text-align: center;
  }
  ::v-deep .vxe-cell {
    line-height: 36px;
    height: 36px;
    .vxe-default-input {
      height: 100%;
    }
  }
  ::v-deep .vxe-header--column {
    padding: 0;
  }
  ::v-deep .vxe-body--column {
    height: 36px;
  }
  ::v-deep .vxe-table--header-wrapper {
    background: transparent;
  }
}
</style>
