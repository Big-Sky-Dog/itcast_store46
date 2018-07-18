<template>
<div>
  <p>reports component</p>
  <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
  <div id="main" style="width: 600px;height:400px;"></div>
</div>
</template>

<script>
import echarts from 'echarts';

export default {
  data () {
    return {
      pieChart: null
    }
  },

  created () {
    this.loadPieData()
  },

  mounted () {
    // 基于准备好的dom，初始化echarts实例
    this.pieChart = echarts.init(document.getElementById('main'));
    // 显示标题，图例和空的坐标轴
    this.pieChart.setOption({
      title: {
        text: '异步数据加载示例'
      },
      tooltip: {},
      legend: {
        data:['销量']
      },
      xAxis: {
        data: []
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: []
      }]
    });
  },

  methods: {
    loadPieData () {
      setTimeout(() => {
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: 'ECharts 入门示例'
          },
          tooltip: {},
          legend: {
            data:['销量']
          },
          xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        };

        // 使用刚指定的配置项和数据显示图表。
        this.pieChart.setOption(option);
      }, 2000)
    }
  }
}
</script>

<style>
</style>