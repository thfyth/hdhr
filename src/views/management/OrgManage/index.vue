<template>
  <div class="main org-main">
    <div class="org-box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="组织管理" name="first">
          <div class="title-box" style="width: auto">
           <div class="titles-list">
              <div class="button-box">
              <el-button
                class="btn-updata"
                @click="updataOrgDing"
              >更新组织</el-button>
            </div>
           </div>
          </div>

          <div class="table-box">
            <table-view
              :table-data="treeData"
              :table-label="tableLabel"
              :table-option="tableOption"
              :total="total"
              :is-show-page="isShowPage"
              :table-col-id="tableColId"
              @handleButton="getButton"
              @getOneData="getOneUser"
              @handleCurrentChange="handleCurrentChange"
              @handleSizeChange="handleSizeChange"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="组织架构图" name="second">
          <organization-chart :datasource="TreeDatas" :pan="true" :zoom="true">
            <template slot-scope="{ nodeData }">
              <div class="title" :class="'title-' + nodeData.orgType">
                <div class="title-box-node">
                  <div class="title-variable">
                    {{ nodeData.orgShortName }}
                  </div>
                </div>
                <div class="title-border" />
              </div>
            </template>
          </organization-chart>
        </el-tab-pane>
        <el-tab-pane label="历史版本" name="history">
          <div class="table-box">
            <table-view
              :table-data="tableData"
              :table-label="tableLabel1"
              :total="total1"
              @getOneData="getOneInfo"
              @handleCurrentChange="handleCurrentChange1"
              @handleSizeChange="handleSizeChange1"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="model">
      <!-- 编辑，增加模态框 -->
      <el-dialog title="历史版本" :visible.sync="editVisible1" width="80%">
        <organization-chart :datasource="TreeDatas1" :pan="true" :zoom="true">
          <template slot-scope="{ nodeData }">
            <div class="title" :class="'title-' + nodeData.orgType">
              <div class="title-box-node">
                <div class="title-variable">
                  {{ nodeData.orgShortName }}
                </div>
              </div>
              <div class="title-border" />
            </div>
          </template>
        </organization-chart>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="editVisible1 = false"
          >关 闭</el-button>
        </span>
      </el-dialog>
      <el-dialog title="组织管理" :visible.sync="editVisible" width="60%">
        <el-form ref="form" :model="form" label-width="120px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="组织名称:" :required="true">
                <el-input v-model="form.orgName" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="组织简称 :" :required="true">
                <el-input v-model="form.orgShortName" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="组织编码 :" :required="true">
                <el-input v-model="form.orgCode" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="组织类型:" :required="true">
                <el-select v-model="form.orgType" placeholder="请选择">
                  <el-option
                    v-for="item in attrOptions"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import tableView from '@/components/vTable.vue'
