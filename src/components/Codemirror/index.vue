<template>
  <div>
    <textarea
      ref="mycode"
      class="codesql"
      v-model="newVal"
      placeholder="请输入sql"
    >
    </textarea>
  </div>
</template>
<script>
import 'codemirror/theme/ambiance.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/theme/idea.css'
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/selection/active-line')
require('codemirror/mode/sql/sql')
require('codemirror/addon/hint/show-hint')
require('codemirror/addon/hint/sql-hint')
import { CodeMirror } from 'vue-codemirror'
export default {
  data () {
    return {
      editor: null,
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    sqlStyle: {
      type: String,
      default: 'default'
    },
    readOnly: {
      type: [Boolean, String]
    },
    codeMirrorHeight: {
      type: String,
      default: '200'
    }
  },
  watch: {
    newVal (newV) {
      if (this.editor) {
        this.$emit('changeTextarea', newV)
      }
    },
    value (val) {
      if (val && !this.newVal) {
        this.editor.setValue(val)
      }
    },
  },
  computed: {
    newVal (val) {
      return this.editor ? this.editor.getValue() : ''
    }
  },

  mounted () {
    const mime = 'text/x-mariadb'
    // let theme = 'ambiance'//设置主题，不设置的会使用默认主题
    this.editor = CodeMirror.fromTextArea(this.$refs.mycode, {
      value: this.preSql,
      mode: mime, // 选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: false,
      matchBrackets: true,
      cursorHeight: 1,
      lineWrapping: true,
      readOnly: false,
      theme: 'idea',
      autofocus: true,
      extraKeys: { Ctrl: 'autocomplete' }, // 自定义快捷键
      hintOptions: { // 自定义提示选项
      // 当匹配只有一项的时候是否自动补全
        completeSingle: false
        // tables: {
        //     users: ['name', 'score', 'birthDate'],
        //     countries: ['name', 'population', 'size']
        // }
      }
    })
    // 代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
    this.editor.on('inputRead', () => {
      this.editor.showHint()
    })
    this.editor.setSize('auto', this.codeMirrorHeight);
  },
  methods: {
  }
}
</script>
<style>
.CodeMirror {
  color: black;
  direction: ltr;
  line-height: 22px;
  height: 200px;
  border: 1px solid #EBEEF5;
}
/* 这句为了解决匹配框显示有问题而加 */
.CodeMirror-hints{
  z-index: 9999 !important;
}
.CodeMirror-scroll {
  margin-bottom: 0px;
  margin-right: 0px;
  padding-bottom: 0px;
}
</style>
