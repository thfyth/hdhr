<template>
  <div class="main">
    <div class="title-box" style="width: auto">
      <div class="title-list">
            <div class="list-box">
              <span class="title">字典名称</span>
              <el-input
                placeholder="字典名称"
                style="width: 200px"
                v-model="valueSetQuery.valueName"
                clearable
              />
            </div>
            <div class="list-box">
              <el-button class="insert" @click="getData">查询</el-button>
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
            :disabled="!hasButtons('dictionary-add')"
            >新增字典</el-button
          >
        </div>
      </div>
    </div>
    <div class="table-view">
      <table-view
        :table-data="tableData"
        @handleSelectionChange="getSelectionChange"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        @getOneData="getOneInfo"
        @handleButton="getButton"
        :table-label="tableLabel"
        :table-option="tableOption"
        :total="total"
      ></table-view>
    </div>
    <div class="model">
      <el-dialog title="字典内容" :visible.sync="editVisible" width="40%">
        <div slot="title">
          <span class="el-dialog__title">
            <span class="red">{{ valueName }}</span> || 字典属性</span
          >
        </div>
        <el-form ref="form" :model="valueSetData" label-width="120px">
          <el-form-item label="字典名称:" :required="true">
            <el-input v-model="valueSetData.valueName"></el-input>
          </el-form-item>
          <el-form-item label="字典编码:" :required="true">
            <el-input v-model="valueSetData.valueCode"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="valueSetSaveEdit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="字典属性" :visible.sync="editVisible1" width="50%">
        <div slot="title">
          <span class="el-dialog__title">
            <span class="red">{{ valueName }}</span> || 字典属性</span
          >
        </div>
        <div class="addValue">
          <el-button
            class="addValueAttr"
            @click="addValueAttr"
            :disabled="!hasButtons('valueAttr-add')"
            >新增属性</el-button
          >
        </div>
        <el-table :data="valueAttrTableData" border style="width: 100%" height="350px">
          <el-table-column prop="attrName" label="属性名"> </el-table-column>
          <el-table-column prop="attrCode" label="属性编码"> </el-table-column>
          <el-table-column prop="attrValue" label="属性值" width="80"> </el-table-column>
          <el-table-column prop="createDate" label="创建时间"></el-table-column>
          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <el-button
                @click="handleClick(scope.row)"
                type="text"
                size="small"
                icon="el-icon-my-edit"
                :disabled="!hasButtons('valueAttr-edit')"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                icon="el-icon-my-set"
                :disabled="!hasButtons('valueAttr-del')"
                @click="delValueAttr(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editVisible1 = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-dialog title="字典属性" :visible.sync="editVisible2" width="25%">
        <el-form ref="form" :model="valueAttrData" label-width="90px">
          <el-form-item label="属性名称:" :required="true">
            <el-input v-model="valueAttrData.attrName"></el-input>
          </el-form-item>
          <el-form-item label="属性编码:" :required="true">
            <el-input v-model="valueAttrData.attrCode"></el-input>
          </el-form-item>
          <el-form-item label="属性值:" :required="true">
            <el-input v-model="valueAttrData.attrValue"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="valueAttrSaveEdit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import tableView from "@/components/vTable.vue";
import {
  getValueSet,
  addValueSet,
  updataValueSet,
  getBayIdvalueAttr,
  addvalueAttr,
  updatavalueAttr,
  delvalueAttr,
} from "@/api/system/dictionary";

