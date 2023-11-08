// 1.定义状态容器和状态
// 2.修改容器中的state
// 3.仓库中的actions的使用
import { defineStore } from 'pinia'
import { userStore } from './user'

export const mainStore = defineStore('main', {
  state: () => { 
    // 定义状态
    return {
      device1Pos:[116.326755, 39.788338],// 有人机 实时位置
      device1Line: [[116.326755, 39.788338], [116.33287, 39.798175]],// 有人机 航线
      device2Pos:[116.316062, 39.828417], // 无人机 实时位置
      device2Line: [[116.326755, 39.788338], [116.33287, 39.798175]], // 无人机 航线
      altitude: 0, // 有人机 高度
      headingAngle: 0, // 有人机偏转角度
      scene: 1// 场景1 单个飞机  场景2 有人机和无人机 
    }
  },
  getters: {
  }, // 监测状态 相当于 computed 计算属性
  actions: {
  } // 操作 相当于 methods 
})