import request from '@/plugin/axios'

export function AccountLogin (data) {
    return request({
        url: request.adornUrl('/sys/login'),
        method: 'post',
        data
    })
}
export function AccountSsoLogin (data) {
    return request({
        url: request.adornUrl('/sys/ssoLogin'),
        method: 'post',
        data
    })
}
