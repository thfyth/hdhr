const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'tempInfo',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '模板信息' }
    }
  ]
}
export default router
