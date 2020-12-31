<template>
  <div class="main contract-box">
    <div class="title">
      <div>签署合同 || {{ employeeName }}</div>
    </div>
    <div class="main-box">
      <div class="form-box">
        <el-form :model="form" style="width: 98%" label-width="100px">
          <table
            align="center"
            cellspacing="0"
            border="1"
            style="width: 100%; table-layout: fixed"
          >
            <tr>
              <td style="border-color:#fff;">
                <div class="title-box">
                  <span class="title-header">个人基本信息</span>
                </div>
              </td>
              <td colspan="5" style="border-color:#fff;">
                <div v-if="!optionsType" style="display: flex">
                  <span
                    v-if="userOption"
                    class="font"
                    @click="getStaffInfo"
                  >取 消</span>
                  <span
                    v-if="userOption"
                    class="font"
                    @click="updataStaff"
                  >保 存</span>
                  <span v-else class="font" @click="setStaffInfo">编 辑</span>
                </div>
              </td>
            </tr>
            <div class="title-box" />
            <tr>
              <th class="act">
                合同编码
              </th>
              <td>
                <el-input
                  v-model="form.contractCode"
                  :disabled="!optionsType"
                />
              </td>
              <th class="act">
                合同名称
              </th>
              <td>
                <el-input v-model="form.contractName" :disabled="!userOption" />
              </td>
              <th class="act">
                用人方式
              </th>
              <td>
                <el-select
                  v-model="form.employType"
                  :disabled="!userOption"
                  placeholder="用人方式"
                >
                  <el-option
                    v-for="item in employTypeOptions"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </td>
              <th class="act">
                工作地点
              </th>
              <td>
                <el-cascader
                  v-model="address"
                  :disabled="!userOption"
                  :options="options"
                  @change="addressChange"
                />
              </td>
            </tr>
            <tr>
              <th class="act">工时类型</th>
              <td>
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
                  />
                </el-select>
              </td>
              <th class="act">用工方式</th>
              <td>
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
                  />
                </el-select>
              </td>
              <th>合同备注</th>
              <td>
                <el-input v-model="form.contractDesc" :disabled="!userOption" />
              </td>
              <th class="act">签署日期</th>
              <td>
                <el-date-picker
                  v-model="form.signDate"
                  value-format="yyyy-MM-dd"
                  :disabled="!userOption"
                  type="date"
                  placeholder="签署日期:"
                />
              </td>
            </tr>
            <tr>
              <th class="act">合同有效期</th>
              <td colspan="3">
                <div class="list">
                  <el-date-picker
                    v-if="userOption"
                    v-model="form.validityBegin"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="合同有效期(起):"
                  />
                  <span v-else>{{ form.validityBegin }}</span>
                  至
                  <el-date-picker
                    v-if="userOption"
                    v-model="form.validityEnd"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="合同有效期(止):"
                  />
                  <span v-else>{{ form.validityEnd }}</span>
                </div>
              </td>
              <th class="act">试用期</th>
              <td colspan="3">
                <div class="list">
                  <el-select
                    v-model="form.isPeriod"
                    style="width: 150px"
                    :disabled="!userOption"
                    placeholder="试用期"
                  >
                    <el-option
                      v-for="item in isPeriodOptions"
                      :key="item.attrValue"
                      :label="item.attrName"
                      :value="item.attrValue"
                    />
                  </el-select>
                  <el-date-picker
                    v-if="userOption"
                    v-model="form.probationBegin"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="试用期(起):"
                  />
                  <span v-else>{{ form.probationBegin }}</span>
                  至
                  <el-date-picker
                    v-if="userOption"
                    v-model="form.probationEnd"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="试用期(止):"
                  />
                  <span v-else>{{ form.probationEnd }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <div class="title-box">
                <span class="title-header">签约主体</span>
              </div>
            </tr>
            <tr>
              <th colspan="4" style="text-align:center">甲方</th>
              <th colspan="4" style="text-align:center">乙方</th>
            </tr>
            <tr>
              <th class="act">公司名</th>
              <td colspan="3">
                <el-input v-if="optionsType" v-model="form.firstCompany" />
                <span v-else>{{ form.firstCompany }}</span>
              </td>
              <th class="act">姓名</th>
              <td colspan="3">
                <el-input v-if="optionsType" v-model="form.secondName" />
                <span v-else>{{ form.secondName }}</span>
              </td>
            </tr>
            <tr>
              <th class="act">公司地址</th>
              <td colspan="3">
                <el-input
                  v-if="optionsType"
                  v-model="form.firstCompanyAddress"
                />
                <span v-else>{{ form.firstCompanyAddress }}</span>
              </td>
              <th class="act">现居地</th>
              <td colspan="3">
                <el-input v-if="optionsType" v-model="form.secondAddress" />
                <span v-else>{{ form.secondAddress }}</span>
              </td>
            </tr>
            <tr>
              <th class="act">法定代表人</th>
              <td colspan="3">
                <el-input v-if="optionsType" v-model="form.firstName" />
                <span v-else>{{ form.firstName }}</span>
              </td>
              <th class="act">身份证</th>
              <td colspan="3">
                <el-input v-if="optionsType" v-model="form.secondNo" />
                <span v-else>{{ form.secondNo }}</span>
              </td>
            </tr>
            <tr>
              <th class="act">联系电话</th>
              <td colspan="3">
                <el-input v-if="optionsType" v-model="form.firstPhone" />
                <span v-else>{{ form.firstPhone }}</span>
              </td>
              <th class="act">电话</th>
              <td colspan="3">
                <el-input v-if="optionsType" v-model="form.secondPhone" />
                <span v-else>{{ form.secondPhone }}</span>
              </td>
            </tr>
            <div class="title-box" />

            <tr>
              <td style="padding:10px 5px;border-color:#fff">
                <div class="title-box">
                  <span v-if="option" class="title-header">合同模板</span>
                  <span v-else class="title-header">合同正文</span>
                </div>
              </td>
              <td colspan="7" style="padding:10px 5px;border-color:#fff">
                <el-select
                  v-if="option"
                  v-model="form.tempId"
                  style="width:200px"
                  placeholder="选择合同模板"
                >
                  <el-option
                    v-for="item in tempList"
                    :key="item.tempId"
                    :label="item.tempName"
                    :value="item.tempId"
                  />
                </el-select>
                <div v-else>
                  <el-upload
                    v-if="userOption"
                    action="http://39.98.171.233:9004/api/employee/file/uploadFile"
                    :show-file-list="false"
                    :on-success="handleUrl"
                    :data="uploadData"
                    name="files"
                    :headers="headersData"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>

                  <el-button
                    v-if="!userOption"
                    type="primary"
                    @click="uploadModel"
                  >查看合同</el-button>
                  <el-button
                    v-if="!userOption"
                    type="primary"
                    @click="uploadModel1"
                  >下载合同</el-button>
                </div>
                <div class="submit-box">
                  <el-button
                    v-if="userOption"
                    type="primary"
                    @click="submitContract"
                  >提交</el-button>
                </div>
              </td>
            </tr>
          </table>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import axios from 'axios'
import { getAttrMenu } from '@/api/attrManage'
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import {
  getContract,
  delContract,
  addContract,
  contractSelect,
  contractTotal,
  updateContract,
  selectCodeContract
} from '@/api/personnel/contractManage'
import { findTemp } from '@/api/personnel/contractManage'
import { selectAllDrop } from '@/api/user'
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
      // 判断是新增还是查看还是修改 true为新增
      optionsType: true,
      uploadData: {
        employeeId: '',
        purpose: 2
      },
      // 判断是修改还是展示
      userOption: false,
      optionsTypes: {},
      headersData: {
        Authorization: 'Bearer ' + getToken()
      },
      employeeName: null,
      option: true,
      tempList: []
    }
  },
  created() {
    this.getDate()
    this.getOption()
  },
  methods: {
    getDate() {
      const that = this
      console.log(that.$route.params)
      const { employeeId, contractId, employeeName } = that.$route.params
      that.form.employeeId = employeeId
      that.employeeName = employeeName
      console.log(contractId)
      if (contractId != 0) {
        that.option = false
        selectCodeContract(contractId).then(res => {
          console.log(res)
          // that.getSelectData();
          if (res.code === 0) {
            that.optionsType = false
            that.form = res.data.contractList[0]
            const { contractAddress } = res.data.contractList[0]
            const strs = contractAddress.split(',') // 字符分割
            const code1 = TextToCode[strs[0]].code
            const code2 = TextToCode[strs[0]][strs[1]].code
            const code3 = TextToCode[strs[0]][strs[1]][strs[2]].code
            const arr = []
            arr.push(code1)
            arr.push(code2)
            arr.push(code3)
            that.address = arr
            that.uploadData.actId = res.data.contractList[0].contractId
          }
        })
      } else {
        that.employeeName = employeeName
        that.userOption = true
        that.getTemp()
      }
    },
    getOption() {
      const that = this
      selectAllDrop().then(res => {
        // console.log(res);
        if (res.code === 0) {
          that.optios = res.data
          // 用工方式
          const employmentModule = that.getOpt(res.data, 'employment_module')
          that.employOptions = employmentModule.employment_module.option
          // 工时类型
          const workingType = that.getOpt(res.data, 'working_type')
          that.workOptions = workingType.working_type.option
          // 是否有试用期
          const isPeriod = that.getOpt(res.data, 'is_period')
          that.isPeriodOptions = isPeriod.is_period.option
          // 是否有试用期
          const employType = that.getOpt(res.data, 'employ_type')
          that.employTypeOptions = employType.employ_type.option
        }
      })
    },
    // 获取合同模板
    getTemp() {
      const that = this
      const query = {
        pageNumber: 1,
        pageSize: 80,
        tempName: null,
        status: 1,
        tempType: null
      }
      findTemp(query).then(res => {
        if (res.code === 0) {
          that.tempList = res.data.records
        }
      })
    },
    getOpt(data, str) {
      let retData
      data.forEach(v => {
        if (v.hasOwnProperty(str)) {
          retData = v
          return false
        }
      })
      return retData
    },
    addressChange(e) {
      const address =
        CodeToText[e[0]] + ',' + CodeToText[e[1]] + ',' + CodeToText[e[2]]
      this.form.contractAddress = address
    },
    // 提交合同
    submitContract() {
      const that = this
      let data
      if (this.option) {
        // 新增合同
        data = addContract(this.form)
      } else {
        data = updateContract(this.form)
      }
      data.then(res => {
        if (res.code === 0) {
          that.$message.success(res.message)
          that.$router.push({
            path: '/personnel/laborContract/contractManage'
          })
        } else {
          that.$message.error(res.message)
        }
      })
    },
    handleUrl(file, fileList) {
      console.log(file)
      if (file.code === 0) {
        this.form.contractUrl = file.data.nginxPath + file.data.pathList[0]
        this.form.contractId = file.data.actIdList[0]
        this.$message.success('上传成功')

        // this.imgFolat = true;
      } else {
        this.$message.error('上传失败')
      }
    },
    // 查看合同
    uploadModel() {
      // const ajax = axios.create({
      //   timeout: 20000, // 超时时间
      // });
      // ajax.interceptors.request.use((config) => {

      //   config.headers['Authorization'] = 'Bearer ' + getToken()
      //   return config;
      // });
      const { contractId, employeeId, tempId } = this.form
      const data = {
        tempId: contractId,
        empId: employeeId,
        // 1预览,2下载
        type: 1
      }
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style = 'display:none'
      a.href =
        'http://39.98.171.233:9004/api/employee/contract/previewPdf?contractId=' +
        contractId +
        '&type=1&tempId=' +
        tempId

      a.target = '_blank'
      a.click()
    },
    // 导出模板
    uploadModel1() {
      const ajax = axios.create({
        timeout: 20000 // 超时时间
      })
      ajax.interceptors.request.use(config => {
        config.headers['Authorization'] = 'Bearer ' + getToken()
        return config
      })
      const { contractId, employeeId, tempId } = this.form
      const data = {
        contractId,
        // 1预览,2下载
        type: 2
      }
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style = 'display:none'
      a.href =
        'http://39.98.171.233:9004/api/employee/contract/previewPdf?contractId=' +
        contractId +
        '&type=2&tempId=' +
        tempId
      a.click()
      // ajax({
      //   type: "get",
      //   url: "http://192.168.1.52:9004/api/employee/contract/previewPdf",
      //   responseType: "arraybuffer",
      //   data
      // })
      //   .then((res) => {
      //     this.saveData(res.data, "人事合同.xlsx");
      //   })
      //   .catch((error) => {});
    },
    saveData(data, filename) {
      const blob = new Blob([data], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
      })
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style = 'display:none'
      a.href = objectUrl
      // a.download = filename;
      a.click()
    },
    // 编辑员工信息
    setStaffInfo() {
      this.userOption = true
    },
    getStaffInfo() {
      this.userOption = false
    },
    updataStaff() {
      const that = this
      updateContract(that.form).then(res => {
        if (res.code === 0) {
          that.$message.success(res.message)
          that.getSelectData()
          that.getDate()
          that.userOption = false
        } else {
          that.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.contract-box {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-form {
    table {
      border-collapse: collapse;
      word-wrap: break-word;
      word-break: break-all;
      border: none;
      .act::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
      span{
        font-size: 14px;
      }
      .font {
              color: #3988ff;
              font-size: 14px;
              // padding: 10px 0;
              display: block;
              text-align: center;
              cursor: pointer;
              padding-right: 20px;
              
            }
      .table-type {
        background: #f0f2f5;
        .table-list-type {
          border: none;
          padding: 0;
          .table-list-box {
            display: flex;
            line-height: 30px;
            font-size: 16px;
            margin-top: 20px;
            background: #fff;
            
            .table-list-bt {
              justify-content: flex-end;
              margin-left: auto;
              margin-right: 15px;
              padding: 0;
              display: flex;
              align-items: center;
            }
          }
        }
      }
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
      align-items: center;
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
