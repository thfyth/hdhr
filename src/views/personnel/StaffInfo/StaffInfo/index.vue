<template>
  <div class="main">
    <el-tabs v-model="activeName" class="staffinfo">
      <el-tab-pane label="个人信息" name="staffInfo">
        <div class="title">
          <span class="title-header">个人基本信息</span>
          <div style="display:inline-block" v-if="userType">
            <span v-if="option" class="font" @click="getStaffInfo">取 消</span>
            <span v-if="option" class="font" @click="updataStaff">保 存</span>
            <span v-else class="font" @click="setStaffInfo">编 辑</span>
          </div>
        </div>
        <div class="staffinfo-box">
          <el-form ref="form" :model="form" label-width="140px">
            <table
              align="center"
              cellspacing="0"
              border="1"
              style="width: 100%; table-layout: fixed"
            >
              <tr>
                <th>姓名</th>
                <td colspan="3">
                  <span v-text="form.employeeName" />
                </td>
                <th>员工编号</th>
                <td colspan="2">
                  <el-input v-model="form.idNo" :disabled="!option" />
                </td>
                <th>入职时间</th>
                <td colspan="3">
                  <el-date-picker
                    v-model="form.entryDate"
                    :disabled="!option"
                    value-format="yyyy-MM-dd"
                    format="yyyy 年 MM 月 dd 日"
                    type="date"
                  />
                </td>
                <td rowspan="6" class="photo">
                  <div v-if="form.photo" class="img-box">
                    <img
                      class="del-img"
                      src="../../../../assets/icon/del-img.png"
                      @click="delImg(form.photo)"
                    >
                  </div>
                  <img
                    v-if="form.photo"
                    :src="form.photo"
                    style="width: 100%"
                  >
                  <!-- <span v-if="form.photo">更换照片</span> -->
                  <span v-else>
                    <el-upload
                      action="http://39.98.171.233:9004/api/employee/file/uploadFile"
                      :show-file-list="false"
                      :on-success="handleImgUrl"
                      :data="uploadData"
                      name="files"
                      :headers="headersData"
                    >
                      <img
                        v-if="imgFolat"
                        :src="form.photo || photo"
                        class="avatar"
                      >
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                  </span>
                </td>
              </tr>
              <tr>
                <th>所属组织</th>
                <td colspan="3">
                  <span v-text="form.company" />
                </td>

                <th>成本划分中心</th>
                <td colspan="2">
                  <el-cascader
                    ref="orgIdCascader"
                    v-model="form.costCenter"
                    :disabled="!option"
                    :options="orgTreeData"
                    :props="orgProps"
                    :show-all-levels="false"
                  />
                </td>
                <th>工作地点</th>
                <td colspan="3">
                  <el-input v-model="form.workplace" :disabled="!option" />
                </td>
              </tr>
              <tr>
                <th>性别</th>
                <td>
                  <el-select
                    v-model="form.sex"
                    :disabled="!option"
                    placeholder="性别"
                  >
                    <el-option
                      v-for="item in sexOptions"
                      :key="item.attrValue"
                      :label="item.attrName"
                      :value="item.attrValue"
                    />
                  </el-select>
                </td>
                <th>年龄</th>
                <td>
                  <el-input v-model="form.age" :disabled="!option" />
                </td>
                <th>身份证号码</th>
                <td colspan="2">
                  <el-input v-model="form.idNo" :disabled="!option" />
                </td>
                <th>出生日期</th>
                <td>
                  <el-date-picker
                    v-model="form.birthday"
                    style="width: 100%"
                    :disabled="!option"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="出生日期"
                  />
                </td>
                <th>籍贯</th>
                <td>
                  <el-input v-model="form.nativePlace" :disabled="!option" />
                </td>
              </tr>
              <tr>
                <th>国籍:</th>
                <td colspan="3">
                  <el-input v-model="form.natives" :disabled="!option" />
                </td>
                <th>政治面貌</th>
                <td colspan="2">
                  <el-select
                    v-model="form.politics"
                    :disabled="!option"
                    placeholder=""
                  >
                    <el-option
                      v-for="item in politicsOptions"
                      :key="item.attrValue"
                      :label="item.attrName"
                      :value="item.attrValue"
                    />
                  </el-select>
                </td>
                <th>民族</th>
                <td>
                  <el-select
                    v-model="form.nation"
                    :disabled="!option"
                    placeholder=""
                  >
                    <el-option
                      v-for="item in nationOptions"
                      :key="item.attrValue"
                      :label="item.attrName"
                      :value="item.attrValue"
                    />
                  </el-select>
                </td>
                <th>户籍性质</th>
                <td>
                  <el-select
                    v-model="form.registerType"
                    :disabled="!option"
                    placeholder=""
                  >
                    <el-option
                      v-for="item in registerOptions"
                      :key="item.attrValue"
                      :label="item.attrName"
                      :value="item.attrValue"
                    />
                  </el-select>
                </td>
              </tr>
              <tr>
                <th>户籍地址</th>
                <td colspan="10">
                  <el-input v-model="form.censusAddress" :disabled="!option" />
                </td>
              </tr>
              <tr>
                <th>现居住地址</th>
                <td colspan="10">
                  <el-input v-model="form.currentAddress" :disabled="!option" />
                </td>
              </tr>
              <tr>
                <th>毕业日期</th>
                <td>
                  <el-date-picker
                    v-model="form.gdDate"
                    :disabled="!option"
                    value-format="yyyy-MM-dd"
                    format="yyyy 年 MM 月 dd 日"
                    type="date"
                  />
                </td>
                <th>毕业学校</th>
                <td colspan="3">
                  <el-input v-model="form.school" :disabled="!option" />
                </td>
                <th>专业</th>
                <td colspan="2">
                  <el-input v-model="form.major" :disabled="!option" />
                </td>
                <th>学历</th>
                <td colspan="2">
                  <el-select
                    v-model="form.education"
                    :disabled="!option"
                    placeholder=""
                  >
                    <el-option
                      v-for="item in educationOptions"
                      :key="item.attrValue"
                      :label="item.attrName"
                      :value="item.attrValue"
                    />
                  </el-select>
                </td>
              </tr>
              <tr>
                <th>学习形式</th>
                <td>
                  <el-select
                    v-model="form.studyType"
                    :disabled="!option"
                    placeholder=""
                  >
                    <el-option
                      v-for="item in studyTypeOptions"
                      :key="item.attrValue"
                      :label="item.attrName"
                      :value="item.attrValue"
                    />
                  </el-select>
                </td>
                <th>技术职称</th>
                <td colspan="3">
                  <el-input v-model="form.technical" :disabled="!option" />
                </td>
                <th>首次工作时间</th>
                <td colspan="2">
                  <el-date-picker
                    v-model="form.workDateOne"
                    style="width: 100%"
                    :disabled="!option"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="出生日期"
                  />
                </td>
                <th>生肖</th>
                <td colspan="2">
                  <el-select
                    v-model="form.zodiacSign"
                    :disabled="!option"
                    placeholder=""
                  >
                    <el-option
                      v-for="item in zodiacSignOptions"
                      :key="item.attrValue"
                      :label="item.attrName"
                      :value="item.attrValue"
                    />
                  </el-select>
                </td>
              </tr>
              <tr>
                <th>微信号</th>
                <td>
                  <el-input v-model="form.vxid" :disabled="!option" />
                </td>
                <th>E-mail</th>
                <td colspan="3">
                  <el-input v-model="form.email" :disabled="!option" />
                </td>
                <th>手机号码</th>
                <td colspan="2">
                  <el-input v-model="form.mobile" :disabled="!option" />
                </td>
                <th>星座</th>
                <td colspan="2">
                  <el-select
                    v-model="form.constellation"
                    :disabled="!option"
                    placeholder=""
                  >
                    <el-option
                      v-for="item in constellationOptions"
                      :key="item.attrValue"
                      :label="item.attrName"
                      :value="item.attrValue"
                    />
                  </el-select>
                </td>
              </tr>
              <tr>
                <th>婚姻状况</th>
                <td>
                  <el-select
                    v-model="form.marriage"
                    :disabled="!option"
                    placeholder=""
                  >
                    <el-option
                      v-for="item in marOptions"
                      :key="item.attrValue"
                      :label="item.attrName"
                      :value="item.attrValue"
                    />
                  </el-select>
                </td>
                <th>生育情况</th>
                <td colspan="3">
                  <el-select
                    v-model="form.fertilityType"
                    :disabled="!option"
                    placeholder="生育情况"
                  >
                    <el-option
                      v-for="item in fertilityOption"
                      :key="item.attrValue"
                      :label="item.attrName"
                      :value="item.attrValue"
                    />
                  </el-select>
                </td>
                <th>健康状况</th>
                <td colspan="2">
                  <el-input v-model="form.healthType" :disabled="!option" />
                </td>
                <th>血型</th>
                <td colspan="2">
                  <el-input v-model="form.bloodType" :disabled="!option" />
                </td>
              </tr>
              <tr>
                <th>特长</th>
                <td colspan="5">
                  <el-input v-model="form.strong" :disabled="!option" />
                </td>
                <th>爱好</th>
                <td colspan="5">
                  <el-input v-model="form.hobby" :disabled="!option" />
                </td>
              </tr>
              <tr>
                <th>工作技能</th>
                <td colspan="11">
                  <el-input
                    v-model="form.skillContent"
                    :disabled="!option"
                    type="textarea"
                  />
                </td>
              </tr>
              <tr>
                <th>自我介绍</th>
                <td colspan="11">
                  <el-input v-model="form.introduce" :disabled="!option" />
                </td>
              </tr>
              <tr>
                <th>备注</th>
                <td colspan="11">
                  <el-input v-model="form.remark" :disabled="!option" />
                </td>
              </tr>
              <tr>
                <th>年度考核记录</th>
                <td colspan="11">
                  <el-input
                    v-model="form.inspectionRecord"
                    :disabled="!option"
                  />
                </td>
              </tr>
              <tr>
                <th>调岗记录</th>
                <td colspan="11">
                  <el-input
                    v-model="form.dutyRecord"
                    :disabled="!option"
                    type="textarea"
                  />
                </td>
              </tr>
              <tr>
                <th>晋升/降职记录</th>
                <td colspan="11">
                  <el-input
                    v-model="form.upDownRecord"
                    :disabled="!option"
                    type="textarea"
                  />
                </td>
              </tr>
              <tr>
                <th>是否在公司购房</th>
                <td colspan="11">
                  <el-input v-model="form.isbuyHouse" :disabled="!option" />
                </td>
              </tr>
              <tr class="table-type">
                <td colspan="12" class="table-list-type">
                  <div class="table-list-box">
                    <div class="table-list-title">
                      奖励记录
                    </div>
                    <div class="table-list-bt">
                      <span class="font" @click="addRewList">增 加</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="12">
                  <div class="table-box title">
                    <el-table
                      v-if="rewData.length > 0"
                      :data="rewData"
                      border
                      max-height="250"
                      style="width: 100%; text-align: center"
                    >
                      <el-table-column label="奖励日期">
                        <template slot-scope="scope">
                          <span
                            class="article"
                            @click="getOneRew(scope.row)"
                            v-text="scope.row.rewardDate"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column prop="rewardDesc" label="奖励详情" />
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-popconfirm
                            title="确定要删除吗?"
                            @onConfirm="delrewList(scope.$index, scope.row)"
                          >
                            <el-button
                              slot="reference"
                              type="text"
                              class="el-icon-delete"
                            >删除</el-button>
                          </el-popconfirm>
                        </template>
                      </el-table-column>
                    </el-table>

                    <!-- <span class="font" @click="addRewList">增 加</span> -->
                  </div>
                </td>
              </tr>
              <tr class="table-type">
                <td colspan="12" class="table-list-type">
                  <div class="table-list-box">
                    <div class="table-list-title">
                      处罚记录
                    </div>
                    <div class="table-list-bt">
                      <span class="font" @click="addpunkList">增 加</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <!-- <th>处罚记录</th> -->
                <td colspan="12">
                  <div class="table-box title">
                    <el-table
                      v-if="punData.length > 0"
                      :data="punData"
                      border
                      max-height="250"
                      style="width: 100%; text-align: center"
                    >
                      <el-table-column label="惩罚日期">
                        <template slot-scope="scope">
                          <span
                            class="article"
                            @click="getOnePun(scope.row)"
                            v-text="scope.row.punishmentDate"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column prop="punishmentDesc" label="惩罚详情" />
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-popconfirm
                            title="确定要删除吗?"
                            @onConfirm="delpunList(scope.$index, scope.row)"
                          >
                            <el-button
                              slot="reference"
                              type="text"
                              class="el-icon-delete"
                            >删除</el-button>
                          </el-popconfirm>
                        </template>
                      </el-table-column>
                    </el-table>

                    <!-- <span class="font" @click="addpunkList">增 加</span> -->
                  </div>
                </td>
              </tr>
              <tr class="table-type">
                <td colspan="12" class="table-list-type">
                  <div class="table-list-box">
                    <div class="table-list-title">
                      教育经历
                    </div>
                    <div class="table-list-bt">
                      <span class="font" @click="addEduList">增 加</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <!-- <th>教育经历</th> -->
                <td colspan="12">
                  <div class="table-box title">
                    <el-table
                      v-if="eduData.length > 0"
                      :data="eduData"
                      max-height="250"
                      style="width: 100%; text-align: center"
                    >
                      <el-table-column label="学校名称" width="85">
                        <template slot-scope="scope">
                          <span
                            class="article"
                            @click="getOneEdu(scope.row)"
                            v-text="scope.row.universityName"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="beginDate"
                        width="85"
                        label="入学时间"
                      />
                      <el-table-column
                        prop="endDate"
                        width="85"
                        label="毕业时间"
                      />
                      <el-table-column prop="degree" width="80" label="学位">
                        <template slot-scope="scope">
                          <el-select
                            v-model="scope.row.degree"
                            disabled
                            placeholder=""
                          >
                            <el-option
                              v-for="item in degreeOptions"
                              :key="item.attrValue"
                              :label="item.attrName"
                              :value="item.attrValue"
                            />
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="degreeName"
                        label="学位名称"
                        width="85"
                      />
                      <el-table-column
                        prop="degreeNo"
                        label="学位证书编号"
                        width="120"
                      />
                      <el-table-column
                        prop="eduHistory"
                        width="80"
                        label="学历"
                      >
                        <template slot-scope="scope">
                          <el-select
                            v-model="scope.row.eduHistory"
                            disabled
                            placeholder=""
                          >
                            <el-option
                              v-for="item in educationOptions"
                              :key="item.attrValue"
                              :label="item.attrName"
                              :value="item.attrValue"
                            />
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="eduUndergo"
                        width="120"
                        label="教育经历描述"
                      />
                      <el-table-column
                        prop="cerNo"
                        label="毕业证书编号"
                        width="120"
                      />
                      <el-table-column
                        prop="major"
                        label="所学专业"
                        width="85"
                      />
                      <el-table-column
                        prop="studyType"
                        width="85"
                        label="学习形式"
                      >
                        <template slot-scope="scope">
                          <el-select
                            v-model="scope.row.studyType"
                            disabled
                            placeholder="学习形式"
                          >
                            <el-option
                              v-for="item in studyTypeOptions"
                              :key="item.attrValue"
                              :label="item.attrName"
                              :value="item.attrValue"
                            />
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <!-- <el-button
                            type="text"
                            class="el-icon-delete"
                            @click="delEduList(scope.$index, scope.row)"
                            >删除</el-button
                          > -->
                          <el-popconfirm
                            title="确定要删除吗?"
                            @onConfirm="delEduList(scope.$index, scope.row)"
                          >
                            <el-button
                              slot="reference"
                              type="text"
                              class="el-icon-delete"
                            >删除</el-button>
                          </el-popconfirm>
                        </template>
                      </el-table-column>
                    </el-table>
                    <!-- <span class="font" @click="addEduList">增 加</span> -->
                  </div>
                </td>
              </tr>
              <tr class="table-type">
                <td colspan="12" class="table-list-type">
                  <div class="table-list-box">
                    <div class="table-list-title">
                      工作经历
                    </div>
                    <div class="table-list-bt">
                      <span class="font" @click="addWorkList">增 加</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <!-- <th>工作经历</th> -->
                <td colspan="12">
                  <div class="table-box title">
                    <el-table
                      v-if="jobData.length > 0"
                      :data="jobData"
                      border
                      max-height="250"
                      style="width: 100%; text-align: center"
                    >
                      <el-table-column label="公司名称">
                        <template slot-scope="scope">
                          <span
                            class="article"
                            @click="getOneCompany(scope.row)"
                            v-text="scope.row.companyName"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column prop="beginDate" label="入职时间" />
                      <el-table-column prop="endDate" label="离职时间" />
                      <el-table-column label="公司规模">
                        <template slot-scope="scope">
                          <el-select
                            v-model="scope.row.companyScale"
                            disabled
                            placeholder=""
                          >
                            <el-option
                              v-for="item in companyScaleOption"
                              :key="item.attrValue"
                              :label="item.attrName"
                              :value="item.attrValue"
                            />
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column label="同部门人数">
                        <template slot-scope="scope">
                          <el-select
                            v-model="scope.row.deptNo"
                            disabled
                            placeholder=""
                          >
                            <el-option
                              v-for="item in deptNoOption"
                              :key="item.attrValue"
                              :label="item.attrName"
                              :value="item.attrValue"
                            />
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column label="离职原因">
                        <template slot-scope="scope">
                          <el-select
                            v-model="scope.row.dimCause"
                            disabled
                            placeholder=""
                          >
                            <el-option
                              v-for="item in dimCauseOption"
                              :key="item.attrValue"
                              :label="item.attrName"
                              :value="item.attrValue"
                            />
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="dimPay" label="离职薪资" />
                      <el-table-column prop="postName" label="职位/职务" />
                      <el-table-column prop="voucher" label="证明人" />
                      <el-table-column
                        prop="voucherMobile"
                        label="证明人联系电话"
                      />
                      <el-table-column prop="jobDesc" label="备注" />
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-popconfirm
                            title="确定要删除吗?"
                            @onConfirm="delWorkList(scope.$index, scope.row)"
                          >
                            <el-button
                              slot="reference"
                              type="text"
                              class="el-icon-delete"
                            >删除</el-button>
                          </el-popconfirm>
                        </template>
                      </el-table-column>
                    </el-table>

                    <!-- <span class="font" @click="addWorkList">增 加</span> -->
                  </div>
                </td>
              </tr>
              <tr class="table-type">
                <td colspan="12" class="table-list-type">
                  <div class="table-list-box">
                    <div class="table-list-title">
                      紧急联系人
                    </div>
                    <div class="table-list-bt">
                      <span class="font" @click="contactsFun">增 加</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <!-- <th>紧急联系人</th> -->
                <td colspan="12">
                  <div class="table-box title">
                    <el-table
                      v-if="contactsData.length > 0"
                      :data="contactsData"
                      border
                      style="width: 100%"
                    >
                      <el-table-column prop="name" label="姓名">
                        <template slot-scope="scope">
                          <span
                            class="article"
                            @click="getOneContact(scope.row)"
                            v-text="scope.row.name"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column prop="mobile" label="手机" />
                      <el-table-column
                        label="与本人关系"
                        prop="relationValue"
                      />
                      <el-table-column prop="address" label="联系地址" />
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-popconfirm
                            title="确定要删除吗?"
                            @onConfirm="delContactList(scope.$index, scope.row)"
                          >
                            <el-button
                              slot="reference"
                              type="text"
                              class="el-icon-delete"
                            >删除</el-button>
                          </el-popconfirm>
                        </template>
                      </el-table-column>
                    </el-table>
                    <!-- <span class="font" @click="contactsFun">增 加</span> -->
                  </div>
                </td>
              </tr>
              <tr class="table-type">
                <td colspan="12" class="table-list-type">
                  <div class="table-list-box">
                    <div class="table-list-title">
                      家庭成员
                    </div>
                    <div class="table-list-bt">
                      <span class="font" @click="familyFun">增 加</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <!-- <th>家庭成员</th> -->
                <td colspan="12">
                  <div class="table-box title">
                    <el-table
                      v-if="famyData.length > 0"
                      :data="famyData"
                      border
                      algin="center"
                      style="width: 100%"
                    >
                      <el-table-column label="姓名">
                        <template slot-scope="scope">
                          <span
                            class="article"
                            @click="getOneFam(scope.row)"
                            v-text="scope.row.name"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column prop="mobile" label="手机" />
                      <el-table-column
                        prop="relationValue"
                        label="与本人关系"
                      />
                      <el-table-column prop="address" label="联系地址" />
                      <el-table-column label="政治面貌">
                        <template slot-scope="scope">
                          <el-select
                            v-model="scope.row.politics"
                            disabled
                            placeholder=""
                          >
                            <el-option
                              v-for="item in politicsOptions"
                              :key="item.attrValue"
                              :label="item.attrName"
                              :value="item.attrValue"
                            />
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="position" label="职位/职务" />
                      <el-table-column prop="jobUnit" label="工作单位" />
                      <el-table-column prop="post" label="岗位" />
                      <el-table-column prop="dept" label="部门" />
                      <el-table-column
                        prop="cultureLevelValue"
                        label="文化程度"
                      />
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-popconfirm
                            title="确定要删除吗?"
                            @onConfirm="delFamList(scope.$index, scope.row)"
                          >
                            <el-button
                              slot="reference"
                              type="text"
                              class="el-icon-delete"
                            >删除</el-button>
                          </el-popconfirm>
                        </template>
                      </el-table-column>
                    </el-table>
                    <!-- <span class="font" @click="familyFun">增 加</span> -->
                  </div>
                </td>
              </tr>
              <tr class="table-type">
                <td colspan="12" class="table-list-type">
                  <div class="table-list-box">
                    <div class="table-list-title">
                      职称
                    </div>
                    <div class="table-list-bt">
                      <span class="font" @click="levelFun">增 加</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <!-- <th>职称</th> -->
                <td colspan="12">
                  <div class="table-box title">
                    <el-table
                      v-if="titleData.length > 0"
                      :data="titleData"
                      border
                      style="width: 100%"
                    >
                      <el-table-column label="职称名称">
                        <template slot-scope="scope">
                          <span
                            class="article"
                            @click="getOneTitle(scope.row)"
                            v-text="scope.row.name"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column label="职称级别">
                        <template slot-scope="scope">
                          <el-select
                            v-model="scope.row.level"
                            disabled
                            placeholder=""
                          >
                            <el-option
                              v-for="item in titleLevelOption"
                              :key="item.attrValue"
                              :label="item.attrName"
                              :value="item.attrValue"
                            />
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column label="获得方式">
                        <template slot-scope="scope">
                          <el-select
                            v-model="scope.row.getWay"
                            disabled
                            placeholder=""
                          >
                            <el-option
                              v-for="item in titleOption"
                              :key="item.attrValue"
                              :label="item.attrName"
                              :value="item.attrValue"
                            />
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="getDate" label="获得日期" />
                      <el-table-column prop="assess" label="评定机构" />
                      <el-table-column prop="ccieNo" label="证书编号" />
                      <el-table-column prop="titleDesc" label="职称备注" />
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-popconfirm
                            title="确定要删除吗?"
                            @onConfirm="delOneTitlt(scope.$index, scope.row)"
                          >
                            <el-button
                              slot="reference"
                              type="text"
                              class="el-icon-delete"
                            >删除</el-button>
                          </el-popconfirm>
                        </template>
                      </el-table-column>
                    </el-table>
                    <!-- <span class="font" @click="levelFun">增 加</span> -->
                  </div>
                </td>
              </tr>
              <tr class="table-type">
                <td colspan="12" class="table-list-type">
                  <div class="table-list-box">
                    <div class="table-list-title">
                      证书
                    </div>
                    <div class="table-list-bt">
                      <span class="font" @click="ccieFun">增 加</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <!-- <th>证书</th> -->
                <td colspan="12">
                  <div class="table-box title">
                    <el-table
                      v-if="ccieData.length > 0"
                      :data="ccieData"
                      border
                      style="width: 100%"
                    >
                      <el-table-column label="证书名称">
                        <template slot-scope="scope">
                          <span
                            class="article"
                            @click="getOneCcie(scope.row)"
                            v-text="scope.row.ccieName"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column prop="ccieTypeValue" label="证书类型" />
                      <el-table-column prop="ccieNo" label="证书编号" />
                      <el-table-column prop="ccieLevel" label="证书级别" />
                      <el-table-column prop="major" label="毕业专业" />
                      <el-table-column prop="ccieOrg" label="发证机构" />
                      <el-table-column prop="ccieDate" label="发证日期" />
                      <el-table-column prop="startDate" label="有效起始日期" />
                      <el-table-column prop="endDate" label="有效结束日期" />
                      <el-table-column prop="ccieDesc" label="备注" />
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-popconfirm
                            title="确定要删除吗?"
                            @onConfirm="delOneCcie(scope.$index, scope.row)"
                          >
                            <el-button
                              slot="reference"
                              type="text"
                              class="el-icon-delete"
                            >删除</el-button>
                          </el-popconfirm>
                        </template>
                      </el-table-column>
                    </el-table>

                    <!-- <span class="font" @click="ccieFun">增 加</span> -->
                  </div>
                </td>
              </tr>
              <tr class="table-type">
                <td colspan="12" class="table-list-type">
                  <div class="table-list-box">
                    <div class="table-list-title">
                      培训经历
                    </div>
                    <div class="table-list-bt">
                      <span class="font" @click="trainFun">增 加</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <!-- <th>培训经历</th> -->
                <td colspan="12">
                  <div class="table-box title">
                    <el-table
                      v-if="trainData.length > 0"
                      :data="trainData"
                      border
                      style="width: 100%"
                    >
                      <el-table-column label="培训名称">
                        <template slot-scope="scope">
                          <span
                            class="article"
                            @click="getOneTrain(scope.row)"
                            v-text="scope.row.trainName"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column prop="startDate" label="开始日期" />
                      <el-table-column prop="endDate" label="结束日期" />
                      <el-table-column prop="grade" label="成绩" />
                      <el-table-column prop="ccieName" label="证书名称" />
                      <el-table-column prop="ccieNo" label="证书编号" />
                      <el-table-column prop="period" label="总学时" />
                      <el-table-column prop="trainDesc" label="备注" />
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-popconfirm
                            title="确定要删除吗?"
                            @onConfirm="delOneTrain(scope.$index, scope.row)"
                          >
                            <el-button
                              slot="reference"
                              type="text"
                              class="el-icon-delete"
                            >删除</el-button>
                          </el-popconfirm>
                        </template>
                      </el-table-column>
                    </el-table>
                    <!-- <span class="font" @click="trainFun">增 加</span> -->
                  </div>
                </td>
              </tr>
              <tr class="table-type">
                <td colspan="12" class="table-list-type">
                  <div class="table-list-box">
                    <div class="table-list-title">
                      语言能力
                    </div>
                    <div class="table-list-bt">
                      <span class="font" @click="langFun">增 加</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <!-- <th>语言能力</th> -->
                <td colspan="12">
                  <div class="table-box title">
                    <el-table
                      v-if="langData.length > 0"
                      :data="langData"
                      border
                      style="width: 100%"
                    >
                      <el-table-column label="语种" align="center">
                        <template slot-scope="scope">
                          <span
                            class="article"
                            @click="getOneLan(scope.row)"
                            v-text="scope.row.languageName"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="level"
                        align="center"
                        label="掌握程度"
                      />
                      <el-table-column
                        prop="languageDesc"
                        label="备注"
                        align="center"
                      />
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-popconfirm
                            title="确定要删除吗?"
                            @onConfirm="delOneLang(scope.$index, scope.row)"
                          >
                            <el-button
                              slot="reference"
                              type="text"
                              class="el-icon-delete"
                            >删除</el-button>
                          </el-popconfirm>
                        </template>
                      </el-table-column>
                    </el-table>
                    <!-- <span class="font" @click="langFun">增 加</span> -->
                  </div>
                </td>
              </tr>
            </table>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="在职信息" name="information">
        <div class="title">
          <span class="title-header">在职信息</span>
          <div style="display:inline-block" v-if="userType">
            <span v-if="option" class="font" @click="getStaffInfo">取 消</span>
            <span v-if="option" class="font" @click="updataStaff">保 存</span>
            <span v-else class="font" @click="setStaffInfo">编 辑</span>
          </div>
        </div>
        <el-form ref="form" :model="form" label-width="140px" border>
          <table
            align="center"
              cellspacing="0"
              border="1"
              style="width: 100%; table-layout: fixed"
          >
            <tr>
              <th>员工类型</th>
              <td>
                <el-select
                  :disabled="!option"
                  ref="selection"
                  v-model="form.employeeType"
                  placeholder="员工类型"
                >
                  <el-option
                    v-for="item in employeeOptions"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </td>
              <th>用工方式</th>
              <td>
                <el-select
                  :disabled="!option"
                  v-model="form.employmentModule"
                  placeholder="用工方式"
                >
                  <el-option
                    v-for="item in employmentOptions"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </td>
              <th>最近一次签合同日期</th>
              <td>
                <el-date-picker
                    v-model="form.contractRecently"
                    :disabled="!option"
                    value-format="yyyy-MM-dd"
                    format="yyyy 年 MM 月 dd 日"
                    type="date"
                  />
              </td>
            </tr>
            <tr>
              <th>合同到期日期</th>
              <td>
                <el-date-picker
                    v-model="form.contractEnd"
                    :disabled="!option"
                    value-format="yyyy-MM-dd"
                    format="yyyy 年 MM 月 dd 日"
                    type="date"
                  />
              </td>
              <th>合同签署公司</th>
              <td>
                <el-input :disabled="!option" v-model="form.contractCompany" />
              </td>
              <th>第几次签订合同</th>
              <td>
                <el-input :disabled="!option" v-model="form.contractHow" />
              </td>
            </tr>
            <tr>
              <th>连续第几次签订合同</th>
              <td>
                <el-input :disabled="!option" v-model="form.contractContinuous" />
              </td>
              <th>入职日期</th>
              <td>
                 <el-date-picker
                    v-model="form.entryDate"
                    :disabled="!option"
                    value-format="yyyy-MM-dd"
                    format="yyyy 年 MM 月 dd 日"
                    type="date"
                  />
              </td>
              <th>工龄</th>
              <td>
                <el-input :disabled="!option" v-model="form.workingYears" />
              </td>
            </tr>
            <tr>
              <th>办公室座机</th>
              <td>
                <el-input :disabled="!option" v-model="form.officePhone" />
              </td>
              <th>拟转正日期</th>
              <td>
                <el-date-picker
                    v-model="form.planBecome"
                    :disabled="!option"
                    value-format="yyyy-MM-dd"
                    format="yyyy 年 MM 月 dd 日"
                    type="date"
                  />
              </td>
              <th>司龄</th>
              <td>
                <el-input :disabled="!option" v-model="form.seniority" />
              </td>
            </tr>
            <tr>
              <th>工时类型</th>
              <td>
                <el-select
                  :disabled="!option"
                  v-model="form.workingType"
                  placeholder="工时类型"
                >
                  <el-option
                    v-for="item in workingOptions"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </td>
              <th>实际转正日期</th>
              <td>
                <el-date-picker
                    v-model="form.realityBecome"
                    :disabled="!option"
                    value-format="yyyy-MM-dd"
                    format="yyyy 年 MM 月 dd 日"
                    type="date"
                  />
              </td>
              <th>司龄开始日期</th>
              <td>
                <el-date-picker
                    v-model="form.seniorityBeginDate"
                    :disabled="!option"
                    value-format="yyyy-MM-dd"
                    format="yyyy 年 MM 月 dd 日"
                    type="date"
                  />
              </td>
            </tr>
            <tr>
              <th>工作地点</th>
              <td>
                <el-input :disabled="!option" v-model="form.workplace" />
              </td>
              <th>是否有试用期</th>
              <td>
                <el-select
                  :disabled="!option"
                  v-model="form.isPeriod"
                  placeholder="是否有试用期"
                >
                  <el-option
                    v-for="item in isPeriodOptions"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </td>
              <th>开始工作日期</th>
              <td>
                <el-date-picker
                    v-model="form.startWorkDate"
                    :disabled="!option"
                    value-format="yyyy-MM-dd"
                    format="yyyy 年 MM 月 dd 日"
                    type="date"
                  />
              </td>
            </tr>
            <tr>
              <th>企业邮箱</th>
              <td>
                <el-input :disabled="!option" v-model="form.firmEmail" />
              </td>
              <th>部门</th>
              <td>
                <el-cascader
                  ref="orgIdCascader"
                  v-model="form.orgId"
                  :disabled="!option"
                  :options="orgTreeData"
                  :props="orgProps"
                  :show-all-levels="false"
                />
              </td>
              <th>岗位</th>
              <td>
                <el-select
                  v-model="form.postId"
                  :disabled="!option"
                  placeholder="岗位"
                >
                  <el-option
                    v-for="item in postOptions"
                    :key="item.postId"
                    :label="item.postName"
                    :value="item.postId"
                  />
                </el-select>
              </td>
            </tr>
          </table>
          <!-- <el-form-item>
            <el-button type="primary" @click="onSubmit">保存信息</el-button>
          </el-form-item>-->
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="五险一金" name="insurances">
        <div class="title">
          <span class="title-header">五险一金</span>
          <div style="display:inline-block" v-if="userType">
            <span v-if="option" class="font" @click="getStaffInfo">取 消</span>
            <span v-if="option" class="font" @click="updataInsurances">保 存</span>
            <span v-else class="font" @click="setStaffInfo">编 辑</span>
          </div>
        </div>
        <el-form>
          <table
            align="center"
            cellspacing="0"
            border="1"
            style="width: 100%; table-layout: fixed"
          >
            <tr>
              <th>姓名</th>
              <td>
                <span v-text="form.employeeName" />
              </td>
              <th>身份证号码</th>
              <td>
                <span v-text="form.idNo" />
              </td>
              <th>社保编号</th>
              <td>
                <el-input :disabled="!option" v-model="socialForm.socialCode" />
              </td>
            </tr>
            <tr>
              <!-- <th>社保参保状态</th> -->
              <!-- <td>
                <el-input :disabled="!option" v-model="socialForm.socialStatusName" />
              </td> -->
              <th>社保户籍性性质</th>
              <td>
                <el-input :disabled="!option" v-model="socialForm.socialRegistrationType" />
              </td>
              <th>社保参保地</th>
              <td>
                <el-input :disabled="!option" v-model="socialForm.socialAddress" />
              </td>
              <th>社保缴纳基数</th>
              <td>
                <el-input :disabled="!option" v-model="socialForm.socialPayBase" />
              </td>
            </tr>
            <tr>
              <th>公积金参保地</th>
              <td>
                <el-input :disabled="!option" v-model="socialForm.fundAddress" />
              </td>
              <th>公积金户籍性质</th>
              <td>
                <el-input :disabled="!option" v-model="socialForm.fundRegistrationType" />
              
              </td>
              <th>公积金缴纳基数</th>
              <td>
                <el-input :disabled="!option" v-model="socialForm.fundPayBase" />
              </td>
            </tr>
             <tr>
              
              <!-- <th>公积金参保状态</th> -->
              <!-- <td>
                <el-input :disabled="!option" v-model="socialForm.fundStatusName" />
                
              </td> -->
              <th>公积金编号</th>
              <td>
                <el-input :disabled="!option" v-model="socialForm.fundCode" />
              </td>
            </tr>
          </table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="考勤信息" name="wages" class="wages">
        <div class="title-box" style="width: auto">
          <div class="title-list">
            <div class="list-box">
              <span class="title">查询类型:</span>
              <el-select
                v-model="attendQuery.type"
                placeholder=""
                @change="changeTime"
              >
                <el-option
                  v-for="item in timeOpt"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div v-if="attendQuery.type" class="list-box">
              <span class="title">日期:</span>
              <el-date-picker
                v-if="attendQuery.type == 'month'"
                v-model="attendQuery.month"
                type="month"
                style="width: 200px"
                value-format="yyyy-MM"
                placeholder="选择月"
              />
              <el-date-picker
                v-else
                v-model="attendQuery.month"
                type="date"
                style="width: 200px"
                value-format="yyyy-MM-dd"
                placeholder="选择日"
              />
            </div>
            <div class="list-box">
              <el-button
                class="insert"
                @click="getAttendDetail"
              >查询</el-button>
            </div>
            <div class="list-box">
              <el-button class="resetting" @click="resetWages">重置</el-button>
            </div>
          </div>
        </div>
        <el-table :data="attendData" style="width: 100%">
          <el-table-column type="index" align="center" label="序号" />
          <el-table-column align="center" label="打卡类型">
            <template slot-scope="{ row }">
              <span v-if="row.clockType == 'OnDuty'">上班</span>
              <span v-if="row.clockType == 'OffDuty'">下班</span>
            </template>
          </el-table-column>
          <el-table-column prop="clockTime" align="center" label="打卡时间" />
          <el-table-column label="打卡结果" align="center">
            <template slot-scope="{ row }">
              <span v-if="row.result == 'Normal'">正常</span>
              <span v-if="row.result == 'Early'">早退</span>
              <span v-if="row.result == 'Late'">迟到</span>
              <span v-if="row.result == 'SeriousLate'">严重迟到</span>
              <span v-if="row.result == 'Absenteeism'">旷工</span>
              <span v-if="row.result == 'NotSigned'">未打卡</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="人事合同" name="contract">
        <el-table
          :data="contractData"
          :header-cell-style="{ background: '#F7F8FA', color: '#293B59' }"
          max-height="450"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" />
          <el-table-column label="合同名称">
            <template slot-scope="{ row }">
              <span
                class="article"
                @click="viewContract(row)"
                v-text="row.contractName"
              />
            </template>
          </el-table-column>
          <el-table-column prop="contractDesc" label="合同说明" />
          <el-table-column prop="signDate" label="签署日期" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="个人文件" name="documents">
        <el-table
          :data="filesData"
          :header-cell-style="{ background: '#F7F8FA', color: '#293B59' }"
          max-height="450"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" />
          <el-table-column label="文件名称">
            <template slot-scope="{ row }">
              <span class="article" v-text="row.file_name" />
            </template>
          </el-table-column>
          <el-table-column prop="purpose" label="用途" />
          <el-table-column label="查看">
            <template slot-scope="{row}">
              <el-button type="text" @click="viewFiles(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div class="models">
      <el-dialog title="教育经历" :visible.sync="editVisible" width="50%">
        <el-form ref="form" :model="educationForm" label-width="150px">
          <el-form-item label="学校名称:">
            <el-input v-model="educationForm.universityName" :required="true" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入学时间:">
                <el-date-picker
                  v-model="educationForm.beginDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy 年 MM 月 dd 日"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="毕业时间:">
                <el-date-picker
                  v-model="educationForm.endDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy 年 MM 月 dd 日"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="学位:">
                <el-select v-model="educationForm.degree" placeholder="学位">
                  <el-option
                    v-for="item in degreeOptions"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学位名称:">
                <el-input v-model="educationForm.degreeName" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="学位证书编号:">
                <el-input v-model="educationForm.degreeNo" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学历:">
                <el-select
                  v-model="educationForm.eduHistory"
                  placeholder="学历"
                >
                  <el-option
                    v-for="item in educationOptions"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="教育经历描述:">
                <el-input v-model="educationForm.eduUndergo" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="毕业证书编号:">
                <el-input v-model="educationForm.cerNo" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="所学专业:">
                <el-input v-model="educationForm.major" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学习形式:">
                <el-select
                  v-model="educationForm.studyType"
                  placeholder="学习形式"
                >
                  <el-option
                    v-for="item in studyTypeOptions"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="工作经历" :visible.sync="editVisible1" width="50%">
        <el-form ref="form" :model="workForm" label-width="150px">
          <el-form-item label="公司名称:" :required="true">
            <el-input v-model="workForm.companyName" :required="true" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职时间:">
                <el-date-picker
                  v-model="workForm.beginDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy 年 MM 月 dd 日"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="离职时间:">
                <el-date-picker
                  v-model="workForm.endDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy 年 MM 月 dd 日"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="公司规模:">
                <el-select
                  v-model="workForm.companyScale"
                  placeholder="公司规模"
                >
                  <el-option
                    v-for="item in companyScaleOption"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="同部门人数:">
                <el-select v-model="workForm.deptNo" placeholder="同部门人数">
                  <el-option
                    v-for="item in deptNoOption"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="离职原因:">
                <el-select v-model="workForm.dimCause" placeholder="离职原因">
                  <el-option
                    v-for="item in dimCauseOption"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="离职薪资:">
                <el-input v-model="workForm.dimPay" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="职位/职务:">
                <el-input v-model="workForm.postName" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="证明人:">
                <el-input v-model="workForm.voucher" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="证明人联系电话:">
                <el-input v-model="workForm.voucherMobile" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注:">
                <el-input v-model="workForm.jobDesc" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="workSaveEdit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="紧急联系人" :visible.sync="editVisible2" width="40%">
        <el-form ref="form" :model="contactsForm" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名:" :required="true">
                <el-input v-model="contactsForm.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机:" :required="true">
                <el-input v-model="contactsForm.mobile" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="与本人关系:">
                <el-select
                  v-model="contactsForm.relation"
                  placeholder="与本人关系"
                >
                  <el-option
                    v-for="item in relationOption"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系地址:">
                <el-input v-model="contactsForm.address" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="contactSaveEdit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="家庭信息" :visible.sync="editVisible3" width="40%">
        <el-form ref="form" :model="familyForm" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名:" :required="true">
                <el-input v-model="familyForm.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机:" :required="true">
                <el-input v-model="familyForm.mobile" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="与本人关系:">
                <el-select
                  v-model="familyForm.relation"
                  placeholder="与本人关系"
                >
                  <el-option
                    v-for="item in relationOption"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系地址:">
                <el-input v-model="familyForm.address" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="政治面貌:">
                <el-select v-model="familyForm.politics" placeholder="政治面貌">
                  <el-option
                    v-for="item in politicsOptions"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职位/职务:">
                <el-input v-model="familyForm.position" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="工作单位:">
                <el-input v-model="familyForm.jobUnit" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="岗位:">
                <el-input v-model="familyForm.post" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门:">
                <el-input v-model="familyForm.dept" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文化程度:">
                <el-select
                  v-model="familyForm.cultureLevel"
                  placeholder="文化程度"
                >
                  <el-option
                    v-for="item in educationOptions"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="familySaveEdit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="职称管理" :visible.sync="editVisible4" width="40%">
        <el-form ref="form" :model="titleForm" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="职称名称:" :required="true">
                <el-input v-model="titleForm.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职称级别:" :required="true">
                <el-select v-model="titleForm.level" placeholder="职称级别">
                  <el-option
                    v-for="item in titleLevelOption"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="获得方式:">
                <el-select v-model="titleForm.getWay" placeholder="获得方式">
                  <el-option
                    v-for="item in titleOption"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="获得日期:">
                <el-date-picker
                  v-model="titleForm.getDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy 年 MM 月 dd 日"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="评定机构:">
                <el-input v-model="titleForm.assess" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证书编号:">
                <el-input v-model="titleForm.ccieNo" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="职称备注:">
            <el-input v-model="titleForm.titleDesc" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible4 = false">取 消</el-button>
          <el-button type="primary" @click="titleSaveEdit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="证书管理" :visible.sync="editVisible5" width="40%">
        <el-form ref="form" :model="ccieForm" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="证书名称:" :required="true">
                <el-input v-model="ccieForm.ccieName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证书类型:">
                <el-select v-model="ccieForm.ccieType" placeholder="证书类型">
                  <el-option
                    v-for="item in ccieTypeOption"
                    :key="item.attrValue"
                    :label="item.attrName"
                    :value="item.attrValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="证书编号:">
                <el-input v-model="ccieForm.ccieNo" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证书级别:">
                <el-input v-model="ccieForm.ccieLevel" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="毕业专业:">
                <el-input v-model="ccieForm.major" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发证机构:">
                <el-input v-model="ccieForm.ccieOrg" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发证日期:">
                <el-date-picker
                  v-model="ccieForm.ccieDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy 年 MM 月 dd 日"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="有效起始日期:">
                <el-date-picker
                  v-model="ccieForm.startDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy 年 MM 月 dd 日"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="有效结束日期:">
                <el-date-picker
                  v-model="ccieForm.endDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy 年 MM 月 dd 日"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注:">
            <el-input v-model="ccieForm.ccieDesc" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible5 = false">取 消</el-button>
          <el-button type="primary" @click="ccieSaveEdit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="培训经历" :visible.sync="editVisible6" width="40%">
        <el-form ref="form" :model="trainForm" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="培训名称:" :required="true">
                <el-input v-model="trainForm.trainName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始日期:">
                <el-date-picker
                  v-model="trainForm.startDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy 年 MM 月 dd 日"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="结束日期:">
                <el-date-picker
                  v-model="trainForm.endDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy 年 MM 月 dd 日"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="成绩:">
                <el-input v-model="trainForm.grade" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="证书名称:">
                <el-input v-model="trainForm.ccieName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证书编号:">
                <el-input v-model="trainForm.ccieNo" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="总学时:">
                <el-input v-model="trainForm.period" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注:">
            <el-input v-model="trainForm.trainDesc" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible6 = false">取 消</el-button>
          <el-button type="primary" @click="trainSaveEdit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="语言能力" :visible.sync="editVisible7" width="40%">
        <el-form ref="form" :model="langForm" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="语种:" :required="true">
                <el-input v-model="langForm.languageName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="掌握程度:">
                <el-input v-model="langForm.level" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注:">
            <el-input v-model="langForm.languageDesc" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible7 = false">取 消</el-button>
          <el-button type="primary" @click="langSaveEdit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="员工惩罚" :visible.sync="editVisible8" width="40%">
        <el-form ref="form" :model="punForm" label-width="120px">
          <el-form-item label="惩罚日期:" :required="true">
            <el-date-picker
              v-model="punForm.punishmentDate"
              value-format="yyyy-MM-dd"
              format="yyyy 年 MM 月 dd 日"
              type="date"
              placeholder="惩罚日期"
            />
          </el-form-item>

          <el-form-item label="惩罚详情:">
            <el-input v-model="punForm.punishmentDesc" type="textarea" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible8 = false">取 消</el-button>
          <el-button type="primary" @click="punSaveEdit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="员工奖励" :visible.sync="editVisible9" width="40%">
        <el-form ref="form" :model="rewForm" label-width="120px">
          <el-form-item label="奖励日期:" :required="true">
            <el-date-picker
              v-model="rewForm.rewardDate"
              value-format="yyyy-MM-dd"
              format="yyyy 年 MM 月 dd 日"
              type="date"
              placeholder="奖励日期"
            />
          </el-form-item>

          <el-form-item label="奖励详情:">
            <el-input v-model="rewForm.rewardDesc" type="textarea" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible9 = false">取 消</el-button>
          <el-button type="primary" @click="rewSaveEdit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'

