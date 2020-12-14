<template>
  <div class="mian">
    <div class="title-box" style="width: auto">
      <div class="title-list">
        <div class="list-box">
          <span class="title">组织:</span>
          <el-cascader
            v-model="query.orgId"
            ref="queryOrgId"
            :options="orgData"
            :props="orgProps"
            :show-all-levels="false"
          ></el-cascader>
        </div>
        <div class="list-box">
          <el-button class="insert" @click="rawQuery">查询</el-button>
        </div>
        <div class="list-box">
          <el-button class="resetting" @click="runReset">重置</el-button>
        </div>
      </div>
      <div class="titles-list">
        <div class="button-box">
          <el-button class="add" @click="addMessageSet" :disabled="!hasButtons('messageSet-add')">新增提醒</el-button>
        </div>
        <div class="button-box">
          <el-button class="del" 
          :disabled="!hasButtons('messageSet-del') || multipleSelection == ''"
          @click="allDelSet"
          >删除</el-button>
        </div>
      </div>
    </div>
    <div class="table-view">
      <table-view
        :table-data="tableData"
        @getOneData="getOneInfo"
        :table-label="tableLabel"
        @handleCurrentChange="handleCurrentChange1"
        @handleSizeChange="handleSizeChange"
        @handleSelectionChange="getSelectionChange1"
        :total="total"
      ></table-view>
    </div>
    <div class="model">
      <el-dialog title="提醒设置" :visible.sync="editVisible" width="30%">
        <el-form ref="form" :model="messageSet" label-width="140px">
          <el-form-item label="提醒组织:" :required="true">
            <el-cascader
              v-model="messageSet.orgId"
              ref="orgIdCascader"
              :options="orgData"
              :props="orgProps"
              :show-all-levels="false"
            ></el-cascader>
          </el-form-item>
          <template v-for="item in formList">
            <el-form-item
              :label="item.forName"
              :prop="item.formModel"
              :key="item.id"
            >
              <el-switch
                v-model="messageSet[item.formModel]"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                :active-value="1"
                :inactive-value="0"
                inactive-text="不启用"
                @change="
                  getSwitchData(
                    $event,
                    item.funData1,
                    item.funData2,
                    item.formId,
                    item.modelName
                  )
                "
              >
              </el-switch>
            </el-form-item>
            <el-form-item
              label="模板名称"
              v-if="messageSet[item.funData1] != null"
              :prop="item.modelName"
              :key="item.id"
            >
              <span v-text="messageSet[item.modelName]"></span>
            </el-form-item>

            <el-form-item
              :label="item.advanceName"
              v-if="item.advance && messageSet[item.formModel] > 0"
              :prop="item.formModel"
              :required="true"
              :key="item.id"
            >
              <el-input
                v-model.number="messageSet[item.remindAdvance]"
                type="number"
              ></el-input>
            </el-form-item>
          </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="选择模板"
        :visible.sync="editVisible1"
        @close="closeFun"
        width="50%"
      >
        <!-- <el-select
          v-model="optionsId"
          @change="selectOption"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.remindId"
            :label="item.remindName"
            :value="item.remindId"
          >
          </el-option>
        </el-select> -->
        <table-view
          :table-data="tableData1"
          :table-label="tableLabel1"
          @handleCurrentChange="handleCurrentChange1"
          @handleSizeChange="handleSizeChange1"
          :table-option="tableOption"
          :total="total1"
          @handleButton="getButton"
        ></table-view>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible1 = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { logger } from "runjs/lib/common";
