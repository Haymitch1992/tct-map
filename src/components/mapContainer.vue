<script setup>
import { onMounted, ref, shallowRef } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import mapItem3 from './map-item-3.vue';
import bicycle from '../assets/bicycle.png';
import iconimg1 from '../assets/icon1.png';
import iconimg2 from '../assets/icon2.png';
import iconimg3 from '../assets/icon3.png';
window._AMapSecurityConfig = {
  securityJsCode: '7e5bc09f4481b57e427367314025db90',
};
//
var path = [
  [116.403322, 39.920255],
  [116.410703, 39.897555],
  [116.402292, 39.892353],
  [116.389846, 39.891365],
];

const showBtn = ref(true);
var map = shallowRef(null);
var heatmap = '';
var dialogVisible2 = ref(false);
const initMap = () => {
  AMapLoader.load({
    key: '2b22402984a62e37a7cf1854ceec05f1', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      'AMap.ControlBar',
      'AMap.ToolBar',
      'AMap.KmlLayer',
      'AMap.Polyline',
      'AMap.PolylineEditor',
    ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      map = new AMap.Map('container', {
        //设置地图容器id
        viewMode: '3D', //是否为3D地图模式
        zoom: 13.3, //初始化地图级别
        center: [116.403512, 39.934204], //初始化地图中心点位置
        // mapStyle: 'amap://styles/whitesmoke',
        layers: [new AMap.TileLayer.Satellite()],
        // mapStyle: 'amap://styles/e50de4d7443ce2cc633112de2de760df',
      });

      var controlBar = new AMap.ControlBar({
        position: {
          left: '10px',
          top: '10px',
        },
      });
      controlBar.addTo(map);

      var toolBar = new AMap.ToolBar({
        position: {
          left: '40px',
          top: '110px',
        },
      });
      toolBar.addTo(map);

      var polyline1 = new AMap.Polyline({
        path: path,
        strokeColor: '#ffffff',
        strokeWeight: 6,
        strokeOpacity: 0.9,
        zIndex: 50,
        bubble: true,
      });
      var polyEditor;
      // var polyEditor = new AMap.PolyEditor(map, polygon)
      // polyEditor = new AMap.PolygonEditor(map)
      polyEditor = new AMap.PolylineEditor(map, polyline1);

      polyEditor.setTarget(polyline1);
      polyEditor.open();
      map.add([polyline1]);
    })
    .catch((e) => {
      console.log(e);
    });
};
const showDialog = () => {
  dialogVisible2.value = true;
};
const showMap = () => {
  heatmap.show();
  showBtn.value = true;
};
const hideMap = () => {
  heatmap.hide();
  showBtn.value = false;
};
onMounted(() => {
  initMap();
});
const count = ref(0);
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
