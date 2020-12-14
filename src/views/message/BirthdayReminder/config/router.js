const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'birthdayReminder',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '员工生日提醒' }
    }
  ]
}
export default router
