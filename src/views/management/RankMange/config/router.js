const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'rankMange',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '职级管理' }
    }
  ]
}
export default router
