<template>
  <div class="main">
    <div class="user-box">
      <div class="title-box" style="width: auto;">
        <div class="title-list">
          <div class="list-box">
            <span class="title">职级名称</span>
            <el-input placeholder="职级名称" v-model="query.rankName" style="width: 200px" clearable></el-input>
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
            <el-button class="add" :disabled="!hasButtons('rank-add')" @click="addQuery">新增职级</el-button>
          </div>
          <div class="button-box">
            <el-button class="del" :disabled="!hasButtons('rank-del') || multipleSelection == ''" @click="allDelUser">删除</el-button>
          </div>
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
    </div>
    <!-- 编辑，增加模态框 -->
    <el-dialog title="职级信息" :visible.sync="editVisible" width="60%">
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="职级名称:" :required="true">
          <el-input v-model="form.rankName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="对应岗位(可多选):" :required="true">
          <el-select
            style="width:100%"
            value-key="postId"
            @click.native="getForm"
            v-model="form.postList"
            multiple
            placeholder="岗位"
          >
            <el-option
              v-for="item in postOptions"
              :key="item.postId"
              :label="item.postName"
              :value="item.postId"
            >
              <span class="check"></span>
              <span>{{item.postName}}</span>
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="描述:">
          <el-input v-model="form.rankDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑，增加模态框 -->
    <el-dialog title="组织信息" :visible.sync="editVisible1" width="30%">
      <div class="tree-view">
        <h3>组织列表:</h3>
        <el-tree
          :data="treeData"
          :props="defaultProps"
          node-key="postId"
          highlight-current
          show-checkbox
          ref="tree"
          :expand-on-click-node="false"
        >
          <div class="custom-tree-node" slot-scope="{ data }">
            <span :style="{'color':data.disabled?'#000':'#A00005'}">{{ data.orgName }}</span>
          </div>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="saveEditTree">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import tableView from "@/components/vTable.vue";
import { getPostInfo } from "@/api/management/postManage";
import {
  getRankInfo,
  getIdRank,
  updateRank,
  addOneRank,
  getOrgPostInfo,
  delOneRank,
} from "@/api/management/rankManage";

import {
  getBayIdPerson,
  updatePerson,
  addOnePerson,
  delOnePerson,
  addOneRole,
  getBayIdRole,
} from "@/api/user";

//导入判断是否拥有该按钮
import { isButtons } from "@/utils/button";

