<template>
  <div class="main">
   
    <div class="table-view">
      <el-table :data="tableData" stripe>
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column fixed label="员工名字" width="180">
          <template slot-scope="scope">
            <span
              class="staffName"
              @click="getOneInfo(scope.$index, scope.row)"
              >{{ scope.row.employeeName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="180"></el-table-column>
        <el-table-column prop="mobile" label="手机"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <span v-if="scope.row.sex === 1">男</span>
            <span v-else>女</span>
          </template>
        </el-table-column>
        <el-table-column prop="dimissionDate" label="离职时间"></el-table-column>
        <el-table-column prop="dimCause" label="离职原因"></el-table-column>
        
      </el-table>
    </div>
    <!-- 筛选框 -->
    <el-drawer title="筛选条件" :visible.sync="drawer" ref="drawer">
      <div class="drawer_content">
        <el-form :model="employeeQuery" label-width="80px">
          <el-form-item label="员工姓名">
            <el-input
              v-model="employeeQuery.employeeName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="年龄区间">
            <div class="group">
              <el-input v-model="employeeQuery.age1"></el-input>
              <span class="center-text">到</span>
              <el-input v-model="employeeQuery.age2"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="员工年龄">
            <el-input v-model="employeeQuery.age"></el-input>
          </el-form-item>
          <el-form-item label="出生日期">
            <div class="group">
              <el-date-picker
                v-model="employeeQuery.birthday1"
                value-format="yyyy-MM-dd"
                format="yyyy 年 MM 月 dd 日"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
              <span class="center-text">到</span>
              <el-date-picker
                v-model="employeeQuery.birthday2"
                value-format="yyyy-MM-dd"
                format="yyyy 年 MM 月 dd 日"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="员工类型">
            <el-select
              v-model="employeeQuery.employeeType"
              placeholder="员工类型"
            >
              <el-option
                v-for="item in employeeOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="户籍">
            <el-input v-model="employeeQuery.censusAddress"></el-input>
          </el-form-item>
          <el-form-item label="星座">
            <el-select v-model="employeeQuery.constellation" placeholder="星座">
              <el-option
                v-for="item in constellationOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="现居住地">
            <el-input v-model="employeeQuery.currentAddress"></el-input>
          </el-form-item>
          <el-form-item label="最高学位">
            <el-select v-model="employeeQuery.degree" placeholder="最高学位">
              <el-option
                v-for="item in degreeOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最高学历">
            <el-select v-model="employeeQuery.education" placeholder="最高学历">
              <el-option
                v-for="item in educationOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="离职时间">
            <div class="group">
              <el-date-picker
                v-model="employeeQuery.dimissionDate1"
                value-format="yyyy-MM-dd"
                format="yyyy 年 MM 月 dd 日"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
              <span class="center-text">到</span>
              <el-date-picker
                v-model="employeeQuery.dimissionDate2"
                value-format="yyyy-MM-dd"
                format="yyyy 年 MM 月 dd 日"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="毕业日期">
            <div class="group">
              <el-date-picker
                v-model="employeeQuery.gdDate1"
                value-format="yyyy-MM-dd"
                format="yyyy 年 MM 月 dd 日"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
              <span class="center-text">到</span>
              <el-date-picker
                v-model="employeeQuery.gdDate2"
                value-format="yyyy-MM-dd"
                format="yyyy 年 MM 月 dd 日"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="离职原因">
            <!-- <el-input v-model="form.dimCause"></el-input> -->
            <el-select v-model="employeeQuery.dimCause" placeholder="离职原因">
              <el-option
                v-for="item in dimCauseOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="爱好">
            <el-input v-model="employeeQuery.hobby"></el-input>
          </el-form-item>
          <el-form-item label="证件号码">
            <el-input v-model="employeeQuery.idNo"></el-input>
          </el-form-item>
          <el-form-item label="证件类型">
            <el-select v-model="employeeQuery.idType" placeholder="证件类型">
              <el-option
                v-for="item in idOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="自我介绍">
            <el-input v-model="employeeQuery.introduce"></el-input>
          </el-form-item>
          <el-form-item label="毕业专业">
            <el-input v-model="employeeQuery.major"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="employeeQuery.mobile"></el-input>
          </el-form-item>
          <el-form-item label="民族">
            <el-select v-model="employeeQuery.nation" placeholder="民族">
              <el-option
                v-for="item in nationOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="国家">
            <el-input v-model="employeeQuery.natives"></el-input>
          </el-form-item>
          <el-form-item label="政治面貌">
            <el-select v-model="employeeQuery.politics" placeholder="政治面貌">
              <el-option
                v-for="item in politicsOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职级名称">
            <el-input v-model="employeeQuery.rankName"></el-input>
          </el-form-item>
          <el-form-item label="户籍性质">
            <el-select
              v-model="employeeQuery.registerType"
              placeholder="户籍性质"
            >
              <el-option
                v-for="item in registerOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="employeeQuery.sex" placeholder="性别">
              <el-option
                v-for="item in sexOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生肖">
            <el-select v-model="employeeQuery.zodiacSign" placeholder="生肖">
              <el-option
                v-for="item in zodiacSignOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="毕业院校">
            <el-input v-model="employeeQuery.school"></el-input>
          </el-form-item>
          <el-form-item label="特长">
            <el-input v-model="employeeQuery.strong"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="employeeQuery.remark"></el-input>
          </el-form-item>
          <el-form-item label="组织">
            <!-- <wl-tree-select
              leaf
              checkbox
              :data="orgTreeData"
              nodeKey="orgId"
              @change="hindleChanged"
              v-model="employeeQuery.orgIdList"
              :props="orgProps"
            ></wl-tree-select> -->
            <el-cascader
              v-model="employeeQuery.orgIdList"
              ref="orgIdCascader"
              :options="orgTreeData"
              :props="orgProps"
              :show-all-levels="false"
            ></el-cascader>
            <!-- <el-select v-model="form.region" multiple placeholder="组织">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item label="岗位">
            <el-select
              v-model="employeeQuery.postIdList"
              multiple
              placeholder="岗位"
            >
              <el-option
                v-for="item in postOptions"
                :key="item.postId"
                :label="item.postName"
                :value="item.postId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职级">
            <el-select
              v-model="employeeQuery.rankIdList"
              multiple
              placeholder="职级"
            >
              <el-option
                v-for="item in rankOptions"
                :key="item.rankId"
                :label="item.rankName"
                :value="item.rankId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="searchItem" :loading="loading">{{
            loading ? "提交中 ..." : "确 定"
          }}</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- orgId	string
    组织id-->

    <!-- pageNumber	string
