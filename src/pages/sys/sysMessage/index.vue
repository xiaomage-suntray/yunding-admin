<template>
  <d2-container>
    <div class="mod-user">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label='消息标题'>
          <el-input v-model="dataForm.msgTitle" placeholder="消息标题" clearable></el-input>
        </el-form-item>
        <el-form-item label='消息类型'>
          <el-select v-model="dataForm.msgType" placeholder="请选择">
            <el-option v-for="item in businessEnum" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='消息状态'>
          <el-select v-model="dataForm.msgState" placeholder="请选择">
            <el-option v-for="item in msgStateList" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label='消息时间'>
        <el-date-picker v-model="value6" type="daterange"  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
              :data="dataList"
              border
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">
        <!-- <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50">
        </el-table-column> -->
        <el-table-column
                prop="msgType"
                header-align="center"
                align="center"
                label="消息类型"
                :formatter="dateFormat">
        </el-table-column>
         <el-table-column
                prop="msgTitle"
                header-align="center"
                align="center"
                label="消息标题">
        </el-table-column>
        <el-table-column
                prop="msgState"
                header-align="center"
                align="center"
                label="消息状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.msgState === 1" size="small" type="info">未读</el-tag>
            <el-tag v-if="scope.row.msgState === 2" size="small" type="small">已读</el-tag>
          </template>
        </el-table-column>
        <el-table-column
                prop="msgCreateTime"
                header-align="center"
                align="center"
                label="消息发起时间">
        </el-table-column>
        <el-table-column
                prop="msgCreateDisposeTime"
                header-align="center"
                align="center"
                label="消息知会时间">
        </el-table-column>

        <el-table-column label='操作' prop='planUserName' align="center">
          <template slot-scope="scope" >
             <el-button v-if="scope.row.msgState === 1" type="text" size="small" @click="updateById(scope.row.id)" >知会</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              :current-page="pageIndex"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              :total="totalPage"
              layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>

    </div>
  </d2-container>
</template>

<script>

export default {
  name: 'sys-user',
  data () {
    return {
      dataForm: {},
      businessEnum: [],
      dataList: [],
      msgStateList: [{ 'key': '1', 'value': '未读' }, { 'key': '2', 'value': '已读' }],
      userBean: {},
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      value6: ''
    }
  },
  components: {

  },
  created () {
    this.getUserInit()
  },
  methods: {

    getUserInit () {
      this.$http({
        url: this.$http.adornUrl(`/sysMessage/getBusinessEnum`),
        method: 'post',
        data: this.$http.adornParams()
      }).then((data) => {
        if (data && data.code === 0) {
          this.businessEnum = data.list
          // 获取登录用户信息
          this.$http({
            url: this.$http.adornUrl(`/sys/user/infoOrgAndCompany`),
            method: 'get',
            params: this.$http.adornParams()
          }).then((data) => {
            if (data && data.code === 0) {
              this.userBean = data.user
              this.getDataList()
            }
          })
          this.businessEnum = data.list
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(`/sysMessage/list`),
        method: 'post',
        params: {
          'page': this.pageIndex,
          'limit': this.pageSize,
          'msgType': this.dataForm.msgType,
          'msgTitle': this.dataForm.msgTitle,
          'msgState': this.dataForm.msgState,
          'msgRecipientUserId': this.userBean.username,
          'msgCreateTimeStart': this.value6 === '' ? null : (new Date(this.value6[0])).getTime(),
          'msgCreateTimeEnd': this.value6 === '' ? null : (new Date(this.value6[1])).getTime()
        }
      }).then((data) => {
        this.dataList = data.page.list
        this.totalPage = data.page.totalCount
        this.dataListLoading = false
      })
    },
    updateById (id) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(`/sysMessage/updateById`),
        method: 'post',
        data: {
          'msgState': '2',
          'id': id
        }
      }).then((data) => {
        this.getDataList()
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1000,
          onClose: () => {
          }
        })
      })
    },
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
    }, // 审核
    shenhe (id, processInstanceId, businessKey, isAssignee, title) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, processInstanceId, businessKey, isAssignee, title)
      })
    },
    // 时间格式化
    dateFormat: function (row, column) {
      var type = row[column.property]
      var value = ''
      for (var i = 0; i < this.businessEnum.length; i++) {
        if (this.businessEnum[i].key === type * 1) {
          value = this.businessEnum[i].value
        }
      }
      return value
    }
  }
}
</script>
