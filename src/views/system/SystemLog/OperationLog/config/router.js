const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'operationLog',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '运行日志' }
    }
  ]
}
export default router
