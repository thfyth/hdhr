<template>
  <div class="main">
    <div class="info-manage-main">
      <div class="info-manage-top">
        <div class="title-box" style="width: auto">
          <div class="title-list">
            <!-- <div class="list-box">
              <span class="title">接收人姓名:</span>
              <el-input
                v-model="query.receiverName"
                placeholder="姓名"
                style="width: 200px"
                clearable
              />
            </div>
            <div class="list-box">
              <span class="title">接收人手机号码:</span>
              <el-input
                v-model="query.receiverMobile"
                placeholder="请输入手机号"
                style="width: 200px"
                clearable
              />
            </div> -->
            <div class="list-box">
              <span class="title">发送方式:</span>
              <el-select
                v-model="query.sendWay"
                style="width: 200px"
                placeholder="消息发送方式"
              >
                <el-option
                  v-for="item in sendWayOption"
                  :key="item.attrValue"
                  :label="item.attrName"
                  :value="item.attrValue"
                />
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
              <el-button class="add" @click="addQuery">新增</el-button>
            </div>
            <div class="button-box">
              <el-button class="del" @click="delMsg">删除</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="table-view">
        <el-table
          ref="table"
          :data="tableData"
          element-loading-text="Loading"
          tooltip-effect="dark"
          formatter
          border
          :header-cell-style="{ background: '#F7F8FA', color: '#293B59' }"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="接收人姓名" width="180" align="center">
            <template slot-scope="{ row }">
              <span
                class="article"
                @click="getOneInfo(row)"
                v-text="row.receiverName"
              />
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="receiverMobile"
            label="接收人手机号"
            width="180">
            </el-table-column> -->
          <el-table-column label="消息状态" width="180" align="center">
            <template slot-scope="{ row }">
              <span v-if="row.msgStatus == 0">
                发送失败
              </span>
              <span v-else-if="row.msgStatus == 1">
                待发送
              </span>
              <span v-else-if="row.msgStatus == 2">
                已发送
              </span>
              <span v-else>
                ---
              </span>
            </template>
          </el-table-column>
          <el-table-column label="发送方式" align="center">
            <template slot-scope="{ row }">
              <span v-if="row.sendWay == 1">
                系统消息
              </span>
              <span v-else-if="row.sendWay == 2">
                短信
              </span>
              <span v-else-if="row.sendWay == 3">
                钉钉消息
              </span>
              <span v-else>
                ---
              </span>
            </template>
          </el-table-column>
          <el-table-column label="消息类型" align="center">
            <template slot-scope="{ row }">
              <span v-if="row.msgClass == 1">
                合同到期
              </span>
              <span v-else-if="row.msgClass == 2">
                试用期到期
              </span>
              <span v-else-if="row.msgClass == 3">
                生日提醒
              </span>
              <span v-else>
                其他
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="是否查看" align="center">
            <template slot-scope="{ row }">
              <span v-if="row.isScan == 1">
                是
              </span>
              <span v-else-if="row.isScan == 0">
                否
              </span>
              <span v-else>
                ---
              </span>
            </template>
          </el-table-column> -->
          <el-table-column label="是否回复" align="center">
            <template slot-scope="{ row }">
              <span v-if="row.isReply == 1">
                是
              </span>
              <span v-else-if="row.isReply == 0">
                否
              </span>
              <span v-else>
                ---
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="是否删除" align="center">
            <template slot-scope="{ row }">
              <span v-if="row.isEnable == 1">
                是
              </span>
              <span v-else-if="row.isEnable == 0">
                否
              </span>
              <span v-else>
                ---
              </span>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="sendTime"
            label="发送时间"
            width="180"
            align="center"
          />
          <el-table-column fixed="right" label="操作" width="300">
            <template slot-scope="{ row }">
              <el-button type="text" @click="getOneInfo(row)">查看</el-button>
              <el-button
                v-if="row.sendWay == 3 && row.msgStatus !== 2"
                type="text"
                @click="sendDingMsg(row)"
              >发送钉钉消息</el-button>
              <el-button
                v-if="row.sendWay == 3"
                type="text"
                @click="reCallDingMsg(row)"
              >撤回钉钉消息</el-button>
              <el-button
                v-if="row.isReply == 1"
                type="text"
                @click="getUserReply(row)"
              >查看回复信息</el-button>
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
        <el-dialog title="消息详细" :visible.sync="dialogVisible" width="60%">
          <el-form ref="form" :model="form" label-width="120px">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="接收人姓名">
                  <!-- <el-input v-model="form.receiverName" /> -->
                  <wlTreeSelect
                    v-model="receiverList"
                    leaf
                    width="260"
                    height="230"
                    checkbox
                    :defaultExpandAll="false"
                    node-key="orgId"
                    :data="userOption"
                    :props="props"
                    @change="hindleChanged"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="消息类型">
                  <el-select v-model="form.msgClass" placeholder="请选择">
                    <el-option
                      v-for="item in msgClassOpt"
                      :key="item.attrValue"
                      :label="item.attrName"
                      :value="item.attrValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="发送方式">
                  <el-select v-model="form.sendWay" placeholder="消息发送方式">
                    <el-option
                      v-for="item in sendWayOption"
                      :key="item.attrValue"
                      :label="item.attrName"
                      :value="item.attrValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否需要回复">
                  <el-select v-model="form.isReply" placeholder="需要回复">
                    <el-option
                      v-for="item in isReplyOpt"
                      :key="item.attrValue"
                      :label="item.attrName"
                      :value="item.attrValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="消息名称">
                  <el-input v-model="form.msgName" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="消息内容">
                  <el-input
                    v-model="form.msgContent"
                    type="textarea"
                    autosize
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveForm">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="回复列表" :visible.sync="dialogVisible1" width="60%">
          <div class="reply-info-box">
            <el-table
              :data="replyData"
              :header-cell-style="{ background: '#F7F8FA', color: '#293B59' }"
              style="width: 100%"
              max-height="450"
            >
              <el-table-column type="index" label="序号" width="50" fixed />
              <el-table-column
                prop="userName"
                label="回复人"
                fixed
                width="width"
              />
              <el-table-column prop="replyContent" label="回复内容" width="500" />
              <el-table-column prop="replyTime" label="回复时间" />
            </el-table>
          </div>
          <div slot="footer">
            <el-button @click="dialogVisible1 = false">关 闭</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import {
  addMsg,
  delMsg,
  updateMsg,
  getMsgClass,
  sendDingMsgs,
  reCallDingMsgs,
  selectReply
} from '@/api/system/infoManage'
import { getAttrMenu } from '@/api/attrManage'
import { getUserWithTree } from '@/api/system/userRole'

