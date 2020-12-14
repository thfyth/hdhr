import {post,get} from '@/utils/request';

//登陆
export function login(data){
	return post('/user/login',data);
}
//登出
export function outLogin(data){
	return get('/user/logout',data);
}