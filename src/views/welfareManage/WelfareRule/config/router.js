const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'welfareRule',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '福利规则' }
    }
  ]
}
export default router
