<script setup>
import { onMounted, ref, shallowRef } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import bicycle from '../assets/bicycle.png';
import iconimg1 from '../assets/icon1.png';
import iconimg2 from '../assets/icon2.png';
import iconimg3 from '../assets/icon3.png';

window._AMapSecurityConfig = {
  securityJsCode: '7e5bc09f4481b57e427367314025db90',
};

var map = shallowRef(null);
var driving = '';
const initMap = () => {
  AMapLoader.load({
    key: '2b22402984a62e37a7cf1854ceec05f1', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      map = new AMap.Map('container3', {
        //设置地图容器id
        viewMode: '3D', //是否为3D地图模式
        zoom: 13.3, //初始化地图级别
        // center: [116.403512, 39.934204], //初始化地图中心点位置
        mapStyle: 'amap://styles/whitesmoke',
        // mapStyle: 'amap://styles/68daad87ede66e0a4b631f8b385ee14e',
      });
      let list = [
        [116.429028, 39.905042],
        [116.429328, 39.905144],
        [116.429428, 39.905344],
        [116.429428, 39.905544],
        [116.429428, 39.905744],
        [116.429528, 39.905844],
        [116.429628, 39.905544],
        [116.429528, 39.905444],
      ];
      var circle = new AMap.Circle({
        center: [116.427528, 39.905042],
        radius: 300, //半径
        borderWeight: 3,
        strokeColor: '#FF33FF',
        strokeOpacity: 1,
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        strokeStyle: 'dashed',
        strokeDasharray: [10, 10],
        // 线样式还支持 'dashed'
        fillColor: '#ee2200',
        zIndex: 50,
      });
      map.add(circle);
      map.setFitView([circle]);
      map.plugin('AMap.Icon', function () {
        var startIcon = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(32, 32),
          // 图标的取图地址
          image: bicycle,
          anchor: 'center',
          // 图标所用图片大小
          imageSize: new AMap.Size(32, 32),
          // 图标取图偏移量
        });
        var icon1 = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(32, 32),
          // 图标的取图地址
          image: iconimg1,
          anchor: 'center',
          // 图标所用图片大小
          imageSize: new AMap.Size(32, 32),
          // 图标取图偏移量
        });
        var icon2 = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(32, 32),
          // 图标的取图地址
          image: iconimg2,
          anchor: 'center',
          // 图标所用图片大小
          imageSize: new AMap.Size(32, 32),
          // 图标取图偏移量
        });
        var icon3 = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(32, 32),
          // 图标的取图地址
          image: iconimg3,
          anchor: 'center',
          // 图标所用图片大小
          imageSize: new AMap.Size(32, 32),
          // 图标取图偏移量
        });

        list.forEach((item) => {
          var endMarker = new AMap.Marker({
            position: new AMap.LngLat(item[0], item[1]),
            icon: startIcon,
          });
          map.add([endMarker]);
        });
        var icon1dMarker = new AMap.Marker({
          position: new AMap.LngLat(116.424481, 39.905319),
          icon: icon1,
        });
        var icon2dMarker = new AMap.Marker({
          position: new AMap.LngLat(116.426881, 39.907519),
          icon: icon2,
        });
        var icon3dMarker = new AMap.Marker({
          position: new AMap.LngLat(116.423281, 39.909919),
          icon: icon3,
        });
        map.add([icon1dMarker, icon2dMarker, icon3dMarker]);

        //异步加载插件
      });
      // 创建一个自行车图标
    })
    .catch((e) => {
      console.log(e);
    });
};

onMounted(() => {
  initMap();
});
const count = ref(0);
</script>

<template>
  <div>
    <div id="container3"></div>
    <!-- <div id="panel"></div> -->
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}

#container3 {
  width: 1160px;
  height: 500px;
}
</style>
