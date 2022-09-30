/*
 * @Descripttion: 
 * @version: 
 * @Date: 2021-11-17 19:09:53
 * @LastEditTime: 2022-04-15 15:42:08
 */
import { createStore } from 'vuex';

const store = createStore({
  state: {
    userInfo: {
      userName: '',
      role: '',
      avatar: 'init',
      isOutreach:'',
    },
    lnglat: {
      longitude: 0,
      latitude: 0,
    },
    //地图是否显示
    showMap:false,
    powerCode:'', 
    perms:'',//任务管理是否显示启动/停止按钮权限
  },
  mutations: {
    SET_USER_INFO(state, val) {
      state.userInfo = val;
    },
    SET_LNGLAT(state, val) {
      state.lnglat = val;
    },
    SET_SHOW(state,val){
      state.showMap=val
    },
    SET_Power_Code(state,val){
      state.powerCode=val
    },
    SET_PERMS(state,val){
      state.perms=val
    },
  },
  getters: {},
  actions: {},
});

export default store;
