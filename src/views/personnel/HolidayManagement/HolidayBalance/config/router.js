const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'holidayBalance',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '假期余额' }
    }
  ]
}
export default router
