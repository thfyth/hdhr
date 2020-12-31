
// 用户角色关系

import {post,get,put,deletefn} from '@/utils/request';
// 批量删除用户角色关系
export function delOneUserRole(data) {
    return deletefn('user/userrole/delete',data);
}
// 新增一个角色关系
export function addOneUserRole(data) {
    return post('user/userrole/insert',data);
}
//更新一个角色关系
export function updateUserRole(data) {
    return put('user/userrole/update',data);
}
//通过用户查询角色关系
export function getByUserRole(data) {
    return get('user/userrole/selectAll',data);
}
//查询当前用户角色关系
export function getUserRole(data) {
    return get('user/userrole/select/bytoken',data);
}
//获取组织用户的树形结构
export function getUserWithTree(data) {
    return get('user/userrole/getOrgUserWithTree',data);
}

