<!-- 航线数据 -->
<!-- 表格形式 经纬度 高 -->
<template>
  <div class="table-container">
    <el-table border :data="pageData.tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="pointList" label="经纬度" />
      <el-table-column prop="altitudeList" label="高度" width="120">
        <template #default="scope">
          <el-input
            v-model="store.altitudeList[scope.$index]"
            placeholder="请输入初步地点"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { mainStore } from '../store/index';
const store = mainStore();
import { ref, reactive, onMounted, watch, onUnmounted } from 'vue';
const pageData = reactive({
  tableData: [],
});

const initData = () => {
  let lineData = store.device1Line; // 航线信息
  pageData.tableData = [];
  if (lineData.length) {
    lineData.forEach((item, index) => {
      pageData.tableData.push({
        pointList: item,
        altitudeList: store.altitudeList[index],
      });
    });
  }
};

watch(
  () => store.device1Line,
  (newVal, oldVal) => {
    // 增加节点
    store.altitudeList = [];
    newVal.forEach((item, index) => {
      if (index === 0) {
        store.altitudeList.push(0);
      } else {
        store.altitudeList.push(500);
      }
    });
    // 减少节点

    initData();
  },
  {
    deep: true,
  }
);

//  获取航线数据
onMounted(() => {
  initData();
});
</script>

<style scoped>
.table-container {
  padding-bottom: 12px;
}
</style>
