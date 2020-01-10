import request from '@/plugin/axios'

/**
 * 岗位列表
 *
 * @export
 * @param {*} data
 * @returns
 */
export function SysDatapermissionList (data) {
  return request({
    url: request.adornUrl('/sysDatapermission/list'),
    method: 'get',
    params: request.adornParams(data)
  })
}

/**
 * 岗位新增修改
 *
 * @export
 * @param {*} data
 * @returns
 */
export function SysDatapermissionSave (data) {
  const url = data.datapermissionId ? '/sysDatapermission/update' : '/sysDatapermission/save'
  return request({
    url: request.adornUrl(url),
    method: 'post',
    data
  })
}

/**
 * 删除岗位
 *
 * @export
 * @param {*} data
 * @returns
 */
export function SysDatapermissionDelete (data) {
  return request({
    url: request.adornUrl('/sysDatapermission/delete'),
    method: 'post',
    data
  })
}

/**
 * 获得岗位详情
 *
 * @export
 * @param {*} data
 * @returns
 */
export function SysDatapermissionGetId (data) {
  return request({
    url: request.adornUrl(`/sysDatapermission/getId/${data.id}`),
    method: 'get',
    params: request.adornParams()
  })
}
