<template>
  <div class="main manage-common">
    <div class="title-box" style="width: auto">
      <div class="title-list">
        <div class="list-box">
          <span class="title">员工姓名:</span>
          <el-input
            v-model="query.empName"
            placeholder="姓名"
            style="width: 200px"
            clearable
          />
        </div>
        <div class="list-box">
          <span class="title">月份:</span>
          <el-date-picker
            v-model="query.nowValue"
            type="date"
            placeholder="选择月份"
            format="yyyy 年 MM 月"
            value-format="yyyy-MM"
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
        <!-- <div class="button-box">
              <el-button class="del" @click="delMsg">删除</el-button>
            </div> -->
      </div>
    </div>
    <div class="table-view">
      <el-table
        :data="tableData"
        :header-cell-style="{ background: '#F7F8FA', color: '#293B59' }"
        formatter
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          fixed
          align="center"
          width="50"
        />
        <el-table-column label="保险名称" align="center" fixed>
          <template slot-scope="{ row }">
            <span
              class="article"
              @click="getOneInfo(row)"
              v-text="row.insureName"
            />
          </template>
        </el-table-column>
        <el-table-column prop="empName" label="员工姓名" align="center" />
        <el-table-column prop="mobile" label="手机号码" align="center" />
        <el-table-column prop="idNo" label="身份证号码" align="center" />
        <el-table-column prop="entryDate" label="入职日期 " align="center" />
        <el-table-column prop="insureCompany" label="保险公司" align="center" />
        <el-table-column prop="insureCost" label="保费" align="center" />
        <el-table-column
          prop="insureEndDate"
          label="保险到期时间"
          align="center"
        />
        <el-table-column prop="insureAmount" label="保额" align="center" />
        <el-table-column
          prop="insureStartDate"
          label="保险生效时间"
          align="center"
        />
        <el-table-column prop="lose" label="是否过期" align="center" />
        <el-table-column label="参保状态" align="center" width="100">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-text="待参保"
              class="tablescope"
              active-text="在保"
              inactive-color="#ff4949"
              @change="setStatus(row, 'status')"
            />
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center" />
      </el-table>
      <div class="block pagination-box">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <el-dialog
        title="新增信息"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="dialogBeforeClose"
      >
        <el-form :model="form" label-width="120px" class="form-model">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="员工">
                <el-autocomplete
                  v-model="form.empName"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入内容"
                  @select="handleSelect"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="保险名称">
                <el-input v-model="form.insureName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="保险公司">
                <el-input v-model="form.insureCompany" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="保额">
                <el-input v-model="form.insureAmount" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="保险生效时间">
                <el-date-picker
                  v-model="form.insureStartDate"
                  type="date"
                  placeholder="保险生效时间"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="保险到期时间">
                <el-date-picker
                  v-model="form.insureEndDate"
                  type="date"
                  placeholder="保险到期时间"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="参保状态">
                <el-select v-model="form.status" placeholder="参保状态">
                  <el-option
                    v-for="item in stausOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="保费">
                <el-input v-model="form.insureCost" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注">
                <el-input v-model="form.remarks" />
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
import { selectEmpName } from '@/api/personnel/salaryManage'
import {
  addInsure,
  selectInsure,
  updataInsure
} from '@/api/personnel/insuranceManage'
export default {
  data() {
    return {
      query: {
        empName: null,
        // 月
        nowValue: null,
        pageNumber: 1,
        pageSize: 10
      },
      currentPage: 10,
      total: 0,
      tableData: [],
      dialogVisible: false,
      form: {},
      // true为新增。false为修改
      option: true,
      stausOpt: [
        {
          value: 0,
          label: '待参保'
        },
        {
          value: 1,
          label: '在保'
        }
      ]
    }
  },
  created() {
    vm = this
    vm.getData()
  },
  methods: {
    // 查询薪资
    getData() {
      selectInsure(vm.query).then(res => {
        console.log(res)
        if (res.code === 0) {
          vm.tableData = res.data.records
          vm.total = res.data.total
        }
      })
    },
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
    // 重置
    runReset() {
      vm.query.empName = null
      // 月
      vm.query.nowValue = null
      vm.getData()
    },
    // 新增
    addQuery() {
      vm.form = {}
      vm.option = true
      vm.dialogVisible = true
    },
    // 远程搜索员工
    handleSelect(e) {
      vm.form.empId = e.empId
    },
    querySearchAsync(queryString, cb) {
      const { empName } = vm.form
      selectEmpName({ empName }).then(res => {
        console.log(res)
        const data = res.data
        if (data.length > 0) {
          const employeeList = []
          data.forEach(v => {
            employeeList.push({
              value: v.empName,
              empId: v.empId
            })
          })
          cb(employeeList)
        }
      })
    },
    saveEdit() {
      // 保存信息
      if (!vm.form.empId) {
        vm.$message.error('请选择员工')
        return
      }
      let data
      if (vm.option) {
        // 新增
        data = addInsure(vm.form)
      } else {
        // 修改
        data = updataInsure(vm.form)
      }
      data.then(res => {
        if (res.code === 0) {
          vm.$message.success(res.message)
          vm.getData()
          vm.dialogVisible = false
        } else {
          vm.$message.error(res.message)
        }
      })
    },
    // 修改状态
    setStatus(e, field) {
      // 更新用户
      const form = {
        insureId: e.insureId
      }
      form[field] = e[field]
      updataInsure(form).then(res => {
        if (res.code !== 0) {
          vm.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.manage-common {
  .el-input--prefix .el-input__inner {
    padding-left: 30px !important;
  }
  .form-model{
        .el-date-editor.el-input{
        width: 100%;
        }
    }
  .tablescope {
    .el-switch__label--left {
      position: absolute;
      left: 15px;
      width: 60px;
      color: #fff;
      z-index: -1111;
    }
    .el-switch__core {
      width: 70px !important;
    }
    
    
    .el-switch__label--right {
      position: absolute;
      right: 15px;
      display: inline-block;
      width: 60px;
      color: #fff;
      z-index: -1111;
    }
    .el-switch__label--right.is-active {
      z-index: 1111;
      color: #fff !important;
    }
    .el-switch__label--left.is-active {
      z-index: 1111;
      color: #fff !important;
    }
  }
}
</style>
