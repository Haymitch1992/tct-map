<!-- 飞行回放 -->
<!-- 创建项目 -->
<template>
  <div class="page-container">
    <page-top></page-top>
    <map-container
      :showAir="false"
      :showLine2="false"
      class="map-container"
      ref="FavoriteRef"
    ></map-container>
    <div class="right-container">
      <h3>飞行监视</h3>
      <!-- <el-button type="primary" @click="startSetLine()">编辑航线</el-button>
    <el-button type="primary" @click="test()">保存航线</el-button> -->
      <!-- <h4>航线信息</h4>
      <span class="data-text">
        {{ store.device1Line }}
      </span> -->
      <el-button @click="showWarning()">注入火灾</el-button>
      <el-button @click="hideWarning()">取消</el-button>
      <h4>飞行器实时数据<el-tag type="success">通信延时 1000ms</el-tag></h4>
      <el-tag size="small" type="success" v-if="store.device1Pos"
        >经度 {{ store.device1Pos[0] }}°</el-tag
      >
      <el-tag size="small" type="success" v-if="store.device1Pos"
        >纬度 {{ store.device1Pos[1] }}°</el-tag
      >
      <el-tag size="small" type="success">海拔 {{ store.altitude }}m</el-tag>
      <span class="data-text">
        {{ store.device1Pos }}
      </span>
      <span>
        {{ store.device2Pos }}
      </span>

      <h4>飞行器感知画面</h4>
      <video-box></video-box>
    </div>
  </div>
</template>

<script setup>
import mapContainer from '../../components/mapContainer2.vue';
import pageTop from '../../components/page-top.vue';
import { mainStore } from '../../store/index';
import videoBox from '../../components/video.vue';
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getEeditPlanExecute, postFlightInfoGround } from '../../api/index.ts';
import { wgs84togcj02 } from '../../vendors/coordtransform.js';

const FavoriteRef = ref(null);
const store = mainStore();
// 获取数据


const showWarning = () => {
  FavoriteRef.value.showWarning();
};

const hideWarning = () => {
  FavoriteRef.value.hideWarning();
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

const test = () => {
  getEeditPlanExecute({
    deviceKey: '长空之王',
  })
    .then((res) => {
      store.device1Line = JSON.parse(res.data.data.planInfo);
      save = res.data.data.planInfo;
      // 存在飞行计划 循环请求
      getInfo(res.data.data.planId);
    })
    .catch((res) => {
      getInfo('');
    });

  // 场景1 执行有人机
  // 场景2 执行有人机 和 无人机
  if (store.scene === 1) {
    return;
  }
  getEeditPlanExecute({
    deviceKey: '无人机',
  }).then((res) => {
    store.device2Line = JSON.parse(res.data.data.planInfo);
    // 存在飞行计划 循环请求
    timer2 = setInterval(() => {
      postFlightInfoGround({
        planId: res.data.data.planId,
        deviceKey: '无人机',
      }).then((res2) => {
        let obj = res2.data.data;
        // store.device2Pos = [
        //   parseFloat(obj.longitude),
        //   parseFloat(obj.latitude),
        // ];
        store.device2Pos = wgs84togcj02(
          parseFloat(obj.longitude),
          parseFloat(obj.latitude)
        );
      });

      getEeditPlanExecute({
        deviceKey: '长空之王',
      }).then((res) => {
        if (save !== res.data.data.planInfo) {
          store.device1Line = JSON.parse(res.data.data.planInfo);
          FavoriteRef.value.initMapFn();
          save = res.data.data.planInfo;
        }
      });
    }, 1000);
  });
};
onMounted(() => {
  // store.device1Pos = [116.316062, 39.828417];
  test();
});
onUnmounted(() => {
  clearInterval(timer);
  clearInterval(timer2);
});
</script>

<style lang="less" scoped>
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
