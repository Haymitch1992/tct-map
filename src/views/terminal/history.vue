<!-- 飞行回放 -->
<!-- 创建项目 -->
<template>
  <div class="page-container">
    <page-top></page-top>
    <map-container
      :view3D="true"
      :uesMouseTool="false"
      class="map-container"
      ref="FavoriteRef"
    ></map-container>
    <div class="right-container">
      <h3>计划航线</h3>
      <el-table :data="pageData.planList" border style="width: 100%">
        <el-table-column prop="planName" label="航线名称" />
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="selectPlanExecuteByPlanId(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-line">
        <el-pagination
          v-model:current-page="pageData.pageNum"
          :page-size="pageData.pageSize"
          :small="true"
          :background="true"
          layout="total, prev, pager, next"
          :total="pageData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <h3>执行详情</h3>
      <el-table :data="pageData.executeList" border style="width: 100%">
        <el-table-column prop="deviceKey" label="飞行器类型" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="historyInfo(scope.row)"
              >轨迹回看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import mapContainer from '../../components/mapContainer3D.vue';
import pageTop from '../../components/page-top.vue';
import { mainStore } from '../../store/index';
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import {
  getHistoryPlanList,
  getSelectPlanExecuteByPlanId,
  getHistoryInfo,
} from '../../api/index.ts';
import { wgs84togcj02 } from '../../vendors/coordtransform.js';
import socket from '../../components/socket.vue';

const FavoriteRef = ref(null);
const store = mainStore();
// 获取数据

const pageData = reactive({
  planList: null,
  executeList: null,
  historyList: null,
  pageNum: 1,
  pageSize: 5,
  total: 0,
});

const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
  pageData.pageSize = val;
  historyPlanList();
};

const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
  pageData.pageNume = val;
  historyPlanList();
};
var timer = null;
var timer2 = null;

var save = null;

// 根据飞行器 获取航线
// 获取飞行器实时数据
const historyPlanList = () => {
  getHistoryPlanList({
    pageSize: pageData.pageSize,
    pageNum: pageData.pageNum,
  }).then((res) => {
    pageData.planList = res.data.data.list;
    pageData.total = res.data.data.total;
  });
};

const selectPlanExecuteByPlanId = (obj) => {
  getSelectPlanExecuteByPlanId({
    planId: obj.planId,
  }).then((res) => {
    pageData.executeList = res.data.data;
    store.historyPointList = [];
    store.historyAltitudeList = [];
    let lineObj = JSON.parse(pageData.executeList[0].planInfo);
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
  });
};
const historyInfo = (obj) => {
  getHistoryInfo({
    executeId: obj.id,
  }).then((res) => {
    pageData.historyList = res.data.data;
    let historyPointList = [];
    let historyAltitudeList = [];
    pageData.historyList.forEach((item) => {
      historyPointList.push([item.longitude, item.latitude]);
      historyAltitudeList.push(item.altitude);
    });
    store.historyPointList = historyPointList;
    store.historyAltitudeList = historyAltitudeList;
  });
};

onMounted(() => {
  historyPlanList();
});
onUnmounted(() => {});
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
  overflow: hidden;
  height: calc(100vh - 64px);
  position: absolute;
  right: 0;
  top: 64px;
  box-sizing: border-box;
  padding: 0 10px;
  background-color: #232323;
  color: #fff;
  h3 {
    line-height: 32px;
    padding-bottom: 4px;
    font-size: 16px;
    font-weight: normal;
    color: #fff;
    border-bottom: 1px solid #4c4d4f;
  }
}
.data-text {
  background-color: #101010;
  color: #fff;
  display: block;
  font-size: 14px;
  padding: 10px 6px;
  line-height: 30px;
}
.pagination-line {
  padding: 10px 4px;
}
</style>
