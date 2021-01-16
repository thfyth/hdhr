<template>
  <div class="main">
       <div class="title-box" style="width: auto">
          <div class="title-list">
            <div class="list-box">
              <span class="title">员工姓名:</span>
              <el-input
                v-model="query.empName"
                placeholder="姓名"
                style="width: 200px"
                clearable
              />
            </div>
            <div class="list-box">
              <span class="title">日期:</span>
                 <el-date-picker
                  v-model="query.nowValue"
                  type="date"
                  placeholder="选择月份"
                  format="yyyy 年 MM 月"
                  value-format="yyyy-MM"
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
              <el-button class="add" @click="addQuery">新增</el-button>
            </div>
            <!-- <div class="button-box">
              <el-button class="del" @click="delMsg">删除</el-button>
            </div> -->
          </div>
        </div>
      <div class="table-view">
          <el-table
              :data="tableData"
              :header-cell-style="{ background: '#F7F8FA', color: '#293B59' }"
              formatter
              border
              style="width: 100%">
              <el-table-column type="index" label="序号" fixed align="center" width="50"></el-table-column>
              <el-table-column label="员工姓名" align="center" fixed>
                  <template slot-scope="{row}">
                      <span class="article" v-text="row.empName" @click="getOneInfo(row)"></span>
                  </template>
              </el-table-column>
              <el-table-column prop="shouldSalary" label="应发工资" align="center"></el-table-column>
              <el-table-column prop="basicSalary" label="基本工资" align="center"></el-table-column>
              <el-table-column prop="achieveSalary" label="绩效工资" align="center"></el-table-column>
              <el-table-column prop="deviceSalary" label="设备补贴" align="center"></el-table-column>
              <el-table-column prop="hotSalary" label="高温补贴" align="center"></el-table-column>
              <el-table-column prop="postSalary" label="岗位工资" align="center"></el-table-column>
              <el-table-column prop="quarterSalary" label="季度奖励" align="center"></el-table-column>
              <el-table-column prop="senioritySalary" label="司龄工资" align="center"></el-table-column>
              <el-table-column prop="lateSalary" label="迟到" align="center"></el-table-column>
              <el-table-column prop="leaveSalary" label="事假" align="center"></el-table-column>
              <el-table-column prop="notworkSalary" label="旷工" align="center"></el-table-column>
              <el-table-column prop="otherSalary" label="其他" align="center"></el-table-column>
              <el-table-column prop="tax" label="个税" align="center"></el-table-column>
              <el-table-column prop="actualSalary" label="实发工资" align="center"></el-table-column>
              <el-table-column prop="createDate" label="时间" align="center"></el-table-column>
              
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

          <el-dialog
              title="新增信息"
              :visible.sync="dialogVisible"
              width="60%"
              :before-close="dialogBeforeClose">
              <el-form :model="form" label-width="120px">
                  <el-row :gutter="10">
                      <el-col :span="8">
                          <el-form-item label="员工">
                            <el-autocomplete
                                v-model="form.empName"
                                :fetch-suggestions="querySearchAsync"
                                placeholder="请输入内容"
                                @select="handleSelect"
                            ></el-autocomplete>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="应发工资">
                            <el-input v-model="form.shouldSalary"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="基本工资">
                            <el-input v-model="form.basicSalary"></el-input>
                        </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="10">
                      <el-col :span="8">
                          <el-form-item label="绩效工资">
                            <el-input v-model="form.achieveSalary"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="设备补贴">
                            <el-input v-model="form.deviceSalary"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="高温补贴">
                            <el-input v-model="form.hotSalary"></el-input>
                        </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="10">
                      <el-col :span="8">
                          <el-form-item label="岗位工资">
                            <el-input v-model="form.postSalary"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="季度奖励">
                            <el-input v-model="form.quarterSalary"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="司龄工资">
                            <el-input v-model="form.senioritySalary"></el-input>
                        </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="10">
                      <el-col :span="8">
                          <el-form-item label="迟到">
                            <el-input v-model="form.lateSalary"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="事假">
                            <el-input v-model="form.leaveSalary"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="旷工">
                            <el-input v-model="form.notworkSalary"></el-input>
                        </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="10">
                      <el-col :span="8">
                          <el-form-item label="其他">
                            <el-input v-model="form.otherSalary"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="个税">
                            <el-input v-model="form.tax"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                          <el-form-item label="实发工资">
                            <el-input v-model="form.actualSalary"></el-input>
                        </el-form-item>
                      </el-col>
                  </el-row>
              </el-form>
              <div slot="footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="saveEdit">确 定</el-button>
              </div>
          </el-dialog>
      </div>
  </div>

</template>
<script>
let vm
import {
    addSalary,
    updataSalary,
    selectSalary,
    selectEmpName
} from "@/api/personnel/salaryManage"
export default {
  data() {
    return {
      query: {
        empName:null,
        //月
        nowValue:null,
        pageNumber:1,
        pageSize:10
      },
      currentPage: 10,
      total: 0,
      tableData:[],
      dialogVisible:false,
      form:{},
      //true为新增。false为修改
      option:true
    }
  },
  created() {
    vm = this
    vm.getData()
  },
  methods: {
      //查询薪资
      getData(){
          selectSalary(vm.query)
          .then(res=>{
              console.log(res);
              if(res.code === 0){
                  vm.tableData = res.data.records;
                  vm.total=res.data.total
              }
          })
      },
      getOneInfo(row){
          vm.form=row
          vm.option=false
          vm.dialogVisible=true
      },
      //分页
      handleCurrentChange(e){
          vm.query.pageNumber=e;
          vm.getData()
      },
      handleSizeChange(e){
          vm.query.pageSize=e;
          vm.getData()
      },
      //重置
      runReset(){
          vm.query.empName=null
            //月
            vm.query.nowValue=null
            vm.getData();
      },
      //新增
      addQuery(){
          vm.form={}
          vm.option=true
          vm.dialogVisible=true
      },
      //远程搜索员工
    handleSelect(e) {
      vm.form.empId = e.empId;
    },
    querySearchAsync(queryString, cb) {
        const {empName} = vm.form;
      selectEmpName({empName}).then((res) => {
        console.log(res);
        const data = res.data;
        if (data.length > 0) {
          let employeeList = [];
          data.forEach((v) => {
            employeeList.push({
              value: v.empName,
              empId: v.empId,
            });
          });
          cb(employeeList);
        }
      });
    },
    saveEdit(){
        //保存信息
        if(!vm.form.empId){
            vm.$message.error("请选择员工")
            return
        }
        let data;
        if(vm.option){
            //新增
            data=addSalary(vm.form);
        }else{
            //修改
            data=updataSalary(vm.form);
        }
        data.then(res=>{
            if(res.code === 0){
                vm.$message.success(res.message)
                vm.getData()
                vm.dialogVisible=false
            }else{
                vm.$message.error(res.message)
            }
        })
    }
  }
}
</script>


<style lang="scss">
    .el-input--prefix .el-input__inner {
        padding-left: 30px!important;
    }
</style>