let vm
export default {
  components: {  },
  data() {
    return {
      query: {
        pageNumber: 1,
        pageSize: 10,
        isReceiver: false
      },
      total: 0,
      tableData: [],

      form: {},
      dialogVisible: false,
      // 用户操作 true为新增，false为修改
      option: true,
      sendWayOption: [],
      remindClassOption: [],
      props: {
        label: 'orgName',
        value: 'orgId'
      },
      userOption: [],
      msgClassOpt: [
        {
          attrValue: 4,
          attrName: '其它'
        }
      ],
      // 是否需要回复
      isReplyOpt: [
        {
          attrValue: 0,
          attrName: '否'
        },
        {
          attrValue: 1,
          attrName: '是'
        }
      ],
      receiverList: [],
      multipleSelection: '',
      dialogVisible1: false,
      replyData: [],
      total:0,
      currentPage:10
    }
  },
  created() {
    vm = this
    vm.getData()
    vm.getMenu()
  },
  methods: {
    // 获取所有消息
    getData() {
      getMsgClass(vm.query).then(res => {
        if (res.code === 0) {
          vm.tableData = res.data.records
          console.log(vm.tableData)
          vm.total = res.data.total
        }
      })
    },
    //分页
    handleSizeChange(e){
      vm.query.pageSize=e;
      vm.getData()
    },
    handleCurrentChange(e){
      vm.query.pageNumber=e;
      vm.getData()
    },
    // 获取下拉框数据
    getMenu() {
      // 提醒类型
      const data1 = getAttrMenu({ valueCode: 'remind_class' })
      // 提醒发送类型
      const data2 = getAttrMenu({ valueCode: 'send_way' })
      const data3 = getUserWithTree()
      Promise.all([data1, data2, data3]).then(
        res => (
          (vm.sendWayOption = res[1].data[0].send_way.option),
          (vm.remindClassOption = res[0].data[0].remind_class.option),
          (vm.userOption = res[2].data)
        )
      )
    },
    // 新增数据
    addQuery() {
      vm.option = true
      vm.form = {}
      vm.receiverList = []
      vm.dialogVisible = true
    },
    // 查询数据
    rawQuery() {
      vm.getData()
    },
    // 重置查询数据
    runReset() {
      vm.query = {
        pageNumber: 1,
        pageSize: 10,
        isReceiver: false
      }
      vm.getData()
    },
    hindleChanged(e) {
      // 获取选择的人员
      const data = e
      let str = ''
      data.forEach(v => {
        str = str + v.userId + ','
      })
      vm.form.receiverId = str
    },
    // 获取一个消息信息
    getOneInfo(e) {
      console.log(e)
      const { receiverId } = e
      const list = receiverId.split(',')
      let arr = []
      list.forEach(v => {
        console.log(v)
        if (v !== '') {
          const arr1 = vm.recursiveFunction(v, vm.userOption)
          arr = arr.concat(...arr1)
        }
      })
      vm.option = false
      vm.form = e
      vm.receiverList = arr

      vm.dialogVisible = true
    },
    // 递归遍历
    recursiveFunction(id, data) {
      var arr = []
      const getStr = function(list) {
        list.forEach(function(row) {
          if (row.children) {
            getStr(row.children)
          } else {
            if (id == row.userId) {
              arr.push(row)
            }
          }
        })
      }
      getStr(data)
      return arr
    },
    // 提交消息
    saveForm() {
      let data
      if (vm.option) {
        // 新增
        data = addMsg(vm.form)
      } else {
        data = updateMsg(vm.form)
      }
      data.then(res => {
        if (res.code === 0) {
          vm.$message.success(res.message)
          vm.getData()
          vm.dialogVisible = false
        } else {
          vm.$message.error(res.message)
        }
      })
    },
    // 表格按钮点击
    handleButton(e, row) {
      console.log(e)
      if (e == 'sendcalldd') {
        vm.sendDingMsg()
      } else if (e == 'recalldd') {
        vm.reCallDingMsg()
      } else {
        vm.getOneInfo(row)
      }
    },
    // 多选框事件
    handleSelectionChange(e) {
      let arr = ''
      // multipleSelection
      e.forEach(v => {
        arr += v.msgId + ','
      })
      vm.multipleSelection = arr
    },
    // 删除事件
    delMsg() {
      const idList = vm.multipleSelection
      if (idList.length < 1) {
        vm.$message.error('请选择一个消息进行删除')
        return
      }
      vm.$confirm('此操作将会删除消息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除信息
          delMsg({ idList }).then(res => {
            if (res.code === 0) {
              vm.getData()
              vm.$message.success(res.message)
            } else {
              vm.$message.error(res.message)
            }
          })
        })
        .catch(err => {})
    },
    // 发送钉钉消息
    sendDingMsg(e) {
      const { msgId } = e
      sendDingMsgs({ msgId }).then(res => {
        if (res.code === 0) {
            vm.getData()
          vm.$message.success(res.message)
        } else {
          vm.$message.error(res.message)
        }
      })
    },
    // 撤回钉钉消息
    reCallDingMsg(e) {
      const { msgId } = e
      reCallDingMsgs({ msgId }).then(res => {
        if (res.code === 0) {
            vm.getData()
          vm.$message.success(res.message)
        } else {
          vm.$message.error(res.message)
        }
      })
    },
    // 查看回复消息selectReply
    getUserReply(e) {
      const { msgId } = e
      selectReply({ msgId }).then(res => {
        if (res.code === 0) {
          vm.replyData = res.data
          vm.dialogVisible1 = true
        } else {
          vm.$$message.error(res.message)
        }
      })
    }
  }
}
</script>
