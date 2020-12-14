const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'addEmployees',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '增加员工' }
    }
  ]
}
export default router
