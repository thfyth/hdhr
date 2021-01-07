<template>
  <div class="main">
    <div class="title-box" style="width: auto">
      <div class="title-list">
        <div class="list-box">
          <span class="title">职级名称:</span>
          <el-input
            v-model="query.rankName"
            style="width: 200px"
            placeholder=""
          />
        </div>
        <div class="list-box">
          <el-button class="insert" @click="getData">查询</el-button>
        </div>
        <div class="list-box">
          <el-button class="resetting" @click="runReset">重置</el-button>
        </div>
      </div>
      <div class="titles-list">
        <div class="button-box">
          <el-button class="add" @click="addQuery">新增</el-button>
        </div>
        <div class="button-box">
          <el-button class="del" @click="delAll">删除</el-button>
        </div>
      </div>
    </div>
    <div class="table-view">
      <v-table
        :table-data="tableData"
        :table-label="tableLabel"
        :table-option="tableOption"
        :total="total"
        @handleSelectionChange="getSelectionChange"
        @handleButton="getButton"
        @getOneData="getOneInfo"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>

    <div class="modality">
      <el-dialog
        title="福利信息"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="dialogBeforeClose"
      >
        <el-form :model="form" label-width="120px">
          <el-form-item label="职级" :required="true">
            <el-select v-model="form.rankId" placeholder="职级">
              <el-option
                v-for="item in rankOpt"
                :key="item.rankId"
                :label="item.rankName"
                :value="item.rankId"
              />
            </el-select>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="带薪年假天数">
                <el-input v-model="form.annualLeave" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="丧假天数">
                <el-input v-model="form.bereavementLeave" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="汽车补贴">
                <el-input v-model="form.carSubsidy" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用餐补贴">
                <el-input v-model="form.eatSubsidy" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="探亲假天数">
                <el-input v-model="form.homeLeave" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="房补">
                <el-input v-model="form.houseSubsidy" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="婚假天数">
                <el-input v-model="form.marriageLeave" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="通讯补贴">
                <el-input v-model="form.phoneSubsidy" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="员工慰问补贴">
                <el-input v-model="form.staffSubsidy" />
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
  addWelfare,
  selectWelfare,
  delWelfare,
  updataWelfare
} from '@/api/personnel/welfare'
import vTable from '@/components/vTable'
import { getRankInfo } from '@/api/management/rankManage'
export default {
  components: { vTable },
  data() {
    return {
      query: {
        pageNumber: 1,
        pageSize: 10,
        rankName: null
      },
      tableData: [],
      total: 0,
      form: {},
      dialogVisible: false,
      rankOpt: [],
      tableLabel: [
        { label: '福利id', param: 'welfareId', align: 'center' },
        {
          label: '职级名称',
          param: 'rankName',
          align: 'center',
          fixed: true,
          click: true
        },
        { label: '带薪年假天数', param: 'annualLeave', align: 'center' },
        { label: '丧假天数', param: 'bereavementLeave', align: 'center' },
        { label: '汽车补贴', param: 'carSubsidy', align: 'center' },
        { label: '用餐补贴', param: 'eatSubsidy', align: 'center' },
        { label: '探亲假天数', param: 'homeLeave', align: 'center' },
        { label: '房补', param: 'houseSubsidy', align: 'center' },
        { label: '婚假天数', param: 'marriageLeave', align: 'center' },
        { label: '通讯补贴', param: 'phoneSubsidy', align: 'center' },
        { label: '员工慰问补贴', param: 'staffSubsidy', align: 'center' }
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
          }
        ]
      },
      // 判断操作 true为新增，false为删除
      option: true,
      // 删除
      delStr: ''
    }
  },
  created() {
    vm = this
    vm.getData()
    vm.getOption()
  },
  methods: {
    getData() {
      selectWelfare(vm.query).then(res => {
        if (res.code === 0) {
          vm.tableData = res.data.records
          vm.total = res.data.total
        } else {
          vm.$message.error(res.message)
        }
      })
    },
    // 获取下拉框
    getOption() {
      // 获取职级信息
      const rankQuery = {
        pageNumber: '1',
        pageSize: '100',
        rankName: null
      }
      getRankInfo(rankQuery).then(res => (vm.rankOpt = res.data.records))
    },
    // 多选
    getSelectionChange(e) {
      let arr = ''
      e.forEach(v => {
        arr += v.welfareId + ','
      })
      vm.delStr = arr
    },
    // 按钮
    getButton(e, row) {
      if (e == 'edit') {
        vm.getOneInfo(row)
      }
    },
    // 获取单个信息
    getOneInfo(row) {
      vm.form = row
      vm.option = false
      vm.dialogVisible = true
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
    // 新增
    addQuery() {
      vm.option = true
      vm.dialogVisible = true
    },
    // 删除
    delAll() {
      const idList = vm.delStr
      vm.$confirm('此操作将会删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除信息
          delWelfare({ idList }).then(res => {
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
    // 重置
    runReset() {
      vm.query = {
        pageNumber: 1,
        pageSize: 10,
        rankName: null
      }
      vm.getData()
    },
    saveEdit() {
      let data
      if (vm.option) {
        // 新增
        data = addWelfare(vm.form)
      } else {
        // 修改
        data = updataWelfare(vm.form)
      }
      data.then(res => {
        if (res.code === 0) {
          vm.getData()
          vm.$message.success(res.message)
          vm.dialogVisible = false
        } else {
          vm.$message.error(res.message)
        }
      })
    }
  }
}
</script>