import {
  getIdEmployees,
  updateEmployees,
  addEdu,
  delEdu,
  updateEdu,
  getEdu,
  addJob,
  delJob,
  updateJob,
  getJob,
  addFamily,
  delFamily,
  updateFamily,
  getFamily,
  addTitle,
  delTitle,
  updateTitle,
  getTitle,
  addContact,
  delContact,
  updateContact,
  getContact,
  addCcie,
  delCcie,
  updateCcie,
  getCcie,
  addTrain,
  delTrain,
  updateTrain,
  getTrain,
  addLanguage,
  delLanguage,
  updateLanguage,
  getLanguage,
  delPun,
  addPun,
  getOnePun,
  updataPun,
  delRew,
  addRew,
  getOneRew,
  updataRew,
  getPost,
  getOrg,
  getRank,
  delFiles,
  // 获取五险一金
  getOneSocialFund,
  getOneAttend,
  getUserFile,
  getUserContract,
  getAttendInfo
} from '@/api/personnel/staff'
import { getAttrMenu } from '@/api/attrManage'
import { selectAllDrop } from '@/api/user'
import { some } from 'sockjs-client/lib/transport-list'
import { getBayIdManOrg } from '@/api/management/orgManage'
import { updateSocia } from "@/api/socialsecurity";
export default {
  data() {
    return {
      // 教育表单
      educationForm: {},
      // 工作表单
      workForm: {},
      // 紧急联系人表单
      contactsForm: {},
      // 家庭信息表单
      familyForm: {},
      // 教育经历data
      eduData: [],
      // 职称表单
      titleForm: {},
      titleOption: [],
      titleLevelOption: [],
      // 证书表单
      ccieForm: {},
      ccieTypeOption: [],
      // 培训经历
      trainForm: {},
      // 语言能力
      langForm: {},
      // 员工惩罚
      punForm: {},
      // 判断是增加教育经历还是更新教育经历 true为增加
      eduOperation: false,
      editVisible: false,
      editVisible1: false,
      editVisible2: false,
      editVisible3: false,
      editVisible4: false,
      editVisible5: false,
      editVisible6: false,
      editVisible7: false,
      editVisible8: false,
      editVisible9: false,
      activeName: 'staffInfo',
      form: {},
      option: false,
      // 员工类型下拉框
      employeeOptions: [],
      // 用工方式下拉框
      employmentOptions: [],
      // 最高学位下拉框
      degreeOptions: [],
      // 与本人关系下拉框
      relationOption: [],
      sexOptions: [],
      educationOptions: [],
      // 民族下拉框
      nationOptions: [],
      // 离职原因
      dimCauseOption: [],
      // 同部门人数
      deptNoOption: [],
      // 星座
      constellationOptions: [],
      // 政治面貌下拉框
      politicsOptions: [],
      // 户籍性质下拉框
      registerOptions: [],
      // 工时类型下拉框
      workingOptions: [],
      // 是否有试用期下拉框
      isPeriodOptions: [],
      // 生肖下拉框
      zodiacSignOptions: [],
      // 学习形式下拉框
      studyTypeOptions: [],
      // 公司规模companyScaleOption
      companyScaleOption: [],
      // 生育情况
      fertilityOption: [],
      // 异动情况
      changeOption: [],
      // 下拉框值lable
      optionData: {
        employeeLable: '',
        employmentModuleLable: '',
        degreeLable: '',
        education: '',
        workingType: '',
        isPeriod: '',
        zodiacSign: ''
      },
      orgProps: {
        label: 'orgName',
        value: 'orgId',
        checkStrictly: true,
        emitPath: false
      },
      // 组织请求参数
      orgQuery: {
        orgName: null,
        orgShortName: null,
        orgType: 0,
        pageNumber: '1',
        pageSize: '10',
        parentId: null
      },
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
        rankIdList: []
      },
      headersData: {
        Authorization: 'Bearer ' + getToken()
      },
      uploadData: {
        employeeId: '',
        purpose: 1,
        actId: this.$route.params.employeeId
      },
      files: [],
      // 员工id
      employeeId: null,
      // 用户操作判断 true为新增，fasle为修改
      handleType: false,
      optios: [],
      jobData: [],
      contactsData: [],
      titleData: [],
      ccieData: [],
      langData: [],
      famyData: [],
      trainData: [],
      punData: [],
      rewData: [],
      rewForm: {},
      marOptions: [],
      orgTreeData: [],
      rankOptions: [],
      postOptions: [],
      socialForm: {},
      contractData: [],
      filesData: [],
      // 考勤请求参数
      attendQuery: {
        empId: this.$route.params.employeeId,
        month: null,
        type: null
      },
      timeOpt: [
        {
          label: '月',
          value: 'month'
        },
        {
          label: '日',
          value: 'day'
        }
      ],
      attendData: [],
      //员工类型 true为在职，false为离职
      userType:true,
    }
  },
  created() {
    this.getById()
    this.getOption()
    // this.getOptions();
    // this.getComData();
    this.getInfo()
    this.getAttendDetail()
  },
  methods: {
    // 获取员工id
    getById() {
      const that = this
      const employeeId = that.$route.params.employeeId
      if (employeeId != 0) {
        this.employeeId = employeeId
        // this.getByIdEdu();
        getIdEmployees(employeeId)
          .then(res => {
            console.log(res)
            if (res.code === 0) {
              const {
                employeeBaseInfo,
                employeeEduList,
                employeeJobList,
                employeeContactList,
                employeeFamilyList,
                employeeTitleList,
                employeeCcieList,
                employeeTrainList,
                employeeLanguageList,
                employeePunishmentList,
                employeeRewardList
              } = res.data
              that.form = employeeBaseInfo || {}
              that.eduData = employeeEduList
              that.jobData = employeeJobList
              that.contactsDadata=employeeContactList
              that.famyData = employeeFamilyList
              that.titleData = employeeTitleList
              that.ccieData = employeeCcieList
              that.trainData = employeeTrainList
              that.langData = employeeLanguageList
              that.punData = employeePunishmentList
              that.rewData = employeeRewardList
              that.operation = true
              console.log(employeeBaseInfo.status);
              if(employeeBaseInfo.status == 2){
                that.userType=true
              }else{
                 that.userType=false
              }
              
              // that.form.photo=null
              if (res.data.photo) {
                that.imgFolat = true
              }
            }
          })
          .catch(err => {})
      } else {
        console.log('新增操作')
      }
    },
    // 查询员工教育经历
    getByIdEdu() {
      const that = this
      getEdu(that.employeeId).then(res => {
        if (res.code === 0) {
          that.eduData = res.data
        }
      })
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
          that.dimCauseOption = dimCause.dim_cause.option
          // 生育情况
          const fertilityType = that.getOpt(res.data, 'fertility_type')
          that.fertilityOption = fertilityType.fertility_type.option

          // 异动情况
          const changeType = that.getOpt(res.data, 'change_type')
          that.changeOption = changeType.change_type.option
          // 婚姻
          const marriage = that.getOpt(res.data, 'marriage')
          that.marOptions = marriage.marriage.option
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

    // 获取考勤信息
    getAttendDetail() {
      const that = this
      getAttendInfo(that.attendQuery).then(res => {
        if (res.code === 0) {
          that.attendData = res.data
        } else {
          that.$message.error(res.message)
        }
      })
    },
    // 重置考勤
    resetWages() {
      this.attendQuery.month = null
      this.type.month = null
      this.getAttendDetail()
    },
    // getComData() {
    //   const that = this;
    //   //获取组织
    //   const org = getOrg(this.orgQuery);
    //   //所有请求
    //   Promise.all([org]).then((res) => {
    //     that.orgTreeData = res[0].data;
    //   });
    // },
    // 编辑员工信息
    setStaffInfo() {
      this.option = true
    },
    getStaffInfo() {
      this.option = false
    },
    // 更新员工信息
    updataStaff() {
      const that = this
      that.option = false
      updateEmployees(that.form).then(res => {
        if (res.code === 0) {
          that.$message.success(res.message)
          that.getById()
          // that.getOptions();
        } else {
          that.$message.error(res.message)
        }
      })
    },
    // 增加教育经历
    addEduList() {
      this.eduOperation = true
      this.educationForm = {}
      this.editVisible = true
    },
    // 删除教育经历
    delEduList(index, row) {
      const that = this
      const idList = row.eduId
      // idList.push(row.eduId)
      delEdu({ idList }).then(res => {
        if (res.code === 0) {
          that.$message.success(res.message)
          that.eduData.splice(index, 1)
        } else {
          that.$message.error(res.message)
        }
      })
    },
    // 查看修改教育经历
    getOneEdu(e) {
      this.eduOperation = false
      this.educationForm = e
      this.editVisible = true
    },
    // 确认添加教育经历
    saveEdit() {
      this.comAddUpdataFun(this.educationForm, addEdu, updateEdu, 'editVisible')
    },
    // 工作经历
    addWorkList() {
      this.handleSetAdd()
      this.workForm = {}
      this.editVisible1 = true
    },

    // 删除工作经历
    delWorkList(index, row) {
      const that = this
      const idList = row.jobId
      // idList.push(row.eduId)
      delJob({ idList }).then(res => {
        if (res.code === 0) {
          that.$message.success(res.message)
          that.jobData.splice(index, 1)
        } else {
          that.$message.error(res.message)
        }
      })
    },
    // 修改工作经历
    getOneCompany(e) {
      this.handleSetRet()
      this.workForm = e
      this.editVisible1 = true
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 紧急联系人
    contactsFun() {
      this.handleSetAdd()
      this.contactsForm = {}
      this.editVisible2 = true
    },
    // 家庭信息
    familyFun() {
      this.handleSetAdd()
      this.familyForm = {}
      this.editVisible3 = true
    },
    // 获取一个家庭成员
    getOneFam(e) {
      this.familyForm = e
      this.handleSetRet()
      this.editVisible3 = true
    },
    // 职称信息
    levelFun() {
      this.handleSetAdd()
      this.titleForm = {}
      this.editVisible4 = true
    },
    // 获取一个职称信息
    getOneTitle(e) {
      this.titleForm = e
      this.handleSetRet()
      this.editVisible4 = true
    },
    // 删除一个职称
    delOneTitlt(index, row) {
      const that = this
      const idList = row.titleId
      // idList.push(row.eduId)
      delTitle({ idList }).then(res => {
        if (res.code === 0) {
          that.$message.success(res.message)
          that.titleData.splice(index, 1)
        } else {
          that.$message.error(res.message)
        }
      })
    },
    // 证书
    ccieFun() {
      this.handleSetAdd()
      this.ccieForm = {}
      this.editVisible5 = true
    },
    trainFun() {
      this.handleSetAdd()
      this.trainForm = {}
      this.editVisible6 = true
    },
    langFun() {
      this.handleSetAdd()
      this.langForm = {}
      this.editVisible7 = true
    },
    // 用户操作判断 true为新增，fasle为修改
    handleSetAdd() {
      this.handleType = true
    },
    handleSetRet() {
      this.handleType = false
    },
    // 工作经历增加修改
    workSaveEdit() {
      this.comAddUpdataFun(this.workForm, addJob, updateJob, 'editVisible1')
    },
    // 家庭信息增加修改
    familySaveEdit() {
      this.comAddUpdataFun(
        this.familyForm,
        addFamily,
        updateFamily,
        'editVisible3'
      )
    },
    // 职称信息增加修改
    titleSaveEdit() {
      this.comAddUpdataFun(
        this.titleForm,
        addTitle,
        updateTitle,
        'editVisible4'
      )
    },
    // 获取一个紧急联系人
    getOneContact(e) {
      this.contactsForm = e
      this.handleSetRet()
      this.editVisible2 = true
    },
    // 紧急联系人
    contactSaveEdit() {
      this.comAddUpdataFun(
        this.contactsForm,
        addContact,
        updateContact,
        'editVisible2'
      )
    },
    // 上传用户头像

    handleImgUrl(file, fileList) {
      console.log(file)
      if (file.code === 0) {
        console.log('上传成功')
        this.form.photo = file.data.nginxPath + file.data.pathList[0]
        this.updataStaff()
      } else {
        this.$message.error('图片上传失败')
      }
    },
    // 删除紧急联系人
    delContactList(index, row) {
      const that = this
      const idList = row.contactId
      // idList.push(row.eduId)
      delContact({ idList }).then(res => {
        if (res.code === 0) {
          that.$message.success(res.message)
          that.contactsData.splice(index, 1)
        } else {
          that.$message.error(res.message)
        }
      })
    },
    // 删除家庭成员
    delFamList(index, row) {
      const that = this
      const idList = row.familyId
      // idList.push(row.eduId)
      delFamily({ idList }).then(res => {
        if (res.code === 0) {
          that.$message.success(res.message)
          that.famyData.splice(index, 1)
        } else {
          that.$message.error(res.message)
        }
      })
    },
    // 查看一个证书
    getOneCcie(e) {
      this.ccieForm = e
      this.handleSetRet()
      this.editVisible5 = true
    },
    // 证书管理
    ccieSaveEdit() {
      this.comAddUpdataFun(this.ccieForm, addCcie, updateCcie, 'editVisible5')
    },
    // 删除证书
    delOneCcie(index, row) {
      const that = this
      const idList = row.ccieId
      // idList.push(row.eduId)
      delCcie({ idList }).then(res => {
        if (res.code === 0) {
          that.$message.success(res.message)
          that.ccieData.splice(index, 1)
        } else {
          that.$message.error(res.message)
        }
      })
    },
    // 培训经历
    trainSaveEdit() {
      this.comAddUpdataFun(
        this.trainForm,
        addTrain,
        updateTrain,
        'editVisible6'
      )
    },
    // 删除培训经历
    delOneTrain(index, row) {
      const that = this
      const idList = row.trainId
      // idList.push(row.eduId)
      delTrain({ idList }).then(res => {
        if (res.code === 0) {
          that.$message.success(res.message)
          that.trainData.splice(index, 1)
        } else {
          that.$message.error(res.message)
        }
      })
    },
    // 获取一个培训经历3
    getOneTrain(e) {
      this.trainForm = e
      this.handleSetRet()
      this.editVisible6 = true
    },
    // 语言能力
    langSaveEdit() {
      this.comAddUpdataFun(
        this.langForm,
        addLanguage,
        updateLanguage,
        'editVisible7'
      )
    },
    // 获取一个语言能力
    getOneLan(e) {
      this.langForm = e
      this.handleSetRet()
      this.editVisible7 = true
    },
    // 删除一个语言
    delOneLang(index, row) {
      const that = this
      const idList = row.languageId
      // idList.push(row.eduId)
      delLanguage({ idList }).then(res => {
        if (res.code === 0) {
          that.$message.success(res.message)
          that.langData.splice(index, 1)
        } else {
          that.$message.error(res.message)
        }
      })
    },
    // 增加惩罚
    addpunkList() {
      this.punForm = {}
      this.handleSetAdd()
      this.editVisible8 = true
    },
    // 删除惩罚
    delpunList(index, row) {
      const that = this
      const idList = row.punishmentId
      // idList.push(row.eduId)
      delPun({ idList }).then(res => {
        if (res.code === 0) {
          that.$message.success(res.message)
          that.punData.splice(index, 1)
        } else {
          that.$message.error(res.message)
        }
      })
    },
    // 获取一个惩罚
    getOnePun(e) {
      this.punForm = e
      this.handleSetRet()
      this.editVisible8 = true
    },
    // 新增修改惩罚
    punSaveEdit() {
      this.comAddUpdataFun(this.punForm, addPun, updataPun, 'editVisible8')
    },
    // 增加奖励
    addRewList() {
      this.punForm = {}
      this.handleSetAdd()
      this.editVisible9 = true
    },
    // 删除奖励
    delrewList(index, row) {
      const that = this
      const idList = row.rewardId
      // idList.push(row.eduId)
      delRew({ idList }).then(res => {
        if (res.code === 0) {
          that.$message.success(res.message)
          that.rewData.splice(index, 1)
        } else {
          that.$message.error(res.message)
        }
      })
    },
    // 获取一个奖励
    getOneRew(e) {
      this.rewForm = e
      this.handleSetRet()
      this.editVisible9 = true
    },
    // 新增修改奖励
    rewSaveEdit() {
      this.comAddUpdataFun(this.rewForm, addRew, updataRew, 'editVisible9')
    },
    // 通用新增修改方法
    comAddUpdataFun(form, addFun, updataFun, editVisible) {
      const that = this
      let data
      if (that.handleType) {
        form.employeeId = that.employeeId
        // 增加
        data = addFun(form)
      } else {
        // 修改
        data = updataFun(form)
      }
      data.then(res => {
        if (res.code === 0) {
          that.getById()
          that.$message.success(res.message)
          that[editVisible] = false
          // that.editVisible`8`=false
        } else {
          that.$message.error(res.message)
        }
      })
    },
    hindleChanged(e) {
      const { orgId } = e
      // this.orgName = orgName;
      this.getPostData(orgId)
    },
    getInfo() {
      const that = this
      // 获取公积金 社保 考勤 组织等其他信息
      const org = getBayIdManOrg(that.orgQuery)
      const post = getPost(that.postQuery)
      const rank = getRank(that.rankQuery)
      const employeeId = that.$route.params.employeeId
      const socialFund = getOneSocialFund({ empId: employeeId })
      // const attend = getOneAttend();
      // const tree = findOrgTree();
      const userFile = getUserFile({ empId: employeeId })
      const userContrat = getUserContract(employeeId)
      Promise.all([org, rank, post, socialFund, userFile, userContrat]).then(
        res => {
          that.orgTreeData = res[0].data
          that.rankOptions = res[1].data.data
          that.postOptions = res[2].data.data
          that.socialForm = res[3].data|| {}
          that.filesData = res[4].data
          that.contractData = res[5].data
        }
      )
    },
    // 删除用户头像
    delImg(url) {
      const that = this
      const data = {
        pathList: url,
        actId: that.employeeId
      }

      // let pathList=url;
      // pathList.push(url);
      that
        .$confirm('确认删除用户头像?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          delFiles(data).then(res => {
            if (res.code === 0) {
              that.form.photo = null
              that.$message.success(res.message)
            } else {
              that.$message.error(res.message)
            }
          })
          // that.$message({
          //   type: "success",
          //   message: "删除成功!",
          // });
        })
        .catch(() => {})
    },
    // 更改时间
    changeTime() {
      this.attendQuery.month = null
    },
    // 查看合同
    viewContract(e) {
      const { contractId } = e
      const employeeName = this.form.employeeName
      const employeeId = this.$route.params.employeeId
      this.$router.push({
        path: `/personnel/contractDetail/${employeeId}&${contractId}&${employeeName}`
      })
    },
    //查看个人文集
    viewFiles(e){
      const {file_url} = e;
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style = 'display:none'
      a.href = file_url
      a.target="_blank"
      a.click()
    },
    updataInsurances(){
      const that=this;
      that.socialForm.employeeId=that.form.employeeId;
      updateSocia(that.socialForm)
      .then(res=>{
        if(res.code === 0){
          that.getInfo();
          that.option=false
          that.$message.success(res.message)
        }else{
          that.$message.error(res.message)
        }
        
      })
    }
    
  }
}
</script>

