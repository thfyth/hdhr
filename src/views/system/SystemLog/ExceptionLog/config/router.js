const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'exceptionLog',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '异常日志' }
    }
  ]
}
export default router
