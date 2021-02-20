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
            <div class="screen-china screen-common">
              <div class="common-names">全国人数分布</div>
              <div class="screen-china-box">
                <div ref="chinaChart" style="height:500px" />
              </div>
              <div class="screen-china-info">
                <div class="company-item">
                  <span class="company-name">分公司数量：</span>
                  <span
                    class="company-num"
                  >{{ mapData.branchCommpanyCount || 0 }}个</span>
                </div>
                <div class="company-item">
                  <span class="company-name">在职员工数量：</span>
                  <span
                    class="company-num"
                  >{{ mapData.workingEmpCount || 0 }}人</span>
                </div>
                <div class="company-item">
                  <span class="company-name">人员流动率：</span>
                  <span class="company-num">{{
                    mapData.staffTurnover || 0
                  }}</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="13">
            <div class="column-box">
              <div class="screen-common screen-staff">
                <div class="common-names">员工基本信息</div>
                <div class="screen-staff-box">
                  <el-row :gutter="10">
                    <el-col :span="8" class="img-border">
                      <div>
                        <div
                          ref="sexChart"
                          class="chart chart-list"
                          style="height:200px"
                        />
                      </div>
                    </el-col>
                    <el-col :span="8" class="img-border">
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
                        <div
                          ref="polChart"
                          class="chart chart-list"
                          style="height:200px"
                        />
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
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="25" style="margin-top:25px">
          <el-col :span="11">
            <div class="screen-common screen-social-box">
              <div class="common-names">公司社保与公积金参与数</div>
              <div class="screen-staff-box">
                <el-table
                  :data="tableData"
                  style="width: 95%;margin:0 auto"
                  :row-style="{ background: 'transparent' }"
                  :header-cell-style="{
                    background: 'rgba(70, 193, 255, .5)',
                    color: '#fff'
                  }"
                  height="210px"
                  border
                >
                  <!-- :header-row-class-name="headerClass" -->
                  <el-table-column
                    prop="companyName"
                    label="公司名称"
                    align="center"
                  />
                  <el-table-column
                    prop="peopleNum"
                    label="参保人数"
                    align="center"
                  />
                  <el-table-column
                    prop="socialCostMonth"
                    label="月社保总费用"
                    align="center"
                  />
                  <el-table-column
                    prop="fundCostMonth"
                    align="center"
                    label="月公积金总费用"
                  />
                </el-table>
              </div>
            </div>
          </el-col>
          <el-col :span="13">
            <div class="column-box">
              <div class="screen-common screen-staff">
                <div class="common-names">近5年社保与公积金人数对比</div>
                <div class="screen-staff-box">
                  <div ref="scaChart" style="height:230px" />
                </div>
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
const chain = require('@/assets/js/china')
// 测试结束
import {
  getCompanySocialFund,
  getEmpBasicInfo,
  getEmpMapData,
  getSocialFundCount,
  getEmpSource
} from '@/api/bigData'
export default {
  components: {},
  data() {
    return {
      query: {},
      sexChart: null,
      eduChart: null,
      recChart: null,
      chinaChart: null,
      polChart: null,
      scaChart: null,
      tableData: [],
      polData: [],
      eduData: [],
      scaData: [],
      mapData: [],
      channelsData:{}
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
    this.chinaChart = echarts.init(this.$refs.chinaChart)
    this.scaChart = echarts.init(this.$refs.scaChart)
    this.polChart = echarts.init(this.$refs.polChart)
    // this.sexChart.showLoading()
  },
  methods: {
    getData() {
      // 公司社保与公积金参与数
      const data1 = getCompanySocialFund()
      const data2 = getEmpBasicInfo()
      const data3 = getSocialFundCount()
      const data4 = getEmpMapData()
      const data5 = getEmpSource()
      Promise.all([data1, data2, data3, data4,data5]).then(res => {
        vm.tableData = res[0].data
        vm.sexData = res[1].data.sex
        vm.eduData = res[1].data.education
        vm.polData = res[1].data.backGround
        vm.scaData = res[2].data
        vm.mapData = res[3].data
        vm.channelsData = res[4].data
        vm.$nextTick(() => {
          vm.draw()
        })
        // console.log(sexData)
      })
    },
    headerClass() {
      return 'headerClass'
    },
    // 设置
    draw() {
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
            radius: ['30%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              color: '#fff',
              formatter: '{b} \n ({d}%)'
            },
            labelLine: { show: true },
            data: vm.sexData
          }
        ]
      }
      const polOption = {
        title: {
          text: '政治面貌',
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
            name: '政治面貌',
            type: 'pie',
            radius: ['30%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              color: '#fff',
              formatter: '{b} \n ({d}%)'
            },
            labelLine: { show: true },
            data: vm.polData
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
          indicator: vm.eduData.indicator,
          // 坐标轴线
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          radius:50,
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
            data: vm.eduData.data
          }
        ]
      }
      const dataAxis = [2014, 2015, 2016, 2017, 2018, 2019]
      const axData1 = [100, 200, 300, 500, 100, 200]
      // 人才招聘渠道opt
      const recOption = {
        tooltip: {},
        legend: {
          left: 'center',
          padding: 5,
          itemGap: 160,
          top: 0,
          show: true,
          itemWidth: 8,
          // height:8,
          data: [
            {
              name: '社会招聘',
              // 强制设置图形为圆。
              icon: 'circle',
              // 设置文本为红色
              textStyle: {
                color: '#23B3F8'
              }
            },
            {
              name: '内推',
              // 强制设置图形为圆。
              icon: 'circle',
              // 设置文本为红色
              textStyle: {
                color: '#23B3F8'
              }
            },
            {
              name: '校园招聘',
              // 强制设置图形为圆。
              icon: 'circle',
              // 设置文本为红色
              textStyle: {
                color: '#23B3F8'
              }
            }
          ]
          // textStyle: {
          //   color: '#fff'
          // }
        },

        grid: {
          height: 140,
          top: 30
        },
        xAxis: {
          type: 'category',
          data: vm.channelsData.yearList || [],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            // show: true,
            lineStyle: {
              color: '#45454D',
              opacity: 0.5
            }
          }
          // axisLine: {
          //   show: false
          // },
          // axisTick: {
          //   show: false
          // },
        },
        yAxis: {
          axisLine: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#45454D',
              opacity: 0.5
            }
          }
          // axisTick: {
          //   show: false
          // }
        },

        series: [
          {
            type: 'bar',
            name: '社会招聘',
            data: vm.channelsData.outPushList || [],
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#31DC72'
                  },
                  {
                    offset: 1,
                    color: '#24B2F8'
                  }
                ])
              }
            },
            barWidth: 18
          },
          {
            type: 'bar',
            name: '内推',
            data: vm.channelsData.inPushList || [],
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#02E7E7'
                  },
                  {
                    offset: 1,
                    color: '#24B2F8'
                  }
                ])
              }
            },
            barWidth: 18
          },
          {
            type: 'bar',
            data: vm.channelsData.schoolPushList || [],
            name: '校园招聘',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#5280FF'
                  },
                  {
                    offset: 1,
                    color: '#24B2F8'
                  }
                ])
              }
            },
            barWidth: 18
          }
        ]
      }
      // 首都星标
      const iconRQ =
        'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNCRkRBMEJBQzgwRjExRUFBNUI0RTMyMThEN0UxMzFEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNCRkRBMEJCQzgwRjExRUFBNUI0RTMyMThEN0UxMzFEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0JGREEwQjhDODBGMTFFQUE1QjRFMzIxOEQ3RTEzMUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0JGREEwQjlDODBGMTFFQUE1QjRFMzIxOEQ3RTEzMUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5mT42iAAABQ0lEQVR42mL8LabOQCQIBOL1xChkItJAkLp+IBajpqFWQCwPxJ7UNDQCSgdQy1BmIA6Bsl2AmJMahjoAsTiUzQPETtQwNAKN709IAwvUayZQ/hcg/o0k/x6Ig9D0+ABxKJT9HYh/oMm/BBm6GYitgTgfiBmJcLkkEK/CIXcGiGNB3v8JxIVQF31gIA/8AeIWaNK7gRymG4BYH4hPkGjgXSC2A+JaWNChR9QjqIJeIP5PhIGzgdgAiI8Tin2QbSVAvIOAgROBOA0auUQlKV4gtidgqBGp6RSUFrmIKA/ESDEUPcGfBOIUIH6Lln29iTVUCIjdkJJKExDbAPFcqJdPEMpd2AwF5TBWaFKxBeJ6qOHIqaMbmjrcsBUw2AwNh7rKAEeaBaWOMiD2BeJvQOxOyFBuaFJJwZZU0MBWaHCIo0sABBgAetA4Jx5t/ToAAAAASUVORK5CYII='
      const chinaOption = {
        geo: {
          type: 'map',
          map: 'china',
          aspectScale: 0.85,
          z: 0,
          layoutCenter: ['50%', '52%'], // 地图位置
          layoutSize: '125%',
          label: {
            show: false,
            position: 'center',
            color: '#20B7F6',
            fontSize: 12
          },
          itemStyle: {
            areaColor: '#000',
            borderColor: '#187CAF'
            // borderType: 'dotted',
            // shadowColor: '#000000',
            // shadowOffsetX: 0,
            // shadowOffsetY: 10,
            // opacity: 0.5
          },
          emphasis: {
            label: {
              show: false
            },
            itemStyle: {
              areaColor: '#000000'
            }
          },
          regions: [
            {
              name: '南海诸岛',
              itemStyle: {
                normal: {
                  opacity: 0,
                  label: {
                    show: false,
                    color: '#009cc9'
                  }
                }
              },
              label: {
                show: false
              }
            }
          ]
        },
        series: [
          {
            type: 'map',
            map: 'china',
            z: 2,
            aspectScale: 0.85,
            layoutCenter: ['50%', '50%'], // 地图位置
            layoutSize: '125%',
            zoom: 1,
            scaleLimit: {
              // 滚轮缩放的极限控制
              min: 1,
              max: 2
            },
            itemStyle: {
              areaColor: '#082A3E',
              borderColor: '#22B4F7',
              shadowColor: '#22B4F7',
              // shadowOffsetX:1,
              // shadowOffsetY:1,
              // shadowBlur:10,
              // borderWidth: 1, // 设置外层边框
              borderType: 'dashed'
            },
            label: {
              show: true,
              position: 'center',
              color: '#20B7F6',
              fontSize: 12
            },
            // 选择状态
            select: {
              itemStyle: {
                areaColor: '#082A3E'
              },
              label: {
                color: '#20B7F6'
              }
            },
            emphasis: {
              label: {
                color: '#20B7F6'
              },
              itemStyle: {
                areaColor: '#082A3E'
              }
            }
          },
          {
            // 首都星图标
            name: '首都',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: [
              {
                name: '首都',
                value: [116.24, 41.55, 100]
              }
            ],
            symbol: iconRQ,
            symbolSize: 15,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            }
          },
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            // 标记的大小
            symbolSize: function(value) {
              if (parseInt(value[2]) > 10) {
                return 15
              } else {
                return parseInt(value[2] * 2)
              }
            },
            rippleEffect: {
              // 坐标点动画
              period: 5,
              scaleX: 5,
              scaleY: 5,
              brushType: 'stroke'
            },
            label: {
              normal: {
                show: false
                // position: 'right',
                // formatter: '{b}',
                // color: '#b3e2f2',
                // fontWeight: 'bold',
                // fontSize: 16
              },
              labelLine: {
                show: true,
                showAbove: true
              }
            },

            itemStyle: {
              // 坐标点颜色
              normal: {
                show: true,
                color: '#C84C12',
                shadowBlur: 20,
                shadowColor: '#fff'
              },
              emphasis: {
                areaColor: '#f00'
              }
            },
            emphasis: {
              // scale:false
              label: {
                show: true,
                position: [5, 20],
                padding: 10,
                backgroundColor: '#011E40',
                color: '#fff',
                formatter(params) {
                  const arr = [
                    '地区：' + params.name,
                    '',
                    '数量：' + params.value[2]
                  ]
                  return arr.join('\n')
                }
              }
            },
            data: vm.mapData.cityMapData
          }
        ]
      }
      // 测试开始
      // Generate data
      const scaOption = {
        // backgroundColor: '#0f375f',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['社保', '公积金'],
          textStyle: {
            color: '#ccc'
          }
        },
        grid: {
          height: 170,
          top: 30
        },
        xAxis: {
          type: 'category',
          data: vm.scaData.year,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '公积金',
            axisLine: {
              lineStyle: { color: '#ccc' }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#45454D',
                opacity: 0.5
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '社保',
            axisLine: {
              lineStyle: { color: '#ccc' }
            },
            interval: 20,
            position: 'right',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#45454D',
                opacity: 0.5
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],

        series: [
          {
            name: '公积金',
            type: 'pictorialBar',
            symbol: 'rect',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(2,231,231,0.1)' },
                { offset: 1, color: 'rgba(35, 178, 248,0.5)' }
              ])
            },
            symbolRepeat: true,
            symbolSize: [12, 4],
            symbolMargin: 2,
            z: -10,
            data: vm.scaData.fund
          },

          {
            name: '社保',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 5,
            lineStyle: {
              color: '#21B6F6',
              width: 1,
              type: 'solid'
            },
            itemStyle: {
              color: '#59DC85'
            },
            data: vm.scaData.social
          }
        ]
      }
      this.sexChart.setOption(sexOption, true)
      this.eduChart.setOption(eduOption, true)
      this.recChart.setOption(recOption)
      this.chinaChart.setOption(chinaOption)
      this.scaChart.setOption(scaOption)
      this.polChart.setOption(polOption)
    }
  }
}
</script>

