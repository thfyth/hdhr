<template>
  <div class="main tur-main">
    <div class="title-box" style="width: auto">
      <div class="title-list">
        <div class="list-box">
          <span class="title">员工名称:</span>
          <el-input
            v-model="query.employeeName"
            placeholder="员工名称"
            style="width: 100px"
            clearable
          />
        </div>
        <div class="list-box">
          <span class="title">异动类型:</span>
          <el-select
            v-model="query.changeType"
            style="width: 80px"
            placeholder="操作类型"
          >
            <el-option
              v-for="item in turnType"
              :key="item.attrValue"
              :label="item.attrName"
              :value="item.attrValue"
            />
          </el-select>
        </div>
        <div class="list-box">
          <span class="title">开始异动日期:</span>
          <el-date-picker
            v-model="query.changeDate"
            start-placeholder="开始日期"
            range-separator="至"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy 年 MM 月 dd 日"
            type="daterange"
            @change="dataPicker"
          />
        </div>
        <div class="list-box">
          <el-button class="insert" @click="rawQuery">查询</el-button>
        </div>
        <div class="list-box">
          <el-button class="resetting" @click="runReset">重置</el-button>
        </div>
      </div>
      <div class="titles-list">
        
          <!-- <div class="button-box">
              <el-button class="add" @click="addTur">添加</el-button>
            </div>  -->
             <div class="button-box">
              <el-button class="del" @click="allDel">删除</el-button>
            </div>
      </div>
      
    </div>
    <div class="table-box">
      <el-table
        :data="tableData"
        style="width: 100%"
        element-loading-text="Loading"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        formatter
        border
        :header-cell-style="{ background: '#F7F8FA', color: '#293B59' }"
      >
       <el-table-column
        type="selection"
        width="55" />
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column label="员工名称">
          <template slot-scope="scope">
            <span
              class="active"
              @click="getOneInfo(scope.row)"
              v-text="scope.row.employeeName"
            />
          </template>
        </el-table-column>
        <el-table-column label="原公司" prop="changeBeforeCompanyName"></el-table-column>
        <el-table-column label="原部门" prop="changeBeforeOrgName"></el-table-column>
        <el-table-column label="原职位" prop="changeBeforePostName"></el-table-column>
        <el-table-column label="异动后公司" prop="changeCompanyName"></el-table-column>
        <el-table-column label="异动后部门" prop="changeOrgName"></el-table-column>
        <el-table-column label="异动后职位" prop="changePostName"></el-table-column>
        <el-table-column prop="changeExplain" label="异动说明" />
        <el-table-column label="异动状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">
              申请中
            </span>
            <span v-if="scope.row.status == 2">
              已通过
            </span>
            <span v-else>
              无
            </span>
          </template>
        </el-table-column>
        <el-table-column label="异动类型">
          <template slot-scope="scope">
            <span v-text="scope.row.changeTypeName" />
          </template>
        </el-table-column>
        <el-table-column prop="changeDate" label="异动时间" />
      </el-table>
      <!-- <table-view
        :table-data="tableData"
        @handleButton="getButton"
        @getOneData="getOneInfo"
        :table-label="tableLabel"
        :table-option="tableOption"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        :total="total"
      ></table-view> -->
      <div class="block pagination-box">
        <el-pagination
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
           @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <div class="model">
      <el-dialog :visible.sync="dialogVisible" width="80%">
        <template slot="title">
          <template
            v-if="form.changeTempType == 0"
          >增加本公司异动模板</template>
          <template v-else>增加跨公司异动模板</template>
        </template>
        <div class="tur-dialog-box">
          <div class="tur-title">
            异动模板类型:
            <el-select
              v-model="form.changeTempType"
              placeholder="异动模板类型"
              @change="changeType"
            >
              <el-option
                v-for="item in changeTempTypeOpt"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <!-- changeTempType	integer($int32)
