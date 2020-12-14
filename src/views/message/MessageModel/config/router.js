const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'messageModel',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '信息提醒模板' }
    }
  ]
}
export default router
