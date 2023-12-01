<!-- 创建任务 -->
<template>
  <div class="page-container">
    <page-top></page-top>
    <map-container
      :view3D="false"
      :uesMouseTool="true"
      ref="FavoriteRef"
      class="map-container"
    ></map-container>
    <div class="right-container">
      <!-- 任务列表 -->
      <div v-if="pageData.pageStatus === '任务列表'">
        <h3>
          任务列表
          <el-button
            size="small"
            type="primary"
            @click="handleCreateTask"
            class="back-btn"
            >创建任务</el-button
          >
        </h3>

        <el-table border :data="pageData.projectList" style="width: 100%">
          <el-table-column prop="taskName" label="任务">
            <!-- handelSelectTask -->
            <template #default="scope">
              <span>{{ scope.row.taskName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="taskCreateTime"
            label="创建时间"
          />"
          <el-table-column prop="taskName" label="操作" width="140">
            <!-- handelSelectTask -->
            <template #default="scope">
              <el-button
                size="small"
                type="primary"
                @click="saveTask(scope.row)"
              >
                选择
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="handelSelectTask(scope.row)"
              >
                编辑
              </el-button>
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
      <!-- 创建任务 -->
      <div v-if="pageData.pageStatus === '创建任务'">
        <h3 v-if="!pageData.taskId">
          创建任务
          <el-button
            @click="handleBlackTask"
            type="primary"
            size="small"
            class="back-btn"
            >任务列表</el-button
          >
        </h3>
        <h3 v-if="pageData.taskId">
          编辑任务
          <el-button
            @click="handleBlackTask"
            type="primary"
            size="small"
            class="back-btn"
            >任务列表</el-button
          >
        </h3>

        <el-form
          label-position="top"
          label-width="100px"
          :model="formLabelAlign"
          style="max-width: 460px"
        >
          <el-form-item label="任务名称">
            <el-input
              v-model="formLabelAlign.taskName"
              placeholder="请输入任务名称"
            />
          </el-form-item>
          <el-form-item label="事件类型">
            <!-- 事件类型 -->
            <el-select
              v-model="formLabelAlign.eventType"
              placeholder="请选择事件类型"
            >
              <el-option
                v-for="item in pageData.eventTypeList"
                :key="item.type"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发生时间">
            <el-date-picker
              v-model="formLabelAlign.eventTime"
              format="YYYY/MM/DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetime"
              placeholder="请选择发生时间"
            />
          </el-form-item>
          <el-form-item label="初步地点">
            <el-input
              v-model="formLabelAlign.locations"
              placeholder="请输入初步地点"
            />
          </el-form-item>
          <el-form-item label="其他">
            <el-input
              :rows="4"
              placeholder="请输入内容"
              type="textarea"
              v-model="formLabelAlign.remark"
            />
          </el-form-item>
          
          <el-form-item label="任务成员">
            <el-table :data="pageData.member" border style="width: 100%">
              <el-table-column prop="name" label="成员名称" />
              <el-table-column prop="role" label="成员角色" />
            </el-table>
          </el-form-item>
          <el-form-item label="任务设备">
            <el-table :data="pageData.devices" border style="width: 100%">
              <el-table-column prop="name" label="设备名称" />
              <el-table-column prop="role" label="设备型号" />
            </el-table>
          </el-form-item>
          <el-form-item label="作业范围">
            <!-- 设置中心点 -->
            <!-- 设置任务区域 -->
            <el-button size="small" type="primary" @click="setCenterMark"
              >设置中心点</el-button
            >

            <el-button size="small" type="primary" @click="setTaskPosition"
              >设置任务区域</el-button
            >
          </el-form-item>
        </el-form>
        <el-button
          v-if="!pageData.taskId"
          class="block-btn"
          type="primary"
          @click="createTask"
          >创建任务</el-button
        >
        <el-button
          v-if="pageData.taskId"
          class="block-btn"
          type="primary"
          @click="editTask"
          >保存任务</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElOption } from 'element-plus';
import mapContainer from '../../components/mapContainer3D.vue';
import pageTop from '../../components/page-top.vue';
import { mainStore } from '../../store/index';
import { reactive, ref, onMounted } from 'vue';
import {
  getSelectListTask,
  postAddTaskInfo,
  postEditTaskInfo,
} from '../../api/index';
import { ElMessage } from 'element-plus';

const saveTask = (item) => {
  // 存储任务
  store.taskName = item.taskName;
  store.taskId = item.taskId;
  store.centerPoint = JSON.parse(item.centerPoint);
  store.area = JSON.parse(item.taskArea);
  store.saveTaskObj = item;
};

const handleBlackTask = () => {
  pageData.pageStatus = '任务列表';
  pageData.taskId = null;
  formLabelAlign.taskName = '';
  formLabelAlign.eventTime = '';
  formLabelAlign.locations = '';
  formLabelAlign.eventType = '';
  formLabelAlign.remark = '';
  store.centerPoint = [];
  store.area = [];
};

const handleCreateTask = () => {
  pageData.pageStatus = '创建任务';
  pageData.taskId = null;
  formLabelAlign.taskName = '';
  formLabelAlign.eventTime = '';
  formLabelAlign.locations = '';
  formLabelAlign.eventType = '';
  formLabelAlign.remark = '';
  store.centerPoint = [];
  store.area = [];
};

const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
  pageData.pageSize = val;
  getTask();
};