异动模板类型（0本公司，1.跨公司） -->

          <el-form v-if="form.changeTempType == 0" ref="form" :model="form">
            <table
              align="center"
              cellspacing="0"
              border="1"
              style="width: 100%; table-layout: fixed"
            >
              <tr>
                <th>员工姓名</th>
                <td>
                  <!-- <el-autocomplete
                    v-model="form.employeeName"
                    placeholder="请输入内容"
                    :fetch-suggestions="querySearchAsync"
                    @select="handleSelect"
                  /> -->

                  <span v-text="form.employeeName"></span>
                </td>
                <th>部门</th>
                <td>
                  <span v-text="form.changeBeforeOrgName"></span>
                </td>
                <th>职位</th>
                <td>
                  <span v-text="form.changeBeforePostName"></span>
                </td>
                <th>异动生效时间</th>
                <td>
                  <el-date-picker
                    v-model="form.changeUseDate"
                    value-format="yyyy-MM-dd"
                    format="yyyy 年 MM 月 dd 日"
                    type="date"
                  />
                </td>
              </tr>

              <tr>
                <th>
                  异动类型
                </th>
                <td colspan="7">
                  <el-radio-group v-model="form.changeType">
                    <el-radio
                      v-for="item in turnType"
                      :key="item.attrValue"
                      :label="item.attrValue"
                    >{{ item.attrName }}</el-radio>
                  </el-radio-group>
                </td>
              </tr>
              <tr>
                <th>
                  异动前职位
                </th>
                <td>
                  <span v-text="form.changeBeforePostName"></span>
                </td>
                <th>
                  异动后职位
                </th>
                <td>
                  <el-select v-model="form.changePostId" placeholder="">
                    <el-option
                      v-for="item in postData"
                      :key="item.postId"
                      :label="item.postName"
                      :value="item.postId"
                    />
                  </el-select>
                </td>
                <th>
                  考核期
                </th>
                <td colspan="3">
                  <el-row :gutter="10">
                    <el-col :span="11">
                      <el-date-picker
                        v-model="form.checkStart"
                        value-format="yyyy-MM-dd"
                        format="yyyy 年 MM 月 dd 日"
                        type="date"
                      />
                    </el-col>
                    <el-col :span="2">
                      <div>
                        至
                      </div>
                    </el-col>
                    <el-col :span="11">
                      <el-date-picker
                        v-model="form.checkEnd"
                        value-format="yyyy-MM-dd"
                        format="yyyy 年 MM 月 dd 日"
                        type="date"
                      />
                    </el-col>
                  </el-row>
                </td>
              </tr>
              <tr>
                <th>
                  异动原因
                </th>
                <td colspan="7">
                  <el-input
                    v-model="form.changeExplain"
                    type="textarea"
                    autosize
                  />
                </td>
              </tr>
            </table>
          </el-form>
          <el-form v-else ref="eForm" :model="form">
            <table
              align="center"
              cellspacing="0"
              border="1"
              style="width: 100%; table-layout: fixed"
            >
              <tr>
                <th>员工姓名</th>
                <td>
                   <el-autocomplete
                    v-model="form.employeeName"
                    placeholder="请输入内容"
                    :fetch-suggestions="querySearchAsync"
                    @select="handleSelect"
                  />
                </td>
                <th>入职时间</th>
                <td>
                  <span v-text="form.entryDate"></span>
                </td>
                <th>司龄</th>
                <td>
                  <span v-text="form.seniority" />
                </td>
                <th>异动时间</th>
                <td>
                  <el-date-picker
                    v-model="form.changeDate"
                    value-format="yyyy-MM-dd"
                    format="yyyy 年 MM 月 dd 日"
                    type="date"
                  />
                </td>
              </tr>

              <tr>
                <th>
                  异动类型
                </th>
                <td colspan="7">
                  <el-radio-group v-model="form.changeType">
                    <el-radio
                      v-for="item in turnType"
                      :key="item.attrValue"
                      :label="item.attrValue"
                    >{{ item.attrName }}</el-radio>
                  </el-radio-group>
                </td>
              </tr>
              <tr>
                <td colspan="8" class="text-left td-title">
                  异动前公司信息
                </td>
              </tr>
              <tr>
                <th colspan="3" class="text-left">
                  公司
                </th>
                <th colspan="3" class="text-left">
                  部门
                </th>
                <th colspan="2" class="text-left">
                  职位
                </th>
              </tr>
              <tr>
                <td colspan="3" style="line-height: 40px;">
                  <span v-text="form.changeBeforeCompanyName"></span>
                </td>
                <td colspan="3">
                  <span v-text="form.changeBeforeOrgName"></span>
                </td>
                <td colspan="2">
                  <span v-text="form.changeBeforePostName"></span>
                </td>
              </tr>
              <tr>
                <td colspan="8" class="text-left td-title">
                  异动后公司信息
                </td>
              </tr>
              <tr>
                <th colspan="3" class="text-left">
                  公司
                </th>
                <th colspan="3" class="text-left">
                  部门
                </th>
                <th colspan="2" class="text-left">
                  职位
                </th>
              </tr>
              <tr>
                <td colspan="3">
                  <el-cascader
                    v-model="form.changeCompanyId"
                    :options="orgTreeData"
                    :props="orgProps"
                    :show-all-levels="false"
                  />
                </td>
                <td colspan="3">
                  <el-cascader
                    v-model="form.changeOrgId"
                    :options="orgTreeData"
                    :props="orgProps"
                    :show-all-levels="false"
                    @change="getOrg"
                  />
                </td>
                <td colspan="2">
                  <el-select v-model="form.changePostId" placeholder="">
                    <el-option
                      v-for="item in postData"
                      :key="item.postId"
                      :label="item.postName"
                      :value="item.postId"
                    />
                  </el-select>
                </td>
              </tr>
              <tr>
                <th>
                  异动说明
                </th>
                <td colspan="7">
                  <el-input
                    v-model="form.changeExplain"
                    placeholder="异动说明"
                  />
                </td>
              </tr>
            </table>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button> -->
          <el-button type="primary"  @click="dialogVisible = false">退 出</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import tableView from '@/components/vTable.vue'
