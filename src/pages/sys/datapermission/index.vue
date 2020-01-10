<template lang="pug">
  d2-container
    el-form(:inline="true", :model="form", ref="form")
      el-form-item(label="权限名称", prop="name")
        el-input(v-model="form.name", placeholder="请输入权限名称")
      el-form-item
        el-button(type="primary", @click="getDataList")
          d2-icon(name='search')
          | 查询
        el-button(type="primary", @click='handleEdit()') 新增
        el-button(type="danger", @click='handleDel()') 批量删除
    el-table(:data="dataList", border, v-loading="loading", @selection-change='selectionChangeHandle')
      el-table-column(type='selection', header-align='center', align='center', width='50')
      el-table-column(width="100", label="id", prop="datapermissionId", :show-overflow-tooltip="true")
      el-table-column(label='权限名称', prop='name')
      el-table-column(label='动态参数', prop='addparam')
      el-table-column(prop='status', header-align='center', align='center', label='状态')
        template(slot-scope='scope')
            el-tag(v-if='scope.row.status === 0', size='small', type='danger') 禁用
            el-tag(v-else='', size='small') 正常
      el-table-column(label='创建时间', prop='createTime')
      el-table-column(width="200", label="备注", prop="remark", :show-overflow-tooltip="true")
      el-table-column(label='操作')
        template(slot-scope='scope')
          el-button(@click.native.prevent="handleEdit(scope.row.datapermissionId)", type="text", size="small") 修改
          el-button(@click.native.prevent="handleDel(scope.row.datapermissionId)", type="text", size="small") 删除
    el-pagination(@size-change='sizeChangeHandle', @current-change='currentChangeHandle', :current-page='pageIndex', :page-sizes='[10, 20, 50, 100]', :page-size='pageSize', :total='totalPage', layout='total, sizes, prev, pager, next, jumper')
    add-or-update(:treeList='dataList', @refreshDataList='getDataList', ref="addOrUpdate" )
</template>

<script>
import { SysDatapermissionList, SysDatapermissionDelete } from '@/api/sys/datapermission'

export default {
  components: {
    AddOrUpdate: () => import('./add-or-update')
  },
  data () {
    return {
      form: {
        orgName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListSelections: [],
      loading: false
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 or 修改
    handleEdit (datapermissionId) {
      this.$refs.addOrUpdate.init(datapermissionId)
    },
    handleDel (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.datapermissionId
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        SysDatapermissionDelete(ids).then(res => {
          if (res && res.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          }
        })
      })
    },
    // 获得岗位数据
    getDataList () {
      this.loading = true
      SysDatapermissionList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        ...this.form
      }).then(res => {
        this.loading = false
        if (res && res.code === 0) {
          this.dataList = res.page.list
          this.totalPage = res.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    }
  }
}
</script>

<style>
</style>
