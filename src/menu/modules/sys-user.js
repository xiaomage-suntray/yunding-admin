export default {
  path: '/sys/user',
  title: '角色与权限',
  icon: 'user-circle',
  children: [
    { path: '/sys/user/admin', title: '管理员列表', icon: 'users' },
    { path: '/sys/user/role', title: '角色管理', icon: 'modx' },
    { path: '/sys/user/menu', title: '菜单管理', icon: 'reorder' },
    { path: '/sys/user/post', title: '岗位管理', icon: 'modx' },
    { path: '/sys/user/organize', title: '组织机构管理', icon: 'reorder' },
    { path: '/sys/user/datapermission', title: '数据权限管理', icon: 'globe' }
  ]
}
