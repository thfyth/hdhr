import { put, post, deletefn } from '@/utils/request';


//提醒模板设置


//新增一个提醒设置
export function addRemindSet(data) {
    return post('user/remindSet/insert', data);
}
//批量删除提醒设置
export function delRemindSet(data) {
    return deletefn('user/remindSet/delete', data);
}
//分页查询提醒设置列表
export function getRemindSet(data) {
    return post('user/remindSet/selectAll', data);
}
//更新一个提醒设置
export function updataRemindSet(data) {
    return put('user/remindSet/update', data);
}
