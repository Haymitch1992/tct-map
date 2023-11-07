<!-- 飞行回放 -->
<!-- 创建项目 -->
<template>
  <div class="page-container">
    <page-top></page-top>
    <map-container
      :showAir="false"
      :showLine2="false"
      class="map-container"
      ref="FavoriteRef"
    ></map-container>
    <div class="right-container">
      <h3>航线设置</h3>
      <h4>飞行计划列表</h4>
      <el-table :data="pageData.planList" border style="width: 100%">
        <el-table-column prop="deviceKey" label="飞行器" width="100" />
        <el-table-column prop="planId" label="航线ID" width="100" />
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button
              size="small"
              type="warning"
              v-if="scope.row.planStatus === 0"
              @click="editflightinfo(scope.row.planId, scope.row.deviceKey)"
              >取消</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <h4>航线列表</h4>
      <el-table :data="pageData.lineList" border style="width: 100%">
        <el-table-column prop="planName" label="航线ID" width="100" />
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleClick(scope.row)"
              >选择</el-button
            >
            <el-button
              size="small"
              type="warning"
              @click="addflightinfo(scope.row.planId, '无人机')"
              >无人机</el-button
            >
            <el-button
              size="small"
              type="warning"
              @click="addflightinfo(scope.row.planId, '长空之王')"
              >长空之王</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import mapContainer from '../../components/mapContainer.vue';
import pageTop from '../../components/page-top.vue';
import { mainStore } from '../../store/index';
import videoBox from '../../components/video.vue';
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

import {
  postAddPlanInfo,
  postEditPlanInfo,
  postDeletePlanInfo,
  postSelectListPlanInfo,
  postAddPlanExecute,
  postEeditPlanExecute,
  getSelectListPlanExecute,
} from '../../api/index.ts';

const pageData = reactive({
  lineList: [],
  planName: null,
  planId: null,
  planList: [],
});
const FavoriteRef = ref(null);
const store = mainStore();
// 获取数据

const handleClick = (item) => {
  pageData.planName = item.planName;
  store.device1Line = JSON.parse(item.planInfo);
  pageData.planId = item.planId;
  setTimeout(() => {
    FavoriteRef.value.initMapFn();
  }, 1000);
};

// 创建航线

const addflightinfo = (planId, str) => {
  postAddPlanExecute({
    planId: planId,
    deviceKey: str,
    createTime: '2023-10-19 15:10:00',
    planStatus: 0,
  }).then((res) => {
    ElMessage({
      message: '计划下达成功',
      type: 'success',
    });
    getInfo();
  });
};

const editflightinfo = (planId, str) => {
  postEeditPlanExecute({
    planId: planId,
    deviceKey: str,
    planStatus: 2,
  }).then((res) => {
    ElMessage({
      message: '计划取消成功',
      type: 'success',
    });
    getInfo();
  });
};

const addLine = () => {
  postAddPlanInfo({
    planName: '航线名称',
    planInfo: JSON.stringify(store.device1Line),
  }).then((res) => {
    console.log(res);
    getInfo();
  });
};

// 更新航线

const editLine = () => {
  postEditPlanInfo({
    planName: pageData.planName,
    planId: pageData.planId,
    planInfo: JSON.stringify(store.device1Line),
  }).then((res) => {
    console.log(res);
    ElMessage({
      message: '航线更新成功',
      type: 'success',
    });
    getInfo();
  });
};

const dellteLine = (id) => {
  postDeletePlanInfo({
    planId: id,
  }).then((res) => {
    f;
    console.log(res);
    ElMessage({
      message: '航线删除成功',
      type: 'success',
    });
    getInfo();
  });
};

// 获取航线列表

const getInfo = () => {
  postSelectListPlanInfo({
    pageSize: 10,
    pageNum: 1,
  }).then((res) => {
    console.log(res);
    pageData.lineList = res.data.data.list;
    handleClick(pageData.lineList[0]);
  });

  getSelectListPlanExecute({
    pageSize: 4,
    pageNum: 1,
  }).then((res) => {
    pageData.planList = res.data.data.list;
  });
};

onMounted(() => {
  getInfo();
  // store.device2Pos = null;
  // store.device2Line = null;
});
// hang
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
</style>
