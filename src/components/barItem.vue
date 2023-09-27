<!-- 仪表盘和柱状图的组合 -->
<script setup lang="ts">
import { reactive, ref, onMounted, watch, getCurrentInstance } from 'vue';
import instrumentPanelVue from './instrument-panel-sm.vue';
import * as echarts from 'echarts';

import bar from './bar.vue';
const lineData = reactive({});

const props = defineProps({
  obj: {
    type: Object,
    required: true,
  },
});

const options = [
  {
    value: '名称正序',
    label: '名称正序',
  },
  {
    value: '名称倒序',
    label: '名称倒序',
  },
  {
    value: '优到差',
    label: '优到差',
  },
  {
    value: '差到优',
    label: '差到优',
  },
];

const itemData = reactive({
  sort: '名称正序',
  dataStatus: 1,
  itemValue: '良',
  sliderValue: '2022-10-20',
  obj: props.obj.data,
});

const emit = defineEmits<{
  (event: 'changeSort', obj: object): void;
}>();

watch(
  () => itemData.sort,
  (newValue, oldValue) => {
    emit('changeSort', {
      sortName: newValue,
      targetKey: props.obj.targetKey,
    });

    console.log(newValue, oldValue, '测试监听sort');
    // 调整排序方式
    // 修改数据的排列顺序
  }
);

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
</script>

<template>
  <div class="container">
    <!-- 仪表盘 -->

    <div>
      <div class="bar-top-item">
        <div class="left">
          <!-- {{ props.obj }} -->
          <div class="left">
            <instrumentPanelVue :obj="props.obj"></instrumentPanelVue>
          </div>
          <!-- <p>全网平均满载率30</p> -->
        </div>
      </div>
    </div>
    <!-- 柱形图 -->
    <!-- {{ itemData.obj }} -->
    <bar :yObj="props.obj" ref="echart"></bar>
  </div>
</template>

<style lang="less" scoped>
h2 {
  padding: 0 0 0 20px;
  margin: 0;
  color: #fff;
  font-size: 22px;
  line-height: 44px;
  border-bottom: 1px solid #6e7283;
}
.active {
  text-decoration: underline;
  cursor: pointer;
}
.btn-line {
  padding-right: 20px;
  padding-top: 10px;
}
.bar-btn {
  background-color: #09204e;
  color: #3ae3ff;
  border: 1px solid #3ae3ff;
}

.icon {
  width: 24px;
  height: 24px;
  text-align: center;
  background-color: #00cc92;
  color: #fff;
  display: inline-block;
  border-radius: 4px;
  font-size: 14px;
  line-height: 24px;
  vertical-align: middle;
  margin: 0 4px;
}
.date-slider {
  padding-top: 20px;
  padding-right: 20px;
}
.m-2 {
  width: 100px;
  margin-top: 20px;
  margin-right: 20px;
}
.panel {
  width: 100%;
  height: 300px;
  display: block;
  margin: 0 auto;
}

.select-right-item {
  float: right;
}

.bar-top-item {
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  .left {
    flex: 1;
    height: 120px;
    p {
      padding: 0;
      margin: 0;
      width: 200px;
      text-align: center;
      font-size: 12px;
    }
  }
  .right {
    flex: 4;
    text-align: right;
    height: 120px;
    position: absolute;
    top: 20px;
    right: 14px;
  }
}

:deep(.el-input__wrapper) {
  background-color: #7598eb57 !important;
  box-shadow: none;
  border: 1px solid#fff;
}
:deep(.el-input__wrapper .el-input__inner) {
  color: #fff !important;
}
:deep(.el-input .el-select__caret.el-icon) {
  color: #6e7283;
}
</style>
