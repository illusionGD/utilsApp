import hljs from 'highlight.js/lib/core'
// 导入需要的语言高亮
import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import 'highlight.js/styles/atom-one-dark.min.css'
hljs.registerLanguage('css', css)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('ts', typescript)

export default hljs
