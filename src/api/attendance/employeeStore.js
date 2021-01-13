import {post,get,put,deletefn} from '@/utils/request';
// 员工考勤管理

// 查询员工考勤列表
export function selectAttend(data) {
    return post('employee/attend/selectAll',data);
}
// 新增员工考勤
export function addAttend(data) {
    return post('employee/attend/insert',data);
}
// 批量删除考勤
export function delAttend(data) {
    return deletefn('employee/attend/delete',data);
}
// 通过员工id查询考勤列表
export function selectByIdAttend(data) {
    return get('employee/attend/selectByEmployeeId',data);
}
// 更新员工考勤
export function updataAttend(data) {
    return put('employee/attend/update',data);
}

// 获取上个月的考勤数据
export function getAttendRecord(data) {
    return get('ding/getAttendanceListrecord',data);
}