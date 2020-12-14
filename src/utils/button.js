//判断用户是否拥有按钮

import store from '@/store';

const buttons = store.getters.buttons;

export function isButtons(data){
    let isbuttos = buttons.some(v => {
        if(v == data){
            return true;
        }else{
            return false;
        }
    });
    return isbuttos;
}