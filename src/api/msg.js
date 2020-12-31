import {post,put,get} from '@/utils/request';
// 查询消息数量
export function getMsgCount(data) {
    return get('user/msg/selectCount',data);
}

//查询消息
export function getMsgList(data) {
    return post('user/msg/selectMsgClass',data);
}
//更新消息
export function updataMsg(data) {
    return put('user/msg/update',data);
}
//更新消息
export function updataMsgType(data) {
    return get('user/reply/readInfo',data);
}
