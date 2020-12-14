<template>
  <div class="main contract-box">
    <div class="title">
      <div>签署合同 || {{ employeeName }}</div>
    </div>
    <div class="main-box">
      <div class="form-box">
        <el-form :model="form" style="width: 1000px" label-width="100px">
          <div class="title-box">
            <span class="title-header">个人基本信息</span>
            <div style="display: inline-block" v-if="!optionsType">
              <span class="font" v-if="userOption" @click="getStaffInfo"
                >取 消</span
              >
              <span class="font" v-if="userOption" @click="updataStaff"
                >保 存</span
              >
              <span class="font" v-else @click="setStaffInfo">编 辑</span>
            </div>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同编码" required>
                <el-input
                  v-model="form.contractCode"
                  :disabled="!optionsType"
                ></el-input>
                <!-- <span v-else>{{ form.contractCode }}</span> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同名称" required>
                <el-input
                  v-model="form.contractName"
                  :disabled="!userOption"
                ></el-input>
                <!-- <span v-else>{{ form.contractName }}</span> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="用人方式" required>
                <el-select
                  :disabled="!userOption"
                  v-model="form.employType"
                  placeholder="用人方式"
                >
                  <el-option
                    v-for="item in employTypeOptions"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工作地点" required>
                <el-cascader
                  :disabled="!userOption"
                  :options="options"
                  v-model="address"
                  @change="addressChange"
                >
                </el-cascader>
                <!-- <span v-else>{{ form.contractAddress }}</span> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="工时类型" required>
                <el-select
                  v-model="form.workingType"
                  :disabled="!userOption"
                  placeholder="工时类型"
                >
                  <el-option
                    v-for="item in workOptions"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用工方式" required>
                <el-select
                  v-model="form.employmentModule"
                  :disabled="!userOption"
                  placeholder="用工方式"
                >
                  <el-option
                    v-for="item in employOptions"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同有效期" required>
                <div class="list">
                  <el-date-picker
                    value-format="yyyy-MM-dd"
                    type="date"
                    :disabled="!userOption"
                    placeholder="合同有效期(起):"
                    v-model="form.validityBegin"
                  ></el-date-picker>
                  至
                  <el-date-picker
                    value-format="yyyy-MM-dd"
                    type="date"
                    :disabled="!userOption"
                    placeholder="合同有效期(止):"
                    v-model="form.validityEnd"
                  ></el-date-picker>
                </div>

                <!-- <span v-else
                  >{{ form.validityBegin }}---{{ form.validityBegin }}</span
                > -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="试用期" required>
                <div class="list">
                  <el-select
                    v-model="form.isPeriod"
                    style="width: 250px"
                    :disabled="!userOption"
                    placeholder="试用期"
                  >
                    <el-option
                      v-for="item in isPeriodOptions"
                      :key="item.attrValue"
                      :label="item.attrName"
                      :value="item.attrValue"
                    ></el-option>
                  </el-select>
                  <el-date-picker
                    value-format="yyyy-MM-dd"
                    type="date"
                    :disabled="!userOption"
                    placeholder="试用期(起):"
                    v-model="form.probationBegin"
                  ></el-date-picker>
                  至
                  <el-date-picker
                    value-format="yyyy-MM-dd"
                    type="date"
                    :disabled="!userOption"
                    placeholder="试用期(止):"
                    v-model="form.probationEnd"
                  ></el-date-picker>
                </div>

                <!-- <span v-else
                  >:{{
                    form.probationBegin
                  }}---{{ form.probationEnd }}</span
                > -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同备注">
                <el-input
                  :disabled="!userOption"
                  v-model="form.contractDesc"
                ></el-input>
                <!-- <span v-else>{{ form.contractDesc }}</span> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="签署日期" required>
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  :disabled="!userOption"
                  type="date"
                  placeholder="签署日期:"
                  v-model="form.signDate"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <span class="title-header">签约主体</span>
          <el-row>
            <el-col :span="12">
              <div class="subject">
                <div>甲方</div>
                <el-form-item label="公司名:">
                  <el-input
                    v-if="optionsType"
                    v-model="form.firstCompany"
                  ></el-input>
                  <span v-else>{{ form.firstCompany }}</span>
                </el-form-item>
                <el-form-item label="公司地址:">
                  <el-input
                    v-if="optionsType"
                    v-model="form.firstCompanyAddress"
                  ></el-input>
                  <span v-else>{{ form.firstCompanyAddress }}</span>
                </el-form-item>
                <el-form-item label="法定代表人:">
                  <el-input
                    v-if="optionsType"
                    v-model="form.firstName"
                  ></el-input>
                  <span v-else>{{ form.firstName }}</span>
                </el-form-item>
                <el-form-item label="联系电话:">
                  <el-input
                    v-if="optionsType"
                    v-model="form.firstPhone"
                  ></el-input>
                  <span v-else>{{ form.firstPhone }}</span>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="subject">
                <div>乙方</div>
                <el-form-item label="姓名:">
                  <el-input
                    v-if="optionsType"
                    v-model="form.secondName"
                  ></el-input>
                  <span v-else>{{ form.secondName }}</span>
                </el-form-item>
                <el-form-item label="现居地:">
                  <el-input
                    v-if="optionsType"
                    v-model="form.secondAddress"
                  ></el-input>
                  <span v-else>{{ form.secondAddress }}</span>
                </el-form-item>
                <el-form-item label="身份证:">
                  <el-input
                    v-if="optionsType"
                    v-model="form.secondNo"
                  ></el-input>
                  <span v-else>{{ form.secondNo }}</span>
                </el-form-item>
                <el-form-item label="电话:">
                  <el-input
                    v-if="optionsType"
                    v-model="form.secondPhone"
                  ></el-input>
                  <span v-else>{{ form.secondPhone }}</span>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="2">
            <el-col :span="6"
              ><span class="title-header">合同正文</span></el-col
            >
          </el-row>
          <!-- <span class="title-header">合同正文</span> -->
          <el-form-item>
            <!-- <span>contractUrl</span> -->
            <el-upload
              v-if="optionsType"
              action="http://39.98.171.233:9004/api/employee/file/uploadFile"
              :show-file-list="false"
              :on-success="handleUrl"
              :data="uploadData"
              name="files"
              :headers="headersData"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-button v-else type="primary" @click="uploadModel"
              >查看合同</el-button
            >
          </el-form-item>
          <div class="submit-box">
            <el-form-item v-if="optionsType">
              <el-button type="primary" @click="submitContract">提交</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import axios from "axios";
