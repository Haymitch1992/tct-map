// 1.定义状态容器和状态
// 2.修改容器中的state
// 3.仓库中的actions的使用
import { defineStore } from 'pinia'
import { userStore } from './user'

export const mainStore = defineStore('main', {
  state: () => { 
    // 定义状态
    return {
      device1Pos:[116.118815,39.922553],// 有人机 实时位置
      device1Line: [],// 有人机 航线
      device2Pos:[116.316062, 39.828417], // 无人机 实时位置
      device2Line: [], // 无人机 航线
      altitude: 0, // 有人机 高度
      headingAngle: 0, // 有人机偏转角度
      scene: 2,// 场景1 单个飞机  场景2 有人机和无人机 
      barrierPos: [116.316818358, 39.828504248],// 障碍物坐标
      barrierStyle: [50, 1600, 300],// 障碍物形状
      airportList: [
        {
          name: '北京市门头沟区综应急救援队',//机场名称 
          position: [116.118815,39.922553],//机场位置
        },
        {
          name: '鲁家山循环(静脉产业)基地',//机场名称 
          position: [116.054996,39.85431],//机场位置
        },
        {
          name: '王坡村委会',//机场名称 
          position: [116.026354,39.907375],//机场位置
        },
        {
          name: '花鸟市场',//机场名称 
          position: [115.998503,39.853098],//机场位置
        },
        {
          name: '草甸水客运站',//机场名称 
          position: [116.004875,39.898579],//机场位置
        },
      
      ],
      // 帮我写一个变量 用来存放无人机的位置
      taskId: 8,
      // 无人机场站
      taskName:'测试创建',
      area: [], // 存储区域
      areaSave: [],//对象存储地址
      saveTaskObj:{"taskId":"8","taskName":"测试创建","eventTime":"2023-11-14T16:00:00.000Z","fireRange":"123","locations":"123","centerPoint":"[]","taskArea":"[[{\"Q\":39.99343256954795,\"R\":115.95587018564345,\"lng\":115.95587,\"lat\":39.993433},{\"Q\":39.87177682982367,\"R\":115.86772551387548,\"lng\":115.867726,\"lat\":39.871777},{\"Q\":39.78633657121941,\"R\":115.9649646297097,\"lng\":115.964965,\"lat\":39.786337},{\"Q\":39.78741661442633,\"R\":116.08700180724259,\"lng\":116.087002,\"lat\":39.787417},{\"Q\":39.8188385312352,\"R\":116.13005135580897,\"lng\":116.130051,\"lat\":39.818839},{\"Q\":39.92196907128085,\"R\":116.18123177155854,\"lng\":116.181232,\"lat\":39.921969},{\"Q\":39.98445975367437,\"R\":116.0742880319059,\"lng\":116.074288,\"lat\":39.98446}]]","member":"[{\"name\":\"张三\",\"role\":\"任务负责人\"},{\"name\":\"张三\",\"role\":\"无人机驾驶员\"},{\"name\":\"张三\",\"role\":\"有人机驾驶员\"}]","device":"[{\"name\":\"无人机\",\"role\":\"大疆RT30\"},{\"name\":\"有人机\",\"role\":\"大疆RT30K\"}]","taskCreateTime":"2023-11-13 14:14:03","eventType":"抢险救灾","remark":null},
      centerPoint: [],
      fireRange:[ [ { "Q": 39.88405250992457, "R": 115.98691757038239, "lng": 115.986918, "lat": 39.884053 }, { "Q": 39.87529472119752, "R": 115.97959284245974, "lng": 115.979593, "lat": 39.875295 }, { "Q": 39.86823551688767, "R": 115.99365133792162, "lng": 115.993651, "lat": 39.868236 }, { "Q": 39.869374945943, "R": 116.01888090133667, "lng": 116.018881, "lat": 39.869375 }, { "Q": 39.87835377629659, "R": 116.0065115042031, "lng": 116.006512, "lat": 39.878354 } ] ]
    }
  },
  getters: {
  }, // 监测状态 相当于 computed 计算属性
  actions: {
  } // 操作 相当于 methods 
})