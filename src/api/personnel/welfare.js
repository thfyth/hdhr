"use strict";
// 福利管理

import {post,get,put,deletefn} from '@/utils/request';

// 批量删除福利管理
export function delWelfare(data) {
    return deletefn('user/welfare/delete',data);
}
// 新增福利管理
export function addWelfare(data) {
    return post('user/welfare/insert',data);
}
// 分页查询福利列表
export function selectWelfare(data) {
    return post('user/welfare/selectAll',data);
}
// 更新福利管理
export function updataWelfare(data) {
    return put('user/welfare/update',data);
}