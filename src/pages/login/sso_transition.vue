<template lang="pug">
    .login-page
        #login(  v-loading="loading" element-loading-text="自动登录验证中，请稍等" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)")
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
                        el-input(type="text" placeholder="用户名")
                            i.fa.fa-user-circle-o(slot="prepend")
                    el-form-item(prop="password")
                        el-input(type="password" placeholder="密码")
                            i.fa.fa-keyboard-o(slot="prepend")
                    el-button.button-login(size="default" @click="submit" type="primary" v-text= "'自动登录'")
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
            loading:true,
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
    },
    mounted() {
        let parser = new UAParser(),
            uaResult = parser.getResult()

        if (uaResult.device.type === 'mobile' || uaResult.device.type === "tablet") {
            this.isMobile = true
            console.log(uaResult.device.type, '是移动端，调整样式')
        }
        this.getUrlParam();
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
        ...mapActions('d2admin/accountSso', [
            'login'
        ]),
        getUrlParam(){
               var idPre = decodeURIComponent(window.location.href).split('?')[1]
              // alert(idPre)
                var userName = idPre.split('&')[0]
                this.formLogin.username = idPre.split('&')[0]
                this.formLogin.password = idPre.split('&')[1]
                 this.login({
	                   vm: this,
	                   username: this.formLogin.username,
                       password: this.formLogin.password,
                       
	                })
        },
   
        /**
         * @description 接收选择一个用户快速登录的事件
         * @param {Object} user 用户信息
         */
        handleUserBtnClick(user) {
            this.formLogin.username = user.username
            this.formLogin.password = user.password
        },
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


