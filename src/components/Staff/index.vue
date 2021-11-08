<template>
   <el-select
      v-model="checkedStaffAd"
      clearable
      filterable
      @change="handleChecked"
      :multiple="staffConfig.isMultiple"
      :placeholder="staffConfig.placeholderMsg"
    >
      <el-option v-for="item of staffDataSource" :label="item.name + '-' + item.adCode" :key="item.emplid" :value="item.adCode" />
    </el-select>
</template>

<script>

export default {
  name: 'Staff',
  props: {
    staffConfig: {
      type: Object,
      required: true,
      default () {
        return {
          isMultiple: false,
          placeholderMsg: ''
        }
      }
    },
    checkedStaff: {
      type: String
    }
  },
  data () {
    return {
      checkedStaffAd: ''
    }
  },
 
  created () {
    this.checkedStaffAd = this.checkedStaff
    // this.checkedStaffAd = this.mulTipleCheckedStaff
  },
  watch: {
    checkedStaff: {
      handler (val) {
        this.checkedStaffAd = val
      },
      immediate: true
    }
  },
  methods: {
    
    handleChecked (currentValue) {
      this.$emit('input', currentValue)
    }
  }
}
</script>
