import {post,get,put,deletefn} from '@/utils/request';

// 消息管理


//删除消息
export function delMsg(data) {
    return deletefn('user/msg/delete',data);
}
//新增消息
export function addMsg(data) {
    return post('user/msg/insert',data);
}
//撤回钉钉消息
export function reCallDingMsgs(data) {
    return get('user/msg/reCallDingMsg',data);
}
//查询消息数量
export function getMsgNum(data) {
    return get('user/msg/selectCount',data);
}
//查询消息分类信息
export function getMsgClass(data) {
    return post('user/msg/selectMsgClass',data);
}
//查询消息详情
export function getMsgDetail(data) {
    return get('user/msg/selectMsgDetail',data);
}
//更新消息
export function updateMsg(data) {
    return put('user/msg/update',data);
}
//发送钉钉消息
export function sendDingMsgs(data) {
    return get('user/msg/sendDingMsg',data);
}
//通过消息Id查询回复
export function selectReply(data) {
    return get('user/reply/selectReply',data);
}
