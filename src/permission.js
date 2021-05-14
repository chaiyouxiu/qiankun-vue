import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import actions from '@/shared/actions'
const whiteList = ['/login'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start()
  // token存在
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // token存在
      if (store.getters.roles.length === 0) {
          // 根据用户信息获取权限
          store.dispatch('GetInfo').then(res => {
            // let menus= res.data.menus
            let menus= []
            let username= res.data.username
            // 生成可访问的路由表
            store.dispatch('GenerateRoutes', { menus,username }).then(() => {
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters);
              next({ ...to, replace: true })
            })
          }).catch((err) => {
            store.dispatch('FedLogOut').then(() => {
              Message.error(err || 'Verification failed, please login again')
              next({ path: '/' })
            })
          })
        } else {
          next()
        }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
