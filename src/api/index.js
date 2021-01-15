import {post,get} from '@/utils/request';

// 获取报表信息
export function getReport(data){
    return get('employee/index/getReport',data)
}
// 获取首页数量
export function getIndexCount(data){
    return get('employee/index/getIndexCount',data)
}
// 获取系统消息
export function getLocalMsg(data){
    return get('user/msg/getLocalMsg',data)
}
