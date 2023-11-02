<script setup>
import { onMounted, ref, shallowRef, reactive, watch } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import mapItem3 from './map-item-3.vue';
import airImg1 from '../assets/直升机.png';
import { mainStore } from '../store/index';

const store = mainStore();
window._AMapSecurityConfig = {
  securityJsCode: '7e5bc09f4481b57e427367314025db90',
};
//
var path = store.device1Line;
var polyEditor = null;
console.log(path, 'path');

const showBtn = ref(true);
var map = shallowRef(null);
var heatmap = '';
var dialogVisible2 = ref(false);
var marker = null;
const initMap = () => {
  AMapLoader.load({
    key: '2b22402984a62e37a7cf1854ceec05f1', // 申请好的Web端开发者Key，首次调用 load 时必填
    // version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      'AMap.ControlBar',
      'AMap.ToolBar',
      'AMap.KmlLayer',
      'AMap.Polyline',
      'AMap.PolylineEditor',
      'AMap.Icon',
      'AMap.Marker',
    ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      map = new AMap.Map('container', {
        //设置地图容器id
        viewMode: '3D', //是否为3D地图模式
        zoom: 15.8, //初始化地图级别
        terrain: true,
        center: [116.316747, 39.827918], //初始化地图中心点位置
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

      drawAir();
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
    bubble: true,
    dirColor: 'pink',
    strokeColor: '#3366cc', // 线颜色
    strokeWeight: 4,
  });

  // polyEditor = new AMap.PolylineEditor(map, polyline1);

  // polyEditor.setTarget(polyline1);
  // polyEditor.on('adjust', function (event) {
  //   let path = event.target.getPath();
  //   calcLine(path);
  // });
  // polyEditor.on('addnode', function (event) {
  //   let path = event.target.getPath();
  //   calcLine(path);
  // });
  // polyEditor.open();
  map.add([polyline1]);
};

let saveAir = null;

const drawAirAutoRotation = () => {
  marker = new AMap.Marker({
    map: map,
    position: [116.478935, 39.997761],
    icon: 'https://webapi.amap.com/images/car.png',
    offset: new AMap.Pixel(-26, -13),
    autoRotation: true,
    animateEnable: true,
    angle: -90,
  });
  marker.moveAlong(store.device1Line, 200);
};


const drawAir = () => {
  map.plugin('AMap.Icon', function () {
    var airIcon = new AMap.Icon({
      // 图标尺寸
      size: new AMap.Size(48, 48),
      // 图标的取图地址
      image: airImg1,

      anchor: 'center',
      // 图标所用图片大小
      imageSize: new AMap.Size(48, 48),

      // 图标取图偏移量
    });
    var airMarker = new AMap.Marker({
      position: new AMap.LngLat(...store.device1Pos),
      icon: airIcon,
      offset: new AMap.Pixel(-24, -24),
    });
    saveAir = airMarker;
    map.add([airMarker]);
    map.setFitView([airMarker]);
  });
};

// 结束编辑

const closeEdit = () => {
  polyEditor.close();
  console.log('结束编辑');
};

const startEdit = () => {
  polyEditor.open();
  console.log('结束编辑');
};

const changeRotation = (num) => {
  map.setRotation(num);
};

onMounted(() => {
  initMap();
});
const count = ref(0);

// 暴露出方法
defineExpose({
  closeEdit,
  startEdit,
  drawAirAutoRotation,
  changeRotation,
});

watch(
  () => store.device1Line,
  (data) => {
    initMap();
  },
  {
    deep: true,
  }
);
watch(
  () => store.device1Pos,
  (a) => {
    if (saveAir) {
      map.remove(saveAir);
    }

    drawAir();
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
  width: 1024px;
  height: 580px;
  position: relative;
}
.pos-container {
  position: absolute;
  top: 4px;
  left: 10px;
  z-index: 1000;
}
</style>
