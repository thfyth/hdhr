import {post,get,put,deletefn} from '@/utils/request';
//节假日

//删除节假日
export function delHoliday(data) {
    return deletefn('employee/holiday/delete',data);
}
//新增节假日
export function addHoliday(data) {
    return post('employee/holiday/insert',data);
}
//分页查询节假日列表
export function selectHoliday(data) {
    return post('employee/holiday/selectAll',data);
}
//更新节假日管理
export function updataHoliday(data) {
    return put('employee/holiday/update',data);
}