<template>
  <div class="main holiday-main">
    <div class="title-box" style="width: auto">
      <div class="titles-list">
        <div class="button-box">
          <el-button class="add" @click="addQuery">新增</el-button>
        </div>
        <div class="button-box">
          <el-button class="del" @click="allDelhoi">删除</el-button>
        </div>
        <div class="button-box">
          <el-button
            class="btn-updata"
            @click="updataHoilday"
          >更新假期类型</el-button>
        </div>
      </div>
      
        
    </div>
    <div class="table-view">
      <table-view
        :table-data="tableData"
        :total="total"
        :table-option="tableOption"
        :table-label="tableLabel"
        @handleSelectionChange="getSelectionChange"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        @getOneData="getOneInfo"
      />
    </div>
    <div class="model">
      <el-dialog
        title="节假日设置"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="dialogBeforeClose"
      >
        <el-form :model="form" label-width="120px">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="节假日名称">
                <el-input v-model="form.holidayName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="节假日类型">
                <el-select v-model="form.dayType" placeholder="">
                  <el-option
                    v-for="item in holidayOpt"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="放假时间">
                <el-date-picker
                  v-model="form.holidayDate"
                  type="date"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  placeholder="放假时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调休上班时间">
                <el-date-picker
                  v-model="form.takeWorkDate"
                  type="date"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  placeholder="调休上班时间"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
let vm
import {
  delHoliday,
  addHoliday,
  selectHoliday,
  updataHoliday,
} from '@/api/personnel/conventions'
import tableView from '@/components/vTable'
import { getAttrMenu } from '@/api/attrManage'

import { getHolidaysType } from '@/api/personnel/holidayManagement'
export default {
  components: { tableView },
  data() {
    return {
      total: 0,
      tableData: [],
      tableLabel: [
        { label: '节假日ID', param: 'holidayId', align: 'center' },
        {
          label: '节假日名称',
          param: 'holidayName',
          align: 'center',
          fixed: true,
          click: true
        },
        { label: '放假时间', param: 'holidayDate', align: 'center' },
        { label: '调休上班时间', param: 'takeWorkDate', align: 'center' },
        {
          label: '类型',
          param: 'dayType',
          align: 'center',
          render: row => {
            if (row.dayType == 1) {
              return '法定'
            }
            {
              return '其它'
            }
          }
        }
      ],
      tableOption: {},
      // 查询合同参数
      query: {
        pageNumber: 1,
        pageSize: 10
      },
      holidayOpt: [],
      dialogVisible: false,
      // 用户操作，true为新增，false为修改
      option: true,
      form: {},
      multipleSelection: ''
    }
  },
  created() {
    vm = this
    vm.getData()
    vm.getOption()
  },
  methods: {
    getData() {
      selectHoliday(vm.query).then(res => {
        if (res.code === 0) {
          vm.tableData = res.data.records
          vm.total = res.data.total
        }
      })
    },
    getOption() {
      getAttrMenu({ valueCode: 'holiday_type' }).then(res => {
        if (res.code === 0) {
          vm.holidayOpt = res.data[0].holiday_type.option
        }
      })
    },
    // 新增节假日设置
    addQuery() {
      vm.option = true
      vm.dialogVisible = true
    },
    allDelhoi() {
      const idList = vm.multipleSelection
      if (idList.length < 1) {
        vm.$message.error('请最少选择一个合同进行删除')
        return
      }
      vm.$confirm('此操作将会删除合同, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除信息
          delHoliday({ idList }).then(res => {
            if (res.code === 0) {
              vm.$message.success(res.message)
              vm.getData()
            } else {
              vm.$message.error(res.message)
            }
          })
        })
        .catch(err => {})
    },
    // 保存信息
    saveEdit() {
      let data
      if (vm.option) {
        // 新增
        data = addHoliday(vm.form)
      } else {
        // 修改
        data = updataHoliday(vm.form)
      }
      data.then(res => {
        if (res.code === 0) {
          vm.$message.success(res.message)
          vm.getData()
          vm.dialogVisible = false
        } else {
          vm.$message.error()
          res.message
        }
      })
    },
    // 多选
    getSelectionChange(e) {
      let arr = ''
      // multipleSelection
      e.forEach(v => {
        arr += v.holidayId + ','
      })
      vm.multipleSelection = arr
    },
    // 获取一个消息
    getOneInfo(e) {
      vm.form = e
      vm.option = false
      vm.dialogVisible = true
    },
    handleCurrentChange(e) {
      vm.query.pageNumber = e
      vm.getData()
    },
    handleSizeChange(e) {
      vm.query.pageSize = e
      vm.getData()
    },
    //更新节假日
    updataHoilday(){
      getHolidaysType()
      .then(res=>{
        if(res.code === 0){
          vm.$message.success(res.message)
          vm.getData()
        }else{
          vm.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.holiday-main {
  .el-date-editor.el-input {
    width: 100% !important;
  }
}
</style>
