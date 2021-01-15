<template>
  <div class="main temp-main">
    <div class="title-box" style="width: auto;">
      <div class="titles-list">
        <div class="button-box">
          <el-button class="add" @click="addQuery">新增模板</el-button>
        </div>
      </div>
    </div>
    <div class="table-view">
      <table-view
        :table-data="tableData"
        :table-label="tableLabel"
        :table-option="tableOption"
        :total="total"
        @handleSelectionChange="getSelectionChange"
        @handleButton="getButton"
        @setStatus="setStatus"
        @getOneData="getOneInfo"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>

    <el-dialog title="模板信息" :visible.sync="dialogVisible" width="40%">
      <div>
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="模板名称" :required="true">
            <el-input v-model="form.tempName" />
          </el-form-item>
          <el-form-item label="组织" :required="true">
            <el-cascader
              v-model="form.parentIdAlls"
              :props="propsData"
              :show-all-levels="false"
              :options="options">
            </el-cascader>
          </el-form-item>
          <el-form-item label="模板类型" :required="true">
            <el-select v-model="form.tempType" placeholder="选择模板">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="模板内容" :required="true">
            <!-- <el-input v-model="form.tempContent" /> -->
            <el-upload
              class="upload-demo"
              action="http://39.98.171.233:9004/api/employee/file/uploadFile"
              :limit="1"
              :data="uploadData"
              :on-exceed="handleExceed"
              :headers="headersData"
              :before-upload="beforeUpload"
              name="files"
              accept=".doc,.docx"
              ref="upload"
              :on-success="handleListFile"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">
                <span v-if="option">点击上传</span>
                <span v-else>更换模板内容</span>
              </el-button>
              <div slot="tip" class="el-upload__tip">只能上传doc/docx文件，优先选择doc</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let vm
import tableView from '@/components/vTable.vue'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import {
  findTemp,
  updataTemp,
  findDetaTemp,
  addTemp
} from '@/api/personnel/contractManage'
import { getBayIdManOrg } from "@/api/management/orgManage";
export default {
  components: {
    tableView
  },
  data() {
    return {
      tableData: [],
      total: 0,
      content: '内容',
      typeOptions: [
        {
          label: '普通模板',
          value: 1
        }
      ],
      tempId: null,
      headersData: {
        Authorization: 'Bearer ' + getToken()
      },
      uploadData: {},
      src: null,
      form: {},
      option: true,
      dialogVisible: false,
      tableLabel: [
        { label: '模板ID', param: 'tempId', align: 'center' },
        {
          label: '模板名称',
          param: 'tempName',
          align: 'center',
          fixed: true,
          click: true
        },
        {
          label: '模板类型',
          param: 'tempType',
          align: 'center',
          render: row => {
            if (row.tempType === 1) {
              return '普通模板'
            } else {
              return '其它模板'
            }
          }
        },
        {
          label: '状态',
          param: 'status',
          align: 'center',
          activeText: '启用',
          inactiveText: '停用',
          switch: true
        },
        { label: '创建人名称', param: 'createName', align: 'center' }
      ],
      tableOption: {
        label: '操作',
        width: '200',
        options: [
          {
            label: '编辑',
            type: 'text',
            icon: 'el-icon-my-edit',
            methods: 'edit'
          },
          {
            label: '预览',
            type: 'text',
            icon: 'el-icon-view',
            methods: 'view'
          }
        ]
      },
      query: {
        pageNumber: 1,
        pageSize: 10,
        tempName: null,
        status: null,
        tempType: null
      },
      multipleSelection: '',
      options:[],
      propsData:{
        value:"orgId",
        label:"orgName",
        checkStrictly :true
      }
    }
  },
  created() {
    vm = this
    vm.getData()
  },
  methods: {
    // 获取数据
    getData() {
      vm.total = 0
      findTemp(vm.query).then(res => {
        if (res.code === 0) {
          vm.tableData = res.data.records
          vm.total = res.data.total
        } else {
          vm.$message.error(res.msg)
        }
      })
      const query={
        pageNumber: "1",
        pageSize: "10",
      }
      getBayIdManOrg(query)
      .then(res=>{
        vm.options=res.data;
      })
    },
    getButton(e, row) {
      console.log(e)
      if (e == 'edit') {
        vm.getOneInfo(row)
      } else {
        vm.viewTemp(row)
      }
    },
    // 预览模板
    viewTemp(e) {
      const { tempId } = e
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style = 'display:none'
      a.href =
        'http://39.98.171.233:9004/api/employee/contracttemp/previewPdf?tempId=' +
        tempId
      // a.download = filename;
      a.target = '_blank'
      a.click()
    },
    // 获取一个模板信息
    getOneInfo(e) {
      // const { tempId } = e
      // vm.$router.push({
      //   path: '/personnel/laborContract/tempInfo/' + tempId
      // })
      vm.option = false
      vm.form = e
      vm.uploadData = {
        employeeId: '',
        purpose: 2,
        actId: e.tempId
      }
      vm.dialogVisible = true
    },
    saveData() {
      let data
      const list = vm.form.parentIdAlls || [];
      if(list.length>0){
        vm.form.orgId=list.slice(-1)[0];
      }
      
      if (vm.option) {
        // 新增
        data = addTemp(vm.form)
      } else {
        // 修改
        data = updataTemp(vm.form)
      }


      
      data.then(res => {
        if (res.code === 0) {
          vm.getData()
          // 新增成功
          vm.$refs.upload.clearFiles()
          vm.$message.success(res.message)
          vm.dialogVisible = false
        } else {
          vm.$message.error(res.msg)
        }



      })
    },
    // 多选
    getSelectionChange(e) {
      let arr = ''
      // multipleSelection
      e.forEach(v => {
        arr += v.tempId + ','
      })
      vm.multipleSelection = arr
    },
    // 分页
    handleCurrentChange(e) {
      vm.query.pageNumber = e
      vm.getData()
    },
    handleSizeChange(e) {
      vm.query.pageSize = e
      vm.getData()
    },
    // 增加合同模板
    addQuery() {
      vm.option = true
      vm.uploadData = {
        employeeId: '',
        purpose: 2,
        actId: ''
      }
      vm.form={};
      vm.dialogVisible = true
    },
    // 更改模板状态
    setStatus(e) {
      updataTemp(e)
    },
    handleExceed(files, fileList) {
      vm.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    // 上传文件成功
    handleListFile(file, fileList) {
      console.log(file)
      if (file.code == 0) {
        console.log('上传成功')
        // tempId
        // this.form.photo = file.data.nginxPath + file.data.pathList[0];
        vm.form.tempId = file.data.actIdList[0]
        
        vm.$message.success('文件上传成功')
      } else {
        vm.$message.error('文件上传失败')
      }
    },
    //上传前判断文件格式
    beforeUpload(file){
      console.log(file);
      var fileTypeOf=file.name.substring(file.name.lastIndexOf('.')+1)
      console.log(fileTypeOf);
      if(fileTypeOf !== "doc" && fileTypeOf !== "docx"){
        vm.$message.error('上传文件只能是 doc,docx 格式!');
        return false
      }
      return fileTypeOf
    }
  }
}
</script>

<style lang="scss"></style>
