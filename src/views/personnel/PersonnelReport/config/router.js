const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'personnelReport',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '人事报表' }
    }
  ]
}
export default router
