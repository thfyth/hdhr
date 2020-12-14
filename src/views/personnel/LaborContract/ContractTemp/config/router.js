const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'contractTemp',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '合同模板' }
    }
  ]
}
export default router
