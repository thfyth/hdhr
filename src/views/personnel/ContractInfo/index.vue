<template>
  <div class="main contract-box">
    <div class="title">
      <div>签署合同 || 刘德华</div>
    </div>
    <div class="main-box">
      <span class="title-header">个人基本信息</span>
      <div class="form-box">
        <el-form :model="form" style="width: 800px" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同编码">
                <el-input v-model="form.contractCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同名称">
                <el-input v-model="form.contractName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="用人方式">
                <el-select v-model="form.employType" placeholder="用人方式">
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
              <el-form-item label="工作地点">
                <el-cascader
                  :options="options"
                  v-model="address"
                  @change="addressChange"
                >
                </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="工时类型">
                <el-select v-model="form.workingType" placeholder="工时类型">
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
              <el-form-item label="用工方式">
                <el-select
                  v-model="form.employmentModule"
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
          <el-form-item label="合同有效期">
            <div class="list">
              <el-date-picker
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="合同有效期(起):"
                v-model="form.validityBegin"
              ></el-date-picker>
              ---
              <el-date-picker
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="合同有效期(止):"
                v-model="form.validityEnd"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="试用期">
            <div class="list">
              <el-select v-model="form.isPeriod" placeholder="试用期">
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
                placeholder="试用期(起):"
                v-model="form.probationBegin"
              ></el-date-picker>
              <el-date-picker
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="试用期(止):"
                v-model="form.probationEnd"
              ></el-date-picker>
            </div>
          </el-form-item>
          <!-- <el-row>
            <el-col :span="12">
              <el-form-item label="合同分类">
                <el-input v-model="form.contractClass"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同类型">
                <el-input v-model="form.contractType"></el-input>
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="合同备注">
                <el-input v-model="form.contractDesc"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="签署日期">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="签署日期:"
                  v-model="form.signDate"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <span class="title-header">签约主体</span>

          <div class="subject">
            <div>甲方</div>
            <el-form-item label="公司名">
              <el-input v-model="form.firstCompany"></el-input>
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="form.firstCompanyAddress"></el-input>
            </el-form-item>
            <el-form-item label="法定代表人">
              <el-input v-model="form.firstName"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="form.firstPhone"></el-input>
            </el-form-item>
          </div>
          <div class="subject">
            <div>乙方</div>
            <el-form-item label="姓名">
              <el-input v-model="form.secondName"></el-input>
            </el-form-item>
            <el-form-item label="现居地">
              <el-input v-model="form.secondAddress"></el-input>
            </el-form-item>
            <el-form-item label="身份证">
              <el-input v-model="form.secondNo"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="form.secondPhone"></el-input>
            </el-form-item>
          </div>
          <span class="title-header">合同正文</span>
          <el-form-item>
            <!-- <span>contractUrl</span> -->
            <el-upload
              action="http://39.98.171.233:9004/api/employee/file/uploadFile"
              :show-file-list="false"
              :on-success="handleUrl"
              :data="uploadData"
              name="files"
              :headers="headersData"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <div>
            <el-form-item>
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
import { getAttrMenu } from "@/api/attrManage";
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
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
      uploadData: {
        employeeId: "",
        purpose: 0,
      },
      headersData: {
        Authorization: "Bearer " + getToken(),
      },
    };
  },
  created() {
    this.getSelectData();
  },
  methods: {
    //获取下拉框数据
    getSelectData() {
      //用人方式
      const that = this;
      const employType = getAttrMenu({ valueCode: "employ_type" });
      //用工方式
      const employmentModule = getAttrMenu({ valueCode: "employment_module" });
      //工时类型
      const workingType = getAttrMenu({ valueCode: "working_type" });
      //是否有试用期
      const isPeriod = getAttrMenu({ valueCode: "is_period" });
      Promise.all([employType, employmentModule, workingType, isPeriod]).then(
        (res) => {
          console.log(res);
          that.employTypeOptions = res[0].data;
          that.employOptions = res[1].data;
          that.workOptions = res[2].data;
          that.isPeriodOptions = res[3].data;
        }
      );
    },
    addressChange(e) {
      const address =
        CodeToText[e[0]] + "," + CodeToText[e[1]] + "," + CodeToText[e[2]];
      this.form.contractAddress = address;
    },
    //提交合同
    submitContract() {
      addContract(this.form)
      .then(res=>{
        console.log(res);
      })
    },
    handleUrl(file, fileList) {
      if (file.code === 0) {
        this.form.contractUrl = file.data.nginxPath + file.data.pathList[0];
        // this.imgFolat = true;
      } else {
        this.$message.error("图片上传失败");
      }
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
    .title-header {
      padding: 5px 15px;
      font-size: 16px;
      background: #fff7db;
    }
    .el-select,
    .el-cascader {
      width: 100%;
    }
    .subject {
      margin: 20px 0;
      .el-input__inner {
        width: 60%;
      }
    }
    .list {
      display: flex;
    }
    .el-col {
      height: 30px;
      line-height: 30px;
      margin: 5px 0;
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