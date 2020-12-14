import {post,get,put,deletefn} from '@/utils/request';

// 数据字典管理


//通过id查询数据字典
export function getBayIdValueSet(data) {
    return get('user/valueSet/'+data);
}
//批量删除数据字典
export function delValueSet(data) {
    return deletefn('user/valueSet/delete',data);
}
//新增数据字典
export function addValueSet(data) {
    return post('user/valueSet/insert',data);
}
//分页查询数据字典列表
export function getValueSet(data) {
    return post('user/valueSet/selectAll',data);
}
//更新数据字典数据
export function updataValueSet(data) {
    return put('user/valueSet/update',data);
}



// 数据字典属性管理

//批量删除数据字典属性值
export function delvalueAttr(data) {
    return deletefn('user/valueAttr/delete',data);
}
//新增数据字典属性
export function addvalueAttr(data) {
    return post('user/valueAttr/insert',data);
}
//通过数据字典id查询属性列表
export function getBayIdvalueAttr(data) {
    return get('user/valueAttr/selectAll',data);
}
//更新数据字典属性
export function updatavalueAttr(data) {
    return put('user/valueAttr/update',data);
}
