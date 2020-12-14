const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'postManage',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '职位管理' }
    }
  ]
}
export default router
