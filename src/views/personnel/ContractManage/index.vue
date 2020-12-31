<template>
  <div class="main">
    <div class="main-box">
      <div class="title-box" style="width: auto">
        <!-- <div class="title-list">
            <div class="list-box">
              <span class="title">姓名:</span>
              <el-input placeholder="请输入姓名" v-model="query.realName" style="width: 200px" clearable></el-input>
            </div>
            <div class="list-box">
              <span class="title">用户名:</span>
              <el-input
                placeholder="请输入用户名"
                v-model="query.userName"
                style="width: 200px"
                clearable
              ></el-input>
            </div>
            <div class="list-box">
              <span class="title">手机号:</span>
              <el-input placeholder="请输入手机号" v-model="query.mobile" style="width: 200px" clearable></el-input>
            </div>
            <div class="list-box">
              <el-button class="insert" @click="rawQuery">查询</el-button>
            </div>
            <div class="list-box">
              <el-button class="resetting" @click="runReset">重置</el-button>
            </div>
          </div> -->
        <!-- <div class="titles-list">
            <div class="button-box">
              <el-button class="add" :disabled="!hasButtons('personer-add')" @click="addQuery">新增</el-button>
            </div>
            <div class="button-box">
              <el-button
                class="del"
                :disabled="!hasButtons('personer-del') || multipleSelection == ''"
                @click="allDelUser"
              >删除</el-button>
            </div>
          </div> -->
      </div>
      <div class="table-view">
        <table-view
          :table-data="tableData"
          @handleSelectionChange="getSelectionChange"
          @handleCurrentChange="handleCurrentChange"
          @handleSizeChange="handleSizeChange"
          @getOneData="getOneInfo"
          :table-label="tableLabel"
          :table-option="tableOption"
          :total="total"
        ></table-view>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getContract,
  delContract,
  addContract,
  contractSelect,
  contractTotal,
  updateContract,
} from "@/api/personnel/contractManage";
import tableView from "@/components/vTable.vue";
export default {
  data() {
    return {
      total: 0,
      tableData: [],
      tableLabel: [
        { label: "员工合同id", param: "contractId", align: "center" },
        {
          label: "合同名称",
          param: "contractName",
          align: "center",
          fixed: true,
          click: true,
        },
        {
          label: "合同编码",
          param: "contractCode",
          align: "center",
        },
        { label: "合同类型", param: "contractType", align: "center" },
        { label: "合同分类", param: "contractClass", align: "center" },
        { label: "甲方", param: "firstCompany", align: "center" },
        {
          label: "乙方",
          param: "secondName",
          align: "center",
        },
        {
          label: "签署日期",
          param: "signDate",
          align: "center",
        },
        { label: "试用期(起)", param: "probationBegin", align: "center" },
        { label: "试用期(止)", param: "probationEnd", align: "center" },
        { label: "合同有效期(起)", param: "validityBegin", align: "center" },
        { label: "合同有效期(止)", param: "validityEnd", align: "center" },
        { label: "合同备注", param: "contractDesc", align: "center" },
        
        {
          label: "合同状态",
          param: "status",
          align: "center",
          render: (row) => {
            if (row.status == 1) {
              return "未生效";
            } else if (row.status == 2) {
              return "已生效";
            } else if (row.status == 3) {
              return "解除";
            } else {
              return "---";
            }
          },
        },
      ],
      tableOption: {},
      //查询合同参数
      query: {
        contractClass: null,
        contractCode: null,
        contractDesc: null,
        contractId: null,
        contractName: null,
        contractType: null,
        contractUrl: null,
        createBy: null,
        employeeId: null,
        firstParty: null,
        probationBegin: null,
        probationEnd: null,
        secondParty: null,
        signDate: null,
        updateBy: null,
        validityBegin: null,
        validityEnd: null,
        isEnable: 0,
      },
    };
  },
  created() {
    this.getData();
  },
  components: {
    tableView,
  },
  methods: {
    //获取所有合同
    getData() {
      contractSelect(this.query).then((res) => (this.tableData = res.data.records,this.total=res.data.total));
    },
    //多选
    getSelectionChange() {},
    //获取单个信息
    getOneInfo(e) {
      console.log(e);
      const { employeeId,contractId,employeeName } = e;
      this.$router.push({
        path: `/personnel/contractDetail/${employeeId}&${contractId}&${employeeName}`,
      });
    
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

<style lang="scss">
</style>