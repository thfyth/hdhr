<template>
  <div class="main">
    <div class="title-box" style="width: auto">
      <div class="title-list">
        <div class="list-box">
          <span class="title">角色名称</span>
          <el-input
            placeholder="角色名称"
            v-model="query.roleName"
            style="width: 200px"
            clearable
          ></el-input>
        </div>
        <div class="list-box">
          <el-button class="insert" @click="rawQuery">查询</el-button>
        </div>
      </div>
      <div class="titles-list">
        <div class="button-box">
          <el-button
            class="add"
            @click="addQuery"
            :disabled="!hasButtons('role-add')"
            >新增</el-button
          >
        </div>
        <div class="button-box">
          <el-button
            class="del"
            @click="allDelRole"
            :disabled="!hasButtons('role-del') || multipleSelection == ''"
            >删除</el-button
          >
        </div>
        <!-- <el-button
          class="insert"
          type="primary"
          @click="menuQuery"
          :disabled="!hasButtons('role-meun')"
        >角色分配菜单</el-button>
        <el-button
          class="insert"
          type="primary"
          @click="postQuery"
          :disabled="!hasButtons('role-post')"
        >角色权限分配</el-button> -->
      </div>
    </div>
    <div class="table-view">
      <table-view
        :table-data="tableData"
        @handleSelectionChange="getSelectionChange"
        @handleButton="getButton"
        @getOneData="getOneUser"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        :table-label="tableLabel"
        :table-option="tableOption"
        :total="total"
      ></table-view>
    </div>

    <div class="model">
      <!-- 菜单编辑，增加模态框 -->
      <el-dialog title="菜单分配" :visible.sync="editVisible" width="60%">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          node-key="menuId"
          ref="tree"
          show-checkbox
          :getCheckedKeys="true"
          :default-checked-keys="defaultKyes"
        >
          <span class="custom-tree-node" slot-scope="{ data }">
            <span v-if="data.menuType == 2">{{ data.menuName }}---按钮</span>
            <span v-else>{{ data.menuName }}</span>
          </span>
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 菜单管理 -->
      <el-dialog title="角色管理" :visible.sync="editVisible1" width="60%">
        <el-form ref="form" :model="form" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="角色名称:" :required="true">
                <el-input v-model="form.roleName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="saveEditMenu">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 权限管理 -->
      <el-dialog title="权限管理" :visible.sync="editVisible2" width="60%">
        <el-form ref="form" :model="form" label-width="120px">
          <el-row>
            <tree-transfer
              :title="treeTitle"
              :to_data="toData"
              :from_data="fromData"
              :defaultProps="{ label: 'orgName' }"
              @addBtn="add"
              @removeBtn="remove"
              node_key="orgId"
              pid="parentId"
              :mode="mode"
              height="540px"
              filter
              openAll
            ></tree-transfer>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="saveEditOrg">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import tableView from "@/components/vTable.vue";
