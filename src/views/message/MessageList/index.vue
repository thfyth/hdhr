<template>
  <div class="main">
    <div class="title-box" style="width: auto">
      <div class="title-list">
        <div class="list-box">
          <span class="title">消息类型:</span>
          <el-select v-model="query.msgClass" style="width:150px" placeholder="消息类型">
          <el-option
            v-for="item in remindClassOption"
            :key="item.attrValue"
            :label="item.attrName"
            :value="item.attrValue">
          </el-option>
        </el-select>
        </div>
        <div class="list-box">
          <span class="title">组织:</span>
          <el-cascader
              v-model="query.msgId"
              ref="orgIdCascader"
              :options="treeData"
              style="width:150px"
              :props="orgProps"
              :show-all-levels="false"
            ></el-cascader>
        </div>
        <div class="list-box">
          <span class="title">消息状态:</span>
          <el-select v-model="query.msgStatus" style="width:100px" placeholder="消息状态">
          <el-option
            v-for="item in msgOptios"
            :key="item.attrValue"
            :label="item.attrName"
            :value="item.attrValue">
          </el-option>
          </el-select>
        </div>
        <div class="list-box">
          <span class="title">发送方式:</span>
          <el-select v-model="query.sendWay" style="width:100px" placeholder="发送方式">
          <el-option
            v-for="item in sendWayOption"
            :key="item.attrValue"
            :label="item.attrName"
            :value="item.attrValue">
          </el-option>
          </el-select>
        </div>
        <div class="list-box">
          <el-button class="insert" @click="rawQuery">查询</el-button>
        </div>
        <div class="list-box">
          <el-button  class="resetting" @click="runReset">重置</el-button>
        </div>
      </div>
    </div>
    <div class="table-view">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :header-cell-style="{ background: '#F7F8FA', color: '#293B59' }"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="名称" width="180">
          <template slot-scope="scope">
            <span @click="getOneInfo(scope.row)" class="article" v-text="scope.row.msgName"></span>
          </template>
        </el-table-column>
        <el-table-column label="内容">
          <template slot-scope="{row}">
            <p v-text="row.msgContent" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="msgContent" width="100" label="状态"> 
          <template slot-scope="scope">
            <span v-if="scope.row.replied == 0">未读</span>
            <span v-else>已读</span>
          </template>
        </el-table-column>
        <el-table-column prop="sendTime" width="200" label="时间">
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
      <el-dialog title="消息内容" :visible.sync="editVisible" width="50%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="消息名称:">
              <span v-text="form.msgName"></span>
            </el-form-item>
        <el-form-item label="消息内容:">
              <span v-text="form.msgContent"></span>
            </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    </div>
  </div>
</template>


<script>
import { getMsgList, updataMsgType } from "@/api/msg";
import { mapGetters } from "vuex";
import { getAttrMenu } from "@/api/attrManage";
import store from '@/store';
import { getBayIdManOrg } from "@/api/management/orgManage";
export default {
  data() {
    return {
      query: {
        msgId: null,
        msgStatus: null, //消息状态（1未读2已读）
        pageNumber: "1",
        msgClass:null,
        pageSize: "10",
        receiverId: null, //角色id
        isReceiver:true,
        sendWay: null, //发送方式1系统消息2短信
      },
      tableData: [],
      form:{},
      currentPage: 10,
      editVisible:false,
      sendWayOption:[],
      remindClassOption:[],
      msgOptios:[
        {attrValue:1,attrName:"未读"},
        {attrValue:2,attrName:"已读"},
      ],
      orgProps: {
        label: "orgName",
        value: "orgId",
      },
      treeData: [],
      total:0
    };
  },
  computed: {
    ...mapGetters(["roleIdStr"]),
  },
  created() {
    this.getData();
    this.getMenu();
    this.getOrgData();
  },
  methods: {
    getData() {
      const that = this;
      that.query.receiverId = that.roleIdStr;
      // const data = that.roleIdStr.split(","); //字符分割
      getMsgList(that.query).then((res) => {
        if (res.code === 0) this.tableData = res.data.records,that.total=res.data.total;
      });
    },
     //获取所有组织
    getOrgData() {
      getBayIdManOrg(this.query).then(
        (res) => (this.treeData = res.data),
        this.getMenu()
      );
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
    handleSelectionChange() {},
    getOneInfo(e){
      this.form=e;
      // store.dispatch('user/setMsgCount',)
      if(this.form.msgStatus === 1){
        //未读改为已读
        this.form.msgStatus=2
        this.form.scanNum=1
        const { msgId } = this.form;
        updataMsgType({msgId});

      }
      this.editVisible=true;
    },
    rawQuery(){
      this.getData();
    },
    runReset(){
      this.query={
        msgId: null,
        msgStatus: null, //消息状态（1未读2已读）
        pageNumber: "1",
        msgClass:null,
        pageSize: "10",
        receiverId: null, //角色id
        sendWay: null, //发送方式1系统消息2短信
        isReceiver:true
      };
      this.total=0;
      this.getData();
    },
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
