const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'staffOneInfo',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '员工详细信息' }
    }
  ]
}
export default router