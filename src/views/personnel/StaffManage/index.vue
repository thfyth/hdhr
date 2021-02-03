<template>
  <div class="main staff-mian tur-main">
    <div class="box-com ">
      <div class="org-box">
        <div class="tree-view">
          <!-- <span>
            <i class="el-icon-my-home" />
            组织列表</span> -->
          <el-tree
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            node-key="orgId"
            :default-expanded-keys="defaultCheck"
            highlight-current
            :expand-on-click-node="false"
          >
            <div slot-scope="{ data }" class="custom-tree-node">
              <div
                :class="{ active: data.orgId == orgActive }"
                @click="getOrgId(data)"
              >
                {{ data.orgName }}
              </div>
            </div>
          </el-tree>
        </div>
      </div>
      <div class="main-box">
        <div class="title-box" style="width: auto">
          <div class="title-list">
            <div class="list-box">
              <span class="title">姓名</span>
              <el-input
                v-model="employeeQuery.employeeName"
                placeholder="姓名"
                style="width: 200px"
                clearable
              />
            </div>
            <div class="list-box">
              <el-button class="insert" @click="geteEployees">查询</el-button>
            </div>
            <div class="list-box">
              <el-button class="resetting" @click="runReset">重置</el-button>
            </div>
          </div>
          <div class="titles-list staff-btn-list">
            <div class="staff-btn-one">
              <div class="button-box">
                <el-button
                  class="btn-upload"
                  :disabled="!hasButtons('upload-staff-excel')"
                  @click="uploadModel"
                >导出员工信息模板</el-button>
              </div>
              <div class="button-box">
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  action="http://39.98.171.233:9004/api/employee/insert/batch"
                  multiple
                  :headers="headersData"
                  :file-list="fileList"
                  :on-preview="handlePreview"
                  :on-success="handleSuccess"
                  :disabled="!hasButtons('load-staff-info')"
                >
                  <el-button
                    class="add"
                    :disabled="!hasButtons('load-staff-info')"
                  >批量导入员工信息</el-button>
                </el-upload>
              </div>
              <!-- <div class="button-box">
                <el-button
                  class="btn-leave"
                  @click="staffLeave"
                >离职</el-button>
              </div>
              <div class="button-box">
                <el-button
                  class="btn-change"
                  @click="changeStaff"
                >发起异动</el-button>
              </div> -->
            </div>
            <div class="button-box">
              <el-button
                class="btn-screen"
                :disabled="!hasButtons('screen-staff')"
                @click="drawerFun"
              >筛选</el-button>
            </div>
            <!-- 导出员工数据 -->
            <!-- 不能删 暂时隐藏 -->
            <!-- <el-dropdown @command="exportTempModel">
              <el-button type="primary">
                导出
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="all">导出所有数据</el-dropdown-item>
                <el-dropdown-item>导出筛选数据</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
            <!-- <el-button class="insert" type="primary">批量操作</el-button> -->
          </div>
        </div>
        <!-- <div class="staff-info">
          <span
            v-for="(item, index) in emTotalList"
            :key="index"
            :class="{ active: index == isActive }"
            @click="getStatus(item.status, index)"
          >
            {{ item.name }}：{{ item.value }}
          </span>
        </div> -->
        <div class="table-view">
          <el-table
            :data="tableData"
            stripe
            :header-cell-style="{ background: '#F7F8FA', color: '#293B59' }"
            @selection-change="getSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column fixed label="员工名字" width="180">
              <template slot-scope="scope">
                <span
                  class="staffName"
                  @click="getOneInfo(scope.$index, scope.row)"
                >{{ scope.row.employeeName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="180" />
            <el-table-column prop="mobile" label="手机" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column label="性别">
              <template slot-scope="scope">
                <span v-if="scope.row.sex === 1">男</span>
                <span v-else>女</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              align="center"
              class-name="small-padding fixed-width"
            >
              <!-- slot-scope="scope" -->
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  :disabled="!hasButtons('staff-manage-view')"
                  @click="edit(scope.$index, scope.row)"
                >编辑</el-button>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  :disabled="!hasButtons('staff-manage-del')"
                  @click="deleteStaff(scope.$index, scope.row)"
                >删除</el-button>
                <el-popover placement="left" width="200" trigger="click">
                  <div>
                    <el-popover
                          ref="popover4"
                          placement="left"
                          width="200"
                          trigger="click"
                        >
                          <div class="contract-box">
                            <p class="contract-title">请选择签署协议</p>
                            <div>
                              <div class="contract-list">
                                <el-checkbox
                                  v-model="contract.labor"
                                >劳动合同</el-checkbox>
                              </div>
                              <div class="contract-submit">
                                <el-button
                                  type="primary"
                                  :disabled="
                                    !hasButtons('staff-manage-popover')
                                  "
                                  @click="
                                    signTheContract(scope.$index, scope.row)
                                  "
                                >发起签署</el-button>
                              </div>
                            </div>
                          </div>
                          <el-button
                            slot="reference"
                            type="text"
                            icon="el-icon-edit"
                          >签署合同</el-button>
                        </el-popover>
                    <div>
                      <el-button
                        type="text"
                        @click="staffLeave(scope.row)"
                        icon="el-icon-male"
                      >离职</el-button>
                    </div>
                    <div>
                      <el-button
                        type="text"
                        icon="el-icon-edit-outline"
                        @click="changeStaff(scope.row)"
                      >发起异动</el-button>
                    </div>
                    
                  </div>
                  <el-button slot="reference" style="padding-left:10px" type="text">更多</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="block pagination-box">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选框 -->
    <el-drawer ref="drawer" title="筛选条件" :visible.sync="drawer">
      <div class="drawer_content">
        <el-form :model="employeeQuery" label-width="80px">
          <el-form-item label="员工姓名">
            <el-input v-model="employeeQuery.employeeName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="年龄区间">
            <div class="group">
              <el-input v-model="employeeQuery.age1" />
              <span class="center-text">到</span>
              <el-input v-model="employeeQuery.age2" />
            </div>
          </el-form-item>
          <el-form-item label="员工年龄">
            <el-input v-model="employeeQuery.age" />
          </el-form-item>
          <el-form-item label="出生日期">
            <div class="group">
              <el-date-picker
                v-model="employeeQuery.birthday1"
                value-format="yyyy-MM-dd"
                format="yyyy 年 MM 月 dd 日"
                type="date"
                placeholder="选择日期"
              />
              <span class="center-text">到</span>
              <el-date-picker
                v-model="employeeQuery.birthday2"
                value-format="yyyy-MM-dd"
                format="yyyy 年 MM 月 dd 日"
                type="date"
                placeholder="选择日期"
              />
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
              />
            </el-select>
          </el-form-item>

          <el-form-item label="户籍">
            <el-input v-model="employeeQuery.censusAddress" />
          </el-form-item>
          <el-form-item label="星座">
            <el-select v-model="employeeQuery.constellation" placeholder="星座">
              <el-option
                v-for="item in constellationOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="现居住地">
            <el-input v-model="employeeQuery.currentAddress" />
          </el-form-item>
          <el-form-item label="最高学位">
            <el-select v-model="employeeQuery.degree" placeholder="最高学位">
              <el-option
                v-for="item in degreeOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="最高学历">
            <el-select v-model="employeeQuery.education" placeholder="最高学历">
              <el-option
                v-for="item in educationOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              />
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
              />
              <span class="center-text">到</span>
              <el-date-picker
                v-model="employeeQuery.dimissionDate2"
                value-format="yyyy-MM-dd"
                format="yyyy 年 MM 月 dd 日"
                type="date"
                placeholder="选择日期"
              />
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
              />
              <span class="center-text">到</span>
              <el-date-picker
                v-model="employeeQuery.gdDate2"
                value-format="yyyy-MM-dd"
                format="yyyy 年 MM 月 dd 日"
                type="date"
                placeholder="选择日期"
              />
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
              />
            </el-select>
          </el-form-item>
          <el-form-item label="爱好">
            <el-input v-model="employeeQuery.hobby" />
          </el-form-item>
          <el-form-item label="证件号码">
            <el-input v-model="employeeQuery.idNo" />
          </el-form-item>
          <el-form-item label="证件类型">
            <el-select v-model="employeeQuery.idType" placeholder="证件类型">
              <el-option
                v-for="item in idOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="自我介绍">
            <el-input v-model="employeeQuery.introduce" />
          </el-form-item>
          <el-form-item label="毕业专业">
            <el-input v-model="employeeQuery.major" />
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="employeeQuery.mobile" />
          </el-form-item>
          <el-form-item label="民族">
            <el-select v-model="employeeQuery.nation" placeholder="民族">
              <el-option
                v-for="item in nationOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="国家">
            <el-input v-model="employeeQuery.natives" />
          </el-form-item>
          <el-form-item label="政治面貌">
            <el-select v-model="employeeQuery.politics" placeholder="政治面貌">
              <el-option
                v-for="item in politicsOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="职级名称">
            <el-input v-model="employeeQuery.rankName" />
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
              />
            </el-select>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="employeeQuery.sex" placeholder="性别">
              <el-option
                v-for="item in sexOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="生肖">
            <el-select v-model="employeeQuery.zodiacSign" placeholder="生肖">
              <el-option
                v-for="item in zodiacSignOptions"
                :key="item.attrValue"
                :label="item.attrName"
                :value="item.attrValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="毕业院校">
            <el-input v-model="employeeQuery.school" />
          </el-form-item>
          <el-form-item label="特长">
            <el-input v-model="employeeQuery.strong" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="employeeQuery.remark" />
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
              ref="orgIdCascader"
              v-model="employeeQuery.orgIdList"
              :options="orgTreeData"
              :props="orgProps"
              :show-all-levels="false"
            />
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
              />
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
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="searchItem">{{
            loading ? '提交中 ...' : '确 定'
          }}</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- <el-dialog title="导出条件筛选" :visible.sync="dialogVisible" width="40%">
      <div />
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="exportTemp">确 定</el-button>
      </div>
    </el-dialog> -->
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
                  <span v-text="form.employeeName" />
                </td>
                <th>部门</th>
                <td>
                  <span v-text="form.changeBeforeOrgName" />
                </td>
                <th>职位</th>
                <td>
                  <span v-text="form.changeBeforePostName" />
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
                  <span v-text="form.changeBeforePostName" />
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
                  <!-- <el-autocomplete
                    v-model="form.employeeName"
                    placeholder="请输入内容"
                    :fetch-suggestions="querySearchAsync"
                    @select="handleSelect"
                  /> -->
                  <span v-text="form.employeeName" />
                </td>
                <th>入职时间</th>
                <td>
                  <span v-text="form.entryDate" />
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
                  <span v-text="form.changeBeforeCompanyName" />
                </td>
                <td colspan="3">
                  <span v-text="form.changeBeforeOrgName" />
                </td>
                <td colspan="2">
                  <span v-text="form.changeBeforePostName" />
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
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import tableView from '@/components/vTable.vue'
import {
  delOneEmployees,
  addOneEmployees,
  importEmployees,
  updateEmployees,
  getIdEmployees,
  getEmployeesList,
  exportEmployeesModel,
  exportTemplates,
  test,
  getOrg,
  getPost,
  getRank,
  findOrgTree,
  getTotal,
  addLeaveStaff
  // 查询组织岗位职级
} from '@/api/personnel/staff'
import { addChange, empChange } from '@/api/personnel/PersonnelTurnover'

import { selectAllDrop } from '@/api/user'
import { getToken } from '@/utils/auth'
import { getAttrMenu } from '@/api/attrManage'
// 导入判断是否拥有该按钮
import { isButtons } from '@/utils/button'
import { getBayIdManOrg } from '@/api/management/orgManage'
import { getPostList } from '@/api/management/postManage'
import axios from 'axios'
export default {
  components: {
    tableView
  },
  data() {
    return {
      fileList: [],
      // 合同分类
      contract: {
        labor: true
      },
      defaultProps: {
        label: 'orgName',
        children: 'children'
      },
      treeData: [],
      // 请求员工list参数
      employeeQuery: {
        employeeId: null,
        employeeName: null,
        orgId: null,
        pageNumber: '1',
        pageSize: '10',
        postId: null,
        postIdList: [],
        rankId: null,
        rankIdList: [],
        status: 2
      },
      // 岗位请求参数
      postQuery: {},
      // 职级请求参数
      rankQuery: {},
      // 组织请求参数
      orgQuery: {
        orgName: null,
        orgShortName: null,
        orgType: 0,
        pageNumber: '1',
        pageSize: '10',
        parentId: null
      },
      currentPage: 0,
      total: 0,
      headersData: {
        Authorization: 'Bearer ' + getToken()
      },
      drawer: false,
      // 表格数据
      tableData: [],
      // 用户设置角色
      table: false,
      dialog: false,
      loading: false,
      form: {},
      timer: null,
      // 员工类型下拉框
      employeeOptions: [],
      // 用工方式下拉框
      employmentOptions: [],
      // 最高学历下拉框
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
      // 户籍所在地下拉框
      censusAddressOptions: [],
      // 政治面貌下拉框
      politicsOptions: [],
      // 户籍性质下拉框
      registerOptions: [],
      // 性别下拉框
      sexOptions: [],
      // 工时类型下拉框
      workingOptions: [],
      // 生肖下拉框
      zodiacSignOptions: [],
      // 是否有试用期下拉框
      isPeriodOptions: [],
      // 离职原因
      dimCauseOptions: [],
      orgTreeData: [],
      orgProps: {
        label: 'orgName',
        value: 'orgId'
      },
      postOptions: [],
      rankOptions: [],
      isActive: null,
      orgActive: null,
      emTotalList: [],
      dialogVisible: false,
      modelVisible: false,
      parentIdAll: null,
      orgId: null,
      multipleSelection: '',
      changeTempTypeOpt: [
        { id: 0, name: '本公司' },
        { id: 1, name: '跨公司' }
      ],
      // 异动类型
      turnType: [],
      // 表单
      form: {
        changeTempType: 0
      },
      orgProps: {
        label: 'orgName',
        value: 'orgId',
        checkStrictly: true,
        emitPath: false
      },
      option: true,
      multipleList: [],
      // 默认展开
      defaultCheck: []
    }
  },
  mounted() {
    this.geteEployees()
    // this.getComData();
    this.getOption()
    this.getInfo()
  },
  methods: {
    // 获取员工list
    geteEployees() {
      const data = getEmployeesList(this.employeeQuery)
      data.then(
        res => (
          (this.tableData = res.data.records), (this.total = res.data.total)
        )
      )
    },
    hasButtons(data) {
      return isButtons(data)
    },
    getInfo() {
      const that = this
      const org = getBayIdManOrg(that.orgQuery)
      const post = getPost(that.postQuery)
      const rank = getRank(that.rankQuery)
      const isLeave = 2
      const tree = findOrgTree({ isLeave })
      const emTotal = getTotal()
      const change = getAttrMenu({ valueCode: 'change_type' })
      const query = {
        orgId: null,
        pageNumber: '1',
        pageSize: '10',
        postCode: null,
        postName: null
      }
      const postList = getPostList(query)
      Promise.all([org, rank, post, tree, emTotal, change, postList]).then(
        res => {
          that.defaultCheck = []
          console.log(res[3].data.data)
          const { data } = res[3].data
          that.defaultCheck.push(data[0].orgId)
          that.orgTreeData = res[0].data
          that.rankOptions = res[1].data.data
          that.postOptions = res[2].data.data
          that.treeData = data
          that.emTotalList = res[4].data
          that.turnType = res[5].data[0].change_type.option
          that.postData = res[6].data
        }
      )
    },
    getOption() {
      const that = this
      selectAllDrop().then(res => {
        // console.log(res);
        if (res.code === 0) {
          that.optios = res.data
          // 员工类型
          const employmentType = that.getOpt(res.data, 'employment_type')
          that.employeeOptions = employmentType.employment_type.option
          // 用工方式
          const employmentModule = that.getOpt(res.data, 'employment_module')
          that.employmentOptions = employmentModule.employment_module.option
          // 学位
          const degree = that.getOpt(res.data, 'degree')
          that.degreeOptions = degree.degree.option
          // 性别
          const sex = that.getOpt(res.data, 'sex')
          that.sexOptions = sex.sex.option
          // 查询学历，文化程度
          const education = that.getOpt(res.data, 'education')
          that.educationOptions = education.education.option
          // 民族
          const nation = that.getOpt(res.data, 'nation')
          that.nationOptions = nation.nation.option
          // 星座
          const constellation = that.getOpt(res.data, 'constellation')
          that.constellationOptions = constellation.constellation.option
          // 政治面貌
          const politics = that.getOpt(res.data, 'politics')
          that.politicsOptions = politics.politics.option
          // 户籍性质
          const registerType = that.getOpt(res.data, 'register_type')
          that.registerOptions = registerType.register_type.option
          // 工时类型
          const workingType = that.getOpt(res.data, 'working_type')
          that.workingOptions = workingType.working_type.option
          // 是否有试用期
          const isPeriod = that.getOpt(res.data, 'is_period')
          that.isPeriodOptions = isPeriod.is_period.option
          // 生肖
          const zodiacSign = that.getOpt(res.data, 'zodiac_sign')
          that.zodiacSignOptions = zodiacSign.zodiac_sign.option
          // 查询学习形式
          const studyType = that.getOpt(res.data, 'study_type')
          that.studyTypeOptions = studyType.study_type.option
          // 查询与本人关系
          const relation = that.getOpt(res.data, 'relation')
          that.relationOption = relation.relation.option
          // 职称获得方式
          const getWay = that.getOpt(res.data, 'title_get_way')
          that.titleOption = getWay.title_get_way.option
          // 职称级别
          const titleLevel = that.getOpt(res.data, 'title_level')
          that.titleLevelOption = titleLevel.title_level.option
          // 证书类型
          const ccieType = that.getOpt(res.data, 'ccie_type')
          that.ccieTypeOption = ccieType.ccie_type.option
          // 公司规模
          const companyScale = that.getOpt(res.data, 'company_scale')
          that.companyScaleOption = companyScale.company_scale.option
          // 同部门人数
          const deptNo = that.getOpt(res.data, 'dept_no')
          that.deptNoOption = deptNo.dept_no.option
          // 离职原因
          const dimCause = that.getOpt(res.data, 'dim_cause')
          that.dimCauseOptions = dimCause.dim_cause.option
          // 生育情况
          const fertilityType = that.getOpt(res.data, 'fertility_type')
          that.fertilityOption = fertilityType.fertility_type.option

          // 异动情况
          const changeType = that.getOpt(res.data, 'change_type')
          that.changeOption = changeType.change_type.option
          // 证件类型
          const idType = that.getOpt(res.data, 'id_type')
          that.idOptions = idType.id_type.option
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
    getComData() {
      const that = this
      // 同部门人数
      const deptNo = getAttrMenu({ valueCode: 'dept_no' })
      // 与本人关系
      const relation = getAttrMenu({ valueCode: 'relation' })
      // 性别
      const sex = getAttrMenu({ valueCode: 'sex' })
      // 查询学历，文化程度
      const education = getAttrMenu({ valueCode: 'education' })
      // 查询证书类型
      const ccieType = getAttrMenu({ valueCode: 'ccie_type' })
      // 查询学习形式
      const studyType = getAttrMenu({ valueCode: 'study_type' })
      // 查询离职原因
      const dimCause = getAttrMenu({ valueCode: 'dim_cause' })
      // 学位
      const degree = getAttrMenu({ valueCode: 'degree' })
      // 政治面貌
      const politics = getAttrMenu({ valueCode: 'politics' })
      // 生肖
      const zodiacSign = getAttrMenu({ valueCode: 'zodiac_sign' })
      // 星座
      const constellation = getAttrMenu({ valueCode: 'constellation' })
      // 民族
      const nation = getAttrMenu({ valueCode: 'nation' })
      // 是否有试用期
      const isPeriod = getAttrMenu({ valueCode: 'is_period' })
      // 工时类型
      const workingType = getAttrMenu({ valueCode: 'working_type' })
      // 用工方式
      const employmentModule = getAttrMenu({ valueCode: 'employment_module' })
      // 员工类型
      const employmentType = getAttrMenu({ valueCode: 'employment_type' })
      // 户籍性质
      const registerType = getAttrMenu({ valueCode: 'register_type' })
      // 婚姻状况
      const marriage = getAttrMenu({ valueCode: 'marriage' })
      // 公司规模
      const companyScale = getAttrMenu({ valueCode: 'company_scale' })
      // 职称获得方式
      const titleGetWay = getAttrMenu({ valueCode: 'title_get_way' })
      // 证件类型
      const idType = getAttrMenu({ valueCode: 'id_type' })
      // 所有请求
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
        dimCause
      ]).then(res => {
        that.sexOptions = res[0].data
        that.educationOptions = res[1].data
        that.degreeOptions = res[2].data
        that.politicsOptions = res[3].data
        that.zodiacSignOptions = res[4].data
        that.constellationOptions = res[5].data
        that.nationOptions = res[6].data
        that.employeeOptions = res[7].data
        that.registerOptions = res[8].data
        that.employmentOptions = res[9].data
        that.idOptions = res[10].data
        that.dimCauseOptions = res[11].data
      })
    },

    // 表格按钮事件
    edit(index, row) {
      const port = this.userHas('staff-manage-view')
      if (!port) {
        return
      }
      const { employeeId } = row
      this.$router.push({
        path: `/personnel/staffOneInfo/${employeeId}`
        // path: `/personnel/staffInfo/staffOneInfo/${employeeId}`
      })
    },
    // 点击用户名跳转
    getOneInfo(index, row) {
      this.edit(index, row)
    },
    deleteStaff(index, row) {
      const that = this

      const port = this.userHas('staff-manage-del')
      if (!port) {
        return
      }
      const { employeeId } = row
      that
        .$confirm('此操作将会删除该员工, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          const idList = employeeId
          // 删除信息
          delOneEmployees({ idList }).then(res => {
            if (res.code === 0) {
              that.$message.success(res.message)
              that.tableData.splice(index, 1)
            } else {
              that.$message.error(res.message)
            }
          })
        })
        .catch(err => {})
    },
    // 获取表格单个信息
    getOneData() {},
    // 多选事件
    getSelectionChange(e) {
      let arr = ''
      e.forEach(v => {
        arr += v.employeeId + ','
      })
      this.multipleSelection = arr
      this.multipleList = e
    },
    addEmp() {
      // this.$router.push({ name: 'addEmployees', params: { employeeId: 0 }})
      if (!this.orgId) {
        this.$message.warning('请选择组织后再添加')
        return
      }
      // let allId=null;
      // console.log(this.parentIdAll);
      // if(this.parentIdAll != null){
      //   allId='';
      //   let parentIdAll=this.parentIdAll.split(",");
      //   if(parentIdAll.length>1){
      //     parentIdAll.forEach(v=>{
      //       console.log(v);
      //       if(v != "null"){
      //         allId = allId+v+",";
      //       }
      //     })
      // }
      // }

      this.$router.push({
        path:
          '/personnel/staffInfo/addEmployees/' +
          this.orgId +
          '&' +
          this.parentIdAll
      })
    },
    // 关闭筛选
    cancelForm() {
      this.loading = false
      this.dialog = false
      clearTimeout(this.timer)
    },
    // 导出模板
    uploadModel() {
      const that = this
      const port = that.userHas('upload-staff-excel')
      if (!port) {
        return
      }
      const ajax = axios.create({
        timeout: 20000 // 超时时间
      })
      ajax.interceptors.request.use(config => {
        config.headers['Authorization'] = 'Bearer ' + getToken()
        return config
      })
      ajax.interceptors.response.use(config => {
        return config
      })
      ajax({
        method: 'post',
        url: 'http://39.98.171.233:9004/api/employee/exportTemplate',
        responseType: 'arraybuffer'
      })
        // console.log(123);
        // exportEmployeesModel()
        .then(res => {
          console.log(res)
          that.saveData(res.data, '通讯录人员.xlsx')
        })
        .catch(error => {})
    },
    // 导出员工信息
    exportTempModel(e) {
      this.dialogVisible = true
    },
    // 重置查询
    runReset() {
      this.employeeQuery = {
        employeeId: null,
        employeeName: null,
        orgId: null,
        pageNumber: '1',
        pageSize: '10',
        postId: null,
        postIdList: [],
        rankId: null,
        rankIdList: []
        // status: 2,
      }
      this.total = 0
      this.geteEployees()
    },
    exportTemp(e) {
      const that = this

      const ajax = axios.create({
        timeout: 20000 // 超时时间
      })
      ajax.interceptors.request.use(config => {
        config.headers['Authorization'] = 'Bearer ' + getToken()
        return config
      })
      ajax.interceptors.response.use(config => {
        return config
      })
      const data = this.employeeQuery
      ajax({
        method: 'post',
        url: 'http://39.98.171.233:9004/api/employee/exportTemplates',
        responseType: 'arraybuffer',
        data
      })
        // console.log(123);
        // exportEmployeesModel()
        .then(res => {
          that.saveData(res.data, '员工信息.xlsx')
        })
        .catch(error => {})
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
      a.download = filename
      a.click()
    },
    handleSuccess(e) {
      console.log(e)
      if (e.code === 0) {
        this.$message.success(e.message)
      } else {
        this.$message.error(e.message)
      }
      this.fileList = []
    },
    handlePreview(file) {
      console.log(file)
    },
    // 分页
    handleSizeChange(e) {
      this.employeeQuery.pageSize = e
      this.geteEployees()
    },
    handleCurrentChange(e) {
      this.employeeQuery.pageNumber = e
      this.geteEployees()
    },
    hindleChanged() {},
    // 签署合同
    signTheContract(index, e) {
      const port = this.userHas('staff-manage-popover')
      if (!port) {
        return
      }
      if (!this.contract.labor) {
        this.$message.error('请选择合同进行签署')
        return false
      }
      const { employeeId, employeeName } = e
      this.$router.push({
        path: `/personnel/contractDetail/${employeeId}&0&${employeeName}`
      })
    },
    // 多条件搜索
    searchItem() {
      const list = []
      const { orgIdList } = this.employeeQuery

      if (orgIdList) {
        orgIdList.forEach(v => {
          list.push(v.orgId)
        })
        this.employeeQuery.orgId = list
      }
      this.geteEployees()
      this.$refs.drawer.closeDrawer()
    },
    getStatus(e, index) {
      this.employeeQuery.status = e
      this.isActive = index
      this.geteEployees()
    },
    drawerFun() {
      const port = this.userHas('screen-staff')
      if (!port) {
        return
      }
      this.employeeQuery.status = null
      this.employeeQuery.orgId = null
      this.isActive = null
      this.drawer = true
    },
    getOrgId(e) {
      const { orgId, parentIdAll } = e
      this.parentIdAll = parentIdAll
      this.orgId = orgId
      this.orgActive = orgId
      this.employeeQuery.orgId = orgId
      this.geteEployees()
    },
    // 用户权限按钮
    userHas(e) {
      if (!this.hasButtons(e)) {
        this.$message.error('对不起,你不具备操作权限')
        return false
      } else {
        return true
      }
    },
    // 员工离职
    staffLeave(row) {
      const { employeeId } = row
      const that = this
      that
        .$confirm('此操作将会让员工离职, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          const empIdList = employeeId
          // 删除信息
          addLeaveStaff(empIdList).then(res => {
            if (res.code === 0) {
              that.$message.success(res.message)
              that.geteEployees()
            } else {
              that.$message.error(res.message)
            }
          })
        })
        .catch(err => {})
    },
    // 员工异动
    changeStaff(row) {
      const that = this
      that
        .$confirm('是否对该员工发起异动?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          const { employeeId } = row
          that.form.employeeId = employeeId
          empChange({ empId: employeeId }).then(res => {
            if (res.code === 0) {
              const {
                companyName,
                empId,
                orgName,
                employeeName,
                postName,
                company,
                orgId,
                postId,
                seniority,
                entryDate
              } = res.data
              that.$set(
                that.form,
                'changeBeforeCompanyName',
                companyName || '无'
              )
              that.$set(that.form, 'changeBeforeOrgName', orgName || '无')
              that.$set(that.form, 'changeBeforePostName', postName || '无')
              that.$set(that.form, 'changeBeforeCompanyId', company || null)
              that.$set(that.form, 'changeBeforeOrgId', orgId)
              that.$set(that.form, 'changeBeforePostId', postId)
              that.$set(that.form, 'seniority', seniority || 0)
              that.$set(that.form, 'entryDate', entryDate || null)
              that.$set(that.form, 'employeeName', employeeName || '无')

              that.dialogVisible = true
            }
          })
        })
        .catch(err => {})
    },
    // 增加异动
    submit() {
      let data
      const that = this
      // if(that.option){
      data = addChange(that.form)
      // }else{
      //   data=updataChange(that.form)
      // }
      data.then(res => {
        if (res.code === 0) {
          that.$message.success(res.message)
          that.dialogVisible = false
        } else {
          that.$message.error(res.message)
        }
      })
    },
    // 切换模板
    changeType(e) {
      this.form.changeTempType = e
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
.staff-mian {
  .el-drawer {
    overflow: scroll;
  }
  .staff-btn-list {
    .staff-btn-one {
      display: flex;
    }
    justify-content: space-between;
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
  .box-com {
    display: flex;
    height: 100%;
    .org-box {
      flex: 1;
      height: 100%;
      max-width: 250px;
      min-width: 200px;
      border-right: 1px solid #ededed;
      padding: 10px 5px;
    }
    .main-box {
      flex: 3;
    }
  }
  .contract-box {
    .contract-title {
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
    .contract-submit {
      text-align: right;
      margin: 10px 0;
    }
    .contract-list {
      height: 120px;
    }
  }
  .active {
    color: #1890ff;
  }
  .staff-info {
    line-height: 40px;
    padding: 0 20px;
    border-bottom: 1px solid #ddd;
    margin: 10px 0;
    span {
      cursor: pointer;
    }
  }
}
</style>
