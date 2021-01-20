import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
Vue.use(Router)
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */'@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '工作台', icon: 'el-icon-home', affix: true }
      }
    ]
  },{
    path: '/bigScreen',
    component: Layout,
    children: [
      {
        path: '/bigScreen',
        component: () => import(/* webpackChunkName: "dashboard" */'@/views/bigScreen/index'),
        name: 'bigScreen',
        meta: { title: '大屏', icon: 'el-icon-home', affix: true }
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        name: 'redirect',
        meta: { noCache: true },
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/adminAddInfo',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/adminAddInfo',
        name: 'adminAdd',
        meta: { noCache: true },
        component: () => import(/* webpackChunkName: "adminAddInfo" */'@/views/system/AdminAddInfo'),
        // component: () => import('@/views/system/AdminAddInfo')
      }
    ]
  },
  {
    path: '/login',
    // component: () => import('@/views/login/index'),
    component: () => import(/* webpackChunkName: "login" */'@/views/login/index'),
    hidden: true
  },
  {
    path: '/messageList',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/messageList',
        name: "messageList",
        meta: { title: "信息列表" },
        component: () => import(/* webpackChunkName: "messageList" */'@/views/message/MessageList/index'),
        // component: r => require.ensure([], () => r(require('@/views/message/MessageList/index')), 'messageList')
      }
    ]
  },
  // {
  //   path: '/404',
  //   component: () => import('@/views/404'),
  //   hidden: true
  // },
  {
    path: '/404',
    component: Layout,
    hidden: true,
    redirect: '/404',
    children: [
      {
        path: '/404',
        name: 'redirect',
        meta: { noCache: true, title: '404' },
        component: () => import('@/views/404'),
      }
    ]
  },
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}