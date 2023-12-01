<template>
  <div class="page-top">
    <span>指挥调度工作站</span>

    <router-link to="/">
      <el-button type="primary" class="btn">任务管理</el-button>
    </router-link>
    <router-link to="/editLine">
      <el-button v-show="store.taskId" type="primary" class="btn"
        >航线管理</el-button
      >
    </router-link>
    <router-link to="/setWayLine">
      <el-button v-show="store.taskId" type="primary" class="btn"
        >计划管理</el-button
      >
    </router-link>
    <router-link to="/flightReplay">
      <el-button v-show="store.taskId" type="primary" class="btn"
        >飞行监视</el-button
      >
    </router-link>
    <router-link to="/history">
      <el-button v-show="store.taskId" type="primary" class="btn"
        >历史记录</el-button
      >
    </router-link>
    <router-link to="/aircraft">
      <el-button v-show="store.taskId" type="primary" class="btn"
        >机载终端</el-button
      >
    </router-link>
    <!--  -->
    <img src="../assets/logo.png" style="float: right; margin-top: 10px" />
  </div>
</template>

<style scoped lang="less">
.page-top {
  height: 54px;
  background-color: #232323;
  margin-bottom: 10px;
  color: #fff;
  line-height: 54px;
  padding: 0 10px;
  span {
    font-size: 22px;
  }
}
.btn {
  margin: 0 10px;
}
</style>

<script setup>
import { mainStore } from '../store/index';
const store = mainStore();
</script>
