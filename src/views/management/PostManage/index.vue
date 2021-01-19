<template>
  <div class="main">
    <div class="main-box post-main">
      <div class="org-box">
        <div class="tree-view">
          <span>
            <i class="el-icon-my-home"></i>
            组织列表</span>
          <el-tree
            :data="treeData"
            :props="defaultProps"
            node-key="id"
            highlight-current
            ref="tree"
            :expand-on-click-node="false"
          >
            <div class="custom-tree-node" slot-scope="{ data }">
              <div @click="getOrg(data)">{{ data.orgName }}</div>
            </div>
          </el-tree>
        </div>
      </div>
      <div class="user-box">
        <div class="title-box" style="width: auto;">
          <div class="title-list">
            <div class="list-box">
              <span class="title">岗位名称</span>
              <el-input placeholder="岗位名称" v-model="query.postName" style="width: 200px" clearable></el-input>
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
              <el-button class="add" :disabled="!hasButtons('post-add')" @click="addQuery">新增岗位</el-button>
            </div>
            <div class="button-box">
              <el-button class="del" @click="allDelUser" :disabled="!hasButtons('post-del') || multipleSelection == ''">删除</el-button>
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
    </div>

    <!-- 编辑，增加模态框 -->
    <el-dialog title="岗位信息" :visible.sync="editVisible" width="60%">
      <el-form ref="form" class="org-form" :model="form" label-width="180px">
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="基础信息" name="jichu">
            <el-row>
              <el-col :span="8">
                <el-form-item label="岗位名称:" :required="true">
                  <el-input v-model="form.postName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="岗位编码:" :required="true">
                  <el-input v-model.number="form.postCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="定编人数:" :required="true">
                  <el-input v-model.number="form.needNum"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="工作联系外部:">
                  <el-input v-model="form.postContactOut"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工作联系内部:">
                  <el-input v-model.number="form.postContactIn"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="教育背景要求:">
                  <el-input v-model.number="form.eduBackgroundCondition"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="专业资质/职称证书要求:">
                  <el-input v-model="form.titleCondition"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工作经验要求:">
                  <el-input v-model.number="form.workExCondition"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="专业知识和技能要求:">
                  <el-input v-model.number="form.subjectSkillCondition"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="素质/能力要求:">
                  <el-input v-model="form.qualityAbilityCondition"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="其他要求:">
                  <el-input v-model.number="form.otherCondition"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="岗位晋升:">
                  <el-input v-model.number="form.postPromotion"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="岗位轮换:">
                  <el-input v-model="form.postRotation"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="直接上级:">
                  <el-input v-model.number="form.superiorName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所辖范围:">
                  <el-input v-model.number="form.workScope"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="岗位说明" name="postDesc">
            <quill-editor v-model="form.postDesc" :options="editorOption" ref="myQuillEditor1"></quill-editor>
          </el-tab-pane>
          <el-tab-pane label="评估指标" name="target">
            <quill-editor v-model="form.target" :options="editorOption" ref="myQuillEditor"></quill-editor>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import tableView from "@/components/vTable.vue";
// const tableView = () =>import("@/components/vTable.vue");
import { quillEditor } from "vue-quill-editor";
// const { quillEditor } = ()=>import("vue-quill-editor");
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { getBayIdManOrg } from "@/api/management/orgManage";
//导入判断是否拥有该按钮
import { isButtons } from "@/utils/button";
import {
  getPostInfo,
  delOnePost,
  getIdPost,
  addOnePost,
  updatePost,
} from "@/api/management/postManage";

