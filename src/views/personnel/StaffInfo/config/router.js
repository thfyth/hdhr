const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'staffInfo',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '员工信息管理' }
    }
  ]
}
export default router