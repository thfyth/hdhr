const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'security',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '员工社保' }
    }
  ]
}
export default router
