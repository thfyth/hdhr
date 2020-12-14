const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'contractInfo',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '合同信息' }
    }
  ]
}
export default router
