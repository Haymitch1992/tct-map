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
      <!--  -->

      <div v-if="pageData.stataus === 1">
        <h3>
          飞行计划库
          <el-button
            size="small"
            type="primary"
            @click="handleCreateTask"
            class="back-btn"
            >创建计划</el-button
          >
        </h3>
        <el-table :data="pageData.planList" border style="width: 100%">
          <el-table-column
            prop="executeTime"
            label="计划/实际时间"
            width="100"
          />
          <el-table-column prop="planStatus" label="状态">
            <template #default="scope">
              <el-tag :type="statusToType(scope.row.planStatus)">{{
                transferStatus(scope.row.planStatus)
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="" label="类型">
            <template #default="scope"> 灭火应急 </template>
          </el-table-column>
          <el-table-column prop="executeName" label="计划名称" width="100" />
          <el-table-column prop="deviceKey" label="设备名称" />
          <el-table-column prop="planId" label="航线名称" />
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button
                size="small"
                type="primary"
                v-if="scope.row.planStatus === 0 || scope.row.planStatus === 3"
                @click="editflightinfo(scope.row, 1)"
                >下达</el-button
              >
              <el-button
                size="small"
                type="danger"
                v-if="scope.row.planStatus === 1 || scope.row.planStatus === 2"
                @click="editflightinfo(scope.row, 3)"
                >结束</el-button
              >
              <el-button
                size="small"
                type="warning"
                @click="handleDynamicPlanExecute(scope.row)"
                >放飞</el-button
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
      <div v-if="pageData.stataus === 2">
        <h3>
          创建计划
          <el-button
            size="small"
            type="primary"
            @click="backList"
            class="create-btn"
            >计划列表</el-button
          >
        </h3>
        <el-form
          label-position="top"
          label-width="100px"
          :model="formLabelAlign"
          style="max-width: 460px"
        >
          <el-form-item label="计划名称">
            <el-input
              v-model="formLabelAlign.executeName"
              placeholder="请输入计划名称"
            />
          </el-form-item>

          <el-form-item label="执行时间">
            <el-date-picker
              v-model="formLabelAlign.executeTime"
              format="YYYY/MM/DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetime"
              placeholder="请选择发生时间"
            />
          </el-form-item>
          <el-form-item label="执行航线">
            <!-- 事件类型 -->
            <el-select
              v-model="formLabelAlign.planId"
              @change="handleClick(item)"
              placeholder="请选择执行航线"
            >
              <el-option
                v-for="item in pageData.lineList"
                :key="item.type"
                :label="item.planName"
                :value="item.planId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="执行飞行器">
            <!-- 事件类型 -->
            <el-select
              v-model="formLabelAlign.deviceKey"
              placeholder="请选择执行飞行器"
            >
              <el-option
                v-for="item in pageData.devices"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="任务策略">
            <!-- 事件类型 -->
            <el-select
              v-model="formLabelAlign.strategy"
              placeholder="请选择任务策略"
            >
              <el-option
                v-for="item in pageData.strategyList"
                :key="item.name"
                :label="item.name"
                :value="item.role"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="返航模式">
            <!-- 事件类型 -->
            <el-select
              v-model="formLabelAlign.courseReversal"
              placeholder="请选择返航模式"
            >
              <el-option
                v-for="item in pageData.courseReversalList"
                :key="item.name"
                :label="item.name"
                :value="item.role"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="航线飞行中失联">
            <!-- 事件类型 -->
            <el-select
              v-model="formLabelAlign.executAuto"
              placeholder="请选择返航模式"
            >
              <el-option
                v-for="item in pageData.executAutoList"
                :key="item.name"
                :label="item.name"
                :value="item.role"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-button @click="addflightinfo" type="primary">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import mapContainer from '../../components/mapContainer2D.vue';
import pageTop from '../../components/page-top.vue';
import { mainStore } from '../../store/index';
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
  postdynamicPlanExecute,
} from '../../api/index.ts';

const statusToType = (num) => {
  switch (num) {
    case 1:
      return 'warning';
    case 2:
      return 'success';
    case 3:
      return 'primary';
    case 0:
      return 'info';
  }
};
const transferStatus = (num) => {
  switch (num) {
    case 1:
      return '已下达';
    case 2:
      return '执行中';
    case 3:
      return '执行完毕';
    case 0:
      return '未执行';
    default:
      return '未知';
    // 0:未执行、1:已下发，待放飞、2:执行中、3:已执行完毕
  }
};

const backList = () => {
  pageData.stataus = 1;
};

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
const handleCreateTask = () => {
  pageData.stataus = 2;
};
const formLabelAlign = reactive({
  //
  planId: '',
  deviceKey: '',
  planStatus: '',
  executeTime: '',
  strategy: 1,
  courseReversal: 1,
  executAuto: 1,
  executeName: '',
});
const pageData = reactive({
  lineList: [],
  pageSize: 5,
  pageNum: 1,
  total: 0,
  planName: null,
  planId: null,
  stataus: 1,
  planList: [],
  devices: [
    {
      name: '无人机',
      role: '大疆RT30',
    },
    {
      name: '有人机',
      role: '大疆RT30K',
    },
  ],
  strategyList: [
    {
      name: '立即',
      role: 1,
    },
    {
      name: '单次定时',
      role: 2,
    },
    {
      name: '重复定时',
      role: 3,
    },
    {
      name: '持续执行',
      role: 4,
    },
  ],
  courseReversalList: [
    {
      name: '设定高度返航',
      role: 1,
    },
    {
      name: '智能高度返航',
      role: 2,
    },
  ],
  executAutoList: [
    {
      name: '返航',
      role: 1,
    },
    {
      name: '继续执行',
      role: 2,
    },
  ],
});
const FavoriteRef = ref(null);
const store = mainStore();
// 获取数据

const handleClick = (item) => {
  //
  pageData.lineList.forEach((item) => {
    if (item.planId === formLabelAlign.planId) {
      let lineObj = JSON.parse(item.planInfo);
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

      FavoriteRef.value.initMapFn();
    }
  });
};

// 创建航线
//
const handleDynamicPlanExecute = (item) => {
  postdynamicPlanExecute({
    planId: item.planId,
    deviceKey: item.deviceKey,
    id: item.id,
    planStatus: 2,
  }).then((res) => {
    ElMessage({
      message: '放飞成功',
      type: 'success',
    });
  });
};

// 计划下达
const addflightinfo = () => {
  postAddPlanExecute({
    ...formLabelAlign,
    planStatus: 0,
  }).then((res) => {
    ElMessage({
      message: '计划创建成功',
      type: 'success',
    });
    pageData.stataus = 1;
    getInfo();
  });
};

const editflightinfo = (item, type) => {
  postEeditPlanExecute({
    planId: item.planId,
    deviceKey: item.deviceKey,
    id: item.id,
    planStatus: type,
    //planStatus: 2, //  0:未执行、1:已下发，待放飞、2:执行中、3:已执行完毕
  }).then((res) => {
    ElMessage({
      message: '计划下达成功',
      type: 'success',
    });
    getInfo();
  });
};

// 获取航线列表

const getInfo = () => {
  postSelectListPlanInfo({
    pageSize: 20,
    pageNum: 1,
  }).then((res) => {
    pageData.lineList = res.data.data.list;
  });

  getSelectListPlanExecute({
    pageSize: pageData.pageSize,
    pageNum: pageData.pageNum,
  }).then((res) => {
    pageData.planList = res.data.data.list;
    pageData.total = res.data.data.total;
  });
};

onMounted(() => {
  getInfo();
});
// hang
</script>

<style lang="less" scoped>
.create-btn {
  float: right;
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
  width: 800px;
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
.back-btn {
  float: right;
}
.pagination-line {
  padding: 10px 4px;
}
</style>
