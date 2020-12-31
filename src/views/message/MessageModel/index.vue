<template>
  <div class="main remind-box">
    <div class="title-box" style="width: auto">
      <div class="title-list">
        <div class="list-box">
          <span class="title">模板名称:</span>
          <el-input
            placeholder="模板名称"
            v-model="query.remindName"
            style="width: 180px"
            clearable
          ></el-input>
        </div>
        <div class="list-box">
          <span class="title">提醒类型:</span>
          <el-select v-model="query.remindClass" placeholder="提醒类型">
            <el-option
              v-for="item in remindClassOption"
              :key="item.attrValue"
              :label="item.attrName"
              :value="item.attrValue"
            >
            </el-option>
          </el-select>
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
          <el-button
            class="add"
            @click="addQuery"
            :disabled="!hasButtons('remindTemp-add')"
            >新增提醒模板</el-button
          >
          <!-- :disabled="!hasButtons('remindTemp-add')" -->
        </div>
        <div class="button-box">
          <el-button
            class="del"
            @click="allDelModel"
            :disabled="!hasButtons('remindTemp-del') || multipleSelection == ''"
            >删除</el-button
          >
        </div>
        <!-- :disabled="
                  !hasButtons('personer-del') || multipleSelection == ''
                " -->
      </div>
    </div>
    <div class="table-view">
      <el-table
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
        style="width: 100%"
        :header-cell-style="{ background: '#F7F8FA', color: '#293B59' }"
      >
        <el-table-column
          fixed
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column fixed label="提醒模板名称" align="center">
          <template slot-scope="scope">
            <span class="active-name" @click="handleRemind(scope.row)">{{
              scope.row.remindName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="提醒发送方式">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.attrName" :key="index"
              >&emsp;{{ item }}&emsp;</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="orgName"
          label="组织"
          align="center"
        ></el-table-column>
        <el-table-column label="提醒类型" prop="remindClassName"> 
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              :disabled="!hasButtons('remindTemp-status')"
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
              @change="setStatus(scope.row)"
              active-color="#13ce66"
              inactive-text="停用"
              class="tablescope"
              active-text="启用"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div class="block pagination-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <div class="model">
      <el-dialog title="提醒模板" :visible.sync="editVisible" width="40%">
        <!-- <div slot="title">
          <span class="el-dialog__title">
            <span class="red">{{ valueName }}</span> || 字典属性</span
          >
        </div> -->
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="提醒模板名称:" :required="true">
            <el-input v-model="form.remindName"></el-input>
          </el-form-item>
          <el-form-item label="提醒内容:" :required="true">
            <el-input
              v-model="form.remindContent"
              type="textarea"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="组织:" :required="true">
            <el-cascader
              v-model="form.orgId"
              ref="orgIdCascader"
              :options="treeData"
              :props="orgProps"
              :show-all-levels="false"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="提醒角色:" :required="true">
            <el-select v-model="form.roleIds" multiple placeholder="提醒角色">
              <el-option
                v-for="item in sroleIdsOption"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- (1合同到期2试用期到期3生日提醒) -->
          <el-form-item label="提醒类型:" :required="true">
            <el-select v-model="form.remindClass" placeholder="提醒类型">
              <el-option
                v-for="item in remindClassOption"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- (1系统消息2短信3钉钉消息)可多选 -->
          <el-form-item label="提醒发送方式:" :required="true">
            <el-select
              v-model="form.sendWay"
              multiple
              placeholder="提醒发送方式"
            >
              <el-option
                v-for="item in sendWayOption"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="saveModel"
            v-if="hasButtons('remindTemp-edit') || hasButtons('remindTemp-add')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import tableView from "@/components/vTable.vue";
import {
  addRemindTemp,
  delRemindTemp,
  getRemindTemp,
  updataRemindTemp,
} from "@/api/system/reminderTemplates";
import { getBayIdManOrg } from "@/api/management/orgManage";
import { getBayIdManRole } from "@/api/system/roleManager";
import { getAttrMenu } from "@/api/attrManage";
//导入判断是否拥有该按钮
import { isButtons } from "@/utils/button";
export default {
  components: {
    tableView,
  },
  data() {
    return {
      tableData: [],
      sendWayOption: [],
      remindClassOption: [],
      currentPage: 10,
      tableOption: {},
      form: {},
      sroleIdsOption: [],
      editVisible: false,
      total: 0,
      query: {
        pageNumber: "1",
        pageSize: "10",
        remindClass: null, // 提醒类型(1合同到期2试用期到期3生日提醒)
        remindName: null, //提醒模板名称
      },
      treeData: [],
      //用户操作.true为新增，false为修改
      option: true,
      //组织请求参数
      //请求参数
      orgQuery: {
        orgName: null,
        orgShortName: null,
        orgType: 0,
        pageNumber: "1",
        pageSize: "10",
        parentId: null,
      },
      orgProps: {
        label: "orgName",
        value: "orgId",
      },

      multipleSelection: "",
      roleQuery: {
        orgId: null,
        pageNumber: "1",
        pageSize: "10",
        roleName: null,
        status: 0,
      },
    };
  },
  created() {
    this.getOrgData();
    this.getRoleData();
  },
  methods: {
    //查询
    rawQuery() {
      this.getData();
    },
    //重置
    runReset() {
      this.query = {
        pageNumber: "1",
        pageSize: "10",
        remindClass: null, // 提醒类型(1合同到期2试用期到期3生日提醒)
        remindName: null, //提醒模板名称
      };
      this.total = 0;
      this.getData();
    },
    //获取下拉框数据
    getMenu() {
      // 提醒类型
      const data1 = getAttrMenu({ valueCode: "remind_class" });
      //提醒发送类型
      const data2 = getAttrMenu({ valueCode: "send_way" });
      Promise.all([data1, data2]).then(
        (res) => (
          (this.sendWayOption = res[1].data[0].send_way.option),
          (this.remindClassOption = res[0].data[0].remind_class.option),
          this.getData()
        )
      );
    },
    getData() {
      getRemindTemp(this.query).then(
        (res) => (
          (this.tableData = res.data.records),
          (this.total = res.data.total),
          this.tableData.forEach((v) => {
            let sendWays = [];
            let roleIds = [];
            const arr = v.sendWay.split(",");
            arr.forEach((s) => {
              if (s.length > 0) {
                sendWays.push(s);
              }
            });
            v.sendWays = sendWays;
            const roleIdList = v.roleIds.split(",");
            roleIdList.forEach((s) => {
              if (s.length > 0) {
                roleIds.push(s);
              }
            });
            v.roleStr = v.roleIds;
            v.roleIdList = roleIds;
            // v.orgName = this.getOrgName(this.treeData, v.orgId);
            v.attrName = this.getSendWays(v.sendWays);
            v.remindClassName = this.getRemindClass(v.remindClass);
          })
        )
      );
    },
    //遍历提醒发送方式
    getSendWays(data) {
      let arr = [];
      data.forEach((v) => {
        this.sendWayOption.forEach((s) => {
          if (v == s.attrValue) {
            arr.push(s.attrName);
          }
        });
      });

      return arr;
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
    hasButtons(data) {
      return isButtons(data);
    },
    //判断用户是否具有权限
    hasPermission(name) {
      if (this.hasButtons(name)) {
        return true;
      } else {
        this.$message.error("对不起,你不具备操作权限");
        return false;
      }
    },
    //获取所有组织
    getOrgData() {
      getBayIdManOrg(this.query).then(
        (res) => (this.treeData = res.data),
        this.getMenu()
      );
    },
    //获取所有角色

    getRoleData() {
      getBayIdManRole(this.roleQuery).then(
        (res) => (this.sroleIdsOption = res.data.records)
      );
    },
    //增加提醒模板
    addQuery() {
      const permission = this.hasPermission("remindTemp-add");
      if (!permission) {
        return;
      }
      (this.option = true), (this.form = {});
      this.editVisible = true;
    },
    handleSelectionChange(e) {
      let arr = "";
      // multipleSelection
      e.forEach((v) => {
        arr += v.remindId + ",";
      });
      this.multipleSelection = arr;
    },
    handleCurrentChange(e) {
      this.query.pageNumber = e;
      this.getData();
    },
    handleSizeChange(e) {
      this.query.pageSize = e;
      this.getData();
    },
    //删除模板
    allDelModel() {
      const permission = this.hasPermission("remindTemp-del");
      if (!permission) {
        return;
      }
      const that = this;
      const idList = that.multipleSelection;
      if (idList.length < 1) {
        that.$message.error("请选择一个模板进行删除");
        return;
      }
      that
        .$confirm("此操作将会删除模板, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          //删除信息
          delRemindTemp({ idList }).then((res) => {
            if (res.code === 0) {
              that.$message.success(res.message);
              that.getData();
            } else {
              that.$message.error(res.message);
            }
          });
        })
        .catch((err) => {});
    },
    handleRemind(e) {
      const permission = this.hasPermission("remindTemp-view");
      if (!permission) {
        return;
      }
      this.option = false;
      e.sendWay = [];
      e.roleIds = e.roleIdList;
      e.sendWays.forEach((v) => {
        e.sendWay.push(parseInt(v));
      });
      this.form = e;
      this.editVisible = true;
    },
    //更改状态
    setStatus(e) {
      console.log(e);
      const permission = this.hasPermission("remindTemp-status");
      if (!permission) {
        return;
      }
      e.roleIds = e.roleStr;
      updataRemindTemp(e).then();
    },
    //保存模板
    saveModel() {
      const that = this;
      if (that.option) {
        const permission = that.hasPermission("remindTemp-add");
        if (!permission) {
          return;
        }
      } else {
        const permission = that.hasPermission("remindTemp-edit");
        console.log(permission);
        if (!permission) {
          return;
        }
      }
      const orgIds = that.$refs["orgIdCascader"].getCheckedNodes();
      if (orgIds.length > 0) {
        const roleIds = that.form.roleIds;
        const sendWays = that.form.sendWay;

        let roleId = "";
        let sendWay = "";
        roleIds.forEach((v) => {
          roleId += v + ",";
        });
        sendWays.forEach((v) => {
          sendWay += v + ",";
        });
        that.form.roleIds = roleId;
        that.form.sendWay = sendWay;
        that.form.orgId = orgIds[0].value;
      }
      let data;
      if (that.option) {
        //新增
        data = addRemindTemp(that.form);
      } else {
        //修改
        data = updataRemindTemp(that.form);
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
  },
};
</script>

<style lang="scss" scope>
.remind-box {
  .danger {
    color: #f56c6c;
  }
  .success {
    color: #67c23a;
  }
  .primary {
    color: #409eff;
  }
  .model {
    .el-cascader,
    .el-select {
      width: 100%;
    }
  }
  .table-view {
    .active-name {
      color: Blue;
      cursor: pointer;
    }
  }
  .tablescope .el-switch__label--left {
    left: 60px;
  }
}
</style>