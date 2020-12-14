<template>
  <div class="main">
    <div class="main-box">
      <div class="user-box">
        <div class="title-box" style="width: auto">
          <div class="title-list">
            <div class="list-box">
              <span class="title">用户名称:</span>
              <el-input
                placeholder="用户名称"
                v-model="query.userName"
                style="width: 100px"
                clearable
              ></el-input>
            </div>
            <div class="list-box">
              <span class="title">操作时间:</span>
               <el-date-picker
                  v-model="query.timeList"
                  value-format="yyyy-MM-dd"
                  format="yyyy 年 MM 月 dd 日"
                  type="daterange"
                  start-placeholder="操作开始时间"
                  range-separator="--"
                  end-placeholder="操作结束时间"
                  @change="dataPicker"
                ></el-date-picker>
            </div>

           
            <div class="list-box">
              <el-button class="insert" @click="rawQuery">查询</el-button>
            </div>
            <div class="list-box">
              <el-button class="resetting" @click="runReset">重置</el-button>
            </div>
          </div>
        </div>
        <div class="table-view">
          <table-view
            :table-data="tableData"
            @handleCurrentChange="handleCurrentChange"
            @handleSizeChange="handleSizeChange"
            :table-label="tableLabel"
            :table-option="tableOption"
            :total="total"
            :current-page="currentPage"
          ></table-view>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import tableView from "@/components/vTable.vue";
import { findErrorLog } from "@/api/system/log";
export default {
  data() {
    return {
      tableData: [],
      //批量删除数组
      multipleSelection: "",
      typeOption:[],
      modelOption:[],
      //请求参数
      query: {
        pageNumber: 1,
        pageSize: 10,
        endTime: null,
        startTime: null,
        userName: null,
        timeList: null,
      },
      total: 0,
      tableLabel: [
        { label: "操作员id", param: "operUserId", align: "center" },
        {
          label: "异常名称",
          param: "excName",
          align: "center",
          fixed: true,
          click: true,
        },
        {
          label: "异常方法",
          param: "operMethod",
          align: "center",
        },
        // { label: "异常信息", param: "excMessage", align: "center" },
        // {
        //   label: "请求参数",
        //   param: "operRequParam",
        //   align: "center",
        // },
        // { label: "返回参数", param: "operRespParam", align: "center" },
        // { label: "操作方法", param: "operMethod", align: "center" },
        { label: "操作员名称", param: "operUserName", align: "center" },
        { label: "请求ip", param: "operIp", align: "center" },
        { label: "请求地址", param: "operUri", align: "center" },
        { label: "操作时间", param: "operCreateTime", align: "center" },
        { label: "操作版本号", param: "operVer", align: "center" },

      ],
      tableOption: {},
      currentPage:0,
      //用户设置角色
      userIdList: [],
      roleIdList: [],
      roleChangeList: [],
    };
  },
  components: {
    tableView,
  },
  created() {
    this.getData();
  },
  methods: {
    //获取所有用户
    getData() {
      findErrorLog(this.query).then(
        (res) => (
          (this.tableData = res.data.records), (this.total = res.data.total)
        )
      );
    },
    //时间表
    dataPicker(e) {
      this.query.startTime = e[0];
      this.query.endTime = e[1];
    },
    //根据条件查询
    rawQuery() {
      this.query.pageNumber = 1;
      this.query.pageSize = 10;
      this.getData();
    },
    //重置请求
    runReset() {
      this.query = {
        pageNumber: 1,
        pageSize: 10,
        endTime: null,
        operModul: null,
        operType: null,
        startTime: null,
        userName: null,
        timeList: null,
      };
      this.currentPage=0;
      this.total=0;
      this.getData();
    },
    //分页请求
    handleCurrentChange(e) {
      this.query.pageNumber = e;
      this.getData();
    },
    handleSizeChange(e) {
      this.query.pageSize = e;
      this.getData();
    },
  },
};
</script>
<style lang='scss'>
</style>