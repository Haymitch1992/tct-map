<!-- 低空飞行器终端 -->
<script setup>
import mapContainer from '../../components/mapContainerSmall.vue';
import videoBox from '../../components/videoSmall.vue';
// import videoBox from '../../components/video-item.vue';

import pageTop from '../../components/page-top.vue';
import { mainStore } from '../../store/index';
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { wgs84togcj02 } from '../../vendors/coordtransform.js';
import { getEeditPlanExecute, postFlightInfo } from '../../api/index.ts';
import { ElMessage } from 'element-plus';
import compass from '../../components/compass.vue';

const FavoriteRef = ref(null);
const store = mainStore();
// 获取数据

const pageData = reactive({
  currentData: null,
  flightTrack: {
    pitchAngle: null, //  滚转 pithch
    rollAngle: null, //  俯仰 roll
    headingAngle: 10, //  偏转 yaw
  },
});
var num = 0;
var timer = null;
var timer2 = null;
const test = () => {
  num = 0;
  getEeditPlanExecute({
    deviceKey: '无人机',
  }).then((res) => {
    console.log(res.data);
    store.device1Line = JSON.parse(res.data.data.planInfo);

    // 存在飞行计划 循环请求
    timer = setInterval(() => {
      num++;
      postFlightInfo({
        // planId: 7,
        planId: res.data.data.planId,
        deviceKey: '无人机',
      }).then((res2) => {
        if (!res2.data) {
          clearInterval(timer);
          timer2 = setInterval(() => {
            test();
          }, 1000);
          return;
        }
        //
        pageData.currentData = res2.data.data;
        store.device1Pos = wgs84togcj02(
          parseFloat(pageData.currentData.longitude),
          parseFloat(pageData.currentData.latitude)
        );
        store.altitude = pageData.currentData.altitude;
        let obj = JSON.parse(pageData.currentData.flightTrack);

        pageData.flightTrack = obj;
        // testRotation();
        // if (res2.data.data.warningType === '10001') {
        //   ElMessage({
        //     message: res2.data.data.warningInfo,
        //     type: 'warning',
        //   });
        // }
      });
    }, 1000);
    if (res.data) {
      clearInterval(timer2);
      return;
    }
  });
};
onMounted(() => {
  timer2 = setInterval(() => {
    test();
  }, 1000);
});
onUnmounted(() => {
  clearInterval(timer);
});

const drawAir = () => {
  // drawAirAutoRotation
  FavoriteRef.value.drawAirAutoRotation();
};

var num = 0;
const testRotation = () => {
  num += 1;
  FavoriteRef.value.changeRotation(num);
};
const obj = {
  autoplay: true,
  controls: true,
  sources: [
    {
      src: 'rtsp://admin:tct123456@172.48.0.252:554/1',
    },
  ],
};
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
      <el-tag size="small" type="success">海拔 {{ store.altitude }}m</el-tag>
      <!-- <el-tag size="small" type="success">飞行姿态 XXX</el-tag> -->
      <el-tag size="small" type="success">通信延时100ms</el-tag>
      <!-- <div class="air-status">
      
      </div> -->
      <el-tag size="small" type="success"
        >滚转 {{ pageData.flightTrack.pitchAngle }}</el-tag
      >
      <el-tag size="small" type="success">
        俯仰{{ pageData.flightTrack.rollAngle }}</el-tag
      >
      <el-tag size="small" type="success"
        >偏转 {{ pageData.flightTrack.headingAngle }}</el-tag
      >
      <!-- <el-button @click="drawAir"> 测试</el-button> -->
      <el-button @click="testRotation">测试选装</el-button>
    </div>
    <div class="aircraft-container">
      <map-container class="map-container" ref="FavoriteRef"></map-container>
      <compass></compass>
      <div class="video-container">
        <video-box :options="obj"></video-box>
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
