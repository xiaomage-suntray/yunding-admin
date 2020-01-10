<template lang="pug">
  el-dialog(:title="!dataForm.postId?'新增':'修改'", :close-on-click-modal='false', :visible.sync='visible',v-loading="loading")
    el-form(label-width='80px', ref="dataForm", :model='dataForm', :rules='dataRules', @keyup.enter.native='modalFormSubmit()')
      el-form-item(label='岗位名称', prop='postName')
        el-input(v-model='dataForm.postName')
      el-form-item(label='上级岗位', prop='parentId')
        el-tree-select(ref="treeSelect", v-model='dataForm.parentId', :selectParams='treeSelect.selectParams', :treeParams='treeSelect.treeParams')
      el-form-item(label='数据权限', prop='datapermissionId')
        el-select(v-model='dataForm.datapermissionId')
          el-option(v-for='item in datapermissionList' :key='item.datapermissionId' :label='item.name' :value='item.datapermissionId')
      el-form-item(label='序号')
        el-input-number(v-model='dataForm.sort', :min='1')
    span.dialog-footer(slot="footer")
      el-button(@click='visible=false') 取消
      el-button(type="primary", @click="modalFormSubmit()") 确认
</template>

<script>
import { SysDatapermissionList } from '@/api/sys/datapermission'
import { SysPostGetId, SysPostSave } from '@/api/sys/post'
import ElTreeSelect from 'el-tree-select'

export default {
  components: {
    ElTreeSelect
  },
  props: {
    treeList: {
      default: () => []
    }
  },
  data () {
    return {
      loading: false,
      visible: false,
      datapermissionList: [],
      dataForm: {
        postName: '',
        parentId: '',
        datapermissionId: '',
        sort: 1
      },
      dataRules: {
        postName: [
          { required: true, message: '岗位名称不能为空', trigger: 'blur' }
        ]
      },
      treeSelect: {
        selectParams: {
          clearable: true,
          placeholder: '无',
          class: 'el-tree-select-half'
        },
        treeParams: {
          accordion: true,
          filterable: false,
          'highlight-current': true,
          data: [],
          props: {
            children: 'children',
            label: 'postName',
            value: 'postId'
          }
        }
      }
    }
  },
  methods: {
    // 每次打开弹窗时触发
    init (id) {
      this.visible = true
      this.dataForm.postId = id || ''
      this.$set(this.treeSelect, 'treeParams', {
        ...this.treeSelect.treeParams,
        data: this.treeList
      })
      SysDatapermissionList({ limit: 999, page: 1 })
        .then(res => {
          this.datapermissionList = res.page.list.filter((item) => item.status === 1)
        })
        .then(() => {
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            if (id) {
              this.loading = true
              SysPostGetId({
                id
              }).then(res => {
                this.loading = false
                this.dataForm = {
                  ...this.dataForm,
                  ...res.bean,
                  datapermissionId: res.bean.dataPermissionIdList ? res.bean.dataPermissionIdList[0] : '',
                  sort: parseInt(res.bean.sort)
                }
              })
            }
          })
        })
    },
    // 表单提交
    modalFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.dataForm.parentId = this.dataForm.parentId || 0
          SysPostSave({
            ...this.dataForm,
            dataPermissionIdList: [this.dataForm.datapermissionId]
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