//导入判断是否拥有该按钮
import { isButtons } from "@/utils/button";
export default {
  data() {
    return {
      valueSetData: {},
      valueAttrData: {},
      total: 1,
      valueAttrTableData: [],
      tableData: [],
      //option true为新增，false为修改
      option: true,
      tableLabel: [
        { label: "数据字典主表id", param: "valueId", align: "center" },
        {
          label: "字典名称",
          param: "valueName",
          align: "center",
          click: true,
        },
        {
          label: "字典编码",
          param: "valueCode",
          align: "center",
        },
        {
          label: "创建时间",
          param: "createDate",
          align: "center",
        },
      ],
      editVisible: false,
      editVisible1: false,
      editVisible2: false,
      //字典名称
      valueName: null,
      tableOption: {
        label: "操作",
        options: [
          {
            label: "编辑",
            type: "text",
            icon: "el-icon-my-edit",
            methods: "edit",
            disabled: !this.hasButtons("dictionary-edit"),
          },
          {
            label: "设置属性",
            type: "text",
            icon: "el-icon-my-set",
            methods: "setrole",
            disabled: !this.hasButtons("dictionary-set"),
          },
        ],
      },
      valueSetQuery: {
        pageNumber: 1,
        pageSize: 10,
        valueCode: null,
        valueName: null,
      },
      //字典ID
      valueSetId: null,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //   分页查询数据字典列表
    getData() {
      getValueSet(this.valueSetQuery).then(
        (res) => (
          (this.tableData = res.data.records), (this.total = res.data.total)
        )
      );
    },
    //重置
    runReset(){
       this.valueSetQuery={
        pageNumber: 1,
        pageSize: 10,
        valueCode: null,
        valueName: null,
      }
      this.getData()
    },
    hasButtons(data) {
      return isButtons(data);
    },
    //新增字典
    addQuery() {
      const permission = this.hasPermission("dictionary-add");
      if (permission) {
        this.option = true;
        this.valueSetData = {};
        this.editVisible = true;
      }
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
    getSelectionChange() {},
    //分页请求
    handleCurrentChange(e) {
      this.valueSetQuery.pageNumber = e;
      this.getData();
    },
    handleSizeChange(e) {
      this.valueSetQuery.pageSize = e;
      this.getData();
    },
    addValueAttr() {
      const permission = this.hasPermission("valueAttr-add");
      if (!permission) {
        return;
      }
      this.option = true;
      this.valueAttrData = {};
      this.editVisible2 = true;
    },
    getOneInfo(e) {
      const { valueId, valueName } = e;
      this.valueSetId = valueId;
      this.valueName = valueName;
      this.setrole(valueId);
    },
    //删除字典属性
    delValueAttr(index, row) {
      const permission = this.hasPermission("valueAttr-del");
      if (!permission) {
        return;
      }
      const { attrId } = row;
      const that = this;
      that
        .$confirm("此操作将会删除字典属性, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          //删除信息
          delvalueAttr({ idList: attrId }).then((res) => {
            if (res.code === 0) {
              that.$message.success(res.message);
              that.valueAttrTableData.splice(index, 1);
            } else {
              that.$message.error(res.message);
            }
          });
        })
        .catch((err) => {});
    },
    //增加字典属性
    setrole(valueId) {
      const permission = this.hasPermission("dictionary-set");
      if (!permission) {
        return;
      }
      const query = {
        pageNumber: "1",
        pageSize: "20",
        valueId,
      };
      getBayIdvalueAttr(query).then(
        (res) => (
          (this.valueAttrTableData = res.data.records),
          (this.editVisible1 = true)
        )
      );
    },
    //获取模块事件
    getButton(e, row) {
      console.log(row);
      const { valueId, valueName } = row;
      this.valueSetId = valueId;
      this.valueName = valueName;
      if (e == "edit") {
        const permission = this.hasPermission("dictionary-edit");
        if (!permission) {
          return;
        }
        this.valueSetData = row;
        this.option = false;
        this.editVisible = true;
      } else if (e == "setrole") {
        this.setrole(valueId);
      } else {
        console.log("暂无事件");
      }
    },
    //查看字典属性
    handleClick(row) {
      const permission = this.hasPermission("valueAttr-edit");
      if (!permission) {
        return;
      }
      this.valueAttrData = row;
      this.option = false;
      this.editVisible2 = true;
    },
    //增改字典属性
    valueAttrSaveEdit() {
      const that = this;
      that.valueAttrData.valueId = that.valueSetId;
      let optionData;
      if (that.option) {
        optionData = addvalueAttr(that.valueAttrData);
      } else {
        optionData = updatavalueAttr(that.valueAttrData);
      }
      optionData.then((res) => {
        if (res.code === 0) {
          that.$message.success(res.message);
          that.setrole(that.valueSetId);
          that.editVisible2 = false;
        } else {
          that.$message.error(res.message);
        }
      });
    },
    //保存用户字典
    valueSetSaveEdit() {
      const that = this;
      let optionData;
      if (that.option) {
        optionData = addValueSet(that.valueSetData);
      } else {
        optionData = updataValueSet(that.valueSetData);
      }
      optionData.then((res) => {
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
  components: {
    tableView,
  },
};
</script>


<style lang="scss">
.addValue .el-button {
  background: url("../../../../assets/icon/add.png") no-repeat 15px center
    #1890ff;
  height: 32px;
  line-height: 32px;
  padding: 0;
  padding: 0 20px 0 35px;
  color: #fff;
  margin-bottom: 10px;
}
.addValue .el-button:hover,
.addValue .el-button:active,
.addValue .el-button:focus {
  background-color: #1890ff;
  color: #fff;
}
.addValue .el-button.is-disabled,
.addValue .el-button.is-disabled:focus,
.addValue .el-button.is-disabled:hover {
  background-color: #909399 !important;
  color: #fff;
}
</style>