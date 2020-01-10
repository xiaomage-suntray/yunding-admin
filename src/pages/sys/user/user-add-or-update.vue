<template lang="pug">
  el-dialog(:title="!dataForm.id ? '新增' : '修改'", :close-on-click-modal='false', :visible.sync='visible',)
    el-form(:model='dataForm', :rules='dataRule', ref='dataForm', @keyup.enter.native='dataFormSubmit()', label-width='80px')
      el-form-item(label='登录帐号', prop='userName')
        el-input(v-model='dataForm.userName', placeholder='登录帐号')
      el-form-item(label='姓名', prop='thename')
        el-input(v-model='dataForm.thename', placeholder='姓名')
      el-form-item(label='密码', prop='password', :class="{ 'is-required': !dataForm.id }")
        el-input(v-model='dataForm.password', type='password', placeholder='密码')
      el-form-item(label='确认密码', prop='comfirmPassword', :class="{ 'is-required': !dataForm.id }")
        el-input(v-model='dataForm.comfirmPassword', type='password', placeholder='确认密码')
      el-form-item(label='邮箱', prop='email')
        el-input(v-model='dataForm.email', placeholder='邮箱')
      el-form-item(label='手机号', prop='mobile')
        el-input(v-model='dataForm.mobile', placeholder='手机号')
      el-form-item(label='角色', prop='roleIdList')
        el-select(v-model='dataForm.roleIdList', multiple, placeholder='请选择角色', style='width:100%')
          el-option(v-for='role in roleList', :key='role.roleId' :label='role.roleName' :value='role.roleId')
      el-form-item(label='所在岗位', prop='postId')
        el-tree-select(ref="postTreeSelect", v-model='dataForm.postId', :selectParams='postTreeSelect.selectParams', :treeParams='postTreeSelect.treeParams')
      el-form-item(label='所在机构', prop='orgId')
        el-tree-select(ref="orgTreeSelect", v-model='dataForm.orgId', :selectParams='orgTreeSelect.selectParams', :treeParams='orgTreeSelect.treeParams', @node-click='selectChange')
      el-form-item(label='状态', size='mini', prop='status')
        el-radio-group(v-model='dataForm.status')
          el-radio(:label='0') 禁用
          el-radio(:label='1') 正常
    span.dialog-footer(slot='footer')
      el-button(@click='visible = false') 取消
      el-button(type='primary', @click='dataFormSubmit()') 确定
</template>

<script>
    import axios from 'axios'
    import {SysRoleSelect} from '@/api/sys/role'
    import {SysPostList} from '@/api/sys/post'
    import {SysOrgList} from '@/api/sys/organize'
    import {isEmail, isMobile} from '@/util/validate'
    import {treeDataTranslate} from '@/util'
    import ElTreeSelect from 'el-tree-select'

    export default {
    components: {
        ElTreeSelect
    },
    data () {
        var validatePassword = (rule, value, callback) => {
            if (!this.dataForm.id && !/\S/.test(value)) {
                callback(new Error('密码不能为空'))
            } else {
                callback()
            }
        }
        var validateComfirmPassword = (rule, value, callback) => {
            if (!this.dataForm.id && !/\S/.test(value)) {
                callback(new Error('确认密码不能为空'))
            } else if (this.dataForm.password !== value) {
                callback(new Error('确认密码与密码输入不一致'))
            } else {
                callback()
            }
        }
        var validateEmail = (rule, value, callback) => {
            if (!isEmail(value)) {
                callback(new Error('邮箱格式错误'))
            } else {
                callback()
            }
        }
        var validateMobile = (rule, value, callback) => {
            if (!isMobile(value)) {
                callback(new Error('手机号格式错误'))
            } else {
                callback()
            }
        }
        return {
            visible: false,
            roleList: [],
            postTreeSelect: {
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
            },
            orgTreeSelect: {
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
                        label: 'orgName',
                        value: 'orgId'
                    }
                }
            },
            dataForm: {
                id: 0,
                userName: '',
                password: '',
                thename: '',
                comfirmPassword: '',
                salt: '',
                email: '',
                mobile: '',
                roleIdList: [],
                postId: '',
                orgId: '',
                orgIdList: [],
                status: 1
            },
            dataRule: {
                userName: [
                    { required: true, message: '登录账号不能为空', trigger: 'blur' }
                ],
                thename: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' }
                ],
                password: [
                    { validator: validatePassword, trigger: 'blur' }
                ],
                comfirmPassword: [
                    { validator: validateComfirmPassword, trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    { validator: validateEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '手机号不能为空', trigger: 'blur' },
                    { validator: validateMobile, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        init (id) {
            this.dataForm.id = id || 0
            axios.all([SysRoleSelect(), SysPostList({ limit: 999 }), SysOrgList({ limit: 999 })]).then(axios.spread((roleRes, postRes, orgRes) => {
                // 等待三方接口同时调用完成
                this.roleList = roleRes && roleRes.code === 0 ? roleRes.list : []
                this.$set(this.postTreeSelect, 'treeParams', {
                    ...this.postTreeSelect.treeParams,
                    data: treeDataTranslate(postRes.page.list, 'postId')
                })
                this.$set(this.orgTreeSelect, 'treeParams', {
                    ...this.orgTreeSelect.treeParams,
                    data: treeDataTranslate(orgRes.page.list, 'orgId')
                })
            })).then(() => {
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                })
            }).then(() => {
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then((data) => {
                        if (data && data.code === 0) {
                            this.dataForm.userName = data.user.username
                            this.dataForm.thename = data.user.thename
                            this.dataForm.salt = data.user.salt
                            this.dataForm.email = data.user.email
                            this.dataForm.mobile = data.user.mobile
                            this.dataForm.roleIdList = data.user.roleIdList
                            this.dataForm.postId = data.user.postIdList[0]
                            this.dataForm.orgId = this.dataForm.orgIdList =  data.user.orgIdList[0]
                            this.dataForm.status = data.user.status
                        }
                    })
                }
            })
        },
        selectChange (checked) {
            // TO_DO 临时处理 因 未来组织机构可能改为多选
            this.dataForm.orgIdList = checked.orgId + '#' + checked.orgCode
        },
        // 表单提交
        dataFormSubmit () {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
                        method: 'post',
                        data: {
                            'userId': this.dataForm.id || undefined,
                            'username': this.dataForm.userName,
                            'password': this.dataForm.password,
                            'thename': this.dataForm.thename,
                            'salt': this.dataForm.salt,
                            'email': this.dataForm.email,
                            'mobile': this.dataForm.mobile,
                            'status': this.dataForm.status,
                            'roleIdList': this.dataForm.roleIdList,
                            'postIdList': [this.dataForm.postId],
                            'orgIdList': [this.dataForm.orgIdList]
                        }
                    }).then((data) => {
                        if (data && data.code === 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.$emit('refreshDataList')
                                    this.visible = false
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }
            })
        }
    }
}
</script>
