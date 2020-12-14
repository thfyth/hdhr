import {post,get,put,deletefn} from '@/utils/request';

// 角色批量删除
export function delOneManRole(data) {
    return deletefn('user/role/delete',data);
}
// 新增一个角色
export function addOneManRole(data) {
    return post('user/role/insert',data);
}
//分页查询角色列表
export function getBayIdManRole(data) {
    return post('user/role/selectAll',data);
}
//更新一个角色
export function updateManRole(data) {
    return put('user/role/update',data);
}


// 角色组织关系管理
export function delOneRoleOrg(data) {
    // 批量删除组织关系
    return deletefn('user/roleorg/delete',data);
}

export function addRoleOrg(data) {
    // 新增一个角色组织关系
    return post('user/roleorg/insert',data);
}
export function getRoleOrg(data) {
    // 通过角色id查询组织列表
    return get('user/roleorg/selectByRoleId',data);
}
