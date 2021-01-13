<template>
  <!-- 员工生日提醒 -->
  <div class="main">
    <div class="title-box" style="width: auto">
      <div class="title-list">
        <div class="list-box">
          <span class="title">类型</span>
          <el-select v-model="query.type" placeholder="选择查询类型" style="width:100px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="list-box">
          <span class="title">时间</span>
          <el-date-picker
            v-model="query.nowValue"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <div class="list-box">
              <el-button class="insert" @click="rawQuery">查询</el-button>
            </div>
            <div class="list-box">
              <el-button class="resetting" @click="runReset">重置</el-button>
            </div>
      </div>
      
    </div>
    <div class="table-main">
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe>
        <el-table-column
          prop="employeeName"
          label="员工姓名">
        </el-table-column>
        <el-table-column
          prop="employeeType"
          label="员工类型">
        </el-table-column>
        <el-table-column
          prop="age"
          label="年龄">
        </el-table-column>
        <el-table-column
          prop="birthday"
          label="出生日期">
        </el-table-column>
        <el-table-column
          prop="entryDate"
          label="入职日期">
        </el-table-column>
        <el-table-column
          prop="seniority"
          label="司龄">
        </el-table-column>
        <el-table-column
          prop="company"
          label="公司名称">
        </el-table-column>
        <el-table-column
          prop="orgName"
          label="部门名称">
        </el-table-column>
        <el-table-column
          prop="postName"
          label="岗位名称">
        </el-table-column>
        <el-table-column
          prop="intervalTime"
          label="距离生日天数">
        </el-table-column>
      </el-table>
      <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
    </div>
  </div>
</template>

<script>

import { getBirthday } from "@/api/personnel/staff";
let vm;
export default {
  data() {
    return {
      query: {
        pageNumber: 1,
        pageSize: 20,
        // 当前日期
        nowValue: null,
        type:null
      },
      tableData:[],
      total:0,
      options:[
        {
          label:"月",
          value:1
        },{
          label:"日",
          value:2
        },
      ]
      
    };
  },
  created() {
    vm = this;
    vm.getData();
  },
  components: {},
  methods: {
    getData() {
      // const month=vm.query.month;
      // if(month!=""){
      //   vm.query.month=parseInt(month);
      // }
      getBirthday(vm.query).then((res) => {
        vm.tableData=res.data.records;
        vm.total=res.data.total;
      });
    },
    //分页
    handleSizeChange(e) {
      vm.query.pageSize = e;
      vm.getData();
    },
    handleCurrentChange(e) {
      vm.query.pageNumber = e;
      vm.getData();
    },
    //查询
    rawQuery(){
      vm.getData();
    },
    runReset(){
      vm.query={
        pageNumber: 1,
        pageSize: 20,
        month: '',
      };
      vm.total=0;
      vm.getData();
    }
  },
};
</script>


<style lang="scss">
    .title-box .el-input__inner {
      padding-left: 30px;
  }
</style>