import { getAttrMenu } from "@/api/attrManage";
import { getBayIdManOrg } from "@/api/management/orgManage";
import { getRemindTemp } from "@/api/system/reminderTemplates";
import {
  addRemindSet,
  delRemindSet,
  getRemindSet,
  updataRemindSet,
} from "@/api/system/messageSet";
import tableView from "@/components/vTable.vue";
import { isButtons } from "@/utils/button";
export default {
  data() {
    return {
      messageSet: {},
      editVisible: false,
      editVisible1: false,
      createBy: null,
      tableData1: [],
      total1: 0,
      tableLabel1: [
        {
          label: "提醒模板名称",
          selection: true,
          param: "remindName",
          align: "center",
        },
        { label: "组织", param: "orgName", align: "center" },
        { label: "提醒类型", param: "remindClassName", align: "center" },
      ],
      tableLabel: [
        { label: "remindId", param: "remindSetId", align: "center" },
        {
          label: "提醒组织",
          param: "orgName",
          fixed: true,
          click: true,
        },
        {
          label: "入职提醒",
          param: "remindEntry",
          align: "center",
          render: (row) => {
            if (row.remindEntry == 1) {
              return "启用";
            } else {
              return "未启用";
            }
          },
        },
        {
          label: "转正提醒",
          param: "remindFormal",
          align: "center",
          render: (row) => {
            if (row.remindFormal == 1) {
              return "启用";
            } else {
              return "未启用";
            }
          },
        },
        {
          label: "调岗提醒",
          param: "remindTransfer",
          align: "center",
          render: (row) => {
            if (row.remindTransfer == 1) {
              return "启用";
            } else {
              return "未启用";
            }
          },
        },
        {
          label: "离职提醒",
          param: "remindLeave",
          align: "center",
          render: (row) => {
            if (row.remindLeave == 1) {
              return "启用";
            } else {
              return "未启用";
            }
          },
        },
        {
          label: "生日提醒",
          param: "remindBirthday",
          align: "center",
          render: (row) => {
            if (row.remindBirthday == 1) {
              return "启用";
            } else {
              return "未启用";
            }
          },
        },
        {
          label: "合同到期提醒",
          param: "remindContract",
          align: "center",
          render: (row) => {
            if (row.remindContract == 1) {
              return "启用";
            } else {
              return "未启用";
            }
          },
        },
        {
          label: "试用期到期提醒",
          param: "remindProbation",
          align: "center",
          render: (row) => {
            if (row.remindProbation == 1) {
              return "启用";
            } else {
              return "未启用";
            }
          },
        },
        { label: "创建时间", param: "createDate", align: "center" },
      ],
      //用户操作
      option: false,
      //默认下拉框
      options: [],
      optionId: null,
      tableData: [],
      total: 0,
      modelName: null,
      //当前操作switch
      switchName: null,
      switchId: null,
      //操作方法
      switchFun: false,
      optionsId: null,
      orgQuery: {
        pageNumber: "1",
        pageSize: "20",
      },
      orgData: [],
      orgProps: {
        label: "orgName",
        value: "orgId",
      },
      query: {
        orgId: null,
        pageNumber: "1",
        pageSize: "10",
        remindSetId: null,
      },
      tableOption: {
        label: "操作",
        options: [
          {
            label: "选择",
            type: "text",
            icon: "el-icon-my-edit",
            methods: "choice",
          },
        ],
      },
      remindClassOption: [],
      multipleSelection:'',
      //提醒类型查询
      remindQuery: {
        pageNumber: "1",
        pageSize: "20",
        orgId: null,
        remindClass: null, // 提醒类型(1合同到期2试用期到期3生日提醒)
        remindName: null, //提醒模板名称
      },
      formList: [
        {
          forName: "入职提醒",
          formModel: "remindEntry",
          modelName: "remindEntryTempName",
          funData1: "remindEntryTempId",
          funData2: "remindEntry",
        },
        {
          forName: "转正提醒",
          formModel: "remindFormal",
          modelName: "remindFormalTempName",
          funData1: "remindFormalTempId",
          funData2: "remindFormal",
        },
        {
          forName: "调岗提醒",
          formModel: "remindTransfer",
          modelName: "remindTransferTempName",
          funData1: "remindTransferTempId",
          funData2: "remindTransfer",
        },
        {
          forName: "离职提醒",
          formModel: "remindLeave",
          modelName: "remindLeaveTempName",
          funData1: "remindLeaveTempId",
          funData2: "remindLeave",
        },
        {
          forName: "生日提醒",
          formModel: "remindBirthday",
          modelName: "remindBirthdayTempName",
          funData1: "remindBirthdayTempId",
          funData2: "remindBirthday",
          advanceName: "生日提前提醒:",
          remindAdvance: "remindBirthdayTempDeadline",
          advance: true,
        },
        {
          forName: "合同到期提醒",
          formModel: "remindContract",
          modelName: "remindContractTempName",
          funData1: "remindContractTempId",
          funData2: "remindContract",
          advanceName: "合同提前提醒:",
          remindAdvance: "remindContractTempDeadline",
          advance: true,
        },
        {
          forName: "试用期到期提醒:",
          formModel: "remindProbation",
          modelName: "remindProbationTempName",
          funData1: "remindProbationTempId",
          funData2: "remindProbation",
          advanceName: "试用期提前提醒:",
          remindAdvance: "remindProbationTempDeadline",
          advance: true,
        },
      ],
    };
  },
  created() {
    this.getRemindAttr();

    this.getData();
    this.getSelect();
  },
  components: {
    tableView,
  },
  methods: {
    //saveEdit保存设置
    saveEdit() {
      const that = this;
      const orgIds = that.$refs["orgIdCascader"].getCheckedNodes();
      if (orgIds.length < 1) {
        that.$message.warning("请选择一个需要提醒的组织");
        return;
      }
      that.messageSet.orgId = orgIds[0].value;
      let data;
      if (that.option) {
        //新增
        data = addRemindSet(that.messageSet);
      } else {
        //修改
        data = updataRemindSet(that.messageSet);
      }
      data.then((res) => {
        if (res.code === 0) {
          that.$message.success(res.message);
          that.getData();
          that.editVisible = false;
        } else {
          that.$message.error(res.message);
        }
      });
    },
    //获取提醒设置
    getData() {
      getRemindSet(this.query).then(
        (res) => (this.tableData = res.data.records,this.total=res.data.total),
        this.getOrgData()
      );
    },
    //遍历提醒类型
    getRemindClass(data) {
      let arr = null;

      this.remindClassOption.forEach((s) => {
        if (data == s.attrValue) {
          arr = s.attrName;
        }
      });
      return arr;
    },
    //获取所有组织
    getOrgData() {
      getBayIdManOrg(this.orgQuery).then((res) => (this.orgData = res.data));
    },
    //增加提醒设置
    addMessageSet() {
      this.option = true;
      this.messageSet = {};
      this.editVisible = true;
    },
    getRemindAttr() {
      const that = this;
      getAttrMenu({ valueCode: "remind_class" }).then((res) => {
        const { data } = res;
        that.remindClassOption = data;
        that.formList.forEach((v) => {
          data.forEach((s) => {
            if (v.forName == s.attrName) {
              v.formId = s.attrValue;
            }
          });
        });
        console.log(that.formList);
      });
    },
    getSwitchData(e, row, id, remindClass, modelName) {
      this.switchId = row;
      if (e > 0) {
        const orgId = this.$refs["orgIdCascader"].getCheckedNodes();
        console.log(orgId);
        if (orgId.length < 1) {
          this.$message.warning("请先选择一个组织");
          this.messageSet[id] = 0;
          return;
        }
        this.modelName = modelName;
        this.tableData1 = [];
        this.remindQuery.orgId = orgId[0].value;
        this.remindQuery.remindClass = remindClass;
        this.getSelect();
        this.optionsId = this.messageSet[row];
        this.switchName = id;
        //需要选择的模板ID
        this.optionId = row;
        this.editVisible1 = true;
      } else {
        this.messageSet[row] = null;
      }
    },
    hasButtons(data) {
      return isButtons(data);
    },
    //查询当前模板下
    getSelect() {
      this.total1=0;
      // this.remindQuery.remindClass = remindClass;
      getRemindTemp(this.remindQuery).then(
        (res) => (
          (this.tableData1 = res.data.records),
          this.total1=res.data.total,
          this.tableData1.forEach((v) => {
            v.remindClassName = this.getRemindClass(v.remindClass);
          })
        )
      );
    },

    closeFun() {
      //遍历找出当前操作开关来关闭
      const messageSet = this.messageSet;
      //判断是否选择模板ID
      if (!messageSet[this.switchId]) {
        messageSet[this.switchName] = 0;
      }
    },
    getOneInfo(e) {
      
      if (!this.hasButtons("messageSet-edit")) {
        this.$message.error("对不起,你不具备操作权限");
        return false;
      }
      this.messageSet = e;
      this.option = false;
      this.editVisible = true;
    },
    handleCurrentChange1(e) {
      this.remindQuery.pageNumber = e;
      this.getSelect();
    },
    handleSizeChange1(e) {
      this.remindQuery.pageSize = e;
      this.getSelect();
    },
    getSelectionChange1(e) {
      let arr = "";
      // multipleSelection
      e.forEach((v) => {
        arr += v.remindSetId + ",";
      });
      this.multipleSelection = arr;
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
    getButton(e, row) {
      this.messageSet[this.switchId] = row.remindId;
      this.messageSet[this.modelName] = row.remindName;
      this.editVisible1 = false;
    },
    rawQuery() {
      const orgId = this.$refs["queryOrgId"].getCheckedNodes();
      if (orgId.length > 0) {
        this.query.orgId = orgId[0].value;
      }
      this.getData();
    },
    runReset() {
      this.query={
        orgId: null,
        pageNumber: "1",
        pageSize: "10",
        remindSetId: null,
      };
      this.total=0;
      this.getData();
    },
    //删除提醒设置
    allDelSet(){
      const that = this;
      if (!that.hasButtons("messageSet-del")) {
        that.$message.error("对不起,你不具备操作权限");
        return false;
      }
      const idList = that.multipleSelection;
      if (idList.length<1) {
        that.$message.error("请选择一个设置进行删除");
        return;
      }
      that
        .$confirm("此操作将会删除设置, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          //删除信息
          delRemindSet({ idList }).then((res) => {
            if (res.code === 0) {
              that.$message.success(res.message);
              that.getData();
            } else {
              that.$message.error(res.message);
            }
          });
        })
        .catch((err) => {});
    }
  },
};
</script>

<style lang="scss" scope>
.pagination-box {
    margin: 50px 0;
    text-align: center;
}
.el-switch__label * {
  width: auto !important;
}
</style>