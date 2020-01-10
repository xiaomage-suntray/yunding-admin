<template lang="pug">
  el-dialog(:title="!dataForm.orgId?'新增':'修改'", :close-on-click-modal='false', :visible.sync='visible',v-loading="loading")
    el-form(label-width='120px', ref="dataForm", :model='dataForm', :rules='dataRules', @keyup.enter.native='modalFormSubmit()')
      el-form-item(label='组织机构名称', prop='orgName')
        el-input(v-model='dataForm.orgName')
      el-form-item(label='上级组织机构', prop='parentId')
        el-tree-select(ref="treeSelect", v-model='dataForm.parentId', :selectParams='treeSelect.selectParams', :treeParams='treeSelect.treeParams')
      //- el-form-item(label='数据权限', prop='datapermissionId')
      //-   el-select(v-model='dataForm.datapermissionId')
      //-     el-option(v-for='item in datapermissionList' :key='item.datapermissionId' :label='item.name' :value='item.datapermissionId')
      el-form-item(label='负责人', prop='userIdList')
        el-select.el-select-half(v-model='dataForm.userIdList',multiple , filterable, placeholder='请选择负责人，可多选')
          el-option(v-for='item in userList', :key='item.userId', :label='item.username', :value='item.userId')
      el-form-item(label='序号')
        el-input-number(v-model='dataForm.sort', :min='1')
      el-form-item(label='是否公司', size='mini', prop='isCorporation')
        el-radio-group(v-model='dataForm.isCorporation')
          el-radio(label='1') 是
          el-radio(label='0') 否
      el-form-item(label="所属区域"  prop="areaName" )
        el-tree-select(ref="treeSelect" v-model="dataForm.areaName" placeholder="dataForm.areaName" :selectParams="selectParams" :treeParams="treeParams"  @node-click="fun"  @select-clear="fun" @searchFun="fun")
    span.dialog-footer(slot="footer")
      el-button(@click='visible=false') 取消
      el-button(type="primary", @click="modalFormSubmit()") 确认
</template>

<script>
    import axios from 'axios'
    // import { SysDatapermissionList } from '@/api/sys/datapermission'
    import {SysUserByTypeList} from '@/api/sys/user'
    import {SysOrgGetId, SysOrgSave} from '@/api/sys/organize'
    import ElTreeSelect from 'el-tree-select'

    export default {
  components: {
    ElTreeSelect
  },
  mounted() {
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
      datapermissionList: [], //
      userList: [], // 人员列表
      dataForm: {
        orgName: '',
        parentId: '',
        isCorporation: '',
        userIdList: [],
        sort: 1,
        areaName:''
      },
      dataRules: {
        orgName: [
          { required: true, message: '岗位名称不能为空', trigger: 'blur' }
        ],
          areaName: [
              {required: true, message: '所属区域不能为空', trigger: 'change'}
          ],
          isCorporation: [
              {required: true, message: '是否公司不能为空', trigger: 'change'}
          ]
      },
      treeSelect: {
        selectParams: {
          clearable: true,
          placeholder: '无',
          class: 'el-tree-select-half'
        },
        treeParams: {
          'default-expand-all': true,
          'filterable': true,
          'check-strictly': true,
          'render-content': this._renderFun,
          'data': [],
          props: {
            children: 'children',
            label: 'orgName',
            value: 'orgId'
          }
        }
      },
      // 服务区域展示树
      selectParams: {
          'multiple': false,
          'clearable': true,
          'placeholder': '请选择区域'
      },
      treeParams: {
          'default-expand-all': true,
          'filterable': true,
          'check-strictly': true,
          'render-content': this._renderFun,
          'data': [],
          'props': {
              children: 'children',
              label: 'name',
              value: 'name'
          }
      }
    }
  },
  methods: {
    // 每次打开弹窗时触发
    init (id) {
      this.visible = true
        this.getTableData()
      this.dataForm.orgId = id || ''
      this.$set(this.treeSelect, 'treeParams', {
        ...this.treeSelect.treeParams,
        data: this.treeList
      })
      console.log(this.treeSelect,'this.treeSelect')
      axios.all([SysUserByTypeList('1')]).then(axios.spread((userRes) => {
        (userRes.list).forEach(item => {
          if (item.type === '1') {
            this.userList.push(item)
          }
        })
      })).then(() => {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (id) {
            this.loading = true
            SysOrgGetId({
              id
            }).then(res => {
              this.loading = false
              this.dataForm = {
                ...this.dataForm,
                ...res.bean,
                // datapermissionId: res.bean.dataPermissionIdList ? res.bean.dataPermissionIdList[0] : '',
                sort: parseInt(res.bean.sort)
              }
            })
          }
        })
      })
    },
    // 获取区域管理
    getTableData() {
        this.$http({
            url: this.$http.adornUrl(`/sysArea/list`),
            method: 'post',
        }).then((data) => {
            this.treeParams.data = data.result
            console.log(this.$refs, 'this.$refs.treeSelect.treeDataUpdateFun')
            this.$refs.treeSelect.treeDataUpdateFun(data.result);

        })
    },
    fun(a) {
        this.$refs.treeSelect.$refs.tree.filter(a);
        console.log(a, '222222')

    },
    // 表单提交
    modalFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        console.log(this.dataForm)
        if (valid) {
          this.loading = true
          this.dataForm.parentId = this.dataForm.parentId || 0
          SysOrgSave({
            ...this.dataForm
            // dataPermissionIdList: [this.dataForm.datapermissionId]
          })
            .then(res => {
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
            })
            .catch(res => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
