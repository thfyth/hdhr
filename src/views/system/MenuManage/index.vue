<template>
  <div class="main">
    <div class="title-box" style="width: auto;">
      <!-- <div class="title-list">
        <div class="list-box">
          <span class="title">菜单名称</span>
          <el-input placeholder="菜单名称" style="width: 200px" clearable></el-input>
        </div>
      </div>-->
      <div class="title-list">
        <!-- <el-button class="insert" @click="addQuery">新增</el-button> -->

        <div class="button-box">
          <el-button class="insert" @click="rawQuery">获取最新菜单数据</el-button>
        </div>
      </div>
    </div>
    <div class="table-view">
      <table-view
        :table-data="treeData"
        @handleButton="getButton"
        @getOneData="getOneUser"
        :table-label="tableLabel"
        :table-option="tableOption"
        :total="total"
        :isShowPage="isShowPage"
        :tableColId="tableColId"
      ></table-view>
    </div>
    <div class="model">
      <!-- 编辑，增加模态框 -->
      <el-dialog title="组织管理" :visible.sync="editVisible" width="60%">
        <el-form ref="form" :model="form" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="组织名称:" :required="true">
                <el-input v-model="form.menuName"></el-input>
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
  delOneManMenu,
  addOneManMenu,
  getBayIdManMenu,
  updateManMenu,
  getBayIdMenu,
} from "@/api/system/menuManage";
// import { menuManage } from "@/utils/api";
export default {
  data() {
    return {
      treeData: [],
      //操作状态，新增或更新,true为新增，false为修改
      operation: true,
      //请求参数
      query: {
        menuName: null,
        pageNumber: "1",
        pageSize: "10",
        parentId: null,
      },
      tableColId: "menuId",
      filterText: null,
      editVisible: false,
      total: 0,
      form: {},
      defaultProps: {
        label: "menuName",
        children: "children",
      },
      //不显示分页
      isShowPage: false,
      // 默认展开的数组
      tableOption: {},
      tableLabel: [
        {
          label: "菜单名称",
          param: "menuName",
          fixed: true,
          click: true,
          selection:true
        },
        {
          label: "菜单类型",
          param: "menuType",
          align: "center",
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
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    //获取所有菜单
    getData() {
      getBayIdManMenu(this.query).then(
        (res) => (console.log(res), (this.treeData = res.data))
      );
    },
    //保存
    saveEdit() {
      const that = this;
      const data = that.tableOption;
      if (this.operation) {
        addOneManMenu(that.form).then((res) => {
          //   that.runReset(),

          if (!data.children) {
            this.$set(data, "children", []);
          }
          if (res.code == 0) {
            that.$message.success(res.message);
            data.children.push(this.form);
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
      //   const parentIdAll = data.parentIdAll + "," + data.orgId || "";
      this.form = {
        menuName: "",
        parentId: data.menuId,
      };
      console.log(this.form);
      this.tableOption = data;
      this.editVisible = true;
    },
    //更新节点
    updataTree(data) {
      this.form = data;
      this.editVisible = true;
      this.operation = false;
    },
    removeTree(node, data) {
      const that = this;
      const parent = node.parent;
      const idList = data.menuId;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.menuId === data.menuId);
      delOneManMenu({ idList }).then((res) => {
        if (res.code == 0) {
          that.$message.success(res.message);
          children.splice(index, 1);
        } else {
          that.$message.error(res.message);
        }
      });
    },
    getButton() {},
    getOneUser() {},
  },
};
</script>
<style>
.btn-list {
  display: inline-block;
  margin-left: 20px;
}
</style>