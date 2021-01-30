import {
  constantRoutes
} from '@/router'
import {
  GeneratorDynamicRouter
} from '@/router/dynamic-router'

const state = {
  routes: [],
  addRoutes: [],
  buttons:[]
}
const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.addRoutes = routers
    state.routes = constantRoutes.concat(routers)
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  },
  
}
const actions = {
  GenerateRoutes({
    commit
  }, data) {
    return new Promise((resolve, reject) => {
      GeneratorDynamicRouter(data).then(res => {
        const buttons = getButtons(res);
        // commit('SET_ROUTERS', res);
        commit('SET_BUTTONS', buttons);
        resolve(res);
      }).catch(err => {
        reject(err)
      })
    })
  },
  GenerateNoBtnRoutes({
    commit
  }, data) {
    return new Promise((resolve, reject) => {
      GeneratorDynamicRouter(data).then(res => {
        // const buttons = getButtons(res);
        commit('SET_ROUTERS', res);
        // commit('SET_BUTTONS', buttons);
        resolve(res);
      }).catch(err => {
        reject(err)
      })
    })
  }
}

//遍历，找出按钮
function getButtons(data){
  let arr = [];
      const getStr = function (list) {
        if (list.length) {
          list.forEach(function (row) {
            if (row.children) {
              if (row.menuType === 2) {
                arr.push(row.name);
              }
              getStr(row.children);
            } else {
              if (row.menuType === 2) {
                arr.push(row.name);
              }
            }
          });
        }
      };
      getStr(data);
      return arr;
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
