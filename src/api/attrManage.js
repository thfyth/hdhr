// 数据字典属性管理
import {post,get,put,deletefn} from '@/utils/request';
// 批量删除数据字典属性值
export function delOneAttrMenu(data) {
    return deletefn('user/valueAttr/delete',data);
}
// 新增数据字典属性
export function addOneAttrMenu(data) {
    return post('user/valueAttr/insert',data);
}
//更新数据字典属性
export function updateAttrMenu(data) {
    return put('user/valueAttr/update',data);
}
//通过数据字典ValueCode查询属性值下拉框
export function getAttrMenu(data) {
    return get('user/valueAttr/selectDrop',data);
}
//通过数据字典id查询属性列表
export function getAttrIdMenu(data) {
    return get('user/valueAttr/selectAll',data);
}