const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'employeeStore',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '员工考勤信息' }
    }
  ]
}
export default router
