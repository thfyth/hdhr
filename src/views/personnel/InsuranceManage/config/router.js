const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'insuranceManage',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '员工保险' }
    }
  ]
}
export default router
