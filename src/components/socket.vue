<template>
  <div class="box"></div>
</template>
<script>
import { mainStore } from '../store/index';
import { ElMessage } from 'element-plus';
const store = mainStore();
const heartCheck = {
  timeout: 60 * 1000,
  timer: null,
  serverTimer: null,
  reset() {
    this.timer && clearTimeout(this.timer);
    this.serverTimer && clearTimeout(this.serverTimer);
  },
  start(ws) {
    this.reset();
    this.timer = setTimeout(() => {
      // onmessage拿到返回的心跳就说明连接正常
      // ws.send(JSON.stringify({ deviceKey: '有人机', type: 2 }));
      // ws.send(JSON.stringify({ deviceKey: '无人机', type: 2 }));
      this.serverTimer = setTimeout(() => {
        // 如果超过一定时间还没响应(响应后触发重置)，说明后端断开了
        ws.close();
      }, this.timeout);
    }, this.timeout);
  },
};
var lineObj = null;
var lineObj2 = null;
export default {
  // 获取车辆信息
  // 获取车站信息
  name: 'Websocket',
  data() {
    return {
      wsuri: 'wss://172.51.216.125:12126/websocket',
      lockReconnect: false, // 连接失败不进行重连
      maxReconnect: 5, // 最大重连次数，若连接失败
      socket: null,
    };
  },
  mounted() {
    this.initWebSocket();
  },
  methods: {
    reconnect() {
      console.log('尝试重连');
      if (this.lockReconnect || this.maxReconnect <= 0) {
        return;
      }
      setTimeout(() => {
        // this.maxReconnect-- // 不做限制 连不上一直重连
        this.initWebSocket();
      }, 600 * 1000);
    },
    initWebSocket() {
      try {
        if ('WebSocket' in window) {
          this.socket = new WebSocket(this.wsuri);
        } else {
          console.log('您的浏览器不支持websocket');
        }
        this.socket.onopen = this.websocketonopen;
        this.socket.onerror = this.websocketonerror;
        this.socket.onmessage = this.websocketonmessage;
        this.socket.onclose = this.websocketclose;
      } catch (e) {
        this.reconnect();
      }
    },
    websocketonopen() {
      console.log('WebSocket连接成功', this.socket.readyState);
      heartCheck.start(this.socket);
      // this.socket.send('发送数据')
      setTimeout(() => {
        this.websocketsend();
      }, 1000);
    },
    websocketonerror(e) {
      console.log('WebSocket连接发生错误', e);
      this.reconnect();
    },
    websocketonmessage(e) {
      let obj = JSON.parse(e.data);
      // 消息获取成功，重置心跳
      heartCheck.start(this.socket);
      // 飞行器数据 类型1
      if (obj.type === 1) {
        switch (obj.data.deviceKey) {
          case '有人机':
            store.device1Pos = [obj.data.longitude * 1, obj.data.latitude * 1];
            store.altitude = obj.data.altitude;
            // let headingAngleObj = JSON.parse();
            // console.log(obj.data.flightTrack,'obj.data.flightTrack');
            let str = obj.data.flightTrack.replace(/'/g, '"');
            let saveObj = JSON.parse(str);
            // 将 str 中的'替换成"

            // let saveObj = JSON.parse(obj.data.flightTrack);
            store.headingAngle = saveObj.headingAngle;
            store.dronePosition = obj.data.dronePosition;

            break;
          case '无人机':
            store.device2Pos = [obj.data.longitude * 1, obj.data.latitude * 1];
            store.altitude2 = obj.data.altitude;

            if (obj.data.warningType === '1002') {
              ElMessage({
                message: obj.data.warningInfo,
                grouping: true,
                type: 'warning',
              });
            } else if (obj.data.warningType === '1003') {
              ElMessage({
                message: obj.data.warningInfo,
                grouping: true,
                type: 'warning',
              });
            }
            break;
        }
      }

      // 航线信息 类型2
      if (obj.type === 2) {
        if (obj.code === 200) {
          // 储存航线
          switch (obj.data.deviceKey) {
            case '有人机':
              lineObj = JSON.parse(obj.data.planInfo);
              if (lineObj.pointList) {
                store.device1Line = lineObj.pointList;
                store.altitudeList = lineObj.altitudeList;
              } else {
                store.device1Line = lineObj;
                store.altitudeList = [];
                store.device1Line.forEach((item, index) => {
                  if (index === 0) {
                    store.altitudeList.push(0);
                  } else {
                    store.altitudeList.push(500);
                  }
                });
              }

              // store.device1Line = JSON.parse(obj.data.planInfo);
              break;
            case '无人机':
              lineObj2 = JSON.parse(obj.data.planInfo);
              if (lineObj2.pointList) {
                store.device2Line = lineObj2.pointList;
                store.altitudeList2 = lineObj2.altitudeList;
              } else {
                store.device2Line = lineObj2;
                store.altitudeList2 = [];
                store.device2Line.forEach((item, index) => {
                  if (index === 0) {
                    store.altitudeList2.push(0);
                  } else {
                    store.altitudeList2.push(500);
                  }
                });
              }

              // store.device2Line = JSON.parse(obj.data.planInfo);
              break;
          }
        }
      }

      if (obj.type === 0 && obj.code === 40001) {
        // 根据deviceKey 去清空对应航线
        switch (obj.data) {
          case '有人机':
            store.device1Line = [];
            store.altitudeList = [];
            break;
          case '无人机':
            store.device2Line = [];
            store.altitudeList2 = [];
            break;
        }
      }
      if (obj.type === 3) {
        // 存储火灾状态
        if (obj.data.fireRange) {
          store.fireRange = JSON.parse(obj.data.fireRange);
        } else {
          store.fireRange = {
            markerList: [],
            fireArea: [],
          };
        }
      }
    },
    websocketclose(e) {
      console.log('connection closed (' + e.code + ')');
      this.reconnect();
    },
    websocketsend() {
      this.socket.send(JSON.stringify({ deviceKey: '有人机', type: 2 }));
      this.socket.send(JSON.stringify({ deviceKey: '无人机', type: 2 }));
    },
  },
  unmounted() {
    this.socket.close();
  },
};
</script>
