<template>
  <div class="main big-screen">
    <div class="screen-box">
      <div class="screen-header">
        <div class="screen-title">
          <div class="title-icon-left">
            <img src="../../assets/img/screen-left.png" alt="">
          </div>
          <div class="titel-text">人力资源管理可视化大屏</div>
          <div class="title-icon-right">
            <img src="../../assets/img/screen-right.png" alt="">
          </div>
        </div>
      </div>
      <div class="screen-container">
        <el-row :gutter="25">
          <el-col :span="11">
            <div class="screen-china">
              中国地图
            </div>
          </el-col>
          <el-col :span="13">
            <div class="screen-common screen-staff">
              <div class="common-names">员工基本信息</div>
              <div class="screen-staff-box">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <div>
                      <div
                        ref="sexChart"
                        class="chart chart-list"
                        style="height:200px"
                      />
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <div
                        ref="eduChart"
                        class="chart chart-list"
                        style="height:200px"
                      />
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <!-- <div
                        ref="sexChart"
                        class="chart chart-list"
                        style="height:200px"
                      /> -->
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="screen-common screen-channel">
              <div class="common-names">近6年招聘渠道</div>
              <div class="screen-staff-box">
                <div
                  ref="recChart"
                  class="chart chart-list"
                  style="height:200px"
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
let vm
const sexOption = {
  title: {
    text: '性别占比',
    textStyle: {
      color: '#fff',
      fontWeight: 500,
      fontSize: 14
    },
    left: 'center',
    bottom: 0
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    left: 'center',
    padding: 5,
    textStyle: {
      color: '#fff'
    }
  },
  series: [
    {
      name: '性别',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'outside',
        color: '#fff',
        formatter: '{b} \n ({d}%)'
      },
      //   emphasis: {
      //     label: { show: true, fontSize: '30', fontWeight: 'bold' }
      //   },
      labelLine: { show: true },
      data: [
        { value: 10, name: '男' },
        { value: 30, name: '女' }
      ]
    }
  ]
}
const eduOption = {
  title: {
    text: '学历结构',
    textStyle: {
      color: '#fff',
      fontWeight: 500,
      fontSize: 14
    },
    bottom: 0,
    left: 'center'
  },
  tooltip: {},
  legend: {
    show: false
  },

  radar: {
    textStyle: {
      color: '#fff',
      fontWeight: 400,
      fontSize: 12
    },
    indicator: [
      { name: '大学本科', max: 1000 },
      { name: '大学专科', max: 1000 },
      { name: '初中以下', max: 1000 },
      { name: '高中', max: 300 },
      { name: '硕士以上', max: 1000 },
      { name: '高职', max: 500 }
    ],
    // 坐标轴线
    axisLine: {
      lineStyle: {
        color: '#fff'
      }
    },
    // 分割线背景
    splitArea: {
      show: false
    },
    axisLabel: {
      color: '#fff'
    }
    //
  },
  series: [
    {
      name: '学历结构',
      type: 'radar',
      //   label: {
      //     show: true,
      //     position: 'outside',
      //     color:'#fff',
      //     formatter: '{b} \n ({d}%)'
      //   },
      //   emphasis: {
      //     label: { show: true, fontSize: '30', fontWeight: 'bold' }
      //   },
      labelLine: { show: true, width: 10 },
      // 区域填充样式
      areaStyle: {
        color: 'rgba(32,183,246,0.2)'
      },
      //   线条样式
      lineStyle: {
        color: '#20B7F6',
        width: 1
      },
      //   折线拐点标志的样式
      itemStyle: {
        opacity: 0
      },
      data: [{ value: [500, 700, 300, 200, 800, 200], name: '学历' }]
    }
  ]
}
const dataAxis = [2014, 2015, 2016, 2017, 2018, 2019]
const axData = [100, 200, 300, 500, 100, 200]
// 人才招聘渠道opt
const recOption = {
  tooltip: {},
  legend: {
    show: false
  },
  dataset: {
    dimensions: ['product', '2015', '2016', '2017'],
    source: [
      { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
      { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
      { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
      { product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1 }
    ]
  },
  grid:{
      height:150,
      top:20
  },
  xAxis: {
    type: 'category',
    data: dataAxis,
    // axisLine: {
    //   show: false
    // },
    // axisTick: {
    //   show: false
    // },
    z: 10
  },
  yAxis: {
    // axisLine: {
    //   show: false
    // },
    // axisTick: {
    //   show: false
    // }
  },
  series: [{ type: 'bar' },{ type: 'bar', data: axData }]
}

export default {
  components: {},
  data() {
    return {
      query: {},
      sexChart: null,
      eduChart: null,
      recChart: null
    }
  },
  created() {
    vm = this
    vm.getData()
  },
  mounted() {
    this.sexChart = echarts.init(this.$refs.sexChart)
    this.eduChart = echarts.init(this.$refs.eduChart)
    this.recChart = echarts.init(this.$refs.recChart)
    this.sexChart.setOption(sexOption, true)
    this.eduChart.setOption(eduOption, true)
    this.recChart.setOption(recOption)
  },
  methods: {
    getData() {}
  }
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: YouSheBiaoTiHei;
  src: url('../../assets/YouSheBiaoTiHei.ttf');
}
/deep/.navbar{
        background: #000;
 }
.big-screen {
  background: url('../../assets/img/screen.png') no-repeat;
  background-size: 100% 100%;
  color: #ffffff;
  .screen-box {
    .screen-header {
      .screen-title {
        display: flex;
        align-items: center;
        line-height: 75px;
        .titel-text {
          font-size: 48px;
          font-family: YouSheBiaoTiHei;
          color: #22b4f7;
          line-height: 32px;
          letter-spacing: 7px;
        }
      }
    }
    .screen-container {
      padding: 15px 20px;
      .screen-common {
        background: rgba(0, 0, 0, 0.25);
        box-shadow: 0px 0px 8px 0px rgba(56, 119, 202, 0.5);
        border: 1px solid #0c507d;
        .common-names {
          text-align: center;
          line-height: 35px;
          font-weight: 600;
          color: #20b7f6;
          background: url('../../assets/img/text-bg.png') no-repeat center
            center;
        }
        .screen-staff-box {
          padding-top: 30px;
        }
      }
      .screen-channel {
        margin-top: 25px;
      }
    }
  }
}
</style>
