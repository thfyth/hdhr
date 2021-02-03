<template>
  <div class="dashboard-container main">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <div class="header-dashboard">
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="header-calendar">
            <Calendar :sunday-start="true" />
          </div>
        </el-col>
        <el-col :span="14">
          <el-tabs v-model="activeInfo" :before-leave="handleLeave1">
            <el-tab-pane :label="'提前提醒('+(numForm.msgCount || 0) +')'" name="1" />
            <el-tab-pane :label="'今日生日员工('+(numForm.toDayBirthdayCount || 0)+')'" name="2" />
            <el-tab-pane :label="'本月生日员工('+(numForm.toMonthBirthdayCount || 0)+')'" name="3" />
          </el-tabs>
          <div class="table-view">
            <el-table
              v-show="activeInfo == 1"
              :data="tableData0"
              height="300"
              style="width: 100%"
            >
              <el-table-column type="index" width="50" label="序号" />
              
              <el-table-column
                prop="msgName"
                align="center"
                label="消息名称"
              />
              <el-table-column
                prop="senderName"
                align="center"
                label="发送人"
              />
              <el-table-column
                prop="sendTime"
                align="center"
                label="发送时间"
              />
            </el-table>
            <el-table
              v-show="activeInfo == 2"
              :data="tableData1"
              height="300"
              style="width: 100%"
            >
              <el-table-column prop="employeeName" label="员工姓名" />
              <el-table-column prop="employeeType" label="员工类型" />
              <el-table-column prop="age" label="年龄" />
              <el-table-column prop="birthday" label="出生日期" />
              <el-table-column prop="entryDate" label="入职日期" />
              <el-table-column prop="seniority" label="司龄" />
              <el-table-column prop="company" label="公司名称" />
              <el-table-column prop="orgName" label="部门名称" />
              <el-table-column prop="postName" label="岗位名称" />
            </el-table>
            <el-table
              v-show="activeInfo == 3"
              :data="tableData1"
              height="300"
              style="width: 100%"
            >
              <el-table-column prop="employeeName" label="员工姓名" />
              <el-table-column prop="employeeType" label="员工类型" />
              <el-table-column prop="age" label="年龄" />
              <el-table-column prop="birthday" label="出生日期" />
              <el-table-column prop="entryDate" label="入职日期" />
              <el-table-column prop="seniority" label="司龄" />
              <el-table-column prop="company" label="公司名称" />
              <el-table-column prop="orgName" label="部门名称" />
              <el-table-column prop="postName" label="岗位名称" />
              <el-table-column prop="intervalTime" label="距离生日天数" />
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="report-form">
      <el-tabs v-model="activeName" :before-leave="handleLeave">
        <el-tab-pane label="HR日报表" name="1" />
        <el-tab-pane label="HR周报表" name="2" />
        <el-tab-pane label="HR月报表" name="3" />
        <el-tab-pane label="HR年报表" name="4" />
      </el-tabs>
      <div class="tabs-table">
        <span class="tabs-title">
          详细数据
        </span>
        <div class="table-view">
          <el-table :data="tableData" height="350" style="width: 100%"
          :row-class-name="tableRowClassName"
          >
            <el-table-column type="index" width="50" label="序号" />
            <el-table-column prop="nowValue" align="center" label="日期" />
            <el-table-column
              prop="workingCount"
              align="center"
              label="在职人数"
            />
            <el-table-column
              prop="nowMonthCount"
              align="center"
              label="当月转入数"
            />
            <el-table-column
              prop="notContractCount"
              align="center"
              label="合同未签人数"
            />
            <el-table-column
              prop="reContractCount"
              align="center"
              label="合同续签人数"
            />
            <el-table-column
              prop="leaveWorkCount"
              align="center"
              label="离职人数"
            />
            <el-table-column
              prop="notSocialFundCount"
              align="center"
              label="未参保人数"
            />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let vm
import { mapGetters } from 'vuex'
import { getReport, getIndexCount,getLocalMsg } from '@/api/index'
// 日历文件
import Calendar from '@/components/calendar/index'
import { getBirthday } from '@/api/personnel/staff'
export default {
  name: 'Dashboard',
  components: { Calendar },
  data() {
    return {
      activeName: '1',
      activeInfo: '1',
      tableData: [],
      tableData0: [],
      tableData1: [],
      numForm:{}
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  created() {
    vm = this
    vm.getData()
    vm.getStyInfo()
  },
  methods: {
    getData() {
      const dateConditions = parseInt(vm.activeName)
      const requerst0 = getReport({ dateConditions })
      const requerst1 = getIndexCount({ nowValue: vm.dateFormat("YYYY-mm-dd"), })
      vm.tableData=[];
      Promise.all([requerst0, requerst1]).then(res => {
        if (res[0].code === 0) {
          vm.tableData = res[0].data
          vm.numForm=res[1].data
        }
      })
    },
    //获取系统消息
    getStyInfo(){
      getLocalMsg({ nowValue:null })
      .then(res=>{
        if(res.code === 0){
          vm.tableData0=res.data
        }
      })
    },
    // 获取员工生日
    getEmpBirthdoy() {
      let query = {}
      if (vm.activeInfo == '2') {
        // 查询当日
        query = {
          pageNumber: 1,
          pageSize: 20,
          nowValue: vm.dateFormat("YYYY-mm-dd"),
          type: 2
        }
      } else {
        // 查询当月
        query = {
          pageNumber: 1,
          pageSize: 20,
          nowValue: vm.dateFormat("YYYY-mm-dd"),
          type: 1
        }
      }
      getBirthday(query).then(res => {
        vm.tableData1 = res.data.records
      })
    },
    // 格式化日期
    dateFormat(fmt) {
      let ret,
          date=new Date();
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (const k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
          )
        }
      }
      return fmt
    },
    handleLeave(newId, oldId) {
      if (newId !== vm.activeName) (vm.activeName = newId), vm.getData()
    },
    handleLeave1(newId, oldId) {
      if (newId !== vm.activeInfo){
        vm.activeInfo = newId;
        if( newId == 1) vm.getStyInfo()
        else vm.getEmpBirthdoy()
      }
    },
    //换行颜色
     tableRowClassName({row, rowIndex}) {
        if (rowIndex%2 == 0) {
          return 'bg-row';
        }
        return '';
      }
  }
}
</script>

<style lang="scss">
.dashboard-container {
  background: #f3f3f3;
  .el-tabs--top {
    background: #fff;
    padding-left: 5px;
    .el-tabs__header {
      margin: 0;
    }
  }
  .bg-row{
    background: #F4F5F6;
  }
  .report-form {
    margin-top: 20px;
    .tabs-table {
      .tabs-title {
        display: block;
        font-size: 16px;
        font-weight: 500;
        color: #304156;
        line-height: 48px;
        background: #fff;
        padding-left: 20px;
      }
    }
  }
}
</style>
