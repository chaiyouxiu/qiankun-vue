import Cookies from 'js-cookie'

const menu = {
  state: {
    menuList: []
  },
  mutations: {
    setMenuList (state, menuList) {
      state.menuList = menuList
    }
  },
  actions: {
  },
  getters: {
    getMenuList: state => {
      return state.menuList
    }
  }
}

export default menu
