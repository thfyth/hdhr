import {  put,post,deletefn } from '@/utils/request';


//提醒模板




//新增一个提醒模板
export function addRemindTemp(data) {
    return post('user/remindTemp/insert', data);
}
//批量删除提醒模板
export function delRemindTemp(data) {
    return deletefn('user/remindTemp/delete', data);
}
//分页查询提醒模板列表
export function getRemindTemp(data) {
    return post('user/remindTemp/selectAll', data);
}
//更新一个提醒模板
export function updataRemindTemp(data) {
    return put('user/remindTemp/update', data);
}
