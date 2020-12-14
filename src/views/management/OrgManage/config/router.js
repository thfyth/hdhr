const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'orgManage',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '组织管理' }
    }
  ]
}
export default router
