<!-- 低空飞行器终端 -->
<script setup>
import mapContainer from '../../components/mapContainerSmall.vue';
import videoBox from '../../components/videoSmall.vue';
import pageTop from '../../components/page-top.vue';
import { mainStore } from '../../store/index';
import { ref, reactive, onMounted, onUnmounted } from 'vue';

import { getEeditPlanExecute, postFlightInfo } from '../../api/index.ts';

const FavoriteRef = ref(null);
const store = mainStore();
// 获取数据

const pageData = reactive({
  currentData: null,
});
var num = 0;
var timer = null;
const test = () => {
  num = 0;
  getEeditPlanExecute({}).then((res) => {
    console.log(res.data);
    store.device1Line = JSON.parse(res.data.data.planInfo);
    // 存在飞行计划 循环请求
    timer = setInterval(() => {
      num++;
      postFlightInfo({
        // planId: 7,
        planId: res.data.data.planId,
        deviceKey: '破晓',
      }).then((res2) => {
        pageData.currentData = res2.data.data;
        store.device1Pos = [
          parseFloat(pageData.currentData.longitude),
          parseFloat(pageData.currentData.latitude),
        ];
      });
    }, 100);
  });
};
onMounted(() => {
  test();
});
onUnmounted(() => {
  clearInterval(timer);
});

// 加载飞行轨迹 飞机位置
// 告警提示音
//
</script>
<!-- 报警提示音 -->

<template>
  <div class="page-container">
    <div class="top-container">
      <el-tag size="small" type="success" v-if="store.device1Pos"
        >经度{{ store.device1Pos[0] }}°</el-tag
      >
      <el-tag size="small" type="success" v-if="store.device1Pos"
        >纬度{{ store.device1Pos[1] }}°</el-tag
      >
      <el-tag size="small" type="success">高度 500m</el-tag>
      <el-tag size="small" type="success">飞行姿态 XXX</el-tag>
      <el-tag size="small" type="success">通信延时100ms</el-tag>
      <!-- <div class="air-status">
        
      </div> -->
    </div>
    <div class="aircraft-container">
      <map-container class="map-container" ref="FavoriteRef"></map-container>
      <div class="video-container">
        <video-box></video-box>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.aircraft-container {
  width: 1024px;
  height: 580px;
  background-color: #101010;
  position: relative;
  .video-container {
    width: 300px;
    height: 180px;
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: #101010;
    z-index: 100;
    overflow: hidden;
    border-radius: 8px;
  }
}
.top-container {
  line-height: 40px;
  height: 40px;
  background-color: #101010;
  width: 1024px;
  vertical-align: middle;
  padding: 0 10px;
  box-sizing: border-box;
  text-align: right;
  span {
    margin: 0 4px;
  }
}
.air-status {
  height: 26px;
  line-height: 26px;
  background-color: #2c6424;
  color: #fff;
  display: inline-block;
  width: 200px;
  border-radius: 4px;
  font-size: 14px;
  padding: 0 10px;
  text-align: left;
}
</style>
