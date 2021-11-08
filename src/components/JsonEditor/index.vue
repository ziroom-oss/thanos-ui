<template>
  <div class="json-editor">
    <label>
      <textarea ref="textarea"></textarea>
    </label>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/fold/foldgutter.css'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'
// eslint-disable-next-line import/no-webpack-loader-syntax
require('script-loader!jsonlint')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')

export default {
  name: 'JsonEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value'],
  data () {
    return {
      jsonEditor: false
    }
  },
  watch: {
    value (value) {
      const editorValue = this.jsonEditor.getValue()
      if (value !== editorValue) {
        this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
      }
    }
  },
  mounted () {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: 'application/json',
      foldGutter: true,
      gutters: ['CodeMirror-lint-markers', 'CodeMirror-foldgutter', 'CodeMirror-linenumbers'],
      theme: 'eclipse',
      lint: true,

      smartIndent: true, // 智能缩进
      indentUnit: 2, // 智能缩进单位为2个空格长度
      indentWithTabs: true, // 使用制表符进行智能缩进

      autoRefresh: true // 自动触发刷新
    })

    this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
    this.jsonEditor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue () {
      return this.jsonEditor.getValue()
    },
    refresh () {
      this.jsonEditor.setValue('""')
      this.jsonEditor && this.jsonEditor.refresh()
    }
  }
}
</script>

<style scoped>
.json-editor{
  height: 100%;
  position: relative;
  font-size: 15px;
}
.json-editor >>> .CodeMirror {
  height: auto;
  min-height: 300px;
  border:1px solid #ece2e2;
}
.json-editor >>> .CodeMirror-scroll{
  min-height: 300px;
}
.json-editor >>> .CodeMirror-line {
  line-height: 1.5;
}
.json-editor >>> .CodeMirror-linenumber {
  color: #2b91af;
}

.json-editor >>> .cm-s-eclipse span.cm-string {
  color: #F08047;
}
</style>
