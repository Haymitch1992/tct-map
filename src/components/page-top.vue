<template>
  <div class="page-top">
    <span>指挥调度工作站</span>
    <router-link to="/">
      <el-button type="primary" class="btn">创建项目</el-button>
    </router-link>
    <router-link to="/editLine">
      <el-button type="primary" class="btn">编辑航线</el-button>
    </router-link>
    <router-link to="/setWayLine">
      <el-button type="primary" class="btn">选择航线</el-button>
    </router-link>
    <router-link to="/flightReplay">
      <el-button type="primary" class="btn">飞行监视</el-button>
    </router-link>
    <!-- <router-link to="/aircraft">
      <el-button type="primary" class="btn">机载终端</el-button>
    </router-link> -->
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
