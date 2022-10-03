import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 清除浏览器自带的样式
import './assets/reset.css'
// 引入hqchart里的iconfont样式
import '../node_modules/hqchart/src/jscommon/umychart.resource/font/iconfont.css'
import '../node_modules/hqchart/src/jscommon/umychart.resource/css/tools.css'
// import '../node_modules/hqchart/lib/umychart.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.mount('#app')
