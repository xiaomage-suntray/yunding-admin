<template lang="pug">
  d2-container
    el-form(:inline="true", :model="form", ref="form")
      el-form-item(label="岗位名称", prop="orgName")
        el-input(v-model="form.orgName", placeholder="岗位名称")
      el-form-item
        el-button(@click="getDataList")
          d2-icon(name='search')
          | 查询
        el-button(type="primary", @click='handleEdit()') 新增
        el-button(type="danger", @click='handleDel()', :disabled='dataListSelections.length <= 0') 批量删除
    <!--div {{ dataList }}-->
    el-table(:data="dataList", border,v-loading="loading",@selection-change='selectionChangeHandle')
      el-table-column(type='selection', header-align='center', align='center', width='50')
      el-table-column(width="100", label="id", prop="orgId", :show-overflow-tooltip="true")
      table-tree-column(label="岗位名称", prop="orgName", treeKey='orgId')
      el-table-column(label='等级', prop='_level')
      el-table-column(label='排序', prop='sort')
      el-table-column(label='操作')
        template(slot-scope='scope')
          el-button(@click.native.prevent="handleEdit(scope.row.orgId)", type="text", size="small") 修改
          el-button(@click.native.prevent="handleDel(scope.row.orgId)", type="text", size="small") 删除
    add-or-update(:treeList='dataList', @refreshDataList='getDataList', ref="addOrUpdate" )
</template>

<script>
import { SysOrgList, SysOrgDelete } from '@/api/sys/organize'
import TableTreeColumn from '@/components/table-tree-column'
import { treeDataTranslate } from '@/util'

export default {
  components: {
    TableTreeColumn,
    AddOrUpdate: () => import('./add-or-update')
  },
  data () {
    return {
      form: {
        orgName: ''
      },
      dataList: [],
      dataListSelections: [],
      loading: false
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 or 修改
    handleEdit (orgId) {
      this.$refs.addOrUpdate.init(orgId)
    },
    handleDel (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.orgId
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        SysOrgDelete(ids).then(res => {
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
      SysOrgList({
        page: 1,
        limit: 999,
        ...this.form
      }).then(res => {
         console.log(res)
        this.loading = false
        const list = res.page.list
        this.dataList = treeDataTranslate(list, 'orgId')
      }).catch(r => {
        this.loading = false
      })
    }
  }
}
</script>

<style>
</style>
