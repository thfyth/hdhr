import {post,get,put,deletefn} from '@/utils/request';
// 角色菜单关系管理
	// 批量删除角色菜单
export function delOneRoleMenu(data) {
    return deletefn('user/rolemenu/delete',data);
}
// 新增一个角色菜单关系
export function addOneRoleMenu(data) {
    return post('user/rolemenu/insert',data);
}
//更新一个角色菜单关系
export function updateRoleMenu(data) {
    return put('user/rolemenu/update',data);
}
//通过角色查询菜单关系
export function getRoleMenu(data) {
    return get('user/rolemenu/selectRoleMenu',data);
}
// 登录用户查询菜单关系
export function getLoginRoleMenu(data) {
    return get('user/rolemenu/selectUserMenu',data);
}


