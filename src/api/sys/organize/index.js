import request from '@/plugin/axios'


// export function DataClear(data) {
//   console.log(data,'data')
//     Object.keys(data).map(vl => {
//         console.log(vl,'vl2')
//         return data.vl = ''
//     })
//     console.log(data)
// }
/**
 * 岗位列表
 *
 * @export
 * @param {*} data
 * @returns
 */
export function SysOrgList (data) {
  return request({
    url: request.adornUrl('/sys/org/list'),
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
export function SysOrgSave (data) {
  const url = data.orgId ? '/sys/org/update' : '/sys/org/save'
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
export function SysOrgDelete (data) {
  return request({
    url: request.adornUrl('/sys/org/delete'),
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
export function SysOrgGetId (data) {
  return request({
    url: request.adornUrl(`/sys/org/getId/${data.id}`),
    method: 'get',
    params: request.adornParams()
  })
}