<style lang="scss">
.models {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
.staffinfo {
  background: #fff;
  .toval {
    img {
      width: 100%;
      min-height: 100%;
    }
  }
  .staffinfo-box {
    margin-bottom: 50px;
    .table-box {
      th {
        text-align: center !important;
      }
    }
  }
  .el-form {
    table {
      border-collapse: collapse;
      word-wrap: break-word;
      word-break: break-all;
      border: none;
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
            .font {
              color: #3988ff;
              font-size: 14px;
              // padding: 10px 0;
              display: block;
              text-align: center;
              cursor: pointer;
              padding-left: 20px;
              background: url('../../../../assets/icon/adds.png') no-repeat left
                center;
            }
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
      .photo {
        text-align: center;
        position: relative;
        &:hover {
          .img-box {
            display: block;
          }
        }
        .img-box {
          // opacity: 0.5;
          position: absolute;

          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: rgba(#000000, 0.3);
          display: none;
          text-align: center;
          img {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -16px;
            margin-top: -32px;
            cursor: pointer;
          }
        }
      }
    }
  }
  .botton-box-row .el-col {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #e7e7f2;
  }
  .el-col-box .el-col {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #e7e7f2;
  }
  .el-row .el-form-item {
    margin: 0 2px;
    .el-form-item__label {
      background: #f8f9fe;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #e7e7f2;
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
}
.title {
  padding: 10px 0;
  .font {
    color: blue;
    font-size: 14px;
    padding: 10px 5px;
    cursor: pointer;
  }
  .title-header {
    padding: 4px 5px;
    font-size: 16px;
    background: #fff7db;
  }
}
.el-dialog__header {
  height: 40px;
  padding: 9px 16px;
  background: #fafafa;
  box-shadow: 0 1px 0 0 #ddd;
  border-bottom: none;
}
.wages {
  .el-input--prefix .el-input__inner {
    padding-left: 30px !important;
  }
}
</style>
