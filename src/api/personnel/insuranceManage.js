// 保险管理
import {  get,put,post,deletefn } from '@/utils/request';
// 新增保险
export function addInsure(data){
    return post('employee/insure/insert',data)
}
// 查询保险列表
export function selectInsure(data){
    return post('employee/insure/selectAll',data)
}
// 修改保险
export function updataInsure(data){
    return put('employee/insure/update',data)
}