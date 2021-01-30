<template>
  <div class="main">
    <div class="title-box" style="width: auto">
      <div class="titles-list">
        <div class="button-box">
          <el-button
            class="btn-updata"
            @click="updataHoilday"
          >更新假期余额</el-button>
        </div>
      </div>
    </div>
    <div class="table-view">
      <!-- <table-view :total="total" :table-label="tableLabel" :table-data="tableData"/> -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="50px"/>
        <el-table-column prop="realName" label="员工名称"  align="center"/>
        <el-table-column prop="quotaCycle" label="年份" align="center" />
        <el-table-column prop="marryValue" label="婚假(天)" align="center" />
        <el-table-column prop="yearValue" label="年假(天)" align="center" />
        <el-table-column prop="twoPartValue" label="陪产假(天)" align="center" />
        <el-table-column prop="restValue" label="调休(小时)" align="center" />
        <el-table-column prop="matterValue" label="事假(天)" align="center" />
        <el-table-column prop="lactationValue" label="哺乳假(小时)" align="center" />
        <el-table-column prop="loseValue" label="丧假(天)" align="center" />
        <el-table-column prop="illnessValue" label="病假(小时)" align="center" />
        <el-table-column prop="partValue" label="产假(天)" align="center" />
        <el-table-column prop="exampleValue" label="例假(天)" align="center" />

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
import { selectQuotasList,selectLeaveTypeList,getQuotasList } from '@/api/personnel/holidayManagement'
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
    },
    //更新节假日
    updataHoilday(){
      getQuotasList()
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