import {
  getBayIdManRole,
  delOneManRole,
  addOneManRole,
  updateManRole,
  delOneRoleOrg,
  addRoleOrg,
  getRoleOrg,
} from "@/api/system/roleManager";
import { getBayIdManOrg } from "@/api/management/orgManage";
import { getBayIdManMenu } from "@/api/system/menuManage";
import { addOneRoleMenu, getRoleMenu } from "@/api/system/roleMenuManage";
import treeTransfer from "el-tree-transfer"; // 使用树形穿梭框组件
import { isButtons } from "@/utils/button";
export default {
  data() {
    return {
      tableData: [],
      treeTitle: ["组织列表", "已分配组织"],
      //请求参数
      query: {
        orgId: null,
        pageNumber: "1",
        pageSize: "10",
        roleName: null,
        status: 0,
      },
      treeData: [],
      editVisible: false,
      editVisible1: false,
      editVisible2: false,
      total: 0,
      defaultProps: {
        label: "menuName",
        children: "children",
      },
      form: {},
      roleIds:null,
      tableLabel: [
        { label: "id", param: "roleId", align: "center" },
        {
          label: "角色名称",
          param: "roleName",
          align: "center",
          fixed: true,
          click: true,
        },
        { label: "创建时间", param: "createDate", align: "center" },
      ],
      tableOption: {
        label: "操作",
        width: "300",
        options: [
          {
            label: "编辑",
            type: "text",
            icon: "el-icon-my-edit",
            methods: "edit",
            disabled: !this.hasButtons("role-edit"),
          },
          {
            label: "分配菜单",
            type: "text",
            icon: "el-icon-my-fenpei",
            methods: "roleMeun",
            disabled: !this.hasButtons("role-meun"),
          },
          {
            label: "设置权限",
            type: "text",
            icon: "el-icon-my-shezi",
            methods: "rolePost",
            disabled: !this.hasButtons("role-post"),
          },
        ],
      },
      //树默认选中数据
      defaultKyes: [],
      //选中角色数组
      roleList: [],
      // 判断是修改还是增加菜单
      isMenuDataMap: false,
      mode: "transfer", // transfer addressList
      fromData: [],
      toData: [],
      //组织请求参数
      orgQuery: {
        orgName: null,
        orgShortName: null,
        orgType: 0,
        pageNumber: "1",
        pageSize: "10",
        parentId: null,
      },
      //穿梭框选择的组织数据
      orgList: [],
      test: [],
      multipleSelection: "",
    };
  },
  components: {
    tableView,
    treeTransfer,
  },
  created() {
    this.getData();
  },
  methods: {
    //获取所有菜单

    getData() {
      getBayIdManRole(this.query).then(
        (res) => (
          console.log(res),
          (this.tableData = res.data.records),
          (this.total = res.data.total)
        )
      );
    },
    //正常权限button
    hasButtons(data) {
      return isButtons(data);
    },
    //表格权限butto
    //监听table组件多选框事件
    getSelectionChange(e) {
      this.roleList = e;
      let arr = "";
      // multipleSelection
      e.forEach((v) => {
        arr += v.roleId + ",";
      });
      this.multipleSelection = arr;
    },
    //监听table组件按钮事件
    getButton(e, info) {
      console.log(info);
      const { roleId } = info;
      this.roleIds = roleId;
      this.form = info;
      if (e == "edit") {
        this.edit();
      } else if (e == "roleMeun") {
        this.menuQuery(roleId);
      } else {
        this.postQuery(roleId);
      }
    },
    edit() {
      console.log("修改");
      this.isMenuDataMap = false;
      this.editVisible1 = true;
    },
    //获取一个角色信息
    getOneUser(e) {
      this.roleIds = e.roleId;
      this.isOpenModel(e.roleId);
    },
    //修改增加保存菜单
    saveEditMenu() {
      const that = this;
      let requestData = null;
      if (this.isMenuDataMap) {
        // 新增
        requestData = addOneManRole(that.form);
      } else {
        //修改
        requestData = updateManRole(that.form);
      }
      requestData.then((res) => {
        if (res.code == 0) {
          that.$message.success(res.message);
          that.editVisible1 = false;
        } else {
          that.$message.error(res.message);
        }
        that.getData();
      });
    },
    //保存
    saveEdit() {
      const that = this;
      let roleList = [];
      roleList.push(that.roleIds);
      let getCheckedKeys = that.$refs.tree.getCheckedKeys();
      // 返回目前半选中的节点所组成的数组
      let getHalfCheckedKeys = that.$refs.tree.getHalfCheckedKeys();
      getCheckedKeys = getCheckedKeys.concat(getHalfCheckedKeys).join(",");
      const arr = getCheckedKeys.split(",");
      const data = {
        roleIdList: roleList,
        menuIdList: arr,
      };
      //添加保存菜单
      addOneRoleMenu(data).then((res) => {
        if (res.code == 0) {
          that.$message.success(res.message);
          that.editVisible = false;
        } else {
          that.$message.error(res.message);
        }
      });
    },
    //根据条件查询
    rawQuery() {
      this.query.pageNumber = 1;
      this.query.pageSize = 10;
      this.getData();
    },
    //新增菜单
    addQuery() {
      if (!this.hasButtons("role-add")) {
        this.$message.error("对不起,你不具备操作权限");
        return false;
      }
      this.form = {};
      this.isMenuDataMap = true;
      this.editVisible1 = true;
    },
    //角色分配菜单
    menuQuery(roleId) {
      this.isOpenModel(roleId);
    },
    //根据用户权限判断是否打开模态框
    isOpenModel(e) {
      if (this.hasButtons("role-meun")) {
        this.openModel(e);
      } else {
        this.$message.error("对不起,你不具备操作权限");
        return false;
      }
    },
    //权限分配
    postQuery(roleId) {
      if (this.hasButtons("role-post")) {
        this.openMode2(roleId);
      } else {
        this.$message.error("对不起,你不具备操作权限");
        return false;
      }
    },
    openMode2(roleId) {
      const that = this;
      that.roleIds=roleId;
      getRoleOrg({ roleId }).then((res) => {
        if (res.code === 0) that.toData = res.data;
        return;
      });
      getBayIdManOrg(this.orgQuery).then((res) => (this.fromData = res.data));
      that.editVisible2 = true;
    },
    // 打开模态框
    openModel(roleIds) {
      const that = this;
      //通过角色查询菜单
      const getRoleMenus = getRoleMenu({ roleIds });
      var oldData;
      //查询菜单
      const getBayIdManMenus = getBayIdManMenu(this.query);
      //多请求同时进行
      Promise.all([getRoleMenus, getBayIdManMenus]).then((res) => {
        oldData = res[0].data;
        const data = that.getMenuIdList(res[0].data);
        const data1 = that.getMenuUser(res[0].data);
        that.treeData = res[1].data;
        data.forEach((v) => {
          //分步回显多选框,关键是$nextTick，否则会报函数undefined
          that.$nextTick(() => {
            that.$refs.tree.setChecked(v, true, false);
          });
        });
        that.editVisible = true;
      });
    },
    //递归遍历取用户已选菜单
    getMenuUser(data) {
      let arr = [];
      const getStr = function (list) {
        if (list.length) {
          list.forEach(function (row) {
            if (row.menuList) {
              if (row.isChecked == 1) {
                arr.push(row);
              }
              getStr(row.menuList);
            } else {
              if (row.isChecked == 1) {
                arr.push(row);
              }
            }
          });
        }
      };
      getStr(data);
      return arr;
    },
    //递归遍历取菜单id
    getMenuIdList(data) {
      let menuIdList = "";
      const getStr = function (list) {
        if (list.length !== undefined) {
          list.forEach(function (row) {
            if (row.menuList) {
              if (row.isChecked == 1) {
                menuIdList += row.menuId + ",";
              }
              getStr(row.menuList);
            } else {
              if (row.isChecked == 1) {
                menuIdList += row.menuId + ",";
              }
            }
          });
        }
      };
      getStr(data);
      const arr = menuIdList.split(",");
      return arr;
    },
    //递归遍历取用户已选菜单
    getOrgId(data) {
      console.log(data);
      let arr = [];
      const getStr = function (list) {
        if (list.length) {
          list.forEach(function (row) {
            if (row.children) {
              arr.push(row.orgId);
              getStr(row.children);
            } else {
              arr.push(row.orgId);
            }
          });
        }
      };
      getStr(data);
      return arr;
    },
    // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
    changeMode() {
      if (this.mode == "transfer") {
        this.mode = "addressList";
      } else {
        this.mode = "transfer";
      }
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      // console.log("左侧:", fromData);
      // console.log("右侧:", toData);
      // console.log("obj:", obj);
      // this.orgList.concat(obj.keys);
      // console.log(this.orgList);
      // this.orgList = Array.from(new Set(this.orgList));
      this.toData = toData;
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      // console.log("左侧:", fromData);
      // console.log("右侧:", toData);
      // console.log("obj:", obj);
      // this.orgList.push(...obj.keys);
      // this.orgList = Array.from(new Set(this.orgList));
      this.toData = toData;
    },
    saveEditOrg() {
      const that = this;
      let data = {
        // 所属部门/公司/其他id
        orgId: null,
        // 所属部门/公司/其他id数组,选了子节点，父节点id也传过来
        orgIdList: that.getOrgId(that.toData),
        // 角色id
        roleId: this.roleIds,
        // 角色组织关系id,新增角色不需要传此参数
        roleOrgId: null,
      };
      console.log(data);
      addRoleOrg(data).then((res) => {
        if (res.code === 0) {
          that.$message.success(res.message);
          that.editVisible2 = false;
        } else {
          that.message.error(res.message);
        }
      });
    },
    // 批量删除
    allDelRole() {
      const that = this;
      if (!that.hasButtons("role-del")) {
        that.$message.error("对不起,你不具备操作权限");
        return false;
      }

      const idList = that.multipleSelection;
      if (idList == null) {
        that.$message.error("请选择一个用户进行删除");
        return;
      }
      that
        .$confirm("确定要删除吗？", "提示", {
          type: "warning",
        })
        .then((res) => {
          delOneManRole({ idList }).then((resData) => {
            if (resData.code == 0) {
              that.$message.success(resData.message);
            } else {
              that.$message.error(resData.message);
            }
            that.getData();
          });
        })
        .catch((err) => {
          console.log(err);
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
<style lang='less'>
</style>