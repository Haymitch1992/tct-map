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
const initMap = () => {
  AMapLoader.load({
    key: '2b22402984a62e37a7cf1854ceec05f1', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      'AMap.ControlBar',
      'AMap.ToolBar',
      'AMap.KmlLayer',
      'AMap.Polyline',
      'AMap.PolylineEditor',
      'AMap.Icon',
      'AMap.Buildings',
      'AMap.Map3D',
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
      // 创建楼快
      draw3dLine();
      drawSubLine();
      drawReact();

      draw3dPoint2();
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

// 绘制辅助线

const drawSubLine = () => {
  if (!store.device1Line) return;
  var object3Dlayer = new AMap.Object3DLayer({ zIndex: 110, opacity: 1 });
  map.add(object3Dlayer);

  var lines = new AMap.Object3D.Line();
  var lineGeo = lines.geometry;
  var path = store.device1Line;
  var points3D = new AMap.Object3D.RoundPoints();
  points3D.transparent = true;
  var pointsGeo = points3D.geometry;
  var height = -2000;
  for (var i = 0; i < path.length; i++) {
    var center = map.lngLatToGeodeticCoord(path[i]);

    // 连线
    lineGeo.vertices.push(center.x, center.y, 0);
    lineGeo.vertexColors.push(1, 1, 1, 1);
    lineGeo.vertices.push(center.x, center.y, height);
    lineGeo.vertexColors.push(1, 1, 1, 1);

    pointsGeo.vertices.push(center.x, center.y, 0); // 尾部小点
    pointsGeo.pointSizes.push(6);
    pointsGeo.vertexColors.push(0, 0, 1, 1);

    pointsGeo.vertices.push(center.x, center.y, height); // 空中点
    pointsGeo.pointSizes.push(10);
    pointsGeo.vertexColors.push(0, 0, 1, 1);
    // height -= 1000;
  }

  points3D.borderColor = [0.4, 0.8, 1, 1];
  points3D.borderWeight = 1;

  object3Dlayer.add(lines);
  object3Dlayer.add(points3D);
};

// 绘制遮挡物

const drawReact = () => {
  //
  map.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.5);
  map.DirectionLight = new AMap.Lights.DirectionLight(
    [-1, -1, 2],
    [1, 1, 1],
    0.5
  );

  var object3Dlayer = new AMap.Object3DLayer();
  map.add(object3Dlayer);
  var center = map.getCenter();

  //添加一个圆柱体
  var addBox = function (center, length, width, height) {
    var box = new AMap.Object3D.MeshAcceptLights();
    var geometry = box.geometry;
    box.textures.push(
      'https://a.amap.com/jsapi_demos/static/texture3d/shuilifang.png'
    );

    var halfLength = length / 2;
    var halfWidth = width / 2;
    var path = [
      [-halfLength, halfWidth],
      [halfLength, halfWidth],
      [halfLength, -halfWidth],
      [-halfLength, -halfWidth],
    ];

    //构造4个侧面
    for (var i = 0; i < 4; i += 1) {
      var x1 = path[i][0];
      var y1 = path[i][1];

      var x2 = path[(i + 1) % 4][0];
      var y2 = path[(i + 1) % 4][1];

      // 每个侧面四个顶点
      geometry.vertices.push(x1, y1, 0);
      geometry.vertices.push(x1, y1, -height);
      geometry.vertices.push(x2, y2, 0);
      geometry.vertices.push(x2, y2, -height);

      var v1 = new AMap.Vector3(0, 0, -height);
      var v2 = new AMap.Vector3(x2 - x1, y2 - y1, 0);

      // 各面的法向量
      var normal = new AMap.Vector3().crossVectors(v2, v1).normalize().elements;

      geometry.vertexNormals.push(normal[0], normal[1], normal[2]);
      geometry.vertexNormals.push(normal[0], normal[1], normal[2]);
      geometry.vertexNormals.push(normal[0], normal[1], normal[2]);
      geometry.vertexNormals.push(normal[0], normal[1], normal[2]);

      // 四个顶点的纹理坐标
      // geometry.vertexUVs.push(0, 1);
      //geometry.vertexUVs.push(0, 0);
      //geometry.vertexUVs.push(1, 1);
      //geometry.vertexUVs.push(1, 0);

      var bottomIndex = i * 4;
      var topIndex = bottomIndex + 1;
      var nextBottomIndex = bottomIndex + 2;
      var nextTopIndex = bottomIndex + 3;

      // 侧面三角形1
      geometry.faces.push(topIndex, bottomIndex, nextBottomIndex);
      // 侧面三角形2
      geometry.faces.push(topIndex, nextBottomIndex, nextTopIndex);
    }
    //构造顶面
    for (var i = 0; i < 4; i += 1) {
      geometry.vertices.push(path[i][0], path[i][1], -height);
      geometry.vertexNormals.push(0, 0, -1);
    }

    // 四个顶点的纹理坐标
    //geometry.vertexUVs.push(0, 2);
    // geometry.vertexUVs.push(1, 2);
    // geometry.vertexUVs.push(1, 0);
    //geometry.vertexUVs.push(0, 0);

    // 侧面三角形1
    geometry.faces.push(16 + 0, 16 + 1, 16 + 2);
    // 侧面三角形2
    geometry.faces.push(16 + 0, 16 + 2, 16 + 3);

    box.position(center);

    // 如果使用了透明颜色，请设置true
    box.transparent = true;
    object3Dlayer.add(box);
  };

  addBox([116.318662, 39.827917], 50, 3200, 500);
};
// 绘制三维路线

const draw3dLine = () => {
  if (!store.device1Line) return;
  map.plugin(['Map3D'], function () {
    var object3Dlayer = new AMap.Object3DLayer();
    var meshLine = new AMap.Object3D.MeshLine({
      path: store.device1Line,
      height: [2000, 2000, 2000, 2000, 2000, 2000],
      color: 'rgba(55,129,240, 0.9)',
      width: 6,
    });

    meshLine.transparent = true;
    object3Dlayer.add(meshLine);
    meshLine['backOrFront'] = 'both';
    map.add(object3Dlayer);
  });
};
const pointOnCubicBezier = (cp, t) => {
  var ax, bx, cx;
  var ay, by, cy;
  var tSquared, tCubed;

  cx = 3.0 * (cp[1].lng - cp[0].lng);
  bx = 3.0 * (cp[2].lng - cp[1].lng) - cx;
  ax = cp[3].lng - cp[0].lng - cx - bx;

  cy = 3.0 * (cp[1].lat - cp[0].lat);
  by = 3.0 * (cp[2].lat - cp[1].lat) - cy;
  ay = cp[3].lat - cp[0].lat - cy - by;

  tSquared = t * t;
  tCubed = tSquared * t;

  var lng = ax * tCubed + bx * tSquared + cx * t + cp[0].lng;
  var lat = ay * tCubed + by * tSquared + cy * t + cp[0].lat;

  return new AMap.LngLat(lng, lat);
};

const computeBezier = (points, numberOfPoints) => {
  var dt;
  var i;
  var curve = [];

  dt = 1.0 / (numberOfPoints - 1);

  for (i = 0; i < numberOfPoints; i++) {
    curve[i] = pointOnCubicBezier(points, i * dt);
  }

  return curve;
};

const getEllipseHeight = (count, maxHeight, minHeight) => {
  var height = [];
  var radionUnit = Math.PI / 180;

  for (var i = 0; i < count; i++) {
    height.push(minHeight);
  }

  return height;
};

// 绘制三维点
const draw3dPoint = () => {
  var object3Dlayer = new AMap.Object3DLayer({
    zIndex: 110,
    opacity: 1,
  });

  map.add(object3Dlayer);

  function lnglatToG20(lnglat) {
    lnglat = map.lngLatToGeodeticCoord(lnglat);
    lnglat.x = AMap.Util.format(lnglat.x, 3);
    lnglat.y = AMap.Util.format(lnglat.y, 3);
    return lnglat;
  }

  var coords = [store.device1Pos];

  // 纹理图片的长宽尺寸要求为：2的N次方个像素。
  // 因此这里的图片尺寸为 256px * 256px，也可以是1024*256等尺寸。
  var imgs = [
    // 'https://a.amap.com/jsapi_demos/static/demo-center/3d_texture_tiananmen_256.png',
    // 'http://localhost:5173/public/send.png',
    // '/test/images/2023/10/25/oTrT0Y.png',
    '/test/images/2023/10/25/oTrWj9.png',
  ];

  var points3D = new AMap.Object3D.Points();
  points3D.transparent = true;
  var geometry = points3D.geometry;
  for (var i = 0, len = imgs.length; i < len; i++) {
    var img = imgs[i];
    // 设置纹理贴图，数组中可以放入图片 url 和 canvas 对象，图片要符合宽高为 2的N次方 * 2的N次方个像素。
    // 纹理个数最多为8个，如果超出8个需要自行使用 CSS sprites 技术整合图片，并通过 vertexUVs 定位图片位置。
    console.log(img);
    points3D.textures.push(img);
  }

  for (var p = 0; p < coords.length; p += 1) {
    var center = lnglatToG20(coords[p]);

    geometry.vertices.push(center.x, center.y, -2000);
    geometry.vertices.push(center.x, center.y, 0);
    geometry.pointSizes.push(80);
    geometry.vertexColors.push(p * 0.029, p * 0.015, p * 0.01, 0.5);
    geometry.pointAreas.push(0, 0, 1, 1);
    // 每两个元素描述一个顶点的纹理坐标信息，纹理坐标以图片左上角为原点。分别是左上角和右下角。
    geometry.vertexUVs.push(0, 0, 1, 1);
    // 每个元素描述一个顶点的纹理索引信息，多纹理时使用，取值范围[0-7]。单纹理或者无纹理时不需要设值。
    geometry.textureIndices.push(p);
  }

  object3Dlayer.add(points3D);
};

let saveLines = null;
let savepoints3D = null;
const draw3dPoint2 = () => {
  if (!store.device1Pos) return;
  var object3Dlayer = new AMap.Object3DLayer({ zIndex: 110, opacity: 1 });
  map.add(object3Dlayer);

  var lines = new AMap.Object3D.Line();
  var lineGeo = lines.geometry;
  var path = [store.device1Pos];
  var points3D = new AMap.Object3D.RoundPoints();
  points3D.transparent = true;
  var pointsGeo = points3D.geometry;
  var height = -2000;
  for (var i = 0; i < path.length; i++) {
    var center = map.lngLatToGeodeticCoord(path[i]);

    // 连线
    lineGeo.vertices.push(center.x, center.y, 0);
    lineGeo.vertexColors.push(1, 1, 1, 1);
    lineGeo.vertices.push(center.x, center.y, height);
    lineGeo.vertexColors.push(1, 1, 1, 1);

    pointsGeo.vertices.push(center.x, center.y, 0); // 尾部小点
    pointsGeo.pointSizes.push(6);
    pointsGeo.vertexColors.push(0, 0, 1, 1);

    pointsGeo.vertices.push(center.x, center.y, height); // 空中点
    pointsGeo.pointSizes.push(10);
    pointsGeo.vertexColors.push(0, 1, 0, 1);
    // height -= 1000;
  }

  points3D.borderColor = [0.4, 0.8, 1, 1];
  points3D.borderWeight = 1;
  saveLines = lines;
  savepoints3D = points3D;
  object3Dlayer.add(lines);
  object3Dlayer.add(points3D);
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
onMounted(() => {
  initMap();
});
const count = ref(0);

// 暴露出方法
defineExpose({
  closeEdit,
  startEdit,
});

watch(
  () => store.device1Line,
  (data) => {
    if (store.device1Line) {
      // map.clearMap();
      // map.remove(saveLines);
      // map.remove(savepoints3D);
      initMap();
    }
  },
  {
    deep: true,
  }
);
watch(
  () => store.device1Pos,
  (a) => {
    if (store.device1Pos) {
      // map.remove(saveLines);
      // map.remove(savepoints3D);
      // console.log(123)
      draw3dPoint2();
    }
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
