const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  routes: state => state.permission.routes,
  buttons: state => state.permission.buttons,
  menus: state => state.user.menuList,
  //获取角色id
  roleIdStr:state=>state.user.roleIdStr,
  //消息提醒数量
  count:state=>state.user.count,
  staus:state=>state.user.staus,
  errMsg:state=>state.user.errMsg,
  
}
export default getters
