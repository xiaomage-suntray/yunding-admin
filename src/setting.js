import {version} from '../package'

const setting = {
  // 快捷键
  // 支持快捷键 例如 ctrl+shift+s
  hotkey: {
    search: {
      open: 's',
      close: 'esc'
    }
  },
  // 侧边栏默认折叠状态
  menu: {
    asideCollapse: true
  },
  // 在读取持久化数据失败时默认页面
  page: {
    opened: [
      {
        name: 'index',
        meta: {
          title: '首页',
          requiresAuth: false
        }
      }
    ]
  },
  // 版本
  releases: {
    version: version,
    api: 'https://gitee.com/sunzhiyuan/Suntray-Admin'
  },
  // 菜单搜索
  search: {
    enable: true
  },
  // 注册的主题
  theme: {
    list: [
      {
        title: '医疗',
        name: 'tx1',
        backgroundImage: 'image/theme/tx1/bg.jpg',
        preview: 'image/theme/tx1/preview@2x.png'
      },
      {
        title: '地产',
        name: 'tx2',
        backgroundImage: 'image/theme/tx2/bg.jpg',
        preview: 'image/theme/tx2/preview@2x.png'
      },
      {
        title: '教育',
        name: 'tx3',
        backgroundImage: 'image/theme/tx3/bg.jpg',
        preview: 'image/theme/tx3/preview@2x.png'
      },
      {
        title: '国际化',
        name: 'tx4',
        backgroundImage: 'image/theme/tx4/bg.jpg',
        preview: 'image/theme/tx4/preview@2x.png'
      },
      {
        title: '地产',
        name: 'tx2',
        backgroundImage: 'image/theme/tx2/bg.jpg',
        preview: 'image/theme/tx2/preview@2x.png'
      },
      {
        title: '教育',
        name: 'd2',
        preview: 'image/theme/d2/preview@2x.png'
      },
      {
        title: '国际化',
        name: 'd2',
        preview: 'image/theme/d2/preview@2x.png'
      },
      {
        title: '紫罗兰',
        name: 'violet',
        preview: 'image/theme/violet/preview@2x.png'
      },
      {
        title: '简约线条',
        name: 'line',
        backgroundImage: 'image/theme/line/bg.jpg',
        preview: 'image/theme/line/preview@2x.png'
      },
      {
        title: '流星',
        name: 'star',
        backgroundImage: 'image/theme/star/bg.jpg',
        preview: 'image/theme/star/preview@2x.png'
      },
      {
        title: 'Tomorrow Night Blue (vsCode)',
        name: 'tomorrow-night-blue',
        preview: 'image/theme/tomorrow-night-blue/preview@2x.png'
      }
    ]
  },
  // 是否默认开启页面切换动画
  transition: {
    active: true
  },
  // 在读取持久化数据失败时默认用户信息
  user: {
    info: {
        name: 'Ghost',
        token: ''
    }
  }
}

export default setting
