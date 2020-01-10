<template lang="pug">
    d2-container.page
        d2-page-cover(v-if="false" title="I AM SUNTRAY ADMIN" sub-title="追求简约美感的后台管理系统集成方案")
            img(src="../../../public/image/logo-tx.png" alt="logo")
            template(slot="footer")
        el-carousel(trigger="click" height="260px" style="margin-bottom:30px")
            el-carousel-item(v-for="item in banner" :key="item.name")
                img(:src='item.src' style= "width: 100%; height: 100%;")
        <!--div(v-text="{1:'发标人',2:'供应商'}[userOrType]")-->
        el-row(:gutter="20")
            el-col.min-width(:lg="8" :md="24" :sm="24" :xs="24")
                el-card.box-card
                    .clearfix(slot="header")
                        span 待办任务
                        router-link.move(:to="{path: '/sys/flow/tasks'}") 更多
                    .text
                        ul(v-loading="agent.dataListLoading")
                            li.list(v-for='(item,index) in agent.data' :key="index")
                                el-row(:gutter="20")
                                    el-col.blod.textHidden(:span="12")
                                        router-link(v-if="item.taskDefinitionKey.indexOf('F100') === -1"  :to="{name: 'sys-user-tasks', params: {queryId: item,type: 3}}" :title="addr(item)" v-text="addr(item)")
                                        router-link(v-if="item.taskDefinitionKey.indexOf('F100')!== -1"   :to="{name: 'sys-user-tasks', params: {queryId: item,type: 2}}" :title="addr(item)" v-text="addr(item)")
                                    el-col.size12.time(:span="5") {{item.createUserName}}
                                    el-col.size12.time(:span="7") {{item.createTime}}
                        el-pagination.pagination(small, @size-change='sizeChangeHandle(3,$event)', @current-change='currentChangeHandle(3,$event)', :current-page='agent.pageIndex', :page-sizes='[10]', :page-size='agent.pageSize', :total='agent.totalPage', layout='total, sizes, prev, pager, next, jumper')
            el-col.min-width(:lg="8" :md="24" :sm="24" :xs="24")
                el-card.box-card
                    .clearfix(slot="header")
                        span 系统消息
                        router-link.move(:to="{path: '/sys/flow/sysMessage'}") 更多
                    .text
                        ul(v-loading="sysMessageList.dataListLoading")
                            li.list(v-for='(item,index) in sysMessageList.data' :key="index")
                                el-row(:gutter="20")
                                    el-col.blod.textHidden(:span="14" :title="item.msgTitle") {{item.msgTitle}}
                                    el-col.size12.time(:span="3")
                                        font(@click="updateById(item.id)" style="height:25px;line-height:25px;color:#409EFF;") 知会
                                    el-col.size12.time(:span="7") {{item.msgCreateTime}}
                        el-pagination.pagination(small, @size-change='sizeChangeHandle(4,$event)', @current-change='currentChangeHandle(4,$event)', :current-page='sysMessageList.pageIndex', :page-sizes='[10]', :page-size='sysMessageList.pageSize', :total='sysMessageList.totalPage', layout='total, sizes, prev, pager, next, jumper')
            el-col.min-width(:lg="8" :md="24" :sm="24" :xs="24")
                el-card.box-card
                    .clearfix(slot="header")
                        span.title 招标公告
                            b Bidding Announcement

                    .text
                        ul(v-loading="dataListZb.dataListLoading")
                            li.list(v-for='(item,index) in dataListZb.data' :key="index")
                                el-row(:gutter="20")
                                    el-col.blod(:span="14")
                                        router-link(:to="{name: 'attract_bid-index', params: {queryId: item,userOrType}}" v-text="item.projectName" :title="item.projectName")
                                    el-col.size12.status(:span="3" :style="{3:'color:#FCA00D',4:'color:#FF3823'}[item.status]" v-text="{3:'进行中',4:'已结束'}[item.status]")
                                    el-col.size12.time(:span="7") {{item.createdTime}}
                        el-pagination.pagination( @size-change='sizeChangeHandle(1,$event)', @current-change='currentChangeHandle(1,$event)', :current-page='dataListZb.pageIndex', :page-sizes='[10]', :page-size='dataListZb.pageSize', :total='dataListZb.totalPage', layout='total, sizes, prev, pager, next, jumper')
            el-col.min-width(:lg="8" :md="24" :sm="24" :xs="24")
                el-card.box-card
                    .clearfix(slot="header")
                        span.title 询价
                            b Price
                    .text
                        ul(v-loading="dataListBj.dataListLoading")
                            li.list(v-for='(item,index) in dataListBj.data' :key="index")
                                el-row(:gutter="20")
                                    el-col.blod(:span="14")

                                        router-link(:to="{name: 'inquireInto-index', params: {queryId: item,userOrType}}" v-text="item.projectName" :title="item.projectName")
                                    el-col.size12.status(:span="3" :style="{3:'color:#FCA00D',4:'color:#FF3823'}[item.status]" v-text="{3:'进行中',4:'已结束'}[item.status]")
                                    el-col.size12.time(:span="7") {{item.createdTime}}
                        el-pagination.pagination(@size-change='sizeChangeHandle(2,$event)', @current-change='currentChangeHandle(2,$event)', :current-page='dataListBj.pageIndex', :page-sizes='[10]', :page-size='dataListBj.pageSize', :total='dataListBj.totalPage', layout='total, sizes, prev, pager, next, jumper')
