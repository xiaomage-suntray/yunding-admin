import request from '@/plugin/axios'

/**
 * 获取角色
 *
 * @export
 * @returns
 */
export function SysRoleSelect () {
  return request({
    url: request.adornUrl('/sys/role/select'),
    method: 'get',
    data: request.adornParams()
  })
}
