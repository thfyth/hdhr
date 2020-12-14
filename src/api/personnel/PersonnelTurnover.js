import {  get,put,post,deletefn } from '@/utils/request';


//查询人员异动
export function getChange(data) {
    return post('employee/change/selectAll', data);
}

// 新增人员异动信息
export function addChange(data) {
    return post('employee/change/insert', data);
}

// 删除人员异动信息
export function delChange(data) {
    return get('employee/change/delete', data);
}
// 查询人员详细异动信息
export function detailChange(data) {
    return get('employee/change/selectDetail', data);
}
// 通过id查询员工相关信息
export function empChange(data) {
    return get('employee/change/selectEmp', data);
}
// 修改人员异动信息
export function updataChange(data) {
    return post('employee/change/update', data);
}
