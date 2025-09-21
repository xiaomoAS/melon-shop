
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'

import {baseURL, http} from './utils/service.js' // 全局挂载引入，配置相关在该index.js文件里修改

export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.$http = http; //把 请求 变成全局文件 就可以直接 访问 （this.$http.post）--注意：$http可以自己命名
  app.config.globalProperties.$baseURL = baseURL;
  
  return {
    app
  }
}
// #endif