</template>

<script>
import D2HelpBtn from './components/d2-help-btn'
import D2Badge from './components/d2-badge'

export default {
    components: {
        D2HelpBtn,
        D2Badge
    },
    data () {
        return {
            userOrType: '',
            banner: [// 轮播
                {
                    name: '轮播1',
                    src: '/image/banner01.jpg'
                },
                {
                    name: '轮播2',
                    src: '/image/banner02.jpg'
                }],
            sysMessageList: { // 系统消息
                data: [], // 数据
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false
            },
            dataListZb: { // 招标公告
                data: [], // 数据
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false
            },
            dataListBj: { // 询比价
                data: [], // 数据
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false
            },
            agent: { // 代办
                data: [], // 数据
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false
            },
            websock: null
        }
    },
    created () {
        // 页面刚进入时开启长连接
        this.initWebSocket()
    },
    mounted () {
        this.getSysMessage()
    },
    destroyed: function () {
    // 页面销毁时关闭长连接
        this.websocketclose()
    },
    methods: {
        addr (row) {
            let date = row.activitiyTitleValue
            if (date === undefined) {
                return row.activitiyTypeValue
            } else {
                return row.activitiyTitleValue
            }
        },
        // 系统消息
        getSysMessage () {
            debugger
            this.sysMessageList.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl(`/sysMessage/list`),
                method: 'post',
                params: {
                    'page': this.sysMessageList.pageIndex,
                    'limit': this.sysMessageList.pageSize,
                    'msgState': 1
                }
            }).then(data => {
                this.sysMessageList.data = data.page.list
                this.sysMessageList.totalPage = data.page.totalCount
                this.sysMessageList.dataListLoading = false
            })
        },
        // 获取代办任务
        getInfoOrg () {
            this.agent.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl(`/sys/user/infoOrgAndCompany`),
                method: 'get'
            }).then(data => {
                if (!data || !data.user) return
                this.userOrType = data.user.type
                return this.$http({
                    url: this.$http.adornActivityUrl('/activity/findTasksByUserName'),
                    method: 'post',
                    data: {
                        'page': this.agent.pageIndex,
                        'rows': this.agent.pageSize,
                        'userId': data.user.userId,
                        'userName': data.user.username
                    }
                })
            }).then(res => {
                if (!res || !res.page) return
                this.agent.data = res.page.rows
                this.agent.totalPage = res.page.total
                this.agent.dataListLoading = false
                console.log(res)
            })
        },

        // 每页数
        sizeChangeHandle (val, d2) {
            if (val === 1) {
                this.dataListZb.pageSize = d2
                this.dataListZb.pageIndex = 1
            }
            if (val === 2) {
                this.dataListBj.pageSize = d2
                this.dataListBj.pageIndex = 1
            }
            if (val === 4) {
                this.sysMessageList.pageSize = d2
                this.sysMessageList.pageIndex = 1
                this.getSysMessage()
                return
            }
            if (val === 3) {
                this.agent.pageSize = d2
                this.agent.pageIndex = 1
                this.getInfoOrg()
                return
            }
            this.getIndexList(val)
        },
        // 当前页
        currentChangeHandle (val, d2) {
            debugger
            if (val === 1) {
                this.dataListZb.pageIndex = d2
            }
            if (val === 2) {
                this.dataListBj.pageIndex = d2
            }
            if (val === 4) {
                this.sysMessageList.pageIndex = d2
                this.getSysMessage()
                return
            }
            if (val === 3) {
                console.log(val, d2)
                this.agent.pageIndex = d2
                this.getInfoOrg()
                return
            }
            this.getIndexList(val)
        },

        // 获取列表
        getIndexList (num = 1) {

        },
        initWebSocket () { // 初始化weosocket
            // 获取用户登录信息
            this.$http({
                url: this.$http.adornUrl(`/sys/user/info`),
                method: 'get',
                params: this.$http.adornParams()
            }).then((data) => {
                if (data && data.code === 0) {
                    const wsuri = process.env.VUE_APP_API + '/websocket/commodity/{' + data.user.username + '}/{1212}'// ws地址
                    this.websock = new WebSocket(wsuri.replace('http', 'ws'))
                    this.websock.onopen = this.websocketonopen
                    this.websock.onerror = this.websocketonerror
                    this.websock.onmessage = this.websocketonmessage
                    this.websock.onclose = this.websocketclose
                }
            })
        },

        websocketonopen () {
            console.log('WebSocket连接成功')
        },
        websocketonerror (e) { // 错误
            console.log('WebSocket连接发生错误')
        },
        websocketonmessage (e) { // 数据接收
            const redata = e.data
            this.open(redata)
            // 注意：长连接我们是后台直接1秒推送一条数据，
            // 但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
            // 这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
            console.log(redata)
        },
        open (redata) {
            // const h = this.$createElement

            //   this.$notify({
            //  title: '您有新的任务',
            //    message: h('i', { style: 'color: teal' }, redata)
            //  })

            this.$notify({
                title: '您有新的消息',
                message: redata,
                duration: 0
            })
        },

        websocketsend (agentData) { // 数据发送
            this.websock.send(agentData)
        },

        websocketclose (e) { // 关闭
            console.log('connection closed ()')
        },
        updateById (id) {
            this.$http({
                url: this.$http.adornUrl(`/sysMessage/updateById`),
                method: 'post',
                data: {
                    'msgState': '2',
                    'id': id
                }
            }).then((data) => {
                this.getSysMessage()
                this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1000,
                    onClose: () => {
                    }
                })
            })
        }
    }
}
</script>

