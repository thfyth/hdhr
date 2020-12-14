const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'laborContract',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '合同信息' }
    }
  ]
}
export default router
