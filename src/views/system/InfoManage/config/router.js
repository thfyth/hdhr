const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'infoManage',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '消息管理' }
    }
  ]
}
export default router
