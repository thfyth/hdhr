import { getRouters } from '@/api/user'
import { login, outLogin } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { getMsgCount } from "@/api/msg";
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    menuList: [],
    roleIdStr: '',
    count:'',
    errMsg:null,
    noBtnMenuList:[]
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MENU_LIST: (state, menuList) => {
    state.menuList = menuList
  },
  SET_ROLE_STR: (state, roleIdStr) => {
    state.roleIdStr = roleIdStr
  },
  SET_MESSAGE_COUNT: (state, count) => {
    state.count = count
  },
  SET_USER_STAUS:(state, staus) => {
    state.staus = staus
  },
  SET_USER_ERRMSG:(state, msg) => {
    state.errMsg = msg
  },
  SET_NOBTN_ROUTE:(state,menu)=>{
    state.noBtnMenuList = menu
  }
}

const actions = {
  // 登陆
  login({ commit }, userInfo) {
    const { userName } = userInfo;
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data } = response;
        commit('SET_TOKEN', data.token);
        commit('SET_NAME', userName);
        localStorage.setItem('hd_hr_name', userName);
        setToken(data.token);
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {

      const name = localStorage.getItem('hd_hr_name');
      const data = {
        name
      }
      commit('SET_NAME', name)
      resolve(data)
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      outLogin().then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // get menu
  getMenu({ commit }) {
    return new Promise((resolve, reject) => {
      getRouters().then(response => {
        const { data,notBtnMenu } = response
        commit('SET_MENU_LIST', getFirst(data))
        commit('SET_ROLE_STR', getRoleId(data))
         //设置不含按钮的菜单
        commit('SET_NOBTN_ROUTE',getFirst(notBtnMenu))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  setMsgCount({ commit },data){
    commit('SET_MESSAGE_COUNT', data)
  },
  setUserStaus({ commit },data){
    commit('SET_USER_STAUS', data)
  },
  setErrMsg({ commit },data){
    commit('SET_USER_ERRMSG', data)
  },
}

function getFirst(obj) {		//obj为我们的对象
  for (var key in obj) {
    return obj[key];
  }
}
function getRoleId(obj) {		//obj为我们的对象
  let str = '';
  for (var key in obj) {
    str += key+",";
  }
  return str;
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

