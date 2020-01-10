// layout
import layoutHeaderAside from '@/layout/header-aside'

const meta = { requiresAuth: true }

/**
 * 在主框架内显示
 */
const frameIn = [
    // 修改密码
    {
        path: '/modifyPassword',
        name: 'modifyPassword',
        component: () => import('@/pages/sys/modifyPassword')
    },
    // 字典管理
    {
        path: '/dictionary/',
        name: 'dictionary',
        meta,
        redirect: { name: 'dictionary' },
        component: layoutHeaderAside,
        children: (pre => [
            {
                path: 'management',
                name: `${pre}management`,
                component: () => import('@/pages/sys/dictionary/management'),
                meta: { ...meta, title: '字典管理' }
            }
        ])('sys-dictionary-')
    },
    // 系统日志
    {
        path: '/log/',
        name: 'log',
        meta,
        redirect: { name: 'log' },
        component: layoutHeaderAside,
        children: (pre => [
            { path: '/', name: `log`, component: () => import('@/pages/sys/log'), meta: { ...meta, title: '系统日志' } }
        ])('sys-log-')
    },
    {
        path: '/',
        redirect: { name: 'index' },
        component: layoutHeaderAside,
        children: [
            {
                path: 'index',
                name: 'index',
                meta,
                component: () => import('@/pages/index')
            }
        ]
    },
    // 汽车限行
    {
        path: '/carsystem',
        name: 'carsystem',
        meta,
        redirect: { name: 'commodity' },
        component: layoutHeaderAside,
        children: (pre => [
            {
                path: 'index',
                name: `${pre}index`,
                component: () => import('@/pages/sys/carNumberLimit/index'),
                meta: { ...meta, title: '汽车限行' }
            },
            {
                path: 'class',
                name: `${pre}class`,
                component: () => import('@/pages/sys/commodity/class'),
                meta: { ...meta, title: '商品分类' }
            }
        ])('carsystem-')
    },
    // 商品管理
    {
        path: '/good/list',
        name: 'goodList',
        meta,
        redirect: { name: 'commodity' },
        component: layoutHeaderAside,
        children: (pre => [
            {
                path: 'index',
                name: `${pre}index`,
                component: () => import('@/pages/sys/commodity/index'),
                meta: { ...meta, title: '商品信息管理' }
            },
            {
                path: 'class',
                name: `${pre}class`,
                component: () => import('@/pages/sys/commodity/class'),
                meta: { ...meta, title: '商品分类' }
            }
        ])('commodity-')
    },
    {
        path: '/sys/user',
        name: 'sys-user',
        meta,
        redirect: { name: 'sys-user' },
        component: layoutHeaderAside,
        children: (pre => [
            {
                path: 'admin',
                name: `${pre}admin`,
                component: () => import('@/pages/sys/user'),
                meta: { ...meta, title: '管理员列表' }
            },
            {
                path: 'role',
                name: `${pre}role`,
                component: () => import('@/pages/sys/role'),
                meta: { ...meta, title: '角色管理' }
            },
            {
                path: 'menu',
                name: `${pre}menu`,
                component: () => import('@/pages/sys/menu'),
                meta: { ...meta, title: '菜单管理' }
            },
            {
                path: 'post',
                name: `${pre}post`,
                component: () => import('@/pages/sys/post'),
                meta: { ...meta, title: '岗位管理' }
            },
            {
                path: 'organize',
                name: `${pre}organize`,
                component: () => import('@/pages/sys/organize'),
                meta: { ...meta, title: '组织机构管理' }
            },
            {
                path: 'datapermission',
                name: `${pre}datapermission`,
                component: () => import('@/pages/sys/datapermission'),
                meta: { ...meta, title: '数据权限管理' }
            }
        ])('sys-user-')
    },
    {
        path: '/sys/setting',
        name: 'sys-setting',
        meta,
        redirect: { name: 'sys-setting' },
        component: layoutHeaderAside,
        children: (pre => [
            {
                path: 'sql',
                name: `${pre}sql`,
                component: () => import('@/pages/sys/setting/sql'),
                meta: { ...meta, title: 'SQL监控' }
            },
            {
                path: 'code',
                name: `${pre}code`,
                component: () => import('@/pages/sys/setting/code'),
                meta: { ...meta, title: '代码生成' }
            }
        ])('sys-setting-')
    }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
    // 页面重定向使用 必须保留
    {
        path: '/redirect/:path*',
        component: () => import('@/pages/redirect')
    },
    // 登录
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/login')
        // component: () => import('@/pages/demo/playground/index')
    },

    // sso登录
    {
        path: '/ssoLogin',
        name: 'ssoLogin',
        component: () => import('@/pages/login/sso_transition')
        // component: () => import('@/pages/demo/playground/index')
    }
]

/**
 * 错误页面
 */
const errorPage = [
    // 404
    {
        path: '*',
        name: '404',
        component: () => import('@/pages/error-page-404')
    }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
    ...frameIn,
    ...frameOut,
    ...errorPage
]
