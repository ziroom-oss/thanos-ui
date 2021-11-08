<template>
  <div class="tabs_headers">
    <edit-table
      ref="xTable"
      :tableData="header"
      :readonlyKeys="[{key: 'content-type',value: 'Content-Type请在左边树修改'}]"
      @editClosedEvent="editClosedEvent"
      @removeData="removeData"
      @changeEditData="editClosedEvent"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import EditTable from '@/components/EditTable'

export default {
  name: 'Headers',
  components: { EditTable },
  computed: {
    ...mapState({
      header: (state) => state.cases.caseForm.header
    })
  },
  mounted () {
    this.$nextTick(() => {
      this.setHeaderTableDom(this.$refs.xTable)
    })
  },
  methods: {
    ...mapActions(['setCaseForm', 'setHeaderTableDom']),
    editClosedEvent (header) {
      this.setCaseForm({ header })
    },
    removeData (row) {
      const header = this.header.filter(item => item._XID !== row._XID)
      this.setCaseForm({ header })
    }
  }
}
</script>
