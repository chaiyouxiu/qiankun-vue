import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import * as _ from 'lodash'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VCharts from 'v-charts'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { locale })
Vue.use(VCharts)

Vue.config.productionTip = false


let instance = null

function render(props = {}) {
  const { container } = props
  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app')
}
if(window.__POWERED_BY_QIANKUN__){
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
if(!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {}
export async function mount(props) {
  render(props)
  props.onGlobalStateChange((state) => {
    const menus = state.vueMenu || []
    store.dispatch('GenerateRoutes', { menus }).then(() => { // 生成可访问的路由表
      router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
    })
  })
}

export async function unmount() {
  instance.$destroy()
}

