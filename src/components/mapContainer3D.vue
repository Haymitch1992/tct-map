<!-- 3d平面地图 -->
<script setup>
import { onMounted, onUnmounted, ref, shallowRef, reactive, watch } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import { mainStore } from '../store/index';
import { ElMessage } from 'element-plus';

// 飞行器图层
var airPointLayer2 = null;
var airPointLayer = null;

const props = defineProps({
  view3D: {
    //3D 地图 和2D 切换
    type: Boolean,
    required: true,
    default: false,
  },
  uesMouseTool: {
    // 是否使用鼠标工具
    type: Boolean,
    required: true,
    default: false,
  },
});

var Map3DPluginInit = false;

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
var circle = null;
var mouseTool = null;
var mouseToolMark = null;
var dialogVisible2 = ref(false);
const initMap = () => {
  AMapLoader.load({
    key: '2b22402984a62e37a7cf1854ceec05f1', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      'AMap.ControlBar',
      'AMap.MouseTool',
      'AMap.ToolBar',
      'AMap.KmlLayer',
      'AMap.Polyline',
      'AMap.PolylineEditor',
      'AMap.Icon',
      'AMap.Buildings',
      'AMap.Map3D',
      'AMap.Polygon',
      'AMap.PolyEditor',
      'AMap.Marker',
      'AMap.Text',
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
        zoom: 13.8, //初始化地图级别
        terrain: true,
        center: [...store.device1Pos],
        // center: [116.326755, 39.788338], //初始化地图中心点位置
        // mapStyle: 'amap://styles/whitesmoke',
        layers: [
          new AMap.TileLayer.Satellite(),
          buildings,
          new AMap.TileLayer.RoadNet({
            opacity: 0.5,
            features: ['buildings'],
          }),
        ],
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

      circle = new AMap.Circle({
        center: new AMap.LngLat(116.068742, 39.894194), // 圆心位置,
        radius: 500, //半径
        strokeColor: '#F33', //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 3, //线粗细度
        fillColor: '#ee2200', //填充颜色
        fillOpacity: 0.8, //填充透明度
      });

      if (props.uesMouseTool) {
        // 是否提供鼠标绘制工具
        mouseTool = new AMap.MouseTool(map);
        mouseTool.on('draw', function (event) {
          // event.obj 为绘制出来的覆盖物对象
          if (event.obj.CLASS_NAME == 'AMap.Polygon') {
            store.area = [event.obj.getPath()];
            mouseTool.close(true);
            ElMessage({
              message: '任务区域绘制完成',
              type: 'success',
            });
          }

          if (event.obj.CLASS_NAME == 'AMap.Marker') {
            ElMessage({
              message: '中心点绘制完成',
              type: 'success',
            });
            store.centerPoint = [event.obj.getPosition()];
            mouseTool.close(true);
          }
        });
      }
      //
      map.plugin(['Map3D'], function () {
        // 插件加载成功
        Map3DPluginInit = true;
      });

      airPointLayer = new AMap.Object3DLayer({ zIndex: 110, opacity: 1 });
      map.add(airPointLayer);
      airPointLayer2 = new AMap.Object3DLayer({ zIndex: 110, opacity: 1 });
      map.add(airPointLayer2);

      if (props.view3D) {
        // 显示三维视图
        // if (props.showAir) {
        //   draw3dPoint2();
        //   draw3dPoint3();
        // }
        // if (props.showLine2) {
        //   draw3dLine2();
        //   drawSubLine2();
        // }
        // // 创建楼快
        // draw3dLine();
        // drawSubLine();
      } else {
        drawLine();
      }
      // drawTaskArea(store.area);
      // drawCenterPoint(store.centerPoint);
      drawReact();
      drawAirport();
      // 是否存在 任务区域
      if (store.area.length > 0) {
        drawTaskArea(store.area);
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const drawLine = () => {
  console.log('绘制线', props.view3D);
  let path = JSON.parse(JSON.stringify(store.device1Line));
  //
  var polyline1 = new AMap.Polyline({
    path: path,
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
  map.setFitView();
};

// 绘制任务范围
const drawTaskArea = (arr) => {
  // 清除掉之前的的图层
  // if (store.areaSave.length > 0) {
  //   store.areaSave.forEach((item) => {
  //     item.polyEditor.close();
  //     map.remove(item.polygon);
  //   });
  // }

  arr.forEach((item, index) => {
    console.log(item, index, '绘制任务范围');
    // 克隆数组item
    // var pathArr = JSON.parse(JSON.stringify(item));
    // console.log('pathArr', pathArr);
    var polygon = new AMap.Polygon({
      //       path: item,
      path: returnLinePath(item),
      strokeColor: '#FF33FF',
      strokeWeight: 6,
      strokeOpacity: 0.2,
      fillOpacity: 0.4,
      fillColor: '#1791fc',
      zIndex: 50,
    });

    map.add(polygon);
    map.setFitView();
  });
};

const drawCenterPoint = (arr) => {
  arr.forEach((item, index) => {
    var marker = new AMap.Marker({
      position: new AMap.LngLat(item.lng, item.lat),
      offset: new AMap.Pixel(-13, -30),
    });
    map.add(marker);
  });
};

const drawAirport = () => {
  store.airportList.forEach((item, index) => {
    let pos = JSON.parse(JSON.stringify(item.position));
    var text = new AMap.Text({
      text: item.name,
      anchor: 'center', // 设置文本标记锚点
      // draggable: true,
      cursor: 'pointer',
      style: {
        padding: '0 .4rem',
        'margin-bottom': '1rem',
        'border-radius': '.25rem',
        'background-color': 'white',
        // 'width': '15rem',
        'border-width': 0,
        'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
        'text-align': 'center',
        'font-size': '12px',
        color: 'blue',
      },
      position: pos,
    });

    var circle = new AMap.Circle({
      center: new AMap.LngLat(...pos), // 圆心位置,
      radius: 2500, //半径
      strokeColor: '#026', //线颜色
      strokeOpacity: 1, //线透明度
      strokeWeight: 3, //线粗细度
      fillColor: '#002266', //填充颜色
      fillOpacity: 0.4, //填充透明度
    });

    map.add(text);
    map.add(circle);
  });
};

var fireLayer = null;
var fireArea = null;
// 绘制火苗
const drawFire = () => {
  if (fireLayer) {
    fireLayer.clear();
    map.remove(fireLayer);
  }
  if (fireArea) {
    fireLayer.clear();
    map.remove(fireArea);
  }

  var icon = {
    // 图标类型，现阶段只支持 image 类型
    type: 'image',
    // 图片 url
    image: '/fire.gif',
    // 图片尺寸
    size: [48, 48],
    // 图片相对 position 的锚点，默认为 bottom-center
    anchor: 'center',
  };
  // 创建火苗图层
  fireLayer = new AMap.LabelsLayer({
    zooms: [3, 20],
    zIndex: 1000,
  });
  let markerList = store.fireRange.markerList;
  let markers = [];
  markerList.forEach((item) => {
    var labelMarker = new AMap.LabelMarker({
      position: item,
      icon,
    });

    markers.push(labelMarker);
  });

  if (store.fireRange.fireArea.length === 0) return;
  fireArea = new AMap.Polygon({
    path: returnLinePath(store.fireRange.fireArea),
    strokeColor: '#F00',
    strokeWeight: 6,
    strokeOpacity: 0.2,
    fillOpacity: 0.4,
    fillColor: '#aa0000',
    zIndex: 50,
  });

  fireLayer.add(markers);
  map.add(fireLayer);
  map.add(fireArea);
  // 获取火苗坐标
};

// 编辑任务范围

const editTaskPolygon = () => {
  var polyEditor = new AMap.PolyEditor(map, polygon);

  polyEditor.on('end', function (event) {
    // event.target 即为编辑后的多边形对象
  });
  polyEditor.open();
};

// 绘制多边形

const drawPolygon = () => {
  mouseTool.polygon({
    strokeColor: '#FF33FF',
    strokeOpacity: 1,
    strokeWeight: 6,
    strokeOpacity: 0.2,
    fillColor: '#1791fc',
    fillOpacity: 0.4,
    // 线样式还支持 'dashed'
    strokeStyle: 'solid',
    // strokeStyle是dashed时有效
    strokeDasharray: [30, 10],
  });
};

const drawMark = () => {
  mouseTool.marker();
  // mouseTool.mark({
  //   icon: 'M100,100 L200,100 100,200 Z',
  //   offsetX: 0,
  //   offsetY: 0,
  //   scale: 1,
  //   strokeColor: '#FF33FF',
  //   strokeOpacity: 1,
  //   strokeWeight: 6,
  //   strokeOpacity: 0.2,
  // });
};

const returnLinePath = (data) => {
  let arr = [];
  for (const item of data) {
    arr.push([item.lng, item.lat]);
  }
  return arr;
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

var drawSubLineLayer = null;
const drawSubLine = () => {
  console.log(drawSubLine);
  if (store.device1Line.length === 0) return;
  drawSubLineLayer = new AMap.Object3DLayer({ zIndex: 110, opacity: 1 });
  map.add(drawSubLineLayer);
  map.setCenter(store.device1Line[0]);
  var lines = new AMap.Object3D.Line();
  var lineGeo = lines.geometry;
  let path = JSON.parse(JSON.stringify(store.device1Line));

  var points3D = new AMap.Object3D.RoundPoints();
  points3D.transparent = true;
  var pointsGeo = points3D.geometry;

  for (var i = 0; i < path.length; i++) {
    var center = map.lngLatToGeodeticCoord(path[i]);
    var height = -store.altitudeList[i] || 0;
    console.log('height', height);
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

  drawSubLineLayer.add(lines);
  drawSubLineLayer.add(points3D);
};

var drawSubLineLayer2 = null;
const drawSubLine2 = () => {
  if (store.device2Line.length === 0) return;
  drawSubLineLayer2 = new AMap.Object3DLayer({ zIndex: 110, opacity: 1 });
  map.add(drawSubLineLayer2);

  var lines = new AMap.Object3D.Line();
  var lineGeo = lines.geometry;
  let path = JSON.parse(JSON.stringify(store.device2Line));
  var points3D = new AMap.Object3D.RoundPoints();
  points3D.transparent = true;
  var pointsGeo = points3D.geometry;

  for (var i = 0; i < path.length; i++) {
    var height = -store.altitudeList2[i] || 0;
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
    pointsGeo.vertexColors.push(0.7, 0, 1, 1);
    // height -= 1000;
  }

  points3D.borderColor = [0.4, 0.8, 1, 1];
  points3D.borderWeight = 1;

  drawSubLineLayer2.add(lines);
  drawSubLineLayer2.add(points3D);
};

var drawSubLineLayerHistory = null;
const drawSubLineHistory = () => {
  if (store.historyPointList.length === 0) return;
  drawSubLineLayerHistory = new AMap.Object3DLayer({ zIndex: 110, opacity: 1 });
  map.add(drawSubLineLayerHistory);
  map.setCenter(store.historyPointList[0]);

  var lines = new AMap.Object3D.Line();
  var lineGeo = lines.geometry;
  let path = JSON.parse(JSON.stringify(store.historyPointList));
  var points3D = new AMap.Object3D.RoundPoints();
  points3D.transparent = true;
  var pointsGeo = points3D.geometry;

  for (var i = 0; i < path.length; i++) {
    var height = -store.historyAltitudeList[i] || 0;
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
    pointsGeo.vertexColors.push(0.7, 0, 1, 1);
    // height -= 1000;
  }

  points3D.borderColor = [1, 1, 1, 1];
  points3D.borderWeight = 1;

  drawSubLineLayerHistory.add(lines);
  drawSubLineLayerHistory.add(points3D);
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

  addBox([...store.barrierPos], ...store.barrierStyle);
};
// 绘制三维路线
var draw3dLineLayer = null; // 图层

const draw3dLine = () => {
  if (store.device1Line.length === 0) return;
  map.plugin(['Map3D'], function () {
    draw3dLineLayer = new AMap.Object3DLayer();
    let path = JSON.parse(JSON.stringify(store.device1Line));
    let arr = [];
    store.altitudeList.forEach((item, index) => {
      if (!item) {
        arr.push(-1);
      } else {
        arr.push(item);
      }
    });
    var meshLine = new AMap.Object3D.MeshLine({
      path: path,
      height: store.altitudeList,
      height: arr,
      color: 'rgba(55,129,240, 0.9)',
      width: 6,
    });

    meshLine.transparent = true;
    draw3dLineLayer.add(meshLine);
    meshLine['backOrFront'] = 'both';
    map.add(draw3dLineLayer);
    map.setCenter([...store.device1Pos]);
  });
};
var draw3dLineLayer2 = null;
const draw3dLine2 = () => {
  if (store.device2Line.length === 0) return;
  map.plugin(['Map3D'], function () {
    draw3dLineLayer2 = new AMap.Object3DLayer();
    let path = JSON.parse(JSON.stringify(store.device2Line));

    let arr = [];
    store.altitudeList2.forEach((item, index) => {
      if (!item) {
        arr.push(-1);
      } else {
        arr.push(item);
      }
    });
    var meshLine = new AMap.Object3D.MeshLine({
      path: path,
      height: arr,
      color: 'rgba(155,129,240, 0.9)',
      width: 6,
    });

    meshLine.transparent = true;
    draw3dLineLayer2.add(meshLine);
    meshLine['backOrFront'] = 'both';
    map.add(draw3dLineLayer2);
  });
};

var draw3dLineLayerHistory = null;
const draw3dLineHistory = () => {
  if (store.historyPointList.length === 0) return;
  map.plugin(['Map3D'], function () {
    draw3dLineLayerHistory = new AMap.Object3DLayer();
    let path = JSON.parse(JSON.stringify(store.historyPointList));

    let arr = [];
    store.historyAltitudeList.forEach((item, index) => {
      if (!item) {
        arr.push(-1);
      } else {
        arr.push(item);
      }
    });
    var meshLine = new AMap.Object3D.MeshLine({
      path: path,
      height: arr,
      color: 'rgba(100,200,200, 1)',
      width: 6,
    });

    meshLine.transparent = true;
    draw3dLineLayerHistory.add(meshLine);
    meshLine['backOrFront'] = 'both';
    map.add(draw3dLineLayerHistory);
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

const draw3dPoint2 = () => {
  if (!store.device1Pos) return;

  var lines = new AMap.Object3D.Line();
  var lineGeo = lines.geometry;
  var path = [store.device1Pos];
  var points3D = new AMap.Object3D.RoundPoints();
  points3D.transparent = true;
  var pointsGeo = points3D.geometry;
  var height = -store.altitude * 1;
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

  // 清除图层上的内容
  airPointLayer2.clear();

  airPointLayer2.add(lines);
  airPointLayer2.add(points3D);
  // 绘制文字
  drawText();
};

//
var textDom = null;
const drawText = () => {
  if (textDom) {
    map.remove(textDom);
  }
  let dom = `
  设备：有人机 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;高度：${store.altitude}米<br>
  经度：${store.device1Pos[0]}°&nbsp;&nbsp; 
  纬度：${store.device1Pos[1]}°<br>

  `;
  textDom = new AMap.Text({
    text: dom,
    anchor: 'top-center', // 设置文本标记锚点
    draggable: true,
    // offset: [10, 0],
    cursor: 'pointer',
    style: {
      padding: '12px',
      'margin-bottom': '-2rem',
      'border-radius': '.25rem',
      'background-color': 'rgba(0,0,0,.6)',
      'border-width': 0,
      'text-align': 'center',
      'font-size': '12px',
      'text-align': 'left',
      color: '#fff',
    },
    position: store.device1Pos,
  });
  textDom.setMap(map);
};

var textDom2 = null;
const drawText2 = () => {
  if (textDom2) {
    map.remove(textDom2);
  }
  let dom = `
  设备：无人机 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;高度：${store.altitude2}米<br>
  经度：${store.device2Pos[0]}°&nbsp;&nbsp; 
  纬度：${store.device2Pos[1]}°<br>

  `;
  textDom2 = new AMap.Text({
    text: dom,
    anchor: 'top-center', // 设置文本标记锚点
    draggable: true,
    // offset: [10, 0],
    cursor: 'pointer',
    style: {
      padding: '12px',
      'margin-bottom': '-2rem',
      'border-radius': '.25rem',
      'background-color': 'rgba(0,0,0,.6)',
      'border-width': 0,
      'text-align': 'center',
      'font-size': '12px',
      'text-align': 'left',
      color: '#fff',
    },
    position: store.device2Pos,
  });
  textDom2.setMap(map);
};

const draw3dPoint3 = () => {
  if (!store.device2Pos) return;
  var lines = new AMap.Object3D.Line();
  var lineGeo = lines.geometry;
  var path = [store.device2Pos];
  var points3D = new AMap.Object3D.RoundPoints();
  points3D.transparent = true;
  var pointsGeo = points3D.geometry;
  var height = -store.altitude2 * 1;
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
    pointsGeo.vertexColors.push(0.7, 1, 1, 1);
    // height -= 1000;
  }

  points3D.borderColor = [0.4, 0.8, 1, 1];
  points3D.borderWeight = 1;
  airPointLayer.clear();
  airPointLayer.add(lines);
  airPointLayer.add(points3D);
  drawText2();
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
onUnmounted(() => {
  // 销毁地图
  console.log('销毁地图');
  map.destroy();
});
const count = ref(0);

// 显示火灾
const showWarning = () => {
  drawFire();
};
// 隐藏火灾
const hideWarning = () => {
  map.remove(fireLayer);
  map.remove(fireArea);
};

const setFitViewFn = () => {
  map.setFitView();
};

const initMapFn = () => {
  initMap();
};

// 暴露出方法
defineExpose({
  closeEdit,
  startEdit,
  showWarning,
  hideWarning,
  initMapFn,
  setFitViewFn,
  drawPolygon,
  drawMark,
});

watch(
  () => store.device1Line,
  (data) => {
    //  绘制有人机航线
    if (props.view3D && Map3DPluginInit) {
      if (draw3dLineLayer) {
        map.remove(draw3dLineLayer);
      }
      if (drawSubLineLayer) {
        map.remove(drawSubLineLayer);
      }
      draw3dLine();
      drawSubLine();
    }
  },
  {
    deep: true,
  }
);
watch(
  () => store.fireRange,
  (data) => {
    //  绘制有人机航线

    drawFire();
  },
  {
    deep: true,
  }
);

watch(
  () => store.device2Line,
  (data) => {
    //  绘制有人机航线
    if (props.view3D && Map3DPluginInit) {
      if (draw3dLineLayer2) {
        map.remove(draw3dLineLayer2);
      }

      if (drawSubLineLayer2) {
        map.remove(drawSubLineLayer2);
      }
      draw3dLine2();
      drawSubLine2();
    }
  },
  {
    deep: true,
  }
);

watch(
  () => store.device1Pos,
  (a) => {
    if (store.device1Pos && Map3DPluginInit) {
      draw3dPoint2();
    }
  },
  {
    deep: true,
  }
);
watch(
  () => store.device2Pos,
  (a) => {
    if (store.device2Pos && Map3DPluginInit) {
      draw3dPoint3();
    }
  },
  {
    deep: true,
  }
);
// 监听area的变化
watch(
  () => store.area,
  (a) => {
    if (Map3DPluginInit) {
      map.clearMap();
      drawTaskArea(store.area);
      drawCenterPoint(store.centerPoint);
      drawAirport();
    }
    // 绘制范围
  },
  {
    deep: true,
  }
);
watch(
  () => store.centerPoint,
  (a) => {
    if (store.centerPoint) {
      // 绘制范围
      map.clearMap();
      drawCenterPoint(store.centerPoint);
      drawTaskArea(store.area);
      drawAirport();
    }
  },
  {
    deep: true,
  }
);

watch(
  () => store.historyPointList,
  (data) => {
    //  绘制有人机航线
    if (props.view3D && Map3DPluginInit) {
      if (draw3dLineLayerHistory) {
        map.remove(draw3dLineLayerHistory);
      }

      if (drawSubLineLayerHistory) {
        map.remove(drawSubLineLayerHistory);
      }
      drawSubLineHistory();
      draw3dLineHistory();
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
