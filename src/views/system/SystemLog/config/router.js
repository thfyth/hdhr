const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'systemLog',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '系统日志' }
    }
  ]
}
export default router