import { getChange,updataChange,empChange,addChange,delChange } from '@/api/personnel/PersonnelTurnover'
import { selectAllDrop } from '@/api/user'
import { getAttrMenu } from '@/api/attrManage'
import { getPostList } from '@/api/management/postManage'
import { getBayIdManOrg } from '@/api/management/orgManage'
import { perNames } from '@/api/personnel/staff'
let that
export default {
  components: {
    tableView
  },
  data() {
    return {
      query: {
        // 结束异动日期
        changeDateEnd: null,
        // 开始异动日期
        changeDateStart: null,
        // 异动类型（1入职，2转正，3调岗，4离职）
        changeType: null,
        employeeName: null,
        pageNumber: '1',
        pageSize: '10',
        changeDate: null
      },
      changeTempTypeOpt: [
        { id: 0, name: '本公司' },
        { id: 1, name: '跨公司' }
      ],
      // 异动类型
      turnType: [],
      tableData: [],
      dialogVisible: false,
      // 表单
      form: {
        changeTempType: 0
      },
      total: 0,
      postData: [],
      orgProps: {
        label: 'orgName',
        value: 'orgId',
        checkStrictly: true,
        emitPath: false
      },
      orgTreeData: [],
      timeout: null,
      option:true,
      multipleSelection:''
    }
  },
  created() {
    that = this
    that.getData()
    that.getOrg()
  },
  methods: {
    getData() {
      // selectAllDrop({ valueId: 'change_type' })

      // 组织请求参数
      const orgQuery = {
        orgName: null,
        orgShortName: null,
        orgType: 0,
        pageNumber: '1',
        pageSize: '10',
        parentId: null
      }
      const data1 = getAttrMenu({ valueCode: 'change_type' })
      const data2 = getChange(that.query)
      const data3 = getBayIdManOrg(orgQuery)
      Promise.all([data1, data2, data3]).then(res => {
        console.log(res)
        that.turnType = res[0].data[0].change_type.option
        that.tableData = res[1].data.records
        that.total = res[1].data.total
        // 岗位
        that.orgTreeData = res[2].data
      })
    },
    // 查询
    rawQuery() {
      that.getData()
    },
    // 重置
    runReset() {
      that.query = {
        changeDateEnd: null,
        changeDateStart: null,
        changeType: null,
        employeeName: null,
        pageNumber: '1',
        changeDate: null,
        pageSize: '10'
      }
      that.total = 0
      that.getData()
    },
    getButton() {},
    getOneInfo(e) {
      that.form=e;
      that.option=false;
      that.dialogVisible = true
    },
    handleCurrentChange(e) {
      that.query.pageNumber=e;
      that.getData();
    },
    handleSizeChange(e) {
      that.query.pageSize=e;
      that.getData();
    },
    dataPicker(e) {
      that.query.changeDateStart = e[0]
      that.query.changeDateEnd = e[1]
    },
    // 增加异动
    addTur() {
      that.form = {
        changeTempType: 0
      }
      that.option=true;
      that.dialogVisible = true
    },
    // 获取选择的组织
    getOrg() {
      // 岗位
      const query = {
        orgId: null,
        pageNumber: '1',
        pageSize: '10',
        postCode: null,
        postName: null
      }
      getPostList(query).then(res => {
        that.postData = res.data
      })
    },
    // 切换模板
    changeType(e) {
      that.form = {
        changeTempType: e
      }
    },
    // 提交
    submit() {
      let data;
      if(that.option){
        data=addChange(that.form);
      }else{
        data=updataChange(that.form)
      }
      data.then(res=>{
        if(res.code === 0){
          that.getData();
          that.$message.success(res.message)
          that.dialogVisible=false;
        }else{
          that.$message.error(res.message)
        }
      })
    },
    // 选择
    handleSelect(item) {
      console.log(item);
      that.form.employeeId = item.employeeId
      that.form.employeeName = item.value
      empChange({empId:item.employeeId})
      .then(res=>{
        if(res.code === 0){
          const { companyName,orgName,postName,company,orgId,postId,seniority,entryDate }=res.data;
          that.$set(that.form, "changeBeforeCompanyName", companyName || '无');
          that.$set(that.form, "changeBeforeOrgName", orgName || '无');
          that.$set(that.form, "changeBeforePostName", postName || '无');
          that.$set(that.form, "changeBeforeCompanyId", company || null);
          that.$set(that.form, "changeBeforeOrgId", orgId);
          that.$set(that.form, "changeBeforePostId", postId);
          that.$set(that.form, "seniority", seniority || 0);
          that.$set(that.form, "entryDate", entryDate || null);
        }
      })
    },

    // 输入建议
    querySearchAsync(queryString, cb) {
      const data = {
        empName: queryString,
        pageNumber: 1,
        pageSize: 20
      }
      const arr = []
      perNames(data).then(res => {
        if (res.data.total > 0) {
          const reList = res.data.records
          reList.forEach(v => {
            const forms = {
              value: v.employeeName,
              employeeId: v.employeeId
            }
            arr.push(forms)
          })
          clearTimeout(that.timeout)
          that.timeout = setTimeout(() => {
            cb(arr)
          }, 1000 * Math.random())
        }
      })
      // console.log(data);
    },
    //多选
    handleSelectionChange(e){
       let arr = "";
      // multipleSelection
      e.forEach((v) => {
        arr += v.changeId + ",";
      });
      that.multipleSelection = arr;
    },
    //删除
    allDel(){
      const changIdList = that.multipleSelection;
      if (changIdList.length<5) {
        that.$message.error("请选择一个职位进行删除");
        return;
      }
      that
        .$confirm("此操作将会删除异动, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          //删除信息
          delChange({ changIdList }).then((res) => {
            if (res.code === 0) {
              that.$message.success(res.message);
              that.getData();
            } else {
              that.$message.error(res.message);
            }
          });
        })
        .catch((err) => {});
    }
  }
}
</script>