import { getAttrMenu } from "@/api/attrManage";
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
import {
  getContract,
  delContract,
  addContract,
  contractSelect,
  contractTotal,
  updateContract,
  selectCodeContract,
} from "@/api/personnel/contractManage";
import { selectAllDrop } from "@/api/user";
export default {
  data() {
    return {
      form: {},
      employTypeOptions: [],
      workOptions: [],
      employOptions: [],
      isPeriodOptions: [],
      options: regionData,
      address: null,
      //判断是新增还是查看还是修改 true为新增
      optionsType: true,
      uploadData: {
        employeeId: "",
        purpose: 0,
      },
      //判断是修改还是展示
      userOption: false,
      optionsTypes: {},
      headersData: {
        Authorization: "Bearer " + getToken(),
      },
      employeeName: null,
    };
  },
  created() {
    this.getDate();
    this.getOption();
  },
  methods: {
    getDate() {
      const that = this;
      const { employeeId, contractId, employeeName } = that.$route.params;
      that.form.employeeId = employeeId;
      that.employeeName = employeeName;
      if (contractId !== 0) {
        selectCodeContract(contractId).then((res) => {
          // that.getSelectData();
          if (res.code === 0) {
            that.optionsType = false;
            that.form = res.data.contractList[0];
            const { contractAddress } = res.data.contractList[0];
            let strs = contractAddress.split(","); //字符分割
            const code1 = TextToCode[strs[0]].code;
            const code2 = TextToCode[strs[0]][strs[1]].code;
            const code3 = TextToCode[strs[0]][strs[1]][strs[2]].code;
            let arr = [];
            arr.push(code1);
            arr.push(code2);
            arr.push(code3);
            that.address = arr;
          } else {
            that.employeeName = employeeName;
            that.userOption = true;
            // that.$message.error(res.message);
          }
        });
      }
    },
    getOption() {
      const that = this;
      selectAllDrop().then((res) => {
        // console.log(res);
        if (res.code === 0) {
          that.optios = res.data;
          //用工方式
          const employmentModule = that.getOpt(res.data, "employment_module");
          that.employOptions = employmentModule.employment_module.option;
          //工时类型
          const workingType = that.getOpt(res.data, "working_type");
          that.workOptions = workingType.working_type.option;
          //是否有试用期
          const isPeriod = that.getOpt(res.data, "is_period");
          that.isPeriodOptions = isPeriod.is_period.option;
          //是否有试用期
          const employType = that.getOpt(res.data, "employ_type");
          that.employTypeOptions = employType.employ_type.option;
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
    addressChange(e) {
      const address =
        CodeToText[e[0]] + "," + CodeToText[e[1]] + "," + CodeToText[e[2]];
      this.form.contractAddress = address;
    },
    //提交合同
    submitContract() {
      addContract(this.form).then((res) => {
        console.log(res);
      });
    },
    handleUrl(file, fileList) {
      if (file.code === 0) {
        this.form.contractUrl = file.data.nginxPath + file.data.pathList[0];
        // this.imgFolat = true;
      } else {
        this.$message.error("图片上传失败");
      }
    },
    //导出模板
    uploadModel() {
      // alert('不会做');
      const ajax = axios.create({
        timeout: 20000, // 超时时间
      });
      ajax.interceptors.request.use((config) => {
        config.headers["X-Token"] = getToken();
        return config;
      });
      const path = this.form.contractUrl;
      console.log(path);
      ajax({
        type: "get",
        url: "http://39.98.171.233:9004/api/employee/file/downloadFile",
        responseType: "arraybuffer",
        data: {
          path,
        },
      })
        // exportEmployeesModel()
        .then((res) => {
          console.log(res);
          this.saveData(res.data, "人事合同.xlsx");
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
    //编辑员工信息
    setStaffInfo() {
      this.userOption = true;
    },
    getStaffInfo() {
      this.userOption = false;
    },
    updataStaff() {
      const that = this;
      updateContract(that.form).then((res) => {
        if (res.code === 0) {
          that.$message.success(res.message);
          that.getSelectData();
          that.getDate();
          that.userOption = false;
        } else {
          that.$message.error(res.message);
        }
      });
    },
  },
};
</script>

<style lang="scss">
.contract-box {
  .title {
    box-shadow: 0 4px 10px 0 rgba(9, 18, 66, 0.1);
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    padding: 0 15px;
    background: #fff;
    position: relative;
  }
  .main-box {
    padding: 20px 0;
    .title-box {
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
    .submit-box {
      margin: 10px 0;
    }
    .el-select,
    .el-cascader {
      width: 100%;
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
    .el-input.is-disabled .el-input__icon {
      display: none;
    }
    .subject {
      margin: 20px 0;
      span {
        display: inline-block;
        width: 60%;
        border-bottom: 1px solid #ddd;
        padding-left: 10px;
      }
      .el-input__inner {
        width: 60%;
      }
    }
    .list {
      display: flex;
      .el-input {
        width: 100%;
        input {
          width: 100%;
          padding-left: 10px !important;
          padding-right: 20px !important;
        }
      }
      .el-date-editor {
        input {
          padding-left: 30px !important;
        }
      }
    }
    .el-col {
      // height: 30px;
      line-height: 30px;
      // margin: 5px 0;
    }
    .el-form-item {
      margin: 5px 0;
      .el-form-item__label {
        height: 30px;
        line-height: 30px;
      }
      .el-form-item__content {
        height: 30px;
        line-height: 30px;
        padding-left: 5px;
      }
      .el-input__inner {
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
</style>
