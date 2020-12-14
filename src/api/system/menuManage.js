import {post,get,put,deletefn} from '@/utils/request';

// 菜单批量删除
export function delOneManMenu(data) {
    return deletefn('user/menu/delete',data);
}
// 新增一个菜单
export function addOneManMenu(data) {
    return post('user/menu/insert',data);
}
//分页查询菜单列表
export function getBayIdManMenu(data) {
    return post('user/menu/selectAll',data);
}
//更新一个菜单
export function updateManMenu(data) {
    return put('user/menu/update',data);
}
//通过id查询菜单
export function getBayIdMenu(data) {
    return get('user/menu/'+data);
}