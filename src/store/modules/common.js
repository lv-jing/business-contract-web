/* eslint-disable */
const commonModules = {
    state: {
        height: 0,
        userInfo: {},
        menuList: [],
        dictMap:{} // 字典集合
    },
    mutations: {
        mutationsHeight(state, height) {
            state.height = height
        },
        mutationsUserInfo(state, info) {
            state.userInfo = info
        },
        mutationsMenuList(state, info) {

          state.menuList = [
              {
                name: 'home',
                title: '首页'
              },
              ...info
            ]
        },
        mutationsdictMap(state, info){
            let Name=info.type
            state.dictMap[Name]=info.data
        }
    },
    getters: {
        getUserInfo(state) {
            return state.userInfo;
        },
        getUserMenuList(state) {
            return state.userInfo;
        },
    },
    actions: {
        setHeight({commit}, height) {
            commit('mutationsHeight', height)
        },
        setUserInfo({commit}, info) {
            commit('mutationsUserInfo', info)
        },
        setMenuList({commit}, info) {
            commit('mutationsMenuList', info)
        },
        setdictMap({commit},info){
            commit('mutationsdictMap',info)
        }
    }
}
export default commonModules
