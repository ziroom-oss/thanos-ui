<template>
  <div class="jsonPrettyLine">
    <div class="json-tip" v-if="selectableType === 'single'">
      <i class="el-icon-s-opportunity"></i>
      <p class="head_status">
        选中复制当前行路径
      </p>
    </div>
    <VueJsonPretty
      :deep="8"
      :selectableType="selectableType"
      showSelectController
      :path="path"
      :data="jsonData"
      v-model="pathData"
      :pathSelectable="pathSelectable"
      collapsedOnClickBrackets
      :selectOnClickNode="false"
    >
    </VueJsonPretty>
  </div>
</template>
<script>
import VueJsonPretty from 'vue-json-pretty/lib/vue-json-pretty.js'
import 'vue-json-pretty/lib/styles.css';

export default {
  name: 'JsonPretty',
  props: {
    jsonData: {
      type: Object,
      default () {
        return {}
      }
    },
    selectableType: {
      type: String,
      default () {
        return 'single'
      }
    },
    path: {
      type: String,
      default () {
        return '$'
      }
    },
    pathDataProps: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      pathData: ''
    }
  },
  components: { 
    VueJsonPretty
  },
  watch: {
    pathData: {
      handler (val) {
        this.$emit('changePathData', val);
      },
      deep: true
    },
    pathDataProps: {
      handler (val) {
        this.pathData = val
      },
      deep: true,
      immediate: true
    },
    // jsonData: {
    //   handler (val) {
    //     if (this.selectableType === 'single') {
    //       this.$nextTick(() => {
    //         let elements = document.querySelectorAll('.vjs-check-controller__inner')
    //         if (elements.length === 0) {
    //           elements = document.querySelectorAll('.vjs-radio__inner')
    //         }
    //         for (let i = 0; i < elements.length; i++) {
    //           elements[i].innerHTML = '复制'
    //           elements[i].style='width:30px;display:inline-block;border:none;color:#49b3ff;;font-size:12px;text-align:center;background-color:#fff;'
    //         }
    //       })
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    pathSelectable (currentPath, content) {
      return ((typeof content !== 'object' && typeof content !== 'function') || content === null) && currentPath !== this.path
    }
  }
}
</script>
<style scoped lang="scss">
.vjs-tree .vjs-tree__content.has-line {
  display: inline-block;
  height: 24px;
}
.vjs-tree.is-root.has-selectable-control {
  margin-left: 40px;
}
.json-tip {
  color: #909090;
  text-align: right;
  padding: 0 20px;
  .head_status {
    display: inline-block;
    margin-left: 5px;
  }
}
</style>
<style lang="scss">
.jsonPrettyLine {
  .vjs-tree .vjs-tree__content.has-line {
    height: 24px;
  }
  .vjs-tree__node.has-selector {
    height: 24px;
  }
}
</style>

