// 薪资管理
import {  get,put,post,deletefn } from '@/utils/request';
// 新增工资
export function addSalary(data){
    return post('employee/salary/insert',data)
}
// 查询工资列表
export function selectSalary(data){
    return post('employee/salary/selectAll',data)
}
// 修改工资
export function updataSalary(data){
    return put('employee/salary/update',data)
}
// 查询员工姓名
export function selectEmpName(data){
    return get('employee/salary/selectEmpName',data)
}