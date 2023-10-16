<!-- 飞行回放 -->
<!-- 创建项目 -->
<template class="page-container">
  <div class="page-top">
    <span>指挥调度工作站</span>
  </div>
  <map-container class="map-container"></map-container>
  <div class="right-container">
    <h3>飞行监视</h3>
  </div>
</template>

<script setup>
import mapContainer from '../../components/mapContainer.vue';
import { reactive } from 'vue';

const formLabelAlign = reactive({
  name: 1,
  region: 2,
  type: 3,
});

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
  },
];



const airList = reactive({
  device1Posion: [], // 无人机当前经纬度数据 飞行姿态数据
  // 无人机飞行轨迹 
  

  device2Posion: [],// 直升机经纬度// 飞机姿态信息
  // 直升机飞行轨迹

})

// 获取数据
// 渲染数据



</script>

<style lang="less" scoped>
.page-container {
  position: relative;
}
.map-container {
  width: 100%;
  height: 100vh;
}
.page-top {
  height: 54px;
  background-color: #232323;
  margin-bottom: 10px;
  color: #fff;
  line-height: 54px;
  padding: 0 10px;
  span {
    font-size: 22px;
  }
}
.right-container {
  width: 400px;
  height: calc(100vh - 64px);
  position: absolute;
  right: 0;
  top: 64px;
  box-sizing: border-box;
  padding: 0 10px;
  background-color: #232323;
  h3 {
    line-height: 32px;
    padding-bottom: 4px;
    font-size: 16px;
    font-weight: normal;
    color: #fff;
    border-bottom: 1px solid #4c4d4f;
  }
}
</style>









