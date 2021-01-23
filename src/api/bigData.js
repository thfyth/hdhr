import {post,get} from '@/utils/request';

// 公司社保与公积金参与数
export function getCompanySocialFund(data){
    return get('screen/getCompanySocialFund',data)
}
// 获取员工基本信息
export function getEmpBasicInfo(data){
    return get('screen/getEmpBasicInfo',data)
}
// 获取全国人数分布
export function getEmpMapData(data){
    return get('screen/getEmpMapData',data)
}
// 近五年社保和公积金人数对比
export function getSocialFundCount(data){
    return get('screen/getSocialFundCount',data)
}
// 近六年招聘渠道人数对比
export function getEmpSource(data){
    return get('screen/getEmpSource',data)
}