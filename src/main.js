// polyfill
import 'babel-polyfill'
// Vue
import Vue from 'vue'
import App from './App'
// import Pug from 'pug'
import { mapState } from 'vuex'
// store
import store from '@/store/index'
// 模拟数据
import '@/mock'
// 多国语
import i18n from './i18n'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// HTML转PDF
import htmlToPdf from '@/pages/components/htmlToPdf.js'
// [ 可选插件组件 ]D2-Crud
import D2Crud from '@d2-projects/d2-crud'
// [ 可选插件组件 ] 图表
import VCharts from 'v-charts'
// [ 可选插件组件 ] 右键菜单
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
// [ 可选插件组件 ] JSON 树状视图
import vueJsonTreeView from 'vue-json-tree-view'
// [ 可选插件组件 ] 网格布局组件
import { GridItem, GridLayout } from 'vue-grid-layout'
// [ 可选插件组件 ] 区域划分组件
import SplitPane from 'vue-splitpane'

import moment from 'moment'
// 菜单和路由设置
import router from './router'
import { menuHeader } from '@/menu'
import { frameInRoutes } from '@/router/routes'
import httpRequest from '@/plugin/axios'
import { isAuth } from '@/util'
import Print from '@/api/print/print.js' // 打印

// 核心插件
Vue.use(d2Admin)
// 打印插件
Vue.use(Print)

// 可选插件组件
Vue.use(D2Crud)
Vue.use(VCharts)
Vue.use(contentmenu)
Vue.use(vueJsonTreeView)
Vue.use(htmlToPdf)
Vue.component('d2-grid-layout', GridLayout)
Vue.component('d2-grid-item', GridItem)
Vue.component('SplitPane', SplitPane)
Vue.prototype.$moment = moment
// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth // 权限方法

new Vue({
    router,
    store,
    i18n,

    render: h => h(App),
    computed: {
        ...mapState('d2admin/menu', [
            'header'
        ])
    },
    created () {
    // 处理路由 得到每一级的路由设置
        this.$store.commit('d2admin/page/init', frameInRoutes)
        // 设置顶栏菜单
        this.$store.commit('d2admin/menu/headerSet', menuHeader)
        // 初始化菜单搜索功能
        this.$store.commit('d2admin/search/init', menuHeader)
    },
    mounted () {
        // 展示系统信息
        this.$store.commit('d2admin/releases/versionShow')
        // 检查最新版本 // 临时关闭git的自动检查更新
        // this.$store.dispatch('d2admin/releases/checkUpdate')
        // 用户登录后从数据库加载一系列的设置
        this.$store.dispatch('d2admin/account/load')
        // 获取并记录用户 UA
        this.$store.commit('d2admin/ua/get')
        // 初始化全屏监听
        this.$store.dispatch('d2admin/fullscreen/listen')
    },
    watch: {
    // 监听路由 控制侧边栏显示
        '$route.matched' (val) {
            const menuAside = this.header.map(item => {
                if (item.list && item.list.length > 0 && item.list[0].list) {
                    return item.list.concat([item])
                }
                if (item.list) {
                    return item
                }
            }).filter(item => item != null).flat()
            const _side = menuAside.filter(menu => menu.url === val[0].path)
            this.$store.commit('d2admin/menu/asideSet', _side.length > 0 ? _side[0].list : [])
        }
    }
}).$mount('#app')