const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
  pageData.pageNume = val;
  getTask();
};

const FavoriteRef = ref(null);

const getTask = () => {
  getSelectListTask({
    pageSize: pageData.pageSize,
    pageNum: pageData.pageNum,
  }).then((res) => {
    console.log(res.data.data);
    pageData.projectList = res.data.data.list;
    pageData.total = res.data.data.total;
  });
};

const handelSelectTask = (item) => {
  // console.log(item);
  formLabelAlign.taskName = item.taskName;
  formLabelAlign.eventTime = item.eventTime;
  formLabelAlign.locations = item.locations;
  formLabelAlign.eventType = item.eventType;
  formLabelAlign.remark = item.remark;
  store.centerPoint = JSON.parse(item.centerPoint);
  store.area = JSON.parse(item.taskArea);
  pageData.pageStatus = '创建任务';
  pageData.taskId = item.taskId;
};

const createTask = () => {
  postAddTaskInfo({
    ...formLabelAlign,
    fireRange: '123',
    centerPoint: JSON.stringify(store.centerPoint),
    taskArea: JSON.stringify(store.area),
    member: JSON.stringify(pageData.member),
    device: JSON.stringify(pageData.devices),
  }).then((res) => {
    pageData.pageNum = 1;
    // 创建成功提示框
    ElMessage({
      message: '任务创建成功',
      type: 'success',
    });
    getTask();
    handleBlackTask();
  });
};

const editTask = () => {
  postEditTaskInfo({
    ...formLabelAlign,
    fireRange: '123',
    taskId: pageData.taskId,
    centerPoint: JSON.stringify(store.centerPoint),
    taskArea: JSON.stringify(store.area),
    member: JSON.stringify(pageData.member),
    device: JSON.stringify(pageData.devices),
  }).then((res) => {
    pageData.pageNum = 1;
    // 创建成功提示框
    ElMessage({
      message: '任务编辑成功',
      type: 'success',
    });

    getTask();
    handleBlackTask();
  });
};

const store = mainStore();

const formLabelAlign = reactive({
  taskName: '',
  eventTime: '',
  locations: '',
  eventType: '',
  remark: '',
});

const setTaskPosition = () => {
  FavoriteRef.value.drawPolygon();
};

const setCenterMark = () => {
  FavoriteRef.value.drawMark();
};
const pageData = reactive({
  pageSize: 5,
  pageNum: 1,
  total: 0,
  taskId: null,
  pageStatus: '任务列表', // 1创建任务 2任务列表
  eventTypeList: [
    {
      name: '抢险救灾',
      type: 1,
    },
    {
      name: '医疗救护',
      type: 2,
    },
    {
      name: '航空测绘',
      type: 3,
    },
    {
      name: '飞行培训',
      type: 4,
    },
    {
      name: '农林作业',
      type: 5,
    },
    {
      name: '反恐维稳',
      type: 6,
    },
    {
      name: '反恐维稳',
      type: 7,
    },
    {
      name: '国家重大活动飞行',
      type: 8,
    },
    {
      name: '人工影响天气',
      type: 9,
    },
    {
      name: '飞防作业',
      type: 10,
    },
    {
      name: '飞防作业',
      type: 10,
    },
  ],
  projectList: [
    {
      name: '农林作业',
      region: '',
      createTime: '2021-01-01 10:00:00',
      status: '执行中',
    },
    {
      name: '火灾应急',
      region: '',
      createTime: '2021-01-01 10:00:00',
      status: '进行中',
    },
    {
      name: '空中巡查',
      region: '',
      createTime: '2021-01-01 10:00:00',
      status: '已归档',
    },
  ],
  member: [
    {
      name: '张三',
      role: '有人机驾驶员',
    },
  ],
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

  type: 1,
});

onMounted(() => {
  getTask();
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
.back-btn {
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
.pagination-line {
  padding: 10px 4px;
}
.block-btn {
  display: block;
  width: 100%;
}
</style>
