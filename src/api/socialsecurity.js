import { get, put,post } from '@/utils/request';

//通过id查询单条员工社保公积金
export function getBayIdSocia(data) {
    return get('employee/socialFund/' + data);
}
//查询所有员工社保公积金列表
export function getSocia(data) {
    return post('employee/socialFund/selectAll', data);
}
//更新员工社保公积金
export function updateSocia(data) {
    return put('employee/socialFund/update', data);
}