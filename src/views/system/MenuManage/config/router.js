const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'menuManage',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '菜单管理' }
    }
  ]
}
export default router
