const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'fundamentally',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '社保报表' }
    }
  ]
}
export default router