const toolbarOption = [
  ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
  ["blockquote", "code-block"], //引用，代码块
  [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
  [{ list: "ordered" }, { list: "bullet" }], //列表
  [{ script: "sub" }, { script: "super" }], // 上下标
  [{ indent: "-1" }, { indent: "+1" }], // 缩进
  [{ direction: "rtl" }], // 文本方向
  [{ size: ["small", false, "large", "huge"] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
  [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
  [{ font: [] }], //字体
  [{ align: [] }], //对齐方式
  ["clean"], //清除字体样式
  ["image", "video"], //上传图片、上传视频
];
export default {
  data() {
    return {
      tableData: [],
      //操作状态，新增或更新,true为新增，false为修改
      operation: true,
      treeData: [],
      defaultProps: {
        label: "orgName",
        children: "children",
      },
      editorOption: {
        modules: {
          toolbar: {
            container: toolbarOption,
          },
        }, //编辑器配置项
      }, //编辑器配置项
      //请求参数
      query: {
        orgId: null,
        pageNumber: "1",
        pageSize: "10",
        postCode: null,
        postName: null,
      },
      //请求参数
      roleQuery: {
        userId: null,
        pageNumber: 1,
        pageSize: 10,
      },
      //批量删除数组
      multipleSelection: '',
      activeName: "jichu",
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
      total: 0,
      form: {},
      roleData: [],
      tableLabel: [
        { label: "岗位代码", param: "postCode", align: "center" },
        {
          label: "岗位名称",
          param: "postName",
          align: "center",
          fixed: true,
          click: true,
        },
        {
          label: "岗位编码",
          param: "postCode",
          align: "center",
        },
        { label: "定编人数", param: "needNum", align: "center" },
        { label: "在职人数", param: "jobNum", align: "center" },
        {
          label: "岗位编码",
          align: "center",
          render: (row) => {
            if (row.isEnable === 1) {
              return "正常";
            }else {
              return "异常";
            }
          },
        },
        
        
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
            disabled: !this.hasButtons("post-edit"),
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
    quillEditor,
  },
  created() {
    this.getData();
    this.getOrgList();
  },
  methods: {
    //获取所有岗位
    getData() {
      const that = this;
      getPostInfo(this.query).then((res) => {
        if (res.code === 0) {
          that.tableData = res.data.records;
          that.total = res.data.total;
        }
      });
    },
    hasButtons(data) {
      return isButtons(data);
    },
    //获取组织
    getOrgList() {
      getBayIdManOrg(this.query).then((res) => (this.treeData = res.data));
    },
    //点击获取岗位
    getOrg(e) {
      const { orgId, orgName, parentIdAll } = e;
      if (parentIdAll) {
        this.query.orgIdAll = parentIdAll + "," + orgId;
        this.query.orgId = orgId;
      } else {
        this.query.orgId = orgId;
      }
      this.orgName = orgName;
      this.getData();
    },
    //监听table组件多选框事件
    getSelectionChange(e) {
      let arr = "";
      // multipleSelection
      e.forEach((v) => {
        arr += v.postId + ",";
      });
      this.multipleSelection = arr;
    },
    //监听table组件按钮事件
    getButton(e, info) {
      const that = this;
      that.roleIdList = [];
      that.userIdList = [];
      if (e == "edit") {
        //查询用户详细信息
        that.getOneInfo(info.postId);
      }
      that.userIdList.push(info.postId);
    },
    //获取所取菜单
    handleRoleChange(e) {
      console.log(e);
      this.roleChangeList = e;
    },
    //发送请求一个人信息接口
    getOneInfo(id) {
      if (!this.hasButtons("post-edit")) {
        this.$message.error("对不起,你不具备操作权限");
        return false;
      }
      this.operation = false;
      getIdPost(id).then(
        (res) => ((this.form = res.data), (this.editVisible = true))
      );
    },
    //获取一个人信息
    getOneUser(e) {
      this.getOneInfo(e.postId);
    },
    //保存
    saveEdit() {
      const that = this;
      that.$refs["form"].validate((valid) => {
        if (valid) {
          that.form.orgId = that.query.orgId;
          that.form.orgIdAll = that.query.orgIdAll;
          if (that.operation) {
            //新增岗位
            addOnePost(that.form).then(
              (res) => (
                that.$message.info(res.message),
                that.runReset(),
                (that.editVisible = false)
              )
            );
          } else {
            //更新岗位
            updatePost(that.form).then(
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
      this.query.pageNumber=1;
      this.query.pageSize=10;
      this.getData();
    },
    //重置请求
    runReset() {
      this.query = {
        orgId: null,
        pageNumber: "1",
        pageSize: "10",
        postCode: null,
        postName: null,
      };
      this.getData();
    },
    //新增职位
    addQuery() {
      if (!this.hasButtons("post-add")) {
        this.$message.error("对不起,你不具备操作权限");
        return false;
      }
      if (!this.query.orgId) {
        this.$message.error("必须选择一个组织进行新增人员");
        return;
      }
      this.form = {};
      this.operation = true;
      this.editVisible = true;
    },
    //批量删除职位
    allDelUser() {
      const that = this;
      if (!that.hasButtons("personer-del")) {
        that.$message.error("对不起,你不具备操作权限");
        return false;
      }
      const idList = that.multipleSelection;
      if (idList == '') {
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
          delOnePost({ idList }).then((res) => {
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
    //分页请求
    handleCurrentChange(e){
      this.query.pageNumber=e;
      this.getData();
    },
    handleSizeChange(e){
      this.query.pageSize=e;
      this.getData();
    }
  },
};
</script>
<style lang='scss' scoped>
.post-main {
  display: flex;
  height: 100%;
  .org-box {
    flex: 1;
    height: 100%;
    max-width: 250px;
    min-width: 200px;
    padding-top: 15px;
    border-right: 1px solid #ededed;
  }
  .user-box {
    flex: 3;
  }
  .tree-view{
    padding: 0 20px;
  }
  .el-tree-node {
    margin: 10px 0;
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #42b983 !important;
    color: #fff !important;
  }
}
.org-form {
  .quill-editor {
    .ql-container {
      min-height: 200px;
    }
  }

  .ql-snow .ql-tooltip[data-mode="link"]::before {
    content: "请输入链接地址:";
  }

  .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: "保存";
    padding-right: 0px;
  }

  .ql-snow .ql-tooltip[data-mode="video"]::before {
    content: "请输入视频地址:";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: "14px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    content: "10px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    content: "18px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    content: "32px";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: "文本";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: "标题1";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: "标题2";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: "标题3";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: "标题4";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: "标题5";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: "标题6";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: "标准字体";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
    content: "衬线字体";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
    content: "等宽字体";
  }
}
</style>