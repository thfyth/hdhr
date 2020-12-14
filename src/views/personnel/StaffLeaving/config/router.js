const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'staffLeaving',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '离职员工信息' }
    }
  ]
}
export default router