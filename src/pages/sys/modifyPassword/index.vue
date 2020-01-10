<template lang="pug">
    d2-container
        el-row(type="flex" justify="center" align="buttom")
            el-row(:span="24" style="padding-top:35vh")
                el-form(:model="pushData" status-icon :rules="rules" ref="pushData" label-width="100px" class="demo-ruleForm")
                    el-form-item(label="原密码" prop="password")
                        el-input(type="password" v-model="pushData.password")
                    el-form-item(label="新密码" prop="newPassword")
                        el-input(type="password" v-model="pushData.newPassword")
                    el-form-item(label="确认密码" prop="checkPassword")
                        el-input(type="password" v-model="pushData.checkPassword")
                    el-form-item
                        el-button(type="primary" @click="userPassword") 确认修改
                        el-button(type="button" @click="goBack") 取消
</template>
<script>

    export default {
        data() {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.pushData.checkPassword !== '') {
                        this.$refs.pushData.validateField('checkPass');
                    }
                    callback();
                }
            };
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.pushData.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }
            return {
                pushData: {
                    password: '',
                    newPassword: '',
                    checkPassword: ''
                },
                rules: {
                    password: [{required: true, message: '原密码不能为空', trigger: 'blur'}],
                    newPassword: [{validator: validatePass, trigger: 'blur'}],
                    checkPassword: [{validator: validatePass2, trigger: 'blur'}]
                }
            }
        },
        methods: {
            // 修改密码
            userPassword() {
                this.$refs['pushData'].validate(valid => {
                    if (valid) {
                        let data = {...this.pushData}
                        delete data.checkPassword
                        this.$http({
                            url: this.$http.adornUrl('/sys/user/password'),
                            method: "post",
                            data
                        }).then((data) => {
                            if (data && data.code === 0) {
                                this.$message({
                                    message: '密码修改成功',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: () => {
                                        this.$router.go(-1)
                                    }
                                })
                            }
                        })
                    }
                })
            },
            goBack() {
                this.$router.go(-1)
            }
        }
    }
</script>
