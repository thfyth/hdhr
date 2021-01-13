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