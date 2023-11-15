<!-- 2d编辑航线 -->
<!-- 飞行回放 -->
<!-- 创建项目 -->
<template>
  <div class="page-container">
    <page-top></page-top>
    <map-container
      :showAir="false"
      :showLine2="false"
      :uesMouseTool="true"
      class="map-container"
      ref="FavoriteRef"
    ></map-container>
    <div class="right-container">
      <div v-if="pageData.status === 1">
        <h3>
          航线列表
          <el-button
            size="small"
            type="primary"
            @click="createLine()"
            class="create-btn"
            >创建航线</el-button
          >
        </h3>

        <!-- {{ pageData.lineList }} -->
        <el-table :data="pageData.lineList" border style="width: 100%">
          <el-table-column prop="planName" label="航线名称" />
          <!-- <el-table-column prop="planId" label="航线名称" width="50" /> -->
          <el-table-column fixed="right" label="操作">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleClick(scope.row)"
                >选择</el-button
              >

              <el-button
                type="danger"
                @click="dellteLine(scope.row.planId)"
                size="small"
                >删除</el-button
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
      </div>
      <div v-if="pageData.status === 2">
        <h3>
          <span v-if="pageData.planId">编辑航线</span>
          <span v-if="!pageData.planId">创建航线</span>
          <el-button
            size="small"
            type="primary"
            @click="backList"
            class="create-btn"
            >航线列表</el-button
          >
        </h3>
        <h4>航线名称</h4>
        <el-input v-model="pageData.planName" class="planName-line"></el-input>
        <h4>选择飞行器与负载</h4>
        <div class="device-line">
          <el-select v-model="pageData.deviceKey" placeholder="请选择事件类型">
            <el-option
              v-for="item in pageData.deviceList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </div>
        <h4>航线类型</h4>
        <div class="device-line">
          <el-select v-model="pageData.lineType" placeholder="请选择事件类型">
            <el-option
              v-for="item in pageData.lineTypeList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </div>
        <h4>航线数据</h4>
        <div class="line-data">{{ store.device1Line }}</div>
        <el-button type="primary" @click="startSetLine()">编辑</el-button>
        <el-button type="primary" @click="closeSetLine()">结束编辑</el-button>

        <el-button type="primary" v-if="pageData.planId" @click="editLine()"
          >更新</el-button
        >
        <el-button type="primary" v-if="!pageData.planId" @click="addLine()"
          >新建</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import mapContainer from '../../components/mapContainer3D.vue';
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

const backList = () => {
  //
  pageData.status = 1;
};
const pageData = reactive({
  lineList: [],
  planName: null,
  planId: null,
  planList: [],
  pageSize: 5,
  total: 0,
  status: 1,
  pageNum: 1,
  deviceKey: '大疆RTK300',
  lineType: '航点航线',
  deviceList: [{ name: '大疆RTK300' }, { name: '大疆RTK500' }],
  lineTypeList: [
    { name: '航点航线' },
    { name: '面状航线' },
    { name: '带状航线' },
  ],
});
const FavoriteRef = ref(null);
const store = mainStore();
// 获取数据

const closeSetLine = () => {
  FavoriteRef.value.closeEdit();
};
const startSetLine = () => {
  FavoriteRef.value.startEdit();
};

const handleClick = (item) => {
  pageData.planName = item.planName;
  store.device1Line = JSON.parse(item.planInfo);
  pageData.planId = item.planId;
  FavoriteRef.value.initMapFn();
  pageData.status = 2;
};

// 创建航线
const createLine = () => {
  pageData.planId = null;
  pageData.planName = '新建航线';
  pageData.status = 2;
  store.device1Line = [
    [115.999797, 39.844355],
    [116.030208, 39.911192],
    [116.057195, 39.848882],
    [116.121909, 39.92846],
  ];
  FavoriteRef.value.initMapFn();
  // FavoriteRef.value.initMapFn();
};

const addLine = () => {
  closeSetLine();
  postAddPlanInfo({
    planName: pageData.planName,
    planInfo: JSON.stringify(store.device1Line),
    taskId: store.taskId,
  }).then((res) => {
    console.log(res);
    getInfo();
    backList();
  });
};

// 更新航线

const editLine = () => {
  closeSetLine();
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
    backList();
  });
};

const dellteLine = (id) => {
  postDeletePlanInfo({
    planId: id,
  }).then((res) => {
    console.log(res);
    ElMessage({
      message: '航线删除成功',
      type: 'success',
    });
    getInfo();
    backList();
  });
};

// 获取航线列表
const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
  pageData.pageSize = val;
  getInfo();
};

const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
  pageData.pageNume = val;
  getInfo();
};

const getInfo = () => {
  postSelectListPlanInfo({
    pageSize: pageData.pageSize,
    pageNum: pageData.pageNum,
  }).then((res) => {
    console.log(res);
    pageData.lineList = res.data.data.list;
    pageData.total = res.data.data.total;
    // handleClick(pageData.lineList[0]);
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
  // 绘制
  if (store.taskId) {
    setTimeout(() => {
      store.area = JSON.parse(store.saveTaskObj.taskArea);
    }, 2000);
  }
});
// hang
</script>

<style lang="less" scoped>
.create-btn {
  float: right;
}
.planName-line {
  margin-bottom: 14px;
}
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
.device-line {
  // padding-bottom: 10px;
}
.line-data {
  font-size: 12px;
  color: #fff;
  background-color: #101010;
  padding: 8px;
  margin-bottom: 20px;
}
</style>
