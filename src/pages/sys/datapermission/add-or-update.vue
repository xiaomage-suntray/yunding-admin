<template lang="pug">
  el-dialog(:title="!dataForm.datapermissionId?'新增':'修改'", :close-on-click-modal='false', :visible.sync='visible',v-loading="loading")
    el-form(label-width='120px', ref="dataForm", :model='dataForm', :rules='dataRules', @keyup.enter.native='modalFormSubmit()')
      el-form-item(label='权限名称', prop='name')
        el-input(v-model='dataForm.name')
      el-form-item(label='动态参数', prop='addparam')
        el-input(v-model='dataForm.addparam')
      el-form-item(label='状态', size='mini')
        el-radio-group(v-model='dataForm.status')
          el-radio(:label='0', border) 禁用
          el-radio(:label='1', border) 正常
      el-form-item(label='备注', prop='remark')
        el-input(v-model='dataForm.remark')
    span.dialog-footer(slot="footer")
      el-button(@click='visible=false') 取消
      el-button(type="primary", @click="modalFormSubmit()") 确认
</template>

<script>
import { SysDatapermissionGetId, SysDatapermissionSave } from '@/api/sys/datapermission'

export default {
  props: {
    treeList: {
      default: () => []
    }
  },
  data () {
    return {
      loading: false,
      visible: false,
      dataForm: {
        name: '',
        addparam: '',
        status: 1,
        remark: ''
      },
      dataRules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        addparam: [{ required: true, message: '动态参数不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 每次打开弹窗时触发
    init (id) {
      this.visible = true
      this.dataForm.datapermissionId = id || ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (id) {
          this.loading = true
          SysDatapermissionGetId({
            id
          }).then(res => {
            this.loading = false
            this.dataForm = {
              ...this.dataForm,
              ...res.bean
            }
          })
        }
      })
    },
    // 表单提交
    modalFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          SysDatapermissionSave({
            ...this.dataForm
          }).then(res => {
            if (res && res.code === 0) {
              this.$message({
                message: res.msg,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.loading = false
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.loading = false
              this.$message.error(res.msg)
            }
          }).catch(res => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style>
</style>
