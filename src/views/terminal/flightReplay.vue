<!-- 飞行回放 -->
<!-- 创建项目 -->
<template>
  <div class="page-container">
    <page-top></page-top>
    <map-container
      :view3D="true"
      :uesMouseTool="false"
      class="map-container"
      ref="FavoriteRef"
    ></map-container>
    <div class="right-container">
      <h3>飞行监视</h3>

      <div class="item">
        <h4>火灾情况</h4>
        <p>火头面积约：400㎡</p>
        <p>火翼面积约：1500㎡</p>
        <p>火尾面积约：200㎡</p>
        <el-button size="small" type="primary" @click="showWarning()"
          >标记火情</el-button
        >
        <el-button size="small" type="warning" @click="hideWarning()"
          >取消标记</el-button
        >
      </div>
      <div class="item">
        <h4>救灾情况</h4>
        <p>无人机：侦查中</p>
        <p>直升机：前往火灾区，距离火灾区15KM</p>
      </div>
      <div class="item">
        <h4>飞行器感知画面</h4>
        <video-box></video-box>
      </div>
    </div>
    <socket></socket>
  </div>
</template>

<script setup>
import mapContainer from '../../components/mapContainer3D.vue';
import pageTop from '../../components/page-top.vue';
import { mainStore } from '../../store/index';
import videoBox from '../../components/video.vue';
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getEeditPlanExecute,
  postFlightInfoGround,
  postEditTaskInfo,
} from '../../api/index.ts';
import { wgs84togcj02 } from '../../vendors/coordtransform.js';
import socket from '../../components/socket.vue';

const FavoriteRef = ref(null);
const store = mainStore();
// 获取数据

const showWarning = () => {
  let str = JSON.stringify({
    markerList: [[115.985895, 39.879805]],
    fireArea: [
      {
        Q: 39.88405250992457,
        R: 115.98691757038239,
        lng: 115.986918,
        lat: 39.884053,
      },
      {
        Q: 39.87529472119752,
        R: 115.97959284245974,
        lng: 115.979593,
        lat: 39.875295,
      },
      {
        Q: 39.86823551688767,
        R: 115.99365133792162,
        lng: 115.993651,
        lat: 39.868236,
      },
      {
        Q: 39.869374945943,
        R: 116.01888090133667,
        lng: 116.018881,
        lat: 39.869375,
      },
      {
        Q: 39.87835377629659,
        R: 116.0065115042031,
        lng: 116.006512,
        lat: 39.878354,
      },
    ],
  });
  store.saveTaskObj.fireRange = str;
  store.saveTaskObj.taskArea = str;
  postEditTaskInfo({
    ...store.saveTaskObj,
  }).then((res) => {});
  //

  // FavoriteRef.value.showWarning();
};

const hideWarning = () => {
  store.saveTaskObj.fireRange = '';
  postEditTaskInfo({
    ...store.saveTaskObj,
  }).then((res) => {});
  // FavoriteRef.value.hideWarning();
};
const pageData = reactive({
  currentData: null,
});

var timer = null;
var timer2 = null;

var save = null;

// 根据飞行器 获取航线
// 获取飞行器实时数据

const getInfo = (planId) => {
  timer = setInterval(() => {
    postFlightInfoGround({
      planId: planId,
      deviceKey: '长空之王',
    }).then((res2) => {
      pageData.currentData = res2.data.data;
      let obj = res2.data.data;

      // store.device1Pos = [
      //   parseFloat(obj.longitude),
      //   parseFloat(obj.latitude),
      // ];

      store.device1Pos = wgs84togcj02(
        parseFloat(pageData.currentData.longitude),
        parseFloat(pageData.currentData.latitude)
      );

      store.altitude = pageData.currentData.altitude;
      if (res2.data.data.warningType === '10001') {
        ElMessage({
          message: res2.data.data.warningInfo,
          type: 'warning',
        });
      }
    });
  }, 1000);
};

onMounted(() => {});
onUnmounted(() => {});
</script>

<style lang="less" scoped>
.item {
  background-color: #3a3a3c;
  padding: 10px;
  font-size: 14px;
  margin: 10px 0;
  h4 {
    padding: 0;
    margin: 0;
    line-height: 36px;
  }
  p {
    padding: 0;
    margin: 0;
    line-height: 30px;
  }
}
.page-container {
  position: relative;
  background-color: #101010;
}
.map-container {
  width: 100%;
  height: 100vh;
}

.right-container {
  width: 400px;
  overflow: hidden;
  height: calc(100vh - 64px);
  position: absolute;
  right: 0;
  top: 64px;
  box-sizing: border-box;
  padding: 0 10px;
  background-color: #232323;
  color: #fff;
  h3 {
    line-height: 32px;
    padding-bottom: 4px;
    font-size: 16px;
    font-weight: normal;
    color: #fff;
    border-bottom: 1px solid #4c4d4f;
  }
}
.data-text {
  background-color: #101010;
  color: #fff;
  display: block;
  font-size: 14px;
  padding: 10px 6px;
  line-height: 30px;
}
</style>
