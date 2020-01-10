import request from '@/plugin/axios'

/**
 * 岗位列表
 *
 * @export
 * @param {*} data
 * @returns
 */
export function SysPostList (data) {
  return request({
    url: request.adornUrl('/sys/post/list'),
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
export function SysPostSave (data) {
  const url = data.postId ? '/sys/post/update' : '/sys/post/save'
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
export function SysPostDelete (data) {
  return request({
    url: request.adornUrl('/sys/post/delete'),
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
export function SysPostGetId (data) {
  return request({
    url: request.adornUrl(`/sys/post/getId/${data.id}`),
    method: 'get',
    params: request.adornParams()
  })
}
