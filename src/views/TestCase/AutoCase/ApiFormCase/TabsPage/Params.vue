<template>
  <div class="tabs_params">
    <edit-table
      :tableData="params"
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
  name: 'Params',
  components: { EditTable },
  computed: {
    ...mapState({
      params: (state) => state.cases.caseForm.params
    })
  },
  methods: {
    ...mapActions(['setCaseForm']),
    editClosedEvent (params) {
      this.setCaseForm({ params })
    },
    removeData (row) {
      const params = this.params.filter((item) => item._XID !== row._XID)
      this.setCaseForm({ params })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
