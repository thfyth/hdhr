const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'addTemp',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '增加合同模板' }
    }
  ]
}
export default router
