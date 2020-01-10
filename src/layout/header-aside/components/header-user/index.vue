<template lang="pug">
    el-dropdown.d2-mr(size="small")
        span.btn-text 你好， {{info.name}}
        el-dropdown-menu(slot="dropdown")
            router-link.el-dropdown-menu__item(tag="li" :to="{path: '/modifyPassword'}")
                    d2-icon.d2-mr-5(name="power-off")
                    | 修改密码
            el-dropdown-item(@click.native="logOff")
                d2-icon.d2-mr-5(name="power-off")
                | 注销

</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
    computed: {
        ...mapState('d2admin/user', [
            'info'
        ])
    },
    methods: {
        ...mapActions('d2admin/page', [
            'closeAll'
        ]),
        ...mapActions('d2admin/account', [
            'logout'
        ]),
        /**
     * @description 登出
     */
        logOff () {
            this.$confirm('注销当前账户吗?', '确认操作', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.logout({
                    vm: this,
                    confirm: true
                })
                this.closeAll(this)
            }).catch(() => {
                console.log('取消退出')
            // this.$message({
            //     type: 'info',
            //     message: '已取消删除'
            // });
            })
        }
    }
}
</script>
