// 岗位管理
import {post,get,put,deletefn} from '@/utils/request';
// 删除岗位
export function delOnePost(data) {
    return deletefn('user/post/delete',data);
}
// 新增岗位
export function addOnePost(data) {
    return post('user/post/insert',data);
}
//修改岗位
export function updatePost(data) {
    return put('user/post/update',data);
}
//通过id查询岗位
export function getIdPost(data) {
    return get('user/post/'+data);
}
//分页查询岗位列表
export function getPostInfo(data) {
    return post('user/post/selectAll',data);
}

