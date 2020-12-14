const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'messageList',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '提醒列表' }
    }
  ]
}
export default router
