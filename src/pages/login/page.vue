<template lang="pug">
    .login-page
        #login
        .layer.flex-center(:class="{ism:isMobile}")
            <!-- logo部分 -->
            <!--.logo-group-->
            <!--img(src="../../../public/image/logo-tx.png" alt="logo")-->
            <!-- 表单部分 -->

            el-card.card
                .clearfix(slot="header")
                    img(src="../../../public/image/loginLogo.png" alt="logo")
                el-form(ref="loginForm" @keyup.enter.native="submit" label-position="top" :rules="rules" :model="formLogin" size="default")
                    el-form-item(prop="username")
                        el-input(type="text" v-model="formLogin.username" placeholder="用户名")
                            i.fa.fa-user-circle-o(slot="prepend")
                    el-form-item(prop="password")
                        el-input(type="password" v-model="formLogin.password" placeholder="密码")
                            i.fa.fa-keyboard-o(slot="prepend")
                    el-button.button-login(size="default" @click="submit" type="primary" v-text= "isMobile ? '绑定账号' : '登录'")
        el-dialog(title="快速选择用户" :visible.sync="dialogVisible" width="400px")
            el-row(:gutter="10" style="margin: -20px 0px -10px 0px;")
                el-col(v-for="(user, index) in users" :key="index" :span="8")
                    .user-btn(@click="handleUserBtnClick(user)")
                        d2-icon(name="user-circle-o")
                        span {{user.name}}
</template>

<script>
/* eslint-disable */
require('particles.js')
import {mapActions} from 'vuex'
import {getPermissions} from '@/util'