import OrganizationChart from 'vue-organization-chart'
import {
  getBayIdManOrg,
  addOneManOrg,
  updateManOrg,
  getHistory,
  delOneManOrg,
  updataDingOrg
} from '@/api/management/orgManage'
import { getAttrMenu } from '@/api/attrManage'
import 'vue-organization-chart/dist/orgchart.css'
// import 'vue-orgchart/dist/style.min.css'
import { isButtons } from '@/utils/button'
export default {
  components: {
    tableView,
    // treeCharts,
    OrganizationChart
  },
  data() {
    return {
      activeName: 'first',
      treeData: [],
      attrOptions: [],
      tableData: [],
      chartClass: null,
      chartClass1: 'tree1',
      // 操作状态，新增或更新,true为新增，false为修改
      operation: true,
      editVisible1: false,
      total1: 0,
      // 请求参数
      query: {
        orgName: null,
        orgShortName: null,
        orgType: 0,
        pageNumber: '1',
        pageSize: '10',
        parentId: null
      },
      // 历史版本请求参数
      historyQuery: {
        // 截止时间
        endDate: null,
        pageNumber: 1,
        pageSize: 10,
        // 起始时间
        startDate: null
      },
      filterText: null,
      editVisible: false,
      total: 0,
      form: {},
      defaultProps: {
        label: 'orgName',
        children: 'children'
      },
      isShowPage: false,
      // 默认展开的数组
      tableOption: {
        label: '操作',
        width: 300,
        options: [
          {
            label: '更新组织',
            type: 'text',
            icon: 'el-icon-edit',
            methods: 'edit',
            disabled: !this.hasButtons('org-edit')
          },
          {
            label: '增加下级组织',
            type: 'text',
            icon: 'el-icon-paperclip',
            methods: 'setrole',
            disabled: !this.hasButtons('org-addsubset')
          },
          {
            label: '删除组织',
            type: 'text',
            icon: 'el-icon-delete',
            methods: 'delete',
            disabled: !this.hasButtons('org-del')
          }
        ]
      },
      TreeDatas: {},
      TreeDatas1: {},
      tableColId: 'orgId',
      tableLabel: [
        {
          label: '组织名称',
          param: 'orgName',
          selection: true,
          fixed: true,
          click: true
        },
        { label: '组织编码', param: 'orgCode', align: 'center' },
        {
          label: '创建时间',
          param: 'createDate',
          align: 'center'
        }
      ],
      tableLabel1: [
        // { label: "id", param: "versionId", align: "center", selection: true},
        {
          label: '版本号',
          param: 'versionNum',
          align: 'center',
          fixed: true,
          click: true,
          selection: true
        },
        { label: '提交人', param: 'submitBy', align: 'center' },
        { label: '提交时间', param: 'submitDate', align: 'center' }
      ]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getData()
    this.getAttr()
  },
  methods: {
    // 获取所有组织
    getData() {
      getBayIdManOrg(this.query).then(
        res => (
          (this.treeData = res.data),
          (this.TreeDatas = res.data[0]),
          (this.total = res.data.total)
        )
      )
    },
    // 正常权限button
    hasButtons(data) {
      return isButtons(data)
    },
    // 获取组织类型下拉框
    getAttr() {
      getAttrMenu({ valueCode: 'org_type' }).then(
        res => (this.attrOptions = res.data[0].org_type.option)
      )
    },
    // 监听table组件多选框事件
    getSelectionChange(e) {
      console.log(e)
    },
    // 监听table组件按钮事件
    getButton(e, info) {
      console.log(e)
      console.log(info)
      // edit更新组织
      if (e == 'edit') {
        this.updataTree(info)
      } else if (e == 'setrole') {
        this.appendTree(info)
      } else if (e == 'delete') {
        this.removeTree(info)
      }
    },
    // 保存
    saveEdit() {
      const that = this
      const data = that.tableOption
      if (this.operation) {
        addOneManOrg(that.form).then(res => {
          if (!data.children) {
            this.$set(data, 'children', [])
          }
          if (res.code == 0) {
            that.$message.success(res.message)
            that.getData()
            that.editVisible = false
          } else {
            that.$message.error(res.message)
          }
        })
      } else {
        updateManOrg(that.form).then(res => {
          if (res.code == 0) {
            that.$message.success(res.message)
            that.editVisible = false
          } else {
            that.$message.error(res.message)
          }
        })
      }
    },
    // 根据条件查询
    rawQuery() {
      this.getData()
    },
    // 新增用户
    addQuery() {
      this.form = {}
      this.operation = true
      this.editVisible = true
    },

    // 增删节点
    appendTree(data) {
      if (!this.hasButtons('org-addsubset')) {
        this.$message.error('对不起,你不具备操作权限')
        return false
      }
      const parentIdAll = data.parentIdAll + ',' + data.orgId || ''
      this.operation = true
      this.form = {
        orgName: '',
        orgShortName: '',
        orgType: 1,
        parentId: data.orgId,
        parentIdAll
      }
      this.editVisible = true
    },
    // 更新节点
    updataTree(data) {
      if (!this.hasButtons('org-edit')) {
        this.$message.error('对不起,你不具备操作权限')
        return false
      }
      this.form = data
      this.operation = false
      this.editVisible = true
    },
    removeTree(data) {
      if (!this.hasButtons('org-del')) {
        this.$message.error('对不起,你不具备操作权限')
        return false
      }
      const that = this
      // const parent = data.parent;
      const idList = data.orgId
      // const children = parent.data.children || parent.data;
      // const index = children.findIndex((d) => d.orgId === data.orgId);

      that
        .$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
        .then(res => {
          delOneManOrg({ idList }).then(res => {
            if (res.code == 0) {
              that.$message.success(res.message)
              that.getData()
            } else {
              that.$message.error(res.message)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    getOneUser(e) {
      console.log(e)
    },
    // 分页请求
    handleCurrentChange(e) {
      this.query.pageNumber = e
      this.getData()
    },
    handleSizeChange(e) {
      this.query.pageSize = e
      this.getData()
    },
    handleClick(e) {
      const { name } = e
      if (name == 'history') {
        this.getHistorys()
      }
    },
    // 获取历史版本
    getHistorys() {
      getHistory(this.historyQuery).then(
        res => (
          (this.tableData = res.data.records), (this.total1 = res.data.total)
        )
      )
    },
    getOneInfo(e) {
      this.TreeDatas1 = e.orgList[0]
      this.chartClass = e.versionId
      this.editVisible1 = true
    },
    // 分页请求
    handleCurrentChange1(e) {
      this.historyQuery.pageNumber = e
      this.getHistorys()
    },
    handleSizeChange1(e) {
      this.historyQuery.pageSize = e
      this.getHistorys()
    },
    // 更新钉钉组织
    updataOrgDing() {
      try {
        updataDingOrg().then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
      } catch (error) {
        this.$message.error('异常错误')
      }
    }
  }
}
</script>
<style lang="scss">
.org-main {
  .title {
    padding: 0;
  }
  .btn-list {
    display: inline-block;
    margin-left: 20px;
  }
  .orgchart {
    background: none;
    .lines:nth-child(3) td {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      height: 20px;
      table {
        margin: 0 auto;
      }
    }
  }
  .orgchart-container {
    height: auto;
    background: url('../../../assets/img/orgbg.png') no-repeat;
    background-size: cover;
  }
  .orgchart .node.focused,
  .orgchart .node:hover {
    background: none !important;
  }
  .orgchart {
    overflow: hidden;
  }
  .orgchart .node {
    width: auto;

    .title-1 {
      width: 258px;
      height: 258px;
      border-radius: 50%;
      box-shadow: 6px 8px 11px 0px rgba(69, 69, 69, 0.5);
      border: 2px solid #c3c8d1;
      background: none !important;
      display: flex;
      align-items: center;
      .title-box-node {
        width: 219px;
        height: 220px;
        padding: 6px;
        box-shadow: 4px 5px 12px 0px rgba(142, 142, 142, 0.5);
        border-radius: 50%;
        background-image: -webkit-linear-gradient(
          rgba(29, 8, 197, 1),
          rgba(22, 66, 171, 1),
          rgba(94, 200, 245, 1)
        );
        margin: 0 auto;
        .title-variable {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0d1952;
          font-size: 26px;
          background: linear-gradient(
            180deg,
            #f9f9f9 0%,
            #dde9fb 52%,
            #eceff6 100%
          );
        }
      }
    }
  }
  .orgchart .node .title-2 {
    width: 153px;
    height: 56px;
    background-color: #2d1b8c !important;
    box-shadow: 0px 9px 8px -5px #827aad;
    border-radius: 5px;
    margin: 0 auto;
    line-height: 52px;
    color: #ffffff;
    font-size: 16px;
    .title-border {
      height: 5px;
      background: #ffffff;
      border-radius: 0px 0px 5px 5px;
    }
  }
  .orgchart .node .title-3 {
    height: 100px;
    background: none !important;
    .title-box-node {
      width: 96px;
      height: 96px;
      background: #ffffff;
      box-shadow: 1px 2px 5px 0px #8290ad;
      border-radius: 50%;
      margin: 0 auto;
      .title-variable {
        width: 94px;
        height: 94px;
        background: #567bc7 !important;
        box-shadow: 1px 2px 5px 0px #8290ad;
        border-radius: 50%;
        color: #ffffff;
        font-size: 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .orgchart .node .title-4 {
    background: none !important;
    height: auto !important;
    padding: 5px 2px;
    .title-box-node {
      width: 42px;
      height: 168px;
      background: #ffffff;
      box-shadow: 0px 2px 4px 0px #7295b4;
      border-radius: 28px;
      margin: 0 auto;

      .title-variable {
        width: 38px;
        height: 166px;
        background: #5aa0df;
        border-radius: 28px;
        writing-mode: vertical-lr;
        display: flex;
        justify-content: center;
        margin: 0 auto;
        align-items: center;
        color: #ffffff;
        font-size: 16px;
      }
    }
  }
  .orgchart .lines .leftLine {
    border-left: 1px solid #c3c8d1;
  }

  .orgchart .lines .topLine {
    border-top: 2px solid #c3c8d1;
  }
  .orgchart .node .title {
    background-color: #c3c8d1;
  }
  .orgchart .lines .rightLine {
    border-right: 1px solid #c3c8d1;
  }
  .orgchart .lines .downLine {
    background-color: #c3c8d1;
  }
}
</style>
