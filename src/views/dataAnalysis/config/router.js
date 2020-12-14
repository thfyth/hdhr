const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'dataAnalysis',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '数据分析' }
    }
  ]
}
export default router
