import {post,get,put,deletefn} from '@/utils/request';
//组织管理

// 组织批量删除
export function delOneManOrg(data) {
    return deletefn('user/org/delete',data);
}
// 新增一个组织
export function addOneManOrg(data) {
    return post('user/org/insert',data);
}
//分页查询组织列表
export function getBayIdManOrg(data) {
    return post('user/org/selectAll',data);
}
//更新一个组织
export function updateManOrg(data) {
    return put('user/org/update',data);
}
//通过id查询组织
export function getBayIdOrg(data) {
    return get('user/org/'+data);
}
//查看历史版本
export function getHistory(data) {
    return get('user/org/select/version',data);
}