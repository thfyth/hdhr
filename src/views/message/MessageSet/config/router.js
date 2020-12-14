const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'messageSet',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '提醒设置' }
    }
  ]
}
export default router
