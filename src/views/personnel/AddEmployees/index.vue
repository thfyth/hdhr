<template>
  <!-- 新增员工 -->
  <div class="main addStaff">
    <el-form ref="form" :model="form" label-width="160px">
      <table
        align="center"
        cellspacing="0"
        border="1"
        style="width: 80%; table-layout: fixed; margin: 0"
      >
        <tr>
          <div class="title">
            <span class="title-header">个人基本信息</span>
          </div>
        </tr>
        <tr>
          <th class="required">员工姓名</th>
          <td>
            <el-input v-model="form.employeeName"></el-input>
          </td>
          <th class="required">年龄</th>
          <td>
            <el-input v-model="form.age"></el-input>
          </td>
          <th class="required">性别</th>
          <td>
            <el-select v-model="form.sex" placeholder="性别">
              <el-option
                v-for="item in sexOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </td>
          <th rowspan="3">用户头像</th>
          <td rowspan="3" class="photo">
            <el-upload
              action="http://39.98.171.233:9004/api/employee/file/uploadFile"
              :show-file-list="false"
              :on-success="handleImgUrl"
              :data="uploadData"
              name="files"
              :headers="headersData"
            >
              <img v-if="imgFolat" :src="form.photo || photo" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </td>
        </tr>
        <tr>
          <th class="required">证件类型</th>
          <td>
            <el-select
              v-model="form.idType"
              placeholder="证件类型"
              ref="selection"
            >
              <el-option
                v-for="item in idOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </td>
          <th class="required">证件号码</th>
          <td>
            <el-input v-model="form.idNo"></el-input>
          </td>
          <th>生肖</th>
          <td>
            <el-select v-model="form.zodiacSign" placeholder="生肖">
              <el-option
                v-for="item in zodiacSignOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <th class="required">手机号码</th>
          <td>
            <el-input v-model="form.mobile"></el-input>
          </td>
          <th>最高学位</th>
          <td>
            <el-select v-model="form.degree" placeholder="最高学位">
              <el-option
                v-for="item in degreeOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </td>
          <th class="required">合同年限</th>
          <td>
            <el-input v-model="form.contractLife"></el-input>
          </td>
        </tr>
        <tr>
          <th>最高学历</th>
          <td>
            <el-select v-model="form.education" placeholder="最高学历">
              <el-option
                v-for="item in educationOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </td>
          <th>毕业专业</th>
          <td>
            <el-input v-model="form.major"></el-input>
          </td>
          <th class="required">出生日期</th>
          <td>
            <el-date-picker
              style="width: 100%"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="出生日期"
              v-model="form.birthday"
            ></el-date-picker>
          </td>
          <th>现居住地</th>
          <td>
            <el-input v-model="form.currentAddress"></el-input>
          </td>
        </tr>
        <tr>
          <th>国家</th>
          <td>
            <el-input v-model="form.natives"></el-input>
          </td>
          <th>民族</th>
          <td>
            <el-select v-model="form.nation" placeholder="民族">
              <el-option
                v-for="item in nationOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </td>
          <th>星座</th>
          <td>
            <el-select v-model="form.constellation" placeholder="星座">
              <el-option
                v-for="item in constellationOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </td>
          <th>户籍所在地</th>
          <td>
            <el-input v-model="form.censusAddress"></el-input>
          </td>
        </tr>
        <tr>
          <th>籍贯</th>
          <td>
            <el-input v-model="form.nativePlace"></el-input>
          </td>
          <th>工作技能</th>
          <td>
            <el-input v-model="form.skillContent"></el-input>
          </td>
          <th>生育情况</th>
          <td>
            <el-select v-model="form.fertilityType" placeholder="生育情况">
              <el-option
                v-for="item in fertilityOption"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </td>
          <th>血型</th>
          <td>
            <el-input v-model="form.bloodType"></el-input>
          </td>
        </tr>
        <tr>
          <th>微信号</th>
          <td>
            <el-input v-model="form.vxid"></el-input>
          </td>
          <th>健康状况</th>
          <td>
            <el-input v-model="form.healthType"></el-input>
          </td>
          <th>首次工作时间</th>
          <td>
            <el-date-picker
              style="width: 100%"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="出生日期"
              v-model="form.workDateOne"
            ></el-date-picker>
          </td>
          <th>技术职称</th>
          <td>
            <el-input v-model="form.technical"></el-input>
          </td>
        </tr>
        <tr>
          <th>自我介绍</th>
          <td>
            <el-input v-model="form.introduce"></el-input>
          </td>
          <th>毕业院校</th>
          <td>
            <el-input v-model="form.school"></el-input>
          </td>
          <th>邮箱</th>
          <td>
            <el-input v-model="form.email"></el-input>
          </td>
          <th>婚姻状况</th>
          <td>
            <el-select v-model="form.marriage" placeholder="婚姻状况">
              <el-option
                v-for="item in marOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <!-- <th>所属公司</th>
          <td>
            <el-cascader
              v-model="form.company"
              :options="orgTreeData"
              :props="orgProps"
              :show-all-levels="false"
            ></el-cascader>
          </td> -->
          <th>成本划分中心</th>
          <td colspan="7">
            <el-cascader
              v-model="form.costCenter"
              :options="orgTreeData"
              :props="orgProps"
              :show-all-levels="false"
            ></el-cascader>
          </td>
        </tr>
        <tr>
          <th>备注</th>
          <td colspan="7">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </td>
        </tr>
        <tr>
          <div class="title">
            <span class="title-header">在职信息</span>
          </div>
        </tr>
        <tr>
          <th>司龄</th>
          <td>
            <el-input v-model="form.seniority"></el-input>
          </td>
          <th>企业邮箱</th>
          <td>
            <el-input v-model="form.firmEmail"></el-input>
          </td>
          <th class="required">工龄</th>
          <td>
            <el-input v-model="form.workingYears"></el-input>
          </td>
          <th>司龄开始日期</th>
          <td>
            <el-date-picker
              type="date"
              style="width: 100%"
              placeholder="司龄开始日期"
              v-model="form.seniorityBeginDate"
            ></el-date-picker>
          </td>
        </tr>

        <tr>
          <th>合同签署公司</th>
          <td>
            <el-input v-model="form.contractCompany"></el-input>
          </td>
          <th>第几次签订合同</th>
          <td>
            <el-input v-model="form.contractHow"></el-input>
          </td>
          <th>连续第几次签订合同</th>
          <td>
            <el-input v-model="form.contractContinuous"></el-input>
          </td>
          <th class="required">入职日期</th>
          <td>
            <el-date-picker
              type="date"
              style="width: 100%"
              placeholder="入职日期"
              v-model="form.entryDate"
            ></el-date-picker>
          </td>
        </tr>
        <tr>
          <th class="required">员工类型</th>
          <td>
            <el-select v-model="form.employeeType" placeholder="员工类型">
              <el-option
                v-for="item in employeeOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </td>
          <th class="required">用工方式</th>
          <td>
            <el-select v-model="form.employmentModule" placeholder="用工方式">
              <el-option
                v-for="item in employmentOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </td>
          <th class="required">合同到期日期</th>
          <td>
            <el-date-picker
              type="date"
              style="width: 100%"
              placeholder="合同到期日期"
              v-model="form.contractEnd"
            ></el-date-picker>
          </td>
          <th class="required">最近一次签合同日期</th>
          <td>
            <el-date-picker
              type="date"
              style="width: 100%"
              placeholder="最近一次签合同日期"
              v-model="form.contractRecently"
            ></el-date-picker>
          </td>
        </tr>
        <tr>
          <th>特长</th>
          <td>
            <el-input v-model="form.strong"></el-input>
          </td>
          <th>工作地点</th>
          <td>
            <el-input v-model="form.workplace"></el-input>
          </td>
          <th>是否有试用期</th>
          <td>
            <el-select v-model="form.isPeriod" placeholder="是否有试用期">
              <el-option
                v-for="item in isPeriodOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </td>
          <th>开始工作日期</th>
          <td>
            <el-date-picker
              type="date"
              style="width: 100%"
              placeholder="开始工作日期"
              v-model="form.startWorkDate"
            ></el-date-picker>
          </td>
        </tr>
        <tr>
          <th>工时类型</th>
          <td>
            <el-select v-model="form.workingType" placeholder="工时类型">
              <el-option
                v-for="item in workingOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              ></el-option>
            </el-select>
          </td>
          <th>实际转正日期</th>
          <td>
            <el-date-picker
              type="date"
              style="width: 100%"
              placeholder="实际转正日期"
              v-model="form.realityBecome"
            ></el-date-picker>
          </td>
          <th>拟转正日期</th>
          <td>
            <el-date-picker
              type="date"
              style="width: 100%"
              placeholder="拟转正日期"
              v-model="form.planBecome"
            ></el-date-picker>
          </td>
          <th>办公室座机</th>
          <td>
            <el-input v-model="form.officePhone"></el-input>
          </td>
        </tr>
        <tr>
          <div class="title">
            <span class="title-header">岗位</span>
            <span class="font" @click="addList">增 加</span>
          </div>
        </tr>
        <tr v-for="(items, index) in form.postList" :key="items.index">
          <th>组织</th>
          <td>
            <el-cascader
              v-model="items.orgId"
              :options="orgTreeData"
              :props="orgProps"
              @change="hindleChanged(items)"
              :show-all-levels="false"
              clearable
            ></el-cascader>
          </td>
          <th>岗位</th>
          <td>
            <el-select
              @change="getPostId(items.postId)"
              v-model="items.postId"
              placeholder="请选择组织"
            >
              <el-option
                v-for="item in postOptions"
                :key="item.postId"
                :label="item.postName"
                :value="item.postId"
              ></el-option>
            </el-select>
          </td>
          <th>职级</th>
          <td>
            <el-select v-model="items.rankId" placeholder="请选择组织">
              <el-option
                v-for="item in rankOptions"
                :key="item.rankId"
                :label="item.rankName"
                :value="item.rankId"
              ></el-option>
            </el-select>
          </td>
          <th>操作</th>
          <td>
            <el-button
              v-if="index > 0"
              @click.native.prevent="deleteRow(index)"
              type="text"
              >移除</el-button
            >
          </td>
        </tr>
      </table>

     
      <p style="height: 100px"></p>
      <div class="footer">
        <el-form-item>
          <!-- <el-button type="primary" @click="test">测试</el-button> -->
          <el-button type="primary" @click="onSubmit">保存信息</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
  <!--   
    
