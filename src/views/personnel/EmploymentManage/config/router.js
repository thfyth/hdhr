const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'employmentManage',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '转正管理' }
    }
  ]
}
export default router
