const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'leaveManage',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '离职管理' }
    }
  ]
}
export default router
