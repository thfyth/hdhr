<template>
  <div class="main temp-main">
    <div class="title-box" style="width: auto;">
      <!-- <div class="title-list">
            <div class="list-box">
              <span class="title">岗位名称</span>
              <el-input placeholder="岗位名称" v-model="query.postName" style="width: 200px" clearable></el-input>
            </div>
            <div class="list-box">
              <el-button class="insert" @click="rawQuery">查询</el-button>
            </div>
            <div class="list-box">
              <el-button class="resetting" @click="runReset">重置</el-button>
            </div>
          </div> -->
      <div class="titles-list">
        <div class="button-box">
          <el-button class="add" @click="addQuery">新增模板</el-button>
        </div>
        <!-- <div class="button-box">
          <el-button class="del" @click="allDelTemp">删除</el-button>
        </div> -->
      </div>
    </div>
    <div class="table-view">
      <table-view
        :table-data="tableData"
        :table-label="tableLabel"
        :table-option="tableOption"
        :total="total"
        @handleSelectionChange="getSelectionChange"
        @handleButton="getButton"
        @setStatus="setStatus"
        @getOneData="getOneInfo"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
let vm
import tableView from '@/components/vTable.vue'
import axios from 'axios'
import { getToken } from '@/utils/auth'
// import pdf from 'vue-pdf'

import {
  findTemp,
  updataTemp
} from '@/api/personnel/contractManage'

export default {
  components: {
    tableView,
  },
  data() {
    return {
      tableData: [],
      total: 0,
      content: '内容',
      typeOptions: [
        {
          label: '普通模板',
          value: 1
        }
      ],
      src: null,
      form: {},
      option: true,
      dialogVisible: false,
      tableLabel: [
        { label: '模板ID', param: 'tempId', align: 'center' },
        {
          label: '模板名称',
          param: 'tempName',
          align: 'center',
          fixed: true,
          click: true
        },
        {
          label: '模板类型',
          param: 'tempType',
          align: 'center',
          render: row => {
            if (row.tempType === 1) {
              return '普通模板'
            } else {
              return '其它模板'
            }
          }
        },
        {
          label: '状态',
          param: 'status',
          align: 'center',
          activeText: '启用',
          inactiveText: '停用',
          switch: true
        },
        { label: '创建人名称', param: 'createName', align: 'center' }
      ],
      tableOption: {
        label: '操作',
        width: '200',
        options: [
          {
            label: '编辑',
            type: 'text',
            icon: 'el-icon-my-edit',
            methods: 'edit'
          },
          {
            label: '预览',
            type: 'text',
            icon: 'el-icon-view',
            methods: 'view'
          }
        ]
      },
      query: {
        pageNumber: 1,
        pageSize: 10,
        tempName: null,
        status: null,
        tempType: null
      },
      multipleSelection: ''
    }
  },
  created() {
    vm = this
    vm.getData()
  },
  methods: {
    // 获取数据
    getData() {
      vm.total = 0
      findTemp(vm.query).then(res => {
        if (res.code === 0) {
          vm.tableData = res.data.records
          vm.total = res.data.total
        } else {
          vm.$message.error(res.msg)
        }
      })
    },
    getButton(e, row) {
      console.log(e)
      if (e == 'edit') {
        vm.getOneInfo(row)
      } else {
        vm.viewTemp(row)
      }
    },
    // 预览模板
    viewTemp(e) {
      const { tempId } = e
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style = 'display:none'
      a.href =
        'http://39.98.171.233:9004:9004/api/employee/contract/previewPdf?tempId=' +
        tempId
      // a.download = filename;
      a.target = '_blank'
      a.click()
    },
    // 获取一个模板信息
    getOneInfo(e) {
      const {tempId} = e;
      vm.$router.push({
        path: "/personnel/laborContract/tempInfo/"+tempId
      });
    },
    saveData(data, filename) {
      const blob = new Blob([data], {
        type: 'text/html'
      })
      const objectUrl = URL.createObjectURL(blob)
      // const u = window.URL.createObjectURL(blob)
      console.log(objectUrl)
      vm.src = objectUrl
      vm.$refs.pdffile.handleOpen()
      // let a = document.createElement("a");
      // document.body.appendChild(a);
      // a.style = "display:none";
      // a.href = objectUrl;
      // a.download = filename;
      // a.click();
    },
    // 多选
    getSelectionChange(e) {
      let arr = ''
      // multipleSelection
      e.forEach(v => {
        arr += v.tempId + ','
      })
      vm.multipleSelection = arr
    },
    // 分页
    handleCurrentChange(e) {
      vm.query.pageNumber = e
      vm.getData()
    },
    handleSizeChange(e) {
      vm.query.pageSize = e
      vm.getData()
    },
    // 增加合同模板
    addQuery() {
      vm.$router.push({
        path: "/personnel/laborContract/addTemp/0"
      });
    },
    // 更改模板状态
    setStatus(e) {
      updataTemp(e)
    },
    
  }
}
</script>

<style lang="scss"></style>
