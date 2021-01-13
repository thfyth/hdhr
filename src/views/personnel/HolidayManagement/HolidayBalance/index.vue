<template>
  <div class="main">
    <div class="table-view">
      <!-- <table-view :total="total" :table-label="tableLabel" :table-data="tableData"/> -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="50px"/>
        <el-table-column prop="userid" label="钉钉用户id"  align="center"/>
        <el-table-column prop="quotaNumPerHour" label="额度总天数" align="center" />
        <el-table-column prop="quotaNumPerDay" label="额度总小时数" align="center" />
        <el-table-column prop="quotaCycle" label="额度所对应的周期" align="center" />
        <el-table-column prop="endTime" label="额度有效期结束时间" align="center" />
        <el-table-column prop="startTime" label="假期有效期开始时间" align="center" />
        <el-table-column prop="usedNumPerDay" label="额度已使用天数" align="center" />
        <el-table-column prop="usedNumPerHour" label="额度已使用小时" align="center" />
        <el-table-column prop="leaveCode" label="假期类型" align="center" />
      </el-table>
      <div class="block pagination-box">
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
  </div>
</template>
<script>
let vm
import tableView from '@/components/vTable'
import { selectQuotasList,selectLeaveTypeList } from '@/api/personnel/holidayManagement'
export default {
  components: { tableView },
  data() {
    return {
      query: {
        //   钉钉用户id
        dingUserId: null,
        pageNumber: 1,
        pageSize: 10,
        realName: null
      },
      total: 0,

      tableData: []
    }
  },
  created() {
    vm = this
    vm.getData()
  },
  methods: {
    getData() {
      selectQuotasList(vm.query).then(res => {
        console.log(res)
        if (res.code === 0) {
          vm.tableData = res.data.records
          vm.total = res.data.total
        }
      })
        const query={
            // 钉钉用户id
            dingUserId:null,
            pageNumber:1,
            pageSize:10,
            // 员工姓名
            realName:null
        }
    //   selectLeaveTypeList(query).then(res=>{
    //       console.log(res);
    //   })
    },
    handleSizeChange(e){
        vm.query.pageSize=e;
        vm.getData();
    },
    handleCurrentChange(e){
        vm.query.pageNumber=e;
        vm.getData();
    }
  }
}
</script>
