<template>
  <scroll-bar>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
// import actions from "@/shared/actions"

export default {
  data () {
    return {
      menuList: this.routes
    }
  },
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'sidebar',
      'routers'
    ]),
    routes() {
      return this.routers
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    permission() {
      return this.$store.getters.getMenuList
    }
  },
  watch: {
  },
  methods: {
    kk () {
      /** 修改全局对象window方法 */
      const setWindowProp = (prop, value, isDel)=>{
        if (value === undefined || isDel) {
          delete window[prop]
        } else {
          window[prop] = value
        }
      }

      class Sandbox {
        name;
        proxy = null;
        /** 沙箱期间新增的全局变量 */
        addedPropsMap = new Map();

        /** 沙箱期间更新的全局变量 */
        modifiedPropsOriginalValueMap = new Map();
    
        /** 持续记录更新的(新增和修改的)全局变量的 map，用于在任意时刻做沙箱激活 */
        currentUpdatedPropsValueMap = new Map();

        /** 应用沙箱被激活 */
        active() {
          // 根据之前修改的记录重新修改window的属性，即还原沙箱之前的状态
          this.currentUpdatedPropsValueMap.forEach((v, p) => setWindowProp(p, v));
        }
        
        /** 应用沙箱被卸载 */
        inactive() {
          // 1 将沙箱期间修改的属性还原为原先的属性
          this.modifiedPropsOriginalValueMap.forEach((v, p) => setWindowProp(p, v));
          // 2 将沙箱期间新增的全局变量消除
          this.addedPropsMap.forEach((_, p) => setWindowProp(p, undefined, true));
        }
      
        constructor(name) {
          this.name = name;
          const fakeWindow = Object.create(null);
          const { addedPropsMap, modifiedPropsOriginalValueMap, currentUpdatedPropsValueMap } = this;
          const proxy = new Proxy(fakeWindow, {
            set(_, prop, value) {
                if(!window.hasOwnProperty(prop)){
                  // 如果window上没有的属性，记录到新增属性里
                  addedPropsMap.set(prop, value);
                }else if(!modifiedPropsOriginalValueMap.has(prop)){
                  // 如果当前window对象有该属性，且未更新过，则记录该属性在window上的初始值
                  const originalValue = window[prop];
                  modifiedPropsOriginalValueMap.set(prop,originalValue);
                }
                // 记录修改属性以及修改后的值
                currentUpdatedPropsValueMap.set(prop, value);
                // 设置值到全局window上
                setWindowProp(prop,value);
                console.log('window.prop',window[prop])
                return true;
            },
            get(target, prop) {
              return window[prop];
            },
          });
          this.proxy = proxy;
        }
      }
  
      // 初始化一个沙箱
      const newSandBox = new Sandbox('app1');
      const proxyWindow = newSandBox.proxy;
      proxyWindow.test = 1;
      console.log(window.test, proxyWindow.test) // 1 1;

      // 关闭沙箱
      newSandBox.inactive();
      console.log(window.test, proxyWindow.test); // undefined undefined;

      // 重启沙箱
      newSandBox.active();
      console.log(window.test, proxyWindow.test) // 1 1 ;
    }
  },
  mounted() {
  }
}
</script>