example: 1
当前页

pageSize	string
example: 10
    条数-->

    <!-- postId	string
    岗位id-->

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
</template>


<script>
import tableView from "@/components/vTable.vue";
import {
  delOneEmployees,
  addOneEmployees,
  importEmployees,
  updateEmployees,
  getIdEmployees,
  getEmployeesList,
  exportEmployeesModel,
  test,
  getOrg,
  getPost,
  getRank,
  //查询组织岗位职级
} from "@/api/personnel/staff";
import { getAttrMenu } from "@/api/attrManage";
import { getBayIdManOrg } from "@/api/management/orgManage";
import axios from "axios";
export default {
  data() {
    return {
      fileList: [],
      //合同分类
      contract:{
        labor:true
      },
      //请求员工list参数
      employeeQuery: {
        employeeId: null,
        employeeName: null,
        orgId: null,
        pageNumber: "1",
        pageSize: "10",
        postId: null,
        postIdList: [],
        rankId: null,
        rankIdList: [],
        status:3
      },
      //岗位请求参数
      postQuery: {},
      //职级请求参数
      rankQuery: {},
      //组织请求参数
      orgQuery: {
        orgName: null,
        orgShortName: null,
        orgType: 0,
        pageNumber: "1",
        pageSize: "10",
        parentId: null,
      },
      currentPage: 0,
      total: 0,
      drawer: false,
      // 表格数据
      tableData: [],
      //用户设置角色
      table: false,
      dialog: false,
      loading: false,
      form: {},
      timer: null,
      //员工类型下拉框
      employeeOptions: [],
      // 用工方式下拉框
      employmentOptions: [],
      //最高学历下拉框
      educationOptions: [],
      // 最高学位下拉框
      degreeOptions: [],
      // 证件类型下拉框
      idOptions: [],
      // 国家下拉框
      nativesOptions: [],
      // 民族下拉框
      nationOptions: [],
      // 星座下拉框
      constellationOptions: [],
      //户籍所在地下拉框
      censusAddressOptions: [],
      //政治面貌下拉框
      politicsOptions: [],
      //户籍性质下拉框
      registerOptions: [],
      //性别下拉框
      sexOptions: [],
      //工时类型下拉框
      workingOptions: [],
      //生肖下拉框
      zodiacSignOptions: [],
      //是否有试用期下拉框
      isPeriodOptions: [],
      //离职原因
      dimCauseOptions: [],
      orgTreeData: [],
      orgProps: {
        label: "orgName",
        value: "orgId",
      },
      postOptions: [],
      rankOptions: [],
    };
  },
  components: {
    tableView,
  },
  created() {
    this.geteEployees();
    this.getComData();
    this.getInfo();
  },
  methods: {
    //获取员工list
    geteEployees() {
      const data = getEmployeesList(this.employeeQuery);
      data.then(
        (res) => (
          console.log(res),
          (this.tableData = res.data.records),
          (this.total = res.data.total)
        )
      );
    },
    getInfo() {
      const org = getBayIdManOrg(this.orgQuery);
      const post = getPost(this.postQuery);
      const rank = getRank(this.rankQuery);
      Promise.all([org, rank, post]).then(
        (res) => (
          console.log(res),
          (this.orgTreeData = res[0].data),
          (this.rankOptions = res[1].data.data),
          (this.postOptions = res[2].data.data)
        )
      );
    },
    getComData() {
      const that = this;
      //同部门人数
      const deptNo = getAttrMenu({ valueCode: "dept_no" });
      //与本人关系
      const relation = getAttrMenu({ valueCode: "relation" });
      //性别
      const sex = getAttrMenu({ valueCode: "sex" });
      //查询学历，文化程度
      const education = getAttrMenu({ valueCode: "education" });
      //查询证书类型
      const ccieType = getAttrMenu({ valueCode: "ccie_type" });
      //查询学习形式
      const studyType = getAttrMenu({ valueCode: "study_type" });
      //查询离职原因
      const dimCause = getAttrMenu({ valueCode: "dim_cause" });
      //学位
      const degree = getAttrMenu({ valueCode: "degree" });
      //政治面貌
      const politics = getAttrMenu({ valueCode: "politics" });
      //生肖
      const zodiacSign = getAttrMenu({ valueCode: "zodiac_sign" });
      //星座
      const constellation = getAttrMenu({ valueCode: "constellation" });
      //民族
      const nation = getAttrMenu({ valueCode: "nation" });
      //是否有试用期
      const isPeriod = getAttrMenu({ valueCode: "is_period" });
      //工时类型
      const workingType = getAttrMenu({ valueCode: "working_type" });
      //用工方式
      const employmentModule = getAttrMenu({ valueCode: "employment_module" });
      //员工类型
      const employmentType = getAttrMenu({ valueCode: "employment_type" });
      //户籍性质
      const registerType = getAttrMenu({ valueCode: "register_type" });
      //婚姻状况
      const marriage = getAttrMenu({ valueCode: "marriage" });
      //公司规模
      const companyScale = getAttrMenu({ valueCode: "company_scale" });
      //职称获得方式
      const titleGetWay = getAttrMenu({ valueCode: "title_get_way" });
      //证件类型
      const idType = getAttrMenu({ valueCode: "id_type" });
      //所有请求
      Promise.all([
        sex,
        education,
        degree,
        politics,
        zodiacSign,
        constellation,
        nation,
        employmentType,
        registerType,
        employmentModule,
        idType,
        dimCause,
      ]).then((res) => {
        that.sexOptions = res[0].data;
        that.educationOptions = res[1].data;
        that.degreeOptions = res[2].data;
        that.politicsOptions = res[3].data;
        that.zodiacSignOptions = res[4].data;
        that.constellationOptions = res[5].data;
        that.nationOptions = res[6].data;
        that.employeeOptions = res[7].data;
        that.registerOptions = res[8].data;
        that.employmentOptions = res[9].data;
        that.idOptions = res[10].data;
        that.dimCauseOptions = res[11].data;
      });
    },

    //表格按钮事件
    edit(index, row) {
      const { employeeId } = row;
      this.$router.push({
        path: `/personnel/staffManage/add/${employeeId}`,
      });
    },
    //点击用户名跳转
    getOneInfo(index, row) {
      const { employeeId } = row;
      this.$router.push({
        path: `/personnel/staffInfo/staffOneInfo/${employeeId}`,
      });
    },
    deleteStaff(index, row) {
      const that = this;
      const { employeeId } = row;
      that
        .$confirm("此操作将会删除该员工, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          let idList = employeeId;
          //删除信息
          delOneEmployees({ idList }).then((res) => {
            if (res.code === 0) {
              that.$message.success(res.message);
              that.tableData.splice(index, 1);
            } else {
              that.$message.error(res.message);
            }
          });
        })
        .catch((err) => {});
    },
    //获取表格单个信息
    getOneData() {},
    //多选事件
    getSelectionChange() {},
    addEmp() {
      // this.$router.push({ name: 'addEmployees', params: { employeeId: 0 }})
      this.$router.push({
        path: "/personnel/staffInfo/addEmployees/0",
        
      });
    },
    //关闭筛选
    cancelForm() {
      this.loading = false;
      this.dialog = false;
      clearTimeout(this.timer);
    },
    //导出模板
    uploadModel() {
      // alert('不会做');
      const that=this;
      const ajax = axios.create({
        timeout: 20000, // 超时时间
      });
      ajax.interceptors.request.use((config) => {
        config.headers["Authorization"] = "Bearer "+getToken();
        return config;
      });
      ajax.interceptors.response.use(res=>{
        console.log(res);
      });
      // ajax.post()
      ajax({
        type: "post",
        url: "http://39.98.171.233:9004/api/employee/exportTemplate",
        responseType: "arraybuffer",
      })
        // exportEmployeesModel()
        .then((res) => {
          that.saveData(res.data, "通讯录人员.xlsx");
        })
        .catch((error) => {});
    },
    saveData(data, filename) {
      let blob = new Blob([data], {
        type: "application/vnd.ms-excel;charset=utf-8;",
      });
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display:none";
      a.href = objectUrl;
      a.download = filename;
      a.click();
    },
    handleSuccess(e) {
      console.log(e);
      if (e.code === 0) {
        this.$message.success(e.message);
      } else {
        this.$message.error(e.message);
      }
      this.fileList = [];
    },
    handlePreview(file) {
      console.log(file);
    },
    //分页
    handleSizeChange(e) {
      this.employeeQuery.pageSize = e;
      this.geteEployees();
    },
    handleCurrentChange(e) {
      this.employeeQuery.pageNumber = e;
      this.geteEployees();
    },
    hindleChanged() {},
    //多条件搜索
    searchItem() {
      let list = [];
      const { orgIdList } = this.employeeQuery;
      if (orgIdList) {
        orgIdList.forEach((v) => {
          list.push(v.orgId);
        });
        this.employeeQuery.orgId = list;
      }
      console.log(this.employeeQuery);
      this.geteEployees();
      this.$refs.drawer.closeDrawer();
    },
  },
};
</script>


<style lang="scss">
.el-drawer {
  overflow: scroll;
}
.staffName {
  color: Blue;
  cursor: pointer;
}
.drawer_content {
  padding: 0 50px;
}
.el-form-item {
  .group {
    display: flex;
    .center-text {
      padding: 0 10px;
    }
  }
  .wl-tree-select {
    width: 100%;
  }
  .el-popover {
    min-width: 180px;
  }
}
.drawer_content .demo-drawer__footer {
  text-align: center;
  margin: 50px 0 50px 50px;
}
.contract-box{
  .contract-title{
    background: #fafafa;
    font-size: 14px;
    border-bottom-color: #eee;
    border-radius: 4px 4px 0 0;
    min-height: 30px;
    padding: 4px 16px;
    min-width: 160px;
    text-align: center;
    margin: 0;
    margin-bottom: 20px;
  }
  .contract-submit{
    text-align: right;
    margin: 10px 0;
  }
  .contract-list{
    height: 120px;
  }
}
</style>