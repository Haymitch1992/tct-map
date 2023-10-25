<!-- 创建项目 -->
<template>
  <div class="page-container">
    <page-top></page-top>
    <map-container class="map-container"></map-container>
    <div class="right-container">
      <h3>创建项目</h3>
      <el-form
        label-position="top"
        label-width="100px"
        :model="formLabelAlign"
        style="max-width: 460px"
      >
        <el-form-item label="项目名称">
          <el-input v-model="formLabelAlign.name" />
        </el-form-item>
        <el-form-item label="项目简介">
          <el-input v-model="formLabelAlign.region" type="textarea" />
        </el-form-item>
        <el-form-item label="项目成员">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="name" label="成员名称" />
            <el-table-column prop="name" label="成员角色" />
          </el-table>
        </el-form-item>
        <el-form-item label="项目列表">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="name" label="设备名称" />
            <el-table-column prop="name" label="设备型号" />
          </el-table>
        </el-form-item>
        <el-form-item label="作业范围">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="name" label="经度" />
            <el-table-column prop="name" label="纬度" />
          </el-table>
        </el-form-item>
      </el-form>
      <el-button type="primary">创建项目</el-button>
    </div>
  </div>
</template>

<script setup>
import mapContainer from '../../components/mapContainer2.vue';
import pageTop from '../../components/page-top.vue';
import { mainStore } from '../../store/index';
import { reactive, onMounted } from 'vue';
const store = mainStore();
const formLabelAlign = reactive({
  name: 1,
  region: 2,
  type: 3,
});

onMounted(() => {
  store.device1Pos = null;
  store.device1Line = null;
});

const tableData = [
  {
    date: '2016-05-03',
    name: 'aa',
  },
  {
    date: '2016-05-02',
    name: 'bb',
  },
];
</script>

<style lang="less" scoped>
.page-container {
  position: relative;
  background-color: #101010;
}
.map-container {
  width: 100%;
  height: 100vh;
}

.right-container {
  width: 400px;
  height: calc(100vh - 64px);
  position: absolute;
  right: 0;
  top: 64px;
  box-sizing: border-box;
  padding: 0 10px;
  background-color: #232323;
  h3 {
    line-height: 32px;
    padding-bottom: 4px;
    font-size: 16px;
    font-weight: normal;
    color: #fff;
    border-bottom: 1px solid #4c4d4f;
  }
}
</style>
