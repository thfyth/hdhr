const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'customScheme',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '人事信息自定义方案' }
    }
  ]
}
export default router
