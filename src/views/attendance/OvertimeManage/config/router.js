const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'overtimeManage',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '加班调休管理' }
    }
  ]
}
export default router
