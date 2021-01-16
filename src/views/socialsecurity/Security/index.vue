<template>
  <div class="main">
    <el-tabs value="first" @tab-click="handleTabsClick">
      <el-tab-pane label="参保员工" name="first">
        <div class="title-box" style="width: auto">
          <div class="title-list">
            <div class="list-box">
              <span class="title">员工姓名:</span>
              <el-input
                placeholder="请输入姓名"
                v-model="query.employeeName"
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
        </div>
        <div class="table-view">
          <el-table
            :data="tableData"
            height="250"
            border
            style="width: 100%"
            :header-cell-style="{ background: '#F7F8FA', color: '#293B59' }"
            tooltip-effect="dark"
          >
            <el-table-column
              prop="employeeName"
              fixed
              label="员工姓名"
              width="180"
              align="center"
            >
              <template slot-scope="scope">
                <span class="article" @click="getOneData(scope.row)">{{
                  scope.row.employeeName
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="idNo"
              label="身份证号"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="mobile"
              label="手机号"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="socialCode"
              label="社保编号"
              width="180"
            ></el-table-column>
            <el-table-column label="在职状态" width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 2">离职</span>
                <span v-else>在职</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="socialRegistrationType"
              label="社保户籍性性质（农村，城市）"
            ></el-table-column>
            <el-table-column
              prop="socialAddress"
              label="参保地"
            ></el-table-column>
            <el-table-column label="社保是否当地首次参保">
              <template slot-scope="scope">
                <span v-if="scope.row.socialIsFirst == 1">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="socialBeginMonth"
              label="社保起缴月份"
            ></el-table-column>
            <el-table-column
              prop="socialPayBase"
              label="社保缴纳基数"
            ></el-table-column>
            <el-table-column label="社保缴纳方式">
              <template slot-scope="scope">
                <span v-if="scope.row.socialPayWay == 1">自缴</span>
                <span v-else>代缴</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="socialNoPayDesc"
              label="社保未缴纳说明"
            ></el-table-column>
            <el-table-column
              prop="fundCode"
              label="公积金编号"
            ></el-table-column>
            <el-table-column
              prop="fundRegistrationType"
              label="公积金户籍性质"
            ></el-table-column>
            <el-table-column
              prop="fundAddress"
              label="公积金参保地"
            ></el-table-column>
            <el-table-column label="公积金是否当地首次缴纳">
              <template slot-scope="scope">
                <span v-if="scope.row.fundIsFirst == 1">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="fundBeginMonth"
              label="公积金起缴月"
            ></el-table-column>
            <el-table-column
              prop="fundPayBase"
              label="公积金缴纳基数"
            ></el-table-column>
            <el-table-column
              prop="fundPayRate"
              label="缴纳比例"
            ></el-table-column>
            <el-table-column label="公积金缴纳方式">
              <template slot-scope="scope">
                <span v-if="scope.row.fundPayWay == 1">自缴</span>
                <span v-else>代缴</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="fundPayCompany"
              label="缴纳公司名称"
            ></el-table-column>
            <el-table-column
              prop="fundNoPayDesc"
              label="公积金未缴纳说明"
            ></el-table-column>
            <el-table-column prop="mobile" label="手机号"></el-table-column>
            <el-table-column prop="mobile" label="手机号"></el-table-column>
            <el-table-column prop="mobile" label="手机号"></el-table-column>
            <el-table-column label="社保参保状态" width="200" fixed="right">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.socialStatus"
                  :active-value="1"
                  @change="setStatus(scope.row,'socialStatus')"
                  :inactive-value="2"
                  active-color="#13ce66"
                  inactive-text="待参保"
                  class="tablescope"
                  active-text="在保"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="公积金参保状态" width="200" fixed="right">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.fundStatus"
                  :active-value="1"
                  :inactive-value="2"
                  active-color="#13ce66"
                  @change="setStatus(scope.row,'fundStatus')"
                  inactive-text="待参保"
                  class="tablescope"
                  active-text="在保"
                  inactive-color="#ff4949"
                >
                </el-switch>
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
      </el-tab-pane>
      <el-tab-pane label="停保员工" name="second">
        <div class="title-box" style="width: auto">
          <div class="title-list">
            <div class="list-box">
              <span class="title">员工姓名:</span>
              <el-input
                placeholder="请输入姓名"
                v-model="query.employeeName"
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
        </div>
        <div class="table-view">
          <el-table
            :data="tableData"
            height="250"
            border
            style="width: 100%"
            :header-cell-style="{ background: '#F7F8FA', color: '#293B59' }"
            tooltip-effect="dark"
          >
            <el-table-column
              prop="employeeName"
              fixed
              label="员工姓名"
              width="180"
              align="center"
            >
              <template slot-scope="scope">
                <span class="article" @click="getOneData(scope.row)">{{
                  scope.row.employeeName
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="idNo"
              label="身份证号"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="mobile"
              label="手机号"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="socialCode"
              label="社保编号"
              width="180"
            ></el-table-column>
            <el-table-column label="在职状态" width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 2">离职</span>
                <span v-else>在职</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="socialRegistrationType"
              label="社保户籍性性质（农村，城市）"
            ></el-table-column>
            <el-table-column
              prop="socialAddress"
              label="参保地"
            ></el-table-column>
            <el-table-column label="社保是否当地首次参保">
              <template slot-scope="scope">
                <span v-if="scope.row.socialIsFirst == 1">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="socialBeginMonth"
              label="社保起缴月份"
            ></el-table-column>
            <el-table-column
              prop="socialPayBase"
              label="社保缴纳基数"
            ></el-table-column>
            <el-table-column label="社保缴纳方式">
              <template slot-scope="scope">
                <span v-if="scope.row.socialPayWay == 1">自缴</span>
                <span v-else>代缴</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="socialNoPayDesc"
              label="社保未缴纳说明"
            ></el-table-column>
            <el-table-column
              prop="fundCode"
              label="公积金编号"
            ></el-table-column>
            <el-table-column
              prop="fundRegistrationType"
              label="公积金户籍性质"
            ></el-table-column>
            <el-table-column
              prop="fundAddress"
              label="公积金参保地"
            ></el-table-column>
            <el-table-column label="公积金是否当地首次缴纳">
              <template slot-scope="scope">
                <span v-if="scope.row.fundIsFirst == 1">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="fundBeginMonth"
              label="公积金起缴月"
            ></el-table-column>
            <el-table-column
              prop="fundPayBase"
              label="公积金缴纳基数"
            ></el-table-column>
            <el-table-column
              prop="fundPayRate"
              label="缴纳比例"
            ></el-table-column>
            <el-table-column label="公积金缴纳方式">
              <template slot-scope="scope">
                <span v-if="scope.row.fundPayWay == 1">自缴</span>
                <span v-else>代缴</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="fundPayCompany"
              label="缴纳公司名称"
            ></el-table-column>
            <el-table-column
              prop="fundNoPayDesc"
              label="公积金未缴纳说明"
            ></el-table-column>
            <el-table-column
              prop="socialStopDate"
              label="社保停保日期"
            ></el-table-column>
            <el-table-column
              prop="fundStopDate"
              label="公积金停保日期"
            ></el-table-column>
            <el-table-column prop="mobile" label="手机号"></el-table-column>
            <el-table-column prop="mobile" label="手机号"></el-table-column>
            <el-table-column prop="mobile" label="手机号"></el-table-column>
            <el-table-column label="社保停保状态" width="200" fixed="right">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.socialStopStatus"
                  :active-value="1"
                  @change="setStatus(scope.row,'socialStopStatus')"
                  :inactive-value="2"
                  active-color="#13ce66"
                  inactive-text="办理中"
                  class="tablescope"
                  active-text="办理完成"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="公积金停保状态" width="200" fixed="right">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.fundStopStatus"
                  :active-value="1"
                  :inactive-value="2"
                  active-color="#13ce66"
                  inactive-text="办理中"
                  @change="setStatus(scope.row,'fundStopStatus')"
                  class="tablescope"
                  active-text="办理完成"
                  inactive-color="#ff4949"
                >
                </el-switch>
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
      </el-tab-pane>
    </el-tabs>

    <!-- 社保公积金 -->
    <el-dialog title="社保公积金" :visible.sync="editVisible" width="70%">
      <el-form ref="form" :model="form" label-width="180px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="员工姓名:">
              <span v-text="form.employeeName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证号:">
              <span v-text="form.idNo"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号:">
              <el-input v-model="form.mobile"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="在职状态:">
              <span v-text="form.status"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="社保编号:">
              <el-input v-model="form.socialCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="社保户籍性性质:">
              <el-input v-model="form.socialRegistrationType"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="社保参保地:">
              <el-input v-model="form.socialAddress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="社保是否当地首次参保:">
              <el-select
                v-model="form.socialIsFirst"
                placeholder="社保是否当地首次参保"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="社保起缴月份:">
              <el-input v-model="form.socialBeginMonth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="社保缴纳基数:">
              <el-input v-model="form.socialPayBase"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="社保缴纳方式:">
              <el-select v-model="form.socialPayWay" placeholder="社保缴纳方式">
                <el-option
                  v-for="item in companyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="缴纳公司名称:">
              <el-input v-model="form.socialPayCompany"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="社保未缴纳说明:">
              <el-input v-model="form.socialNoPayDesc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公积金编号:">
              <el-input v-model="form.fundCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公积金户籍性质:">
              <el-input v-model="form.fundRegistrationType"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="公积金参保地:">
              <el-input v-model="form.fundAddress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公积金是否当地首次缴纳:">
              <el-select
                v-model="form.fundIsFirst"
                placeholder="公积金是否当地首次缴纳"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公积金起缴月:">
              <el-input v-model="form.fundBeginMonth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="公积金缴纳基数:">
              <el-input v-model="form.fundPayBase"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="缴纳比例:">
              <el-input v-model="form.fundPayRate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公积金缴纳方式:">
              <el-select v-model="form.fundPayWay" placeholder="公积金缴纳方式">
                <el-option
                  v-for="item in companyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="缴纳公司名称:">
              <el-input v-model="form.fundPayCompany"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公积金未缴纳说明:">
              <el-input v-model="form.fundNoPayDesc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { getBayIdSocia, getSocia, updateSocia } from "@/api/socialsecurity";
export default {
  data() {
    return {
      tableData: [],
      //批量删除数组
      multipleSelection: "",
      //请求参数
      query: {
        pageNumber: 1,
        pageSize: 10,
        status: 2,
        employeeName: null,
      },
      total: 0,
      options: [
        { value: 1, label: "是" },
        { value: 2, label: "否" },
      ],
      companyOptions: [
        { value: 1, label: "自缴" },
        { value: 2, label: "代缴" },
      ],
      currentPage: 1,
      tableOption: {},
      //用户设置角色
      userIdList: [],
      roleIdList: [],
      roleChangeList: [],
      editVisible: false,
      form: {},
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //获取所有用户
    getData() {
      const query = this.query;
      getSocia(query).then(
        (res) => (
          (this.tableData = res.data.records), (this.total = res.data.total)
        )
      );
    },

    //根据条件查询
    rawQuery() {
      this.query.pageNumber = 1;
      this.query.pageSize = 10;
      this.getData();
    },
    //重置请求
    runReset() {
      this.query = {
        pageNumber: 1,
        pageSize: 10,
        status: 2,
        employeeName: null,
      };

      this.getData();
      this.currentPage = 1;
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
    //获取一个人信息
    getOneInfo(e) {
      console.log(e);
    },
    getOneData(e) {
      this.form = e;
      this.editVisible = true;
    },
    saveEditChange() {
      const that = this;
      updateSocia(that.form).then((res) => {
        if (res.code === 0) {
          that.$message.success(res.message);
          that.getData();
          that.editVisible = false;
        } else {
          that.$message.error(res.message);
        }
      });
    },
    //切换tab页
    handleTabsClick(e) {
      console.log(e);
    },
    setStatus(e,field){
      //更新用户
      console.log(e);
      let form = {
        id: e.id,
      };
      form[field]=e[field];
      console.log(form);
      updateSocia(form).then((res) => console.log(res.message));
    }
    
  },
};
</script>
<style lang='scss'>
.article {
  color: Blue;
  cursor: pointer;
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