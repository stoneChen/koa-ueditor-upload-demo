<template>
  <script :id="containerId" type="text/plain" v-html="content"></script>
</template>

<script type="text/babel">
  import $script from 'scriptjs'
  import { UEDITOR_JS_URL } from './constants'
  import './ueditor-config-all'
  import defaultConfig from './ueditor-config-project'

  // 保证编辑器id唯一
  let uuid = 1
  function getEditorId() {
    return `ueditor-container-${uuid++}`
  }
  export default {
    props: {
      // 富文本内容
      content: {
        type: String,
        required: true,
      },
      // 配置
      config: {
        type: Object,
        // 这个必须得是函数，返回一个对象
        default: () => ({}),
      },
      // 在编辑器内编辑文本后出发change事件, 保证单向数据流
      onChange: {
        type: Function,
        required: true,
      }
    },
    mounted () {
      this.editorPromise = new Promise((resolve) => {
        $script(UEDITOR_JS_URL, () => {
          // 合并配置并初始化
          // getEditor调用完后,它还会去加载其他静态资源,后续api需要在ready回调中调用
          this.editor = global.UE.getEditor(this.containerId, Object.assign(
            {},
            defaultConfig,
            this.config,
          ))
          this.editor.addListener('contentChange', this.onContentChange)
          this.editor.addListener('destroy', () => {
            // 当路由切换时, 需要删除预览功能的层,以后其他全屏的dom都可以在这里删除
            let eduiFixedlayer = global.document.querySelector('#edui_fixedlayer')
            if (eduiFixedlayer) {
              eduiFixedlayer.remove()
            }
          })
          resolve()
        })
      })
      // 由于绑定了content的prop被编辑器干掉了,所以需要通过watch同步父组件的prop变化
      this.$watch('content', (val) => {
        this.editorPromise.then(() => {
          this.editor.ready(() => {
            if (val === this.editor.getContent()) {
              return
            }
            this.editor.setContent(val)
          })
        })
      })
    },
    beforeDestroy () {
      if (this.editor) {
        this.editor.destroy()
      }
    },
    data () {
      return {
        containerId: getEditorId()
      }
    },
    methods: {
      // 通知父组件,内容发生变化
      onContentChange () {
        this.onChange(this.editor.getContent())
      }
    },
  }
</script>
