<template lang="pug">
d2-container
    tx-search(:formData="searchData" ref="txSearch" @showSearch="getSearch" @selectChange="newSelect")

    el-row.btns

        el-button(type="primary" @click="downloads") 下载模板

        el-upload.upload-demo(:show-file-list="false" style="display: inline-block; margin: 0 10px;" :action="this.$http.adornUrl(`/sysCity/importCityInfoExcel`)" :headers="{token:info.token}" :limit="10" :multiple="true" :on-success="handleAvatarSuccess" )
            el-button( type="primary") 导入

        el-button(size="medium" type="button" @click="tableExport") 导出

        el-button(size="medium" type="" @click="nesCommodity({title:'新增商品',type:1})") 新增
    el-row
        el-table(title="" ref="" :data="tableData" @selection-change="handleSelection" v-loading="isLoading")
            el-table-column(type="selection" fixed="left")
            el-table-column(v-for="(item,index) in tableHead" :prop="item.prop" :label="item.label" :width="item.width" :key="index")
            el-table-column(label="操作" fixed="right" width="150")
                template(slot-scope="scope")
                    el-button( v-if="scope.row.status !== '草稿'" type="text" size="small" @click="viewProducts(scope.row)") 查看
                    el-button( v-if="scope.row.status === '草稿' || scope.row.status === '审批不通过'" type="text" size="small" @click="nesCommodity({title:'修改商品',type:2,data:scope.row})") 修改
                    el-button( v-if="scope.row.status === '草稿'" type="text" size="small" @click.once="pushApproval(scope.row)") 提交审批
                    el-button( v-if="scope.row.status === '草稿'" type="text" size="small" @click="goodsDelete(scope.row)") 删除
                    el-button( v-if="scope.row.status === '审批通过'" type="text" size="small" @click="goodsUpdate(4,scope.row)") 启用
                    el-button( v-if="scope.row.status === '审批通过'" type="text" size="small" @click="goodsUpdate(3,scope.row)") 禁用
                    el-button( v-if="scope.row.status === '审批通过'" type="text" size="small" @click="nesCommodity({title:'更新商品',type:0,data:scope.row})") 更新

        el-pagination(@size-change='sizeChangeHandle', @current-change='currentChangeHandle', :current-page='getListps.page', :page-sizes='[10, 20, 50, 100]', :total='getListps.pageSize', layout='total, sizes, prev, pager, next, jumper')

    el-dialog( v-if="dialogObj" :visible.sync="dialogObj.state" :fullscreen="true" :show-close="false" class="noPadding")
        el-row( type="flex" justify="end" style="margin:30px;")
            h5(style="width: 100%;font-size: 28px;margin: 0;color: rgba(1,1,1,.7);") {{dialogObj.title}}

            el-button(@click="closeDialog" v-text="dialogObj.type == 3 ? '返 回' :' 取 消'")
            el-button(v-if="dialogObj.type == 0" type="primary" @click="goodsSave({type:0})") 更新
            el-button(v-if="dialogObj.type == 1" type="primary" @click.once="goodsSave({type:1})") 添加
            el-button(v-if="dialogObj.type == 2" type="primary" @click="goodsSave({type:2})") 保存

        el-tabs(v-model="activeTab" @tab-click="handleClick")
            el-tab-pane(label="表单" name="form")
                el-row(type="flex" justify="end")
                    el-form.dialog(label-width="180px" :model="pushData" ref="rulesPushData" :rules="rules" :validate-on-rule-change="false")
                        el-col(:xs="24" :md="12" :lg="8")
                            el-form-item(label="一/二级目录" )
                                el-cascader.el-width100(v-model="cascader" :placeholder="tableNameBj" :options="columnTree" :props="cascaderProp" filterable @change="getGoodsNumber" :disabled="dialogObj.type >= 3")
                        el-col(:xs="24" :md="12" :lg="8")
                            el-form-item(label="名称")
                                el-input(size="medium" v-model="pushData.goodsName" :disabled="dialogObj.type >= 3")
                        el-col(:xs="24" :md="12" :lg="8")
                            el-form-item(label="料号")
                                el-input(size="medium" v-model="pushData.goodsNumber" disabled)
                        el-col(:xs="24" :md="12" :lg="8")
                            el-form-item(label="品牌" prop="goodsModels")
                                el-input(size="medium" v-model="pushData.goodsModels" :disabled="dialogObj.type >= 3")
                        el-col(:xs="24" :md="12" :lg="8")
                            el-form-item(label="单位" prop="goodsUnit")
                                el-select.el-width100(size="medium" v-model="pushData.goodsUnit" placeholder="选择单位" :disabled="dialogObj.type >= 3")
                                    el-option( v-for="item in dictionary.unit" :label="item.dictionaryName" :value="item.id" :key="item.id")

                        el-col(:xs="24" :md="12" :lg="8")
                            el-form-item(label="参考含税单价（元）")
                                el-input(placeholder="请输入价格" size="medium" type="number" v-model="pushData.unitPriceString" :disabled="dialogObj.type >= 3" )
                        el-col(:xs="24" :md="12" :lg="8")
                            el-form-item(label="生效时间")
                                el-date-picker.el-width100(size="medium" v-model="pushData.effectTimeString" type="date" placeholder="选择日期" :disabled="dialogObj.type >= 3")
                        el-col(:xs="24" :md="12" :lg="8")
                            el-form-item(label="供应商")
                                el-select.el-width100(size="medium" filterable v-model="pushData.supplierId" placeholder="请选择" :disabled="dialogObj.type >= 3")
                                    el-option(v-for="(item,index) in listByPara" :label="item.name" :value="item.id")
                        el-col(:xs="24" :md="12" :lg="8")
                            el-form-item(label="描述" prop="goodsDescribe")
                                el-input(size="medium" v-model="pushData.goodsDescribe" :disabled="dialogObj.type >= 3")
                        el-col(:xs="24" :md="12" :lg="8" v-if="pushData.data11" )
                            el-form-item(label="供货地区")
                                el-input(size="medium" :value="pushData.data11" disabled)
                        el-col(:xs="24" :md="12" :lg="8")
                            el-form-item(label="使用单位" prop="orgId")
                                el-select.el-width100(size="medium" v-model="pushData.orgIdList"      placeholder="使用单位" :disabled="dialogObj.type >= 3" multiple)
                                    el-option(v-for="(item,index) in goodsUnit" :label="item.orgName" :value="item.orgId" :key="index")
                        el-col(:xs="24" :md="12" :lg="8")
                            el-form-item(label="创建人")
                                el-input(size="medium" v-model="pushData.createdUserId" disabled)
                        el-col(:xs="24" :md="12" :lg="8")
                            el-form-item(v-if="dialogObj.type == 2 || dialogObj.type == 3" label="更新时间")
                                <!--el-input(size="medium" v-model="pushData.createdTime" disabled)-->
                                el-date-picker.el-width100(v-model="pushData.createdTimeString" :readonly="true" format placeholder="选择时间" disabled)
                            el-form-item(v-else label="创建时间")
                                <!--el-input(size="medium" v-model="pushData.createdTime" disabled)-->
                                el-date-picker.el-width100(v-model="pushData.createdTimeString" :readonly="true" format placeholder="选择时间" disabled)
                el-row(v-if="historyDataList.length > 0")
                    el-col(:span="24" style="font-size: 20px;line-height: 40px;margin: 15px 0;") 历史轨迹
                    el-col(:span="24")
                       el-table(:data="historyDataList" border style="width: 100%")
                           el-table-column(label="原价格" prop="unitPrice")
                           el-table-column(label="原描述" prop="goodsDescribe")
                           el-table-column(label="原供应商" prop="supplierName")
                           el-table-column(label="修改人"  prop="thename")
                           el-table-column(label="更新时间" prop="createdTime")

                el-row(v-if="dataList.length > 0")
                    el-col(:span="24" style="font-size: 20px;line-height: 40px;margin: 15px 0;") 审批详情
                    el-col(:span="24")
                        el-table(v-if="dataList" :data="dataList" border style="width: 100%")
                            el-table-column(prop="time" label="处理时间")
                            el-table-column(prop="message" label="审批节点")
                            el-table-column(prop="userName" label="处理人")
                            el-table-column(prop="taskName" label="处理意见")
            el-tab-pane( v-if="captchaPath && dataList.length > 0" label="流程" name="process")
                el-row(justify="center" type="flex")
                    el-col(:span="24"  align="center")
                        img(:src="captchaPath" rel="")
