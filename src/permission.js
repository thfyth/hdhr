/* eslint-disable space-before-function-paren */
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          await store.dispatch('user/getInfo')
          await store.dispatch('user/getMenu')
         
          //设置带按钮的菜单 //主要为了tags正常显示，
          store.dispatch('permission/GenerateRoutes', store.getters.menus);
           //设置不带按钮的菜单
          store.dispatch('permission/GenerateNoBtnRoutes', store.getters.noBtnMenuList).then(res => {
            if (res.length > 0) {
              router.addRoutes(res) // 动态添加可访问路由表
            }
            next({ ...to, replace: true })
          })
        } catch (error) {
          // console.log("出错");
          await store.dispatch('user/resetToken')
          // Message.error(error || '网络错误')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
