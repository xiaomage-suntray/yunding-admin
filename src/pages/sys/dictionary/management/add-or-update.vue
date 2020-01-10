<template lang="pug">
  el-dialog(:title="!dataForm.id?'新增':'修改'", :close-on-click-modal='false', :visible.sync='visible',v-loading="loading" center)
    el-form(label-width='100px', ref="dataForm", :model='dataForm', :rules='dataRule', @keyup.enter.native='modalFormSubmit()')
      el-row(:gutter="20")
        el-col(:span="20")
          el-form-item(label='字典类型', prop='dictionaryCalss' )
            el-input(v-model='dataForm.dictionaryCalss' v-bind:disabled="isReadOnly")
      el-row(:gutter="20")
        el-col(:span="20")
          el-form-item(label='字典名称', prop='dictionaryName')
            el-input(v-model='dataForm.dictionaryName' )
    span.dialog-footer(slot="footer")
      el-button(@click='visible=false') 取消
      el-button(type="primary", @click="modalFormSubmit()") 确认
</template>

<script>
import axios from 'axios'
import util from '@/libs/util.js'

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
      isReadOnly: false,
      uploadUrl: '',
      dataForm: {
        id: '',
        dictionaryCalss: '',
        dictionaryName: ''
      },
      headers: {
        token: util.cookies.get('token')
      },
      dataRule: {
        dictionaryCalss: [
          { required: true, message: '字典分类不能为空', trigger: 'blur' }
        ],
        dictionaryName: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    // 每次打开弹窗时触发
    init (id) {
      this.dataForm.id = id || ''
      this.uploadUrl = `/sysDictionary/${!this.dataForm.id ? 'save' : 'update'}`

      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      
      if (this.dataForm.id) {
        this.isReadOnly = true
        this.$http({
          url: this.$http.adornUrl(`/sysDictionary/getId/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then((data) => {
          if (data && data.code === 0) {
            this.dataForm = data.bean
          }
        })
      }else{
        this.isReadOnly = false
      }
    },
    // 表单提交
    modalFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.uploadUrl)

          this.$http({
            url: this.$http.adornUrl(this.uploadUrl),
            method: 'post',
            data: this.$http.adornParams(this.dataForm)
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
            }
          })
        }
      })
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleCloseDataUpload (done) {
      this.$refs.upload.clearFiles()
      this.visible = false
    },
    uploadSuccess (data) {
      if (data && data.code === 0) {
        this.dataForm.id = data.id
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.$refs.upload.clearFiles()
            this.visible = false
            this.$emit('refreshDataList')
          }
        })
      } else {
        this.$message.error(data.msg)
      }
    }
  }
}
</script>

<style>
</style>
