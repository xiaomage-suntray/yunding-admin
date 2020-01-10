<template>
  <d2-container>
    <div class="mod-user">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.userName" placeholder="账号" clearable></el-input>
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
        <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50">
        </el-table-column>

        <el-table-column label="流程ID" :show-overflow-tooltip="true" prop="processInstanceId">
        <template slot-scope="scope">
          {{scope.row.processInstanceId}}
        </template>
        </el-table-column>
        <el-table-column
                prop="activitiyTypeValue"
                header-align="center"
                align="center"
                label="流程名称">
        </el-table-column>
        <el-table-column
                prop="createUserName"
                header-align="center"
                align="center"
                label="创建人">
        </el-table-column>

           <el-table-column
                prop="businessKey"
                header-align="center"
                align="center"
                label="业务ID">
        </el-table-column>
        <el-table-column
                prop="startTime"
                header-align="center"
                align="center"
                label="开始时间">
        </el-table-column>
         <el-table-column
                prop="endTime"
                header-align="center"
                align="center"
                label="结束时间">
        </el-table-column>
        <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="150"
                label="操作">
          <template slot-scope="scope">

              <el-button type="text" size="small"  @click="shenhe(scope.row.taskId,scope.row.processInstanceId,scope.row.businessKey,'false')">详情</el-button>
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
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </d2-container>
</template>

<script>
import AddOrUpdate from './user-add-or-update'
export default {
    name: 'sys-user',
    data () {
        return {
            dataForm: {
                userName: ''
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false
        }
    },
    components: {
        AddOrUpdate
    },
    created () {
        this.getDataList()
    },
    methods: {
    // 获取数据列表
        getDataList () {
            this.$http({
                url: this.$http.adornActivityUrl('/activity/findHistoric'),
                method: 'post',
                data: {
                    'page': this.pageIndex,
                    'rows': this.pageSize,
                    'userName': this.dataForm.userName
                }
            }).then((data) => {
                this.dataList = data.page.rows
                this.totalPage = data.page.total
                console.log('listMap', data)
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
        shenhe (id, processInstanceId, businessKey, isMe) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id, processInstanceId, businessKey, isMe)
            })
        }
    }

}
</script>
