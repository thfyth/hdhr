const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'personnelTurnover',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '人员异动' }
    }
  ]
}
export default router
