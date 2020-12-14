<template>
  <div class="main">
    <aside>
      增加的模板在选择和查看是都会使用到！
    </aside>
    <el-form ref="form" :model="form" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item :required="true">
            <MDinput v-model="form.tempName" :maxlength="100" required>
              模板名称
            </MDinput>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="模板类型:" :required="true">
            <!-- <el-input v-model="form.tempType"></el-input> -->
            <!-- 1.普通模板 -->
            <el-select v-model="form.tempType" placeholder="选择模板">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="模板内容" :required="true">
        <tinymce ref="tinymce1" v-model="form.tempContent" :height="600" />
        <!-- <article-detail :is-edit="true" /> -->
      </el-form-item>
      <el-button type="primary" @click="saveEdit" class="submit-btn-temp">
        保存
      </el-button>
    </el-form>
  </div>
</template>

<script>
let vm
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
// import ArticleDetail from '../components/ArticleDetail'
import {
  findDetaTemp,
  addTemp,
  updataTemp
} from '@/api/personnel/contractManage'

export default {
  components: {
    Tinymce,
    MDinput
  },
  data() {
    return {
      form: {},
      query: {},
      typeOptions: [
        {
          label: '普通模板',
          value: 1
        }
      ],
      // 用户操作，新增还是修改
      option: true
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: 'getData'
  },
  activated() {
    console.log(123)
  },
  created() {
    vm = this
    const { tempId } = vm.$route.params
    if (tempId != 0) {
      vm.getData(tempId)
    }
  },
  methods: {
    getData(tempId) {
      findDetaTemp({ tempId }).then(res => {
        if (res.code === 0) {
          vm.$nextTick(() => {
            vm.form = res.data
          })

          //   vm.$router.go(0);
        } else {
          vm.$message.error(res.msg)
        }
      })
    },
    // 保存
    saveEdit() {
      // 增加
      const data = addTemp(vm.form)
      data.then(res => {
        if (res.code === 0) {
          vm.getData()
          // 新增成功
          vm.$message.success(res.message)
          vm.$router.push({
                path: "/personnel/laborContract/contractTemp"
            });
        } else {
          vm.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss">
aside {
  background: #eef1f6;
  padding: 8px 24px;
  margin: 10px 0 20px 0;
  border-radius: 2px;
  display: block;
  line-height: 32px;
  font-size: 16px;
  color: #2c3e50;
}
</style>
