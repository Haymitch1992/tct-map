<!-- 2d平面地图 -->
<script setup>
import { onMounted, ref, shallowRef, reactive, watch } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import { mainStore } from '../store/index';

const store = mainStore();
window._AMapSecurityConfig = {
  securityJsCode: '7e5bc09f4481b57e427367314025db90',
};

var path = store.device1Line;
var polyEditor = null;
console.log(path, 'path');

const showBtn = ref(true);
var map = shallowRef(null);
var heatmap = '';
var dialogVisible2 = ref(false);

const initMap = () => {
  AMapLoader.load({
    key: '2b22402984a62e37a7cf1854ceec05f1', // 申请好的Web端开发者Key，首次调用 load 时必填
    // version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      'AMap.ControlBar',
      'AMap.ToolBar',
      'AMap.KmlLayer',
      'AMap.Polyline',
      'AMap.PolyEditor',
      'AMap.Icon',
      'AMap.Buildings',
    ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      var buildings = new AMap.Buildings({
        zooms: [16, 18],
        zIndex: 10,
        heightFactor: 2, // 2 倍于默认高度（3D 视图下生效）
      });

      map = new AMap.Map('container', {
        //设置地图容器id
        viewMode: '3D', //是否为3D地图模式

        pitch: 60,
        showBuildingBlock: false,
        zoom: 15.8, //初始化地图级别
        terrain: true,
        center: [116.316747, 39.827918], //初始化地图中心点位置
        // mapStyle: 'amap://styles/whitesmoke',
        layers: [new AMap.TileLayer.Satellite(), buildings],
        // mapStyle: 'amap://styles/e50de4d7443ce2cc633112de2de760df',
      });

      // 创建楼快

      map.addControl(
        new AMap.ControlBar({
          showZoomBar: false,
          showControlButton: true,
          position: {
            right: '10px',
            top: '10px',
          },
        })
      );

      drawLine();

      // var polyEditor = new AMap.PolyEditor(map, polygon)
      // polyEditor = new AMap.PolygonEditor(map)
    })
    .catch((e) => {
      console.log(e);
    });
};

const calcLine = (data) => {
  let arr = [];
  for (const item of data) {
    arr.push([item.lng, item.lat]);
  }
  store.device1Line = arr;
};
const airList = reactive({
  device1Posion: [116.3154, 39.828891], // 无人机当前经纬度数据 飞行姿态数据
  // 无人机飞行轨迹
  device1Line: [],

  device2Posion: [116.3154, 39.828891], // 直升机经纬度// 飞机姿态信息
  // 直升机飞行轨迹
  device2Line: [],
});

const drawLine = (lineData) => {
  var polyline1 = new AMap.Polyline({
    path: store.device1Line,
    strokeWeight: 6,
    strokeOpacity: 0.9,
    zIndex: 50,
    showDir: true,
    height: 190,
    bubble: true,
    dirColor: 'pink',
    strokeColor: '#3366cc', // 线颜色
    strokeWeight: 10,
  });

  polyEditor = new AMap.PolyEditor(map, polyline1);

  // polyEditor.setTarget(polyline1);
  polyEditor.on('adjust', function (event) {
    let path = event.target.getPath();
    calcLine(path);
  });
  polyEditor.on('addnode', function (event) {
    let path = event.target.getPath();
    calcLine(path);
  });
  // polyEditor.open();
  map.add([polyline1]);
  map.setFitView([polyline1]);
};

// 结束编辑

const closeEdit = () => {
  polyEditor.close();
};

const startEdit = () => {
  polyEditor.open();
};

const initMapFn = () => {
  initMap();
};
onMounted(() => {
  initMap();
});
const count = ref(0);

// 暴露出方法
defineExpose({
  closeEdit,
  startEdit,
  initMapFn,
});

watch(
  () => store.device1Line,
  (data) => {
    // initMap();
  },
  {
    deep: true,
  }
);
watch(
  () => store.device1Pos,
  (a) => {
    map.clearMap();
    drawLine();
  },
  {
    deep: true,
  }
);
</script>

<template>
  <div id="container"></div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
#container {
  width: calc(100vw - 410px);
  height: calc(100vh - 64px);
  position: relative;
}
.pos-container {
  position: absolute;
  top: 4px;
  left: 10px;
  z-index: 1000;
}
</style>
