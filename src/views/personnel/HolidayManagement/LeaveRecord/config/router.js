const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'leaveRecord',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '请假记录' }
    }
  ]
}
export default router
