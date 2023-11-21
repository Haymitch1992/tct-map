<!-- 航线数据 -->

<!-- 表格形式 经纬度 高 -->

<template>
  <div>
    <el-table border :data="pageData.tableData" style="width: 100%">
      <el-table-column prop="lineData" label="经纬度" />
      <el-table-column prop="address" label="高度" />
    </el-table>
  </div>
</template>

<script setup>
import { mainStore } from '../store/index';
const store = mainStore();
import { ref, reactive, onMounted, onUnmounted } from 'vue';
const pageData = reactive({
  tableData: [{ pointList: [], altitudeList: [] }],
});

const initData = () => {
  let lineData = store.device1Line; // 航线信息

  if (lineData.length) {
    
    pageData.tableData.push({
      pointList:[]
    })
  }
};
//  获取航线数据
onMounted(() => {
  initData();
});
</script>