export default {
    data() {
        return {
            isMobile: false,
            bgUrl: '/image/login.jpg',
            // 快速选择用户
            dialogVisible: false,
            users: [
                {
                    name: '管理员',
                    username: 'admin',
                    password: 'admin'
                },
                {
                    name: '编辑',
                    username: 'editor',
                    password: 'editor'
                },
                {
                    name: '用户1',
                    username: 'user1',
                    password: 'user1'
                }
            ],
            // 表单
            formLogin: {
                username: '',
                password: '',
                uuid: '',
                code: ''
            },
            // 校验
            rules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ]
            },
            captchaPath: ''
        }
    },
    created() {
        this.getCaptcha()
    },
    mounted() {
        let parser = new UAParser(),
            uaResult = parser.getResult()

        if (uaResult.device.type === 'mobile' || uaResult.device.type === "tablet") {
            this.isMobile = true
            console.log(uaResult.device.type, '是移动端，调整样式')
        }
        // 初始化例子插件
        // particlesJS('login', config)
    },
    beforeDestroy() {
        // 销毁 particlesJS
        // thanks https://github.com/d2-projects/d2-admin/issues/65
        // ref https://github.com/VincentGarreau/particles.js/issues/63
        if (pJSDom && pJSDom.length > 0) {
            pJSDom[0].pJS.fn.vendors.destroypJS()
            pJSDom = []
        }
    },
    methods: {
        ...mapActions('d2admin/account', [
            'login'
        ]),
        /**
         * 获取uuid
         */
        getUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
            })
        },
        // 获取验证码
        getCaptcha() {
            this.formLogin.uuid = this.getUUID()
            this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.formLogin.uuid}`)
        },
        /**
         * @description 接收选择一个用户快速登录的事件
         * @param {Object} user 用户信息
         */
        handleUserBtnClick(user) {
            this.formLogin.username = user.username
            this.formLogin.password = user.password
            this.submit()
        },
        /**
         * @description 提交表单
         */
        // 提交登录信息
        submit() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {

	                this.login({
	                   vm: this,
	                   username: this.formLogin.username,
	                   password: this.formLogin.password
	                })
	                // 先进行认证
	                // 获取数据列表
                    // this.$http({
                     //    url: this.$http.authUrl('/oauth/token'),
                     //    method: 'post',
                     //    data: {
                     //    	'grant_type': 'password',
                     //        'username': this.formLogin.username,
	                //         'password': this.formLogin.password,
                     //        'scope': 'all'
                     //    }
                    // }).then((data) => {
                     //    console.log('先进行认证:', data)
                     //  if (data.access_token) {
	                //       // 登录
	                //       // 注意 这里的演示没有传验证码
	                //       // 具体需要传递的数据请自行修改代码
	                //       util.cookies.set('authorization', data.access_token)
	                //
	                //       this.$http({
		             //          url: this.$http.adornUrl('/sys/login'),
		             //          method: 'post',
		             //          data: {
			         //              'uuid': this.formLogin.uuid,
			         //              'username': this.formLogin.username,
			         //              'password': this.formLogin.password,
			         //              'captcha': this.formLogin.code
		             //          }
	                //       }).then((res) => {
			         //              console.log('res', res)
			         //              // 设置 cookie 一定要存 uuid 和 token 两个 cookie
			         //              // 整个系统依赖这两个数据进行校验和存储
			         //              // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
			         //              // token 代表用户当前登录状态 建议在网络请求中携带 token
			         //              // 如有必要 token 需要定时更新，默认保存一天
			         //              util.cookies.set('uuid', res.uuid)
			         //              util.cookies.set('token', res.token)
			         //              // 存储登陆用户权限信息
			         //              sessionStorage.setItem('permissions', res.permissions)
			         //              // 设置 vuex 用户信息
			         //              this.$store.dispatch('d2admin/user/set', {
				     //                  name: this.formLogin.username
			         //              }, { root: true })
			         //              // 用户登录后从持久化数据加载一系列的设置
			         //              this.$store.dispatch('load')
			         //              // 获取最新权限信息
			         //              getPermissions()
			         //              // 更新路由 尝试去获取 cookie 里保存的需要重定向的页面完整地址
			         //              const path = util.cookies.get('redirect')
			         //              // 根据是否存有重定向页面判断如何重定向
			         //              this.$router.replace(path ? { path } : { name: 'index' })
			         //              // 删除 cookie 中保存的重定向页面
			         //              util.cookies.remove('redirect')
		             //      }).catch(err => {
			         //              console.log('err: ', err)
			         //              this.getCaptcha()
		             //          })
                     //  }
                    // }).catch(err => {
	                //     console.log('err: ', err)
	                //     this.getCaptcha()
                    // })

                } else {
                    // 登录表单校验失败
                    this.$message.error('表单校验失败')
                }
            })
        }
    }
}
</script>

<style lang="scss">
    @import './style.scss';

    .login-page {
        overflow: hidden;
        .ism {
            overflow-y: scroll;
            .card {
                width: 90%;
                margin: 0 auto 60px;
                top:15vh;
                left: 0;
                right: 0;
            }
        }

        #login{
            width: 100%;
            height: 100%;
            background: url("/image/login.jpg") no-repeat;
            background-size: cover;
        }
        .layer.flex-center{
            /*width: 100%;*/
            /*top: 0;*/
            display: block;
        }
        #login {
            position: absolute;
            width: 100%;
        }
        .card {
            background-position: center top;
            background-size: cover;
            overflow: hidden;
            &:after{
                content: '';
                position: absolute;
                margin: -10px;
                width: 110%;
                height: 110%;
                background-color: rgba(0, 0, 0, .2);
                z-index: 1;
                top: 0;
            }
            &:before{
                content: '';
                position: absolute;
                margin: -10px;
                width: 110%;
                height: 110%;
                background-image: url('/image/login.jpg');
                background-position: center top;
                background-size: cover;
                background-attachment: fixed;
                filter: blur(10px);
            }

            position: absolute;
            right: 180px;
            top: 210px;
            border:1px solid rgba(255, 255, 255, .4);
            background-color: rgba(0, 0, 0, .3);


            width: 485px;
            border-radius: 20px;
            .el-card__header{
                padding-top: 115px;
                padding-bottom: 5px;
                border-bottom: 0;
                position: relative;
                z-index: 5;
            }
            .el-card__body{
                position: relative;
                z-index: 5;
            }
            .clearfix{
                color: #fff;
                text-align: center;
                font-size:30px;
                img {
                    width: 30%;
                }
            }
            .button-login{
                width: 100%;
                margin-top: 30px;
                margin-bottom: 130px;
                border-radius: 20px;
                position: relative;
            }

        }
    }

</style>


