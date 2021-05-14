import { asyncRouterMap, constantRouterMap } from '@/router/index';
import Cookies from 'js-cookie'
/**
 * 
 * @param {*} menus 权限菜单
 * @returns 
 */

function handleMenuTree (menus) {
  const parentNodeList = menus.filter(item => {
    item.children = []
    return item.nodeId
  })
  menus.forEach(item => {
    item.meta = {title: item.label}
    if (item.parentId) {
      item.component = _import(item.component)
      const index = parentNodeList.findIndex(k => k.nodeId === item.parentId)
      parentNodeList[index].children.push(item)
    }
  })
  return parentNodeList
}

function _import (file) {
  return () => import('@/views/' + file + '.vue')
}
function getAccessedRouters(menus) {
  let accessedRouters = []
  if(window.__POWERED_BY_QIANKUN__){
    accessedRouters = handleMenuTree(menus)
  } else {
    accessedRouters = asyncRouterMap
    // .filter(v => {
    //   if (hasPermission(menus, v)) {
    //     if (v.children && v.children.length > 0) {
    //       v.children = v.children.filter(child => {
    //         if (hasPermission(menus, child)) {
    //           return child
    //         }
    //         return false
    //       });
    //       return v
    //     } else {
    //       return v
    //     }
    //   }
    //   return false
    // })
  }
  return accessedRouters
}
//判断是否有权限访问该菜单
function hasPermission(menus, route) {
  if (route.name) {
    let currMenu = getMenu(route.name, menus);
    if (currMenu!=null) {
      //设置菜单的标题、图标和可见性
      if (currMenu.title != null && currMenu.title !== '') {
        route.meta.title = currMenu.title;
      }
      if (currMenu.icon != null && currMenu.title !== '') {
        route.meta.icon = currMenu.icon;
      }
      if(currMenu.hidden!=null){
        route.hidden = currMenu.hidden !== 0;
      }
      if (currMenu.sort != null && currMenu.sort !== '') {
        route.sort = currMenu.sort;
      }
      return true;
    } else {
      route.sort = 0;
      if (route.hidden !== undefined && route.hidden === true) {
        route.sort=-1;
        return true;
      } else {
        return false;
      }
    }
  } else {
    return true
  }
}

//根据路由名称获取菜单
function getMenu(name, menus) {
  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i];
    if (name===menu.name) {
      return menu;
    }
  }
  return null;
}

//对菜单进行排序
function sortRouters(accessedRouters) {
  for (let i = 0; i < accessedRouters.length; i++) {
    let router = accessedRouters[i];
    if(router.children && router.children.length > 0){
      router.children.sort(compare("sort"));
    }
  }
  accessedRouters.sort(compare("sort"));
}

//降序比较函数
function compare(p){
  return function(m,n){
    let a = m[p];
    let b = n[p];
    return b - a;
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    // data中返回权限菜单
    /**
     * 
     * @param {*} param0 
     * @param {*} data 登录用户所拥有的权限菜单
     * @returns 
     */
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { menus } = data;
        const { username } = data;
        // 所有权限菜单, admin帐号直接返回所有菜单
        const accessedRouters = getAccessedRouters(menus)
        //对菜单进行排序
        sortRouters(accessedRouters);
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
  }
};

export default permission;

