const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'staffManage',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '在职员工信息' }
    }
  ]
}
export default router