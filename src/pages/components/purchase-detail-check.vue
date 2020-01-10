<template lang="pug">
    #purchase-detail-check
        el-row
            el-col(:span="24" style="font-size: 20px;line-height: 40px;margin: 15px 0;") {{formData.userBean.name}}
            el-col(:span="24")
                el-form(label-width='120px' :model='formData')
                    el-row(:gutter="20" style="text-align:left;")
                        el-col(:span="8" v-if="formData.userBean.structure && formData.userBean.structure.length > 0" v-for="(item,index) in formData.userBean.structure" :key="item.prop")
                            el-form-item(:label='item.label' :prop='item.prop' label-width="210px") {{formData.userBean.data[item.prop]}}




        el-row
            el-col(:span="24" style="font-size: 20px;line-height: 40px;margin: 15px 0;") {{formData.form.name}}
            el-col(:span="24")
                tx-table(:tableData="formData.form" ref="txTable")
                el-pagination(@size-change='sizeChangeHandle' @current-change='currentChangeHandle'
                :current-page='formData.form.getListps.page' :page-sizes='[10, 20, 50, 100]' :page-size='formData.form.getListps'
                :total='formData.form.getListps.pageSize' layout='total, sizes, prev, pager, next, jumper')
</template>
<script>
    import TxTable from '@/pages/sys/components/table'
    export default {
        data() {
            return {
                activeTab: 'form', // tab默认显示的标签
                dataList: [], // 审批列表
                loading: false,
                captchaPath: '', // 流程地址
                detailsLoading: false,
                details: [],
                visible: false,

            }
        },
        mounted() {
            // this.init()
        },
        created() {
        },
        components:{
            TxTable
        },
        props: ['formData'],
        methods: {

            // 每页数
            sizeChangeHandle(val) {
                this.$emit('sizeChange',val)
                this.pageSize = val
                this.pageIndex = 1
                this.getDataList()
            }, // 当前页
            currentChangeHandle(val) {
                this.$emit('currentChange',val)
                this.pageIndex = val
                this.getDataList()
            }
        }
    }
</script>
