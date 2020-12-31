<template>
  <div class="main attend-store-box">
    <div class="title-box" style="width: auto">
      <div class="title-list">
        <div class="list-box">
          <span class="title">员工:</span>
          <el-input
            v-model="query.employeeName"
            style="width: 100px"
          ></el-input>
        </div>
        <div class="list-box">
          <span class="title">手机号码:</span>
          <el-input v-model="query.mobile" style="width: 100px"></el-input>
        </div>
        <div class="list-box">
          <el-button class="insert" @click="rawQuery">查询</el-button>
        </div>
        <div class="list-box">
          <el-button class="resetting" @click="runReset">重置</el-button>
        </div>
        <div class="list-box">
          <el-button type="primary" @click="uploadModel">导出考勤信息</el-button>
        </div>
      </div>
    </div>
    <div class="table-view">
      <table-view
        :table-data="tableData"
        @getOneData="getOneInfo"
        :table-label="tableLabel"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        @handleSelectionChange="getSelectionChange"
        :total="total"
      ></table-view>
    </div>
  </div>
</template>


<script>
import {
  selectAttend,
  addAttend,
  delAttend,
  selectByIdAttend,
  updataAttend,
} from "@/api/attendance/employeeStore";
import tableView from "@/components/vTable.vue";
import { isButtons } from "@/utils/button";
import { getToken } from "@/utils/auth";
import axios from "axios";
export default {
  data() {
    return {
      query: {
        employeeName: null, //员工
        mobile: null, //手机号码
        pageNumber: "1",
        pageSize: "10",
      },
      workOptions:[
        {label:"是",value:1},
        {label:"否",value:0},
      ],
      tableData: [],
      tableLabel: [
        { label: "员工名称",selection:true, param: "employeeName", align: "center" },
        { label: "手机号码", param: "mobile", align: "center" },
        { label: "打卡日期", param: "createDate", align: "center" },
        { label: "上班打卡时间", param: "benginTime", align: "center" },
        { label: "下班打卡时间", param: "endTime", align: "center" },
        { label: "工作时长", param: "workingHours", align: "center" },
        {
          label: "是否工作日",
          align: "center",
          render: (row) => {
            if (row.workOrRest == 1) {
              return "是";
            } else {
              return "否";
            }
          },
        },
      ],
      total: 0,
      editVisible: false,
      form: {},
    };
  },
  created() {
    this.getData();
  },
  components: {
    tableView,
  },
  methods: {
    getData() {
      selectAttend(this.query).then(
        (res) => (
          (this.tableData = res.data.records), (this.total = res.data.total)
        )
      );
    },
    getSelectionChange() {},
    //分页请求
    handleCurrentChange(e) {
      this.query.pageNumber = e;
      this.getData();
    },
    handleSizeChange(e) {
      this.query.pageSize = e;
      this.getData();
    },
    getOneInfo() {},
    //查询
    rawQuery() {
      this.getData();
    },
    runReset() {
      this.query={
        employeeName: null, //员工
        mobile: null, //手机号码
        pageNumber: "1",
        pageSize: "10",
      };
      this.tota=0;
      this.getData();
    },
    //导出模板
    uploadModel() {
      // alert('不会做');
      const ajax = axios.create({
        timeout: 20000, // 超时时间
      });
      ajax.interceptors.request.use((config) => {
        config.headers["Authorization"] ="Bearer "+getToken();
        return config;
      });
      
      ajax({
        type: "post",
        url: "http://192.168.1.105:9004/api/employee/attend/exportAttend",
        responseType: "arraybuffer",
      })
        // exportEmployeesModel()
        .then((res) => {
          this.saveData(res.data, "员工考勤信息.xlsx");
        })
        .catch((error) => {console.log(error);});
    },
    saveData(data, filename) {
      let blob = new Blob([data], {
        type: "application/vnd.ms-excel;charset=utf-8;",
      });
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display:none";
      a.href = objectUrl;
      a.download = filename;
      a.click();
    },
  },
};
</script>


<style lang="scss" scope>
  .attend-store-box{
    .el-date-editor.el-input{
      width: 100%;
    }
  }
</style>