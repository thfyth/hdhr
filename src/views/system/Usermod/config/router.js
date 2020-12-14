const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'userManage',
      component: resolve => require(['../index.vue'], resolve),
      // component: () => import(/* webpackChunkName: "system" */'../index.vue'),
      meta: { title: '用户管理' }
    }
  ]
}
export default router
