import {post,get} from '@/utils/request';

// 查询异常日志
export function findErrorLog(data) {
    return post('log/findErrorLog',data);
}
// 查询正常日志
export function findNormalLog(data) {
    return post('log/findNormalLog',data);
}

// 查询模块名称
export function findMouel(data) {
    return get('log/findMouel',data);
}

// 查询操作类型
export function findOperType(data) {
    return get('log/findOperType',data);
}

