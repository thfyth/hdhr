<template>
  <div class="main">
    <div class="main-box">
      <div class="user-box">
        <div class="title-box" style="width: auto">
          <div class="title-list">
            <div class="list-box">
              <span class="title">姓名:</span>
              <el-input
                placeholder="请输入姓名"
                v-model="query.realName"
                style="width: 200px"
                clearable
              ></el-input>
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
              <el-input
                placeholder="请输入手机号"
                v-model="query.mobile"
                style="width: 200px"
                clearable
              ></el-input>
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
                :disabled="!hasButtons('personer-add')"
                @click="addQuery"
                >新增</el-button
              >
            </div>
            <div class="button-box">
              <el-button
                class="del"
                :disabled="
                  !hasButtons('personer-del') || multipleSelection == ''
                "
                @click="allDelUser"
                >删除</el-button
              >
            </div>
            <div class="button-box">
              <el-button
                class="rst-pwd"
                :disabled="!hasButtons('personer-pwd')"
                @click="resetUserPwd"
                >重置密码</el-button
              >
            </div>
          </div>
        </div>
        <div class="table-view">
          <el-table :data="tableData"  @selection-change="getSelectionChange" stripe>
            <el-table-column
              type="selection"
              width="55"
              align="center"
            ></el-table-column>
            <el-table-column  fixed label="姓名" prop="realName">
              <template slot-scope="scope">
                <span class="article" @click="getOneUser(scope.row)" v-text="scope.row.realName">
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="userName" label="用户名"></el-table-column>
            <el-table-column prop="mobile" label="手机"></el-table-column>
            <el-table-column
              prop="createDate"
              label="创建时间"
            ></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-switch
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
            <el-table-column
              label="操作"
              fixed="right"
              align="center"
              width="300"
              class-name="small-padding fixed-width"
            >
              <!-- slot-scope="scope" -->
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-my-edit"
                  :disabled="!hasButtons('personer-edit')"
                  @click="edit(scope.$index, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  icon="el-icon-my-set"
                  :disabled="!hasButtons('personer-set')"
                  @click="setrole(scope.$index, scope.row)"
                  >设置角色</el-button
                >
                <!-- <el-button
                  type="text"
                  icon="el-icon-my-guanlian"
                  :disabled="!hasButtons('personer-staff')"
                  @click="relationStaff(scope.$index, scope.row)"
                >
                  <span v-if="scope.row.employeeId">更换关联员工</span>
                  <span v-else>关联员工</span>
                </el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
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

    <!-- 编辑，增加模态框 -->
    <el-dialog title="用户信息" :visible.sync="editVisible" width="40%">
      <el-form :rules="rules" ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名:" :required="true">
          <el-input v-model="form.realName"></el-input>
        </el-form-item>
        <el-form-item label="用户名:" :required="true">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile">
          <el-input v-model.number="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看模态框 -->
    <el-dialog title="用户信息" :visible.sync="editVisible2" width="40%">
      <el-form :rules="rules" ref="form" :model="form">
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名:">
              <span v-text="form.realName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户名:">
              <span v-text="form.userName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号:">
              <span v-text="form.mobile"></span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible2 = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 角色分配模态框 -->
    <el-dialog title="角色分配" :visible.sync="editVisible1" width="60%">
      <el-table
        :data="roleData"
        ref="roleTable"
        style="width: 100%"
        @selection-change="handleRoleChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="roleCode"
          label="角色编码"
          align="center"
        ></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="saveEditChange">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 关联员工 -->
    <el-dialog title="关联员工" :visible.sync="editVisible3" width="30%">
      <el-form ref="relationForm" :model="relationNewForm" label-width="120px">
        <el-form-item label="已关联员工:" v-if="relationForm.employeeId">
          <span v-text="relationForm.employeeName"></span>
        </el-form-item>
        <el-form-item label="在职员工:">
          <el-autocomplete
            v-model="relationNewForm.employeeName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="saveEditRelat">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import tableView from "@/components/vTable.vue";
