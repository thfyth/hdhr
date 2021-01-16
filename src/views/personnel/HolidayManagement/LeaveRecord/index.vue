<template>
  <div class="main">
    <div class="table-view">
      <table-view :total="total" :table-label="tableLabel" :table-data="tableData"
      @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>
  </div>
</template>
<script>
let vm
import tableView from '@/components/vTable'
import { selectHoliday } from '@/api/personnel/holidayManagement'
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
      tableLabel: [
        {
          label: '请假记录Id',
          param: 'recordId',
          align: 'center',
          
        },
        { label: '员工名称', param: 'realName', align: 'center',fixed: true,
          click: true},
        { label: '请假天数', param: 'recordNumPerDay', align: 'center' },
        { label: '请假小时数', param: 'recordNumPerHour', align: 'center' },
        { label: '请假原因', param: 'leaveReason', align: 'center' },
        { label: '请假类型(单位)', param: 'leaveViewUnit', align: 'center' },
        { label: '额度有效期开始时间', param: 'startTime', align: 'center' },
        { label: '额度有效期结束时间', param: 'endTime', align: 'center' },
        { label: '假期记录类型', param: 'leaveRecordType', align: 'center' },
        { label: '假期类型', align: 'center',
            render: row => {
                if(row.leaveStatus == "init"){
                    return "请假申请"
                }else if(row.leaveStatus == "success"){
                    return "请假通过"
                }else if(row.leaveStatus == "refuse"){
                    return "请假被拒"
                }else if(row.leaveStatus == "abort"){
                    return "请假终止"
                }else if(row.leaveStatus == "revoke"){
                    return "撤销已同意的请假单"
                }else{
                    return "---"
                }
            },
        },
      ],
      tableData:[]
    //   calType	string
// 计算类型add：新增delete：删除update：更新null：请假

    }
  },
  created() {
    vm = this
    vm.getData()
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
    handleCurrentChange(e) {
      vm.query.pageNumber = e
      vm.getData()
    },
    handleSizeChange(e) {
      vm.query.pageSize = e
      vm.getData()
    },
  }
}
</script>
