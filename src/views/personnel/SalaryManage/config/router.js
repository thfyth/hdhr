const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'salaryManage',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '新增管理' }
    }
  ]
}
export default router