export default {
  data() {
    return {
      tableData: [],
      //操作状态，新增或更新,true为新增，false为修改
      operation: true,
      defaultProps: {
        label: "orgName",
        children: "children",
      },
      //请求参数
      query: {
        pageNumber: "1",
        pageSize: "10",
        rankName: null,
      },
      //请求岗位参数
      postQuery: {
        pageNumber: "1",
        pageSize: "10",
        rankId: "",
        rankName: "",
      },
      editVisible: false,
      editVisible1: false,
      total: 0,
      form: {},
      roleData: [],
      tableLabel: [
        {
          label: "id",
          param: "rankId",
          align: "center",
        },
        {
          label: "职级名称",
          param: "rankName",
          align: "center",
          fixed: true,
          click: true,
        },
        { label: "描述", param: "rankDesc", align: "center" },
        { label: "在岗人数", param: "jobNum", align: "center" },
      ],
      tableOption: {
        label: "操作",
        width: "200",
        options: [
          {
            label: "编辑",
            type: "text",
            icon: "el-icon-my-edit",
            methods: "edit",
            disabled: !this.hasButtons("rank-edit"),
          },
        ],
      },
      //用户设置角色
      userIdList: [],
      roleIdList: [],
      roleChangeList: [],
      postOptions: [],
      treeData: [],
      //批量删除数组
      multipleSelection: '',
    };
  },
  components: {
    tableView,
  },
  created() {
    this.getData();
    this.getOrgList();
  },
  methods: {
    //获取职级信息
    getData() {
      getRankInfo(this.query).then(
        (res) => (this.tableData = res.data.records,this.total=res.data.total)
      );
    },

    hasButtons(data) {
      return isButtons(data);
    },
    //获取所有岗位
    // ispost
    getOrgList() {
      const that = this;
      getOrgPostInfo(this.postQuery).then((res) => {
        if (res.code === 0) {
          // const ss= that.getMenuUser(res.data);
          // console.log(ss);
          that.treeData = res.data;
        }
        // that.treeData = res.data
      });
    },
    //递归遍历取菜单id
    getMenuIdList(data) {
      let menuIdList = "";
      const getStr = function (list) {
        list.forEach(function (row) {
          if (row.children) {
            if (row.isChecked == 1) {
              menuIdList += row.postId + ",";
            }
            getStr(row.children);
          } else {
            if (row.isChecked == 1) {
              menuIdList += row.postId + ",";
            }
          }
        });
      };
      getStr(data);
      const arr = menuIdList.split(",");
      console.log(menuIdList);
      return arr;
    },
    //递归遍历取出菜单
    getMenuUser(data) {
      // const getStr = function (list) {
      //   list.forEach(function (row) {
      //     if (row.children) {
      //       if (row.ispost == 1) {
      //         row.disabled=true;
      //       }
      //       getStr(row.children);
      //     } else {
      //       if (row.ispost == 1) {
      //         row.disabled=true;
      //       }
      //     }
      //   });
      // };
      // getStr(data);
      // console.log(data);
      // return data;
    },
    //监听table组件多选框事件
    getSelectionChange(e) {
      let arr = "";
      // multipleSelection
      e.forEach((v) => {
        arr += v.rankId + ",";
      });
      this.multipleSelection = arr;
    },
    //监听table组件按钮事件
    getButton(e, info) {
      //编辑
      const that = this;
      console.log(info);
      const { rankId } = info;
      if (e == "edit") {
        that.getOneInfo(rankId);
      }
    },
    //保存
    saveEdit() {
      const that = this;
      let arr = [];
      // that.form.postList.forEach((v) => {
      //   arr.push(v.postId);
      // });
      // that.form.postList = arr;
      let postMain = null;
      if (this.operation) {
        postMain = addOneRank(that.form);
      } else {
        //updateRank 修改职级
        postMain = updateRank(that.form);
      }
      postMain.then((res) => {
        if (res.code === 0) {
          that.getData();
          that.$message.success(res.message);
          that.editVisible = false;
        } else {
          that.$message.error(res.message);
        }
      });
    },
    //选择岗位getForm
    getForm() {
      this.editVisible1 = true;
      const list = this.getMenuIdList(this.treeData);
      console.log(list.length);
      if (list.length > 1) {
        list.forEach((v) => {
          this.$nextTick(() => {
            this.$refs.tree.setChecked(v, true, true);
          });
        });
      }

      
    },
    //获取所取菜单
    handleRoleChange(e) {
      this.roleChangeList = e;
    },
    //发送请求单职级信息接口
    getOneInfo(id) {
      if (!this.hasButtons("rank-edit")) {
        this.$message.error("对不起,你不具备操作权限");
        return false;
      }
      this.operation = false;
      const postQuery = {
        pageNumber: "1",
        pageSize: "10",
        rankId: id,
        rankName: "",
      };
      const that = this;
      const par1 = getOrgPostInfo(postQuery);
      const par2 = getIdRank(id);
      Promise.all([par1, par2]).then((res) => {
        that.form = res[1].data;
        that.treeData = res[0].data;
        that.editVisible = true;
      });
      // getIdRank(id).then(
      //   (res) => ((this.form = res.data), (this.editVisible = true),this.$refs.tree.setCheckedKeys(true))
      // );
    },
    //获取单职级信息
    getOneUser(e) {
      this.getOneInfo(e.rankId);
    },
    //根据条件查询
    rawQuery() {
      this.query.pageNumber=1;
      this.query.pageSize=10;
      this.getData();
    },
    //重置请求
    runReset() {
      this.query = {
        pageNumber: "1",
        pageSize: "10",
        rankName: null,
      };
      this.getData();
    },
    saveEditTree() {
      let dataRecieve = this.$refs.tree.getCheckedNodes(true, false);
      let postList = [];
      dataRecieve.forEach((v) => {
        const obj = {
          postName: v.postName,
          // postId: v.postId,
        };
        postList.push(v.postId);
      });
      console.log(postList);
      this.form.postList = postList;
      this.postOptions = dataRecieve;
      this.editVisible1 = false;
    },
    //新增用户
    addQuery() {
      if (!this.hasButtons("rank-add")) {
        this.$message.error("对不起,你不具备操作权限");
        return false;
      }
      this.getOrgList();
      this.form = {};
      this.operation = true;
      this.editVisible = true;
    },
    allDelUser() {
      const that = this;
      if (!that.hasButtons("rank-del")) {
        that.$message.error("对不起,你不具备操作权限");
        return false;
      }
      const idList = that.multipleSelection;
      if (idList == null) {
        that.$message.error("请选择一个职位进行删除");
        return;
      }
      that
        .$confirm("此操作将会删除岗位, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          //删除信息
          delOneRank({ idList }).then((res) => {
              if (res.code === 0) {
                that.getData();
                that.$message.success(res.message);
              }
            });
        })
        .catch((err) => {});
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
<style lang='scss' scoped>
.main-box {
  display: flex;
  .table-view {
    flex: 3;
  }
  .el-tree-node {
    margin: 10px 0;
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #c5466d !important;
    color: #fff !important;
  }
  
}
//去除删除多选框按钮
.el-select .el-tag__close.el-icon-close {
  display: none;
}
</style>