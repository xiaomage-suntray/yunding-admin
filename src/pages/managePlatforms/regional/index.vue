<template lang="pug">
    d2-container
        div(style="padding:30px 0 20px")
            el-button(type="primary" @click="openDialog()") 添加
        el-table(ref="multipleTable" border :data="typeList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange")
            el-table-column(type="selection" width="60")
            table-tree-column(label="名称", prop="name", treeKey='id' parentKey='parentId')
            el-table-column(label="创建时间" )
                template(slot-scope="scope") {{ scope.row.createdTime }}
            el-table-column(label="操作" width="150")
                template(slot-scope='scope')
                    el-button(@click.native.prevent="openDialog(scope.row)", type="text" size="small") 编辑
                    el-button(@click.native.prevent="sysAreaDelete(scope.row)", type="text" size="small") 删除
        el-dialog( title="区域管理" :visible.sync="dialogForm")
            el-form(:modle="addTypeName")
                el-form-item(label="名称" :label-width="formLableWidth")
                    el-input(v-model="addTypeName.name" autocomplete="off")
                    //el-input(type="hidden" v-model="addTypeName.goodsClassNumber" autocomplete="off")
                el-form-item(label="一级栏目名称" :label-width="formLableWidth")
                    el-select.el-width100(size="medium" v-model="addTypeName.parentId" placeholder="一级分类" :disabled="disableTrue")
                        el-option(v-for="item in typeList" :label="item.name" :value="item.id.toString()")

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
                name: ' ',
                parentId: '',
                id: ''
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
                    name: val.name,
                    parentId: val.parentId,
                    id: val.id
                }
            }
            this.disableTrue = !!val
            this.dialogForm = true
        },
        sysAreaDelete (val) {
            let data = { id: val.id }
            this.$http({
                url: this.$http.adornUrl(`/sysArea/delete`),
                method: 'post',
                data
            }).then((data) => {
                this.getTableData()
                this.$message({
                    message: '删除成功！',
                    type: 'success'
                })
            })
        },
        getTableData () {
            this.$http({
                url: this.$http.adornUrl(`/sysArea/list`),
                method: 'post'
            }).then((data) => {
                this.typeList = data.result
                console.log('data', data)
            })
        },
        addType () {
            this.disableTrue ? delete this.addTypeName.parentId : delete this.addTypeName.id
            let data = this.addTypeName,
                msg = this.disableTrue ? '修改成功！' : '添加成功',
                url = this.disableTrue ? this.$http.adornUrl(`/sysArea/update`) : this.$http.adornUrl(`/sysArea/save`)

            this.$http({
                url,
                method: 'post',
                data
            }).then((data) => {
                console.log('data', data)
                this.$message({
                    message: msg,
                    type: 'success'
                })
                this.closeDialog()
                this.getTableData()
            })
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
    .el-width100{
        width: 100%;
    }
</style>
