<template lang="pug">
  d2-container
    el-form(:inline="true", :model="dataForm", ref="dataForm")
      el-form-item(label="用户名", prop="username")
        el-input(v-model="dataForm.username", placeholder="用户名")
      el-form-item(label="用户操作", prop="operation")
        el-input(v-model="dataForm.operation", placeholder="用户操作")
      el-form-item(label="创建时间")
        el-date-picker(size="medium" v-model="tableLevel.dateInitialization" @change="dateInitialization" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']")
      el-form-item
        el-button(@click="getDataList")
          d2-icon(name='search')
          | 查询
    <!--div {{ dataList }}-->
    el-table(:data="dataList", border,v-loading="loading",@selection-change='selectionChangeHandle')
      el-table-column(type='selection', header-align='center', align='center', width='50')
      el-table-column(label="ID" v-if='show' prop="id")
      el-table-column(label='用户名', prop='username')
      el-table-column(label='用户操作', prop='operation')
      el-table-column(label='请求方法', prop='method' show-overflow-tooltip=true)
      el-table-column(label='请求参数', prop='params' show-overflow-tooltip=true)
      el-table-column(label='执行时长(ms)', prop='time')
      el-table-column(label='ip地址', prop='ip')
      el-table-column(label='创建时间', prop='createDate')
    el-pagination(@size-change='sizeChangeHandle', @current-change='currentChangeHandle', :current-page='pageIndex', :page-sizes='[10, 20, 50, 100]', :page-size='pageSize', :total='totalPage', layout='total, sizes, prev, pager, next, jumper')
</template>

<script>

export default {
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataForm: {
        username: '',
        operation: '',
        createTimeStar: '',
        createTimeEnd:''
      },
      dataList: [],
      dataListSelections: [],
      loading: false,
      //
      tableLevel: {
        level: '',
        disable: true,
        level2: [],
        dateInitialization: ''
      }
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
    handleEdit (orgId) {
      this.$refs.addOrUpdate.init(orgId)
    },
    // 获得岗位数据
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/log/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'rows': this.pageSize,
          'username':this.dataForm.username,
          'operation':this.dataForm.operation,
          'createTimeStar':this.dataForm.createTimeStar,
          'createTimeEnd':this.dataForm.createTimeEnd
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
    },
    // 时间格式化
    dateInitialization (val) {
      console.log(val)
      if (val) {
        console.log(val[1])
        this.dataForm.createTimeStar = Date.parse(val[0])
        this.dataForm.createTimeEnd = Date.parse(val[1])
        return
      }
      this.dataForm.createTimeStar = this.dataForm.createTimeEnd = null
    },
  }
}
</script>

<style>
</style>
