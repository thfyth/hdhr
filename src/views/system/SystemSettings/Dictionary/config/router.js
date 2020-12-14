const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'dictionary',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '字典设置' }
    }
  ]
}
export default router
