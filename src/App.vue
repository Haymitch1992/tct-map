<script setup lang="ts">
import { ref, reactive, onMounted, shallowRef } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import mapItem2 from './components/map-item-2.vue';
import { ElMessageBox } from 'element-plus';
import barItem from './components/barItem.vue';
import * as _ from 'lodash';
const dialogVisible = ref(false);
const handleClose = () => {
  dialogVisible.value = false;
};
const dialogVisible2 = ref(false);
const handleClose2 = () => {
  dialogVisible2.value = false;
};
const posDivVisble = ref(true);
const handleClose3 = () => {
  posDivVisble.value = false;
};
const pageData = reactive({
  data1: {
    indexName: '平均降雨量',
    rank: '优',
    ratio: 1,
    transferValue: 9.5,
    value: 0.31898001019726985,
    xlabel: '1号线',
    targetKey: 'data1',
    unit: 'number',
    unitCn: 'mm',
    max: 20,
    min: 0,
    fixed: 1,
    data: [],
    original: [],
  },
  lineList: [
    { label: '五棵松' },
    { label: '莲花桥' },
    { label: '达官营' },
    { label: '广安门内' },
    { label: '草桥' },
    { label: '马家堡' },
    { label: '北京南站' },
    { label: '阜成门' },
    { label: '新街口' },
    { label: '和平门' },
    { label: '平安里' },
    { label: '新街口' },
    { label: '大钟寺' },
    { label: '陶然亭' },
    { label: '公主坟' },
    { label: '慈寿寺' },
  ],
});

const buildData = () => {
  let arr1: any = [];

  pageData.lineList.forEach((item: any) => {
    arr1.push({
      xlabel: item.label,
      rank: '优',
      ratio: 1,
      transferValue: 10,
      value: Math.random() * (20 - 4) + 0.1,
    });

    pageData.data1.data = arr1;
    pageData.data1.original = arr1;

    // 通过随机数生成
    // 通过值进行计算
  });
  pageData.data1.data = _.orderBy(
    pageData.data1.data,
    ['transferValue', 'value'],
    ['asc', 'asc']
  );
  // 随机生成中间 矩阵数据
};

onMounted(() => {
  buildData();
});
</script>

<template>
  <div class="view-container">
    <div class="item-title">城市轨道交通线网综合信息监视</div>
    <div class="content">
      <div class="item-map">
        <HelloWorld ref="childComponent" />
      </div>
      <div class="item-control">
        <!--  -->
        <div class="item-2">
          <h2>车站信息</h2>
          <el-descriptions style="padding: 10px;" title="" :column="1" border>
            <!-- <el-descriptions-item label="周边医院"
              >协和医院</el-descriptions-item
            >
            <el-descriptions-item label="周边消防"
              >天坛消防支队</el-descriptions-item
            > -->
            <el-descriptions-item label="周边公安"
              >北京站派出所</el-descriptions-item
            >
            <el-descriptions-item label="周边公交车站"
              >北京站北广场</el-descriptions-item
            >
            <el-descriptions-item label="周边共享单车数量"
              >100个</el-descriptions-item
            >
            <el-descriptions-item label="当前降雨量">0mm</el-descriptions-item>
            <el-descriptions-item label="未来24小时降雨量"
              >20mm</el-descriptions-item
            >
          </el-descriptions>
        </div>
        <div class="item-1">
          <h2>降雨信息</h2>
          <div>
            <bar-item :obj="pageData.data1"></bar-item>
          </div>
          <!-- 降水量分析图  -->
        </div>
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="报警详情"
      width="1200px"
      :before-close="handleClose"
    >
      <el-descriptions title="北新桥站3#道会故障" :column="3" border>
        <el-descriptions-item label="报警名称"
          >北新桥站3#道会故障</el-descriptions-item
        >
        <el-descriptions-item label="类型">道岔故障</el-descriptions-item>
        <el-descriptions-item label="级别">影响行车</el-descriptions-item>
        <el-descriptions-item label="线路" :span="2"
          >机场线</el-descriptions-item
        >
        <el-descriptions-item label="车站">北新桥</el-descriptions-item>
        <el-descriptions-item label="具体位置" :span="2"
          >北新桥</el-descriptions-item
        >
        <el-descriptions-item label="报警时间"
          >2023-08-31 14:42:18</el-descriptions-item
        >
        <el-descriptions-item label="派出所联系方式"
          >010-6220XXXX</el-descriptions-item
        >
        <el-descriptions-item label="消防队联系方式"
          >010-6220XXXX</el-descriptions-item
        >
        <el-descriptions-item label="医院联系方式"
          >010-6220XXXX</el-descriptions-item
        >
      </el-descriptions>
      <p>路径规划</p>
      <map-item-2></map-item-2>
    </el-dialog>
    <el-dialog
      v-model="dialogVisible2"
      title="轨道交通物资"
      width="1200px"
      :before-close="handleClose2"
    >
      <el-descriptions title="北新桥站物资仓库" :column="3" border>
        <el-descriptions-item label="联系人">王某某</el-descriptions-item>
        <el-descriptions-item label="联系方式">138XXXXXXX</el-descriptions-item>
        <el-descriptions-item label="灭火器数量">100个</el-descriptions-item>
        <el-descriptions-item label="抽水泵">2台</el-descriptions-item>
        <el-descriptions-item label="沙袋">10袋</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.view-container {
  width: 1920px;
  height: 1080px;
  background: #000;
  display: grid;
}
.item-title {
  color: #fff;
  font-size: 24px;
  text-align: center;
  line-height: 80px;
  background: url('./assets/top-bg.png') no-repeat 0 0;
  width: 1880px;
  margin: 0 auto;
}
.content {
  padding: 0 20px;
  height: 980px;
  overflow: hidden;
}
.item-map {
  display: inline-block;
  height: 980px;
  width: 1410px;
  border-radius: 4px;
  overflow: hidden;
  vertical-align: top;
  border: 1px solid #3ae3ff;
  box-sizing: border-box;
}
.item-control {
  display: inline-block;
  height: 980px;
  width: 460px;
  margin: 0 0 0 10px;
  vertical-align: top;
  box-sizing: border-box;
}
.item-1 {
  border-radius: 4px;
  border: 1px solid #3ae3ff;
  margin: 0 10px 20px;
  color: #fff;
  background-color: #09204e;
  height: 450px;
}
.item-2 {
  border-radius: 4px;
  border: 1px solid #3ae3ff;
  margin: 0 10px 20px;
  color: #fff;
  background-color: #09204e;
  height: 500px;
  box-sizing: border-box;
}
.item-1 h2 {
  padding: 0 0 0 12px;
  margin: 0;
  color: #fff;
  font-size: 18px;
  line-height: 44px;
  border-bottom: 1px solid #3ae3ff;
}
.item-2 h2 {
  padding: 0 0 0 12px;
  margin: 0;
  color: #fff;
  font-size: 18px;
  line-height: 44px;
  border-bottom: 1px solid #3ae3ff;
}
.data-ul {
  list-style: none;
  padding: 0;
  padding: 0 8px;
  margin: 0;
}
.data-ul li {
  line-height: 46px;
  background-color: #1f386b;
  margin: 6px 0;
  padding: 0 10px;
  font-size: 14px;
  border-radius: 4px;
}
.btn {
  float: right;
  margin-top: 12px;
}
.pos-div {
  width: 300px;
  height: 300px;
  position: absolute;
  right: 4px;
  top: 4px;
  padding: 10px;
  background-color: #09204e;
}
.item-map {
  position: relative;
}
</style>