<style lang="scss">
.tur-main {
  .tur-title {
    margin-bottom: 15px;
  }
  .active {
    color: Blue;
    cursor: pointer;
  }
  .el-form {
    table {
      border-collapse: collapse;
      word-wrap: break-word;
      word-break: break-all;
      border: none;
      th {
        text-align: right;
        padding-right: 5px;
        background-color: #f8f9fe;
        font-size: 14px;
        text-shadow: 0 1px 1px #e8ebee;
        line-height: 40px;
        max-width: 130px;
        min-width: 100px;
        border: 1px solid #ccc;
      }
      .text-left {
        text-align: left;
      }
      .td-title {
        line-height: 36px;
        font-weight: bold;
      }
      td {
        border: 1px solid #ccc;
        min-width: 130px !important;
        padding: 0 5px;
        .el-input.is-disabled .el-input__inner {
          box-shadow: none;
          background: transparent;
          cursor: text;
          border-color: transparent;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #111;
          overflow: hidden;
        }
        .el-textarea.is-disabled .el-textarea__inner {
          background-color: #fff;
          border: none;
          color: #000;
          padding: 0;
          cursor: text;
          resize: none;
        }
        .el-input__inner {
          padding: 0;
        }
        .el-date-editor.el-input,
        .el-date-editor.el-input__inner {
          width: 100% !important;
        }
        .el-icon-date:before {
          content: '';
        }
        .el-input.is-disabled .el-input__icon {
          display: none;
        }
      }
    }
  }
  .el-input.is-disabled .el-input__inner {
    box-shadow: none;
    background: transparent;
    cursor: text;
    border-color: transparent;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #111;
    overflow: hidden;
  }
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff;
    border: none;
    color: #000;
    padding: 0;
    cursor: text;
    resize: none;
  }

  .el-icon-date:before {
    content: '';
  }
  .el-input.is-disabled .el-input__icon {
    display: none;
  }
}
</style>