<style lang="scss">
.big-screen {

  .img-border{
    position: relative;
    &:after{
      width: 1px;
      height: 80%;
      content: '000';
      text-indent: -9999px;
      position: absolute;
      right: -5px;
      top: 10%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #29FFEB 54%, rgba(255, 255, 255, 0) 100%);
    }
  }
  .el-table {
    background: transparent;
    color: #fff;
    tr {
      background: transparent;
    }
  }
  .el-table--border:after,
  .el-table--group:after,
  .el-table:before {
    background-color: #45454d;
  }

  .el-table--border,
  .el-table--group {
    border-color: #45454d;
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #45454d;
  }

  .el-table--border th,
  .el-table--border th.gutter:last-of-type {
    border-bottom: 1px solid #45454d;
  }

  .el-table--border td,
  .el-table--border th {
    border-right: 1px solid #45454d;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: transparent !important;
  }
}
</style>
<style lang="scss" scoped>
@font-face {
  font-family: YouSheBiaoTiHei;
  src: url('../../assets/YouSheBiaoTiHei.ttf');
}

.el-row {
  display: flex;
  flex-wrap: wrap;
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
      .column-box {
        display: flex;
        // flex-flow: column; //垂直排列
        height: 100%;
        flex-flow: column; //垂直排列
        justify-content: space-between; //两端对齐
      }
      .screen-common {
        background: rgba(0, 0, 0, 0.25);
        box-shadow: inset 0px 0px 5px 1px rgba(56, 119, 202, 0.5);
        border: 1px solid #0c507d;
        // border-image: url('../../assets/img/border.png') 0 round;
        background-image: url('../../assets/img/border.png'),
          url('../../assets/img/right-top.png'),
          url('../../assets/img/left-bottom.png'),
          url('../../assets/img/right-bottom.png');
        background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
        background-position: 0 0, right 0, 0 bottom, right bottom;
        .common-names {
          text-align: center;
          line-height: 35px;
          font-weight: 600;
          color: #20b7f6;
          background: url('../../assets/img/text-bg.png') no-repeat center
            center;
        }
        .screen-staff-box {
          padding-top: 20px;
        }
      }
      .screen-china {
        position: relative;
        .screen-china-info {
          position: absolute;
          left: 40px;
          bottom: 30px;
          .company-item {
            line-height: 30px;
            display: flex;
            align-items: center;
            min-width: 150px;
            .company-name {
              font-size: 12px;
              font-weight: 500;
              color: #ffffff;
              flex: 2;
            }
            .company-num {
              font-weight: 600;
              font-size: 18px;
              color: #02c3c6;
              display: inline-block;
              flex: 1;
              // width: 120px;
              text-align: right;
            }
          }
        }
      }
      .screen-social-box {
        height: 100%;
      }
      // .screen-channel {
      //    align-items: flex-end
      // }
      // .screen-staff{
      //   align-items: flex-start
      // }
    }
  }
}
</style>
