<template>
  <el-cascader
    ref="cascader"
    v-model="departCode"
    :options="afterHandledeptOrgList"
    separator="-"
    size="mini"
    filterable
    :show-all-levels="false"
    clearable
    :props="{ multiple: cascaderConfig.multipleCheck, checkStrictly: true }"
    placeholder="请选择所属组织结构"
    @change="handleLevelChange"
  />
</template>
<script>
import { getEhrInfo } from '@/api/model/testCase'

export default {
  name: 'DeptOrg',
  props: {
    cascaderConfig: { // 组织结构联动，配置是否到人以及是否多选
      type: Object,
      required: true,
      default () {
        return {
          isToPerson: false, // true 细粒度到人 false 细粒度不到人
          multipleCheck: false // true 多选 false 不多选
        }
      }
    }
  },
  data () {
    return {
      departCode: [''],
      deptOrgList: [],
      afterHandledeptOrgList: []
    }
  },
  watch: {
    cascaderConfig: {
      handler (val) {
        this.handleDeartOrg()
      },
      deep: true
    }
  },
  async mounted () {
    await this.getDepartOrg()
  },
  methods: {
    handleLevelChange (val) {
      this.$emit('update:deptCode', val)
    },
    flattenToPersonChild (options) { // 处理组织结构数据  到人
      const that = this
      return options.map(item => {
        if (!item.user) {
          return {
            label: item.deptName,
            value: item.deptCode,
            children: (function () {
              return that.flattenToPersonChild(item.childDept)
            })()
          }
        }
        return {
          label: item.deptName,
          value: item.deptCode
        }
      })
    },
    flattenNotToPersonChild (options) { // 不到人
      const that = this
      const deptOptions = []
      options.forEach(item => {
        if (!item.last && item.childDept) {
          deptOptions.push({
            label: item.deptName,
            value: item.deptCode,
            children: (function () {
              return that.flattenNotToPersonChild(item.childDept)
            })()
          })
        } else if (item.last && item.childDept) {
          deptOptions.push({
            label: item.deptName,
            value: item.deptCode
          })
        } else {
          return false
        }
      })
      return deptOptions
    },
    async getDepartOrg () { // 获取组织结构
      const res = await getEhrInfo() || []
      const childDept = res.data
      this.deptOrgList = childDept.childDept
      this.handleDeartOrg()
    },
    handleDeartOrg () {
      this.afterHandledeptOrgList =
      (this.cascaderConfig.isToPerson
        ? this.flattenToPersonChild(this.deptOrgList)
        : this.flattenNotToPersonChild(this.deptOrgList))
    }
  }
}
</script>
