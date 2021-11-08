<template>
  <div>
    <SmartAssert
      ref="editSmartAssert"
      :smart-assert-prop="smartAssertProp"
      :assert-list-prop="assertListProp"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import SmartAssert from '@/components/SmartAssert'

export default {
  name: 'Tests',
  components: {
    SmartAssert
  },
  computed: {
    assertListProp () {
        let jsonPathContent = []
        let normalContent = {}
        let isJson = false

        this.$store.state.cases.caseForm.assertList.forEach(item => {
          if(item.assertType === 1) {
            const data = JSON.parse(item.assertContent)
            jsonPathContent = {
              ...jsonPathContent,
              [data.key]: data.value
            }
            isJson = true
          } else {
            normalContent = {
              ...normalContent,
              assertContent: item.assertContent
            }
          }
        });

        return {
          jsonPathContent,
          normalContent,
          assertType: isJson ? 1 : 0,
          length: this.$store.state.cases.caseForm.assertList.length
        }
      },
  },
  data () {
    return {
      smartAssertProp: {
        normalShow: true,
        titleHeight: 'height:30px',
        radioMargin: 'margin:10px'
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setEditSmartAssertDom(this.$refs.editSmartAssert)
    })
  },
  methods: {
    ...mapActions(['setEditSmartAssertDom', 'setCaseForm'])
  }
}
</script>

<style lang="scss" scoped>
</style>
