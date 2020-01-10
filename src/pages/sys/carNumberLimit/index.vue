<template lang="pug">
d2-container
    el-row.btns
        el-button(size="small" type="primary" @click="nesCommodity({title:'限行编辑',type:1})") 新增
        el-button( type="success" size="small" @click="batchUpdate('statusSet-1')") 批量生效
        el-button( type="warning" size="small" @click="batchUpdate('statusSet-2')") 批量失效
        el-button( type="danger" size="small" @click="batchUpdate('deletes')") 批量删除

    el-row
        el-table(title="" ref="" :data="tableData" @selection-change="handleSelection" v-loading="isLoading")
            el-table-column(type="selection" fixed="left")
            el-table-column(v-for="(item,index) in tableHead" :prop="item.prop" :label="item.label" :width="item.width" :key="index")
            el-table-column(label="操作" fixed="right" width="250")
                template(slot-scope="scope")
                    el-button( v-if="scope.row.status === 2" type="success" size="small" @click="nesCommodity({title:'修改规则',type:2,data:scope.row})") 修改
                    el-button( v-if="scope.row.status === 2" type="success" size="small" @click="goodsUpdate(1,scope.row)") 生效
                    el-button( v-if="scope.row.status === 2" type="danger" size="small" @click="goodsDelete(scope.row)") 删除
                    el-button( v-if="scope.row.status === 1" type="warning" size="small" @click="goodsUpdate(2,scope.row)") 失效
        el-pagination(@size-change='sizeChangeHandle', @current-change='currentChangeHandle', :current-page='getListps.page', :page-sizes='[10, 20, 50, 100]', :total='getListps.pageSize', layout='total, sizes, prev, pager, next, jumper')

    el-dialog( v-if="dialogObj" :visible.sync="dialogObj.state" :fullscreen="false" :show-close="false" class="noPadding" :close-on-click-modal="false")
        el-row( type="flex" justify="end" )
            h5(style="width: 100%;font-size: 28px;margin: 0;") {{dialogObj.title}}
            el-button(@click="closeDialog" v-text="dialogObj.type == 3 ? '返 回' :' 取 消'")
            el-button(v-if="dialogObj.type == 0" type="primary" @click="goodsSave({type:0})") 更新
            el-button(v-if="dialogObj.type == 1" type="primary" @click.once="goodsSave({type:1})") 添加
            el-button(v-if="dialogObj.type == 2" type="primary" @click="goodsSave({type:2})") 保存
        el-tabs(v-model="activeTab" @tab-click="handleClick")
            el-tab-pane(label="表单" name="form")
                el-row(type="flex" justify="end")
                    el-form(label-width='80px' :model="pushData" ref="rulesPushData"  :rules="rules" :validate-on-rule-change="false")
                        el-col(:xs="24" :md="12" :lg="24")
                            el-form-item(label="城市:" )
                               el-select(v-model="pushData.cityNameList" multiple filterable remote reserve-keyword placeholder="请输入关键词"  :remote-method="remoteMethod" :loading="selectloading" style="width:100%")
                                    el-option(v-for="item in options4" :key="item.cityname" :label="item.cityname" :value="item.cityname")
                        el-col(:xs="24" :md="12" :lg="24")
                            el-form-item(label="时间段:")
                                el-date-picker(v-model="pushData.value4" type="daterange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期"  align="right")
                        el-col(:xs="24" :md="12" :lg="24")
                            el-form-item(label="限行规则:")
                                el-input(size="medium" v-model="pushData.rules"  type="textarea" :rows="2")
</template>
<script>
import { mapState } from 'vuex'
import { SysOrgList } from '@/api/sys/organize'
import moment from 'moment'

