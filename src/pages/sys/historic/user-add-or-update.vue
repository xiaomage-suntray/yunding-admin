<template>

 <el-dialog
    :title="'审核'"
    :close-on-click-modal="false"
    :visible.sync="visible">
     <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="流程图" name="first">
       <img :src="captchaPath">
     </el-tab-pane>
    <el-tab-pane label="审核历史" name="second">
      <el-table
              :data="dataList"
              border

              style="width: 100%;">
        <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50">
        </el-table-column>
        <el-table-column
                prop="userName"
                header-align="center"
                align="center"
                label="审批人">
        </el-table-column>
        <el-table-column
                prop="time"
                header-align="center"
                align="center"
                label="审批时间">
        </el-table-column>
        <el-table-column
                prop="message"
                header-align="center"
                align="center"
                label="审批备注">
        </el-table-column>
      </el-table>

    </el-tab-pane>

  </el-tabs>
   <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>

    </span>
  </el-dialog>

</template>

<script>

import util from '@/libs/util'
export default {
    data () {
        return {
            activeName: 'third',
            visible: false,
            roleList: [],
            dataList: [],
            dataForm: {
                id: 0,
                userName: '',
                password: '',
                comfirmPassword: '',
                salt: '',
                email: '',
                mobile: '',
                roleIdList: [],
                status: 1
            },
            captchaPath: ''
        }
    },
    methods: {
        handleClick (tab, event) {
            console.log(tab, event)
        },
        init (id, processInstanceId, bizId, isMe) {
            this.visible = true
            this.dataForm.taskId = id
            this.dataForm.processInstanceId = processInstanceId
            // 获取流程图
            this.getCaptcha(id, processInstanceId)
            // 获取历史审批备注
            this.getComment(processInstanceId)
        },
        // 流程图
        getCaptcha (id, processInstanceId) {
            var token = util.cookies.get('token')
            this.captchaPath = this.$http.adornActivityUrl(`/activity/read-resource?processDefinitionId=${id}&pProcessInstanceId=${processInstanceId}&token=${token}`)
        },
        getComment (processInstanceId) {
            this.$http({
                url: this.$http.adornActivityUrl(`/activity/auditComment`),
                method: 'post',
                data: {
                    'processInstanceId': processInstanceId
                }
            }).then((data) => {
                if (data && data.code === 0) {
                    this.dataList = data.listMap
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        // 表单提交
        dataFormSubmit (t) {
            if (this.dataForm.result === undefined) {
                this.$message({
                    message: '备注不能为空',
                    type: 'error',
                    duration: 1500,
                    onClose: () => {
                    }
                })
            } else {
                this.$http({
                    url: this.$http.adornActivityUrl(`/activity/completeTask`),
                    method: 'post',
                    data: {
                        'processInstanceId': this.dataForm.processInstanceId,
                        'taskId': this.dataForm.taskId,
                        'result': this.dataForm.result,
                        'operateApprove': t
                    }
                }).then((data) => {
                    if (data && data.code === 0) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.visible = false
                                this.$emit('refreshDataList')
                            }
                        })
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            }
        }

    }

}
</script>
