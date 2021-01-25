import {post,get,put,deletefn} from '@/utils/request';

// 查询请假记录
export function selectHoliday(data){
    return post('user/leaverecord/selectRecordList',data)
}
// 查询请假类型列表
export function selectLeaveTypeList(data){
    return post('user/leavetype/selectLeaveTypeList',data)
}
// 查询假期余额
export function selectQuotasList(data){
    return post('user/leavequotas/selectQuotasList',data)
}


//更新请假记录
export function getRecordList(data) {
    return get('ding/holidays/getRecordList',data);
}
//更新假期消费余额
export function getQuotasList(data) {
    return get('ding/holidays/getQuotasList',data);
}
//更新假期类型
export function getHolidaysType(data) {
    return get('ding/holidays/getHolidaysType',data);
}
