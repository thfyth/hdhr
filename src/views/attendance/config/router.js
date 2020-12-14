const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'attendance',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '考勤' }
    }
  ]
}
export default router
