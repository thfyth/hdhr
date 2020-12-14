import {post,get,put,deletefn} from '@/utils/request';

// 分页查询用户列表
export function getPerson(data) {
  return post('user/selectAll',data);
}
//通过id查询用户
export function getBayIdPerson(data) {
  return get('user/'+data);
}
//更新一个用户
export function updatePerson(data) {
  return put('user/update',data);
}
//更新用户密码
export function updatePassword(data) {
  return put('user/update/Password',data);
}

// 新增一用户
export function addOnePerson(data) {
  return post('user/insert',data);
}
// 删除一用户
export function delOnePerson(data) {
  return deletefn('user/delete',data);
}
// 重置密码
export function resetPwd(data) {
  return put('user/reset?idList='+data);
}
// 判断是否需要修改密码
export function isModPassword() {
  return get('user/isModPassword');
}
// 角色关系管理

// 角色关系删除
export function delOneRole(data) {
  return deletefn('user/userrole/delete',data);
}
// 新增一个角色关系
export function addOneRole(data) {
  return post('user/userrole/insert',data);
}
//通过用户查询角色关系
export function getBayIdRole(data) {
  return get('user/userrole/selectAll',data);
}
//更新一个角色关系
export function updateRole(data) {
  return put('user/userrole/update',data);
}

//分页查询角色列表
export function getBayManRole(data) {
  return post('user/role/selectAll',data);
}


export function getRouters(){
  return get('user/rolemenu/selectUserMenu');
}


// 不要参数查询所有下拉框
export function selectAllDrop(){
  return get('user/valueAttr/selectDrop');
}