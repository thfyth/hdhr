const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'contractManage',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '合同管理' }
    }
  ]
}
export default router
