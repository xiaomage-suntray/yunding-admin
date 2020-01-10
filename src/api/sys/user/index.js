import request from '@/plugin/axios'

/**
 * 获取用户列表
 *
 * @export
 * @returns
 */
export function SysUserList (data) {
  return request({
    url: request.adornUrl('/sys/user/list'),
    method: 'get',
    params: request.adornParams(data)
  })
}

/**
 * 根据type获取用户列表
 *
 * @export
 * @returns
 */
export function SysUserByTypeList (type) {
  return request({
    url: request.adornUrl('/sys/user/listByType/'+type),
    method: 'get'
  })
}

/**
 * 新增修改用户
 *
 * @export
 * @param {*} data
 * @returns
 */
export function SysUserSave (data) {
  const url = data.postId ? '/sys/user/update' : '/sys/user/save'
  return request({
    url: request.adornUrl(url),
    method: 'post',
    data
  })
}

/**
 * 删除用户
 *
 * @export
 * @param {*} data
 * @returns
 */
export function SysUserDelete (data) {
  return request({
    url: request.adornUrl('/sys/user/delete'),
    method: 'post',
    data
  })
}

/**
 * 获得用户信息
 *
 * @export
 * @param {*} data
 * @returns
 */
export function SysUserGetId (data) {
  return request({
    url: request.adornUrl(`/sys/user/getId/${data.id}`),
    method: 'get',
    params: request.adornParams()
  })
}

/**
 * 获得登录用户信息
 *
 * @export
 * @returns
 */
export function SysUserInfo () {
  return request({
    url: request.adornUrl(`/sys/user/info`),
    method: 'get',
    params: request.adornParams()
  })
}

/**
 * 根据「userName」获得用户信息
 *
 * @export
 * @param {*} data
 * @returns
 */
export function SysUserInfoByName (data) {
  return request({
    url: request.adornUrl(`/sys/user/infoByName/${data.userName}`),
    method: 'get',
    params: request.adornParams()
  })
}