createBy (string, optional): 创建人 ,
org_id (string, optional): 所属组织id ,
org_id_all (string, optional): 所有上级id逗号拼接字符串 ,
photo (string, optional): 员工照片 ,
updateBy (string, optional): 更新人 ,
updateDate (string, optional): 更新时间 ,
  -->
</template>

<script>
import { getAttrMenu } from "@/api/attrManage";
import { getToken } from "@/utils/auth";
import { selectAllDrop } from "@/api/user";
import { getBayIdManOrg } from "@/api/management/orgManage";
import {
  addOneEmployees,
  updateEmployees,
  getIdEmployees,
  getOrg,
  getPost,
  getRank,
} from "@/api/personnel/staff";

export default {
  data() {
    return {
      query: {},
      form: {
        postList: [],
      },
      photo: require("@/assets/icon/noimg.png"),
      rankOptions: [],
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
      headersData: {
        Authorization: "Bearer " + getToken(),
      },
      uploadData: {
        employeeId: "",
        purpose: 1,
        actId: "employeeId",
      },
      //组织请求参数
      orgQuery: {
        orgName: null,
        orgShortName: null,
        orgType: 0,
        pageNumber: "1",
        pageSize: "10",
        parentId: null,
      },
      postOptions: [],
      orgProps: {
        label: "orgName",
        value: "orgId",
        emitPath: false,
        checkStrictly:true,
      },
      dialogImageUrl: "",
      dialogVisible: false,
      imgFolat: false,
      //操作判断
      //如果为false则为新增，否则为修改
      operation: false,
      orgTreeData: [],
      //岗位请求参数
      postQuery: {
        orgId: null,
        pageNumber: "1",
        pageSize: "10",
        postCode: null,
        postName: null,
      },
      marOptions: [],
      fertilityOption: [],
    };
  },
  // org_type	组织类型
  // menu_type	菜单类型
  created() {
    this.getById();
    // this.getComData();
    this.getOption();
    this.getInfo();
  },
  methods: {
    // 获取组织信息
    getById() {
      const that = this;
      const { orgId, parentIdAll } = that.$route.params;
      if (orgId == "null" && parentIdAll == "null") {
        this.$router.push({
          path: "/personnel/staffInfo/staffManage",
          replace: true,
        });
        return;
      }
      this.form.orgId = orgId;
      if (parentIdAll != "null") {
        this.form.orgIdAll = parentIdAll;
      }
    },
    //新增员工
    onSubmit() {
      const that = this;
      let action = null;
      if (that.operation) {
        action = updateEmployees(form);
      } else {
        const { postList } = that.form;
        if (postList.length > 0) {
          postList.forEach((v) => {
            const orgId = v.orgId;
            let orgIdAll = "";
            if (orgId instanceof Array) {
              orgId.forEach((s) => {
                orgIdAll = orgIdAll + s + ",";
              });
              v.orgIdAll = orgIdAll;
              v.orgId = v.orgId.slice(-1)[0];
            }
          });
        }
        action = addOneEmployees(that.form);
      }
      action.then((res) => {
        if (res.code === 0) {
          that.$message.success(res.message);
          that.$router.go(-1); //返回上一层
        } else {
          that.$message.error(res.message);
        }
      });
    },
    getOption() {
      const that = this;
      selectAllDrop().then((res) => {
        // console.log(res);
        if (res.code === 0) {
          that.optios = res.data;
          //员工类型
          const employmentType = that.getOpt(res.data, "employment_type");
          that.employeeOptions = employmentType.employment_type.option;
          //用工方式
          const employmentModule = that.getOpt(res.data, "employment_module");
          that.employmentOptions = employmentModule.employment_module.option;
          //学位
          const degree = that.getOpt(res.data, "degree");
          that.degreeOptions = degree.degree.option;
          //性别
          const sex = that.getOpt(res.data, "sex");
          that.sexOptions = sex.sex.option;
          //查询学历，文化程度
          const education = that.getOpt(res.data, "education");
          that.educationOptions = education.education.option;
          //民族
          const nation = that.getOpt(res.data, "nation");
          that.nationOptions = nation.nation.option;
          //星座
          const constellation = that.getOpt(res.data, "constellation");
          that.constellationOptions = constellation.constellation.option;
          //政治面貌
          const politics = that.getOpt(res.data, "politics");
          that.politicsOptions = politics.politics.option;
          //户籍性质
          const registerType = that.getOpt(res.data, "register_type");
          that.registerOptions = registerType.register_type.option;
          //工时类型
          const workingType = that.getOpt(res.data, "working_type");
          that.workingOptions = workingType.working_type.option;
          //是否有试用期
          const isPeriod = that.getOpt(res.data, "is_period");
          that.isPeriodOptions = isPeriod.is_period.option;
          //生肖
          const zodiacSign = that.getOpt(res.data, "zodiac_sign");
          that.zodiacSignOptions = zodiacSign.zodiac_sign.option;
          //查询学习形式
          const studyType = that.getOpt(res.data, "study_type");
          that.studyTypeOptions = studyType.study_type.option;
          //查询与本人关系
          const relation = that.getOpt(res.data, "relation");
          that.relationOption = relation.relation.option;
          //职称获得方式
          const getWay = that.getOpt(res.data, "title_get_way");
          that.titleOption = getWay.title_get_way.option;
          //职称级别
          const titleLevel = that.getOpt(res.data, "title_level");
          that.titleLevelOption = titleLevel.title_level.option;
          //证书类型
          const ccieType = that.getOpt(res.data, "ccie_type");
          that.ccieTypeOption = ccieType.ccie_type.option;
          //公司规模
          const companyScale = that.getOpt(res.data, "company_scale");
          that.companyScaleOption = companyScale.company_scale.option;
          //同部门人数
          const deptNo = that.getOpt(res.data, "dept_no");
          that.deptNoOption = deptNo.dept_no.option;
          //离职原因
          const dimCause = that.getOpt(res.data, "dim_cause");
          that.dimCauseOption = dimCause.dim_cause.option;
          //生育情况
          const fertilityType = that.getOpt(res.data, "fertility_type");
          that.fertilityOption = fertilityType.fertility_type.option;

          //异动情况
          const changeType = that.getOpt(res.data, "change_type");
          that.changeOption = changeType.change_type.option;
          //证件类型
          const idType = that.getOpt(res.data, "id_type");
          that.idOptions = idType.id_type.option;
          //婚姻
          const marriage = that.getOpt(res.data, "marriage");
          that.marOptions = marriage.marriage.option;
        }
      });
    },
    getOpt(data, str) {
      let retData;
      data.forEach((v) => {
        if (v.hasOwnProperty(str)) {
          retData = v;
          return false;
        }
      });
      return retData;
    },
    //通过数据字典ValueCode查询属性值下拉框
    getComData() {
      const that = this;
      //获取组织
      const org = getOrg(this.orgQuery);
      //所有请求
      Promise.all([org]).then((res) => {
        that.orgTreeData = res[0].data;
      });
    },
    //获取岗位
    getPostData(orgId) {
      const that = this;
      getPost({ orgId }).then((res) => {
        if (res.code === 0) {
          that.postOptions = res.data.data;
        }
      });
    },
    getPostId(postId) {
      this.getRankData(postId);
    },
    //获取职级
    getRankData(postId) {
      getRank({ postId }).then((res) => (this.rankOptions = res.data.data));
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleImgUrl(file, fileList) {
      console.log(file);
      if (file.code === 0) {
        this.form.photo = file.data.nginxPath + file.data.pathList[0];
        this.imgFolat = true;
        console.log(this.form.photo);
      } else {
        this.$message.error("图片上传失败");
      }
    },
    test() {
      console.log(this.form);
    },
    hindleChanged(e) {
      const { orgId } = e;
      console.log(e);
      // this.orgName = orgName;
      this.getPostData(orgId);
    },
    deleteRow(index) {
      this.form.postList.splice(index, 1);
    },
    // 增加岗位与职位
    addList() {
      if (!this.form.postList) {
        this.form.postList = [];
      }
      const data = {
        orgId: null,
        postId: null,
        rankId: null,
      };
      this.form.postList.push(data);
      this.$set(this.form);
    },
    getInfo() {
      const org = getBayIdManOrg(this.orgQuery);
      const post = getPost(this.postQuery);
      const rank = getRank(this.rankQuery);
      // const tree = findOrgTree();
      Promise.all([org, rank, post]).then(
        (res) => (
          console.log(res),
          (this.orgTreeData = res[0].data),
          (this.rankOptions = res[1].data.data),
          (this.postOptions = res[2].data.data)
          // (this.treeData = res[3].data.data)
        )
      );
    },
  },
};
</script>

<style lang='scss'>
.uploadAv {
  display: flex;
}
.uploadAv > div {
  margin: 0 auto;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.required:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 115px;
  height: 115px;
  line-height: 115px;
  text-align: center;
  border: 1px solid #ccc;
}
.avatar {
  width: 115px;
  height: 115px;
  display: block;
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
        padding-left: 10px;
      }
      .el-input__inner {
        padding: 0;
        padding-left: 10px;
      }
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 100% !important;
      }
      .el-icon-date:before {
        content: "";
      }
      .el-input.is-disabled .el-input__icon {
        display: none;
      }
    }
    .photo {
      text-align: center;
    }
  }
}
.addStaff {
  .title {
    padding: 10px 0;
    .font {
      color: blue;
      font-size: 14px;
      padding: 0 5px;
    }
    .title-header {
      padding: 4px 5px;
      font-size: 16px;
      background: #fff7db;
    }
  }
  .botton-box-row .el-col {
    height: 40px;
    line-height: 40px;
  }
  .el-col-box .el-col {
    height: 40px;
    line-height: 40px;
  }
  .el-row .el-form-item {
    .el-form-item__label {
      height: 40px;
      line-height: 40px;
    }
    .el-form-item__content {
      height: 40px;
      line-height: 40px;
      padding-left: 5px;
    }
    .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
  }
  .footer {
    position: fixed;
    bottom: 20px;
    right: 50px;
    text-align: right;
  }
  .avatar-uploader-icon{
    width: 50px;
    border: none;
  }
}
</style>