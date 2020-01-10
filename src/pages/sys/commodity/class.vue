<template lang="pug">
    d2-container
        div(style="padding:30px 0 20px")
            el-button(type="primary" @click="openDialog()") 添加
            <!--el-button(type="danger" :disabled="multipleSelection.length === 0" @click="tableDelete" ) 删除-->
        el-table(ref="multipleTable" border :data="typeList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange")
            el-table-column(type="selection" width="60")
            table-tree-column(label="名称", prop="goodsClassName", treeKey='id' parentKey='goodsClassParentid')
            el-table-column(label="编号" prop="goodsClassNumber" )
            el-table-column(label="创建时间" )
                template(slot-scope="scope") {{ scope.row.createdTime }}
            el-table-column(label="创建人" width="150" prop="thename" show-overflow-tooltip)
            el-table-column(label="操作" width="150")
                template(slot-scope='scope')
                    el-button(@click.native.prevent="openDialog(scope.row)", type="text" size="small") 编辑
        el-dialog( title="添加商品" :visible.sync="dialogForm")
            el-form(:modle="addTypeName")
                el-form-item(label="名称" :label-width="formLableWidth")
                    el-input(v-model="addTypeName.goodsClassName" autocomplete="off")
                    //el-input(type="hidden" v-model="addTypeName.goodsClassNumber" autocomplete="off")
                el-form-item(label="一级栏目名称" :label-width="formLableWidth")
                    el-select.el-width100(size="medium" v-model="addTypeName.goodsClassParentid" placeholder="一级分类" @change="formUpdate(addTypeName.goodsClassParentid)" :disabled="disableTrue")
                        el-option(v-for="item in typeList" :label="item.goodsClassName" :value="item.id.toString()")

            div(slot="footer" class="dialog-footer")
                el-button(@click="closeDialog") 取 消
                el-button(type="primary" @click="addType") 确 定

</template>

<script>
import TableTreeColumn from '@/components/table-tree-column'
import { mapActions } from 'vuex'

export default {
    components: {
        TableTreeColumn
    },
    data () {
        return {
            // 添加商品分类
            addTypeName: {
                goodsClassName: null,
                goodsClassParentid: null,
                goodsClassNumber: null
            },
            // 表格数据
            typeList: [{
                createdTime: '2016-05-03',
                goodsClassNumber: '01001',
                goodsClassName: '印刷品',
                thename: '张三'
            }],
            // 弹出框状态
            dialogForm: false,
            // 添加数据表单
            addForm: {
                name: '',
                code: '',
                date: '',
                address: ''
            },
            // 宽度
            formLableWidth: '120px',
            // 选中数据
            multipleSelection: [],
            // dsable 是否禁用
            disableTrue: false
        }
    },
    mounted () {
        this.getTableData()
    },
    methods: {
        ...mapActions('d2admin/menu', [
            'asideCollapseOpen'
        ]),
        // 关闭dialog
        closeDialog () {
            this.dialogForm = false
            this.addTypeName = {
                goodsClassName: '',
                goodsClassParentid: '',
                goodsClassNumber: ''
            }
        },
        openDialog (val) {
            if (val) {
                this.addTypeName = {
                    goodsClassName: val.goodsClassName,
                    goodsClassParentid: val.goodsClassParentid,
                    goodsClassNumber: val.goodsClassNumber,
                    id: val.id
                }
            } else {
                this.addTypeName.goodsClassName = ''
            }

            this.disableTrue = !!val
            this.dialogForm = true
        },
        formUpdate (val) {
            this.typeList.map(res => {
                if (res.id === val) {
                    this.addTypeName.goodsClassNumber = res.goodsClassNumber.toString()
                }
            })
        },
        getTableData () {
            this.$http({
                url: this.$http.adornUrl(`/goodsClass/getGoodsTree`),
                method: 'get'
            }).then((data) => {
                this.typeList = data.result
                console.log('data', data)
            })
        },
        addType () {
            let data = this.disableTrue ? {
                id: this.addTypeName.id,
                goodsClassName: this.addTypeName.goodsClassName,
                goodsClassParentid: this.addTypeName.goodsClassParentid
            } : this.addTypeName
            let _url = this.disableTrue ? this.$http.adornUrl(`/goodsClass/update`) : this.$http.adornUrl(`/goodsClass/save`)
            console.log(_url, 'this.addType')

            this.$http({
                url: _url,
                method: 'post',
                data
            }).then((data) => {
                console.log('data', data)
                if (data.result && typeof data.result === 'string') {
                    console.log(this.$message.error(data.result))
                    return
                }
                // 取消deglog
                this.closeDialog()
                this.getTableData()
            }).catch(err => {
                this.$message.error(err.result)
            })
        },
        tableDelete () {
            this.multipleSelection.map(res => {
                console.log(res.code)
                reso(res.code)
            })
            let reso = () => {
                console.log(this.tableData3, 'this.tableData3')
                // this.tableData3.map(resc =>{
                //     console.log(resc,'22')
                // })
            }
            // console.log(this.multipleSelection)
            // 先训话选中条数
        },
        toggleSelection (rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row)
                })
            } else {
                this.$refs.multipleTable.clearSelection()
            }
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
            console.log(this.multipleSelection, 'this.multipleSelection')
        }
    }
}
</script>
<style>
    .el-width100 {
        width: 100%;
    }
</style>
