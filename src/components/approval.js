// import WebReq from '@/plugin/axios'
//
// class approval {
//     // 审批提交
//     constructor(obj) {
//         this.$http = WebReq;//this代表的是实例对象
//     }
//
//     updateStatus(bizId, activitiyTypeKey) {
//         console.log(WebReq, 'httpRequest')
//         WebReq({
//             url: WebReq.adornUrl(`/sys/user/info`),
//             method: 'get',
//             params: WebReq.adornParams()
//         }).then((data) => {
//             console.log('传入', data)
//             if (data && data.code === 0) {
//                 WebReq({
//                     url: WebReq.adornActivityUrl('/activity/processTjFirst'),
//                     method: 'post',
//                     data: {
//                         bizId,
//                         activitiyTypeKey,
//                         'userId': data.user.userId,
//                         'userName': data.user.username,
//                         'title': '自行采购流程业务'
//                     }
//                 }).then((data) => {
//                     console.log(data,'222222-2')
//                     // if (data && data.code === 0) {
//                         // this.$message({
//                         //     message: '操作成功',
//                         //                 type: 'success',
//                         //                 duration: 1500,
//                         //                 onClose: () => {
//                         //                     this.getDataList()
//                         //                 }
//                         //             })
//                     // } else {
//                     //             this.$message.error(data.msg)
//                     //         }
//                 })
//             }
//         })
//         // }
//     }
// }
//
//
// export default new approval(WebReq)
