<script setup lang="ts">
import { reactive, Ref, ref, onMounted, watch, getCurrentInstance } from 'vue';
import * as echarts from 'echarts';
// import { mainStore } from '../store/index';
// const store = mainStore();
const COLORS = ['#ff0000', '#e89c00', '#00d08d', '#1868fe'];

const props = defineProps({
  yObj: {
    type: Object,
    required: true,
  },
});

const echartsData = reactive({
  xValue: [],
  yValue: [],
  colorList: [],
  unit: '件',
});

watch(
  () => props.yObj,
  (newValue, oldValue) => {
    console.log(newValue, oldValue, '监听传递参数的变化');
    setData();
    initEcharts();
  },
  { deep: true }
);



const setData = () => {
  echartsData.xValue = [];

  echartsData.yValue = [];
  echartsData.colorList = [];
  props.yObj.data.forEach((item: any) => {
    console.log(props.yObj);
    let str: string = '';
    // if (item.indexName === '列车正点率') {
    //   str = item.value.toFixed(4);
    // } else {
    //   str = item.value.toFixed(2);
    // }
    //
    let num = 0;
    if (props.yObj.unit === '%') {
      num = item.value * 100;
    } else {
      num = item.value;
    }

    // arr.value.push(num);
    echartsData.xValue.push(item.xlabel);
    echartsData.yValue.push(num.toFixed(props.yObj.fixed));
    echartsData.colorList.push('#488e29');

    // echartsData.colorList.push(setIconColor(item.rank));
  });
};

// 数据发生变化 重新绘制图表
const echartResize = () => {
  console.log('重新渲染图表');
};
defineExpose({
  echartResize,
});
const colorObj =
  getCurrentInstance()?.appContext.config.globalProperties.$colorObj;

const setIconColor = (value: string) => {
  var returnColor: string = '#ddd';
  colorObj.forEach((element: any) => {
    if (element.name === value) {
      returnColor = element.value;
    }
  });
  return returnColor;
};

const arr = ref([]);

const initEcharts = () => {
  const myEcharts = echarts.init(myChart.value, 'dark');
  arr.value = [];
  var colorArr: any = [];

  var option;
  option = {
    backgroundColor: '#09204e',
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}' + props.yObj.unitCn,
      },
      min: props.yObj.min ? props.yObj.min : null,
      max: props.yObj.max ? props.yObj.max : null,
    },
    yAxis: {
      type: 'category',
      data: echartsData.xValue,
    },

    grid: {
      // 让图表占满容器
      top: '0px',
      left: '80px',
      right: '50px',
      bottom: '20px',
    },
    tooltip: {},
    series: [
      {
        data: echartsData.yValue,
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          normal: {
            color: (item: any) => {
              let returnColor = null;
              returnColor = echartsData.colorList[item.dataIndex];
              return returnColor;
            },
            label: {
              show: true,
              position: 'right',
            },
          },
        },
      },
    ],
  };
  option && myEcharts.setOption(option);

  // myEcharts.on('click', function (params: any) {
  //   console.log(params);
  //   // 修改store.setCurrentSelectLineName 的值 为当前点击的线路名称

  //   store.currentSelectLineName = params.name;
  // });
};

const myChart: Ref<HTMLElement | any> = ref(null);

// myChart.on('click', function (params: any) {
//   console.log(params);
// });
onMounted(() => {
  setData();
  initEcharts();
  // echart 初始化 需要 原生 DOM 对象
});
</script>

<template>
  <div class="container">
    <!-- {{ props.yObj }} -->

    <div class="panel" ref="myChart" id="panel"></div>
  </div>
</template>

<style lang="less" scoped>
.panel {
  width: 100%;
  height: 270px;
  display: block;
  margin: 0 auto;
  text-align: center;
}
</style>
