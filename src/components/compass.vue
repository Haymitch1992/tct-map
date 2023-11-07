<template>
  <div class="container">
    <div class="compass-container">
      <div class="compass" :style="{ transform: computedRotate }"></div>
      <div class="arrow"></div>
      <div class="main-text">
        <span class="height-text">{{ store.altitude }}</span>
        <span class="height-unit">
          <div class="height-unit">ALT</div>
          <div class="height-unit">M</div>
        </span>
      </div>

      <div class="obstacle-info" data-v-242b641f="" data-v-28afdb6c="">
        <div class="obstacle-bar" data-v-242b641f=""></div>
        <div class="bar-area warning" style="top: 71.6%; bottom: 8.4%"></div>
        <div class="bar-area danger" style="top: 91.6%; bottom: calc(0%)"></div>
        <span class="obstacle-alert bottom" style="top: 100%"></span>
        <div class="marker zero-marker" data-v-242b641f=""></div>
        <span class="agl-number map-text-shadow" data-v-242b641f="">{{
          store.altitude
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { mainStore } from '../store/index';
import { reactive, computed } from 'vue';
const store = mainStore();

const computedRotate = computed(() => {
  const result = `rotate(${store.headingAngle}deg)`;
  return result;
});
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
}
.compass-container {
  display: block;
  width: 150px;
  height: 150px;
  margin: 0 auto;

  position: relative;
}
.compass {
  background: rgba(0, 0, 0, 0.6) url('../assets/compass.svg') no-repeat 0px 0px;
  background-size: 150px 150px;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  transition: all 1s;
}
.compass::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  border: 2px solid #2b85e4;
  box-shadow: 0 0 5px 0 #2b85e4;
}
.arrow {
  width: 48px;
  height: 48px;
  background: url('../assets/arrow.png') no-repeat 0 0;
  background-size: 32px 32px;
  position: absolute;
  top: 60px; // 75-32
  left: 60px;
}
.main-text {
  color: #00ee8b;
  position: absolute;
  right: -100px;
  top: 14px;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.5),
    1px -1px 0 rgba(0, 0, 0, 0.5), -1px 1px 0 rgba(0, 0, 0, 0.5),
    1px 1px 0 rgba(0, 0, 0, 0.5);
  span {
    display: inline-block;
  }
  .height-text {
    font-size: 26px;
  }
  .height-unit {
    font-size: 10px;
    line-height: 13px;
    text-align: right;
    margin-left: 4px;
    div {
      padding: 0;
      margin: 0;
    }
  }
}
.obstacle-info {
  padding-left: 5px;
  position: absolute;
  bottom: 20px;
  right: -20px;
  .obstacle-bar {
    width: 7px;
    height: 80px;
    background: hsla(0, 0%, 100%, 0.2);
    box-shadow: 0 0 0 0.4px rgba(0, 0, 0, 0.6);
  }
  .bar-area.warning {
    background-color: #ff9f0a;
  }
  .bar-area {
    width: 7px;
    position: absolute;
  }
  .bar-area.danger {
    background-color: #e41f29;
  }
  .obstacle-alert.bottom {
    border-top: 1px solid #e41f29;
  }
  .obstacle-alert {
    position: absolute;
    width: 15px;
    height: 5px;
    background-image: repeating-linear-gradient(
      -45deg,
      #e41f29,
      #e41f29 2px,
      #ff9f0a 0,
      #ff9f0a 4px
    );
    right: 3.5px;
    transform: translateX(50%);
  }
  .zero-marker {
    width: auto;
    right: 0;
    left: 5px;
    top: 50%;
  }
  .marker {
    width: 7px;
    height: 2px;
    background-color: #fff;
    position: absolute;
    transform: translateY(-50%);
    box-shadow: 0 0 0 0.4px rgba(0, 0, 0, 0.6);
  }
  .agl-number {
    position: absolute;
    left: 50%;
    bottom: -6px;
    transform: translate(-50%, 100%);
    white-space: nowrap;
    color: #fff;
    font-size: 12px;
    line-height: 20px;
    font-weight: 600;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.5),
      1px -1px 0 rgba(0, 0, 0, 0.5), -1px 1px 0 rgba(0, 0, 0, 0.5),
      1px 1px 0 rgba(0, 0, 0, 0.5);
  }
  .agl-number::after {
    content: 'm';
    position: absolute;
    left: calc(100% + 2px);
  }
}
</style>
