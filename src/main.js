// import Vue from 'vue'

import 'normalize.css/normalize.css' //CSS重置的现代替代方法

// import 'element-ui/lib/theme-chalk/index.css'
// import ElementUI from 'element-ui'
// import element from "@/utils/element"

import '@/styles/index.scss' // 全局 css

import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
// import wl from "wl-vue-select";
// import "wl-vue-select/lib/wl-vue-select.css"
// import VueParticles from 'vue-particles'
// Vue.use(VueParticles)

// Vue.use(wl);

// Vue.use(ElementUI)
// Vue.use(element)




Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
