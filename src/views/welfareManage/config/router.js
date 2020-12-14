const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'welfareManage',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '福利管理' }
    }
  ]
}
export default router
