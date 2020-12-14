const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'systemSettings',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '系统设置' }
    }
  ]
}
export default router
