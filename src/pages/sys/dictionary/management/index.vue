<template lang="pug">
  d2-container
    el-form(:inline="true", :model="dataForm", ref="dataForm")
      el-form-item(label="字典名称", prop="dictionaryName")
        el-input(v-model="dataForm.dictionaryName", placeholder="字典名称")
      el-form-item(label="字典类型", prop="dictionaryCalss")
        el-input(v-model="dataForm.dictionaryCalss", placeholder="字典类型")
      el-form-item(label="字典编码", prop="dictionaryCode")
        el-input(v-model="dataForm.dictionaryCode", placeholder="字典编码")
      el-form-item
        el-button(@click="getDataList")
          d2-icon(name='search')
          | 查询
        el-button(type="primary", @click='handleEdit()') 新增
    <!--div {{ dataList }}-->
    el-table(:data="dataList", border,v-loading="loading",@selection-change='selectionChangeHandle')
      el-table-column(type='selection', header-align='center', align='center', width='50')
      el-table-column(label="ID" v-if='show' prop="id")
      el-table-column(label='字典名称', prop='dictionaryName')
      el-table-column(label='字典类型', prop='dictionaryCalss')
      el-table-column(label='字典编码', prop='dictionaryCode')
      el-table-column(label='操作')
        template(slot-scope='scope')
          el-button(@click.native.prevent="handleEdit(scope.row.id)", type="text", size="small") 修改
    el-pagination(@size-change='sizeChangeHandle', @current-change='currentChangeHandle', :current-page='pageIndex', :page-sizes='[10, 20, 50, 100]', :page-size='pageSize', :total='totalPage', layout='total, sizes, prev, pager, next, jumper')

    add-or-update(v-if='addOrUpdateVisible',:treeList='dataList', @refreshDataList='getDataList', ref="addOrUpdate" )
    
</template>

<script>

import AddOrUpdate from './add-or-update'

export default {
  components: {
    AddOrUpdate
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataForm: {
        dictionaryName: '',
        dictionaryCalss: '',
        dictionaryCode: ''
      },
      dataList: [],
      dataListSelections: [],
      loading: false,
      addOrUpdateVisible: false
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
    handleEdit (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 获得岗位数据
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sysDictionary/list'),
        method: 'post',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'rows': this.pageSize,
          'dictionaryName':this.dataForm.dictionaryName,
          'dictionaryCalss':this.dataForm.dictionaryCalss,
          'dictionaryCode':this.dataForm.dictionaryCode
        })
      }).then((data) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
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
