const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'roleManager',
      // component: resolve => require(['../index.vue'], resolve),
      component: () => import(/* webpackChunkName: "system" */'../index.vue'),
      meta: { title: '角色管理' }
    }
  ]
}
export default router
