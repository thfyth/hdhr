// 员工管理
import {post,get,put,deletefn,down} from '@/utils/request';

// 批量删除员工
export function delOneEmployees(data) {
    return deletefn('employee/delete',data);
}
// 新增员工信息
export function addOneEmployees(data) {
    return post('employee/insert',data);
}
// 批量导入员工信息
export function importEmployees(data) {
    return post('employee/insert/batch',data);
}
//更新员工信息
export function updateEmployees(data) {
    return put('employee/update',data);
}
//通过id查询员工信息
export function getIdEmployees(data) {
    return get('employee/'+data);
}
//分页查询员工列表
export function getEmployeesList(data) {
    return post('employee/selectAll',data);
}
// //导出员工信息模板
// export function exportEmployeesModel() {
//     return down('employee/exportTemplate');
// }


// //导出员工信息
// export function exportTemplates(data) {
//     return down('employee/exportTemplates',data);
// }
export function test(){
    return get('employee/exportTemplate');
}

// 获取组织列表
export function getOrg(data) {
    return get('employee/selectOrg',data);
}
// 获取岗位列表
export function getPost(data) {
    return get('employee/selectPost',data);
}
// 获取职级列表
export function getRank(data) {
    return get('employee/selectRank',data);
}


// 新增教育经历
export function addEdu(data) {
    return post('employee/edu/insert',data);
}
// 批量删除教育经历
export function delEdu(data) {
    return deletefn('employee/edu/delete',data);
}

//更新教育经历
export function updateEdu(data) {
    return put('employee/edu/update',data);
}


//通过员工id查询教育经历
export function getEdu(data) {
    return get('employee/edu/selectByEmployeeId',data);
}

// 新增工作经历
export function addJob(data) {
    return post('employee/job/insert',data);
}
// 批量删除工作经历
export function delJob(data) {
    return deletefn('employee/job/delete',data);
}

//更新工作经历
export function updateJob(data) {
    return put('employee/job/update',data);
}


//通过员工id查询工作经历
export function getJob(data) {
    return get('employee/job/selectByEmployeeId',data);
}

// 新增家庭信息
export function addFamily(data) {
    return post('employee/family/insert',data);
}
// 批量删除家庭信息
export function delFamily(data) {
    return deletefn('employee/family/delete',data);
}
//更新家庭信息
export function updateFamily(data) {
    return put('employee/family/update',data);
}
//通过员工id查询家庭信息
export function getFamily(data) {
    return get('employee/family/selectByEmployeeId',data);
}



// 新增职称
export function addTitle(data) {
    return post('employee/title/insert',data);
}
// 批量删除职称
export function delTitle(data) {
    return deletefn('employee/title/delete',data);
}
//更新职称
export function updateTitle(data) {
    return put('employee/title/update',data);
}
// 通过员工id查询职称
export function getTitle(data) {
    return get('employee/title/selectByEmployeeId',data);
}




// 新增紧急联系人
export function addContact(data) {
    return post('employee/contact/insert',data);
}
// 批量删除紧急联系人
export function delContact(data) {
    return deletefn('employee/contact/delete',data);
}
//更新紧急联系人
export function updateContact(data) {
    return put('employee/contact/update',data);
}
//通过员工id查询紧急联系人
export function getContact(data) {
    return get('employee/contact/selectByEmployeeId',data);
}



// 新增员工证书
export function addCcie(data) {
    return post('employee/ccie/insert',data);
}
// 批量删除证书
export function delCcie(data) {
    return deletefn('employee/ccie/delete',data);
}
//更新员工证书
export function updateCcie(data) {
    return put('employee/ccie/update',data);
}
//通过员工id查询证书
export function getCcie(data) {
    return get('employee/ccie/selectByEmployeeId',data);
}



// 新增培训经历
export function addTrain(data) {
    return post('employee/train/insert',data);
}
// 批量删除培训经历
export function delTrain(data) {
    return deletefn('employee/train/delete',data);
}
//更新培训经历
export function updateTrain(data) {
    return put('employee/train/update',data);
}
//通过员工id查询培训经历
export function getTrain(data) {
    return get('employee/train/selectByEmployeeId',data);
}



// 新增语言
export function addLanguage(data) {
    return post('employee/language/insert',data);
}
// 批量删除语言
export function delLanguage(data) {
    return deletefn('employee/language/delete',data);
}
//更新语言
export function updateLanguage(data) {
    return put('employee/language/update',data);
}
//通过员工id查询语言
export function getLanguage(data) {
    return get('employee/language/selectByEmployeeId',data);
}

//查询组织树
export function findOrgTree(data) {
    return get('employee/findOrgTree',data);
}


//员工惩罚记录



//批量删除惩罚记录
export function delPun(data) {
    return deletefn('employee/punishment/delete',data);
}
// 新增员工惩罚记录
export function addPun(data) {
    return post('employee/punishment/insert',data);
}
// 通过员工id查询惩罚记录
export function getOnePun(data) {
    return get('employee/punishment/selectByEmployeeId',data);
}
// 更新员工惩罚记录
export function updataPun(data) {
    return put('employee/punishment/update',data);
}


//批量删除奖励
export function delRew(data) {
    return deletefn('employee/reward/delete',data);
}
// 新增员工奖励
export function addRew(data) {
    return post('employee/reward/insert',data);
}
// 通过员工id查询奖励
export function getOneRew(data) {
    return get('employee/reward/selectByEmployeeId',data);
}
// 更新员工奖励
export function updataRew(data) {
    return put('employee/reward/update',data);
}


// 员工查询在职，离职人数
export function getTotal() {
    return get('employee/total');
}

//员工生日管理
export function getBirthday(data) {
    return get('employee/birthday/selectAll',data);
}


//刪除文件
export function delFiles(data) {
    return get('employee/file/delFiles',data);
}

//员工姓名
export function perNames(data) {
    return get('employee/names',data);
}


//查询员工个人社保公积金
export function getOneSocialFund(data) {
    return get('employee/socialFund/getOneSocialFund',data);
}
//查询个人考勤信息
export function getOneAttend(data) {
    return get('employee/attend/getOneAttend',data);
}

//获取个人文件
export function getUserFile(data) {
    return get('employee/file/getOneFiles',data);
}
//通过员工id查询员工合同
export function getUserContract(data) {
    return get('employee/contract/'+data);
}
//查询个人考勤信息
export function getAttendInfo(data) {
    return get('employee/attend/getAttendDetail',data);
}
//新增离职员工
export function addLeaveStaff(data) {
    return put('employee/leave/insert?empIdList='+data);
}



//员工文件导出

//导出员工所有信息
export function exportEmpAll(data) {
    return down('employee/excel/exportEmpAll',data);
}
//导出员工筛选信息
export function exportEmpFilter(data) {
    return down('employee/excel/exportEmpFilter',data);
}
//导入员工信息模板
export function exportExcelTemplate(data) {
    return post('employee/excel/exportTemplate',data);
}
//获取导出用到的字段名
export function getField() {
    return get('employee/excel/getField');
}
//批量导入员工信息
export function insertExcel(data) {
    return post('employee/excel/insert/batch',data);
}
