import {post,get,put,deletefn} from '@/utils/request';

//通过id查询员工合同
export function getContract(data) {
    return get('employee/contract/'+data);
}

//删除合同
export function delContract(data) {
    return deletefn('employee/contract/delete',data);
}
//新增合同
export function addContract(data) {
    return post('employee/contract/insert',data);
}
//查询所有合同
export function contractSelect(data) {
    return post('employee/contract/selectAll',data);
}
//合同总数
export function contractTotal(data) {
    return get('employee/contract/total',data);
}
//更新合同
export function updateContract(data) {
    return put('employee/contract/update',data);
}
//通过合同编码查询合同信息
export function selectCodeContract(data) {
    return get('employee/contract/selectCode/'+data);
}


//查询合同模板列表
export function findTemp(data) {
    return post('employee/contracttemp/findAll',data);
}

//查询合同模板详细信息
export function findDetaTemp(data) {
    return get('employee/contracttemp/findDetail',data);
}
//新增合同模板
export function addTemp(data) {
    return post('employee/contracttemp/insert',data);
}
//修改合同模板
export function updataTemp(data) {
    return post('employee/contracttemp/update',data);
}

//查看合同pdf文件
export function viewTemp(data) {
    return get('employee/contract/previewPdf',data);
}