import {
  getPerson,
  getBayIdPerson,
  updatePerson,
  addOnePerson,
  delOnePerson,
  delOneRole,
  addOneRole,
  getBayIdRole,
  updateRole,
  getBayManRole,
  resetPwd,
} from "@/api/user";
import { getEmployeesList, getIdEmployees } from "@/api/personnel/staff";
//导入判断是否拥有该按钮
import { isButtons } from "@/utils/button";
import { getBayIdManOrg } from "@/api/system/orgManage";
import LogoVue from "@/layout/components/Sidebar/Logo.vue";
export default {
  data() {
    return {
      tableData: [],
      //关联员工
      relationForm: {},
      //员工关联数据
      relationNewForm: {},
      //操作状态，新增或更新,true为新增，false为修改
      operation: true,
      treeData: [],
      defaultProps: {
        label: "orgName",
        children: "children",
      },
      //批量删除数组
      multipleSelection: "",
      //请求参数
      query: {
        mobile: null,
        pageNumber: 1,
        pageSize: 10,
        realName: null,
      },
      //请求用户角色参数
      roleQuery: {
        userId: null,
        pageNumber: 1,
        pageSize: 10,
      },
      orgName: null,
      //请求角色参数
      roleManquery: {
        orgId: null,
        pageNumber: 1,
        pageSize: 10,
        roleName: null,
        status: 0,
        orgIdAll: null,
      },
      editVisible: false,
      editVisible1: false,
      editVisible2: false,
      editVisible3: false,
      total: 0,
      form: {},
      roleData: [],
      rules: {
        mobile: [
          { required: true, message: "手机号不能为空" },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号码",
          },
        ],
      },

      tableLabel: [
        { label: "id", param: "userId", align: "center" },
        {
          label: "姓名",
          param: "realName",
          align: "center",
          fixed: true,
          click: true,
        },
        {
          label: "用户名",
          param: "userName",
          align: "center",
        },
        { label: "手机号", param: "mobile", align: "center" },
        {
          label: "创建时间",
          param: "createDate",
          align: "center",
        },
        {
          label: "状态",
          param: "status",
          align: "center",
          activeText: "启用",
          inactiveText: "停用",
          switch: true,
          disabled: !this.hasButtons("personer-set-stauts"),
        },
      ],
      tableOption: {
        label: "操作",
        width: "250",
        options: [
          {
            label: "编辑",
            type: "text",
            icon: "el-icon-my-edit",
            methods: "edit",
            disabled: !this.hasButtons("personer-edit"),
          },
          {
            label: "设置角色",
            type: "text",
            icon: "el-icon-my-set",
            methods: "setrole",
            disabled: !this.hasButtons("personer-set"),
          },
          {
            label: "关联员工",
            type: "text",
            icon: "el-icon-my-guanlian",
            methods: "relationStaff",
            disabled: !this.hasButtons("personer-set"),
          },
        ],
      },
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
      getPerson(this.query).then(
        (res) => (
          (this.tableData = res.data.records), (this.total = res.data.total)
        )
      );
    },
    hasButtons(data) {
      return isButtons(data);
    },
    //点击组织获取用户
    getOrg(e) {
      const { orgId, orgName, parentIdAll } = e;
      if (parentIdAll) {
        this.query.orgIdAll = parentIdAll + "," + orgId;
        this.query.orgId = orgId;
      } else {
        this.query.orgId = orgId;
      }
      this.orgName = orgName;
      console.log(this.query.orgId);
      this.getData();
    },
    //监听table组件多选框事件
    getSelectionChange(e) {
      let arr = "";
      // multipleSelection
      e.forEach((v) => {
        arr += v.userId + ",";
      });
      this.multipleSelection = arr;
    },
    //监听table组件按钮事件
    edit(index, info) {
      if (!this.hasButtons("personer-edit")) {
        this.$message.error("对不起,你不具备操作权限");
        return false;
      }
      //查询用户详细信息
      this.getOneInfo(info.userId);
    },
    //关联员工
    relationStaff(index, info) {
      const that = this;
      if (!that.hasButtons("personer-staff")) {
        that.$message.error("对不起,你不具备操作权限");
        return false;
      }
      that.relationNewForm = {};
      that.relationForm = info;
      that.relationNewForm.userId = info.userId;
      if (info.employeeId) {
        const { employeeId } = info;
        getIdEmployees(employeeId).then((res) => {
          if (res.code === 0) {
            const { employeeName } = res.data.employeeBaseInfo;
            that.relationForm.employeeName = employeeName;
            that.editVisible3 = true;
          }
        });
      } else {
        that.editVisible3 = true;
      }
    },
    //设置角色
    setrole(index, info) {
      const that = this;
      that.userIdList = [];
      if (!that.hasButtons("personer-set")) {
        that.$message.error("对不起,你不具备操作权限");
        return false;
      }
      that.editVisible1 = true;
      that.roleQuery.userId = info.userId;
      const data = that.roleQuery;
      //获取用户角色
      getBayIdRole(data).then((res) => {
        that.roleData = res.data.records;
        that.roleData.forEach((v) => {
          console.log(v); // 这里仅仅加了个打印操作
          that.$nextTick(() => {
            if (v.isChecked === 1)
              that.$refs.roleTable.toggleRowSelection(v, true);
          });
        });
      });

      that.userIdList.push(info.userId);
    },
    getButton(e, info) {
      const that = this;
      this.roleIdList = [];
      that.userIdList = [];
      that.userIdList.push(info.userId);
    },
    //批量删除用户
    allDelUser() {
      const that = this;
      if (!that.hasButtons("personer-del")) {
        that.$message.error("对不起,你不具备操作权限");
        return false;
      };
      const idList = that.multipleSelection;
      if (idList.length < 1) {
        that.$message.error("请选择一个用户进行删除");
        return;
      }
      that
        .$confirm("此操作将会删除用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          //删除信息
          delOnePerson({ idList }).then((res) => {
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
    //保存用户分配菜单
    saveEditChange() {
      const that = this;
      that.roleIdList = [];
      console.log(that.userIdList);
      const userIdList = that.userIdList;
      that.roleChangeList.forEach((v) => {
        that.roleIdList.push(v.roleId);
      });
      const roleIdList = that.roleIdList;
      const data = {
        userIdList,
        roleIdList,
      };
      addOneRole(data).then((res) => {
        if (res.code == 0) {
          that.$message.success(res.message);
          that.editVisible1 = false;
        } else {
          that.$message.error(res.message);
        }
      });
    },
    //获取所取菜单
    handleRoleChange(e) {
      console.log(e);
      this.roleChangeList = e;
    },
    //发送请求一个人信息接口
    getOneInfo(id) {
      this.operation = false;
      getBayIdPerson(id).then(
        (res) => ((this.form = res.data), (this.editVisible = true))
      );
    },
    //获取一个人信息
    getOneUser(e) {
      this.form = e;
      this.editVisible2 = true;
    },
    //保存
    saveEdit() {
      const that = this;
      that.$refs["form"].validate((valid) => {
        if (valid) {
          that.form.orgId = that.query.orgId;
          that.form.orgIdAll = that.query.orgIdAll;
          if (that.operation) {
            //新增用户
            addOnePerson(that.form).then(
              (res) => (
                that.$message.info(res.message),
                that.runReset(),
                (that.editVisible = false)
              )
            );
          } else {
            //更新用户
            that.form.employeeId=null;
            updatePerson(that.form).then(
              (res) => (
                that.$message.info(res.message),
                that.getData(),
                (that.editVisible = false)
              )
            );
          }
        } else {
          return false;
        }
      });
    },
    //根据条件查询
    rawQuery() {
      this.query.pageNumber = 1;
      this.query.pageSize = 10;
      this.getData();
    },
    //设置用户状态
    setStatus(e) {
      if (!this.hasButtons("personer-set-stauts")) {
        this.$message.error("你不具备改权限,修改无效");
        return false;
      }
      //更新用户
      const form = {
        userId: e.userId,
        status: e.status,
      };
      updatePerson(form).then((res) => console.log(res.message));
    },
    //重置请求
    runReset() {
      this.query = {
        mobile: null,
        pageNumber: "1",
        pageSize: "10",
        realName: null,
        orgIdAll: null,
      };
      this.getData();
    },
    //新增用户
    addQuery() {
      // if (!this.query.orgId) {
      //   this.$message.error("必须选择一个组织进行新增人员");
      //   return;
      // }
      if (this.hasButtons("personer-add")) {
        this.form = {};
        this.operation = true;
        this.editVisible = true;
      } else {
        this.$message.error("对不起,你不具备操作权限");
        return false;
      }
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
    //确认关联员工
    saveEditRelat() {
      // alert("敬请期待!!!!");
      const { employeeId } = this.relationNewForm;
      if (employeeId) {
        //更新关联
        updatePerson(this.relationNewForm).then(
          (res) => (
            this.$message.info(res.message),
            this.getData(),
            (this.editVisible3 = false)
          )
        );
      }
    },
    //远程搜索员工
    handleSelect(e) {
      this.relationNewForm.employeeId = e.employeeId;
    },
    querySearchAsync(queryString, cb) {
      const that = this;
      getEmployeesList(this.relationNewForm).then((res) => {
        const data = res.data.records;
        if (data.length > 0) {
          let employeeList = [];
          data.forEach((v) => {
            employeeList.push({
              value: v.employeeName,
              employeeId: v.employeeId,
            });
          });
          cb(employeeList);
        }
      });
    },
    //重置用户密码
    resetUserPwd() {
      if (this.hasButtons("personer-pwd")) {
        const that = this;
        const idList = that.multipleSelection;
        if (idList.length < 1) {
          that.$message.warning("请选择需要重置密码的用户");
          return false;
        }
        that
          .$confirm("此操作将会重置密码, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            //重置密码
            resetPwd(idList).then((res) => {
              if (res.code === 0) {
                that.$message.success(res.message);
                that.getData();
              } else {
                that.$message.error(res.message);
              }
            });
          })
          .catch((err) => {});
      } else {
        this.$message.error("对不起,你不具备操作权限");
        return false;
      }
    },
  },
};
</script>
<style lang='scss' scope>
.el-switch__label * {
  width: 35px !important;
}

.tablescope {
  .el-switch__label--left {
    position: relative;
    left: 70px;
    color: #fff;
    z-index: -1111;
  }
  .el-switch__core {
    width: 60px !important;
  }
  .el-switch__label--right {
    position: relative;
    right: 60px;
    color: #fff;
    z-index: -1111;
  }
  .el-switch__label--right.is-active {
    z-index: 1111;
    color: #fff !important;
  }
  .el-switch__label--left.is-active {
    z-index: 1111;
    color: #fff !important;
  }
}
</style>