</template>
<script>
import { mapState } from 'vuex'
import { SysOrgList } from '@/api/sys/organize'
import moment from 'moment'
import ElTreeSelect from 'el-tree-select'
import { treeDataTranslate } from '@/util'

export default {
    data () {
        return {
            // 搜索结果存储
            arrListValue: '',
            cascader: [],
            // 搜索表单
            searchData: {
                header: [
                    { label: '名称', prop: 'goodsName', type: 'text' },
                    {
                        label: '一级分类',
                        prop: 'firstString',
                        type: 'select',
                        selectOption: [],
                        callBack: true
                    },
                    {
                        label: '二级分类',
                        prop: 'secondString',
                        type: 'select',
                        selectOption: [],
                        disable: true,
                        empty: true
                    },
                    {
                        label: '审批状态',
                        prop: 'status',
                        type: 'select',
                        selectOption: [
                            { selectLabel: '草稿', selectValue: '1' },
                            { selectLabel: '已提交', selectValue: '2' },
                            { selectLabel: '审批通过', selectValue: '3' },
                            { selectLabel: '审批不通过', selectValue: '4' }]
                    },
                    {
                        label: '商品信息状态',
                        prop: 'goodsStatus',
                        type: 'select',
                        selectOption: [
                            { selectLabel: '新增', selectValue: '1' },
                            { selectLabel: '修改', selectValue: '2' },
                            { selectLabel: '更新', selectValue: '5' },
                            { selectLabel: '禁用', selectValue: '3' },
                            { selectLabel: '启用', selectValue: '4' }
                        ]
                    },
                    { label: '品牌', prop: 'goodsModels', type: 'text' },
                    {
                        label: '供应商',
                        prop: 'supplierId',
                        type: 'select',
                        selectOption: [
                            { selectLabel: '新增', selectValue: '1' },
                            { selectLabel: '修改', selectValue: '2' },
                            { selectLabel: '禁用', selectValue: '3' },
                            { selectLabel: '启用', selectValue: '4' }]
                    },
                    { label: '材料号', prop: 'goodsNumber', type: 'text' },
                    { label: '更新日期', prop: 'dateInitialization', type: 'timePicker' }
                ],
                data: {}
            },

            dictionary: {
                unit: ''
            },
            rules: {
                goodsModels: [{ required: true, message: '品牌不能为空', trigger: 'blur' }],
                orgIdList: [{ required: true, message: '使用单位不能为空', trigger: 'blur' }],
                goodsDescribe: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
                goodsUnit: [{ required: true, message: '商品单位不能为空', trigger: 'blur' }]
            },
            // table表结构
            tableHead: [
                { prop: 'goodsClassName1', label: '一级目录', width: '120' },
                { prop: 'goodsClassName2', label: '二级目录', width: '120' },
                { prop: 'goodsName', label: '名称', width: '120' },
                { prop: 'goodsNumber', label: '物料编码', width: '130' },
                { prop: 'status', label: '审批状态', width: '120', type: 'icon' },
                { prop: 'goodsModels', label: '品牌', width: '120' },
                { label: '单位', prop: 'goodsUnitName', width: '100' },
                { prop: 'goodsDescribe', label: '描述', width: '160' },
                { prop: 'unitPrice', label: '参考含税单价（元）', width: '150' },
                { prop: 'effectTime', label: '生效日期', width: '130' },
                { prop: 'createdTime', label: '更新日期', width: '130' },
                { prop: 'orgName', label: '使用单位', width: '120' },
                { prop: 'supplierName', label: '供应商', width: '120' },
                { prop: 'areaName', label: '供货地区', width: '120' },
                { prop: 'goodsStatus', label: '商品信息状态', width: '120' },
                { prop: 'createOrgName', label: '创建部门', width: '120' },
                { prop: 'company', label: '创建单位', width: '120' },
                { prop: 'thename', label: '创建人', width: '100' }
            ],
            // 下载模板结构
            downloadHead: [
                { label: '一级分类', prop: 'status' },
                { label: '二级分类', prop: 'status' },
                { label: '名称', prop: 'status' },
                { label: '品牌', prop: 'status' },
                { label: '描述', prop: 'status' },
                { label: '单位', prop: 'status' },
                { label: '参考含税单价（元）', prop: 'status' },
                { label: '生效日期', prop: 'status' },
                { label: '使用单位', prop: 'status' },
                { label: '供应商', prop: 'status' }
            ],
            // 表单1 查询表单
            form: {
                goodsName: '', // 名称
                firstString: '', // 一级分类,
                secondString: '', // 二级分类
                status: '', // 审批状态
                goodsStatus: '', // 物品信息状态
                goodsModels: '', // 品牌
                supplierId: '', // 供应商
                goodsNumber: '', // 材料
                startTimeString: '', // 创建时间
                endTimeString: ''
            },
            // 主页Table 展示表格
            tableData: [
                {
                    status: '',
                    goodsClassName1: '',
                    goodsClassName2: '',
                    goodsName: '名称',
                    goodsNumber: '物料编码',
                    goodsModels: '品牌',
                    goodsDescribe: '描述',
                    unitPriceString: '参考含税单价',
                    createdTime: '生效日期',
                    orgName: '使用单位',
                    supplierName: '供应商',
                    areaName: '供货地区',
                    createOrgName: '创建部门',
                    company: '创建单位',
                    thename: '创建人'
                }
            ],
            // 提交数据
            pushData: {
                goodsClass: [],
                goodsNumber: '', // 料号
                goodsName: '', // 名称
                goodsModels: '', // 品牌
                goodsUnit: '', // 单位
                unitPriceString: '',
                effectTimeString: '',
                supplierId: '',
                goodsDescribe: '', // 描述
                orgId: '', // 使用单位
                // data11: '供货地区',
                createdUserId: '', // 创建人
                createdTimeString: new Date()
            },
            // 供应商列表
            listByPara: [],
            // 一二级栏目完整树
            columnTree: [],
            // 联级组件一二级栏目名称
            cascaderProp: {
                label: 'goodsClassName',
                value: 'goodsClassNumber'
            },
            // 查询表单一级栏目
            // 1. 一级栏目index
            // 2.二级栏目disable 状态
            // 3. 二级栏目内容
            // 4. 请求表单时间格式化
            tableLevel: {
                level: '',
                disable: true,
                level2: [],
                dateInitialization: ''
            },
            // 一二级栏目名称组合展示
            tableNameBj: '',
            // table选中内容
            handleList: [],
            // dialog组件状态
            dialogObj: {
                state: false,
                title: '',
                // 1.新增，2.修改 3.查看
                type: '1'
            },
            // 使用单位
            goodsUnit: [],
            // 查询分页信息
            getListps: {
                page: 1,
                rows: 10,
                pageSize: 0
            },
            // 服务区域展示树
            orgTreeSelect: {
                selectParams: {
                    clearable: true,
                    placeholder: '无',
                    class: 'el-tree-select-half'
                },
                treeParams: {
                    accordion: true,
                    filterable: false,
                    'highlight-current': true,
                    data: [],
                    props: {
                        children: 'children',
                        label: 'orgName',
                        value: 'orgId'
                    }
                }
            },
            captchaPath: '', // 流程图地址
            activeTab: 'form',
            isLoading: false, // table 加载状态
            dataList: [], // 审批列表
            historyDataList: new Array() // 历史列表
        }
    },
    computed: {
        ...mapState('d2admin/user', [
            'info'
        ])
    },
    components: {
        ElTreeSelect
    },
    mounted () {
        // 1.获取1/2级栏目
        // 2.获取商品列表
        // 3.获取
        // 4.获取单位
        this.getTableData()
        this.getDataList()
        this.getSysOrgList()
        this.getListByPara('1')// 1 = 商品单位
    },
    methods: {
        // 一级栏目选中回调
        newSelect (val, index) {
            // 先清空二级栏目
            !!this.searchData.data.secondString && delete this.searchData.data.secondString
            let atts = ''
            this.columnTree.map(ls => {
                if (ls.id === val) {
                    atts = ls
                }
            })
            // [2] 第二条为二级栏目
            this.searchData.header[2].disable = atts.children.length === 0
            if (!this.searchData.header[2].disable) { // 拥有二级数据 生成二级结构
                this.searchData.header[2].selectOption = atts.children.map(res => ({
                    selectLabel: res.goodsClassName,
                    selectValue: res.id
                }))
            }
        },
        getSearch (val) {
            console.log(val, 'vvvvv')
            // 如果有时间  则格式化时间否则置空
            let arrList = { ...val }
            arrList.startTimeString = val.dateInitialization && val.dateInitialization.length >= 1 && !!val.dateInitialization[0] ? moment(val.dateInitialization[0]).format('YYYY-MM-DD H:mm:ss') : ''
            arrList.endTimeString = val.dateInitialization && val.dateInitialization.length >= 1 && !!val.dateInitialization[0] ? moment(val.dateInitialization[1]).format('YYYY-MM-DD H:mm:ss') : ''
            delete arrList.dateInitialization
            this.arrListValue = arrList
            this.getDataList({ type: 'search', data: arrList })
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
        // 上传回调
        handleAvatarSuccess (vl) {
            if (vl && vl.map.error) {
                this.$message({
                    message: vl.map.error,
                    type: 'warning',
                    duration: 0,
                    showClose: true
                })
                return
            }
            this.getDataList()
            this.$message({
                message: '上传成功！',
                type: 'success'
            })
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

        ds () {
            this.$export.excel({
                columns: this.downloadHead,
                title: '商品信息'
            }).then(() => {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
            })
        },
        downloads () {
            // if (!data) {
            //     return
            // }
            // let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = '/doc/productInfo.xlsx'

            link.setAttribute('download', '商品信息.xlsx')

            document.body.appendChild(link)
            link.click()
        },
        // 获取字典信息
        getListByPara (value) {
            this.$http({
                url: this.$http.adornUrl(`/sysDictionary/getListByPara`),
                method: 'post',
                data: { dictionaryCalss: value }
            }).then((data) => {
                console.log(data, 'data')
                this.dictionary.unit = data.list
            })
        },
        // 启用/禁用商品
        goodsUpdate (val, row) {
            let data = { id: row.id, goodsStatus: val }
            this.$http({
                url: this.$http.adornUrl('/goodsDetails/update'),
                header: { 'Content-Type': 'application/json;charset=UTF-8' },
                method: 'post',
                data

            }).then(data => {
                this.getDataList()
                let msg = val === 4 ? '启用成功' : '禁用成功'
                this.$message({
                    message: msg,
                    type: 'success'
                })
            })
        },
        // 表格导出
        tableExport () {
            this.$refs.txSearch.goSearch()
            // let data = this.form
            let data = this.arrListValue

            console.log(data, this.arrListValue, 'arrListValue')

            this.$http({
                url: this.$http.adornUrl('/goodsDetails/exportExcel'),
                method: 'post',
                data,
                responseType: 'blob'
            }).then(data => {
                data.list.map(res => {
                    res.status = { 1: '草稿', 2: '已提交', 3: '审批通过', 4: '审批不通过' }[res.status]
                    res.goodsStatus = { 1: '新增', 2: '修改', 3: '禁用', 4: '启用', 5: '更新' }[res.goodsStatus]
                })

                this.$export
                    .excel({
                        columns: this.tableHead,
                        data: data.list,
                        title: '商品列表'
                    })
                    .then(() => {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        })
                    })
            })
        },

        // 获取查询二级分类
        getLevelTwo (val) {
            this.tableLevel.disable = this.columnTree[val].children.length === 0

            this.form.secondString = ''
            this.form.firstString = this.columnTree[val].id
            if (!this.tableLevel.disable) { // 拥有二级数据 生成二级结构
                let arrays = this.columnTree[val].children.map((res, index) => {
                    return { goodsClassName: res.goodsClassName, id: res.id }
                })
                this.tableLevel.level2 = arrays
            }
        },
        // 删除指定商品
        goodsDelete (val) {
            let data = { id: val.id }
            this.$http({
                url: this.$http.adornUrl('/goodsDetails/delete'),
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
                    this.dialogObj.state = false
                }
            })
        },
        // 获取供应商
        getSysOrgList () {
            let _data = { limit: 999, isCorporation: '1' }
            this.$http({
                url: this.$http.adornUrl('/sys/org/list'),
                method: 'get',
                params: this.$http.adornParams(_data)
            }).then(data => {
                this.goodsUnit = data.page.list.map(res => {
                    return { 'orgName': res.orgName, 'orgId': res.orgId }
                })
                console.log(data)
                this.$set(this.orgTreeSelect, 'treeParams', {
                    ...this.orgTreeSelect.treeParams,
                    data: treeDataTranslate(data.page.list, 'orgId')
                })
            })
        },
        // 获取商品列表
        getDataList (vl) {
            debugger
            let pushDate = this.getListps,
                params = {}
            this.isLoading = true
            if (vl && vl.type === 'search') {
                Object.assign(params, pushDate, vl.data)
            } else {
                params = pushDate
            }
            console.log(params, 'paramsparams')
            this.$http({
                url: this.$http.adornUrl('/goodsDetails/list'),
                method: 'post',
                params
            }).then((data) => {
                this.isLoading = false
                console.log(this.form.supplierId, 'form.supplierId', this.listByPara)
                this.tableData = data.page.rows
                this.getListps.pageSize = data.page.total
                this.tableData.map(rs => {
                    rs.goodsStatus = { 1: '新增', 2: '修改', 3: '禁用', 4: '正常', 5: '更新' }[rs.goodsStatus]
                    rs.status = { 1: '草稿', 2: '已提交', 3: '审批通过', 4: '审批不通过' }[rs.status]
                    rs.effectTime = moment(rs.effectTime).format('YYYY-MM-DD')
                    rs.createdTime = moment(rs.createdTime).format('YYYY-MM-DD')
                })

                console.log(data.page.rows, 'data')
            })
        },
        // 提交审批操作
        pushApproval (val) {
            if (val.status === '草稿') {
                this.$http({
                    url: this.$http.adornUrl(`/sys/user/info`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then((data) => {
                    // if (!data || !data.code != 0) return
                    console.log(data)
                    this.$http({
                        url: this.$http.adornActivityUrl('/activity/processTjFirst'),
                        method: 'post',
                        data: {
                            'bizId': val.id,
                            'activitiyTypeKey': 'goods_details',
                            'userId': data.user.userId,
                            'userName': data.user.username
                            // 'title': ''
                        }
                    }).then(data => {
                        console.log('data', data)
                        if (data && data.code === 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.getDataList()
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                })

                return
            }
            this.$message.error('您已提交过审批，请查看商品详情')
        },
        // 获取审批记录列表
        getApproval (id) {
            this.$http({
                url: this.$http.adornActivityUrl(`/activity/auditCommentByBussine`),
                method: 'post',
                data: {
                    'bizId': id
                }
            }).then((data) => {
                if (data && data.code === 0) {
                    this.dataList = data.listMap ? data.listMap : []
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        // 新增修改商品
        goodsSave (val) {
            debugger
            this.$refs['rulesPushData'].validate((valid) => {
                if (valid) {
                    let url = '',
                        msg = '',
                        data = this.pushData
                    data.effectTimeString = moment(data.effectTimeString).format('YYYY-MM-DD')
                    data.createdTimeString = moment(data.createdTimeString).format('YYYY-MM-DD')
                    // 清除返回的无效参数
                    delete data.effectTime
                    delete data.updatedTime
                    delete data.createdTime
                    delete data.status
                    delete data.goodsStatus

                    if (val.type === 1) {
                        url = this.$http.adornUrl(`/goodsDetails/save`)
                        msg = '成功添加商品'
                    }
                    // isHistory不为空时存历史轨迹
                    if (val.type === 0) {
                        data.isHistory = 'true'
                    }
                    if (val.type === 2 || val.type === 0) {
                        data.createdUserId = data.updatedUserId
                        url = this.$http.adornUrl(`/goodsDetails/update`)
                        msg = '商品修改成功'
                    }
                    this.$http({
                        url,
                        method: 'post',
                        data
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
        // 根据一二级栏目获取商品号
        getGoodsNumber (val) {
            console.log(val, this.columnTree, 'valvalval')
            this.columnTree.map(res => res.children).map(res2 => res2.map(res3 => {
                if (res3.goodsClassNumber === val[val.length - 1]) {
                    this.pushData.goodsClass = res3.id
                }
            }))
            // 添加二级栏目名
            let bNum = val[val.length - 1],
                data = {
                    id: bNum
                }

            this.$http({
                url: this.$http.adornUrl(`/goodsDetails/generateGoodsNumber`),
                method: 'post',
                data
            }).then((data) => {
                this.pushData.goodsNumber = data
            })
        },
        // 获取一二级栏目
        getTableData () {
            // 拿供应商 已审批通过
            this.$http({
                url: this.$http.adornUrl(`/supplierDetails/getListByPara`),
                method: 'post',
                data: { status: 3 }
            }).then((data) => {
                this.listByPara = data.list
                this.searchData.header[6].selectOption = data.list.map(ls => ({
                    selectLabel: ls.name,
                    selectValue: ls.id
                }))
            })
            // 拿商品分类
            this.$http({
                url: this.$http.adornUrl(`/goodsClass/getGoodsTree`),
                method: 'get'
            }).then((data) => {
                this.columnTree = data.result
                let ArrList = data.result.map(res => {
                    return { selectLabel: res.goodsClassName, selectValue: res.id }
                })
                this.searchData.header[1].selectOption = ArrList
            })
        },
        // 表格选中事件
        handleSelection (val) {
            this.handleList = val
            // console.log(this.handleList,'handleSelectionhandleSelectionhandleSelection')
        },
        // 弹出dialog
        nesCommodity (val) {
            // 添加创建人
            if (val.data) {
                this.captchaPath = this.$http.adornActivityUrl(`/activity/readByBusiness?bizId=${val.data.id}&token=${this.info.token}`) // 生成流程图片
            }

            this.dialogObj = {
                title: val.title,
                type: val.type,
                state: true
            }
            if (val.type === 1) {
                this.dataList = []
                // 新增清空数据
                this.pushData = {
                    goodsClass: [],
                    goodsNumber: '',
                    goodsName: '',
                    goodsModels: '',
                    goodsUnit: '',
                    unitPriceString: '',
                    effectTimeString: new Date(),
                    supplierId: '',
                    goodsDescribe: '',
                    orgId: '',
                    orgIdList: [],
                    createdUserId: '',
                    createdTimeString: new Date()
                }
                this.dataList = []
                this.historyDataList = []
                this.cascader = []
                this.tableNameBj = ''
                this.pushData.createdUserId = this.info.name
            }
            if (val.type === 2 || val.type === 0) {
                debugger
                // 修改 修改调整价格、生效日期、创建时间
                this.pushData = []
                this.dataList = []
                this.pushData = val.data
                this.cascader = []
                this.tableNameBj = ''

                this.pushData.unitPriceString = val.data.unitPrice
                this.pushData.effectTimeString = val.data.effectTime
                this.pushData.createdTimeString = val.data.createdTime
                this.tableNameBj = `${val.data.goodsClassName1}/${val.data.goodsClassName2}`
                this.pushData.createdUserId = val.data.thename
                this.pushData.orgIdList = []
                if (val.data.orgId !== null) {
                    let arr = val.data.orgId.split(',')
                    this.pushData.orgIdList = arr
                }
            }
            if (val.type === 3) {
                // 查看详情
                this.pushData.createdUserId = val.data.thename
                this.pushData = []
                this.dataList = []
                this.pushData = val.data
                this.pushData.createdUserId = val.data.thename
                this.pushData.unitPriceString = val.data.unitPrice
                this.pushData.effectTimeString = val.data.effectTime
                this.pushData.createdTimeString = val.data.createdTime
                this.tableNameBj = `${val.data.goodsClassName1}/${val.data.goodsClassName2}`
                this.pushData.orgIdList = []
                this.getApproval(val.data.id)
                if (val.data.orgId !== null) {
                    let arr = val.data.orgId.split(',')
                    this.pushData.orgIdList = arr
                }
            }

            if (val.type === 3 || val.type === 2 || val.type === 0) {
                // 查询是否有历史轨迹
                this.$http({
                    url: this.$http.adornUrl(`/goodsDetails/getGoodsHistory/` + val.data.id),
                    method: 'post'
                }).then((data) => {
                    if (data && data.code === 0) {
                        debugger
                        this.historyDataList = data.dataList
                        for (let i of this.historyDataList) {
                            i.thename = i.thename + '(' + i.createOrgName + ')'
                        }
                    }
                })
            }
        },
        viewProducts (row) {
            // 格式化 pushDate数据
            this.tableNameBj = `${row.goodsClassName1}/${row.goodsClassName2}`
            // this.handleList[0] = this.pushData = row;
            // this.pushData.unitPriceString = row.unitPrice;
            // this.pushData.createdTimeString = row.createdTime
            // this.pushData.effectTimeString = row.updatedTime
            // this.pushData.orgId = row.goodsUnit
            // console.log(typeof this.pushData.orgId)
            // delete this.pushData.unitPrice
            // delete this.pushData.createdTime
            // delete this.pushData.updatedTime
            // delete this.pushData.goodsUnit
            // console.log(row, 'row')
            this.nesCommodity({ title: '查看详情', type: 3, data: row })
        }
    }
}
</script>
<style lang="scss">
.el-width100, .el-select.el-tree-select-input {
    width: 100% !important;
}

.el-form {
    padding: 20px;
    overflow: hidden;
    &.dialog {
        padding: 40px 10px 20px;
        background: rgba(201, 201, 201, .6);
    }
    &.bg {
        background: rgba(204, 204, 204, .1);
    }
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
