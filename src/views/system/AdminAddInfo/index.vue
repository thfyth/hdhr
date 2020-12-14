<template>
  <div class="main">
    <div class="title-box" style="width: auto;">
      <div class="title-list">
        <div class="list-box">
          <span class="title">组织名称</span>
          <el-input placeholder="组织名称" style="width: 200px" clearable></el-input>
        </div>
      </div>
      <div class="titles-list">
        <el-button class="insert" @click="addQuery">新增</el-button>
        <el-button class="insert" @click="rawQuery">获取最新组织数据</el-button>
      </div>
    </div>
    <div class="table-box">
      <table-view
        :table-data="treeData"
        @handleButton="getButton"
        @getOneData="getOneUser"
        :table-label="tableLabel"
        :table-option="tableOption"
        :total="total"
        :tableColId="tableColId"
      ></table-view>
    </div>
    <div class="model">
      <!-- 编辑，增加模态框 -->
      <el-dialog title="菜单管理" :visible.sync="editVisible" width="60%">
        <el-form ref="form" :model="form" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="菜单名称:" :required="true">
                <el-input v-model="form.menuName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="菜单是否隐藏 :" :required="true">
                <el-select v-model="form.hidden" placeholder="请选择菜单是否隐藏">
                  <el-option
                    v-for="item in attrmOptions"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="菜单/按钮简称 :" :required="true">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
              <el-col :span="8">
              <el-form-item label="菜单路径(com):" :required="true">
                <el-input v-model="form.component"></el-input>
              </el-form-item>
            </el-col>
              <el-col :span="8">
              <el-form-item label="菜单url:" :required="true">
                <el-input v-model="form.menuUrl"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="菜单类型:" :required="true">
                <el-select v-model="form.menuType" placeholder="请选择">
                  <el-option
                    v-for="item in attrOptions"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import tableView from "@/components/vTable.vue";
import {
  getBayIdManOrg,
  addOneManOrg,
  updateManOrg,
  delOneManOrg,
} from "@/api/management/orgManage";
import { getAttrMenu } from "@/api/attrManage";

import {
  delOneManMenu,
  addOneManMenu,
  getBayIdManMenu,
  updateManMenu,
  getBayIdMenu,
} from "@/api/system/menuManage";
export default {
  data() {
    return {
      treeData: [],
      attrOptions: [
          {attrValue:1,attrName:"菜单"},
          {attrValue:2,attrName:"按钮"},
      ],
      attrmOptions:[
          {attrValue:true,attrName:"隐藏"},
          {attrValue:false,attrName:"不隐藏"},
      ],
      //操作状态，新增或更新,true为新增，false为修改
      operation: true,
      //请求参数
      query: {
        menuName: null,
        pageNumber: "1",
        pageSize: "10",
        parentId: null,
      },
      filterText: null,
      editVisible: false,
      total: 0,
      form: {},
      defaultProps: {
        label: "menuName",
        children: "children",
      },
      // 默认展开的数组
      tableOption: {
        label: "操作",
        width: 300,
        options: [
          {
            label: "更新菜单",
            type: "text",
            icon: "el-icon-edit",
            methods: "edit",
          },
          {
            label: "增加下级菜单",
            type: "text",
            icon: "el-icon-paperclip",
            methods: "setrole",
          },
          {
            label: "删除菜单",
            type: "text",
            icon: "el-icon-delete",
            methods: "delete",
          },
        ],
      },
      tableColId: "menuId",
      tableLabel: [
        { label: "id", param: "usr", align: "center" },

        {
          label: "菜单名称",
          param: "menuName",
          fixed: true,
          click: true,
        },
        {
          label: "菜单类型",
          param: "menuType",
          align: "center",
          sortable: true,
          render: (row) => {
            if (row.menuType == 1) {
              return "菜单";
            } else if (row.menuType == 2) {
              return "按钮";
            } else {
              return "其它";
            }
          },
        },

        { label: "菜单编码", param: "orgCode", align: "center" },
        { label: "菜单/按钮简称", param: "name", align: "center" },
        {
          label: "创建时间",
          param: "createDate",
          align: "center",
        },
      ],
    };
  },
  components: {
    tableView,
  },
  created() {
    this.getData();
    // this.getAttr();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    //获取所有组织
    getData() {
      getBayIdManMenu(this.query).then((res) => (this.treeData = res.data));
    },
    //获取组织类型下拉框
    // getAttr() {
    //   getAttrMenu({ valueCode: "org_type" }).then(
    //     (res) => (this.attrOptions = res.data)
    //   );
    // },
    //监听table组件多选框事件
    getSelectionChange(e) {
      console.log(e);
    },
    //监听table组件按钮事件
    getButton(e, info) {
      console.log(e);
      console.log(info);
      // edit更新组织
      if (e == "edit") {
        this.updataTree(info);
      } else if (e == "setrole") {
        this.appendTree(info);
      } else if (e == "delete") {
        this.removeTree(info);
      }
    },
    //保存
    saveEdit() {
      const that = this;
      const data = that.tableOption;
      if (this.operation) {
        addOneManMenu(that.form).then((res) => {
          if (!data.children) {
            this.$set(data, "children", []);
          }
          if (res.code == 0) {
            that.$message.success(res.message);
            that.getData();
            that.editVisible = false;
          } else {
            that.$message.error(res.message);
          }
        });
      } else {
        updateManMenu(that.form).then((res) => {
          if (res.code == 0) {
            that.$message.success(res.message);
            that.editVisible = false;
          } else {
            that.$message.error(res.message);
          }
        });
      }
    },
    //根据条件查询
    rawQuery() {
      this.getData();
    },
    //新增用户
    addQuery() {
      this.form = {};
      this.operation = true;
      this.editVisible = true;
    },

    //增删节点
    appendTree(data) {
      this.form = {
        menuName: "",
        menuType: null,
        menuUrl: null,
        parentId: data.menuId,
        name:null,
        menuUrl:null
      };
      this.editVisible = true;
    },
    //更新节点
    updataTree(data) {
      this.form = data;
      this.editVisible = true;
      this.operation = false;
    },
    removeTree(data) {
      console.log(data);
      const that = this;
      // const parent = data.parent;
      const idList = data.menuId;
      // const children = parent.data.children || parent.data;
      // const index = children.findIndex((d) => d.orgId === data.orgId);
      delOneManMenu({ idList }).then((res) => {
        if (res.code == 0) {
          that.$message.success(res.message);
          this.getData();
        } else {
          that.$message.error(res.message);
        }
      });
    },
    getOneUser(e) {
      console.log(e);
    },
  },
};
</script>
<style>
.btn-list {
  display: inline-block;
  margin-left: 20px;
}
</style>