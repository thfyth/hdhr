import {post,get,put,deletefn} from '@/utils/request';
// 职级管理

// 删除职级
export function delOneRank(data) {
    return deletefn('user/rank/delete',data);
}
// 新增职级
export function addOneRank(data) {
    return post('user/rank/insert',data);
}
//修改职级
export function updateRank(data) {
    return put('user/rank/update',data);
}
//通过id查询职级
export function getIdRank(data) {
    return get('user/rank/'+data);
}
//分页查询职级列表
export function getRankInfo(data) {
    return post('user/rank/selectAll',data);
}
//查询组织和岗位
export function getOrgPostInfo(data) {
    return post('user/rank/selectOrgPost',data);
}