<style lang="scss">
    @import '~@/assets/style/public.scss';

    .page {
        ul {
            padding: 0;
            margin: 0;
        }
        li {
            list-style: none;
            font-size: 16px;
        }
        a {
            margin-left: 5px;
        }
        .blod {
            font-weight: bold;
        }
        .list {
            padding: 5px 20px;
            line-height: 25px;
            a {
                color: black;
            }
            .time {
                color: rgba(0, 0, 0, .5);
            }

        }
        .page__btn-group {
            color: $color-text-placehoder;
            font-size: 12px;
            margin-top: -10px;
            margin-bottom: 20px;
            span {
                color: $color-text-sub;
                &:hover {
                    color: $color-text-main;
                }
            }
        }
        .min-width {
            min-width: 495px;
        }
        .box-card {
            min-height: 465px;
            position: relative;
            .el-card__body {
                padding: 0;
            }
            .size12 {
                font-size: 12px;
            }
            .title {
                b {
                    margin-left: 10px;
                    font-weight: 200;
                    color: #D3B68F;
                    font-size: 16px;
                }
            }
            .move {
                float: right;
                padding: 3px 0;
                color: #A9A9A9;
                font-size: 14px;
            }
        }
        .pagination {
            padding-bottom: 10px;
            position: absolute;
            bottom: 5px;
            right: 15px;
        }
        .textHidden {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
</style>
