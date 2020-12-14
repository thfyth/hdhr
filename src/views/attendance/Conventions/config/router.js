const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'conventions',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '假期管理' }
    }
  ]
}
export default router