export default {
    data () {
        return {
            // 搜索结果存储
            arrListValue: '',
            cascader: [],
            selectloading: false,
            options4: [],
            pickerOptions2: {
                shortcuts: [{
                    text: '最近一周',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一个月',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三个月',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },
            handleList: [],
            rules: { },
            // table表结构
            tableHead: [
                { prop: 'cityname', label: '城市名称' },
                { prop: 'startTime', label: '限行开始时间' },
                { prop: 'endTime', label: '限行结束时间', type: 'icon' },
                { prop: 'rules', label: '限行规则', type: 'icon' },
                { prop: 'createDate', label: '编辑时间' }
            ],
            // 主页Table 展示表格
            tableData: [],
            // 提交数据
            pushData: {
                cityNameList: [],
                startTime: '',
                endTime: '',
                rules: '',
                createDate: new Date(),
                value4: []
            },
            dialogObj: {
                title: '',
                type: '',
                state: false
            },
            // 查询分页信息
            getListps: {
                page: 1,
                rows: 10,
                pageSize: 0
            },
            activeTab: 'form',
            isLoading: false, // table 加载状态
            dataList: [] // 审批列表
        }
    },
    computed: {
        ...mapState('d2admin/user', [
            'info'
        ])
    },
    components: {
    },
    mounted () {
        this.getDataList()
    },
    methods: {
        remoteMethod (query) {
            if (query !== '') {
                this.selectloading = true
                setTimeout(() => {
                    this.selectloading = false
                    this.$http({
                        url: this.$http.adornUrl(`/sysCity/list/`),
                        method: 'post',
                        params: { 'cityname': query, page: 1, rows: 10, pageSize: 0 }
                    }).then((data) => {
                        if (data && data.code === 0) {
                            this.options4 = data.page.list
                        }
                    })
                }, 200)
            } else {
                this.options4 = []
            }
        },

        uploadError () {
        },
        //
        closeDialog () {
            this.activeTab = 'form' // 初始化tab
            this.dialogObj.state = false
        },
        // 切换tab触发条件
        handleClick (tab, event) {
            console.log(tab, event)
        },
        // 每页数
        sizeChangeHandle (val) {
            debugger
            this.getListps.rows = val
            console.log('每页数', val)
            this.getSearch(this.$refs['txSearch'].formData.data)
        },
        // 当前页
        currentChangeHandle (val) {
            this.getListps.page = val
            console.log('当前页', val)
            this.getSearch(this.$refs['txSearch'].formData.data)
        },
        // 删除指定商品
        goodsDelete (val) {
            let data = [ val.id ]
            this.$http({
                url: this.$http.adornUrl('/carNumberLimit/delete'),
                method: 'post',
                data
            }).then(data => {
                // 成功操作
                if (data.msg === 'success') {
                    this.getDataList()
                    this.$message({
                        message: '删除成功！',
                        type: 'success'
                    })
                }
            })
        },
        // 获取商品列表
        getDataList (vl) {
            let pushDate = this.getListps, params = {}
            this.isLoading = true
            if (vl && vl.type === 'search') {
                Object.assign(params, pushDate, vl.data)
            } else {
                params = pushDate
            }
            console.log(params, 'paramsparams')
            this.$http({
                url: this.$http.adornUrl('/carNumberLimit/list'),
                method: 'post',
                params
            }).then((data) => {
                this.isLoading = false
                this.tableData = data.page.list
                this.getListps.pageSize = data.page.total
                console.log(data.page.rows, 'data')
            })
        },
        // 新增修改商品
        goodsSave (val) {
            this.$refs['rulesPushData'].validate((valid) => {
                if (valid) {
                    let url = '', msg = '', data = this.pushData
                    data.startTime = moment(data.value4[0]).format('YYYY-MM-DD ')
                    data.endTime = moment(data.value4[1]).format('YYYY-MM-DD')
                    // 清除返回的无效参数
                    delete data.value4
                    delete data.createDate
                    delete data.createdUserId
                    if (val.type === 1) {
                        url = this.$http.adornUrl(`/carNumberLimit/save`)
                        msg = '成功添加限行规则'
                    }
                    if (val.type === 2) {
                        data.cityname = data.cityNameList[0]
                        delete data.cityNameList
                        url = this.$http.adornUrl(`/carNumberLimit/update`)
                        msg = '成功修改限行规则'
                    }
                    this.$http({
                        url,
                        method: 'post',
                        data: data
                    }).then((data) => {
                        // 成功操作
                        if (data.msg === 'success') {
                            this.getDataList()
                            this.$message({
                                message: msg,
                                type: 'success'
                            })
                            this.dialogObj.state = false
                        }
                    })
                }
            })
        },
        // 表格选中事件
        handleSelection (val) {
            this.handleList = val
            // console.log(this.handleList,'handleSelectionhandleSelectionhandleSelection')
        },
        goodsUpdate (status, row) {
            var data = {}
            data.status = status
            data.id = row.id
            var url = this.$http.adornUrl(`/carNumberLimit/update`)
            var msg = '成功修改限行规则'
            this.$http({
                url,
                method: 'post',
                data: data
            }).then((data) => {
                // 成功操作
                if (data.msg === 'success') {
                    this.getDataList()
                    this.$message({
                        message: msg,
                        type: 'success'
                    })
                }
            })
        },

        // 弹出dialog
        nesCommodity (val) {
            // 添加创建人
            this.dialogObj = {
                title: val.title,
                type: val.type,
                state: true
            }
            if (val.type === 1) {
                this.dataList = []
                // 新增清空数据
                this.pushData = {
                    cityNameList: [],
                    startTime: '',
                    endTime: '',
                    rules: '',
                    createDate: new Date(),
                    value4: []
                }
                this.dataList = []
                this.historyDataList = []
                this.cascader = []
                this.tableNameBj = ''
                this.pushData.createdUserId = this.info.name
            }
            if (val.type === 2) {
                this.pushData = {
                    id: '',
                    cityNameList: [],
                    startTime: '',
                    endTime: '',
                    rules: '',
                    value4: []
                }
                this.pushData.cityNameList = [val.data.cityname]
                this.pushData.value4[0] = val.data.startTime
                this.pushData.value4[1] = val.data.endTime
                this.pushData.rules = val.data.rules
                this.pushData.id = val.data.id
            }
        },
        batchUpdate (type) {
            if (this.handleList.length === 0) {
                this.$message({
                    message: '请先选择需要操作的数据',
                    type: 'error',
                    duration: 1000
                })
            }
            var ids = this.handleList.map(item => {
                return item.id
            })
            if (type === 'statusSet-1') {
                this.$confirm(`确定要进行批量生效操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/carNumberLimit/bachUpdate'),
                        method: 'post',
                        data: { 'ids': ids, status: 1 }
                    }).then((data) => {
                        if (data && data.code === 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.getDataList()
                                }
                            })
                        } else { this.$message.error(data.msg) }
                    })
                }).catch(() => {

                })
            } else if (type === 'statusSet-2') {
                this.$confirm(`确定要进行批量失效操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/carNumberLimit/bachUpdate'),
                        method: 'post',
                        data: { 'ids': ids, status: 2 }
                    }).then((data) => {
                        if (data && data.code === 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.getDataList()
                                }
                            })
                        } else { this.$message.error(data.msg) }
                    })
                }).catch(() => {

                })
            } else {
                this.$confirm(`确定要进行批量删除操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/carNumberLimit/delete'),
                        method: 'post',
                        data: ids
                    }).then((data) => {
                        if (data && data.code === 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.getDataList()
                                }
                            })
                        } else { this.$message.error(data.msg) }
                    })
                }).catch(() => {

                })
            }
        }
    }
}
</script>
<style lang="scss">
.el-width100 {
    width:100px;
}
.btns {
    margin-top: 30px;
}

.el-dialog__title {
    font-size: 32px;
    opacity: .9;
}

.noPadding {
    .el-dialog__header {
        padding: 0;
    }
}
</style>
