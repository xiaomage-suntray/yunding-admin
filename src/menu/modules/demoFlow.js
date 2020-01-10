export default {
  path: '/sys/flow',
  title: '流程管理',
  icon: 'user-circle',
  children: [
    { path: '/sys/flow/vacation', title: '请假流程', icon: 'users' },
    { path: '/sys/flow/tasks', title: '待办任务', icon: 'modx' },
    { path: '/sys/flow/historic', title: '流程实例', icon: 'modx' },
    //   { path: '/sys/flow/management', title: '流程管理(上传)', icon: 'modx' },
    { path: '/sys/flow/edirManagement', title: '流程管理', icon: 'modx' },
    { path: '/sys/flow/deployManagement', title: '已发布流程', icon: 'modx' }

  ]
}
